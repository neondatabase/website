---
title: 'Migrate from Electric'
subtitle: "Migrate a reactive app from Electric to Neon Realtime."
summary: >-
  Migrate a reactive app's shapes, proxy auth and writes from Electric to use Neon Realtime instead.
enableTableOfContents: true
---

[Neon Realtime](../overview) is the successor to <a className="group inline text-pretty" href="https://electric.ax" target="_blank" rel="nofollow noopener noreferrer">Electric<span className="whitespace-nowrap no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14" className="ml-1 inline-block size-3.5! shrink-0 align-[-0.125em]"><path fill="currentColor" d="M0 0h14v14H0z" opacity="0.2"></path><path stroke="currentColor" strokeLinecap="square" d="M9.915 8.885V4.08H5.11M9.625 4.375 4.083 9.917"></path></svg></span></a>, built by the Electric team [inside Neon](/blog/electric-joins-neon). Live SQL queries are a drop-in replacement for shapes, and this page shows how to migrate your Electric app.

<CopyPrompt src="/prompts/neon-realtime-migrate-from-electric.md"
    description="Give these instructions to your coding agent to migrate your app now."
    buttonText="Copy prompt"
/>

## Migration steps

Electric already runs on Postgres, so your schema and data stay as they are.

The steps / layers are as follows:

|     |                                           | <h4>Electric</h4>       |     | <h4>Neon Realtime</h4>                                                                               |
| --- | ----------------------------------------- | ----------------------- | --- | ---------------------------------------------------------------------------------------------------- |
| 1   | [**Setup**](#set-up-neon-realtime)        | Electric sync service   | →   | `neon realtime enable`                                                                               |
| 2   | [**Queries**](#define-queries)            | Shape `table` + `where` | →   | Any SQL query (or query builder like [Drizzle](../examples/drizzle) or [Kysely](../examples/kysely)) |
| 3   | [**Auth**](#auth)                         | Shape proxy             | →   | `seal()` the query                                                                                   |
| 4   | [**Reactivity**](#subscribe-to-queries)   | `useShape`              | →   | `useLiveQuery`                                                                                       |
| 5   | [**Handle writes**](#handle-writes)       | Write route             | →   | `pg_current_xact_id()::text`                                                                         |
| 6   | [**Optimistic state**](#optimistic-state) | `matchStream`           | →   | `awaitTxId` (or [TanStack DB](#tanstack-db))                                                         |

<Steps>

## Set up Neon Realtime

If your database isn't on Neon yet, [migrate it to Neon](/docs/import/migrate-intro) first. Then [enable Realtime](../quickstart#enable-realtime) on the branch Electric syncs from, so changes keep flowing to both, or on a branch of it to work on a snapshot:

```bash filename="Terminal"
neon realtime enable
```

<Admonition type="tip" title="Migrate one view at a time">
Electric and Realtime can run against the same database, so you can move views across one at a time and [remove Electric](#remove-electric) once nothing reads from it. Keep Electric on a direct (unpooled) connection string: `neon link` and `neon env pull` set `DATABASE_URL` to the pooled one.
</Admonition>

## Define queries

Your proxy defines each shape with a `table` and a `where`:

```ts filename="backend/server.ts"
origin.searchParams.set('table', 'messages')
origin.searchParams.set('where', 'channel = $1 AND channel IN (SELECT channel FROM channel_members WHERE user_id = $2)')
origin.searchParams.set('params[1]', channelId) // from the route
origin.searchParams.set('params[2]', user.id) // from the session
```

This becomes a [raw SQL](../guides/queries#using-raw-sql) query:

```ts filename="backend/queries.ts"
import { rawSql } from "@neon/realtime/server"

export type Message = {
  id: string
  channel: string
  author: string
  body: string
  metadata: { edited: boolean }
  created_at: Date
}

export function messagesQuery(userId: string, channelId: string) {
  return rawSql<Message>(
    `SELECT messages.id, messages.channel, messages.author, messages.body, messages.metadata, messages.created_at
     FROM messages
     INNER JOIN channel_members ON channel_members.channel = messages.channel
     WHERE channel_members.user_id = $1 AND messages.channel = $2
     ORDER BY messages.created_at ASC`,
    [userId, channelId]
  )
}
```

Or a Drizzle query, with `db` set up as in the [Drizzle example](../examples/drizzle):

```ts filename="backend/queries.ts"
import { and, asc, eq, getTableColumns } from "drizzle-orm"

import { db } from "./db"
import { channelMembers, messages } from "./schema"

export function messagesQuery(userId: string, channelId: string) {
  return db.select(getTableColumns(messages))
    .from(messages)
    .innerJoin(channelMembers, eq(channelMembers.channel, messages.channel))
    .where(and(eq(channelMembers.user_id, userId), eq(messages.channel, channelId)))
    .orderBy(asc(messages.created_at))
}
```

The client-side sort in your components moves into `ORDER BY`. With TanStack&nbsp;DB, you can sort in the client instead, or do both: see [TanStack DB](#tanstack-db).

## Auth

Your shape proxy checks the session and sets the shape:

```ts filename="backend/server.ts" {20-23}
import { ELECTRIC_PROTOCOL_QUERY_PARAMS } from "@electric-sql/client"
import { Hono } from "hono"

import { requireUser } from "./auth"

const ELECTRIC_URL = process.env.ELECTRIC_URL ?? 'http://localhost:3000'

export const app = new Hono()
  .get('/api/messages/shape', async (c) => {
    // 401 without a valid session
    const user = await requireUser(c)
    const url = new URL(c.req.url)
    const channelId = url.searchParams.get('channel')!

    // Forward only Electric's protocol params. The server defines the shape.
    const origin = new URL('/v1/shape', ELECTRIC_URL)
    url.searchParams.forEach((value, key) => {
      if (ELECTRIC_PROTOCOL_QUERY_PARAMS.includes(key)) origin.searchParams.set(key, value)
    })
    origin.searchParams.set('table', 'messages')
    origin.searchParams.set('where', 'channel = $1 AND channel IN (SELECT channel FROM channel_members WHERE user_id = $2)')
    origin.searchParams.set('params[1]', channelId)
    origin.searchParams.set('params[2]', user.id)

    if (process.env.ELECTRIC_SOURCE_ID) origin.searchParams.set('source_id', process.env.ELECTRIC_SOURCE_ID)
    if (process.env.ELECTRIC_SECRET) origin.searchParams.set('secret', process.env.ELECTRIC_SECRET)

    const res = await fetch(origin)
    const headers = new Headers(res.headers)
    headers.delete('content-encoding')
    headers.delete('content-length')
    headers.set('vary', 'cookie')

    return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
  })
```

With Neon Realtime, the proxy becomes a route that seals the query:

```ts filename="backend/server.ts" {13-15}
import { Hono } from "hono"

import { requireUser } from "./auth"
import { messagesQuery } from "./queries"
import { realtime } from "./realtime"

export const app = new Hono()
  .post('/api/v1/messages/live', async (c) => {
    // 401 without a valid session
    const user = await requireUser(c)
    const { channelId } = await c.req.json<{ channelId: string }>() // validate input

    // Authorize in the query: it only returns messages from channels the user
    // belongs to, so removing a membership removes them from the live result.
    const sealedQuery = await realtime.seal({ query: messagesQuery(user.id, channelId) })

    return c.json(sealedQuery)
  })
```

[`requireUser`](../guides/queries#exposing-an-endpoint) is the session check your proxy already runs, and `realtime` is the server from [Using raw SQL](../guides/queries#using-raw-sql) or [Using a query builder or ORM](../guides/queries#using-a-query-builder-or-orm). The seal route runs once per subscription and on renewal, not on every request, and the client [connects straight to Realtime](../guides/queries#sealing-queries).

You always need a server to seal queries, because sealing needs `NEON_REALTIME_SECRET`. If your app is public and shows every visitor the same data, the seal route can skip the session check. Sealed queries expire, though, so if you cache the route's response, cache it for well under the sealed query's lifetime (its `expiresAt`).

## Subscribe to queries

Your components read the shape through the proxy with `useShape`:

```tsx filename="frontend/Messages.tsx"
import { useShape } from "@electric-sql/react"

import type { Message } from "../backend/schema"

const MESSAGES_SHAPE_URL = new URL('/api/messages/shape', window.location.origin).href

function Messages({ channelId }: { channelId: string }) {
  const { data, isLoading, isError, error, stream } = useShape<Message>({
    url: MESSAGES_SHAPE_URL,
    params: { channel: channelId },
    parser: { timestamptz: (value: string) => new Date(value) },
  })

  // Shapes are unordered, so sort on the client.
  const sorted = [...data].sort((a, b) => +a.created_at - +b.created_at)

  // ...
}
```

[`useLiveQuery`](../sdks/typescript#react-uselivequery) takes a sealed query that the parent fetches, not a URL. So `useShape(params)` becomes two steps: fetch the sealed query for the params, then pass it to `useLiveQuery`, as `Channel` below shows. A `preloadShape()` in a route loader becomes fetching the sealed query in the loader.

```tsx filename="frontend/Messages.tsx"
function Messages({ sealedQuery, refreshQuery }) {
  const { data, status, error, utils } = useLiveQuery(sealedQuery, { refreshQuery })

  // ...
}
```

Then wrap your app in [`RealtimeProvider`](../sdks/typescript#react-realtimeprovider), using the `VITE_` variables from the queries guide's [Setup](../guides/queries#setup). With [TanStack DB](#tanstack-db), skip the provider: you pass the client to each collection instead.

```tsx filename="frontend/main.tsx"
import { createRealtimeClient } from "@neon/realtime/client"
import { drizzleParsers } from "@neon/realtime-drizzle/client"
import { RealtimeProvider } from "@neon/realtime-react"

const NEON_REALTIME_URL = import.meta.env.VITE_NEON_REALTIME_URL as string

// No secret on the client: the sealed query **is** the authorization.
const client = createRealtimeClient({
  url: NEON_REALTIME_URL,
  // Optional, if using Drizzle
  parsers: { ...drizzleParsers }
})

root.render(
  <RealtimeProvider client={client}>
    <App />
  </RealtimeProvider>
)
```

Unlike a shape, a sealed query expires. `refreshQuery` returns a fresh sealed query for the _same_ query, and the hook renews it before it expires. Without it, the rows go `stale` once the sealed query expires. To switch channels, fetch a new sealed query with a matching `refreshQuery`.

<details>
  <summary>frontend/api.ts and frontend/Channel.tsx</summary>

`fetchSealed()` fetches the sealed query from the route in [Auth](#auth):

```ts filename="frontend/api.ts"
import type { SealedLiveQuery } from "@neon/realtime/client"

import type { Message } from "../backend/schema"

export async function fetchSealed(channelId: string): Promise<SealedLiveQuery<Message>> {
  // Same origin, so the request carries the session cookie your proxy checked
  const res = await fetch('/api/v1/messages/live', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ channelId }),
  })
  if (!res.ok) throw new Error(`Could not seal the query (${res.status})`)
  return res.json()
}
```

With raw SQL, import `Message` from `../backend/queries` instead. `Channel` uses `fetchSealed()` to fetch the sealed query and build its `refreshQuery`, then renders `<Messages>`. See [Fetch from an API endpoint](../guides/subscribing#fetch-from-an-api-endpoint) and, for the initial server render, [Server-side rendering](../guides/ssr).

```tsx filename="frontend/Channel.tsx"
import { useCallback, useEffect, useState } from "react"
import type { SealedLiveQuery } from "@neon/realtime/client"

import type { Message } from "../backend/schema"
import { fetchSealed } from "./api"
import { Messages } from "./Messages"

export function Channel({ channelId, userId }: { channelId: string; userId: string }) {
  const [sealed, setSealed] = useState<SealedLiveQuery<Message>>()
  const [error, setError] = useState<Error>()
  // Renewals must be for the same query, so refresh with the same channel.
  const refreshQuery = useCallback(() => fetchSealed(channelId), [channelId])

  useEffect(() => {
    let active = true
    setSealed(undefined) // never hand the previous channel's query to a new channel
    setError(undefined)
    fetchSealed(channelId)
      .then((q) => active && setSealed(q))
      .catch((e: Error) => active && setError(e))
    return () => {
      active = false
    }
  }, [channelId])

  if (error) return <p role="alert">Could not load messages: {error.message}</p>
  if (!sealed) return <p>Loading messages</p>
  return <Messages sealedQuery={sealed} refreshQuery={refreshQuery} channelId={channelId} userId={userId} />
}
```

</details>

## Handle writes

If your write route reads Electric's `::xid::text` txid in a transaction:

```ts filename="backend/server.ts"
import { sql } from "drizzle-orm"

import { db } from "./db"
import { messages } from "./schema"

app.post('/api/messages', async (c) => {
  const user = await requireUser(c)
  const { id, channelId, body } = await c.req.json()

  const txid = await db.transaction(async (tx) => {
    const result = await tx.execute(sql`SELECT pg_current_xact_id()::xid::text AS txid`)
    await tx.insert(messages).values({ id, channel: channelId, author: user.id, body, metadata: { edited: false } })
    return parseInt(result.rows[0].txid as string, 10)
  })

  return c.json({ txid })
})
```

Return the txid from the write's own `RETURNING`, as a string. Don't parse it to a number:

```sql
INSERT INTO messages (id, channel, author, body, metadata)
SELECT $1::uuid, channel_members.channel, channel_members.user_id, $3, '{"edited": false}'::jsonb
FROM channel_members
WHERE channel_members.channel = $2 AND channel_members.user_id = $4
RETURNING pg_current_xact_id()::text AS txid
```

The insert takes the row's id from the client, as do the [optimistic rows](#optimistic-state) (`crypto.randomUUID()`). If a table's key is `GENERATED ALWAYS AS IDENTITY`, Postgres rejects an id from the insert, so switch it to a client-generated id, such as a `uuid` key.

<details>
  <summary>backend/server.ts with Drizzle</summary>

```ts filename="backend/server.ts"
import { and, eq, sql } from "drizzle-orm"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"

import { requireUser } from "./auth"
import { db } from "./db"
import { channelMembers, messages } from "./schema"

const txid = sql<string>`pg_current_xact_id()::text`

export type MutationResponse =
  | { readonly kind: "committed"; readonly txid: string }
  | { readonly kind: "unchanged" }

export const app = new Hono()
  // .post('/api/v1/messages/live', ...) from Auth
  .post('/api/v1/messages', async (c) => {
    const user = await requireUser(c)
    const { id, channelId, body } = await c.req.json<{ id: string; channelId: string; body: string }>() // validate input

    // One statement: the membership row supplies the channel and author, so only a member's message is inserted.
    // Select every column in the order the Drizzle table declares them, and alias each sql field.
    const [row] = await db
      .insert(messages)
      .select(
        db
          .select({
            id: sql`${id}::uuid`.as('id'),
            channel: channelMembers.channel,
            author: channelMembers.user_id,
            body: sql`${body}`.as('body'),
            metadata: sql`'{"edited": false}'::jsonb`.as('metadata'),
            created_at: sql`now()`.as('created_at'),
          })
          .from(channelMembers)
          .where(and(eq(channelMembers.channel, channelId), eq(channelMembers.user_id, user.id)))
      )
      .returning({ txid })

    if (!row) throw new HTTPException(403, { message: 'Not a member of this channel' })
    return c.json({ kind: 'committed', txid: row.txid } satisfies MutationResponse)
  })
```

</details>

For edits and deletes that can change no rows, return `{ kind: "unchanged" }` and skip `awaitTxId`, as the [mutations guide](../guides/mutations#returning-the-txid-from-your-backend) shows.

<details>
  <summary>frontend/api.ts</summary>

`sendMessage()` now returns a `MutationResponse`:

```ts filename="frontend/api.ts"
import type { MutationResponse } from "../backend/server"

export async function sendMessage(message: Message): Promise<MutationResponse> {
  const res = await fetch('/api/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: message.id, channelId: message.channel, body: message.body }),
  })
  if (!res.ok) throw new Error(`Could not send the message (${res.status})`)
  return res.json()
}
```

</details>

## Optimistic state

Your `useOptimistic` transition waits for `matchStream`:

```tsx filename="frontend/Messages.tsx"
import { startTransition, useOptimistic } from "react"
import { matchBy, matchStream } from "@electric-sql/experimental"

const [messages, addOptimistic] = useOptimistic(sorted, (current, message: Message) =>
  current.some((m) => m.id === message.id) ? current : [...current, message]
)

function send(body: string) {
  const message: Message = {
    id: crypto.randomUUID(),
    channel: channelId,
    author: userId,
    body,
    metadata: { edited: false },
    created_at: new Date(),
  }

  startTransition(async () => {
    addOptimistic(message)
    // Start watching before the write, so the synced insert can't arrive unseen.
    const synced = matchStream(stream, ['insert'], matchBy('id', message.id))
    await Promise.all([sendMessage(message), synced])
  })
}
```

`matchStream` becomes [`awaitTxId`](../sdks/typescript#client-materializedlivequerysubscriptionawaittxid) on the write's txid. It remembers recent txids, so you call it after the write returns:

```tsx filename="frontend/Messages.tsx"
const { data, utils } = useLiveQuery(sealedQuery, { refreshQuery })
const [sendError, setSendError] = useState<Error>()

const [messages, addOptimistic] = useOptimistic(data ?? [], (current, message: Message) =>
  current.some((m) => m.id === message.id) ? current : [...current, message]
)

function send(body: string) {
  const message: Message = {
    id: crypto.randomUUID(),
    channel: channelId,
    author: userId,
    body,
    metadata: { edited: false },
    created_at: new Date(),
  }

  setSendError(undefined)
  startTransition(async () => {
    addOptimistic(message)
    try {
      const result = await sendMessage(message)
      // Hold the transition until the stream applies the row: no flicker. Always pass a timeout, or it waits forever.
      if (result.kind === 'committed') await utils.awaitTxId(result.txid, 10_000)
    } catch (e) {
      // The optimistic row drops when the transition ends, so tell the user the send failed
      setSendError(e as Error)
    }
  })
}
```

<details>
  <summary>Full frontend/Messages.tsx</summary>

The same code in a component, with the form, loading and error states:

```tsx filename="frontend/Messages.tsx"
import { type FormEvent, startTransition, useOptimistic, useState } from "react"
import { useLiveQuery } from "@neon/realtime-react"
import type { SealedLiveQuery } from "@neon/realtime/client"

import type { Message } from "../backend/schema"
import { sendMessage } from "./api"

interface Props {
  sealedQuery: SealedLiveQuery<Message>
  refreshQuery: () => Promise<SealedLiveQuery<Message>>
  channelId: string
  userId: string
}

export function Messages({ sealedQuery, refreshQuery, channelId, userId }: Props) {
  const { data, status, error, utils } = useLiveQuery(sealedQuery, { refreshQuery })
  const [sendError, setSendError] = useState<Error>()

  // React re-applies pending actions to every new live snapshot, so skip a row the synced data already has.
  const [messages, addOptimistic] = useOptimistic(data ?? [], (current, message: Message) =>
    current.some((m) => m.id === message.id) ? current : [...current, message]
  )

  function send(body: string) {
    const message: Message = {
      id: crypto.randomUUID(),
      channel: channelId,
      author: userId,
      body,
      metadata: { edited: false },
      created_at: new Date(),
    }

    setSendError(undefined)
    startTransition(async () => {
      addOptimistic(message)
      try {
        const result = await sendMessage(message)
        // Hold the transition until the stream applies the row: no flicker. Always pass a timeout, or it waits forever.
        if (result.kind === 'committed') await utils.awaitTxId(result.txid, 10_000)
      } catch (e) {
        // The optimistic row drops when the transition ends, so tell the user the send failed
        setSendError(e as Error)
      }
    })
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const body = String(new FormData(form).get('body') ?? '').trim()
    form.reset()
    if (body) send(body)
  }

  if (status === 'error') return <p role="alert">Live updates stopped: {error.message}</p>
  if (data === undefined) return <p>Loading messages</p>

  return (
    <section>
      <form onSubmit={onSubmit}>
        <input name="body" placeholder="Message" required />
        <button type="submit">Send</button>
      </form>
      {sendError && <p role="alert">{sendError.message}</p>}
      {status === 'stale' && <p role="status">Updating</p>}
      <ul>
        {messages.map((m) => (
          <li key={m.id}>{m.body}</li>
        ))}
      </ul>
    </section>
  )
}
```

</details>

See [How optimistic mutations work](../guides/mutations#how-optimistic-mutations-work).

</Steps>

## TanStack DB

If your app uses TanStack&nbsp;DB, swap [`electricCollectionOptions`](https://tanstack.com/db/latest/docs/collections/electric-collection) for [`realtimeCollectionOptions`](../sdks/typescript#tanstack-db-realtimecollectionoptions):

```ts filename="frontend/collections.ts"
const MESSAGES_SHAPE_URL = new URL('/api/messages/shape', window.location.origin).href // [!code --]
const client = createRealtimeClient({ url: NEON_REALTIME_URL, parsers: { ...drizzleParsers } }) // [!code ++]

export function createMessagesCollection(channelId: string) { // [!code --]
export async function createMessagesCollection(channelId: string) { // [!code ++]
  return createCollection(
    electricCollectionOptions<Message>({ // [!code --]
    realtimeCollectionOptions({ // [!code ++]
      id: `messages:${channelId}`,
      shapeOptions: { // [!code --]
        url: MESSAGES_SHAPE_URL, // [!code --]
        params: { channel: channelId }, // [!code --]
        parser: { timestamptz: (value: string) => new Date(value) }, // [!code --]
      }, // [!code --]
      client, // [!code ++]
      query: await fetchSealed(channelId), // [!code ++]
      refreshQuery: () => fetchSealed(channelId), // [!code ++]
      getKey: (message) => message.id,
      onInsert: async ({ transaction, collection }) => {
        await Promise.all(
          transaction.mutations.map(async ({ modified }) => {
            const { txid } = await sendMessage(modified) // [!code --]
            await collection.utils.awaitTxId(txid, 10_000) // [!code --]
            const result = await sendMessage(modified) // [!code ++]
            if (result.kind === 'committed') await collection.utils.awaitTxId(result.txid, 10_000) // [!code ++]
          })
        )
      },
    })
  )
}
```

The sealed query replaces `shapeOptions`, and `refreshQuery` renews it before it expires. Your server seals it as in [Auth](#auth). See the [mutations guide](../guides/mutations#with-tanstack-db-collections) for the other handlers.

`createMessagesCollection()` is now async, because it fetches the sealed query from your server, and the seal route needs the user's session. If your collections are module-level singletons, create them once the user is signed in instead, for example in an authenticated route's loader.

The sealed query decides which rows sync into the collection. Your TanStack&nbsp;DB live queries decide how components filter, sort and limit them. So you can:

- **Sync without `ORDER BY` or `LIMIT`**, as with a shape, and sort and limit in your live queries. This can perform better, and it suits syncing one normalized collection that different components filter and sort in the client.
- **Keep `ORDER BY` and `LIMIT`** in the sealed query to sync only the rows you need, such as the newest 500, and sort and limit further in your live queries.

## Remove Electric

Stop the Electric sync service, or delete your Electric Cloud source, then drop its replication slot and publication:

```sql
SELECT pg_drop_replication_slot(slot_name)
FROM pg_replication_slots
WHERE slot_name LIKE 'electric_slot_%';

DO $$
DECLARE pub text;
BEGIN
  FOR pub IN SELECT pubname FROM pg_publication WHERE pubname LIKE 'electric_publication_%' LOOP
    EXECUTE format('DROP PUBLICATION %I', pub);
  END LOOP;
END $$;
```

Then remove everything in your app that only exists for Electric: the `@electric-sql/*` and `@tanstack/electric-db-collection` packages, the proxy routes, and its env vars, config and scripts. If you run a proxy like Caddy only for Electric, you can often remove that too.

<Admonition type="important" title="Learn more about Neon Realtime">

Realtime live SQL and reactive DX, built into Postgres. See the [Neon Realtime docs](/docs/realtime/overview) to learn more.

</Admonition>

<NeedHelp />
