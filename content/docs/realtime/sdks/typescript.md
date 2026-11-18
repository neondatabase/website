---
title: TypeScript SDK
subtitle: Seal queries, subscribe from clients, and sync with frameworks
summary: Overview of the Realtime TypeScript SDK modules (backend query sealing, browser client subscriptions, React, TanStack DB, Drizzle and Kysely), with a link to each module's API reference page.
enableTableOfContents: true
updatedOn: '2026-11-18T00:59:49.148Z'
---

<Admonition type="important" title="Upgrading to 0.2.0">
Realtime SDK 0.2.0 uses version 2 of the Realtime protocol. Upgrade `@neon/realtime` and every Realtime adapter you use (`@neon/realtime-react`, `@neon/realtime-tanstack`, `@neon/realtime-drizzle`, `@neon/realtime-kysely`) to 0.2.0 together, since the 0.2.0 adapters require `@neon/realtime` 0.2.0.
</Admonition>

<Admonition type="warning" title="Beta: APIs may change">
  The TypeScript SDK is still evolving. The APIs are subject to change.
</Admonition>

The Realtime SDK is split into modules, one import specifier each. Each module has its own reference page with every export, its signature and its members.

## Backend

[Backend](/docs/realtime/sdks/typescript/backend) (`@neon/realtime/server`) runs on your server. [`createRealtime()`](/docs/realtime/sdks/typescript/backend#backend-createrealtime) returns a [`RealtimeServer`](/docs/realtime/sdks/typescript/backend#backend-realtimeserver) that [seals queries](/docs/realtime/guides/queries#sealing-queries), or a [`RealtimeDirectServer`](/docs/realtime/sdks/typescript/backend#backend-realtimedirectserver) that subscribes from trusted backend code.

## Client

[Client](/docs/realtime/sdks/typescript/client) (`@neon/realtime/client`) runs in the browser and React Native. [`createRealtimeClient()`](/docs/realtime/sdks/typescript/client#client-createrealtimeclient) returns a [`RealtimeClient`](/docs/realtime/sdks/typescript/client#client-realtimeclient) that subscribes to sealed queries and materializes their results.

## React

[React](/docs/realtime/sdks/typescript/react) (`@neon/realtime-react`) provides [`RealtimeProvider`](/docs/realtime/sdks/typescript/react#react-realtimeprovider) and the [`useLiveQuery`](/docs/realtime/sdks/typescript/react#react-uselivequery) and [`useRealtimeClient`](/docs/realtime/sdks/typescript/react#react-userealtimeclient) hooks.

## TanStack DB

[TanStack DB](/docs/realtime/sdks/typescript/tanstack-db) (`@neon/realtime-tanstack`) provides [`realtimeCollectionOptions`](/docs/realtime/sdks/typescript/tanstack-db#tanstack-db-realtimecollectionoptions) to create a [TanStack DB collection](https://tanstack.com/db/latest/docs/overview#defining-collections) from a sealed query.

## Drizzle

[Drizzle](/docs/realtime/sdks/typescript/drizzle) (`@neon/realtime-drizzle`) provides [`drizzleAdapter()`](/docs/realtime/sdks/typescript/drizzle#drizzle-drizzleadapter), a [live query adapter](/docs/realtime/guides/queries#using-a-query-builder-or-orm) for sealing Drizzle selects on your server.

## Drizzle client

[Drizzle client](/docs/realtime/sdks/typescript/drizzle-client) (`@neon/realtime-drizzle/client`) provides [`drizzleParsers`](/docs/realtime/sdks/typescript/drizzle-client#drizzle-client-drizzleparsers), which decode dates and timestamps in the browser the way Drizzle does.

## Kysely

[Kysely](/docs/realtime/sdks/typescript/kysely) (`@neon/realtime-kysely`) provides [`kyselyAdapter()`](/docs/realtime/sdks/typescript/kysely#kysely-kyselyadapter), a [live query adapter](/docs/realtime/guides/queries#using-a-query-builder-or-orm) for sealing Kysely selects on your server.
