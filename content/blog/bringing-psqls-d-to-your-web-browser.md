---
title: Bringing psql’s \d to your web browser
description: Neon’s SQL Editor now supports Postgres’s introspection commands
excerpt: >-
  Different database systems provide different ways to list or describe the
  things they hold. For instance, to find a particular table and column in
  MySQL, you run SHOW TABLES followed by SHOW COLUMNS FROM my_table. In SQLite,
  you do .tables and then .schema my_table. And in Postgr...
date: '2024-04-17T13:42:50'
updatedOn: '2024-04-17T14:04:42'
category: postgres
categories:
  - postgres
authors:
  - george-mackerron
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/bringing-psqls-d-to-your-web-browser/cover.png
  alt: null
isFeatured: false
seo:
  title: Bringing psql's \d to your web browser - Neon
  description: Neon’s SQL Editor now supports Postgres’s introspection commands
  keywords: []
  noindex: false
  ogTitle: Bringing psql's \d to your web browser - Neon
  ogDescription: >-
    Different database systems provide different ways to list or describe the
    things they hold. For instance, to find a particular table and column in
    MySQL, you run SHOW TABLES followed by SHOW COLUMNS FROM my_table. In
    SQLite, you do .tables and then .schema my_table. And in Postgres, the
    commands ared (for describe) followed by d […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/bringing-psqls-d-to-your-web-browser/social.png
source:
  wpId: 5774
  wpSlug: bringing-psqls-d-to-your-web-browser
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/bringing-psqls-d-to-your-web-browser/image-34-1024x576-4e2ca775.png)

Different database systems provide different ways to list or describe the things they hold. For instance, to find a particular table and column in MySQL, you run `SHOW TABLES` followed by `SHOW COLUMNS FROM my_table`. In SQLite, you do `.tables` and then `.schema my_table`. And in Postgres, the commands are `\\d` (for describe) followed by `\\d mytable`.

# \\d wasn’t working

When I got access to my first Neon Postgres database, almost the first thing I did was go to the web-based SQL Editor and type `\\d`. I was a little sad when the response I got back was: `ERROR: syntax error at or near "\\" (SQLSTATE 42601)`.

