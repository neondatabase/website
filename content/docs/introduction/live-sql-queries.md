---
title: 'Live SQL queries'
subtitle: 'Subscribe to data in realtime with live SQL queries.'
summary: >-
  A live SQL query is a query you subscribe to instead of running once. Realtime makes any SQL query live on standard Postgres, including joins, aggregates, functions and extensions.
enableTableOfContents: true
---

A live SQL query is a query you subscribe to, instead of running it once. You get the current results straight away, then the changes as writes land, so your app always has the latest answer without polling.

[Realtime](/docs/realtime/overview) makes any SQL query live on standard Lakebase Postgres. That includes joins, aggregates, functions and extensions, at high throughput, with no second database or bespoke sync system to run.

## Seal and subscribe

Define the query in your backend and seal it. A sealed query is a short-lived capability for one exact query, so you can pass it safely to a browser or an agent:

```ts filename="your-server.ts"
import { createRealtime, rawSql } from "@neon/realtime/server"

const realtime = createRealtime({
  secret: process.env.NEON_REALTIME_SECRET!,
  db: "neondb"
})

// Any SQL query, including joins, aggregates, functions and extensions
const query = rawSql("select id, body from messages where channel_id = $1", [channelId])
const sealedQuery = await realtime.seal({ query })
```

Then subscribe to the sealed query from the client:

```ts filename="your-client.ts"
import { createRealtimeClient } from "@neon/realtime/client"

const client = createRealtimeClient({ url: "wss://realtime.neon.tech/..." })

const subscription = client.subscribe(sealedQuery)
subscription.onChange(({ data, status }) => {
  console.log(status, data)
})
```

Layer on [reactive client primitives](/docs/introduction/reactivity), like type-safe live queries and optimistic mutations, to build fast, reactive apps directly on Lakebase Postgres.

## Next steps

- [Realtime overview](/docs/realtime/overview): what Realtime is and how to get started
- [Quickstart](/docs/realtime/quickstart): enable Realtime and run your first live queries
- [Defining queries](/docs/realtime/guides/queries): define and seal live queries in your backend
- [Subscribing to queries](/docs/realtime/guides/subscribing): subscribe to sealed queries from your app or agent
- [Live SQL API](/docs/realtime/reference/api): the API that serves live queries to clients
