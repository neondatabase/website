---
title: '@neondatabase/serverless hits 1.0.0'
description: Our serverless driver is GA. Connect to Neon over HTTP or WebSockets
excerpt: >-
  Neon’s serverless driver for JavaScript and TypeScript carries SQL queries
  over HTTP and WebSockets. It’s designed for use in environments where raw TCP
  connections aren’t available and/or low connection latencies are important.
  That includes V8 isolate-based serverless functions...
date: '2025-03-25T18:41:48'
updatedOn: '2025-03-25T18:42:05'
category: engineering
categories:
  - engineering
  - company
authors:
  - george-mackerron
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/serverless-driver-ga/cover.jpg
  alt: null
isFeatured: true
seo:
  title: '@neondatabase/serverless hits 1.0.0 - Neon'
  description: >-
    Neon’s serverless driver for JavaScript and TypeScript carries SQL queries
    over HTTP and WebSockets, and it hit 1.0.0 today.
  keywords: []
  noindex: false
  ogTitle: '@neondatabase/serverless hits 1.0.0 - Neon'
  ogDescription: >-
    Neon’s serverless driver for JavaScript and TypeScript carries SQL queries
    over HTTP and WebSockets, and it hit 1.0.0 today.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/serverless-driver-ga/social.jpg
source:
  wpId: 8937
  wpSlug: serverless-driver-ga
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/serverless-driver-ga/neon-serverless-100-1-1024x576-18ab00e5.jpg)

[Neon’s serverless driver](https://github.com/neondatabase/serverless) for JavaScript and TypeScript carries SQL queries over HTTP and WebSockets. It’s designed for use in environments where raw TCP connections aren’t available and/or low connection latencies are important. That includes V8 isolate-based serverless functions and even web browsers.

The driver has been available for several years, but it was still wearing a pre-release 0.x version number. Today we roll over to 1.0.0! So: what’s changed?

## Structure and stability

The first thing that’s changed is the structure of the code. The serverless driver emerged somewhat organically out of initial experiments in using [standalone WebSocket-to-TCP proxies and userspace TLS](https://neon.tech/blog/serverless-driver-for-postgres). The upshot of this was that the repo was rather oddly structured; the bundled TypeScript types (i.e.`.d.ts` files) were generated and maintained by hand; and there were no conventional tests (although there was a bunch of code that exercised various features of the driver). Over time, these things became bit of an impediment to progress, both Neon-developed improvements and perhaps also contributions from outside.

So version 1.0.0 of the driver is published from [a heavily refactored codebase](https://github.com/neondatabase/serverless), which has a more normal and familiar structure; the types are now extracted and bundled up automatically (using Microsoft’s [api-extractor](https://api-extractor.com/)); and there’s a decent set of CI tests to catch any future regressions. That includes testing on Node, Bun, Deno, Firefox, Chrome, Cloudflare Workers and Vercel Functions, and via adapters for the Prisma and Drizzle ORMs.

## Queries over HTTP

The other developments in 1.0.0 all relate to queries carried over HTTP fetch. Two of these are enhancements, and one of these is breaking change we felt it was worth making for the sake of security.

### Tagged-template composability

The main interface for HTTP queries in our driver is a JavaScript tagged-template function, which makes it easy to safely interpolate user-supplied values. It works like this:

```javascript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

// this value might be untrusted e.g. from an API request
const name = "Robert'); DROP TABLE students; --";

// this is safe
const result = await sql`SELECT * FROM students WHERE name = ${name}`;
```

[The reason this is safe](https://neon.tech/blog/sql-template-tags) is that untrusted values are not directly interpolated into the SQL string. Instead, we insert numbered placeholders — `$1`, `$2`, etc. — and the actual values are sent to the server separately.

As of version 1.0.0, one of the things you can now interpolate into your tagged-template SQL queries is … tagged template SQL queries. In other words, queries are now **composable** (just as they already were in libraries such as [postgres.js](https://github.com/porsager/postgres)). This makes it easy to build up queries from smaller component parts. For example:

```javascript
const name = "Robert'); DROP TABLE students; --";
const limit = 10;

const whereClause = sql`WHERE name = ${name}`;
const limitClause = sql`ORDER BY name ASC LIMIT ${limit}`;

const result = await sql`SELECT * FROM students ${whereClause} ${limitClause}`;
```

In order to support this, we’re now _lazy_ in transforming these tagged-template queries into SQL-with-placeholders: we do it only just before we run them. That lets us number the interpolated-value placeholders appropriately even when they’re part of a larger final query.

### Fixing a potential SQL-injection footgun

Now, what’s the difference between these two queries?

```javascript
const resultA = await sql`SELECT * FROM students WHERE name = ${name}`;
const resultB = await sql(`SELECT * FROM students WHERE name = ${name}`);
```

Answer: the first is the same query we showed above. The second has an extra pair of parentheses.

Unfortunately, before version 1.0.0, those innocuous-looking extra parentheses turned this from a safe query into a potentially very bad day: a SQL injection attack. That’s because their effect is to make the query use ordinary JavaScript string interpolation, rather than the safe tagged-template interpolation technique.

As of 1.0.0, the second query is a runtime error (and if you use TypeScript, it’s a type error before you even run the code).

In earlier versions, we had deliberately made it possible to call the tagged-template query function as a conventional function to enable cases where both the query and the values are passed in as variables. In retrospect this was a mistake because, as shown above, it can make dangerous queries look terribly similar to safe ones.

We’ve fixed the mistake and, to fill in the gap this would otherwise open up, there are two new function properties on the tagged-template function: `query` and `unsafe`.

The `query` function works just like the `query` method already found on the `Client` and `Pool` objects (which operate over WebSockets). It lets you pass in both the query — with manually-numbered placeholders — and the values as variables:

```javascript
const q = 'SELECT * FROM students WHERE name = $1';
const result = await sql.query(q, [name]);
```

Second, the `unsafe` function lets you embed raw SQL strings in a tagged-template query, which is OK (and sometimes necessary) if you know you can trust those raw SQL strings. For example:

```javascript
const table = unsafeValueSuppliedByUser;
if (table !== 'students' && table !== 'teachers') throw new Error('Bad table');
const result = await sql`SELECT * FROM ${sql.unsafe(table)} WHERE name = ${name}`;
```

### Performance and compatibility when inserting binary data

Lastly, we made some small improvements when you insert binary data over HTTP, with a query like:

```javascript
const blob = new Uint8Array(1_048_576).fill(128);
const result = await sql`INSERT INTO data (blob) VALUES (${blob})`;
```

Until November, this simply didn’t work (thanks to Andy Young for [finding this bug](https://github.com/neondatabase/serverless/issues/118) and contributing a fix). And it’s still not recommended to insert large amounts of binary data this way: the data gets hex-encoded and JSON-stringified on the client, and JSON-parsed and hex-decoded on the server, which is not exactly efficient. It’s better to use WebSockets, via the `Client` or `Pool` objects, in which case the binary data is sent directly over the wire.

But if you do need to send binary data over an HTTP query, we’ve sped up the hex-encoding step by an order of magnitude or so using `TextDecoder`, `Uint32Array`, and some bit-twiddling. Check out the new [hextreme](https://github.com/jawj/hextreme) JavaScript package for details — and implementations you can use elsewhere.<br />

Stay tuned for future enhancements to our serverless driver. And if you’re new to Neon, you can [sign up today](https://console.neon.tech/) for free.
