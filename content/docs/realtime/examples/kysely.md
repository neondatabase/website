---
title: 'Kysely example'
subtitle: 'Using Realtime with your Kysely schema and queries.'
summary: >-
  Use Kysely with Neon Realtime: add the Kysely adapter, seal a Kysely select, keep live rows typed and return the txid from Kysely writes.
enableTableOfContents: true
---

This page shows how to build a Realtime app with [Kysely](https://kysely.dev), using your existing schema, queries, types and writes.

You'll learn how to [add the Kysely adapter](#create-the-realtime-server), [define your schema, migrations and live queries](#defining-queries), [pass query parameters](#passing-query-parameters), [keep end-to-end type-safety](#subscribing-to-queries) and [return the transaction ID from Kysely writes](#return-the-txid-from-kysely-writes).

<Admonition type="tip" title="Full example on GitHub">
The [`realtime/with-kysely`](https://github.com/neondatabase/examples/tree/main/realtime/with-kysely) app in the `neondatabase/examples` repository is a framework-free TypeScript app built with Kysely and Realtime.
</Admonition>

## Setup

### Install the packages

Install the Realtime SDK, its Kysely adapter, Kysely and the `pg` driver:

```bash filename="Terminal"
npm install @neon/realtime @neon/realtime-kysely kysely pg
npm install -D @types/pg
```

`@neon/realtime-kysely` exports `kyselyAdapter()` to use in your backend. There are no client imports. The queries guide's [setup](../guides/queries#setup) covers `neon.ts` and the environment variables. For Kysely on Neon in general, see [Connect from Kysely to Neon](/docs/guides/kysely).

### Create the Realtime server

Pass `kyselyAdapter()` to [`createRealtime`](../sdks/typescript#backend-createrealtime), so the Realtime server accepts Kysely queries:

```ts filename="src/server.ts" {2,7}
import { createRealtime } from "@neon/realtime/server"
import { kyselyAdapter } from "@neon/realtime-kysely"

const realtime = createRealtime({
  secret: env.realtime.secret,
  db: postgresDatabaseName,
  adapter: kyselyAdapter() // seals Kysely query builders, not raw SQL
})
```

- [`kyselyAdapter()`](../sdks/typescript#kysely-kyselyadapter) takes no options. When you seal a Kysely select, it compiles it to SQL and bind parameters
- `db` is the database name, not a Kysely instance. The example derives it from `DATABASE_URL` with `@neon/env` (as `postgresDatabaseName` in `src/env.ts`), reads the secret from the same parsed env, and keeps `NEON_REALTIME_SECRET` [on the server](../guides/queries#sealing-queries)
- the same server still seals [`rawSql`](../guides/queries#using-raw-sql) queries, so you can mix the two

## Defining queries

Define live queries with your usual Kysely schema, instance and select builder, in server code.

### Define the schema

Your `Database` interface stays plain Kysely. Use the column names as its keys:

```ts filename="src/schema.ts"
import type { Generated, Selectable } from "kysely"

// Kysely's types for the table. src/setup.ts creates it.
// Keys equal the column names: Realtime builds live rows from PostgreSQL's result names, so the
// live rows and the rows the server reads share the same keys.
export interface TodosTable {
  id: Generated<number> // SERIAL PRIMARY KEY
  title: string
  completed: Generated<boolean> // defaults to false
}

export interface Database {
  realtime_todos: TodosTable
}

// The row the live query returns. Kysely infers it from the table instead of a handwritten
// interface, keeping the `{ id, title, completed }` shape that api-types.ts and the client import.
export type Todo = Selectable<Database["realtime_todos"]>
```

Realtime names each field in a live row after the column name Postgres returns, so keys that match the columns keep live rows and Kysely's types in step. That's why [`CamelCasePlugin` doesn't work](#common-pitfalls).

The example creates the table once with Kysely's schema builder in `src/setup.ts`, run with `npm run db:setup`. You could also use a [Kysely migration](https://kysely.dev/docs/migrations) or your usual migration tool:

```ts filename="src/setup.ts"
await db.schema
  .createTable("realtime_todos")
  .ifNotExists()
  .addColumn("id", "serial", (column) => column.primaryKey())
  .addColumn("title", "text", (column) => column.notNull())
  .addColumn("completed", "boolean", (column) =>
    column.notNull().defaultTo(false)
  )
  .execute()

// Seed one row only when the table is empty, so re-running stays idempotent.
const existing = await db
  .selectFrom("realtime_todos")
  .select("id")
  .limit(1)
  .executeTakeFirst()
if (!existing) {
  await db
    .insertInto("realtime_todos")
    .values({ title: "Open this app in another tab" })
    .execute()
}
```

The primary key is all Realtime needs to work. See the [table requirements](../guides/queries#table-requirements) for more details.

### Create the Kysely instance

The example keeps the `pg` pool in `src/db.ts`:

```ts filename="src/db.ts"
import { Pool } from "pg"

import { env } from "./env.js"

export const pool = new Pool({
  connectionString: env.postgres.databaseUrl,
  max: 5,
  min: 1
})

pool.on("error", (error) => {
  console.error("Unexpected error on idle PostgreSQL client", error)
})
```

`src/server.ts` and `src/setup.ts` build a Kysely instance over that pool. The adapter compiles your queries using Kysely's PostgreSQL compiler, whatever your dialect. `db` still runs your writes and any reads on the server, such as server-rendered rows:

```ts filename="src/server.ts"
import { Kysely, PostgresDialect } from "kysely"

import { pool } from "./db.js"
import type { Database } from "./schema.js"

const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool })
})
```

### Define the live query

A live query is a Kysely select that you build but don't execute. Wrap it in a function, so each call builds a fresh query:

```ts filename="src/server.ts"
// The only place the live query is built, so the sealed query matches the rows the server reads.
const selectTodos = () =>
  db
    .selectFrom("realtime_todos")
    .select(["id", "title", "completed"])
    .orderBy("id")
```

- this example's list is shared, so the query has no `where` clause. To scope a live query so each user only sees their own rows, add a `where` on context you trust; that clause is the authorization. See [sealing authorized queries](../guides/queries#sealing-authorized-queries)
- call `.execute()` on the same builder to read the rows on the server, for example to server-render the first results. See [return the sealed query and initial results](../guides/ssr#return-the-sealed-query-and-initial-results)
- rename a field with an alias, as in `"id as todoId"`, and name a computed field with `.as()`
- `Todo` is the row type, which `src/schema.ts` infers from the table. You'll use it [in the browser](#subscribing-to-queries)

The adapter doesn't check the SQL. That happens when a client subscribes, so a query that calls a non-deterministic function such as `now()` seals and then fails to subscribe. See the rules for [defining live queries](../guides/queries#defining-live-queries).

## Sealing queries

### Passing query parameters

This example seals a single query with no parameters. When a query does need a parameter (like a user ID or search term) Kysely compiles each value to a bind parameter. The adapter encodes values the way node-postgres does, and Postgres infers each parameter's type from the SQL.

Where Postgres can't infer a parameter's type from the SQL, wrap the value in a [`pgParam`](../sdks/typescript#backend-pgparam) helper for a built-in type, inside a `sql` template.

## Subscribing to queries

Subscribe in the browser as the [subscribing guide](../guides/subscribing) shows. The client needs no Kysely-specific parsers: its defaults decode like node-postgres, which `PostgresDialect` uses, so each live row is the same `{ id, title, completed }` — a number, a string and a boolean — that Kysely reads on the server.

[`seal()`](../sdks/typescript#backend-realtimeserverseal) infers the row type from the select: `realtime.seal({ query: selectTodos() })` resolves to a [`SealedLiveQuery<Todo>`](../sdks/typescript#backend-sealedlivequery).

- to name the row type in the browser, use `import type { Todo } from "../../src/schema.js"`. TypeScript erases the import, so Kysely and your server code stay out of the browser bundle
- if your dialect runs on another driver, pass its parsers, such as [`postgresJsParsers`](../sdks/typescript#client-postgresjsparsers). For custom types, register a parser with [`defineParsers`](../sdks/typescript#client-defineparsers)
- for the rest, see [subscribing to the sealed query](../guides/subscribing#subscribe-to-the-sealed-query) and the [React and TanStack&nbsp;DB bindings](../guides/reactivity)

## Optimistic mutations

The client holds each optimistic change until the write's transaction ID comes back on the subscription, so every write returns its txid. The mutations guide explains [how optimistic mutations work](../guides/mutations#how-optimistic-mutations-work).

### Return the txid from Kysely writes

Return the [transaction ID](../guides/mutations#returning-the-txid-from-your-backend) from the write's own statement, with `.returning()`. Every mutation in the example — insert, toggle and delete — returns it. The example is a plain Node HTTP server; here is its toggle handler:

```ts filename="src/server.ts" {5,12}
import { sql } from "kysely"

// Same statement on every mutation: the client waits for this txid over Realtime before dropping
// its optimistic state, so the write must keep returning it.
const txid = sql<string>`pg_current_xact_id()::text`.as("txid")

// ...inside the request handler, for PATCH /api/todos/:id
const result = await db
  .updateTable("realtime_todos")
  .set({ completed: sql<boolean>`NOT completed` })
  .where("id", "=", Number(match[1]))
  .returning(txid)
  .executeTakeFirst()
return result
  ? json(response, 200, result satisfies MutationResponse)
  : json(response, 404, { error: "Todo not found" })
```

- `pg_current_xact_id()` runs in the write's statement, so it returns the ID of the transaction that made the change, with any driver. The `text` cast keeps the 64-bit ID exact, as the decimal string the client waits for
- `executeTakeFirst()` returns `undefined` when no row matched. Nothing comes over Realtime, so the handler responds `404` and the client has nothing to wait for
- the insert returns the new `id` too, with `.returning(["id", txid])`, so the client can swap its optimistic row for the real one. This demo doesn't authenticate its routes — add authorization before adapting it for production
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
- browse the full [`realtime/with-kysely`](https://github.com/neondatabase/examples/tree/main/realtime/with-kysely) example on GitHub

<NeedHelp/>
