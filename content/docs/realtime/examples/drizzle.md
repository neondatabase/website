---
title: 'Drizzle ORM'
subtitle: 'Use your Drizzle schema and select queries as live queries, from the table definition to writes that return a txid.'
summary: >-
  Use Drizzle ORM with Neon Realtime: create tables with drizzle-kit, seal Drizzle selects with parameters and aliases, decode rows with drizzleParsers and return the txid from Drizzle writes.
enableTableOfContents: true
isDraft: true
---

This page shows how to build a Realtime app with [Drizzle ORM](https://orm.drizzle.team), so the schema and select queries you already have become live queries. You'll learn which Drizzle queries seal unchanged, when a field needs an SQL alias, how live rows keep Drizzle's types in the browser, and how a Drizzle write returns its transaction ID. The snippets use the `messages` and `channel_members` tables from the [guides](../guides/queries#setup), and the steps follow the order you'd build in: [the packages](#install-the-packages), [the schema](#define-the-schema), [migrations](#create-the-tables-with-drizzle-kit), [the Drizzle client](#create-the-drizzle-client), [the adapter](#add-the-drizzle-adapter), [live queries](#define-live-queries), [query parameters](#pass-query-parameters), [aliases](#alias-renamed-and-computed-fields), [rows in the browser](#decode-and-type-rows-in-the-browser) and [writes](#return-the-txid-from-drizzle-writes). It ends with [common pitfalls](#common-pitfalls).

<Admonition type="tip" title="Full examples on GitHub">
These apps in the `neondatabase/examples` repository use Drizzle with Realtime. Each README has the steps to run it:

- [`realtime/guides-chat-app`](https://github.com/neondatabase/examples/tree/main/realtime/guides-chat-app): the chat app the guides build, with a snake_case schema
- [`realtime/with-react`](https://github.com/neondatabase/examples/tree/main/realtime/with-react): Hono and React, with a minimal Drizzle setup
- [`realtime/with-tanstack`](https://github.com/neondatabase/examples/tree/main/realtime/with-tanstack): TanStack&nbsp;Start, with a camelCase schema and an aliased column

</Admonition>

<Steps>

## Install the packages

Install the Realtime SDK, its Drizzle adapter, Drizzle and a Postgres driver, plus drizzle-kit for the schema:

```bash filename="Terminal"
npm install @neon/realtime @neon/realtime-drizzle drizzle-orm @neondatabase/serverless ws
npm install -D drizzle-kit dotenv @types/ws
```

- `@neon/realtime-drizzle` has two entry points. The main one, with `drizzleAdapter()`, runs on your server. `@neon/realtime-drizzle/client`, with `drizzleParsers`, runs in the browser and doesn't import Drizzle, so the ORM stays out of your browser bundle

The queries guide's [setup](../guides/queries#setup) covers the rest, including Neon Auth, `neon.ts` and the environment variables. For Drizzle on Neon in general, see [Connect from Drizzle to Neon](/docs/guides/drizzle).

## Define the schema

Your schema stays plain Drizzle, with no Realtime imports or options. The one choice that matters for Realtime is how you name the keys. Snake_case keys, the same as the column names, are the simplest:

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

- the adapter needs every selected key to match the name Postgres returns for it, so with snake_case keys no query needs an alias. For camelCase keys, see [Alias renamed and computed fields](#alias-renamed-and-computed-fields)
- give each table a primary key. That's all Realtime needs from it. The queries guide covers the [table requirements](../guides/queries#table-requirements)
- `Message` is the row type of a select of every `messages` column. Import it as a type in the browser when you [decode and type rows](#decode-and-type-rows-in-the-browser)

## Create the tables with drizzle-kit

Your migrations don't need any Realtime-specific SQL: no publications, triggers or grants. The primary keys in the schema already meet the [table requirements](../guides/queries#table-requirements), so you create the tables with plain drizzle-kit. Point it at your schema, and read `DATABASE_URL` from the `.env.local` file that `neon deploy` writes:

```ts filename="drizzle.config.ts"
import { config as loadEnv } from "dotenv"
import { defineConfig } from "drizzle-kit"

loadEnv({ path: ".env.local", quiet: true })

export default defineConfig({
  out: "./drizzle",
  schema: "./backend/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})
```

In development, push the schema straight to the database:

```bash filename="Terminal"
npx drizzle-kit push
```

For production, generate SQL migration files into `./drizzle`, review and commit them, then apply them:

```bash filename="Terminal"
npx drizzle-kit generate
npx drizzle-kit migrate
```

- `push` applies the schema with no migration files, which suits development. `generate` and `migrate` give you versioned migrations to review and apply. Use one approach per database: the first migration fails on a database that `push` already created tables in. [Schema migration with Neon Postgres and Drizzle ORM](/docs/guides/drizzle-migrations) walks through them

## Create the Drizzle client

You build live queries with your usual Drizzle `db`, but Realtime never runs them through it. The adapter only compiles each query to SQL. Your `db` still runs your writes and any reads you do on the server, such as server-rendered rows:

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

- the [`neon-serverless`](/docs/serverless/serverless-driver) driver runs interactive transactions, which the [writes](#return-the-txid-from-drizzle-writes) need to read their transaction ID. `drizzle-orm/node-postgres` with a `pg` pool works the same way. The `neon-http` driver can't run interactive transactions, so `db.transaction()` throws with it. Use `neon-serverless` or `node-postgres` for these writes
- `{ schema }` is only for Drizzle's relational `db.query` API, which [can't be sealed](#common-pitfalls). Live queries use the select builder

## Add the Drizzle adapter

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

- [`drizzleAdapter()`](../sdks/typescript#drizzle-drizzleadapter) takes no options and isn't tied to your `db` client. It turns each Drizzle select into SQL and bind parameters when you seal it
- `db` here is the database name, a string such as `"neondb"`, not your Drizzle `db` client. Use the database in your `DATABASE_URL`, and keep `NEON_REALTIME_SECRET` [on the server](../guides/queries#sealing-queries)
- the same server still seals [`rawSql`](../guides/queries#using-raw-sql) queries, so you can mix the two. Add `url` and it can also [subscribe in trusted backend code](../guides/subscribing#subscribe-in-trusted-backend-code), where `subscribe()` takes the Drizzle query directly

## Define live queries

A live query is a Drizzle select that you build but don't await. Wrap it in a function, so each call builds a fresh query for the values you pass in:

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
- the join is the authorization: a user only sees messages in channels they belong to, and the result stays correct as memberships change. See [live authorization](../guides/queries#live-authorization)
- `orderBy` and `limit` work as they do in any Drizzle query, so the live result is the 50 newest messages
- you can also await the same function to read the rows on the server, for example to server-render the first results. See [return the sealed query and initial results](../guides/ssr#return-the-sealed-query-and-initial-results)

The adapter checks the query's shape when you seal it. The SQL itself is only checked when a client subscribes, so a query that writes or calls a non-deterministic function such as `now()` seals fine and then fails to subscribe. The queries guide covers the rules for [defining live queries](../guides/queries#defining-live-queries).

## Pass query parameters

Drizzle has no special syntax for live query parameters. They're the ordinary values you pass to the query function. Fill them in on the server from context you trust: take the user ID from the verified session, validate anything that comes from the request, then seal the result with `realtime.seal({ query: messagesQuery(user.id, channelId) })`. The queries guide shows this in an [API endpoint](../guides/queries#exposing-an-endpoint) and a [server function](../guides/queries#using-server-functions).

- Drizzle compiles each value to a bind parameter (`$1`, `$2` and so on), and the sealed query carries the values alongside the SQL. They're never spliced into the SQL text
- each sealed query is for one set of values. To show another channel, the browser fetches a new sealed query. See [changing query parameters](../guides/reactivity#changing-query-parameters) and [renewing sealed queries](../guides/queries#renewing-sealed-queries)

Values that you compare with a column go through that column's Drizzle encoder first. So unlike [raw SQL parameters](../guides/queries#parameter-types), a `Date` or a JSON value needs no `pgParam` wrapper. This Drizzle version of the queries guide's [`messagesSinceQuery`](../guides/queries#parameter-types) passes `since` straight to `gt()`:

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

The `timestamptz` column encodes `since` as an ISO string, and Postgres infers each parameter's type from the SQL around it.

## Alias renamed and computed fields

Realtime returns rows with the names Postgres gives each result column, not Drizzle's client-side mapping. So the adapter checks that every selected key matches its result name, and `seal()` throws if one doesn't. With snake_case keys, they always match. If your schema uses camelCase keys over snake_case columns, a renamed field needs an SQL alias. Here's the same `messages` table with camelCase keys:

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

A query over it aliases `createdAt`, the one selected key whose name differs from its column:

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

- `id` and `body` have the same name in Drizzle and Postgres, so they need nothing
- `createdAt: messages.createdAt` on its own would come back from Postgres as `created_at`, and `seal()` would throw an error saying that `createdAt` is returned as `created_at`. `` sql<Date>`${messages.createdAt}`.as("createdAt") `` selects `"created_at" as "createdAt"`, so the names match, and `sql<Date>` keeps the row type a `Date`
- `.mapWith(messages.createdAt)` only has an effect when Drizzle runs the query itself, for example when you await it on the server to render the first rows. It decodes the value with the column's own decoder, so it's a `Date` there too. Live rows don't need it, because the Realtime client decodes them by Postgres type. See [keep row shapes identical](../guides/ssr#keep-row-shapes-identical)
- the query filters on `authorId` without selecting it. Only selected keys need to match

Computed fields, such as aggregates, follow the same rule: give each one an alias that matches its key, for example `` messageCount: sql<number>`count(*)::int`.as("messageCount") ``. Cast it with `::int` too, because Postgres returns `count(*)` as `int8`, which [arrives as a string](../guides/subscribing#subscribe-to-the-sealed-query).

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

The parsers work by Postgres type, so for the common column types a live row matches Drizzle's type. The exceptions are `bigint` columns, in either mode, which arrive as strings:

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

Per-column modes, such as `date({ mode: "date" })` or `timestamp({ mode: "string" })`, aren't carried over, and neither are custom types or columns that Drizzle maps to tuples or arrays, such as `point()`, `line()` and `vector()`. For those, and for `bigint` columns, register your own parser for the Postgres type with [`defineParsers`](../sdks/typescript#client-defineparsers), and decode server-rendered rows the same way so both sides match. The subscribing guide lists [every default parser](../guides/subscribing#subscribe-to-the-sealed-query).

You don't write the row type yourself. [`seal()`](../sdks/typescript#backend-realtimeserverseal) infers it from the select, so `realtime.seal({ query: messagesQuery(userId, channelId) })` returns a `SealedLiveQuery<Message>` with no annotation or cast. A typed API client, such as Hono's `hc` client, carries that type to the browser. Hono types the response as JSON, though, so a `Date` column such as `created_at` shows up as a `string`, while `drizzleParsers` decodes it to a `Date` in live rows. The subscribing guide covers this when it [fetches the sealed query](../guides/subscribing#fetch-from-an-api-endpoint).

- if you name the row type in the browser, import it with `import type`, as in `import type { Message } from "../backend/schema"`. TypeScript erases the import, so the schema module never reaches the browser bundle
- `$inferSelect` fits `messagesQuery` because it selects every column. For a narrower or aliased selection, derive the row type from the query instead, for example `` type UserMessage = Awaited<ReturnType<typeof userMessagesQuery>>[number] ``
- the subscribing guide covers the rest of [subscribing to the sealed query](../guides/subscribing#subscribe-to-the-sealed-query), and the reactivity guide covers the [React and TanStack&nbsp;DB bindings](../guides/reactivity)

## Return the txid from Drizzle writes

With Drizzle, run the write in `db.transaction()` and read the [transaction ID](../guides/mutations#returning-the-txid-from-your-backend) inside it, with the same `currentTxId()` helper as the mutations guide. For example, a function that edits a message:

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

- `Transaction` is the type of `tx` in your `db.transaction()` callback, so `currentTxId()` works with the `neon-serverless` and `node-postgres` drivers. With `postgres-js`, `tx.execute()` returns the rows themselves, so read `result[0]!.txid`
- `tx.execute()` runs `pg_current_xact_id()` inside the write's transaction, so it returns the ID of the transaction that made the change. It's cast to `text`, so the 64-bit ID arrives as an exact decimal string, the form the client waits for
- `.returning({ id: messages.id })` gives you the changed rows. When there are none, nothing comes back over Realtime, so the function returns `unchanged` and the client has nothing to wait for. `ne(messages.body, body)` skips an edit that wouldn't change the row
- the mutations guide shows how to [call these writes from the frontend](../guides/mutations#calling-the-routes-from-the-frontend) and explains [how optimistic mutations work](../guides/mutations#how-optimistic-mutations-work)

</Steps>

## Common pitfalls

These are the Drizzle query shapes that don't work as live queries. All but the last fail on the server: TypeScript rejects `.prepare()`, and the rest make `seal()` throw:

- **a bare `select()` over a join.** Drizzle nests each row by table, and the adapter can't name the nested fields. Select a flat object instead, such as `getTableColumns(messages)` or `{ id: messages.id, body: messages.body }`. To select a column from another table under a different key, give it a matching alias
- **renamed keys and unaliased computed fields.** `{ authorId: messages.author_id }` and `{ total: count() }` throw until you [add an SQL alias](#alias-renamed-and-computed-fields)
- **relational queries, prepared statements and placeholders.** `db.query.messages.findMany()`, `.prepare()` and `sql.placeholder()` don't produce a select builder with bound values. Build a new select for each set of values, as [the query functions](#pass-query-parameters) do
- **a `Date` or object straight inside a `sql` template.** `` sql`${messages.created_at} > ${since}` `` throws, because no column encodes `since`. Compare through a column operator such as `gt(messages.created_at, since)`, or pass `since.toISOString()`
- **Drizzle's `casing: "snake_case"` option.** With `drizzle(pool, { casing: "snake_case" })` and camelCase keys that don't name their columns, Drizzle writes `created_at` into the SQL, but the adapter checks the column's Drizzle name, `createdAt`. The query seals, and live rows have `created_at` while the type says `createdAt`. Name each column explicitly instead, as in `timestamp("created_at")`, and alias the renamed keys

## Next steps

- read the [queries guide](../guides/queries) for the rules every live query follows, and how sealing and authorization work
- see how the client applies writes optimistically in the [mutations guide](../guides/mutations)
- look up `drizzleAdapter()` and `drizzleParsers` in the [Drizzle section of the SDK reference](../sdks/typescript#drizzle)
- see Drizzle in a full-stack app in the [TanStack example](./tanstack), or the same steps with Kysely in the [Kysely example](./kysely)
- browse the full source of the [chat app](https://github.com/neondatabase/examples/tree/main/realtime/guides-chat-app), [`with-react`](https://github.com/neondatabase/examples/tree/main/realtime/with-react) and [`with-tanstack`](https://github.com/neondatabase/examples/tree/main/realtime/with-tanstack) on GitHub

<NeedHelp/>
