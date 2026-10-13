---
title: 'TanStack example'
subtitle: 'Full-stack example app using Realtime with TanStack.'
summary: >-
  Build a per-user todo app with TanStack Start, TanStack DB, Drizzle and Neon Auth on Neon Realtime: seal live queries in server functions, seed a Realtime collection in a route loader, and settle optimistic writes by txid.
enableTableOfContents: true
---

This example shows how to use Neon Realtime with [TanStack&nbsp;Start](https://tanstack.com/start), [TanStack&nbsp;DB](https://tanstack.com/db), Drizzle and Neon Auth, with support for [auth](#authorize-with-the-session), [SSR](#server-side-rendering), [client-side reactivity](#client-side-reactivity) and [optimistic mutations](#optimistic-mutations).

The sections follow the same order as the guides, from [defining](#defining-queries) and [sealing](#sealing-queries) queries to writing to them, and show the TanStack code for each step.

<Admonition type="tip" title="Full example on GitHub">
The complete app is in the [`realtime/with-tanstack`](https://github.com/neondatabase/examples/tree/main/realtime/with-tanstack) folder of the `neondatabase/examples` repository.
</Admonition>

## Setup

Install the Realtime SDK with its Drizzle and TanStack&nbsp;DB bindings, plus TanStack&nbsp;DB's React package and its router integration:

```bash filename="Terminal"
npm install @neon/realtime @neon/realtime-drizzle @neon/realtime-tanstack
npm install @tanstack/react-db @tanstack/react-router-with-db
```

Add a `neon.ts` that enables Neon Auth and Realtime on your branch:

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1"

export default defineConfig({
  // Neon Auth signs users in. Each user's todos are scoped by their user id.
  auth: true,
  preview: {
    realtime: {
      allowedOrigins: ["http://localhost:3000"]
    }
  }
})
```

`allowedOrigins` lists the browser origins that can connect to Realtime, so add your app's origin when you deploy it. The [`neon.ts` reference](/docs/reference/neon-ts) covers the options.

Link the directory and run `neon deploy`, as in the [queries guide's setup](../guides/queries#setup). It writes `DATABASE_URL`, `NEON_REALTIME_URL`, `NEON_REALTIME_SECRET` and `NEON_AUTH_BASE_URL` to `.env.local`. If Realtime isn't ready before the deploy stops waiting, run `neon env pull` once it is.

Two more variables come from you. The browser needs the Realtime URL, and Vite only exposes variables that start with `VITE_`. Neon Auth's server SDK needs a cookie secret of at least 32 characters:

```bash filename="Terminal"
echo 'VITE_NEON_REALTIME_URL=$NEON_REALTIME_URL' >> .env.local
echo "NEON_AUTH_COOKIE_SECRET=$(openssl rand -base64 32)" >> .env.local
```

Vite expands `$NEON_REALTIME_URL` when it loads the file, so the browser URL follows the server variable after each `neon env pull`. It also inlines the value into the server build, so server rendering and the browser create the client with the same URL. `NEON_REALTIME_SECRET` never gets a `VITE_` prefix. The browser only ever sees the URL and sealed queries.

## Defining queries

Define each live query once, in server code. You run it to render the page on the server and seal it for the browser to subscribe to, so both get the same rows.

### Define the schema

Define your database schema. In this example, we're using Drizzle and defining a single table:

```ts filename="src/schema.ts"
import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const todos = pgTable(
  "realtime_todos",
  {
    // Generated in the browser, so an optimistic insert already has its key.
    id: uuid("id").primaryKey(),
    // The Neon Auth user id. Set on the server only; never sent to the browser.
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    completed: boolean("completed").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => [index("realtime_todos_user_id_idx").on(t.userId)]
)

// The row shape the browser sees: the same columns `selectTodos` selects.
export type Todo = Omit<typeof todos.$inferSelect, "userId">
```

### Define the live query

We then [define a query](../guides/queries). `db` is a Drizzle client over a node-postgres pool, in `src/db.server.ts`:

```ts filename="src/todos.server.ts"
import { eq, sql } from "drizzle-orm"

import { db } from "./db.server"
import { todos } from "./schema"

// One query for both the SSR rows and the sealed live query, so they match.
// Realtime matches each result column to its key by name, so `createdAt` gets
// an SQL alias (the column is `created_at`). `mapWith` keeps it a `Date`.
export const selectTodos = (userId: string) =>
  db
    .select({
      id: todos.id,
      title: todos.title,
      completed: todos.completed,
      createdAt: sql<Date>`${todos.createdAt}`.mapWith(todos.createdAt).as("createdAt")
    })
    .from(todos)
    .where(eq(todos.userId, userId))
```

The query has no `ORDER BY`, because the collection stores rows by key and doesn't keep their order. The page sorts them when it [queries the collection](#render-the-collection). `userId` always comes from the server session, never from the browser. This `WHERE` is what keeps each user's todos separate.

## Sealing queries

Seal the query on the server, for the user in the session. The browser can subscribe to a sealed query, but it can't read or change it, as the queries guide explains in [sealing queries](../guides/queries#sealing-queries).

### Create the Realtime server

The Realtime server, from [`createRealtime()`](../sdks/typescript#backend-createrealtime), holds the secret and seals queries. It should be created and then used in your trusted server code:

```ts filename="src/realtime.server.ts"
import { createRealtime } from "@neon/realtime/server"
import { drizzleAdapter } from "@neon/realtime-drizzle"

import { env, postgresDatabaseName } from "./env.server"

export const realtime = createRealtime({
  secret: env.realtime.secret,
  db: postgresDatabaseName,
  adapter: drizzleAdapter()
})
```

The `.server.ts` suffix keeps the file out of the browser bundle, as [the SSR guide explains](../guides/ssr#keep-secrets-on-the-server).

### Authorize with the session

TanStack&nbsp;Start mounts [Neon Auth](/docs/auth/overview) on your app's own origin, so server code reads the session from its cookie and the browser holds no token. Check the session in middleware, on the server, before you read, seal or write anything:

```ts filename="src/auth.functions.ts"
import { createMiddleware, createServerFn } from "@tanstack/react-start"
import { setResponseHeader, setResponseStatus } from "@tanstack/react-start/server"

import { auth } from "./auth.server"

// Only what the UI needs. The root `beforeLoad` result is serialized into the HTML.
export type SessionUser = { id: string; email: string; name: string }

// Reads the session from the request's cookies. Signed out is `user: null`.
export const sessionMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const { data, error } = await auth.getSession()
  // If Neon Auth can't be reached, treat the request as signed out.
  if (error) console.warn("[auth] getSession failed", error.code)
  const user: SessionUser | null = data?.user ? { id: data.user.id, email: data.user.email, name: data.user.name } : null
  return next({ context: { user } })
})

// The data boundary: every todo server function uses this, whatever the
// route guards do.
export const requireUser = createMiddleware({ type: "function" })
  .middleware([sessionMiddleware])
  .server(({ next, context }) => {
    if (!context.user) {
      setResponseStatus(401)
      throw new Error("UNAUTHORIZED")
    }
    return next({ context: { user: context.user } })
  })

// The one GET server function, so it sets its own Cache-Control.
export const getSessionUser = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .handler(({ context }) => {
    setResponseHeader("Cache-Control", "private, no-store")
    return context.user
  })
```

`sessionMiddleware` reads the session from the request's cookies. `auth` comes from `src/auth.server.ts`, a small TanStack&nbsp;Start adapter for Neon Auth's server SDK. `src/routes/api/auth/$.ts` proxies Neon Auth so the session cookie lives on your app's origin. The SSR guide shows both in [send both to the browser](../guides/ssr#send-both-to-the-browser).

`requireUser` is the data boundary. Every server function that reads, seals or writes todos uses it. Without a session, it responds with a 401 and throws `UNAUTHORIZED`, which the collection [handles in the browser](#define-the-collection).

`getSessionUser` is for route guards, and returns the user or `null`. The routes use it to [keep server-rendered pages private](#keep-server-rendered-pages-private).

### Seal in a server function

Expose the sealed query from a server function, as in [using server functions](../guides/queries#using-server-functions). `refreshTodosQuery` requires a signed-in user and seals `selectTodos()` for them. The browser calls it to [renew the sealed query](../guides/queries#renewing-sealed-queries) before it expires, so it has to seal exactly the same query:

```ts filename="src/todos.functions.ts"
import { createServerFn } from "@tanstack/react-start"

import { requireUser, type SessionUser } from "./auth.functions"
import { realtime } from "./realtime.server"
import { selectTodos } from "./todos.server"
import { pageUserInput } from "./todos.schemas"

// Every function requires a signed-in user and only touches that user's rows.
// Anything that returns rows or a sealed query is POST, so it's never cached.
//
// Start applies its default CSRF middleware to server functions as long as
// there's no `src/start.ts`. If you add one, re-add
// `createCsrfMiddleware({ filter: (c) => c.handlerType === "serverFn" })`.

// The browser sends the user id its page was loaded for. If another tab has
// since signed in as someone else, the page has to reload: its writes would go
// to the new user, and Realtime rejects a refreshed query for a different user.
function requireSameUser(userId: string, user: SessionUser) {
  if (userId !== user.id) throw new Error("SESSION_CHANGED")
}

// Re-seals the live query before it expires.
export const refreshTodosQuery = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(pageUserInput)
  .handler(({ data, context }) => {
    requireSameUser(data.userId, context.user)
    return realtime.seal({ query: selectTodos(context.user.id) })
  })
```

`pageUserInput` is a zod schema for `{ userId }`, in `src/todos.schemas.ts`. When `requireSameUser` throws `SESSION_CHANGED`, the collection [leaves the page](#define-the-collection).

## Server-side rendering

TanStack&nbsp;Start renders the first request on the server. To put the user's rows in that HTML and keep them live in the browser:

1. read and seal the query in one server function
2. call it from a route loader, and seed a TanStack&nbsp;DB collection with the rows
3. let `routerWithDbClient()` carry the collection to the browser in the HTML

The SSR guide covers the pattern in [with TanStack&nbsp;DB](../guides/ssr#with-tanstack-db).

### Read and seal in one server function

Run the query and seal it in the same server function, so the rows and the sealed query match. This is [return the sealed query and initial results](../guides/ssr#return-the-sealed-query-and-initial-results) as a TanStack&nbsp;Start server function. Add it to `src/todos.functions.ts`, which already imports everything it uses:

```ts filename="src/todos.functions.ts"
// The page's rows, plus a sealed live query for exactly the same rows.
export const loadTodos = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const [rows, query] = await Promise.all([
      selectTodos(context.user.id),
      realtime.seal({ query: selectTodos(context.user.id) })
    ])
    return { rows, query }
  })
