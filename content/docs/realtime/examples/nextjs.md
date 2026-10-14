---
title: 'Next.js example'
subtitle: 'Full-stack example app using Realtime with Next.js.'
summary: >-
  Build a per-user todo app with Next.js, Kysely and Neon Auth on Neon Realtime: read and seal live queries in a Server Component, renew them through a Route Handler, and settle optimistic server action writes by txid.
enableTableOfContents: true
---

This example shows how to use Neon Realtime with [Next.js](https://nextjs.org), [Kysely](https://kysely.dev) and Neon Auth, with support for [auth](#authorize-with-the-session), [SSR](#server-side-rendering), [client-side reactivity](#client-side-reactivity) and [optimistic mutations](#optimistic-mutations).

The sections follow the same order as the guides, from [defining](#defining-queries) and [sealing](#sealing-queries) queries to writing to them, and show the Next.js code for each step.

<Admonition type="tip" title="Full example on GitHub">
The complete app is in the [`realtime/with-nextjs`](https://github.com/neondatabase/examples/tree/main/realtime/with-nextjs) folder of the `neondatabase/examples` repository.
</Admonition>

## Setup

Install the Realtime SDK with its Kysely adapter and React bindings:

```bash filename="Terminal"
npm install @neon/realtime @neon/realtime-kysely @neon/realtime-react
```

Add a `neon.ts` that enables Neon Auth and Realtime on your branch:

```ts filename="neon.ts"
import { defineConfig } from "@neon/config/v1"

export default defineConfig({
  auth: true,
  preview: {
    realtime: {
      allowedOrigins: ["http://localhost:3000"]
    }
  }
})
```

`allowedOrigins` lists the browser origins that can connect to Realtime. A missing origin doesn't raise an error: the subscription stays `connecting`, so add your app's origin when you deploy it. The [`neon.ts` reference](/docs/reference/neon-ts) covers the options.

Link the directory and run `neon deploy`, as in the [queries guide's setup](../guides/queries#setup). It writes `DATABASE_URL`, `NEON_REALTIME_URL`, `NEON_REALTIME_SECRET` and `NEON_AUTH_BASE_URL` to `.env.local`. If Realtime isn't ready before the deploy stops waiting, run `neon env pull` once it is.

Neon Auth's server SDK also needs a cookie secret of at least 32 characters, which comes from you:

```bash filename="Terminal"
printf '\nNEON_AUTH_COOKIE_SECRET=%s\n' "$(openssl rand -base64 32)" >> .env.local
```

The browser needs the Realtime URL too. You can pass it from the server as a prop when you [render the page](#render-in-a-server-component), instead of adding a `NEXT_PUBLIC_` copy as the [SSR guide](../guides/ssr#open-the-connection-in-the-browser) does.

Create anything that needs a secret on first use, not at module scope, because `next build` imports your modules without the runtime secrets. The `get*()` helpers on this page all do this, starting with `getEnv()` in `src/lib/env.ts`, which reads and checks these variables.

Note that `NEON_REALTIME_SECRET` never gets a `NEXT_PUBLIC_` prefix. The browser should only ever see the URL and sealed queries.

### Define the schema

Define your database schema. In this example, we're using Kysely and defining a single table:

```ts filename="src/lib/schema.ts"
import type { Generated } from "kysely"

// Keys equal the column names. Realtime builds live rows from PostgreSQL's result names, so a
// result-transforming plugin such as CamelCasePlugin would give live rows different keys from server rows.
export interface TodosTable {
  id: string; // uuid, created in the browser, so the optimistic row and the live row share it
  user_id: string; // uuid, the Neon Auth user id; only ever set from the session
  title: string;
  completed: Generated<boolean>;
  created_at: Generated<Date>; // timestamptz: pg and the Realtime client both parse it to a Date
}

export interface Database {
  realtime_next_todos: TodosTable;
}
```

Give the table a primary key, here `id`, and create it with a [Kysely migration](https://kysely.dev/docs/migrations) or your usual migration tool. A primary key is all Realtime needs from the table, as [table requirements](../guides/queries#table-requirements) explains.

## Defining queries

Define, run and seal your live queries on the server, both to provide `initialData` for SSR and to pass to the client to subscribe to.

### Define the live query

We then [define a query](../guides/queries#using-a-query-builder-or-orm) with Kysely. `getDb()` returns a Kysely client over a node-postgres (`pg`) pool, in `src/lib/db.ts`:

```ts filename="src/lib/todos.ts"
import "server-only"

import type { InferResult } from "kysely"

import { getDb } from "./db"

// The only place the live query is built. The server read, the seal and every renewal use it, so their
// fingerprints match.
function todosQuery(userId: string) {
  return getDb()
    .selectFrom("realtime_next_todos")
    .select(["id", "title", "completed", "created_at"])
    .where("user_id", "=", userId)
    .orderBy("created_at", "desc")
    .orderBy("id", "desc")
}

export type TodoRow = InferResult<ReturnType<typeof todosQuery>>[number]
```

`TodoRow` is the row type Kysely infers from the select. The browser imports it as a type only, so no server code reaches it. `userId` always comes from the [server session](#authorize-with-the-session), never from the browser, and this `WHERE` keeps each user's todos separate.

Live rows don't keep the query's `ORDER BY` order, so the browser [sorts them](#apply-writes-optimistically) too.

## Sealing queries

Seal the query on the server, for the user in the session. The browser can subscribe to a sealed query, but it can't read or change it, as the queries guide explains in [sealing queries](../guides/queries#sealing-queries).

### Create the Realtime server

The Realtime server, from [`createRealtime()`](../sdks/typescript#backend-createrealtime), holds the secret and seals queries. It should be created and then used in your trusted server code. Pass it [`kyselyAdapter()`](../sdks/typescript#kysely-kyselyadapter), so it can seal Kysely queries:

```ts filename="src/lib/realtime.ts"
import "server-only"

import { createRealtime } from "@neon/realtime/server"
import { kyselyAdapter } from "@neon/realtime-kysely"

import { getEnv } from "./env"

let realtime: ReturnType<typeof create> | undefined
function create() {
  const env = getEnv()
  return createRealtime({
    secret: env.realtimeSecret,
    db: env.database,
    adapter: kyselyAdapter(),
    debugMode: process.env.NODE_ENV === "development" // full database errors in dev only
  })
}
export const getRealtime = () => (realtime ??= create())
```

`import "server-only"` makes the build fail if a Client Component imports the file, as [the SSR guide explains](../guides/ssr#keep-secrets-on-the-server). `getRealtime()` creates the Realtime server once, on first use, and every request seals its own query with it. `debugMode` [shows full database errors](../guides/subscribing#show-full-database-errors) in development.

### Authorize with the session

Get the user from the [Neon Auth](/docs/auth/overview) session before you read, seal or write anything:

```ts filename="src/lib/auth/server.ts"
import "server-only"

import { createNeonAuth } from "@neondatabase/auth/next/server"

import { getEnv } from "../env"

let auth: ReturnType<typeof createNeonAuth> | undefined
/** Lazy: createNeonAuth checks the cookie secret when constructed, and throws without it. */
export function getAuth() {
  return (auth ??= createNeonAuth({
    baseUrl: getEnv().authBaseUrl,
    cookies: { secret: getEnv().authCookieSecret }
  }))
}

/**
 * The signed-in user, or null. Call it first in every Server Component data path, Server Action and
 * Route Handler: proxy.ts is not the security boundary. Never accept a user id from the client.
 */
export async function getUser() {
  const { data, error } = await getAuth().getSession() // returns { data, error }; doesn't throw on HTTP errors
  // If Neon Auth can't be reached, treat the request as signed out.
  if (error) console.warn("[auth] getSession failed", error.code)
  return data?.user ?? null
}
```

`getUser()` wraps [`auth.getSession()`](/docs/auth/reference/nextjs-server#auth-getsession), and treats the request as signed out if Neon Auth can't be reached. Mount [`auth.handler()`](/docs/auth/reference/nextjs-server#auth-handler) in a catch-all Route Handler, such as `src/app/api/auth/[...path]/route.ts`. Render Neon Auth's [prebuilt sign-in UI](/docs/auth/reference/ui-components#nextjs-app-router) inside `NeonAuthUIProvider`, as in the [Neon Auth Next.js quick start](/docs/auth/quick-start/nextjs-api-only).

Make sign-in and sign-out full page loads, so they drop the browser's Realtime client and the previous user's rows. In `NeonAuthUIProvider`, set a flag in `onSessionChange`, and once it's set, have `navigate` call `window.location.assign()` instead of `router.push()`.

### Seal in a Route Handler

Expose the sealed query from a POST [Route Handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), as in [exposing an endpoint](../guides/queries#exposing-an-endpoint).

The browser calls it to [renew the sealed query](../guides/queries#renewing-sealed-queries) before it expires, so it has to seal exactly the same query. Add a helper to `src/lib/todos.ts`, and put its import at the top of the file:

```ts filename="src/lib/todos.ts"
import { getRealtime } from "./realtime"

export const sealTodos = (userId: string) => getRealtime().seal({ query: todosQuery(userId) })
```

Then call it from the Route Handler, for the user in the session:

```ts filename="src/app/api/todos/live-query/route.ts"
import { getUser } from "../../../../lib/auth/server"
import { sealTodos } from "../../../../lib/todos"

const noStore = { "Cache-Control": "no-store" }

// A cross-site POST carries no SameSite=Lax session cookie, so it gets a 401.
export async function POST() {
  const user = await getUser()
  if (!user) return Response.json({ error: "UNAUTHENTICATED" }, { status: 401, headers: noStore })
  return Response.json(await sealTodos(user.id), { headers: noStore })
}
```

Next.js runs server actions one at a time, so renew through a Route Handler rather than a server action, as the [subscribing guide](../guides/subscribing#fetch-from-a-server-function) recommends. The handler takes no input, because the user comes from the session cookie. `Cache-Control: no-store` keeps the sealed query, a [bearer token](../guides/queries#sealing-queries), out of caches.

## Server-side rendering

Next.js renders the first request on the server. To put the user's rows in that HTML and keep them live in the browser:

1. read and seal the query in one function
2. call it from a Server Component at request time, and pass the initial query results and the sealed query to a Client Component as props
3. create the Realtime client in the browser, where the Client Component subscribes after hydration

The SSR guide covers the pattern in [send both to the browser](../guides/ssr#send-both-to-the-browser).

### Read and seal together

Run the query and seal it in the same function, so the rows and the sealed query match, as in [return the sealed query and initial results](../guides/ssr#return-the-sealed-query-and-initial-results). Add it to `src/lib/todos.ts`, which already imports everything it uses:

```ts filename="src/lib/todos.ts"
// Read and seal the same query. The stream's first full result replaces these rows, so nothing is missed
// or doubled.
export async function loadTodos(userId: string) {
  const query = todosQuery(userId)
  const [rows, sealedQuery] = await Promise.all([
    query.execute(),
    getRealtime().seal({ query }) // compiles the builder to SQL; never runs it
  ])
  return { rows, sealedQuery }
}
```

[`seal()`](../sdks/typescript#backend-realtimeserverseal) returns a typed [`SealedLiveQuery<TodoRow>`](../sdks/typescript#backend-sealedlivequery), so the row type flows through to the Client Component.

### Render in a Server Component

Call `loadTodos()` from an async Server Component, for the user in the session, and pass the results to the Client Component as props:

```tsx filename="src/app/todos.tsx"
import { redirect } from "next/navigation"
import { connection } from "next/server"

import { getUser } from "../lib/auth/server"
import { getEnv } from "../lib/env"
import { loadTodos } from "../lib/todos"

import { RealtimeRoot } from "./realtime-root"
import { TodoList } from "./todo-list"

export async function Todos() {
  // Request time only. During `next build` connection() never resolves, so nothing below runs at build.
  // The sealed query is a bearer token for this user's data: never prerender or cache it.
  await connection()
  const user = await getUser()
  // Backstop: proxy.ts already redirected signed-out page loads over HTTP.
  if (!user) redirect("/auth/sign-in")
  const { rows, sealedQuery } = await loadTodos(user.id)
  return (
    // Keyed on the query's identity. A re-render for the same query (router.refresh(), a cookie refresh)
    // keeps the subscription. Another user, or a deploy that changed the SQL, remounts the list (see todo-list.tsx).
    <RealtimeRoot key={sealedQuery.queryFingerprint} url={getEnv().realtimeUrl}>
      <TodoList initialTodos={rows} sealedQuery={sealedQuery} />
    </RealtimeRoot>
  )
}
```

[`connection()`](https://nextjs.org/docs/app/api-reference/functions/connection) waits for an incoming request, so the component never prerenders and its output, which belongs to one user and one request, is never cached. The SSR guide uses `force-dynamic` for the same reason. `connection()` also works when your app enables `cacheComponents`, inside a `<Suspense>` boundary.

The key on `queryFingerprint` keeps the subscription across re-renders for the same query, and remounts the list when the query changes, for example when another user signs in.

Render the component inside a `<Suspense>` boundary, so the rest of the page renders at once and the list streams in:

```tsx filename="src/app/page.tsx"
import { Suspense } from "react"

import { Todos } from "./todos"

// No data access here: the static shell renders at once and <Todos /> streams in at request time.
export default function Page() {
  return (
    <main>
      <Suspense fallback={<p>Loading todos</p>}>
        <Todos />
      </Suspense>
    </main>
  )
}
```

### Redirect signed-out visitors

Inside `<Suspense>`, `redirect()` only takes effect in the browser, after the page has started streaming. To send signed-out page loads a real HTTP redirect, check the session in the [proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) too:

```ts filename="src/proxy.ts"
import type { NextRequest } from "next/server"

import { getAuth } from "./lib/auth/server"

let middleware: ReturnType<ReturnType<typeof getAuth>["middleware"]> | undefined

export default function proxy(request: NextRequest) {
  // Server Actions check the session themselves and return { kind: "rejected", reason: "UNAUTHENTICATED" }.
  // A redirect here would reach the client as an unexplained failure.
  if (request.headers.has("next-action")) return
  middleware ??= getAuth().middleware({ loginUrl: "/auth/sign-in" })
  return middleware(request)
}

// Only the app page. /auth/* is public, and /api/* routes answer 401 themselves. Add new app pages here.
export const config = { matcher: ["/"] }
```

[`auth.middleware()`](/docs/auth/reference/nextjs-server#auth-middleware) does the redirect and refreshes the session cookies. The redirect is for the user experience only: every Server Component, Route Handler and server action checks the session again with `getUser()`.

### Create the Realtime client in the browser

Create the Realtime client once, inside the React tree, in a `useState` initializer, and provide it with [`RealtimeProvider`](../sdks/typescript#react-realtimeprovider). This is [open the connection in the browser](../guides/ssr#open-the-connection-in-the-browser) as a Client Component:

```tsx filename="src/app/realtime-root.tsx"
"use client"

import { createRealtimeClient } from "@neon/realtime/client"
// @neon/realtime-react's build has no "use client" directive: import it only from client modules.
import { RealtimeProvider } from "@neon/realtime-react"
import { type ReactNode, useState } from "react"

export function RealtimeRoot({ url, children }: { url: string; children: ReactNode }) {
  // No parsers: the client's defaults match node-postgres, which Kysely's PostgresDialect uses on the server.
  const [client] = useState(() => createRealtimeClient({ url }))
  return <RealtimeProvider client={client}>{children}</RealtimeProvider>
}
```

Creating the client doesn't connect, so it's safe during the server render. It connects on the first subscribe and disconnects after the last one ends, so you don't need an effect that closes it. With the default parsers, live rows have the same types as the rows Kysely reads on the server, and Server Component props keep `created_at` a `Date`, as [keep row shapes identical](../guides/ssr#keep-row-shapes-identical) explains.

Render `RealtimeRoot` around the components that subscribe. With one live query on the page, it can wrap that component and share its key, as `Todos` does. With several, render it higher up, for example in your root layout, and key each subscribing component on its own `queryFingerprint`.

## Client-side reactivity

In the browser, [`useLiveQuery()`](../sdks/typescript#react-uselivequery) subscribes to the sealed query and re-renders with each result. It's standard React, so the reactivity guide covers the hook in [React](../guides/reactivity#react). With Next.js, the Client Component also has to survive server re-renders and renew through the Route Handler.

### Subscribe with `useLiveQuery()`

Render the server's rows straight away, and keep them live. This is the start of the `TodoList` Client Component:

```tsx filename="src/app/todo-list.tsx"
"use client"

import type { SealedLiveQuery } from "@neon/realtime/client"
// @neon/realtime-react's build has no "use client" directive: import it only from client modules.
import { useLiveQuery } from "@neon/realtime-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import type { TodoRow } from "../lib/todos" // type-only: erased at build, so no server code reaches the browser

export function TodoList({
  initialTodos,
  sealedQuery
}: {
  initialTodos: TodoRow[]
  sealedQuery: SealedLiveQuery<TodoRow>
}) {
  const router = useRouter()

  // Keep the first sealed query. useLiveQuery restarts its subscription whenever it gets a new object, and
  // every server re-render (router.refresh(), a Server Action that sets a cookie) sends one for the same
  // query. Renewals go through refreshQuery. A different query remounts this list through the key in todos.tsx.
  const [query] = useState(sealedQuery)

  const signedOut = useRef(false)
  const refreshQuery = useCallback(async (): Promise<SealedLiveQuery<TodoRow>> => {
    // The hook retries a failed renewal every second until one succeeds. After a 401, stop calling the
    // server and go to sign-in with a full page load, which drops the Realtime client and this user's rows.
    if (signedOut.current) throw new Error("Signed out")
    const response = await fetch("/api/todos/live-query", { method: "POST", cache: "no-store" })
    if (response.status === 401) {
      signedOut.current = true
      window.location.assign("/auth/sign-in")
      throw new Error("Signed out")
    }
    if (!response.ok) throw new Error(`Live query renewal failed: ${response.status}`)
    return (await response.json()) as SealedLiveQuery<TodoRow>
  }, [])

  const { data, status, error, utils } = useLiveQuery(query, { initialData: initialTodos, refreshQuery })

  useEffect(() => {
    // The renewal came back for a different query: another user signed in on this browser, or a deploy
    // changed the SQL. Re-render, and the new fingerprint remounts this list (todos.tsx).
    if (error?.code === "QUERY_REFRESH_FAILED") router.refresh()
  }, [error, router])
```

Server re-renders are routine in Next.js: `router.refresh()` and server actions that set cookies both cause them. Each one sends a new sealed-query object for the same query, so keep the first one in state, as [send both to the browser](../guides/ssr#send-both-to-the-browser) explains, and renew through [`refreshQuery`](../guides/reactivity#refreshquery), which posts to the [Route Handler](#seal-in-a-route-handler).

A 401 from the Route Handler means the user has signed out. `refreshQuery` stops calling the server and goes to sign-in with a full page load. That unmounts the list, as [handling errors](../guides/reactivity#handling-errors) recommends, and drops the Realtime client and the user's rows. A `QUERY_REFRESH_FAILED` error usually means the renewal came back for a different query, so refresh the route, and the new fingerprint remounts the list. The `error` status is final for a subscription, and there's no client API to restart one, so while the status is `error`, offer a button that calls `window.location.reload()`.

On the first request, the rows go from the server's query to the live subscription in four steps:

1. on the server, the Server Component reads and seals the query, and the Client Component renders the rows with the status `connecting`. Nothing subscribes on the server
2. in the browser, React hydrates the same rows from the props, so the markup matches with no loading flash
3. after hydration, `useLiveQuery()` opens the connection and subscribes with the sealed query
4. the first result replaces the initial rows in one step, and the status becomes `live`. Any change committed since the server read the rows is in that result

## Optimistic mutations

Apply each change to local, optimistic state at once, and send it to a server action. The action writes it in Postgres and returns the transaction ID, and the component holds the optimistic change until that ID comes back on the subscription. The mutations guide explains [how optimistic mutations work](../guides/mutations#how-optimistic-mutations-work) and covers [React's `useOptimistic` hook](../guides/mutations#with-reacts-useoptimistic-hook).

### Apply writes optimistically

Run each write in a transition with `startTransition`, apply it with `useOptimistic`, and keep the transition open until [`utils.awaitTxId()`](../sdks/typescript#react-uselivequeryutils) sees the write's txid. At the top level of `src/app/todo-list.tsx`, add `FormEvent`, `startTransition`, `useMemo` and `useOptimistic` to the `react` import, then add:

```tsx filename="src/app/todo-list.tsx"
import { addTodo, deleteTodo, setTodoCompleted, type WriteResult } from "./actions"

type OptimisticTodo = TodoRow & { pending?: true }
type OptimisticAction =
  | { type: "add"; todo: TodoRow }
  | { type: "toggle"; id: string; completed: boolean }
  | { type: "delete"; id: string }
type Notice = { tone: "error" | "info"; text: string }

// React re-applies pending actions to every new live snapshot, including one that already contains the
// change. So each case must be safe to re-run, and must set absolute values.
function applyOptimisticAction(todos: readonly OptimisticTodo[], action: OptimisticAction): readonly OptimisticTodo[] {
  switch (action.type) {
    case "add":
      return todos.some((t) => t.id === action.todo.id) ? todos : [{ ...action.todo, pending: true }, ...todos]
    case "toggle":
      // Only dim rows the stream hasn't confirmed yet.
      return todos.map((t) =>
        t.id === action.id && t.completed !== action.completed ? { ...t, completed: action.completed, pending: true } : t
      )
    case "delete":
      return todos.filter((t) => t.id !== action.id)
  }
}

// The live rows don't follow the query's ORDER BY, so sort here. The server render and hydration run the
// same sort, so the markup matches.
// Newest first, optimistic rows included (they carry the browser's created_at until the live row replaces them).
const newestFirst = (a: OptimisticTodo, b: OptimisticTodo) =>
  b.created_at.getTime() - a.created_at.getTime() || (a.id < b.id ? 1 : a.id > b.id ? -1 : 0)

// How long a write stays pending while it waits for its transaction to arrive on the stream. Keep it short:
// React holds every transition started meanwhile (router.refresh(), navigations, sign-out) until it settles.
const SYNC_TIMEOUT_MS = 10_000
```

Inside `TodoList`, after the `QUERY_REFRESH_FAILED` effect, layer the optimistic state over `data` and send every write through `mutate()`:

```tsx filename="src/app/todo-list.tsx"
  const [optimisticTodos, updateOptimistically] = useOptimistic<readonly OptimisticTodo[], OptimisticAction>(
    data ?? initialTodos,
    applyOptimisticAction
  )
  const todos = useMemo(() => [...optimisticTodos].sort(newestFirst), [optimisticTodos])
  const [notice, setNotice] = useState<Notice | null>(null)

  function mutate(action: OptimisticAction, write: () => Promise<WriteResult>, failure: string) {
    setNotice(null)
    startTransition(async () => {
      // The optimistic change lasts exactly as long as this transition.
      updateOptimistically(action)
      let result: WriteResult
      try {
        result = await write()
      } catch {
        // Network failure, a deploy that removed the action, or a server error. The change rolls back.
        setNotice({ tone: "error", text: failure })
        return
      }
      if (result.kind === "rejected") {
        if (result.reason === "UNAUTHENTICATED")
          window.location.assign("/auth/sign-in") // a full page load, like the 401 above
        else setNotice({ tone: "error", text: failure })
        return
      }
      if (result.kind === "unchanged") return // nothing to wait for
      try {
        // Hold the transition until the stream has applied this transaction. The rows are published before
        // the wait resolves, so the live data already contains the write: no flicker and no duplicate.
        await utils.awaitTxId(result.txid, SYNC_TIMEOUT_MS)
      } catch {
        // Committed but not seen yet (the stream is reconnecting or has stopped, or the list unmounted).
        setNotice({ tone: "info", text: "Saved. It will appear when live updates reconnect." })
      }
    })
  }

  function addTodoFromForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const title = String(new FormData(form).get("title") ?? "").trim()
    if (!title) return
    // Reset now. <form action>'s automatic reset waits for the whole transition, which stays open until the
    // stream confirms the write, so it would erase whatever was typed in the meantime.
    form.reset()
    const todo: TodoRow = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      created_at: new Date()
    }
    mutate({ type: "add", todo }, () => addTodo({ id: todo.id, title }), `Couldn't add "${title}".`)
  }
```

Toggles and deletes call `mutate()` the same way, with `setTodoCompleted()` and `deleteTodo()`. Render `todos`, `status` and `notice`, with a form that calls `addTodoFromForm`. The [full component](https://github.com/neondatabase/examples/blob/main/realtime/with-nextjs/src/app/todo-list.tsx) is on GitHub.

The browser generates each new todo's `id`, so the optimistic row and the live row share a key, and the `add` case doesn't add a row that's already there. `SYNC_TIMEOUT_MS` is 10 seconds, as in the guides.

### Return the txid from a server action

On the server, each write is a server action that returns the transaction ID:

```ts filename="src/app/actions.ts"
"use server"

import { sql } from "kysely"
import { z } from "zod"

import { getUser } from "../lib/auth/server"
import { getDb } from "../lib/db"

// Typed results rather than throws: in production Next.js hides a thrown error's message.
export type WriteResult =
  | { kind: "committed"; txid: string }
  | { kind: "unchanged" } // nothing matched: deleted elsewhere, someone else's id, or a replayed add
  | { kind: "rejected"; reason: "UNAUTHENTICATED" | "INVALID_INPUT" }

const addInput = z.object({ id: z.uuid(), title: z.string().trim().min(1).max(200) })
const setCompletedInput = z.object({ id: z.uuid(), completed: z.boolean() })
const deleteInput = z.object({ id: z.uuid() })

// Same statement, same transaction; works on any driver.
const txid = sql<string>`pg_current_xact_id()::text`.as("txid")
const toResult = (row?: { txid: string }): WriteResult =>
  row ? { kind: "committed", txid: row.txid } : { kind: "unchanged" }

export async function addTodo(raw: z.input<typeof addInput>): Promise<WriteResult> {
  const user = await getUser() // every action checks the session itself: proxy.ts skips actions
  if (!user) return { kind: "rejected", reason: "UNAUTHENTICATED" }
  const input = addInput.safeParse(raw)
  if (!input.success) return { kind: "rejected", reason: "INVALID_INPUT" }
  const row = await getDb()
    .insertInto("realtime_next_todos")
    .values({ id: input.data.id, user_id: user.id, title: input.data.title }) // user_id from the session only
    .onConflict((oc) => oc.column("id").doNothing()) // replayed id: no write, nothing to wait for
    .returning(txid)
    .executeTakeFirst()
  return toResult(row)
}

export async function setTodoCompleted(raw: z.input<typeof setCompletedInput>): Promise<WriteResult> {
  const user = await getUser()
  if (!user) return { kind: "rejected", reason: "UNAUTHENTICATED" }
  const input = setCompletedInput.safeParse(raw)
  if (!input.success) return { kind: "rejected", reason: "INVALID_INPUT" }
  const row = await getDb()
    .updateTable("realtime_next_todos")
    .set({ completed: input.data.completed })
    .where("id", "=", input.data.id)
    .where("user_id", "=", user.id) // only the user's own row
    .returning(txid)
    .executeTakeFirst()
  return toResult(row)
}

export async function deleteTodo(raw: z.input<typeof deleteInput>): Promise<WriteResult> {
  const user = await getUser()
  if (!user) return { kind: "rejected", reason: "UNAUTHENTICATED" }
  const input = deleteInput.safeParse(raw)
  if (!input.success) return { kind: "rejected", reason: "INVALID_INPUT" }
  const row = await getDb()
    .deleteFrom("realtime_next_todos")
    .where("id", "=", input.data.id)
    .where("user_id", "=", user.id) // only the user's own row
    .returning(txid)
    .executeTakeFirst()
  return toResult(row)
}
```

`RETURNING pg_current_xact_id()::text` runs in the same statement as the write, so it returns the ID of the transaction that made the change, with no explicit transaction. It's cast to `text`, because `awaitTxId()` waits for a decimal string. See [returning the txid from your backend](../guides/mutations#returning-the-txid-from-your-backend).

Each action takes the user from the session, never from the browser, and zod validates everything else the browser sends. The `user_id` in each `WHERE` means one user can't change another's rows. Next.js runs server actions one at a time, so writes reach the server in the order you make them, each with its own optimistic change.

Don't revalidate after a write. The live query already delivers it, and a revalidation only re-renders the page to read and seal the same query again.

## Next steps

- read the guides on [reactivity](../guides/reactivity), [optimistic mutations](../guides/mutations) and [server-side rendering](../guides/ssr) for the concepts behind each step
- look up `useLiveQuery()` and `RealtimeProvider` in the [React section of the SDK reference](../sdks/typescript#react)
- see the [TanStack example](./tanstack), which seeds a TanStack&nbsp;DB collection in a route loader and writes through collection handlers
- browse the [full source on GitHub](https://github.com/neondatabase/examples/tree/main/realtime/with-nextjs)

<NeedHelp/>
