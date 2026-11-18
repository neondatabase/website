---
title: 'TypeScript SDK: Drizzle'
subtitle: Seal Drizzle selects on your server and decode Drizzle values in the browser
summary: Reference for the Realtime Drizzle packages, @neon/realtime-drizzle, which lets createRealtime seal Drizzle select queries as live queries, and @neon/realtime-drizzle/client, whose drizzleParsers make the Realtime client decode dates and timestamps the way Drizzle does.
enableTableOfContents: true
updatedOn: '2026-11-18T00:59:49.148Z'
---

Drizzle support comes in two entry points, one for your server and one for the browser. Using a query builder or ORM is taught in the [queries guide](/docs/realtime/guides/queries#using-a-query-builder-or-orm), and the [Drizzle example](/docs/realtime/examples/drizzle) shows both entry points in use.

## Server adapter

Import the Drizzle adapter from `@neon/realtime-drizzle`. It runs on your server: pass `drizzleAdapter()` as the `adapter` option to `createRealtime()`, then seal Drizzle selects like any other query.

<RealtimeSdkDrizzle />

## Client parsers

Import `drizzleParsers` from `@neon/realtime-drizzle/client`. It runs in the browser: spread it into the client's `parsers` option so dates and timestamps decode the way Drizzle decodes them.

<RealtimeSdkDrizzleClient />