```

[`realtime.seal()`](../sdks/typescript#backend-realtimeserverseal) returns a typed [`SealedLiveQuery<Todo>`](../sdks/typescript#backend-sealedlivequery), so the row type flows through to the collection and the page.

### Keep server-rendered pages private

A server-rendered page carries the user's rows and a sealed query, which is a [bearer token](../guides/queries#sealing-queries). So load the session in the root route, and stop shared caches from storing the page:

```tsx filename="src/routes/__root.tsx"
import { createRootRouteWithContext } from "@tanstack/react-router"

import { getSessionUser } from "../auth.functions"
import type { RouterContext } from "../router"

export const Route = createRootRouteWithContext<RouterContext>()({
  // Runs on every navigation, so the signed-in user is always current. During
  // SSR it runs in-process with the request's cookies.
  beforeLoad: async () => ({ user: await getSessionUser() }),
  // Pages carry user specific data, so don't cache them.
  headers: () => ({ "Cache-Control": "private, no-store", Vary: "Cookie" })
})
```

Then put the signed-in pages under a layout route that sends signed-out visitors to sign-in:

```tsx filename="src/routes/_authed.tsx"
import { createFileRoute, redirect } from "@tanstack/react-router"

// Signed-in pages. The redirect is for the user experience only: every server
// function checks the session again with `requireUser`.
export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/auth/$path",
        params: { path: "sign-in" },
        search: { redirect: location.href },
        // An SSR redirect skips the root route's `headers`.
        headers: { "Cache-Control": "private, no-store", Vary: "Cookie" }
      })
    }
    return { user: context.user }
  }
})
```

`beforeLoad` returns the signed-in `user`, so the routes below it get a user that's never `null`. The sign-in route renders Neon Auth's prebuilt UI, as in the [Neon Auth TanStack Router quick start](/docs/auth/quick-start/tanstack-router).

### Create a `DbClient` per router

A TanStack&nbsp;DB `DbClient` holds the collections, so on the server it has to belong to one request. Create it in `getRouter()`, which TanStack&nbsp;Start calls once per server request and once per page load in the browser. Create the Realtime client next to it and pass it to the `DbClient` as a dependency, so collections can read it:

```tsx filename="src/router.tsx"
import { createRealtimeClient } from "@neon/realtime/client"
import { drizzleParsers } from "@neon/realtime-drizzle/client"
import { DbClient } from "@tanstack/react-db"
import { createRouter } from "@tanstack/react-router"
import { routerWithDbClient } from "@tanstack/react-router-with-db"

