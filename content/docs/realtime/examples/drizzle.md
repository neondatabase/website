---
title: 'Drizzle example'
subtitle: 'Using Realtime with your Drizzle schema, queries, types and writes.'
summary: >-
  Use Drizzle ORM with Neon Realtime: add the Drizzle adapter, seal Drizzle selects with parameters and aliases, decode rows with drizzleParsers and return the txid from Drizzle writes.
enableTableOfContents: true
isDraft: true
---

This page shows how to build a Realtime app with [Drizzle ORM](https://orm.drizzle.team), so the schema and queries you already have become live queries.

You'll learn which Drizzle queries seal unchanged, when a field needs an SQL alias, how live rows keep Drizzle's types in the browser, and how a Drizzle write returns its transaction ID.

The snippets use the `messages` and `channel_members` tables from the [guides](../guides/queries#setup), and the steps follow the order you'd build in: [the packages](#install-the-packages), [the Realtime server with the Drizzle adapter](#create-the-realtime-server-with-the-drizzle-adapter), [the schema](#define-the-schema), [the Drizzle client](#create-the-drizzle-client), [live queries](#define-live-queries), [query parameters](#pass-query-parameters), [aliases](#alias-renamed-and-computed-fields), [rows in the browser](#decode-and-type-rows-in-the-browser) and [writes](#return-the-txid-from-drizzle-writes). It ends with [common pitfalls](#common-pitfalls).

<Admonition type="tip" title="Full examples on GitHub">
These apps in the `neondatabase/examples` repository use Drizzle with Realtime. Each README has the steps to run it:

- [`realtime/guides-chat-app`](https://github.com/neondatabase/examples/tree/main/realtime/guides-chat-app): the chat app the guides build, with a snake_case schema
- [`realtime/with-react`](https://github.com/neondatabase/examples/tree/main/realtime/with-react): Hono and React, with a minimal Drizzle setup
- [`realtime/with-tanstack`](https://github.com/neondatabase/examples/tree/main/realtime/with-tanstack): TanStack&nbsp;Start, with a camelCase schema and an aliased column

</Admonition>

<Steps>

## Install the packages

Install the Realtime SDK, its Drizzle adapter, Drizzle and a Postgres driver:

```bash filename="Terminal"
npm install @neon/realtime @neon/realtime-drizzle drizzle-orm @neondatabase/serverless ws
npm install -D @types/ws
```

`@neon/realtime-drizzle` has two entry points. The main one exports `drizzleAdapter()` for your server. `@neon/realtime-drizzle/client` exports `drizzleParsers` for the browser and doesn't import Drizzle, so the ORM stays out of your browser bundle.

The queries guide's [setup](../guides/queries#setup) covers the rest: Neon Auth, `neon.ts` and the environment variables. For Drizzle on Neon in general, see [Connect from Drizzle to Neon](/docs/guides/drizzle).

## Create the Realtime server with the Drizzle adapter

Pass `drizzleAdapter()` to [`createRealtime`](../sdks/typescript#backend-createrealtime), so the Realtime server accepts Drizzle queries:

```ts filename="backend/realtime.ts" {2,7}
import { createRealtime } from "@neon/realtime/server"
import { drizzleAdapter } from "@neon/realtime-drizzle"

export const realtime = createRealtime({
  secret: process.env.NEON_REALTIME_SECRET!,
  db: "neondb",
  adapter: drizzleAdapter()
})
```

- [`drizzleAdapter()`](../sdks/typescript#drizzle-drizzleadapter) takes no options. When you seal a Drizzle select, it compiles it to SQL and bind parameters
- `db` is the database name, such as `"neondb"`, not a Drizzle client. Use the database in your `DATABASE_URL`, and keep `NEON_REALTIME_SECRET` [on the server](../guides/queries#sealing-queries)
- the same server still seals [`rawSql`](../guides/queries#using-raw-sql) queries, so you can mix the two. Add `url` and it can [subscribe in trusted backend code](../guides/subscribing#subscribe-in-trusted-backend-code), where `subscribe()` takes a Drizzle query directly

## Define the schema

Your schema stays plain Drizzle, with no Realtime imports or options. The choice that matters is how you name the keys. Snake_case keys, the same as the column names, are the simplest:

```ts filename="backend/schema.ts"
import { integer, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const messages = pgTable("messages", {
  // No default: the client generates the ID, so an optimistic row already has its key
  id: uuid("id").primaryKey(),
  channel_id: integer("channel_id").notNull(),
  author_id: text("author_id").notNull(),
  body: text("body").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
})

export const channelMembers = pgTable(
  "channel_members",
  {
    channel_id: integer("channel_id").notNull(),
    user_id: text("user_id").notNull()
  },
  (table) => [primaryKey({ columns: [table.channel_id, table.user_id] })]
)

export type Message = typeof messages.$inferSelect
```

- the adapter needs every selected key to match the name Postgres returns for it. With snake_case keys, no query needs an alias. For camelCase keys, see [Alias renamed and computed fields](#alias-renamed-and-computed-fields)
- give each table a primary key. That's all Realtime needs from it. See the [table requirements](../guides/queries#table-requirements)
- `Message` is the row type of a select of every `messages` column. You'll use it when you [decode and type rows](#decode-and-type-rows-in-the-browser)

Create the tables with your usual Drizzle workflow. Realtime needs nothing extra from your migrations: no publications, triggers or grants. See [Schema migration with Neon Postgres and Drizzle ORM](/docs/guides/drizzle-migrations).

## Create the Drizzle client

You build live queries with your usual Drizzle `db`, but Realtime never runs them through it: the adapter only compiles them to SQL. `db` still runs your writes and any reads on the server, such as server-rendered rows:

```ts filename="backend/db.ts"
import { drizzle } from "drizzle-orm/neon-serverless"
import { Pool, neonConfig } from "@neondatabase/serverless"
import ws from "ws"
import * as schema from "./schema"

// Node.js versions older than v22 need a WebSocket constructor
neonConfig.webSocketConstructor = ws

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
export const db = drizzle(pool, { schema })

// So an idle connection error, for example when the compute scales to zero, doesn't crash the API
pool.on("error", (error: Error) => console.error(error))
```

- the [`neon-serverless`](/docs/serverless/serverless-driver) driver runs interactive transactions, which [writes](#return-the-txid-from-drizzle-writes) need to read their transaction ID. `drizzle-orm/node-postgres` with a `pg` pool works too. `neon-http` can't, so `db.transaction()` throws with it
- `{ schema }` is only for Drizzle's relational `db.query` API, which [can't be sealed](#common-pitfalls). Live queries use the select builder

## Define live queries

A live query is a Drizzle select that you build but don't await. Wrap it in a function, so each call builds a fresh query for its values:

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

- `select(getTableColumns(messages))` keeps each row flat, with only the `messages` columns. A bare `select()` over a join [doesn't seal](#common-pitfalls)
- the join is the authorization: a user only sees messages in channels they belong to, even as memberships change. See [live authorization](../guides/queries#live-authorization)
- `orderBy` and `limit` work as in any Drizzle query, so the live result is the 50 newest messages
- await the same function to read the rows on the server, for example to server-render the first results. See [return the sealed query and initial results](../guides/ssr#return-the-sealed-query-and-initial-results)

The adapter checks the query's shape when you seal it. The SQL is only checked when a client subscribes, so a query that writes or calls a non-deterministic function such as `now()` seals and then fails to subscribe. See the rules for [defining live queries](../guides/queries#defining-live-queries).

## Pass query parameters

Drizzle has no special syntax for live query parameters: they're the values you pass to the query function. Fill them in on the server from context you trust. Take the user ID from the verified session, validate anything from the request, then seal with `realtime.seal({ query: messagesQuery(user.id, channelId) })`. The queries guide shows this in an [API endpoint](../guides/queries#exposing-an-endpoint) and a [server function](../guides/queries#using-server-functions).

- Drizzle compiles each value to a bind parameter. The sealed query carries the values alongside the SQL, never spliced into it
- each sealed query is for one set of values. To show another channel, the browser fetches a new sealed query. See [changing query parameters](../guides/reactivity#changing-query-parameters) and [renewing sealed queries](../guides/queries#renewing-sealed-queries)

Values you compare with a column go through that column's Drizzle encoder. So unlike [raw SQL parameters](../guides/queries#parameter-types), a `Date` or JSON value needs no `pgParam` wrapper. This Drizzle version of the queries guide's [`messagesSinceQuery`](../guides/queries#parameter-types) passes `since` straight to `gt()`:

```ts filename="backend/recent-messages.ts" {15}
import { and, desc, eq, getTableColumns, gt } from "drizzle-orm"

import { db } from "./db"
import { channelMembers, messages } from "./schema"

export function messagesSinceQuery(userId: string, channelId: number, since: Date) {
  return db
    .select(getTableColumns(messages))
    .from(messages)
    .innerJoin(channelMembers, eq(channelMembers.channel_id, messages.channel_id))
    .where(
      and(
        eq(channelMembers.user_id, userId),
        eq(messages.channel_id, channelId),
        gt(messages.created_at, since)
      )
    )
    .orderBy(desc(messages.created_at))
    .limit(50)
}
```

The `timestamptz` column encodes `since` as an ISO string, and Postgres infers the parameter's type from the SQL.

## Alias renamed and computed fields

Realtime returns rows with the names Postgres gives each result column, not the keys Drizzle maps them to. So `seal()` throws if a selected key doesn't match its result name. Snake_case keys always match. With camelCase keys over snake_case columns, a renamed field needs an SQL alias. Here's `messages` with camelCase keys:

```ts filename="backend/schema.ts"
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey(),
  channelId: integer("channel_id").notNull(),
  authorId: text("author_id").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
})
```

A query over it aliases `createdAt`, the one selected key that differs from its column:

```ts filename="backend/queries.ts" {11}
import { eq, sql } from "drizzle-orm"

import { db } from "./db"
import { messages } from "./schema"

export function userMessagesQuery(userId: string) {
  return db
    .select({
      id: messages.id,
      body: messages.body,
      createdAt: sql<Date>`${messages.createdAt}`.mapWith(messages.createdAt).as("createdAt")
    })
    .from(messages)
    .where(eq(messages.authorId, userId))
}
```

- `id` and `body` match their columns, so they need nothing
- on its own, `createdAt: messages.createdAt` comes back as `created_at`, and `seal()` throws. `` sql<Date>`${messages.createdAt}`.as("createdAt") `` selects `"created_at" as "createdAt"`, and `sql<Date>` keeps the row type a `Date`
- `.mapWith(messages.createdAt)` only matters when Drizzle runs the query, for example when you await it to server-render. It decodes with the column's decoder, so you get a `Date` there too. Live rows don't need it: the Realtime client decodes by Postgres type. See [keep row shapes identical](../guides/ssr#keep-row-shapes-identical)
- only selected keys need to match, so filtering on `authorId` needs no alias

Computed fields, such as aggregates, follow the same rule: alias each one to its key, as in `` messageCount: sql<number>`count(*)::int`.as("messageCount") ``. Cast with `::int` because Postgres returns `count(*)` as `int8`, which [arrives as a string](../guides/subscribing#subscribe-to-the-sealed-query).

## Decode and type rows in the browser

Spread [`drizzleParsers`](../sdks/typescript#drizzle-client-drizzleparsers) into the Realtime client's parsers, so live rows decode the way Drizzle decodes the same columns:

```ts filename="frontend/client.ts"
import { createRealtimeClient } from "@neon/realtime/client"
import { drizzleParsers } from "@neon/realtime-drizzle/client"

export const client = createRealtimeClient({
  url: import.meta.env.VITE_NEON_REALTIME_URL,
  parsers: { ...drizzleParsers }
})
```

The parsers work by Postgres type, so for common column types a live row matches Drizzle's type. The exception is `bigint`, in either mode, which arrives as a string:

| Drizzle column                      | Drizzle's type | Live value with `drizzleParsers` |
| ----------------------------------- | -------------- | -------------------------------- |
| `timestamp({ withTimezone: true })` | `Date`         | `Date`                           |
| `timestamp()`                       | `Date`         | `Date`, read as UTC              |
| `date()`                            | `string`       | `string`                         |
| `integer()`                         | `number`       | `number`                         |
| `boolean()`                         | `boolean`      | `boolean`                        |
| `jsonb()`                           | `unknown`      | the parsed JSON value            |
| `numeric()`                         | `string`       | `string`                         |
| `bigint({ mode: "number" })`        | `number`       | `string`                         |
| `bigint({ mode: "bigint" })`        | `bigint`       | `string`                         |

Per-column modes, such as `date({ mode: "date" })` or `timestamp({ mode: "string" })`, aren't carried over. Nor are custom types or columns that Drizzle maps to tuples or arrays, such as `point()`, `line()` and `vector()`. For those, and for `bigint`, register a parser for the Postgres type with [`defineParsers`](../sdks/typescript#client-defineparsers), and decode server-rendered rows the same way. The subscribing guide lists [every default parser](../guides/subscribing#subscribe-to-the-sealed-query).

You don't write the row type yourself. [`seal()`](../sdks/typescript#backend-realtimeserverseal) infers it from the select: `realtime.seal({ query: messagesQuery(userId, channelId) })` returns a `SealedLiveQuery<Message>`. A typed API client, such as Hono's `hc`, carries that type to the browser. Hono types the response as JSON, though, so it types a `Date` column such as `created_at` as a `string`, while live rows decode it to a `Date`. See [fetch from an API endpoint](../guides/subscribing#fetch-from-an-api-endpoint).

- to name the row type in the browser, use `import type { Message } from "../backend/schema"`. TypeScript erases the import, so the schema stays out of the browser bundle
- `$inferSelect` fits `messagesQuery` because it selects every column. For a narrower or aliased selection, derive the type from the query: `` type UserMessage = Awaited<ReturnType<typeof userMessagesQuery>>[number] ``
- for the rest, see [subscribing to the sealed query](../guides/subscribing#subscribe-to-the-sealed-query) and the [React and TanStack&nbsp;DB bindings](../guides/reactivity)

## Return the txid from Drizzle writes

Run the write in `db.transaction()` and read the [transaction ID](../guides/mutations#returning-the-txid-from-your-backend) inside it, with the mutations guide's `currentTxId()` helper. For example, a function that edits a message:

```ts filename="backend/server.ts"
import { and, eq, ne, sql } from "drizzle-orm"

import { db } from "./db"
import { messages } from "./schema"

export type MutationResponse =
  | { readonly kind: "committed"; readonly txid: string }
  | { readonly kind: "unchanged" }

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

// Must run inside the write transaction, so it returns that transaction's id
async function currentTxId(tx: Transaction): Promise<string> {
  const result = await tx.execute<{ txid: string }>(sql`select pg_current_xact_id()::text as txid`)

  return result.rows[0]!.txid
}

export function editMessage(userId: string, id: string, body: string): Promise<MutationResponse> {
  return db.transaction(async (tx): Promise<MutationResponse> => {
    const updated = await tx
      .update(messages)
      .set({ body })
      .where(and(eq(messages.id, id), eq(messages.author_id, userId), ne(messages.body, body)))
      .returning({ id: messages.id })

    if (updated.length === 0) {
      return { kind: "unchanged" }
    }

    return { kind: "committed", txid: await currentTxId(tx) }
  })
}
```

- `Transaction` is the type of `tx` in your `db.transaction()` callback. `currentTxId()` works with `neon-serverless` and `node-postgres`. With `postgres-js`, `tx.execute()` returns the rows directly, so read `result[0]!.txid`
- `pg_current_xact_id()` runs inside the write's transaction, so it returns the ID of the transaction that made the change. The `text` cast keeps the 64-bit ID exact, as the decimal string the client waits for
- `.returning({ id: messages.id })` returns the changed rows. With none, nothing comes over Realtime, so the function returns `unchanged` and the client has nothing to wait for. `ne(messages.body, body)` skips edits that change nothing
- see how to [call these writes from the frontend](../guides/mutations#calling-the-routes-from-the-frontend) and [how optimistic mutations work](../guides/mutations#how-optimistic-mutations-work)

</Steps>

## Common pitfalls

These Drizzle query shapes don't work as live queries. All but the last fail on the server: TypeScript rejects `.prepare()`, and the rest make `seal()` throw:

- **a bare `select()` over a join.** Drizzle nests each row by table, and the adapter can't name the nested fields. Select a flat object, such as `getTableColumns(messages)` or `{ id: messages.id, body: messages.body }`. A column from another table under a different key needs a matching alias
- **renamed keys and unaliased computed fields.** `{ authorId: messages.author_id }` and `{ total: count() }` throw until you [add an SQL alias](#alias-renamed-and-computed-fields)
- **relational queries, prepared statements and placeholders.** `db.query.messages.findMany()`, `.prepare()` and `sql.placeholder()` don't give a select builder with bound values. Build a new select for each set of values, as [the query functions](#pass-query-parameters) do
- **a `Date` or object straight inside a `sql` template.** `` sql`${messages.created_at} > ${since}` `` throws, because no column encodes `since`. Use a column operator such as `gt(messages.created_at, since)`, or pass `since.toISOString()`
- **Drizzle's `casing: "snake_case"` option.** With camelCase keys that don't name their columns, Drizzle writes `created_at` into the SQL, but the adapter checks the Drizzle name, `createdAt`. The query seals, and live rows have `created_at` while the type says `createdAt`. Name each column, as in `timestamp("created_at")`, and alias the renamed keys

## Next steps

- read the [queries guide](../guides/queries) for the rules every live query follows, and how sealing and authorization work
- see how the client applies writes optimistically in the [mutations guide](../guides/mutations)
- look up `drizzleAdapter()` and `drizzleParsers` in the [Drizzle section of the SDK reference](../sdks/typescript#drizzle)
- see Drizzle in a full-stack app in the [TanStack example](./tanstack), or the same steps with Kysely in the [Kysely example](./kysely)
- browse the full source of the [chat app](https://github.com/neondatabase/examples/tree/main/realtime/guides-chat-app), [`with-react`](https://github.com/neondatabase/examples/tree/main/realtime/with-react) and [`with-tanstack`](https://github.com/neondatabase/examples/tree/main/realtime/with-tanstack) on GitHub

<NeedHelp/>
