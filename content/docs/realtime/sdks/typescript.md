---
title: TypeScript SDK
subtitle: Seal queries, subscribe from clients, and sync with frameworks
summary: Overview of the Realtime TypeScript SDK modules (backend query sealing, browser client subscriptions, React, TanStack DB, Drizzle and Kysely), with a link to each module's API reference page.
enableTableOfContents: true
updatedOn: '2026-11-18T00:59:49.148Z'
---

<Admonition type="important" title="Upgrading from 0.1">
Realtime SDK 0.2 and later use version 2 of the Realtime protocol. Upgrade `@neon/realtime` and every Realtime adapter you use (`@neon/realtime-react`, `@neon/realtime-tanstack`, `@neon/realtime-drizzle`, `@neon/realtime-kysely`) to their latest versions together, since current adapters require `@neon/realtime` 0.2 or later.
</Admonition>

<Admonition type="warning" title="Beta: APIs may change">
  The TypeScript SDK is still evolving. The APIs are subject to change.
</Admonition>

The Realtime SDK is split into modules, one import specifier each. Each section below summarizes a module and links to its API reference page, which lists every export with its signature and members.

## Backend

`@neon/realtime/server` runs on your server. [`createRealtime()`](/docs/realtime/sdks/typescript/backend#backend-createrealtime) returns a [`RealtimeServer`](/docs/realtime/sdks/typescript/backend#backend-realtimeserver) that [seals queries](/docs/realtime/guides/queries#sealing-queries), or a [`RealtimeDirectServer`](/docs/realtime/sdks/typescript/backend#backend-realtimedirectserver) that subscribes from trusted backend code.

[Backend API reference →](/docs/realtime/sdks/typescript/backend)

## Client

`@neon/realtime/client` runs in the browser and React Native. [`createRealtimeClient()`](/docs/realtime/sdks/typescript/client#client-createrealtimeclient) returns a [`RealtimeClient`](/docs/realtime/sdks/typescript/client#client-realtimeclient) that subscribes to sealed queries and materializes their results.

[Client API reference →](/docs/realtime/sdks/typescript/client)

## React

`@neon/realtime-react` provides [`RealtimeProvider`](/docs/realtime/sdks/typescript/react#react-realtimeprovider) and the [`useLiveQuery`](/docs/realtime/sdks/typescript/react#react-uselivequery) and [`useRealtimeClient`](/docs/realtime/sdks/typescript/react#react-userealtimeclient) hooks.

[React API reference →](/docs/realtime/sdks/typescript/react)

## TanStack DB

`@neon/realtime-tanstack` provides [`realtimeCollectionOptions`](/docs/realtime/sdks/typescript/tanstack-db#tanstack-db-realtimecollectionoptions) to create a [TanStack DB collection](https://tanstack.com/db/latest/docs/overview#defining-collections) from a sealed query.

[TanStack DB API reference →](/docs/realtime/sdks/typescript/tanstack-db)

## Drizzle

`@neon/realtime-drizzle` provides [`drizzleAdapter()`](/docs/realtime/sdks/typescript/drizzle#drizzle-drizzleadapter), a [live query adapter](/docs/realtime/guides/queries#using-a-query-builder-or-orm) for sealing Drizzle selects on your server. In the browser, `@neon/realtime-drizzle/client` provides [`drizzleParsers`](/docs/realtime/sdks/typescript/drizzle#drizzle-client-drizzleparsers), which decode dates and timestamps the way Drizzle does.

[Drizzle API reference →](/docs/realtime/sdks/typescript/drizzle)

## Kysely

`@neon/realtime-kysely` provides [`kyselyAdapter()`](/docs/realtime/sdks/typescript/kysely#kysely-kyselyadapter), a [live query adapter](/docs/realtime/guides/queries#using-a-query-builder-or-orm) for sealing Kysely selects on your server.

[Kysely API reference →](/docs/realtime/sdks/typescript/kysely)