import { routeTree } from "./routeTree.gen"

export interface RouterContext {
  readonly dbClient: DbClient;
}

// Runs once per SSR request and once per page load in the browser.
export function getRouter() {
  // Vite inlines this into the server build too, so SSR and the browser agree.
  const url = import.meta.env.VITE_NEON_REALTIME_URL
  if (!url) {
    throw new Error("VITE_NEON_REALTIME_URL is not set. See the README setup.")
  }
  // Collections read this with `db.requireDependency("realtime")`. On the
  // server it never connects: sync only starts in the browser.
  const realtime = createRealtimeClient({
    url,
    parsers: { ...drizzleParsers }
  })
  const dbClient = new DbClient({ realtime })
  const router = createRouter({
    routeTree,
    context: { dbClient },
    scrollRestoration: true
  })
  // Snapshots the collections loaders filled on the server, and restores them
  // in the browser before the first render.
  return routerWithDbClient(router, dbClient)
}
```

- no collection is shared between users, because each request and each page load gets its own `DbClient`. Make sign-in and sign-out full page loads, so they drop the browser's `DbClient` and the previous user's rows with it. The SSR guide explains why you [create a `DbClient` per router](../guides/ssr#create-a-dbclient-per-router)
- [`drizzleParsers`](../sdks/typescript#drizzle-client-drizzleparsers) parses live values the way Drizzle does, so live rows have the same types as the rows the server rendered. See [keep row shapes identical](../guides/ssr#keep-row-shapes-identical)
- `routerWithDbClient()` wraps the app in TanStack&nbsp;DB's provider, so components get this `DbClient` from `useDbClient()`. It also snapshots the collections that loaders seeded on the server into the HTML, and restores them in the browser before the first render
- `RouterContext` puts `dbClient` on route context, where the route loader reads it

### Seed the collection in a loader

In the route loader, call the server function and seed the user's collection with its rows. Loaders also run in the browser on client-side navigation, so they call a server function rather than importing server modules:

```tsx filename="src/routes/_authed/index.tsx"
import { createFileRoute } from "@tanstack/react-router"

