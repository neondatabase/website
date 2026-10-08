---
title: TypeScript SDK
subtitle: Seal queries, subscribe from clients, and sync with frameworks
summary: Reference for the Realtime TypeScript SDK, covering backend query sealing, low-level client subscriptions, React integration, and TanStack DB adapter.
enableTableOfContents: true
---

The Realtime SDK is split into modules:

- [Backend](#backend) provides a [`RealtimeServer`](#backend-realtimeserver) that [seals queries](../guides/queries#sealing-queries)
- [Client](#client) provides a [`RealtimeClient`](#client-realtimeclient) that subscribes to live queries and materializes results
- [React](#react) provides a [`RealtimeProvider`](#react-realtimeprovider) and the [`useLiveQuery`](#react-uselivequery) and [`useRealtimeClient`](#react-userealtimeclient) hooks
- [TanStack DB](#tanstack-db) provides [`realtimeCollectionOptions`](#tanstack-db-realtimecollectionoptions) to create a [TanStack DB collection](https://tanstack.com/db/latest/docs/overview#defining-collections)
- [Drizzle](#drizzle) and [Kysely](#kysely) provide [live query adapters](../guides/queries#using-a-query-builder-or-orm)

<Admonition type="warning" title="Beta: APIs may change">
  The TypeScript SDK is still evolving. The APIs are subject to change.
</Admonition>

## Backend

Import the Backend module from `@neon/realtime/server`. It runs only on your server, because it uses your Realtime secret. It defines live queries and seals them, so an untrusted client can subscribe to a query without being able to read or change it. It's taught in the [Defining queries](../guides/queries) guide.

Create the server once, then seal a query:

```ts
import { createRealtime } from "@neon/realtime/server"

const realtime = createRealtime({ secret: process.env.NEON_REALTIME_SECRET!, db: "neondb" })
const sealedQuery = await realtime.seal({ query: messagesQuery(userId, channelId) })
```

`secret` is the secret from the Realtime page in the Neon Console, and `db` is the database your queries run against. [Setup](../guides/queries#setup) covers both, and [`RealtimeServerOptions`](#backend-realtimeserveroptions) lists the other options, including [`debugMode`](../guides/subscribing#show-full-database-errors).

### Direct subscriptions

Add a `url` to `createRealtime()` and it returns a [`RealtimeDirectServer`](#backend-realtimedirectserver), which subscribes to queries itself, for workers, trusted agents and other backend code. [Subscribe in trusted backend code](../guides/subscribing#subscribe-in-trusted-backend-code) shows how.

### Typed parameters

Most `rawSql` parameter values pass as they are. Wrap dates, JSON, `bytea` and arrays in a [`pgParam`](#backend-pgparam) helper to name their Postgres type, as [Parameter types](../guides/queries#parameter-types) shows.

<RealtimeSdkBackend />

## Client

Import the Client module from `@neon/realtime/client`. It runs in the browser, where it subscribes to sealed queries over one shared WebSocket and keeps their results up to date. It's taught in the [Subscribing to queries](../guides/subscribing) guide.

Create one client for your app, then subscribe to a sealed query from your backend:

```ts
import { createRealtimeClient } from "@neon/realtime/client"

const client = createRealtimeClient({ url: import.meta.env.VITE_NEON_REALTIME_URL })
const subscription = client.subscribe(sealedQuery)
subscription.onChange(({ data, status }) => render(data, status))
```

Pass a `logLevel` to see what the client is doing, as [Log client diagnostics](../guides/subscribing#log-client-diagnostics) shows.

### Renewing sealed queries

Most apps pass a `refreshQuery` function to the [React or TanStack DB bindings](../guides/reactivity), which renew for them. To renew a subscription yourself, see [Renew the sealed query](../guides/subscribing#renew-the-sealed-query). Integration authors can build on [`QueryRefreshController`](#client-queryrefreshcontroller).

<RealtimeSdkClient />

## React

Import the React bindings from `@neon/realtime-react`. They run in your React frontend: [`RealtimeProvider`](#react-realtimeprovider) shares one client, [`useLiveQuery`](#react-uselivequery) subscribes a component to a sealed query, and [`useRealtimeClient`](#react-userealtimeclient) returns the shared client. They're taught in the [React section](../guides/reactivity#react) of the reactivity guide.

<RealtimeSdkReact />

## TanStack DB

Import the TanStack DB adapter from `@neon/realtime-tanstack`. It runs in the browser, where [`realtimeCollectionOptions`](#tanstack-db-realtimecollectionoptions) turns a sealed query into a TanStack DB collection. It's taught in the [TanStack DB section](../guides/reactivity#tanstack-db) of the reactivity guide. The mutations guide covers [optimistic writes](../guides/mutations#with-tanstack-db-collections), and the SSR guide covers [hydration](../guides/ssr#with-tanstack-db).

<RealtimeSdkTanstackDb />

## Drizzle

Import the Drizzle adapter from `@neon/realtime-drizzle`. It runs on your server: pass `drizzleAdapter()` as the `adapter` option to `createRealtime()`, then seal Drizzle selects like any other query. It's taught in [Using a query builder or ORM](../guides/queries#using-a-query-builder-or-orm), and the [Drizzle example](../examples/drizzle) goes further.

<RealtimeSdkDrizzle />

### Drizzle client

Import `drizzleParsers` from `@neon/realtime-drizzle/client`. It runs in the browser: spread it into the client's `parsers` option so dates and timestamps decode the way Drizzle decodes them. The [Drizzle example](../examples/drizzle) shows it in use.

<RealtimeSdkDrizzleClient />

## Kysely

Import the Kysely adapter from `@neon/realtime-kysely`. It runs on your server: pass `kyselyAdapter()` as the `adapter` option to `createRealtime()`, then seal Kysely selects like any other query. It's taught in [Using a query builder or ORM](../guides/queries#using-a-query-builder-or-orm), and the [Kysely example](../examples/kysely) goes further.

<RealtimeSdkKysely />
