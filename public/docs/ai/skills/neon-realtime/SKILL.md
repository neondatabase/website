---
name: neon-realtime
description: >-
  Neon Realtime makes any SQL query live. Build realtime, reactive apps and agents on Lakebase Postgres with live SQL queries and reactivity primitives. Use when app UI or agent state must update live from database rows (dashboards, feeds, collaboration, multi-user or multi-device sync), for optimistic mutations, or to replace polling or other realtime sync systems. Triggers include "live query", "subscribe", "sync engine", "useLiveQuery", "TanStack DB", "optimistic updates", "@neon/realtime". For push that doesn't come from database rows (presence, typing, LLM streams), use neon-functions.
metadata:
  parent: neon
  source: https://github.com/neondatabase/agent-skills/tree/main/skills/neon-realtime
---

**FIRST**: Use the parent `neon` skill for a Neon overview, getting started with Neon, Neon development best practices, and more.

If the `neon` skill is not installed, fetch it from https://neon.com/docs/ai/skills/neon/SKILL.md or install it with:

```bash
neon skills -s neon -y
```

# Neon Realtime

Neon's Realtime makes any SQL query live. Subscribe in realtime to your Lakebase Postgres database. Develop apps and agents with end-to-end reactivity using type-safe live queries and optimistic mutations.

Realtime is new and in beta, so its APIs aren't in your training data. Start from the core pattern below, and read each section's reference file before writing that code.

## How It Works

Realtime's layers compose: a live query engine inside Postgres, the Live SQL API (a WebSocket API), lower-level client SDKs (`seal()`, `subscribe()`), and reactivity primitives such as `useLiveQuery`.

1. In trusted backend code, **define** a live query (any read-only SQL, including joins, aggregates, ordering and limits), **seal** it with `NEON_REALTIME_SECRET` and **expose** it from an authenticated endpoint or server function. The client can't read or change a sealed query's SQL or parameters.
2. The client **subscribes** with the sealed query. It receives the full initial result, then each committed transaction's changes as one batch. Results stay consistent, but delivery of every change event isn't guaranteed.
3. **Writes** go through your own API, which returns each write's `txid` for `awaitTxId()`.

## Core Pattern

The guides' chat app, with `messages` authorized through `channel_members`. The backend seals the query and returns each write's `txid`:

```ts
import { createRealtime, rawSql } from "@neon/realtime/server"
import { drizzleAdapter } from "@neon/realtime-drizzle"
import { and, desc, eq, getTableColumns, sql } from "drizzle-orm"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { requireUser } from "./auth"
import { db } from "./db"
import { channelMembers, messages, type Message } from "./schema"

export const realtime = createRealtime({ secret: process.env.NEON_REALTIME_SECRET!, db: "neondb", adapter: drizzleAdapter() })

// Each selected key must match its column name
export function messagesQuery(userId: string, channelId: number) {
  return db
    .select(getTableColumns(messages)).from(messages)
    .innerJoin(channelMembers, eq(channelMembers.channel_id, messages.channel_id))
    .where(and(eq(channelMembers.user_id, userId), eq(messages.channel_id, channelId)))
    .orderBy(desc(messages.created_at))
    .limit(50)
}

// Or raw SQL
const rawMessagesQuery = (userId: string, channelId: number) => rawSql<Message>(
    `SELECT messages.author_id, messages.body, messages.channel_id, messages.created_at, messages.id FROM messages
     INNER JOIN channel_members ON channel_members.channel_id = messages.channel_id WHERE channel_members.user_id = $1 AND messages.channel_id = $2 ORDER BY messages.created_at DESC LIMIT 50`,
    [userId, channelId]
  )

// The id of the transaction that made the change, read in the write's own RETURNING
const txid = sql<string>`pg_current_xact_id()::text`

const app = new Hono()
  .post("/api/v1/messages/live", async (c) => {
    const user = await requireUser(c)
    const { channelId } = await c.req.json<{ channelId: number }>() // validate input
    return c.json(await realtime.seal({ query: messagesQuery(user.id, channelId) }))
  })
  .post("/api/v1/messages", async (c) => {
    const user = await requireUser(c)
    const { id, channelId, body } = await c.req.json<{ id: string; channelId: number; body: string }>() // validate input
    // One statement. The membership row supplies channel_id and author_id, so only a member's message is inserted.
    // List every column in table order, alias each sql field, and cast untyped params (they resolve to text)
    const [sent] = await db.insert(messages).select(
      db.select({
          id: sql`${id}::uuid`.as("id"), channel_id: channelMembers.channel_id, author_id: channelMembers.user_id,
          body: sql`${body}`.as("body"), created_at: sql`now()`.as("created_at"),
        })
        .from(channelMembers)
        .where(and(eq(channelMembers.channel_id, channelId), eq(channelMembers.user_id, user.id)))
    ).returning({ txid })
    if (!sent) throw new HTTPException(403, { message: "Not a member of this channel" })
    return c.json({ kind: "committed", txid: sent.txid })
  })
```