import { todosCollection } from "../../todos.collection"
import { loadTodos } from "../../todos.functions"

export const Route = createFileRoute("/_authed/")({
  // Don't refetch on a navigation back here while the collection is live.
  // No visible effect until the app has a second page.
  staleTime: Infinity,
  // Fills the router's DbClient. On the server, routerWithDbClient snapshots
  // these rows into the HTML and restores them in the browser before render.
  loader: async ({ context }) => {
    const { rows, query } = await loadTodos()
    // A no-op if this user's collection already exists.
    context.dbClient.collection(todosCollection(context.user.id, query), { initialData: rows })
    return { query }
  },
  component: TodosPage
})
```

- `todosCollection()` returns the collection's descriptor, which you [define](#define-the-collection) for client-side reactivity
- `context.dbClient.collection(descriptor, { initialData: rows })` creates the collection with the rows, without starting sync. If the collection already exists, the call reuses it and ignores `initialData`, so the live rows stay
- the loader returns only `{ query }`. The rows travel to the browser in the collection

## Client-side reactivity

In the browser, a TanStack&nbsp;DB collection syncs the live query's rows, and components query the collection locally. The reactivity guide explains [why a collection](../guides/reactivity#tanstack-db) suits live data.

### Define the collection

Define the collection as a descriptor, with the two-argument `collectionOptions(id, factory)` around [`realtimeCollectionOptions()`](../sdks/typescript#tanstack-db-realtimecollectionoptions). The descriptor is cheap to build, so the loader and the page both build it, and the shared `id` resolves both to the collection the loader seeded. The factory runs once per `DbClient`, and reads that `DbClient`'s Realtime client:

```ts filename="src/todos.collection.ts"
import type { RealtimeClient, SealedLiveQuery } from "@neon/realtime/client"
import { realtimeCollectionOptions } from "@neon/realtime-tanstack"
import { collectionOptions } from "@tanstack/react-db"

