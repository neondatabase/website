---
title: Parsing JSON from Postgres in JS? Don’t get the wrong number
description: >-
  Introducing json-custom-numbers: a conformant, performant JavaScript JSON
  library
excerpt: >-
  Back in 2010, my first production Postgres database used a couple of JSON
  columns to provide some flexibility around the main schema. From the point of
  view of the database, those columns were actually just text. But Postgres got
  a native JSON type soon after (with version 9.2 in...
date: '2023-08-24T16:24:56'
updatedOn: '2023-08-25T02:53:59'
category: engineering
categories:
  - engineering
authors:
  - george-mackerron
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/parsing-json-from-postgres-in-js/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Parsing JSON from Postgres in JS? Don't get the wrong number - Neon
  description: >-
    Introducing json-custom-numbers: a conformant, performant JavaScript JSON
    library
  keywords: []
  noindex: false
  ogTitle: Parsing JSON from Postgres in JS? Don't get the wrong number - Neon
  ogDescription: >-
    Introducing json-custom-numbers: a conformant, performant JavaScript JSON
    library
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/parsing-json-from-postgres-in-js/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/parsing-json-from-postgres-in-js/neon-json-custom-numbers-1-1024x576-9fc02c02.jpg)

Back in 2010, my first production Postgres database used a couple of JSON columns to provide some flexibility around the main schema. From the point of view of the database, those columns were actually just `text`. But Postgres got a native JSON type soon after ([with version 9.2](https://paquier.xyz/postgresql-2/postgres-9-2-highlight-json-data-type/) in 2012), and [its JSON support](https://www.postgresql.org/docs/current/datatype-json.html) has become steadily more powerful since then.

As you probably know, you can now use Postgres not just to store and retrieve JSON, but also to build, transform, index and query it. My own TypeScript/Postgres library uses Postgres’s JSON functions [to create and return handy nested structures out of lateral joins](https://jawj.github.io/zapatos/#joins-as-nested-json). This all represents a valuable [hybrid of relational and NoSQL](https://news.ycombinator.com/item?id=28406334) database capabilities.

## Trouble with numbers

JSON, of course, has its origins in JavaScript. But there’s a potential problem when we use JSON to communicate between Postgres and JavaScript.

JavaScript has one kind of number: an [IEEE 754 `float64`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number). Postgres, of course, has many kinds. Some of these, like `bigint` or `numeric`, can represent larger and/or more precise numbers than a `float64`.

JavaScript Postgres drivers typically parse these large or precise values into strings. For example:

```javascript
await { rows } = pool.query('SELECT (1e16 + 1)::bigint AS big');
 // -> [{ big: '10000000000000001' }]
```

That leaves you to choose how to deal with them in your code. In this case, you’d probably pass the stringified Postgres `bigint` value to JavaScript’s [`BigInt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).

Now: what if Postgres were to return that same `bigint` to JavaScript as a JSON value?

The [JSON spec](https://datatracker.ietf.org/doc/html/rfc8259#section-6) “allows implementations to set limits on the range and precision of numbers accepted”, and notes “potential interoperability problems” when numbers larger or more precise than a `float64` are used. But it sets no limits of its own on what can be parsed or serialized. So we can’t really blame Postgres for representing a `bigint` in JSON as an appropriately long sequence of digits. It’s not obvious what else it could be expected to do.

This long JSON number value from Postgres then gets parsed with JavaScript’s `JSON.parse()` and, if it’s bigger than JavaScript’s `Number.MAX_SAFE_INTEGER` (or more negative than `Number.MIN_SAFE_INTEGER`), bad things happen.

```javascript
await { rows } = pool.query('SELECT to_json((1e16 + 1)::bigint) AS big'); 
// -> [{ big: 10000000000000000 }]
```

Compare the last two results above. That’s right: without any warning, the number we got out of the second query is not the same number Postgres sent.

Imagine this was the `id` value of a table row. Well, now it’s the `id` value of a different table row.

_[Sinister music plays]._

## The solution: custom JSON parsing

A solution to this nastiness is to get hold of a custom JSON parser that can handle big numbers, and to tell your Postgres driver to use it. For both [node-postgres](https://node-postgres.com/) and [@neondatabase/serverless](https://www.npmjs.com/package/@neondatabase/serverless), that looks like this:

```javascript
import { types } from '@neondatabase/serverless'; // or from 'pg' 
function myJSONParse(json) { /* implementation */ } 
types.setTypeParser(types.builtins.JSON, myJSONParse); 
types.setTypeParser(types.builtins.JSONB, myJSONParse);
```

(You might have thought that you could use [the `reviver` argument to native `JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#the_reviver_parameter) to avoid implementing a complete JSON parser. Sadly, you can’t: by the time the function you supply as the `reviver` sees a number, it’s already been parsed to a JavaScript `float64`, and the damage has been done).

As I see it, there are three key things we’re going to want from a custom JSON parser:

1. First, conformance: to avoid any surprises or complications, it should be a perfect drop-in replacement for `JSON.parse()`. That means the same API and, critically, the same result for every input (aside from the numbers it handles better).
2. Second, performance: it’s never going to match the optimised C++ of native `JSON.parse()`, but it should be the fastest gosh-darn JavaScript implementation we can come up with. In some common contexts (such as an API that mediates between Postgres and a website or app) it may have **a lot** of data flowing through it, and CPU cycles mean time, electricity and money.
3. And third, flexibility: when it comes across a large number (or indeed any number) in the JSON input, it should give us the chance to deal with it however we want. That could mean using a `BigInt`, a string, or [some other number library](https://blog.logrocket.com/how-to-represent-large-numbers-node-js-app/).

So: we’re looking for a conformant, performant JSON parser that can deal flexibly with large numbers.

Searching npm turns up two candidate packages: [json-bigint](https://www.npmjs.com/package/json-bigint) and [lossless-json](https://www.npmjs.com/package/lossless-json). Are they up to the job?

## Conformance and performance testing

Behaving the same way as `JSON.parse()` means our custom JSON parser should throw errors on the same documents, and return the same parsed results for the rest. So we need a set of well-chosen JSON documents, including all the edge cases we can think of, to test against. Happily, the [JSON Parsing Test Suite](https://github.com/nst/JSONTestSuite/tree/master/test_parsing) has our back here, with hundreds of test files of valid, invalid, and ambiguous (by the spec) JSON.

Assessing performance against `JSON.parse()` will also call for one or more JSON documents we can test against. Exactly what to use here is a judgment call, but certainly we want to benchmark the parsing of a wide range of JSON values.

Here, I’ve plumped for: long strings (such as a blog post or a product description); short strings (such as object keys); strings full of backslash escapes (like `\\u03B1` and `\\n`); long numbers (such as high-resolution latitudes and longitudes); short numbers (such as an id or count); and `true`, `false` and `null`. I’ve combined these values into objects and arrays, so that we also capture speed on the two JSON container types.

For a headline comparison, I’ve then brought all these types together into one large object: `\{ "longStrings": ..., "shortStrings": ..., ... \}`.

The final piece of the puzzle is: how do we run the performance tests? Performance benchmarking JavaScript seems to have gone way out of fashion in recent years. jsperf.com is long since defunct. [benchmark.js](https://github.com/bestiejs/benchmark.js) (which powered it) hasn’t had a commit in five years, and consequently doesn’t even know about `performance.now()`.

I’ve therefore put together a simple head-to-head performance function of my own. It evaluates `performance.now()` timer resolution, estimates how many iterations _N_ of the provided functions are needed to get an accurate reading, and then runs 100 trials of _N_ iterations each. Finally, it plots a simple histogram to compare _operations/second_ in the two cases, and calculates an appropriate statistic (the [Mann-Whitney U](https://en.wikipedia.org/wiki/Mann%E2%80%93Whitney_U_test)) to establish whether the two distributions are significantly different.

### json-bigint

First up: json-bigint. The widgets below tell the full story.

<iframe title="conform-json-bigint" src="https://json-postgres.pages.dev/iframe-json-bigint" style={{"width":"100%","height":"450px"}} />

For conformance, the summary is that json-bigint correctly parses all valid documents, except those that are very deeply nested. Very deeply nested structures overflow the call stack of its recursive implementation.

json-bigint is then significantly more lax in what else it accepts than `JSON.parse()`. It permits numbers in various illegal formats (such as `.1`, `1.`, `01`), isn’t bothered by unescaped newlines or invalid Unicode escapes in strings, and allows all sorts (character codes 0 – 32) as whitespace.

For performance, the headline number is that it’s 6 – 11× slower than `JSON.parse()` on my mixed JSON test document, depending on the browser and wind direction.

Regarding flexibility, json-bigint offers various options, but not the one I really want, which is simply to allow me to supply a custom number-parsing function.

### lossless-json

Next: lossless-json. How does it compare?

<iframe title="conform-lossless-json" src="https://json-postgres.pages.dev/iframe-lossless-json" style={{"width":"100%","height":"450px"}} />

Conformance-wise, lossless-json’s big thing is that it throws errors on duplicate object keys. It calls this a feature and, to be fair, it’s fully in line with its “lossless” branding. But it’s also a definite point of difference from `JSON.parse()`.

Like json-bigint, and for the same reason, lossless-json fails on deeply nested structures. Elsewhere, it’s not as lax as json-bigint, but it’s still a touch more relaxed than `JSON.parse()` on number formats, allowing a leading decimal point with no zero (`.1`).

Regarding performance, lossless-json does a bit better than json-bigint, with a headline factor of 4 – 7× slower than `JSON.parse`.

Finally, lossless-json scores points on flexibility by taking a custom number-parsing function as one of its options.

## Can we do better?

Overall, neither package exactly matches the behaviour of `JSON.parse()`, and neither seems blisteringly quick. Don’t think I’m looking a gift-horse in the mouth here. I’m grateful to the maintainers of both packages for doing the hard work of making useful code and documentation available for free.

But we can do better on all three criteria I set out above: conformance, performance, and flexibility:

- We can, of course, choose to fully match the behaviour of `JSON.parse()`, and to provide wholly customisable number parsing.
- Less obviously, we can also improve performance substantially.

## Presenting: json-custom-numbers

To cut to the chase: [json-custom-numbers](https://www.npmjs.com/package/json-custom-numbers) is a conformant, performant, flexible new custom JSON parser (and stringifier too).

<iframe title="conform-json-custom-numbers" src="https://json-postgres.pages.dev/iframe-json-custom-numbers" style={{"width":"100%","height":"450px"}} />

Today’s take-home message is: if you need custom parsing of numbers in JSON, use [json-custom-numbers](https://www.npmjs.com/package/json-custom-numbers). It is (I believe) a perfect match for the behaviour of native `JSON.parse()`, and it’s usually only 1.5 – 3× slower, which is substantially quicker than the alternatives.

Speed varies according to the JavaScript engine and what you’re parsing, so there are some [more detailed comparisons in the project README](https://github.com/jawj/json-custom-numbers#parse).

To use json-custom-numbers with Neon’s serverless driver (or node-postgres) to parse Postgres `bigint` values as JavaScript `BigInt` values, you can do this:

```javascript
import { types } from '@neondatabase/serverless';  // or from 'pg'
import { parse } from 'json-custom-numbers';

function parseJSONWithBigInts(str) {
  return parse(str, undefined, function (k, str) {
    const n = +str;
    const safe = n >= Number.MIN_SAFE_INTEGER && n <= Number.MAX_SAFE_INTEGER;
    return safe || /[.eE]/.test(str)? n: BigInt(str);
  });
}

types.setTypeParser(types.builtins.JSON, parseJSONWithBigInts);
types.setTypeParser(types.builtins.JSONB, parseJSONWithBigInts);
```

This code sample uses `BigInt` only for integers that don’t fit in an ordinary number value. That means a Postgres `bigint` value can end up as either an ordinary number or a `BigInt`, depending on its size. For sanity, you’ll probably want to ensure that anything that _might_ be a `BigInt` is treated as one, by subsequently manually converting it: `BigInt(bigintValueFromPostgres)`.

This is a fine place to stop reading. Carry on if you’d like me to point out a few things I learned in the process of writing and optimising the library.

## What I learned

### Sticky RegExps rock

Discovery number one is that [‘sticky’ RegExps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky) plus the [RegExp `test()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test) are a parser-writer’s best friend.

A sticky RegExp is one created with the `y` flag. It has a `lastIndex` property. You can set `lastIndex` to the string index where you want your RegExp to begin matching. RegExp methods like `test()` then set `lastIndex` to the index where matching ended.

The json-custom-numbers `parse()` function parses all primitive values (strings, numbers, `true`, `false`, and `null`) using sticky RegExps. This gives a major performance boost compared to the other implementations, which step through string input character-by-character.

### Experiment

It’s an obvious point, but there’s no substitute for running experiments and seeing what’s quicker.

For example, [function inlining is a well-known optimization](https://en.wikipedia.org/wiki/Inline_expansion) applied by language compilers of all stripes, [including JavaScript engines like V8](https://www.mattzeunert.com/2015/08/21/toggling-v8-function-inlining-with-node.html). You might therefore think that manually inlining would have little performance impact. But some empirical testing showed that inlining functions to read the next character and to skip whitespace — which my original recursive parsing code had inherited from [Crockford’s reference implementation](https://github.com/douglascrockford/JSON-js/blob/03157639c7a7cddd2e9f032537f346f1a87c0f6d/json_parse.js) — led to overall performance gains of 10 – 20%.

As another example, I had an idea that switching from processing single-character strings (extracted with `charAt()`) to processing integer character codes (extracted with `charCodeAt()`) might speed things up in some of the places sticky RegExps couldn’t help. Experimentation showed this was true, but the scale of the gains is strongly dependent on the JavaScript engine. The change reduced parsing time by about 10% in Safari (JavaScriptCore), 20% in Chrome (V8), and over 50% in Firefox (SpiderMonkey).

### Code _remembers_

Probably the nastiest and most maddening thing I learned is that JavaScript code has memory! It matters how much your code has been run already. It also matters _what input it’s seen_.

JavaScript engines optimise code progressively, as they discover which functions are ‘hot’ and where the potential optimisation gains might be highest. Optimisation depends heavily on data types and code paths, and code can also be de-optimised if assumptions made by the engine turn out false. I knew this in principle, but I hadn’t thought through the implications for benchmarking.

This issue reared its head when I was trying to optimise `\\uXXXX` (Unicode) escape parsing code. In Safari, every approach I could think of benchmarked worse than what I’d started with, which was essentially the Crockford reference implementation. I was surprised by this.

I eventually resorted to benchmarking Crockford against Crockford — and found that one copy of an identical implementation was significantly slower than the other (_p_ < 0.001). I then realised that my parsing conformance tests involve lots of invalid JSON input, throwing repeated errors in every possible location.

Being exposed to the tests therefore appears to reduce the performance of any particular parsing code. Skipping the prior conformance check (or running it on a different copy of the same code) could turn 20% slower into 10% faster when I then tested performance differences.

You can actually see this effect in action using the conformance/performance widget pairs further up this page. For any pair, you’ll generally find that the performance figure is substantially better if you _haven’t_ tested conformance since page load than if you have.

The good news is that if you’re using json-custom-numbers to parse JSON that’s coming back from Postgres, everything it sees should be valid JSON, and performance will be best-case.

### Writing aids thinking

I didn’t [_plan_ to throw one away](https://course.ccs.neu.edu/cs5500f14/Notes/Prototyping1/planToThrowOneAway.html). But in the end it was writing about the code that led me to do just that.

I thought I’d finished the package, I’d already written most of this post, and I was in the middle of claiming that the json-custom-numbers parser perfectly matches native `JSON.parse()` behaviour. A caveat the occurred to me, and duly wrote a section about how my implementation was recursive, meaning that really-unusually-deeply-nested JSON structures would overflow the call stack.

Seeing it written down, and attempting to justify it, this then seemed kind of lame: if you can see the problem, why not fix it? So I went back and rewrote the parser as [a nice big state machine](https://github.com/jawj/json-custom-numbers/blob/main/test/test_comparison/parseStateMachine.ts) instead. Since this was slightly slower than the recursive implementation had been, I then wrote a slightly faster [final non-recursive implementation](https://github.com/jawj/json-custom-numbers/blob/main/src/parse.ts).

### You can’t natively `stringify` everything you can `parse`

The major JavaScript engines all now have non-recursive `JSON.parse()` implementations. For example, [V8 became non-recursive in 2019](https://v8.dev/blog/v8-release-76).

So I was surprised to discover (after writing non-recursive implementations for both `parse` and `stringify`) that the native `JSON.stringify()` implementations still appear to be recursive. Given a deeply-enough nested structure, `JSON.stringify()` will give you `RangeError: Maximum call stack size exceeded` or `InternalError: too much recursion`.

This means there are values of `n` for which `let deepObj = JSON.parse('['.repeat(n) + ']'.repeat(n))` succeeds, but `let deepJSON = JSON.stringify(deepObj)` then fails. The smallest value of `n` where this happens indicates your JavaScript engine’s call stack size (today, on my laptop, that smallest `n` seems to be 3,375 for Firefox, 3,920 for Chrome, 4,639 for Node, and 40,001 for Safari or Bun).

You might argue that this is a feature, in that it prevents a circular reference leading to an infinite loop. (Circular references are usually detected, but certain `replacer` functions can thwart this: for example, `let obj = \{\}; obj.obj = obj; JSON.stringify(obj)` gets you a complaint about the circular reference, but `JSON.stringify(obj, (k, v) => [v])` on the same object overflows the call stack instead).

Anyway, for json-custom-numbers I decided to keep my non-recursive `stringify` implementation, but also to provide a `maxDepth` option for both `stringify` and `parse`. For `stringify`, `maxDepth` defaults to 50,000 — a bit higher than you get in Safari and Bun — but can be set to anything up to `Infinity`. For `parse`, it defaults to `Infinity`, which matches the native implementations and means you can go as deep as available memory allows.

_The code behind this post is at [https://github.com/jawj/perfcompare/](https://github.com/jawj/perfcompare/)._
