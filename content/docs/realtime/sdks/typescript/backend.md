---
title: 'TypeScript SDK: Backend'
subtitle: Define live queries and seal them on your server with @neon/realtime/server
summary: Reference for the Realtime Backend module, @neon/realtime/server, which creates the Realtime server, seals live queries for untrusted clients and subscribes to queries directly from trusted backend code.
enableTableOfContents: true
updatedOn: '2026-11-18T00:59:49.148Z'
---

Import the Backend module from `@neon/realtime/server`. It runs only on your server, because it uses your Realtime secret. It defines live queries and seals them, so an untrusted client can subscribe to a query without being able to read or change it. It's taught in the [Defining queries](/docs/realtime/guides/queries) guide.

Create the server once, then seal a query:

```ts
import { createRealtime } from "@neon/realtime/server"

const realtime = createRealtime({ secret: process.env.NEON_REALTIME_SECRET!, db: "neondb" })
const sealedQuery = await realtime.seal({ query: messagesQuery(userId, channelId) })
```

`secret` is your `NEON_REALTIME_SECRET`, written by `neon env pull --service realtime` or shown on the Realtime page in the Neon Console. `db` is the database your queries run against. [Setup](/docs/realtime/guides/queries#setup) covers both, and [`RealtimeServerOptions`](#backend-realtimeserveroptions) lists the other options, including [`debugMode`](/docs/realtime/guides/subscribing#show-full-database-errors).

## Direct subscriptions

Add a `url` to `createRealtime()` and it returns a [`RealtimeDirectServer`](#backend-realtimedirectserver), which subscribes to queries itself, for workers, trusted agents and other backend code. [Subscribe in trusted backend code](/docs/realtime/guides/subscribing#subscribe-in-trusted-backend-code) shows how.

## Typed parameters

Most `rawSql` parameter values pass as they are. Wrap dates, JSON, `bytea` and arrays in a [`pgParam`](#backend-pgparam) helper to name their Postgres type, as [Parameter types](/docs/realtime/guides/queries#parameter-types) shows.

## API reference

<RealtimeSdkBackend />
