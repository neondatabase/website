---
title: 'TypeScript SDK: Drizzle'
subtitle: Seal Drizzle selects as live queries with @neon/realtime-drizzle
summary: Reference for the Realtime Drizzle adapter, @neon/realtime-drizzle, which lets createRealtime seal Drizzle select queries as live queries.
enableTableOfContents: true
updatedOn: '2026-11-18T00:59:49.148Z'
---

Import the Drizzle adapter from `@neon/realtime-drizzle`. It runs on your server: pass `drizzleAdapter()` as the `adapter` option to `createRealtime()`, then seal Drizzle selects like any other query. It's taught in [Using a query builder or ORM](/docs/realtime/guides/queries#using-a-query-builder-or-orm), and the [Drizzle example](/docs/realtime/examples/drizzle) goes further. In the browser, decode Drizzle dates and timestamps with [Drizzle client](/docs/realtime/sdks/typescript/drizzle-client).

## API reference

<RealtimeSdkDrizzle />