import type { Todo } from "./schema"
import { refreshTodosQuery } from "./todos.functions"

// A cheap descriptor, built by the loader and the page alike. The factory runs
// once per DbClient, with the Realtime client `getRouter` gave that DbClient.
export function todosCollection(userId: string, query: SealedLiveQuery<Todo>) {
  const id = `todos:${userId}`
  return collectionOptions(id, (db) =>
    realtimeCollectionOptions({
      id,
      query,
      client: db.requireDependency<RealtimeClient>("realtime"),
      getKey: (todo) => todo.id,
      // Never garbage-collect while the page is open. A collection rebuilt
      // later would start empty, from this long-expired sealed query, and stay
      // `stale` until a refresh replaced it.
      gcTime: 0,
      refreshQuery: () => refreshTodosQuery({ data: { userId } }).catch(leaveOnAuthLoss)
    })
  )
}

// Signed out, or signed in as someone else: this page's rows and live query
// no longer apply, so go to sign-in with a full page load. Browser only.
function leaveOnAuthLoss(error: unknown): never {
  if (/UNAUTHORIZED|SESSION_CHANGED/.test(String(error))) {
    window.location.assign("/auth/sign-in")
  }
  throw error
}
```

- `realtimeCollectionOptions()` takes the sealed `query`, the Realtime `client` and `getKey`, and syncs the collection from the subscription. Other TanStack&nbsp;DB options, like `gcTime`, pass through. The [config reference](../sdks/typescript#tanstack-db-realtimecollectionconfig) lists them all
- `refreshQuery` returns a fresh sealed query for the same query. The collection calls it before the current one expires and renews the subscription in place, keeping its rows. See [`refreshQuery`](../guides/reactivity#refreshquery)
- `gcTime: 0` turns off garbage collection in TanStack&nbsp;DB, which differs from TanStack&nbsp;Query, where `0` collects at once
- when the session is gone, the server function throws, and `leaveOnAuthLoss` loads the sign-in page. The full page load drops the collection, the connection and the cached rows

### Render the collection

Query the collection with TanStack&nbsp;DB's `useLiveQuery()`, and render its rows straight away, without waiting for `isReady`. The seeded rows are there for the first render, on the server and in the browser. Add the page component to `src/routes/_authed/index.tsx`, with one more import:

```tsx filename="src/routes/_authed/index.tsx"
import { useLiveQuery } from "@tanstack/react-db"