The React frontend subscribes and sends optimistic messages:

```tsx
import { createRealtimeClient, type SealedLiveQuery } from "@neon/realtime/client"
import { drizzleParsers } from "@neon/realtime-drizzle/client"
import { useLiveQuery } from "@neon/realtime-react"
import { startTransition, useCallback, useOptimistic } from "react"
import type { Message } from "../backend/schema"
import { fetchSealedMessages, sendMessage } from "./api"

// One client per app, because subscriptions share its connection. Wrap the app in <RealtimeProvider client={client}>
export const client = createRealtimeClient({ url: import.meta.env.VITE_NEON_REALTIME_URL, parsers: { ...drizzleParsers } })

const NO_MESSAGES: readonly Message[] = []
type Props = { sealedQuery: SealedLiveQuery<Message>; channelId: number; userId: string }

export function Messages({ sealedQuery, channelId, userId }: Props) {
  const refreshQuery = useCallback(() => fetchSealedMessages(channelId), [channelId])
  const { data, status, error, utils } = useLiveQuery(sealedQuery, { refreshQuery })
  // Once the sent message syncs, show only the synced row
  const [messages, addOptimistic] = useOptimistic(data ?? NO_MESSAGES, (current, message: Message) =>
    current.some(({ id }) => id === message.id) ? current : [message, ...current]
  )

  function send(body: string) {
    // The server sets author and timestamp but keeps this id
    const message = { id: crypto.randomUUID(), channel_id: channelId, author_id: userId, body, created_at: new Date() }
    startTransition(async () => {
      addOptimistic(message)
      try {
        const result = await sendMessage(message) // maps channel_id to channelId
        if (result.kind === "committed") await utils.awaitTxId(result.txid, 10_000)
      } catch { /* show "Couldn't confirm the change" */ }
    })
  }

  if (status === "error") return <p role="alert">Live updates stopped: {error.message}</p>
  if (data === undefined) return <p>Loading messages</p>
  return (
    <form action={(form) => send(String(form.get("body")))}>
      <input name="body" required />
      <ul>{messages.map((message) => <li key={message.id}>{message.body}</li>)}</ul>
    </form>
  )
}
```

## Choose the Stack

A live query replaces fetching app data from an API or another sync system. Reuse existing query code, and use the highest layer that fits rather than wiring changes into app state by hand.

| Use | For |
| --- | --- |
| `drizzleAdapter()` from `@neon/realtime-drizzle`, or `kyselyAdapter()` from `@neon/realtime-kysely` | Queries written in Drizzle or Kysely |
| `rawSql` from `@neon/realtime/server` | Any other ORM, or none |
| `useLiveQuery` from `@neon/realtime-react` | React. Binds one sealed query to a component's state |
| `realtimeCollectionOptions` from `@neon/realtime-tanstack` | Many views over the same data, or an app on TanStack DB. Oversync one broader query into a collection, then derive local live queries from it |
| `client.subscribe()` from `@neon/realtime/client` | Other frameworks |
| `realtime.subscribe()` from `@neon/realtime/server` | Agents and workers, in trusted backend code |

Migrating from Electric: Realtime is a drop-in replacement for Electric's role in your stack. Live SQL queries replace shapes, and `realtimeCollectionOptions()` replaces `electricCollectionOptions()`.

## Setup