It turns out that `\\d`, `\\l`, and their relatives are a psql feature. That is, these introspection commands are found in [the C code that implements the psql client](https://github.com/postgres/postgres/blob/master/src/bin/psql/describe.c), not the C code that implements the Postgres server. Each time you issue one of these commands in psql, you’re running a little local routine that constructs one or more SQL queries, sends them to execute on the server one by one, and stitches the results together into a nice little table.

> You may already know that you can see those underlying SQL queries by running psql with the [`-E` or `--echo-hidden` option](https://www.postgresql.org/docs/devel/app-psql.html#APP-PSQL-OPTION-ECHO-HIDDEN).`\\d` issues only one query, but try `\\d pg_a*` and you’ll see dozens. This is a useful way to explore some of Postgres’ internals. It was helpful, for example, in putting together the queries [Zapatos](https://jawj.github.io/zapatos/) uses to fetch type information from your database.

Of course, it’s not just `\\d` and `\\l`: there are lots of other useful backslash commands. You can get a brief cheat-sheet with `\\? `, or look up [more details in the Postgres docs](https://www.postgresql.org/docs/current/app-psql.html#APP-PSQL-META-COMMANDS). Some personal favourites are `\\dconfig`, which lists configuration parameter values; `\\du` and `\\dx`, which list users and installed extensions; `\\sf` and `\\sv`, which display the source of functions and views; and `\\h`, which provides a syntax reference for SQL commands.

# \\d **works now**

Fast-forward a year or two. Having put together Neon’s [serverless driver](https://neon.tech/docs/serverless/serverless-driver) — which runs in environments that don’t offer raw TCP connections, such as web browsers — I was tasked to upgrade our web-based SQL Editor to make use of it. This enables interactive sessions and transactions in the SQL Editor, and reduces memory usage on our back-end, amongst other things.

> Easter egg alert! As a as result of this work, if you open your browser’s dev tools in the SQL Editor, you can also run queries there using the currently-connected serverless driver client. The client is a property of the window, named `rawClient`. It’s so named because all parsing has been turned off: it returns the raw Postgres text format for each data type. Try pasting in `rawClient.query('SELECT now()').then(console.log)`, for instance.

While moving the SQL Editor to the serverless driver, I took the opportunity to make a few other tweaks along the way. Probably the one I was most excited to get to work on was supporting the psql backslash commands.

As I mentioned above, these commands are implemented in C. An obvious place to start might thus have been to use [emscripten](https://emscripten.org/) to compile that C to WASM, and I did begin by looking at that approach. But I also noticed that much of the code was pretty repetitive: lots of basic string manipulation to assemble SQL queries, and some simple logic to interpret what came back. So I wondered if we needed to actually compile the C, or whether we couldn’t instead directly translate the C to JavaScript.

That second approach — translating C to JavaScript — was the approach I ended up taking:

- I turned C syntax into JS syntax using a bunch of RegExp search-and-replace. For example, I replaced `int x` with `let x`; concatenated consecutive strings (`"a" "b"` becomes `"ab”`); turned the `->` arrow operator into `. `; and so on. (I felt a little bit dirty doing this with RegExps, and I did briefly look at using a C parser and transforming the AST instead … but RegExps were **so** much quicker).
- I reimplemented some C and Postgres functions. That includes dead simple ones like `function atoi(str) \{ return parseInt(str, 10); \}` or `function pg_tolower(ch) \{ return ch.toLowerCase(); \}`, and also some slightly more complex ones, like a minimal `sprintf` function, or the psql code to pretty-print a table.
- Last, I wrote down [examples of all the different psql introspection commands](https://github.com/neondatabase/psql-describe/blob/main/test/tests.txt), and a test script that compares their results in psql to the results generated by my code. I then went through these, one by one, until every last one matched. Almost all the required fixes were in places the original C code was doing something with pointers — pointer arithmetic, pointer dereferencing, and so on — without any direct JavaScript equivalent. It didn’t take too long this way to get a JavaScript implementation up and running. You can use it right now in the SQL Editor in the Neon console. You can also [see the code on GitHub](https://github.com/neondatabase/psql-describe), and do whatever you like with it (within the Postgres license terms) from there.

> Easter egg alert! When running backslash-commands in the SQL Editor on a machine with a keyboard, hold the Shift key as you click ‘Run’ to see the underlying SQL commands interleaved with the output, just like you’d get when running psql with the `-E` or `--echo-hidden` option.

I can’t promise that this is the only or necessarily even the best approach to the problem, and it would of course be nice in the long run to have an automated process to bring updates across from the psql C code. But it works, and I think it’s a good start.

# Significant semicolons

Once I had the introspection commands working from JavaScript, the other challenge in bringing them to the SQL Editor was to pick them out of a line-up of SQL queries.

Neon’s SQL Editor can run several queries at a time, and shows one result tab for each. Previously, we could just send one big opaque SQL string to a server API, and let the server handle splitting it into individual queries. But now, instead, we need to do that splitting client-side, because the introspection commands have to be handled separately.

It’s hopefully obvious why a simple `sql.split(';')` doesn’t work here. It will fail on the following string, for example, which is a single query followed by a comment:

```sql
SELECT ';' /* select a ';' literal */
```

There’s [an emscipten build of the Postgres query parser](https://github.com/pganalyze/pg-query-emscripten). But it currently only supports up to Postgres version 10. And it would kind of be using a sledgehammer to crack a nut, since we don’t need to fully parse each query: we only need to figure out which semicolons we care about and which ones we don’t.

To figure out which semicolons are the significant ones, there are three syntax elements we need to understand: [identifiers, comments, and string literals](https://www.postgresql.org/docs/current/sql-syntax-lexical.html).

- Identifiers are the simplest: they’re always double-quoted, and any (unlikely) double-quotes within them are doubled up.
- Comments are only a little trickier. Single-line comments extend from a double-dash to the end of a line. C-style `/* … */` block comments also exist, and can be nested.
- Strings are the most complex. They can be plain single-quoted, in which case the character-escape behaviour inside them depends on the Postgres server’s `standard_conforming_strings` configuration parameter. Or they can be ‘escape strings’, which have an `e` or `E` before the opening quote. Both these sorts of strings can combine across whitespace (but only if it includes a newline). Or, of course, they can be dollar-quoted strings.

In any case, the upshot is that I wrote [another little open-source package](https://github.com/neondatabase/semicolons) to do only this much parsing. It makes heavy use of [sticky RegExps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky) — a JS parser-writer’s best friend, [as I’ve mentioned elsewhere](https://neon.tech/blog/parsing-json-from-postgres-in-js) — to efficiently locate both comments and statement-terminating semicolons in SQL string.

We also allow backslash commands to be newline-terminated, which is just a small extra step on top of the work done by the package.

This enables us to quickly split your SQL Editor selection into an array of SQL queries and backslash commands. As you may have already noticed, that means we can also now tell you ahead of time how many separate result tabs are going to be presented when you hit the Run button.

If you have any feedback on any of these new features, please [let us know on Discord](https://discord.com/invite/92vNTzKDGp).
