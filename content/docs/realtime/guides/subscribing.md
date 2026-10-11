---
title: 'Subscribing to queries'
subtitle: 'Subscribe to live queries using the Realtime client.'
summary: >-
  Subscribe to live queries from trusted backend code or the browser. Fetch sealed queries from your API, handle every callback and renew sealed queries before they expire.
enableTableOfContents: true
---

Once you've [defined](./queries) and [sealed](./queries#sealing-queries) a query, you can [subscribe&nbsp;to&nbsp;it](#subscribe-to-the-sealed-query) using the [low&#8209;level Realtime&nbsp;client](../sdks/typescript#client-createrealtimeclient).

<Admonition type="important" title="Client-side reactivity">
Manual subscriptions are a relatively low-level API. Most apps and agents can use the [higher&#8209;level reactivity&nbsp;primitives](./reactivity) that manage the subscription for you.
</Admonition>

## Getting the query to subscribe to

Workers, trusted agents and other backend processes can [subscribe to a query&nbsp;directly](#subscribe-in-trusted-backend-code).

However, to subscribe to a live query in an untrusted environment, you'll need to [expose a sealed query from your backend](./queries#exposing-queries), either a [standard API endpoint](#fetch-from-an-api-endpoint) or [using a server function](#fetch-from-a-server-function) (where [SSR](./ssr) can embed the sealed query and the initial results).

<Admonition type="tip" title="Running example">
The guide continues the [running example](https://github.com/neondatabase/examples/tree/main/realtime/realtime-guides-chat-app) introduced in the [Defining&nbsp;queries](./queries#setup)&nbsp;guide.
</Admonition>

### Subscribe in trusted backend code

Add a `url` to [`createRealtime()`](../sdks/typescript#backend-createrealtime) and it returns a direct server, which seals queries with your secret and subscribes to them itself.

```ts filename="backend/worker.ts" {11,19,20,22}
import { createRealtime } from "@neon/realtime/server"
import { drizzleAdapter } from "@neon/realtime-drizzle"

import { messagesQuery } from "./queries"

// The worker acts for one known user, so its parameters are trusted constants
const SUPPORT_BOT_ID = "support-bot"
const SUPPORT_CHANNEL_ID = 2

const realtime = createRealtime({
  url: process.env.NEON_REALTIME_URL!,
  secret: process.env.NEON_REALTIME_SECRET!,
  db: "neondb",
  adapter: drizzleAdapter()
})

const query = messagesQuery(SUPPORT_BOT_ID, SUPPORT_CHANNEL_ID)

const subscription = await realtime.subscribe(query)
subscription.onChange(console.log)

process.once("SIGTERM", () => realtime.close())
```

<Admonition type="warning" title="Untrusted parameters">
Never fill a direct subscription's parameters from untrusted input.
</Admonition>

`NEON_REALTIME_URL` is the URL from the [Realtime page](../quickstart#enable-realtime) in the Neon Console. Note the `await`: the direct server's `subscribe()` is async, because it seals the query locally before it subscribes. The browser client's `subscribe()` is synchronous. Otherwise it's the same subscription, with the same options and [callbacks](#listen-for-changes) as the client's.

The direct server renews its own sealed queries and recovers from outages until you close the subscription or it moves to `error`. An error is final, so a long-running worker should watch for it with `onStateChange` and subscribe again. `realtime.close()` closes every subscription and the shared WebSocket. The direct server needs a global `WebSocket`, which Node.js 22 and later have built in.

Use direct subscriptions for workers, trusted agents and server-side fan-out. The [Mastra example](../examples/mastra) uses them to drive agent workflows.

### Fetch from an API endpoint

Most queries depend on who's asking, and often on what they're asking for.

If you've [exposed your sealed query via an API endpoint](./queries#exposing-an-endpoint), you can provide this context via the request data using your standard auth machinery, such as [Neon Auth](/docs/auth/overview):

```ts filename="frontend/auth.ts"
import { createAuthClient } from "@neondatabase/auth"

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL, {
  fetchOptions: { credentials: "include" }
})
```

In our running example, we create a typed client for the API with Hono's `hc`. It takes its routes from `AppType`, so every call is checked against the backend:

```ts filename="frontend/api.ts"
import type { SealedLiveQuery } from "@neon/realtime/client"
import { hc } from "hono/client"

import type { Message } from "../backend/schema"
import type { AppType } from "../backend/server"
import { authClient } from "./auth"

export const server = hc<AppType>(window.location.origin, {
  headers: async (): Promise<Record<string, string>> => {
    const { data } = await authClient.token()

    return data?.token ? { Authorization: `Bearer ${data.token}` } : {}
  }
})

export async function fetchSealedMessages(channelId: number): Promise<SealedLiveQuery<Message>> {
  const res = await server.api.v1.messages.live.$post({ json: { channelId } })

  if (!res.ok) {
    throw new Error(`Could not fetch the sealed query (${res.status})`)
  }

  return (await res.json()) as SealedLiveQuery<Message>
}
```

Hono's client types the response body as JSON, so the `Date` in `created_at` shows up as a `string`. The `as` restores the row type that the Realtime client decodes at runtime.

The `headers` function runs before each request and adds a fresh token, because Neon Auth tokens only last about 15 minutes. Without a session there's no token, so the API answers 401.

### Fetch from a server function

If your framework supports [server functions](https://react.dev/reference/rsc/server-functions), you can expose the sealed query from one instead of an API endpoint. Client code calls a server function like a local async function, so it can take the place of `fetchSealedMessages()` [above](#fetch-from-an-api-endpoint). With [SSR](./ssr), the page can also embed the sealed query and the initial query results on the server.

See [Using server functions](./queries#using-server-functions), the [Server-side rendering](./ssr) guide and the [TanStack](../examples/tanstack) example for more details.

<Admonition type="important" title="Next.js uses Route Handlers">
In Next.js, server functions are server actions, which run one at a time, so renew through a [Route Handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) instead, as the [Next.js](../examples/nextjs) example shows.
</Admonition>

## Subscribe to the sealed query

Create one client for the whole app, because every subscription shares its connection:

```ts filename="frontend/client.ts"
import { createRealtimeClient } from "@neon/realtime/client"

export const client = createRealtimeClient({ url: import.meta.env.VITE_NEON_REALTIME_URL })
```

The client opens its WebSocket lazily, on the first subscription, and multiplexes every subscription over that one connection. The first sealed query binds the connection to its database, so every subscription on a client must target the same `db`. The connection carries no user identity. Each subscription brings its own sealed query.

Now fetch the sealed query, subscribe to it and render every change:

```ts filename="frontend/app.ts"
import type { LiveQuerySnapshot, LiveQueryState } from "@neon/realtime/client"

import type { Message } from "../backend/schema"
import { fetchSealedMessages } from "./api"
import { client } from "./client"

const list = document.querySelector<HTMLUListElement>("#messages")!
const statusLine = document.querySelector<HTMLParagraphElement>("#status")!

// A real app takes the channel from its router
const channelId = 2

const sealedQuery = await fetchSealedMessages(channelId)
const subscription = client.subscribe(sealedQuery)

subscription.onChange(render)

window.addEventListener("beforeunload", () => {
  subscription.unsubscribe()
  client.close()
})

function render(snapshot: LiveQuerySnapshot<Message>) {
  statusLine.textContent = describe(snapshot)
  list.replaceChildren(...(snapshot.data ?? []).map(renderMessage))
}

function describe(state: LiveQueryState): string {
  switch (state.status) {
    case "connecting":
      return "Loading messages"
    case "live":
      return "Up to date"
    case "stale":
      return "Updating. Messages may be out of date."
    case "error":
      return `Stopped: ${state.error.message}`
    case "closed":
      return "Closed"
  }
}

function renderMessage(message: Message): HTMLLIElement {
  const item = document.createElement("li")

  item.textContent = `${message.created_at.toLocaleTimeString()} ${message.body}`

  return item
}
```

`subscribe()` returns a materialized subscription, which keeps the current rows for you. `onChange` gets a snapshot of the rows and the subscription's state whenever either changes, so the render reads `data`, `status` and `error` from one consistent value. `data` is `undefined` until the first result arrives.

Rows arrive decoded, so `created_at` is a `Date`, as Drizzle's `Message` type says. The client's default parsers decode these Postgres types:

| Postgres type                              | Arrives as                           |
| ------------------------------------------ | ------------------------------------ |
| `bool`                                     | `boolean`                            |
| `int2`, `int4`, `oid`, `float4`, `float8`  | `number`                             |
| `json`, `jsonb`                            | The parsed JSON value                |
| `timestamptz`                              | `Date`                               |
| `timestamp`                                | `Date` in local time                 |
| `date`                                     | `Date` at local midnight             |
| `bytea`                                    | `Uint8Array`                         |
| `int8`, `numeric`                          | `string`, so their values stay exact |
| Everything else, such as `text` and `uuid` | `string`, as Postgres formats it     |

`NULL` arrives as `null`, and arrays of built-in types decode element by element.

When you're done with a subscription, call `unsubscribe()`. It moves the subscription to `closed`, so any listeners get a final `closed` update, and then stops all further callbacks. `client.close()` does the same for every subscription on the client, and closes the WebSocket.

## Listen for changes

A subscription has four callbacks. Each one takes a listener and returns a function that removes it:

| Callback        | Listener arguments                                                         | Fires                                                                                                                                  |
| --------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `onChange`      | `snapshot: LiveQuerySnapshot<Row>`                                         | After every reset, batch and state change, with the current rows and state. Materialized subscriptions only.                           |
| `onStateChange` | `state: LiveQueryState`                                                    | When the status changes.                                                                                                               |
| `onReset`       | `rows: readonly RawLiveQueryRow<Row>[]`, each `{ rowId, row }`             | When a complete, authoritative result replaces the previous one.                                                                       |
| `onBatch`       | `changes: readonly LiveQueryChange<Row>[]` and `batch: LiveQueryBatchInfo` | When committed transactions change the result. Each change is an `upsert` with a `rowId` and `row`, or a `remove` with only a `rowId`. |

Listeners run in the order you add them, and one that throws doesn't stop the others. Each initial result and each committed transaction becomes visible atomically. Outside a listener, `getSnapshot()` and `getState()` return the current values.

The status tells you how far to trust the rows:

| Status       | Meaning                                                                                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `connecting` | Waiting for the first result. With `initialData` from a [server render](./ssr), a subscription starts in `stale` instead.                                                           |
| `live`       | The rows are authoritative and changes are streaming.                                                                                                                               |
| `stale`      | The rows are usable but not yet confirmed current: after a [server render](./ssr), while the client reconnects, or while it recovers an expired sealed query. Render them normally. |
| `error`      | Automatic recovery has stopped. See [handle errors](#handle-errors).                                                                                                                |
| `closed`     | Closed by `unsubscribe()` or `client.close()`. It doesn't reopen.                                                                                                                   |

By default, subscriptions are materialized. The client keeps the rows and applies each batch before `onBatch` fires, so `getSnapshot()` in a batch listener already includes it. If your code keeps its own rows, as TanStack&nbsp;DB does, pass `{ materialize: false }` for a raw subscription. It has the same callbacks except `onChange`, and no `getSnapshot()`. Keep the rows in a map keyed by `rowId`, replace them on each reset and apply each batch's upserts and removes:

```ts filename="frontend/raw-messages.ts"
import type {
  LiveQueryBatchInfo,
  LiveQueryChange,
  LiveQueryState,
  RawLiveQueryRow
} from "@neon/realtime/client"

import type { Message } from "../backend/schema"
import { fetchSealedMessages } from "./api"
import { client } from "./client"

const channelId = 2

// Keyed by rowId, which is only valid until the next reset
const rows = new Map<string, Message>()

const subscription = client.subscribe(await fetchSealedMessages(channelId), { materialize: false })

subscription.onReset((reset: readonly RawLiveQueryRow<Message>[]) => {
  rows.clear()

  for (const { rowId, row } of reset) {
    rows.set(rowId, row)
  }
})

subscription.onBatch((changes: readonly LiveQueryChange<Message>[], batch: LiveQueryBatchInfo) => {
  for (const change of changes) {
    if (change.type === "upsert") {
      rows.set(change.rowId, change.row)
    } else {
      rows.delete(change.rowId)
    }
  }

  console.log(`${rows.size} messages after transactions ${batch.txids.join(", ")}`)
})

subscription.onStateChange((state: LiveQueryState) => {
  console.log(state.status, state.error?.message ?? "")
})
```

A `rowId` is opaque and scoped to its subscription, and each reset invalidates every earlier one. It isn't a primary key, so don't store it or match it against your own ids. A reset can arrive at any time, for example after a reconnect, and it always replaces the whole result.

Each batch also carries the ids of the Postgres transactions it covers, in `batch.txids`. The [mutations guide](./mutations) uses them to confirm optimistic&nbsp;mutations.

## Renew the sealed query

Sealed queries are [short-lived](./queries#renewing-sealed-queries), so a subscription that outlives its sealed query needs a fresh one. Fetch a replacement before `expiresAt` and pass it to `renew()`. This scheduler renews 10 seconds before expiry, retries a failed fetch after 1 second, reschedules from each new `expiresAt` and stops if `renew()` fails:

```ts filename="frontend/renewal.ts"
import type { RawLiveQuerySubscription, SealedLiveQuery } from "@neon/realtime/client"

// The same timing the React and TanStack DB bindings use
const RENEW_EARLY_MS = 10_000
const RETRY_MS = 1_000

export function renewBeforeExpiry<Row>(
  subscription: RawLiveQuerySubscription<Row>,
  sealedQuery: SealedLiveQuery<Row>,
  fetchSealedQuery: () => Promise<SealedLiveQuery<Row>>
): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  let stopped = false

  function schedule(delay: number) {
    clearTimeout(timer)

    if (!stopped) {
      timer = setTimeout(renew, delay)
    }
  }

  function scheduleBeforeExpiry(expiresAt: number) {
    schedule(Math.max(0, expiresAt - Date.now() - RENEW_EARLY_MS))
  }

  async function renew() {
    let next: SealedLiveQuery<Row>

    try {
      next = await fetchSealedQuery()
    } catch {
      schedule(RETRY_MS)
      return
    }

    scheduleBeforeExpiry(next.expiresAt)

    // A rejected renewal means the subscription is in `error` or the query changed
    subscription.renew(next).catch(stop)
  }

  function stop() {
    stopped = true
    clearTimeout(timer)
  }

  scheduleBeforeExpiry(sealedQuery.expiresAt)

  return stop
}
```

Start it after subscribing, with a function that fetches the same query again, and stop it when you unsubscribe:

```ts filename="frontend/app.ts" {6,16,21}
import type { LiveQuerySnapshot, LiveQueryState } from "@neon/realtime/client"

import type { Message } from "../backend/schema"
import { fetchSealedMessages } from "./api"
import { client } from "./client"
import { renewBeforeExpiry } from "./renewal"

const list = document.querySelector<HTMLUListElement>("#messages")!
const statusLine = document.querySelector<HTMLParagraphElement>("#status")!

// A real app takes the channel from its router
const channelId = 2

const sealedQuery = await fetchSealedMessages(channelId)
const subscription = client.subscribe(sealedQuery)
const stopRenewing = renewBeforeExpiry(subscription, sealedQuery, () => fetchSealedMessages(channelId))

subscription.onChange(render)

window.addEventListener("beforeunload", () => {
  stopRenewing()
  subscription.unsubscribe()
  client.close()
})

function render(snapshot: LiveQuerySnapshot<Message>) {
  statusLine.textContent = describe(snapshot)
  list.replaceChildren(...(snapshot.data ?? []).map(renderMessage))
}

function describe(state: LiveQueryState): string {
  switch (state.status) {
    case "connecting":
      return "Loading messages"
    case "live":
      return "Up to date"
    case "stale":
      return "Updating. Messages may be out of date."
    case "error":
      return `Stopped: ${state.error.message}`
    case "closed":
      return "Closed"
  }
}

function renderMessage(message: Message): HTMLLIElement {
  const item = document.createElement("li")

  item.textContent = `${message.created_at.toLocaleTimeString()} ${message.body}`

  return item
}
```

`renew()` replaces the sealed query for the same exact query, and it keeps the subscription object, its listeners and its rows:

- Before expiry, the subscription stays `live`, with no reset.
- After expiry, for example when a laptop wakes from sleep, the subscription stays `stale`. The client subscribes again behind the same object, and the next reset makes it `live` again.

If the replacement's `queryFingerprint` doesn't match, the promise that `renew()` returns rejects. A changed parameter, like a different channel, makes a different query, so subscribe to the new one and unsubscribe from the old.

You don't write this yourself when you use the bindings. The [React and TanStack&nbsp;DB bindings](./reactivity) take a `refreshQuery` function and renew with the same timing, 10 seconds before expiry with a 1-second retry. They're built on [`QueryRefreshController`](../sdks/typescript#client-queryrefreshcontroller), which you can use if you're writing a binding for another framework.

## Handle errors

When automatic recovery stops, the subscription moves to `error`, and its `error` is a [`LiveQueryError`](../sdks/typescript#client-livequeryerror) with:

- `code`: a stable, machine-readable error code
- `message`: a description of the failure
- `retryable`: whether reconnecting or a fresh sealed query may recover it
- `sqlState`: the Postgres SQLSTATE code, when [debug mode](#debug-subscriptions) is on and the database supplied one
- `cause`: the underlying error, when there is one

A subscription never leaves `error` by itself, and `renew()` can't bring it back. Unsubscribe, show the error, and subscribe again with a fresh sealed query, for example when the user retries.

Errors stay with their own subscription. A row that fails to decode, for example, puts only its own subscription into `error`, and the others on the client carry on.

If the connection itself fails, for example because of a fatal protocol error or a transaction that's larger than the client's 16 MiB limit, every subscription on the client moves to `error` at once and the client can't reconnect. Create a new client with `createRealtimeClient()` before you subscribe again.

## Debug subscriptions

### Log client diagnostics

The client is silent by default. To see what it's doing, pass a `logLevel` to [`createRealtimeClient()`](../sdks/typescript#client-createrealtimeclient): `"error"`, `"warn"`, `"info"` or `"debug"`. Each level includes the ones before it.

```ts filename="frontend/client.ts" {5}
import { createRealtimeClient } from "@neon/realtime/client"

export const client = createRealtimeClient({
  url: import.meta.env.VITE_NEON_REALTIME_URL,
  logLevel: import.meta.env.DEV ? "debug" : "warn"
})
```

Entries go to the console unless you pass a [`logger`](../sdks/typescript#client-realtimelogger), which receives each [entry](../sdks/typescript#client-realtimelogentry) instead. An entry has a `level`, a `message`, a `timestamp` and a stable `event` name, like `connection_lost` or `subscription_failed`. Match on `event`, not on `message`:

```ts
logger: (entry) => {
  if (entry.event === "subscription_failed") reportError(entry.error)
}
```

Entries never include sealed queries, SQL, parameters or rows. An entry's `error` can hold an error from the server or from your own code, so handle it like any other error you log.

The React and TanStack&nbsp;DB bindings log through the client you give them. A direct server takes the same `logLevel` and `logger` options in `createRealtime({ url })`.

### Show full database errors

By default, subscription errors carry safe, generic messages. To see the database's own error while you develop, set `debugMode` on the server that seals your queries:

```ts filename="backend/realtime.ts" {8}
import { createRealtime } from "@neon/realtime/server"
import { drizzleAdapter } from "@neon/realtime-drizzle"

export const realtime = createRealtime({
  secret: process.env.NEON_REALTIME_SECRET!,
  db: "neondb",
  adapter: drizzleAdapter(),
  debugMode: process.env.NODE_ENV === "development"
})
```

Every query it seals then reports errors with the database's full message, plus its SQLSTATE code in `sqlState` when there is one. It's a backend option because it travels inside each sealed query.

<Admonition type="warning" title="Development only">
Full error details can expose schema, table and column names to anyone who subscribes, including through any error message your UI shows. Never turn on `debugMode` in production.
</Admonition>

<NeedHelp/>
