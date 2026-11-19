---
title: 'TypeScript SDK: Kysely'
subtitle: Seal Kysely selects as live queries with @neon/realtime-kysely
summary: Reference for the Realtime Kysely adapter, @neon/realtime-kysely, which lets createRealtime seal Kysely select queries as live queries.
enableTableOfContents: true
updatedOn: '2026-11-18T00:59:49.148Z'
---

Import the Kysely adapter from `@neon/realtime-kysely`. It runs on your server: pass `kyselyAdapter()` as the `adapter` option to `createRealtime()`, then seal Kysely selects like any other query. It's taught in [Using a query builder or ORM](/docs/realtime/guides/queries#using-a-query-builder-or-orm), and the [Kysely example](/docs/realtime/examples/kysely) goes further.

## API reference

<RealtimeSdkKysely />
