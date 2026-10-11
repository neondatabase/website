---
title: 'How it works'
summary: >-
  How Realtime works and how the layers compose and fit together.
titleWidth: '530'
enableTableOfContents: true
---

Realtime is a live SQL query and sync engine, with (optional) higher-level reactivity primitives for client-side development.

```go
----------------    ----------------    -------------------    --------------------
|              |    |              |    |                 |    |                  |
|  (1)         |    |  (2)         |    |  (3)            |    |  (4)             |
|  Postgres    |    |  Live SQL    |    |  Lower level    |    |  Higher level    |
|              |---<|  API         |---<|  client SDKs    |---<|  reactive DX     |
|  [ live   ]  |    |              |    |                 |    |                  |
|  [ query  ]  |    |  [ sync   ]  |    |  `seal()`       |    |  `onUpdate`      |
|  [ engine ]  |    |  [ engine ]  |    |  `subscribe()`  |    |  `useLiveQuery`  |
|              |    |              |    |                 |    |                  |
----------------    ----------------    -------------------    --------------------
```

The layers of the system are composable. You can use the Live SQL API directly, consume it with lower-level client SDKs or code using the higher-level reactivity primitives.

<Steps>

## Postgres

[Enabling Realtime](./quickstart#enable-realtime) installs an incremental live query engine inside Lakebase Postgres.

This consumes logical replication, matches write operations to live queries and streams the changes to the Live SQL API.

## Live SQL API

The [Live SQL API](./reference/api) is a WebSocket API. Clients connect via WebSocket and send [live&nbsp;SQL&nbsp;queries](./guides/queries) to subscribe&nbsp;to.

The API validates the queries and sends them on to the live query engine inside Postgres. It then consumes changes from Postgres (over a single, multiplexed connection) and fans the changes back out to clients over their WebSocket connections.

<Admonition type="warning" title="Beta: don't use the Live SQL API directly (yet)">
The WebSocket sync protocol is still evolving, so don't develop directly against it yet. Instead, use the clients and reactivity primitives provided, which will track any changes to the protocol for you.
</Admonition>

## Lower-level client SDKs

The [TypeScript SDK](./sdks/typescript) allows you to use the Live SQL API by [defining](./guides/queries) and [subscribing](./guides/subscribing) to queries.

Queries are designed to be defined securely in your backend code and subscribed to safely in your frontend. You can define them using [raw SQL](./guides/queries#using-raw-sql):

```ts filename="backend/queries.ts"
import { rawSql } from "@neon/realtime/server"

interface Message {
  id: string;
  body: string;
}

const query = rawSql<Message>(
  "select id, body from messages where author_id = $1",
  [userId]
)
```

Or using your [ORM or query builder](./guides/queries#using-a-query-builder-or-orm), such as [Drizzle](./examples/drizzle) or [Kysely](./examples/kysely):

```ts filename="backend/queries.ts"
import { eq } from "drizzle-orm"

const query =
  db.select()
    .from(messages)
    .where(eq(messages.author_id, userId))
```

Once you've defined queries, you _can_ then subscribe to them [in your backend](./guides/subscribing#subscribe-in-trusted-backend-code):

```ts filename="backend/subscription.ts"
import { createRealtime } from "@neon/realtime/server"

const realtime = createRealtime({
  adapter: drizzleAdapter(),
  secret,
  db: "neondb",
  url: "wss://realtime.neon.tech/..."
})

const subscription = await realtime.subscribe(query)
subscription.onChange(console.log)
```

However, the _main_ pattern is to [seal&nbsp;the&nbsp;query](./guides/queries#sealing-queries) so that you can safely pass it to an agent or frontend app:

```ts filename="backend/queries.ts"
import { createRealtime, type SealedLiveQuery } from "@neon/realtime/server"
import { drizzleAdapter } from "@neon/realtime-drizzle"

const secret = process.env.NEON_REALTIME_SECRET!

const realtime = createRealtime({
  adapter: drizzleAdapter(),
  db: "neondb",
  secret
})

async function sealQuery(userId: string): Promise<SealedLiveQuery<Message>> {
  const query =
    db.select()
      .from(messages)
      .where(eq(messages.author_id, userId))

  // Seal the query
  return realtime.seal({ query })
}
```

[Sealing](./guides/queries#sealing-queries) lets a frontend or agent subscribe to a query that your backend defined, without being able to change the query or its parameters, and without ever holding your Realtime secret. All the client holds is the sealed query, an opaque value that it passes to `subscribe()`. Sealed queries are short-lived, so the client [gets a fresh one](./guides/queries#renewing-sealed-queries) from your backend to keep its subscription going. That's what the `refreshQuery` function in the React example below does.

[Expose the query from an API endpoint](./guides/queries#exposing-an-endpoint), so authorization can be enforced and query parameters (like the `userId` in this example) can be filled in from the request context:

```ts filename="backend/server.ts"
import { Hono } from "hono"

const app = new Hono().post(
  "/api/v1/messages/live",
  async (c) => {
    const user = await requireUser(c)
    const sealedQuery = await sealQuery(userId)

    return c.json(sealedQuery)
  }
)

export type AppType = typeof app
```

Fetch the `sealedQuery` and safely [subscribe to it](./guides/subscribing#subscribe-to-the-sealed-query) in your frontend code:

```ts filename="frontend/app.ts"
import { hc } from "hono/client"
import { createRealtimeClient } from "@neon/realtime/client"
import type { AppType } from "../backend/server"

const server = hc<AppType>(window.location.origin)
const client = createRealtimeClient({ url })

const response = await server.api.v1.messages.live.$post()
const sealedQuery = await response.json()

const subscription = client.subscribe(sealedQuery)
subscription.onChange(console.log)
```

## Higher-level reactive DX

Rather than subscribing manually and wiring the changes into your application state, most apps will use the [higher-level reactivity primitives](./guides/reactivity) that handle this for you.

These bind live query results to component or local application state and allow you to apply [optimistic mutations](./guides/mutations#how-optimistic-mutations-work) with automatic management of optimistic state.

For example, [with a React app](./guides/reactivity#react), you can use [`useLiveQuery`](./guides/reactivity#uselivequery) to bind a live query to your component state and the native [`useOptimistic` hook](./guides/mutations#with-reacts-useoptimistic-hook) to manage optimistic state:

```tsx filename="App.tsx"
import React, { useOptimistic, useTransition } from 'react'

import { useLiveQuery } from "@neon/realtime-react"
import type { SealedLiveQuery } from "@neon/realtime/client"

interface Props {
  sealedQuery: SealedLiveQuery<Message>;
  refreshQuery: () => Promise<SealedLiveQuery<Message>>;
}

export function Messages({ sealedQuery, refreshQuery}: Props) {
  const [ isPending, startTransition ] = useTransition()
  const { data, utils } = useLiveQuery(sealedQuery, { refreshQuery })

  const [ messages, addOptimisticState ] = useOptimistic(
    data ?? [],
    (synced: readonly Message[], { id, changes }: Write) => {
      return synced.map(msg =>
        msg.id === id ? { ...msg, ...changes } : msg
      )
    }
  )

  async function updateMessage(id: string, changes: Partial<Message>) {
    startTransition(async () => {
      addOptimisticState({ id, changes })

      const response = await server.api.v1.messages[":id"].$patch({ param: { id }, json: changes })
      const { txid } = await response.json()

      await utils.awaitTxId(txid)
    })
  }

  return (
    <ul>
      {messages.map((message) => (
        <li key={message.id}>
          <button onClick={ () => updateMessage(message.id, { body: message.body.toUpperCase() }) }>{message.body}</button>
        </li>
      ))}
    </ul>
  )
}
```

See the [reactivity](./guides/reactivity) and [mutations](./guides/mutations) guides and [Next.js](./examples/nextjs) and [TanStack](./examples/tanstack) examples for more on [SSR](./guides/ssr) and more advanced data loading and client-side data management patterns.

</Steps>

## Subscriptions and consistency

A subscription starts with the query's full initial result. After that, changes arrive in batches as transactions commit. Each batch covers one or more committed transactions and is applied all at once, so your rows never show a half-applied write.

A batch carries the IDs of its transactions (txids). [`awaitTxId()`](./guides/mutations#how-optimistic-mutations-work) uses them, along with the server's progress between batches, to know that your write has synced. The subscription reports a [status](./guides/subscribing#listen-for-changes) that you can show in your UI.

## Packages and guides

| Package                         | What it gives you                                       | Guide                                                                                                            |
| ------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `@neon/realtime/server`         | `createRealtime`, `rawSql`, `seal`                      | [Defining queries](./guides/queries)                                                                             |
| `@neon/realtime/client`         | `createRealtimeClient`, `subscribe`, `awaitTxId`        | [Subscribing](./guides/subscribing), [Optimistic mutations](./guides/mutations)                                  |
| `@neon/realtime-drizzle`        | `drizzleAdapter`                                        | [Query builder or ORM](./guides/queries#using-a-query-builder-or-orm), [Drizzle example](./examples/drizzle)     |
| `@neon/realtime-drizzle/client` | `drizzleParsers`                                        | [Drizzle example](./examples/drizzle)                                                                            |
| `@neon/realtime-kysely`         | `kyselyAdapter`                                         | [Query builder or ORM](./guides/queries#using-a-query-builder-or-orm), [Kysely example](./examples/kysely)       |
| `@neon/realtime-react`          | `RealtimeProvider`, `useLiveQuery`, `useRealtimeClient` | [React reactivity](./guides/reactivity#react), [SSR](./guides/ssr)                                               |
| `@neon/realtime-tanstack`       | `realtimeCollectionOptions`                             | [TanStack DB reactivity](./guides/reactivity#tanstack-db), [SSR with TanStack DB](./guides/ssr#with-tanstack-db) |

Start with the [quickstart](./quickstart), then read the guides in this order: [defining queries](./guides/queries), [subscribing](./guides/subscribing), [reactivity](./guides/reactivity), [optimistic mutations](./guides/mutations) and [server-side rendering](./guides/ssr).

<NeedHelp/>
