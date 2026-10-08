---
title: 'Defining queries'
subtitle: 'Define live SQL queries that you can subscribe to.'
summary: >-
  Define live queries in your backend with raw SQL or Drizzle, fill in their parameters from the authenticated request, and seal them so clients can subscribe without being able to read or change them.
enableTableOfContents: true
---

Realtime works by defining and [subscribing](./subscribing) to live SQL queries. Queries are designed to be [defined&nbsp;securely](#defining-live-queries) in your backend code and [subscribed&#8209;to&nbsp;safely](#exposing-queries) in your frontend.

Define live queries using [raw SQL](#using-raw-sql) or a [query builder or ORM](#using-a-query-builder-or-orm). [Seal the queries](#sealing-queries) and [expose](#exposing-queries) them to your frontend via an [API&nbsp;endpoint](#exposing-an-endpoint) or a [server&nbsp;function](#using-server-functions), using your normal [authorization](#authorization) context.

## Setup

Make sure you've [enabled Realtime](../quickstart#enable-realtime).

The guides all share one running example: a chat app where users read the messages in the channels they belong to. You can see the [source code in the examples repo](https://github.com/neondatabase/examples/tree/main/realtime/realtime-guides-chat-app) or expand the steps below.

<details>
  <summary>Expand the setup steps</summary>

Install [Drizzle](https://orm.drizzle.team), [Hono](https://hono.dev), `ws`, and `jose` to validate [Neon Auth](/docs/auth/overview) tokens:

```bash filename="Terminal"
npm install drizzle-orm hono jose ws
npm install -D @types/ws
```

Install the Realtime [TypeScript&nbsp;SDK](../sdks/typescript) and its [Drizzle&nbsp;adapter](../sdks/typescript#drizzle). Plus we'll also use the [Neon&nbsp;serverless&nbsp;driver](/docs/serverless/serverless-driver) to write data to Postgres:

```bash filename="Terminal"
npm install @neon/realtime @neon/realtime-drizzle
npm install @neondatabase/serverless
```

Install [Neon Auth](/docs/auth/overview)'s client for the frontend:

```bash filename="Terminal"
npm install @neondatabase/auth
```

Set these environment variables on the server:

- `DATABASE_URL`: your Lakebase Postgres [connection string](/docs/connect/connect-intro)
- `NEON_REALTIME_SECRET`: the secret from the [Realtime page](../quickstart#enable-realtime) in the Neon Console
- `NEON_AUTH_BASE_URL`: your [Neon Auth](/docs/auth/overview) URL
- `NEON_REALTIME_URL`: the URL from the same Realtime page

And these in the frontend, with the same values as `NEON_AUTH_BASE_URL` and `NEON_REALTIME_URL`:

- `VITE_NEON_AUTH_URL`
- `VITE_NEON_REALTIME_URL`

Define the example schema and apply your usual [Drizzle migrations](/docs/guides/drizzle-migrations):

```ts filename="backend/schema.ts"
import { integer, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const messages = pgTable(
  "messages", {
    id: uuid("id").primaryKey(),
    channel_id: integer("channel_id").notNull(),
    author_id: text("author_id").notNull(),
    body: text("body").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  }
)

export const channelMembers = pgTable(
  "channel_members", {
    channel_id: integer("channel_id").notNull(),
    user_id: text("user_id").notNull()
  },
  (table) => [primaryKey({ columns: [table.channel_id, table.user_id] })]
)

export type Message = typeof messages.$inferSelect
```

Configure your Drizzle client (`db`):

```ts filename="backend/db.ts"
import { drizzle } from "drizzle-orm/neon-serverless"
import { Pool, neonConfig } from "@neondatabase/serverless"
import ws from "ws"
import * as schema from "./schema"

// Node.js versions older than v22 need a WebSocket constructor
neonConfig.webSocketConstructor = ws

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
export const db = drizzle(pool, { schema })
```

Great, that's the setup needed to follow along with the guides.

</details>

## Defining live queries

Neon Realtime supports any **deterministic SQL query** that is [supported by Postgres](/postgresql/tutorial/select).

This includes [where clauses](/postgresql/tutorial/where), [order by](/postgresql/tutorial/order-by) and [limit](/postgresql/tutorial/limit), [joins](/postgresql/tutorial/joins), aggregates, [group by](/postgresql/tutorial/group-by) and distinct, functions (built-in and user-defined), extensions, window functions, [sub-queries](/postgresql/tutorial/subquery), etc.

The only limitations are that:

1. queries must be **read-only**, i.e.: must not have side effects
2. any functions used in your queries must be **deterministic**

So, for example, you can't `SELECT` over updated rows and you can't use functions like `now()` or `gen_random_uuid()`.

### Table requirements

Tables need a [stable replica identity](https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-REPLICA-IDENTITY). If your tables have a primary key, they're fine.

Live queries are faster (saves the engine a lookup when handling updates and deletes) if you set `REPLICA IDENTITY FULL`.

```sql
ALTER TABLE messages REPLICA IDENTITY FULL;
```

### Using raw SQL

Create a `RealtimeServer` instance (`secret` is the `NEON_REALTIME_SECRET` generated when [enabling Realtime](../quickstart#enable-realtime) and `db` should be the `dbname` in your [Postgres connection string](/docs/connect/connect-from-any-app#get-a-connection-string-from-the-neon-console)):

```ts filename="backend/realtime-raw.ts"
import { createRealtime } from "@neon/realtime/server"

export const realtime = createRealtime({
  secret: process.env.NEON_REALTIME_SECRET!,
  db: "neondb"
})
```

`createRealtime()` also takes a [`debugMode`](./subscribing#show-full-database-errors) option.

Then define queries using [`rawSql`](../sdks/typescript#backend-rawsql). For example:

```ts filename="backend/queries-raw.ts"
import { rawSql } from "@neon/realtime/server"

import type { Message } from "./schema"

export const allMessages = rawSql<Message>(
  `SELECT author_id, body, channel_id, created_at, id FROM messages`
)
```

A raw SQL query has to be a single `SELECT` statement with no `;`. With at most 32&nbsp;KiB of SQL and at most 256 parameters of up to 16&nbsp;KiB each.

#### Query parameters

When your query has parameters, wrap it in a function so they can be provided when using it. Put placeholders (like `$1`, `$2`, etc.) in the SQL and pass the values in the array.

For example:

```ts filename="backend/queries-raw.ts"
import { rawSql } from "@neon/realtime/server"

import type { Message } from "./schema"

export function messagesQuery(userId: string, channelId: number) {
  return rawSql<Message>(
    `SELECT messages.author_id, messages.body, messages.channel_id,
       messages.created_at, messages.id FROM messages
     INNER JOIN channel_members ON channel_members.channel_id = messages.channel_id
     WHERE channel_members.user_id = $1 AND messages.channel_id = $2
     ORDER BY messages.created_at DESC
     LIMIT 50`,
    [userId, channelId]
  )
}
```

<Admonition type="warning" title="SQL injection">
Never use literal interpolation for user input like `` `WHERE user_id = '${userId}'` ``. Always use placeholders like `` `WHERE user_id = $1` `` instead.
</Admonition>

#### Parameter types

You can pass strings, numbers, booleans, bigints and `null` as they are. Other value types need a [`pgParam`](../sdks/typescript#backend-pgparam) helper to specify the Postgres type. A `Date` could be a `date`, a `timestamp` or a `timestamptz`, so wrap it in `pgParam.date()`, `pgParam.timestamp()` or `pgParam.timestamptz()`.

For example, this filters messages `since` a [timestamp with timezone](/postgresql/tutorial/timestamp#introduction-to-postgresql-timestamp):

```ts filename="backend/recent-messages.ts" {5,10,13}
import { pgParam, rawSql } from "@neon/realtime/server"

import type { Message } from "./schema"

export function messagesSinceQuery(userId: string, channelId: number, since: Date) {
  return rawSql<Message>(
    `SELECT messages.author_id, messages.body, messages.channel_id,
       messages.created_at, messages.id FROM messages
     INNER JOIN channel_members ON channel_members.channel_id = messages.channel_id
     WHERE channel_members.user_id = $1 AND messages.channel_id = $2 AND messages.created_at > $3
     ORDER BY messages.created_at DESC
     LIMIT 50`,
    [userId, channelId, pgParam.timestamptz(since)]
  )
}
```

There are helpers for dates, JSON, `bytea` and arrays, such as `pgParam.array("text", ["a"])`. `pgParam.text()` covers any other named type, for example `pgParam.text("uuid", id)`.

### Using a query builder or ORM

Realtime supports an adapter pattern to convert any typed query object to raw SQL. This works by passing an adapter to [`createRealtime`](../sdks/typescript#backend-createrealtime).

The rest of these guides use the Drizzle versions of `backend/realtime.ts` and `backend/queries.ts` below in place of the raw SQL files above.

For example, configure Realtime to use the [`drizzleAdapter`](../sdks/typescript#drizzle-drizzleadapter):

```ts filename="backend/realtime.ts" {2,7}
import { createRealtime } from "@neon/realtime/server"
import { drizzleAdapter } from "@neon/realtime-drizzle"

export const realtime = createRealtime({
  secret: process.env.NEON_REALTIME_SECRET!,
  db: "neondb",
  adapter: drizzleAdapter()
})
```

You can now define queries using Drizzle:

```ts filename="backend/queries.ts"
import { and, desc, eq, getTableColumns } from "drizzle-orm"

import { db } from "./db"
import { channelMembers, messages } from "./schema"

export function messagesQuery(userId: string, channelId: number) {
  return db
    .select(getTableColumns(messages))
    .from(messages)
    .innerJoin(channelMembers, eq(channelMembers.channel_id, messages.channel_id))
    .where(and(eq(channelMembers.user_id, userId), eq(messages.channel_id, channelId)))
    .orderBy(desc(messages.created_at))
    .limit(50)
}
```

See the [Drizzle](../examples/drizzle) and [Kysely](../examples/kysely) examples for more details.

<Admonition type="tip" title="Column name casing">
The Drizzle adapter needs each selected key to match its column name. That's why the schema uses snake_case keys and the join selects `getTableColumns(messages)`.

The [Drizzle example](../examples/drizzle) shows how to alias fields to match the column name.
</Admonition>

## Sealing queries

Once you've defined a query, if you're using it in trusted backend code, you can just [subscribe to it right away](./subscribing#subscribe-in-trusted-backend-code). However, most of the time, you'll want to subscribe to live queries in an untrusted environment, such as a frontend app or agent runtime.

This is where **sealing** comes in. Sealing signs and encrypts the exact query, its parameters and the target database into a short-lived capability (similar to a JWT), so it can be used safely in an untrusted environment.

<Admonition type="warning" title="Keep your Realtime secret on the server">
Anyone with `NEON_REALTIME_SECRET` can seal any query. Treat it like your `DATABASE_URL`, and never ship it in a browser bundle. In a Vite app, that means never giving it a `VITE_` prefix.
</Admonition>

To seal a query you pass your query instance, e.g.:

```ts filename="backend/queries.ts"
const query = messagesQuery(userId, channelId)
```

To the [`seal`](../sdks/typescript#backend-realtimeserverseal) method of the `RealtimeServer` instance you created above:

```ts filename="backend/queries.ts"
const sealedQuery = await realtime.seal({ query })
```

It's local [Web Crypto](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) work with no network call, so it's cheap to run on every request. It returns a [`SealedLiveQuery<Row>`](../sdks/typescript#backend-sealedlivequery), which has three fields:

- `capability`: the encrypted query
- `expiresAt`: when it expires, in Unix milliseconds
- `queryFingerprint`: a stable identity for the exact query

The client can subscribe to a sealed query, but it can't read or change it. Your secret, your SQL and the parameter values bound to it are not readable anywhere in it. The [Live SQL API](../how-it-works#live-sql-api) verifies the capability itself, so subscribing doesn't need a call back to your server.

<Admonition type="important" title="Sealed queries are bearer tokens">
Sealed queries are typically user-specific and sealed per request, where they can bake in parameters like the authenticated user ID.

Anyone holding a sealed query can subscribe to it until it expires. Send it over HTTPS, and keep it out of URLs, logs and persistent browser storage.
</Admonition>

### Renewing sealed queries

Sealed queries are short-lived (currently 60 seconds). To keep a subscription running, renew its sealed query before `expiresAt`, or the subscription goes `stale` when it expires. The [reactivity bindings](./reactivity) renew for you when you pass them a `refreshQuery` function. The [subscribing guide](./subscribing#renew-the-sealed-query) shows how to renew manually.

A renewal has to be for the **same** query. Different parameter values make a different query, with a different fingerprint. So, for example, to switch channels in the chat app, you would seal the new query and subscribe again.

## Authorization

Once you've sealed a query, you'll want to get it to your frontend to subscribe to.

You do this by [exposing the query](#exposing-queries) from a **request handler** in your backend. So that's where you authenticate the user and decide what they can see.

### Sealing authorized queries

The flow is as follows:

1. read the auth context from the request
1. authorize access using arbitrary business logic (e.g.: your auth middleware)
1. construct the query, passing in any relevant parameters from the auth context (e.g.: filtering or joining on the authenticated `userId`)
1. seal the query so these can't be changed

This allows you to authorize live query subscriptions using existing web auth logic, middleware and frameworks, such as [Neon&nbsp;Auth](/docs/auth/overview).

### Live authorization

In our running example, [`messagesQuery()`](#using-a-query-builder-or-orm) joins through `channel_members` and filters on the `userId`, so it only returns messages from channels the user belongs to:

```ts
.where(and(eq(channelMembers.user_id, userId), eq(messages.channel_id, channelId)))
```

The join is **part of the live query**, so it stays live. If you remove someone from a channel, they'll immediately lose access to its messages.

That's why Realtime authorizes the **query**, not the connection. Your request handler checks who's asking and seals a query that only matches the rows that the user is allowed to see. The authorization is **defined** at request time but it **dynamically adapts** to your data in realtime.

<Admonition type="warning" title="Never trust user input from the client">
Take authorization context from a verified session or token and validate everything else (like `channelId`) that the client sends in the request data.
</Admonition>

### Why not row-level security

Postgres [row-level security](/docs/guides/row-level-security) (RLS) is often slow and becomes a bottleneck. It's also awkward to develop with, because your access rules live in migrations, rather than your application code.

It's simpler and more efficient to reuse the auth logic you already have in your backend.

Many existing apps do use RLS, though. So, while it isn't our recommended approach to auth, we have designed Neon Realtime's architecture to be able to support it and we aim to implement support before GA.

## Exposing queries

There are two main ways to expose a [sealed](#sealing-queries), [authorized](#authorization) query to your frontend:

1. [exposing an endpoint](#exposing-an-endpoint) from your backend API
2. [using server functions](#using-server-functions) (often with [SSR](./ssr))

These are both **request handlers**. They run in a trusted environment in your backend with [auth context available](#sealing-authorized-queries) from the request.

### Exposing an endpoint

Expose the `sealedQuery` from an API endpoint, using any web framework.

Our running example uses [Hono](https://hono.dev) and [Neon Auth](/docs/auth/overview). The client [sends its auth token](./subscribing#fetch-from-an-api-endpoint) in an `Authorization: Bearer` header. The JWT is verified against your [Neon Auth JWKS](/docs/auth/guides/plugins/jwt#verify-a-token) in a `requireUser` helper:

```ts filename="backend/auth.ts"
import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import { createRemoteJWKSet, jwtVerify } from "jose"

const authUrl = process.env.NEON_AUTH_BASE_URL!
const origin = new URL(authUrl).origin
const jwks = createRemoteJWKSet(new URL(`${authUrl}/.well-known/jwks.json`))

async function verifyUserId(token: string): Promise<string | undefined> {
  try {
    const { payload } = await jwtVerify(token, jwks, { issuer: origin, audience: origin })

    return payload.sub
  } catch {
    return undefined
  }
}

export async function getUser(headers: Headers): Promise<{ id: string } | undefined> {
  const header = headers.get("Authorization")
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined
  const userId = token ? await verifyUserId(token) : undefined

  return userId ? { id: userId } : undefined
}

export async function requireUser(c: Context): Promise<{ id: string }> {
  const user = await getUser(c.req.raw.headers)

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }

  return user
}
```

We then use this auth helper in a route to securely build and expose the `sealedQuery`:

```ts filename="backend/server.ts" {20,23}
import { Hono } from "hono"
import { validator } from "hono/validator"

import { requireUser } from "./auth"
import { messagesQuery } from "./queries"
import { realtime } from "./realtime"

const app = new Hono().post(
  "/api/v1/messages/live",
  validator("json", (value, c) => {
    const channelId: unknown = value?.channelId

    if (typeof channelId !== "number" || !Number.isInteger(channelId)) {
      return c.json({ error: "channelId must be an integer" }, 400)
    }

    return { channelId }
  }),
  async (c) => {
    const user = await requireUser(c)
    const { channelId } = c.req.valid("json")

    const query = messagesQuery(user.id, channelId)
    const sealedQuery = await realtime.seal({ query })

    return c.json(sealedQuery)
  }
)

export type AppType = typeof app

export default app
```

The `validator()` middleware checks the JSON body before the handler runs and types it, so the frontend's [`hc` client](./subscribing#fetch-from-an-api-endpoint) knows this endpoint takes `{ channelId: number }`. The handler takes the user's ID from `requireUser()` and the `channelId` from the validated body, builds the query, seals it and returns it as JSON. Chain every route onto `new Hono()` in one expression, because `AppType` only carries the routes chained into it.

`seal()` doesn't depend on request or response types and a sealed query is plain JSON. The [subscribing guide](./subscribing#fetch-from-an-api-endpoint) shows how to fetch it from the client and subscribe to it.

### Using server functions

If you're using a framework that supports [server functions](https://react.dev/reference/rsc/server-functions), you can return the `sealedQuery` from one. For example, with [TanStack Start](../examples/tanstack) you can [create a server function](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions).

The server function uses a [function middleware](https://tanstack.com/start/latest/docs/framework/react/guide/middleware) that sends the Neon Auth token from the browser and checks it on the server with the `getUser()` helper from `backend/auth.ts`:

```ts filename="src/auth-middleware.ts"
import { createMiddleware } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"

import { getUser } from "./backend/auth"
import { authClient } from "./frontend/auth"

export const authMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { data } = await authClient.token()

    return next({ headers: data?.token ? { Authorization: `Bearer ${data.token}` } : {} })
  })
  .server(async ({ next }) => {
    const user = await getUser(getRequest().headers)

    if (!user) {
      throw new Error("Unauthorized")
    }

    return next({ context: { user } })
  })
```

The server function then seals the query for `context.user.id`:

```ts filename="src/server-functions.ts"
import { createServerFn } from "@tanstack/react-start"

import { authMiddleware } from "./auth-middleware"
import { messagesQuery } from "./backend/queries"
import { realtime } from "./backend/realtime"

export const sealMessages = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { channelId: number }) => {
    if (!Number.isInteger(data.channelId)) {
      throw new Error("channelId must be an integer")
    }

    return data
  })
  .handler(({ data, context }) =>
    realtime.seal({ query: messagesQuery(context.user.id, data.channelId) })
  )
```

The browser calls `sealMessages` to get the sealed query, and calls it again to [renew it](#renewing-sealed-queries).

To seal the query while the page renders on the server, see the [Server-side rendering](./ssr) guide and the [Next.js](../examples/nextjs) and [TanStack](../examples/tanstack) examples.

<NeedHelp/>