function TodosPage() {
  const { query } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  // Same id as the loader's, so this resolves to the collection it filled.
  const descriptor = todosCollection(user.id, query)
  // `isReady` turns true when Realtime sends its first complete result, and
  // stays true while it reconnects or renews the query. The SSR rows are on
  // screen before that.
  const { data: todos, isReady } = useLiveQuery({
    query: (q) =>
      q
        .from({ todo: descriptor })
        .orderBy(({ todo }) => todo.createdAt, "desc")
        .orderBy(({ todo }) => todo.id, "desc")
  })

  return (
    <main>
      <output>{isReady ? "live" : "connecting"}</output>

      <ul aria-live="polite">
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

On the first request, the rows go from the server's query to the live subscription in four steps:

1. on the server, the loader seeds the collection and `useLiveQuery()` reads it, so the HTML has the user's rows. Nothing subscribes on the server
2. `routerWithDbClient()` snapshots the collection into the HTML. In the browser, it restores the rows before the first render, so hydration matches the server's markup with no loading flash
3. after hydration, `useLiveQuery()` starts the collection's sync, which subscribes with the sealed query from the loader
4. the first result replaces the seeded rows in one step, and `isReady` turns true. Any change committed since the server read the rows is in that result

`useLiveQuery()` sorts the rows in the browser, newest first, because the live query has no `ORDER BY`. See [query the collection](../guides/reactivity#query-the-collection) for more local queries.

## Optimistic mutations

Write to the collection, and TanStack&nbsp;DB applies each change at once and calls your mutation handler. The handler sends the change to a server function, which writes it in a Postgres transaction and returns the transaction ID. The handler then waits for that ID to come back on the subscription, so the optimistic row hands over to the synced one in one step. The mutations guide explains [how optimistic mutations work](../guides/mutations#how-optimistic-mutations-work).

### Write to the collection

Call `insert()`, `update()` and `delete()` on the collection. Each applies at once and returns a TanStack&nbsp;DB transaction, which rejects if the write rolls back. Here's the page component with writes. It replaces the component, and the `@tanstack/react-db` and `../../todos.collection` imports, from [render the collection](#render-the-collection):

```tsx filename="src/routes/_authed/index.tsx"
import { useDbClient, useLiveQuery, type Transaction } from "@tanstack/react-db"
import { useState, type FormEvent } from "react"

import { NotSyncedYetError, todosCollection } from "../../todos.collection"

type Notice = { tone: "error" | "info"; text: string }

function TodosPage() {
  const { query } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  // Same id as the loader's, so this resolves to the collection it filled.
  const descriptor = todosCollection(user.id, query)
  const collection = useDbClient().collection(descriptor)
  // `isReady` turns true when Realtime sends its first complete result, and
  // stays true while it reconnects or renews the query. The SSR rows are on
  // screen before that.
  const { data: todos, isReady } = useLiveQuery({
    query: (q) =>
      q
        .from({ todo: descriptor })
        .orderBy(({ todo }) => todo.createdAt, "desc")
        .orderBy(({ todo }) => todo.id, "desc")
  })
  const [notice, setNotice] = useState<Notice | null>(null)

  // Changes apply optimistically. If one fails, TanStack DB rolls it back and
  // the reason shows here.
  function track(tx: Transaction) {
    setNotice(null)
    tx.when("settled").catch((cause: unknown) =>
      setNotice(
        cause instanceof NotSyncedYetError
          ? { tone: "info", text: "Saved. It will appear when live updates reconnect." }
          : { tone: "error", text: `Couldn't save that change: ${cause instanceof Error ? cause.message : String(cause)}` }
      )
    )
  }

  function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const title = String(new FormData(form).get("title") ?? "").trim()
    if (!title) return
    form.reset()
    track(
      collection.insert({
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: new Date()
      })
    )
  }

  return (
    <main>
      <output>{isReady ? "live" : "connecting"}</output>

      <form onSubmit={addTodo}>
        <input aria-label="Todo title" maxLength={200} name="title" placeholder="What needs doing?" required />
        <button type="submit">Add item</button>
      </form>

      {notice ? <p role={notice.tone === "error" ? "alert" : "status"}>{notice.text}</p> : null}

      <ul aria-live="polite">
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                aria-label={`Mark ${todo.title} as ${todo.completed ? "incomplete" : "complete"}`}
                checked={todo.completed}
                disabled={todo.$hasPendingWrites}
                onChange={() =>
                  track(
                    collection.update(todo.id, (draft) => {
                      draft.completed = !draft.completed
                    })
                  )
                }
                type="checkbox"
              />
              <span>{todo.title}</span>
            </label>
            <button
              aria-label={`Delete ${todo.title}`}
              disabled={todo.$hasPendingWrites}
              onClick={() => track(collection.delete(todo.id))}
              type="button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

- `useDbClient().collection(descriptor)` returns the collection the loader seeded, to write to
- the insert sets `id` and a provisional `createdAt` in the browser, so the new row has its final key and sorts to the top straight away. The synced row brings the server's timestamp
- `track` waits for each transaction's `when("settled")` promise, and shows a notice if the change rolls back. A [`NotSyncedYetError`](#send-writes-to-the-server) means the write committed but its change didn't come back in time, so the notice says it's saved
- `$hasPendingWrites` is `true` while a row has a pending optimistic change, which disables its checkbox and Delete button, so you don't start a new change on a todo whose last change isn't confirmed yet. TanStack&nbsp;DB runs handlers concurrently, so a toggle or delete sent straight after an insert could reach the database before the insert commits, match no rows and be lost

### Send writes to the server

Add `onInsert`, `onUpdate` and `onDelete` handlers to `realtimeCollectionOptions()` in `src/todos.collection.ts`, after `refreshQuery`. TanStack&nbsp;DB calls each one once per transaction, with all of its mutations, so each handler sends one batch to its server function. If the write changed rows, the handler waits for its transaction ID:

```ts filename="src/todos.collection.ts"
refreshQuery: () => refreshTodosQuery({ data: { userId } }).catch(leaveOnAuthLoss),
// One server call per transaction, with all of its mutations. Each also
// sends `userId`, so the server refuses writes from a page loaded for
// another user.
onInsert: async ({ transaction, collection }) => {
  const { txid } = await createTodos({
    data: {
      userId,
      batch: transaction.mutations.map(({ modified: { id, title, completed } }) => ({ id, title, completed }))
    }
  }).catch(leaveOnAuthLoss)
  if (txid) await collection.utils.awaitTxId(txid, ECHO_TIMEOUT_MS).catch(notSyncedYet)
},
onUpdate: async ({ transaction, collection }) => {
  const { txid } = await updateTodos({
    data: {
      userId,
      // The server keeps only `title` and `completed` from `changes`.
      batch: transaction.mutations.map(({ key, changes }) => ({ id: key, changes }))
    }
  }).catch(leaveOnAuthLoss)
  if (txid) await collection.utils.awaitTxId(txid, ECHO_TIMEOUT_MS).catch(notSyncedYet)
},
onDelete: async ({ transaction, collection }) => {
  const { txid } = await deleteTodos({
    data: { userId, batch: transaction.mutations.map(({ key }) => key) }
  }).catch(leaveOnAuthLoss)
  if (txid) await collection.utils.awaitTxId(txid, ECHO_TIMEOUT_MS).catch(notSyncedYet)
}
```

Then add what the handlers use at the top level of the file, and import the three write server functions next to `refreshTodosQuery`:

```ts filename="src/todos.collection.ts"
import { createTodos, deleteTodos, refreshTodosQuery, updateTodos } from "./todos.functions"

// How long a write waits for its own change to come back over Realtime. Keep it
// short: while a handler waits, TanStack DB holds back the collection's synced
// changes, including other tabs' writes.
const ECHO_TIMEOUT_MS = 10_000

// The write committed, but its change didn't come back over Realtime in time,
// for example while live updates reconnect. TanStack DB still rolls the change
// back, and it shows again once Realtime catches up.
export class NotSyncedYetError extends Error {}

function notSyncedYet(cause: unknown): never {
  throw new NotSyncedYetError("Saved, but not synced yet", { cause })
}
```

- [`collection.utils.awaitTxId(txid, timeout)`](../sdks/typescript#tanstack-db-realtimecollectionutilsawaittxid) waits until the subscription has delivered that transaction's changes. While a handler runs, TanStack&nbsp;DB holds back synced changes, so the optimistic row hands over to the synced one in one step
- TanStack&nbsp;DB rolls the change back if the server function throws, the wait times out, or the subscription errors or closes. The mutations guide covers [handlers with TanStack&nbsp;DB collections](../guides/mutations#with-tanstack-db-collections)
- `awaitTxId()` keeps waiting while the subscription reconnects or waits for a renewed sealed query, and the collection holds back synced changes while it waits. Keep the timeout short: `ECHO_TIMEOUT_MS` is 10 seconds, as in the guides
- once a handler has a txid, the write has committed, so `notSyncedYet` turns any failed wait into a `NotSyncedYetError`. The change still rolls back, but the page says it's saved rather than showing an error, and the change shows again when Realtime catches up

### Return the txid from the server

On the server, write each batch in one Postgres transaction and return the transaction's ID. Next to `selectTodos` in `src/todos.server.ts`, which already imports `db` and `sql`, add a helper that does both:

```ts filename="src/todos.server.ts"
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

// Runs `write` in a transaction and returns its transaction id, which the
// browser waits to see come back over Realtime. A write that changes no rows
// returns `{ txid: null }`: there's nothing to wait for and nothing to roll back.
export const writeTodos = (write: (tx: Tx) => Promise<number>) =>
  db.transaction(async (tx): Promise<{ txid: string | null }> => {
    if ((await write(tx)) === 0) return { txid: null }
    const { rows } = await tx.execute<{ txid: string }>(sql`select pg_current_xact_id()::text as txid`)
    return { txid: rows[0]!.txid }
  })
```

`pg_current_xact_id()` runs inside the same transaction as the write, so it returns the ID of the transaction that made the change. It's cast to `text`, because the collection waits for a decimal string. See [returning the txid from your backend](../guides/mutations#returning-the-txid-from-your-backend).

Then add one server function per mutation type to `src/todos.functions.ts`, with the imports they add (merge them into the existing `./todos.server` and `./todos.schemas` imports):

```ts filename="src/todos.functions.ts"
import { and, eq, inArray } from "drizzle-orm"

import { todos } from "./schema"
import { writeTodos } from "./todos.server"
import { newTodosInput, todoIdsInput, todoUpdatesInput } from "./todos.schemas"

// Each write takes a whole batch of changes from one TanStack DB transaction
// and returns its Postgres transaction id, or `null` if no row changed (for
// example, an id that's already gone).
export const createTodos = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(newTodosInput)
  .handler(({ data: { userId, batch }, context }) => {
    requireSameUser(userId, context.user)
    return writeTodos(async (tx) => {
      const inserted = await tx
        .insert(todos)
        .values(batch.map((todo) => ({ ...todo, userId: context.user.id })))
        .returning({ id: todos.id })
      return inserted.length
    })
  })

export const updateTodos = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(todoUpdatesInput)
  .handler(({ data: { userId, batch }, context }) => {
    requireSameUser(userId, context.user)
    return writeTodos(async (tx) => {
      let count = 0
      for (const { id, changes } of batch) {
        // Drizzle rejects an empty `set`.
        if (Object.values(changes).every((v) => v === undefined)) continue
        const updated = await tx
          .update(todos)
          .set(changes)
          .where(and(eq(todos.id, id), eq(todos.userId, context.user.id)))
          .returning({ id: todos.id })
        count += updated.length
      }
      return count
    })
  })

export const deleteTodos = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(todoIdsInput)
  .handler(({ data: { userId, batch }, context }) => {
    requireSameUser(userId, context.user)
    return writeTodos(async (tx) => {
      const deleted = await tx
        .delete(todos)
        .where(and(inArray(todos.id, batch), eq(todos.userId, context.user.id)))
        .returning({ id: todos.id })
      return deleted.length
    })
  })
```

- each call writes one TanStack&nbsp;DB transaction's batch in one Postgres transaction, so there's one txid to wait for
- the server functions take the user from the session, never from the browser. The zod input schemas in `src/todos.schemas.ts` strip unknown keys, so a row's `userId` can't come from the browser, and the `userId` the browser sends is only compared with the session's
- `updateTodos` and `deleteTodos` scope their `WHERE` to the session's user, so one user can't change another's rows

## Next steps

- read the guides on [reactivity](../guides/reactivity), [optimistic mutations](../guides/mutations) and [server-side rendering](../guides/ssr) for the concepts behind each step
- look up every `realtimeCollectionOptions()` option in the [TanStack&nbsp;DB section of the SDK reference](../sdks/typescript#tanstack-db)
- see the [Next.js example](./nextjs), which reads and seals in a Server Component and subscribes in a Client Component
- browse the [full source on GitHub](https://github.com/neondatabase/examples/tree/main/realtime/with-tanstack)

<NeedHelp/>
