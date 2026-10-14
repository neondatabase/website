---
title: 'Kysely example'
subtitle: 'Using Realtime with your Kysely schema and queries.'
summary: >-
  Use Kysely with Neon Realtime: add the Kysely adapter, seal Kysely selects with parameters, keep live rows typed and return the txid from Kysely writes.
enableTableOfContents: true
---

This page shows how to build a Realtime app with [Kysely](https://kysely.dev), using your existing schema, queries, types and writes.

You'll learn how to [add the Kysely adapter](#create-the-realtime-server), [define your schema, migrations and live queries](#defining-queries), [pass query parameters](#pass-query-parameters), [keep end-to-end type-safety](#subscribing-to-queries) and [return the transaction ID from Kysely writes](#return-the-txid-from-kysely-writes).

<Admonition type="tip" title="Full example on GitHub">
The [`realtime/with-nextjs`](https://github.com/neondatabase/examples/tree/main/realtime/with-nextjs) app in the `neondatabase/examples` repository uses Kysely.
</Admonition>

## Setup

### Install the packages

Install the Realtime SDK, its Kysely adapter, Kysely and the `pg` driver:

```bash filename="Terminal"
npm install @neon/realtime @neon/realtime-kysely kysely pg
npm install -D @types/pg
```

`@neon/realtime-kysely` exports `kyselyAdapter()` for your server. The browser needs nothing from it.

The queries guide's [setup](../guides/queries#setup) covers the rest: Neon Auth, `neon.ts` and the environment variables. For Kysely on Neon in general, see [Connect from Kysely to Neon](/docs/guides/kysely).

### Create the Realtime server

Pass `kyselyAdapter()` to [`createRealtime`](../sdks/typescript#backend-createrealtime), so the Realtime server accepts Kysely queries:

```ts filename="backend/realtime.ts" {2,7}
import { createRealtime } from "@neon/realtime/server"
import { kyselyAdapter } from "@neon/realtime-kysely"

export const realtime = createRealtime({
  secret: process.env.NEON_REALTIME_SECRET!,
  db: "neondb",
  adapter: kyselyAdapter()
})
```

- [`kyselyAdapter()`](../sdks/typescript#kysely-kyselyadapter) takes no options. When you seal a Kysely select, it compiles it to SQL and bind parameters
- `db` is the database name, such as `"neondb"`, not a Kysely instance. Use the database in your `DATABASE_URL`, and keep `NEON_REALTIME_SECRET` [on the server](../guides/queries#sealing-queries)
- the same server still seals [`rawSql`](../guides/queries#using-raw-sql) queries, so you can mix the two

## Defining queries

Define live queries with your usual Kysely schema, instance and select builder, in server code.

### Define the schema

Your `Database` interface stays plain Kysely. Use the column names as its keys:

```ts filename="backend/schema.ts"
import type { Generated } from "kysely"

export interface TodosTable {
  // No default: the client generates the ID, so an optimistic row already has its key
  id: string
  user_id: string
  title: string
  completed: Generated<boolean>
  created_at: Generated<Date>
}

export interface Database {
  todos: TodosTable
}
```

Realtime names each field in a live row after the column name Postgres returns, so keys that match the columns keep live rows and Kysely's types in step. That's why [`CamelCasePlugin` doesn't work](#common-pitfalls).

Create the table with a [Kysely migration](https://kysely.dev/docs/migrations) or your usual migration tool:

```ts filename="migrations/0001_create_todos.ts"
import { type Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("todos")
    .addColumn("id", "uuid", (c) => c.primaryKey())
    .addColumn("user_id", "uuid", (c) => c.notNull())
    .addColumn("title", "text", (c) => c.notNull())
    .addColumn("completed", "boolean", (c) => c.notNull().defaultTo(false))
    .addColumn("created_at", "timestamptz", (c) => c.notNull().defaultTo(sql`now()`))
    .execute()
}
```

The primary key is all Realtime needs to work. See the [table requirements](../guides/queries#table-requirements) for more details.

### Create the Kysely instance

You build live queries with your usual Kysely `db`. The adapter then compiles them using Kysely's PostgreSQL compiler, whatever your dialect. `db` still runs your writes and any reads on the server, such as server-rendered rows:

```ts filename="backend/db.ts"
import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"

import type { Database } from "./schema"

const pool = new Pool({
  // Neon URLs say sslmode=require. Asking pg for verify-full keeps today's checks and skips its warning
  connectionString: process.env.DATABASE_URL!.replace("sslmode=require", "sslmode=verify-full")
})
export const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool })
})

// So an idle connection error, for example when the compute scales to zero, doesn't crash the API
pool.on("error", (error: Error) => console.error(error))
```

### Define the live query

A live query is a Kysely select that you build but don't execute. Wrap it in a function, so each call builds a fresh query for its values:

```ts filename="backend/queries.ts"
import type { InferResult } from "kysely"

import { db } from "./db"

export function todosQuery(userId: string) {
  return db
    .selectFrom("todos")
    .select(["id", "title", "completed", "created_at"])
    .where("user_id", "=", userId)
    .orderBy("created_at", "desc")
    .orderBy("id", "desc")
}

export type TodoRow = InferResult<ReturnType<typeof todosQuery>>[number]
```

- the `where` clause is the authorization: a user only sees their own todos. See [sealing authorized queries](../guides/queries#sealing-authorized-queries)
- call `.execute()` on the same query to read the rows on the server, for example to server-render the first results. See [return the sealed query and initial results](../guides/ssr#return-the-sealed-query-and-initial-results)
- rename a field with an alias, as in `"id as todoId"`, and name a computed field with `.as()`
- `TodoRow` is the row type. You'll use it [in the browser](#subscribing-to-queries)

The adapter doesn't check the SQL. That happens when a client subscribes, so a query that calls a non-deterministic function such as `now()` seals and then fails to subscribe. See the rules for [defining live queries](../guides/queries#defining-live-queries).

## Sealing queries

Seal each query on the server. The browser can subscribe to a sealed query, but it can't read or change it, as the queries guide explains in [sealing queries](../guides/queries#sealing-queries).

### Pass query parameters

Kysely has no special syntax for live query parameters: they're the values you pass to the query function. Fill them in on the server from context you trust. Take the user ID from the verified session, validate anything from the request, then seal with `realtime.seal({ query: todosQuery(user.id) })`. The queries guide shows this in an [API endpoint](../guides/queries#exposing-an-endpoint) and a [server function](../guides/queries#using-server-functions).

Another parameter is another argument. This query adds `since`:

```ts filename="backend/recent-todos.ts" {8}
import { db } from "./db"

export function todosSinceQuery(userId: string, since: Date) {
  return db
    .selectFrom("todos")
    .select(["id", "title", "completed", "created_at"])
    .where("user_id", "=", userId)
    .where("created_at", ">", since)
    .orderBy("created_at", "desc")
    .orderBy("id", "desc")
}
```

- Kysely compiles each value to a bind parameter. The sealed query carries the values alongside the SQL, never spliced into it
- the adapter encodes values the way node-postgres does, and Postgres infers each parameter's type from the SQL. So unlike [raw SQL parameters](../guides/queries#parameter-types), a `Date` or JSON value needs no `pgParam` wrapper
- where Postgres can't infer a parameter's type from the SQL, wrap the value in a [`pgParam`](../sdks/typescript#backend-pgparam) helper for a built-in type, inside a `sql` template
- each sealed query is for one set of values. To change them, the browser fetches a new sealed query. See [changing query parameters](../guides/reactivity#changing-query-parameters) and [renewing sealed queries](../guides/queries#renewing-sealed-queries)

## Subscribing to queries

Subscribe in the browser as the [subscribing guide](../guides/subscribing) shows. The client needs no Kysely-specific parsers: its defaults decode like node-postgres, which `PostgresDialect` uses, so a `timestamptz` column is a `Date` in live rows, as it is when Kysely runs the query.

[`seal()`](../sdks/typescript#backend-realtimeserverseal) infers the row type from the select: `realtime.seal({ query: todosQuery(userId) })` resolves to a [`SealedLiveQuery<TodoRow>`](../sdks/typescript#backend-sealedlivequery).

- to name the row type in the browser, use `import type { TodoRow } from "../backend/queries"`. TypeScript erases the import, so Kysely and your server code stay out of the browser bundle
- if your dialect runs on another driver, pass its parsers, such as [`postgresJsParsers`](../sdks/typescript#client-postgresjsparsers). For custom types, register a parser with [`defineParsers`](../sdks/typescript#client-defineparsers)
- for the rest, see [subscribing to the sealed query](../guides/subscribing#subscribe-to-the-sealed-query) and the [React and TanStack&nbsp;DB bindings](../guides/reactivity)

## Optimistic mutations

The client holds each optimistic change until the write's transaction ID comes back on the subscription, so every write returns its txid. The mutations guide explains [how optimistic mutations work](../guides/mutations#how-optimistic-mutations-work).

### Return the txid from Kysely writes

Return the [transaction ID](../guides/mutations#returning-the-txid-from-your-backend) from the write's own statement, with `.returning()`. For example, a function that completes a todo:

```ts filename="backend/server.ts" {9,17}
import { sql } from "kysely"

import { db } from "./db"

export type MutationResponse =
  | { readonly kind: "committed"; readonly txid: string }
  | { readonly kind: "unchanged" }

const txid = sql<string>`pg_current_xact_id()::text`.as("txid")

export async function setTodoCompleted(userId: string, id: string, completed: boolean): Promise<MutationResponse> {
  const row = await db
    .updateTable("todos")
    .set({ completed })
    .where("id", "=", id)
    .where("user_id", "=", userId)
    .returning(txid)
    .executeTakeFirst()

  return row ? { kind: "committed", txid: row.txid } : { kind: "unchanged" }
}
```

- `pg_current_xact_id()` runs in the write's statement, so it returns the ID of the transaction that made the change, with any driver. The `text` cast keeps the 64-bit ID exact, as the decimal string the client waits for
- `executeTakeFirst()` returns `undefined` when no row matched. Nothing comes over Realtime, so the function returns `unchanged` and the client has nothing to wait for
- take `userId` from the verified session, never from the request: the `user_id` condition stops one user changing another's todos
- for writes that span several statements, run them all on `trx` in `db.transaction().execute(async (trx) => ...)`, and read the txid there with `trx.selectNoFrom(txid).executeTakeFirstOrThrow()`
- call it from a route or server function, and see how the frontend [calls these writes](../guides/mutations#calling-the-routes-from-the-frontend)

## Common pitfalls

These don't work as live queries:

- **`CamelCasePlugin`.** Its result transform doesn't apply to live rows, so they keep the snake_case column names while Kysely types camelCase keys. Aliases don't help, because the plugin snake-cases them too. Remove the plugin and use the column names as keys. For a camelCase field, alias the column, as in `"created_at as createdAt"`
- **anything but a select builder.** TypeScript rejects an executed result, a compiled query, an insert, update or delete builder, and a bare `` sql`...` `` template. Pass the builder from `selectFrom()`, and seal raw SQL with [`rawSql`](../sdks/typescript#backend-rawsql)

## Next steps

- read the [queries guide](../guides/queries)
- see how the client applies writes optimistically in the [mutations guide](../guides/mutations)
- look up `kyselyAdapter()` in the [Kysely section of the SDK reference](../sdks/typescript#kysely)
- see Kysely in a full-stack app in the [Next.js example](./nextjs), or browse [its source](https://github.com/neondatabase/examples/tree/main/realtime/with-nextjs) on GitHub

<NeedHelp/>