- **New app:** `neon bootstrap my-app --template realtime-react`, then `neon deploy` in `my-app`.
- **Enable** it on the linked branch with [`neon realtime enable --allowed-origin <app origin>`](https://neon.com/docs/cli/realtime.md), or declare [`preview: { realtime: true }`](https://neon.com/docs/reference/neon-ts.md#realtime) in `neon.ts` (`neon config add realtime`) and run `neon deploy`. Child branches inherit it. It's unavailable on Claimable projects until claimed, or outside the [supported regions](https://neon.com/docs/realtime/overview.md#which-regions-is-it-enabled-in).
- **Tables** need a [stable replica identity](references/queries.md#table-requirements); a primary key is enough.
- **Environment:** `neon env pull --service postgres --service realtime` writes `DATABASE_URL`, `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET`. Expose only the URL to the browser, under your framework's public prefix (like `VITE_`). `url` options take `NEON_REALTIME_URL`; `db` takes the database name from `DATABASE_URL`.
- **Install** `@neon/realtime` and the packages chosen above. Use these SDKs, not the still-evolving WebSocket protocol.

## Define and Seal Queries

Read [references/queries.md](references/queries.md) before writing query or sealing code, including Kysely and server functions.

- **Read-only and deterministic.** A raw query is a single `SELECT` with no `;` and `$1` placeholders. It can't call `now()` or `gen_random_uuid()`, so pass such values as parameters, wrapping every value except strings, numbers, booleans, bigints and null in a `pgParam` helper (`pgParam.timestamptz(date)`).
- **Authorize in the query.** Check the session before sealing, and join through your membership tables so revoked access drops out. Any web framework auth works, including Managed Better Auth, but not [RLS](references/queries.md#why-not-row-level-security) yet. See [Authorization](references/queries.md#authorization).
- **A sealed query is a bearer token.** Keep it out of URLs, logs and persistent storage, and never fill its parameters from unchecked input.
- **Check a query** before wiring it in: [`neon realtime subscribe "SELECT ..."`](https://neon.com/docs/cli/realtime.md#subscribe) prints the initial result, then each transaction's changes, until you stop it. With `--output json`, each change prints a full snapshot. Set `debugMode` on `createRealtime` for full database errors (development only).
- **Sealed queries expire.** Pass `refreshQuery` to the bindings or call `renew()`, sealing the same query and parameters, or the subscription errors. New parameters need a new sealed query and subscription. In Next.js, renew from a Route Handler, because server actions run one at a time.

## Subscribe

Read [references/reactivity.md](references/reactivity.md) before writing React or TanStack DB code. Read [references/subscribing.md](references/subscribing.md) before subscribing directly with `client.subscribe(sealed)` (`getSnapshot`, `onChange`, `onStateChange`), or from agents and workers, which add `url` to `createRealtime` and `await realtime.subscribe(query)` to seal in-process.

- **One database per client.** The first sealed query binds the connection to its `db`.
- **Select a stable, unique key for every row** and key rows by it, including TanStack DB's `getKey`: usually the primary key, the grouped columns for aggregates, or the combined keys for joins that repeat a row. Never use `rowId`, which every `rows` update invalidates.
- **`error` is final**, even after `renew()`. Fetch a fresh sealed query and subscribe again, with a new client if the connection failed. Watch `onStateChange` on direct subscriptions; `useLiveQuery()` reports errors through `status`, not by throwing or suspending.
- **When the session changes, leave with a full page load.** It drops the Realtime client, any TanStack `DbClient` and the previous user's rows. The hook retries a failed renewal every second, so stop renewing once one fails as signed out. Check on every renewal and write that the session's user is the one the page was loaded for, or a write from the old page lands in the new user's account. See [When the session changes](references/ssr.md#when-the-session-changes).

## Optimistic Writes

Realtime has no write path, so writes keep your backend's usual auth. Read [references/mutations.md](references/mutations.md) before writing mutations, for each layer.

- [Return the txid from the write itself](references/mutations.md#returning-the-txid-from-your-backend): `` .returning({ txid: sql<string>`pg_current_xact_id()::text` }) ``, in one round trip on any Postgres driver. Write a batch in one statement, so there's one txid. Never open `db.transaction()` just to `select pg_current_xact_id()`: that's four round trips holding a pooled connection. When a write genuinely needs several statements, put the txid in the `RETURNING` of a write that always changes a row.
- Always pass `awaitTxId()` a timeout: it keeps waiting through reconnects and renewals, and never settles if the txid doesn't reach the query.
- A write that changes no rows has no txid, so skip `awaitTxId()` and let the optimistic state drop.

## Server-Side Rendering

Read [references/ssr.md](references/ssr.md) before rendering live queries on the server, for Next.js and TanStack Start.

- Create the client in a `useState` initializer rather than at module level, render `initialData` as live rows without a loading state, and never share a TanStack `DbClient` between requests.
- Keep row shapes identical on both sides. `JSON.stringify` turns dates into strings, and `int8` and `numeric` arrive as strings.

## More Docs

| Task | Page |
| --- | --- |
| Beta scope, regions, pricing, FAQ, other systems | [Overview](https://neon.com/docs/realtime/overview.md) |
| Architecture and consistency | [How it works](https://neon.com/docs/realtime/how-it-works.md) |
| A first live query | [Quickstart](https://neon.com/docs/realtime/quickstart.md) |
| Every SDK export | [TypeScript SDK reference](https://neon.com/docs/realtime/sdks/typescript.md) |
| Full-stack apps with auth and SSR | [Next.js](https://neon.com/docs/realtime/examples/nextjs.md), [TanStack](https://neon.com/docs/realtime/examples/tanstack.md) |
| Live agent workflows | [Mastra](https://neon.com/docs/realtime/examples/mastra.md) |
| ORM adapters | [Drizzle](https://neon.com/docs/realtime/examples/drizzle.md), [Kysely](https://neon.com/docs/realtime/examples/kysely.md) |
