---
title: 'Migrate from Convex'
subtitle: "Migrate a reactive app from Convex to Neon Realtime."
summary: >-
  Migrate a reactive app's schema, queries and mutations from Convex to use Neon Realtime instead.
enableTableOfContents: true
---

<a className="group inline text-pretty" href="https://convex.dev" target="_blank" rel="nofollow noopener noreferrer">Convex<span className="whitespace-nowrap no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14" className="ml-1 inline-block size-3.5! shrink-0 align-[-0.125em]"><path fill="currentColor" d="M0 0h14v14H0z" opacity="0.2"></path><path stroke="currentColor" strokeLinecap="square" d="M9.915 8.885V4.08H5.11M9.625 4.375 4.083 9.917"></path></svg></span></a> and [Neon Realtime](../overview) share a similar [reactive development model](/docs/realtime/overview#integrated-reactive-dx). This page shows how to migrate your Convex app to use Neon Realtime.

<CopyPrompt src="/prompts/neon-realtime-migrate-from-convex.md"
    description="Give these instructions to your coding agent to migrate your app now."
    buttonText="Copy prompt"
/>

## Migration steps

Convex uses a different database, so you'll need to migrate your schema, and optionally data, to Postgres and your queries to SQL. You can then adapt the way you bind live queries to component state and handle mutations in your app code and through your API.

The steps / layers are as follows:

|     |                                           | <h4>Convex</h4>            |     | <h4>Neon Realtime</h4>                                                                               |
| --- | ----------------------------------------- | -------------------------- | --- | ---------------------------------------------------------------------------------------------------- |
| 1   | [**Schema**](#migrate-your-schema)        | `defineSchema`             | →   | Any Postgres schema                                                                                  |
| 2   | [**Queries**](#define-queries)            | `query`                    | →   | Any SQL query (or query builder like [Drizzle](../examples/drizzle) or [Kysely](../examples/kysely)) |
| 3   | [**Auth**](#auth)                         | `ctx.auth`                 | →   | Any web framework auth, then `seal()` the query                                                      |
| 4   | [**Reactivity**](#subscribe-to-queries)   | `useQuery`                 | →   | `useLiveQuery`                                                                                       |
| 5   | [**Handle writes**](#handle-writes)       | `mutation` + `useMutation` | →   | `pg_current_xact_id()`                                                                               |
| 6   | [**Optimistic state**](#optimistic-state) | `.withOptimisticUpdate`    | →   | `awaitTxId` (or [TanStack DB](#tanstack-db))                                                         |

Convex Auth, the scheduler, crons, HTTP actions, pagination and search need extra steps. See [Migrate auth providers](#migrate-auth-providers) and [Map other Convex features](#map-other-convex-features).

<Steps>

## Migrate your schema

The simplest way to migrate your schema is using the [`@neon/convex-to-postgres`](https://github.com/neondatabase/neon-pkgs/tree/main/packages/convex-to-postgres) tool. This handles both schema generation and data transform and import.

Run it with `npx` from your Convex project root.

For example, to generate a Postgres DDL schema that matches your Convex schema. This reads your `./convex/schema.ts` by default, unless you pass `--schema <path>`.

```bash filename="Terminal"
npx @neon/convex-to-postgres schema > schema.sql
```

The file is evaluated, so run it where the project's dependencies are already installed. The DDL output goes to stdout, so you can store to a file or pipe straight into psql. Warnings and progress go to stderr.

Or, to migrate your schema and data in one go, export your deployment with the `convex` CLI. It exports `dev` by default. Add `--prod` for production. The snapshot holds all your data, so keep it out of git.

```bash filename="Terminal"
npx convex export --path snapshot.zip
```

Then import the snapshot into your Postgres database:

```bash filename="Terminal"
npx @neon/convex-to-postgres import \
    --export snapshot.zip \
    --apply-schema
```

The tool reads `DATABASE_URL` from the environment, so set it in your shell first.

This creates the tables (with `--apply-schema`) and then loads in all the data in a single transaction. When the schema has search or vector indexes, it builds them and runs `VACUUM ANALYZE`. Without `--apply-schema`, the tables must already exist.

You can inspect and manually edit the generated schema before applying. See the [`@neon/convex-to-postgres` README](https://github.com/neondatabase/neon-pkgs/tree/main/packages/convex-to-postgres) for more details.

<details>
  <summary>What the tool changes</summary>

- **Names.** Fields and tables become snake_case (`authorId` → `author_id`). Pass the same flags (`--id-strategy`, `--no-snake-case` and so on) to every command.
- **Ids.** `_id` becomes `id uuid` (`md5(_id)::uuid`). The tool converts every `v.id()` value the same way, including ids nested in arrays, objects and records inside `jsonb`, and each top-level `v.id()` field gets a foreign key. The tool warns about any field it can't convert. With `--id-strategy text`, ids keep their Convex strings, which also keeps them stable for external links.
- **`_creationTime`** becomes `created_at timestamptz`.
- **Numbers.** `v.number()` becomes `double precision`, including counters and epoch-millisecond times. `v.int64()` becomes `bigint`, which reaches the browser as a string unless you add a parser.
- **Constraints.** Convex indexes aren't unique, so the tool doesn't add `UNIQUE` constraints. Add them for keys your code kept unique (`ON CONFLICT` needs one). Foreign keys are `DEFERRABLE INITIALLY DEFERRED` with no `ON DELETE` action, so deleting a parent that has children now fails where Convex left dangling references. Add `ON DELETE CASCADE` where your code deleted the children.
- **Search indexes.** Each `searchIndex` becomes a generated `tsvector` column, such as `title_tsv` for `title`, with a GIN index (`events_title_gin`). `--search-index bm25` builds `lakebase_bm25` indexes instead.
- **Vector indexes.** Each `vectorIndex` becomes a `lakebase_ann` index.
- **System tables.** References to `_scheduled_functions` or `_storage` become plain uuid columns. Drop or replace them.
- **Convex Auth tables** are imported too, including password hashes. See [Migrate auth providers](#migrate-auth-providers).

Search the generated column with `@@` and rank with `ts_rank`, both live:

```sql
SELECT id, title, ts_rank(title_tsv, websearch_to_tsquery('english', $1)) AS rank
FROM events
WHERE title_tsv @@ websearch_to_tsquery('english', $1)
ORDER BY rank DESC, id
LIMIT 20
```

Always pass the text search configuration (`'english'`, unless you passed `--search-language`). The one-argument forms of `websearch_to_tsquery()` and `to_tsquery()` depend on a setting, so they aren't `IMMUTABLE`, and live queries reject them.

</details>

### Write the schema yourself

Alternatively, you can write or generate a matching Postgres schema yourself.

<details>
  <summary>Manual schema migration</summary>

For example, say if you start with a Convex schema like this:

```ts filename="convex/schema.ts"
export default defineSchema({
  channels: defineTable({
    name: v.string()
  }),
  channelMembers: defineTable({
    channel: v.id('channels'),
    userId: v.string(),
  }).index('by_channel_user', ['channel', 'userId']),
  messages: defineTable({
    channel: v.id('channels'),
    author: v.string(),
    body: v.string(),
    metadata: v.object({ edited: v.boolean() }),
  }).index('by_channel', ['channel']),
})
```

It would translate into SQL like this:

```sql filename="schema.sql"
CREATE TABLE channels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    name text NOT NULL
);

CREATE TABLE channel_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    channel uuid NOT NULL,
    user_id text NOT NULL
);

CREATE TABLE messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    channel uuid NOT NULL,
    author text NOT NULL,
    body text NOT NULL,
    metadata jsonb NOT NULL
);

-- Unique, so the membership join returns each message once
CREATE UNIQUE INDEX channel_members_by_channel_user ON channel_members (channel, user_id);
CREATE INDEX messages_by_channel ON messages (channel);

ALTER TABLE channel_members ADD CONSTRAINT channel_members_channel_fkey FOREIGN KEY (channel) REFERENCES channels (id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE messages ADD CONSTRAINT messages_channel_fkey FOREIGN KEY (channel) REFERENCES channels (id) DEFERRABLE INITIALLY DEFERRED;
```

Or you could define a matching schema using a query builder like [Drizzle](../examples/drizzle):

```ts filename="backend/schema.ts"
import { index, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core"

export const channels = pgTable(
  'channels', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  }
)

export const channelMembers = pgTable(
  'channel_members', {
    id: uuid('id').primaryKey().defaultRandom(),
    channel: uuid('channel').notNull().references(() => channels.id),
    user_id: text('user_id').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  // Unique, so the membership join returns each message once
  (table) => [uniqueIndex('channel_members_by_channel_user').on(table.channel, table.user_id)]
)

export const messages = pgTable(
  'messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    channel: uuid('channel').notNull().references(() => channels.id),
    author: text('author').notNull(),
    body: text('body').notNull(),
    metadata: jsonb('metadata').$type<{ edited: boolean }>().notNull(), // v.object(...) -> jsonb
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('messages_by_channel').on(table.channel)]
)

export type Message = typeof messages.$inferSelect
```

Note how Convex's implicit `_id` and `_creationTime` columns become explicit `id` and `created_at` columns with default values. See Realtime's [table requirements](../guides/queries#table-requirements) for more info.

</details>

## Define queries

Both Convex and Neon Realtime share the approach of defining queries that you can then subscribe to.

Migrating these queries involves porting them from the Convex `query()` DSL to standard SQL queries. You can do this [using raw SQL](../guides/queries#using-raw-sql) or your preferred [ORM or query builder](../guides/queries#using-a-query-builder-or-orm).

For example, a Convex `query` like this (for all the messages in a channel, ordered by creation time):

```ts filename="convex/messages.ts"
export const list = query({
  args: { channelId: v.id('channels') },
  handler: (ctx, { channelId }) =>
    ctx.db
      .query('messages')
      .withIndex('by_channel', (q) => q.eq('channel', channelId))
      .order('asc').collect()
})
```

Becomes a raw SQL query like this, which also takes the user's id to [authorize in SQL](#auth):

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

Or a Drizzle query like this (`db` is set up as in the [Drizzle example](../examples/drizzle)):

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

## Auth

Convex checks `ctx.auth` inside each function:

```ts filename="convex/messages.ts" {4,5,6,7,8}
export const list = query({
  args: { channelId: v.id('channels') },
  handler: async (ctx, { channelId }) => {
    const identity = await ctx.auth.getUserIdentity()

    if (identity === null) {
      throw new Error('Unauthenticated')
    }

    return ctx.db
      .query('messages')
      .withIndex('by_channel', (q) => q.eq('channel', channelId))
      .order('asc')
      .collect()
  },
})
```

With Neon Realtime, the session check moves into the request handler that [seals the query](../guides/queries#sealing-queries), and authorization moves into the query's SQL:

```ts filename="backend/server.ts" {3,10,13,14,15}
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

`requireUser` is the helper from the [queries guide](../guides/queries#exposing-an-endpoint), and `realtime` is the server from [Using a query builder or ORM](../guides/queries#using-a-query-builder-or-orm).

The client can subscribe to a sealed query, but it can't read or change it. See [Live authorization](../guides/queries#live-authorization) and [why not row-level security](../guides/queries#why-not-row-level-security) for more details.

## Subscribe to queries

Convex's `ConvexProvider` and `useQuery` become [`RealtimeProvider`](../sdks/typescript#react-realtimeprovider) and [`useLiveQuery`](../sdks/typescript#react-uselivequery).

So instead of wrapping your app with `<ConvexProvider />`:

```tsx filename="src/main.tsx"
import { ConvexProvider, ConvexReactClient } from "convex/react"

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string

const convex = new ConvexReactClient(CONVEX_URL)

root.render(
  <ConvexProvider client={convex}>
    <App />
  </ConvexProvider>
)
```

You wrap it with `<RealtimeProvider />`, using the `VITE_` variables from the queries guide's [Setup](../guides/queries#setup):

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

Then in your React components, switch out `useQuery`:

```tsx filename="src/Messages.tsx"
function Messages({ channelId }) {
  const messages = useQuery(api.messages.list, { channelId })

  // ...
}
```

For `useLiveQuery`:

```tsx filename="frontend/Messages.tsx"
function Messages({ sealedQuery, refreshQuery }) {
  const { data, status, error, utils } = useLiveQuery(sealedQuery, { refreshQuery })

  // ...
}
```

Note that sealed queries expire. `refreshQuery` returns a fresh sealed query for the _same_ query, and the hook renews it before it expires. To switch channels, fetch a new sealed query with a matching `refreshQuery`.

See the `Channel.tsx` example below and see [`refreshQuery`](../guides/reactivity#refreshquery) and [Changing query parameters](../guides/reactivity#changing-query-parameters) for more details.

<details>
  <summary>frontend/api.ts and frontend/Channel.tsx</summary>

For example, `fetchSealed()` fetches the sealed query from the route in [Auth](#auth), with the session's token:

```ts filename="frontend/api.ts"
import type { SealedLiveQuery } from "@neon/realtime/client"

import type { Message } from "../backend/schema"
import { authClient } from "./auth"

// With another auth provider, send its token here instead
export async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await authClient.getSession()
  const token = data?.session.token

  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchSealed(channelId: string): Promise<SealedLiveQuery<Message>> {
  const res = await fetch('/api/v1/messages/live', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify({ channelId }),
  })
  if (!res.ok) throw new Error(`Could not seal the query (${res.status})`)
  return res.json()
}
```

`authClient` is the Managed Better Auth client from [Migrate auth providers](#migrate-auth-providers). With raw SQL, import `Message` from `../backend/queries` instead. `Channel` uses `fetchSealed()` to fetch the sealed query and build its `refreshQuery`, then renders `<Messages>`. See [Fetch from an API endpoint](../guides/subscribing#fetch-from-an-api-endpoint) and, for the initial server render, [Server-side rendering](../guides/ssr).

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

In Convex you have writes via `mutation`s. With Neon Realtime, you can just write directly to Postgres from your backend API. The only trick is to return the Postgres `txid` in your response.

So, for example, this Convex mutation handler:

```ts filename="convex/messages.ts"
export const send = mutation({
  args: {
    channelId: v.id('channels'),
    body: v.string()
  },
  handler: async (ctx, { channelId, body }) => {
    const { subject } = (await ctx.auth.getUserIdentity())!

    await ctx.db.insert(
      'messages', {
        channel: channelId,
        author: subject,
        body,
        metadata: {
          edited: false
        }
      }
    )
  },
})
```

Becomes a standard request handler. This can use any web framework or server function.

For example here using Hono, chained onto the same `app` as the live route:

```ts filename="backend/server.ts"
import { and, eq, sql } from "drizzle-orm"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"

import { requireUser } from "./auth"
import { db } from "./db"
import { channelMembers, messages } from "./schema"

// The id of the transaction that made the change, read in the write's own RETURNING
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

This returns the `txid` which can then be used to automatically discard optimistic state. `RETURNING` directly from the write avoids an extra round trip.

With raw SQL, put the txid in the write's own `RETURNING` too:

```sql
INSERT INTO messages (id, channel, author, body, metadata)
SELECT $1::uuid, channel_members.channel, channel_members.user_id, $3, '{"edited": false}'::jsonb
FROM channel_members
WHERE channel_members.channel = $2 AND channel_members.user_id = $4
RETURNING pg_current_xact_id()::text AS txid
```

For edits and deletes that can change no rows, return `{ kind: "unchanged" }` and skip `awaitTxId`, as the [mutations guide](../guides/mutations#returning-the-txid-from-your-backend) shows.

Convex mutations were serializable. In Postgres, put a check and its write in one statement, as the route above does, rather than reading first and writing after.

On the client, a `sendMessage()` helper that calls the route replaces `useMutation`:

<details>
  <summary>frontend/api.ts</summary>

Add `sendMessage()` next to `fetchSealed()`:

```ts filename="frontend/api.ts"
import type { MutationResponse } from "../backend/server"

export async function sendMessage(message: Message): Promise<MutationResponse> {
  const res = await fetch('/api/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify({ id: message.id, channelId: message.channel, body: message.body }),
  })
  if (!res.ok) throw new Error(`Could not send the message (${res.status})`)
  return res.json()
}
```

</details>

## Optimistic state

Convex's `.withOptimisticUpdate` becomes React's `useOptimistic` plus [`awaitTxId`](../sdks/typescript#client-materializedlivequerysubscriptionawaittxid):

```tsx filename="src/MessageSender.tsx"
const send = useMutation(api.messages.send).withOptimisticUpdate((store, { channelId, body }) => {
  const existing = store.getQuery(api.messages.list, { channelId }) ?? []

  store.setQuery(api.messages.list, { channelId }, [
    ...existing,
    {
      _id: crypto.randomUUID() as Id<'messages'>,
      _creationTime: Date.now(),
      channel: channelId,
      author: 'me',
      body,
      metadata: {
        edited: false
      }
    }
  ])
})
```

The client picks the id, so the optimistic and synced rows share a key. The transition awaits the txid, so when React drops the optimistic row, the synced row is already in `data`:

```tsx filename="frontend/Messages.tsx"
const { data, utils } = useLiveQuery(sealedQuery, { refreshQuery })
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

## Migrate auth providers

You can migrate from `@convex-dev/auth` to any auth provider, such as Clerk, Auth0 or WorkOS, by verifying their JWT in `requireUser`.

Here we show how to migrate to Neon's [Managed Better Auth](/docs/auth/overview) by replacing Convex Auth's `Password` provider with email and password sign-in.

### Enable it on your branch

```bash filename="Terminal"
neon neon-auth enable
neon env pull --service postgres --service realtime --service auth
echo 'VITE_NEON_AUTH_URL=$NEON_AUTH_BASE_URL' >> .env.local
```

In the browser, create the auth client from that URL:

```ts filename="frontend/auth.ts"
import { createAuthClient } from "@neon/auth"

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL)
```

`authHeaders()` in [Subscribe to queries](#subscribe-to-queries) sends the session's JWT, and `requireUser` verifies it against your branch's [JWKS](/docs/auth/guides/plugins/jwt#verify-a-token).

### What happens to your Convex Auth data

- **Tables.** Pass `--skip-auth-tables` to the import to leave out Convex Auth's tables. It keeps `users`.
- **Passwords don't transfer.** Existing users set a new password with a password reset flow, or sign up again.
- **User ids change.** A migrated `users.id` is `md5(_id)::uuid`, and the session's user id is a new Managed Better Auth id, so the two never match.

### Connect existing users to their data

Pick one:

- **Remap ids by email.** This is simplest when you can create the accounts. Create each account in Managed Better Auth first. Then, in one transaction, rewrite every user id column from the migrated user id to `neon_auth."user".id`, matched by email, and drop the migrated `users` and `auth_*` tables. Keep app tables free of foreign keys into the `neon_auth` schema.
- **Link on first sign-in.** Keep `users` and add `auth_user_id text UNIQUE`. In `requireUser`, look up the session user by `auth_user_id`. If there's no row, link to the `users` row with the token's `email` only when its `emailVerified` claim is true. Otherwise, create a new user.

<Admonition type="warning" title="Don't link unverified emails">
By default, Managed Better Auth email and password sign-up doesn't require email verification. If you link accounts by email without checking `emailVerified`, anyone who signs up with a migrated user's address takes over that user's data. Turn on [email verification](/docs/auth/guides/email-verification) before you migrate real users.
</Admonition>

## TanStack DB

[TanStack&nbsp;DB](https://tanstack.com/db/latest/docs/overview) is a reactive client store that you query and write locally. It supports fine-grained reactivity, optimistic mutations and automatic management of optimistic state.

The Neon Realtime team develops and maintains TanStack&nbsp;DB. DB has first-class support for Neon&nbsp;Realtime, through [`@neon/realtime-tanstack`](../sdks/typescript#tanstack-db), and integrations for other systems, including Convex.

You can migrate to using TanStack&nbsp;DB with Realtime [from "standard" Convex](#from-the-convex-react-client), using the React client and / or [from using Convex with DB](#from-convex-with-db).

### From the Convex React client

Install the Realtime collection and TanStack&nbsp;DB's React package:

```bash filename="Terminal"
npm install @neon/realtime-tanstack @tanstack/react-db
```

A collection replaces everything from `<ConvexProvider />` to `.withOptimisticUpdate`. The backend routes and the `frontend/api.ts` helpers stay the same, except that the query the collection seals has no `ORDER BY`. TanStack&nbsp;DB orders rows in its local query instead:

| <h4>Convex</h4>                         |     | <h4>TanStack DB</h4>                               |
| --------------------------------------- | --- | -------------------------------------------------- |
| `ConvexProvider` + `useQuery`           | →   | `realtimeCollectionOptions` + `useCollectionQuery` |
| `useMutation` + `.withOptimisticUpdate` | →   | `collection.insert()` + `onInsert`                 |

Create the collection with [`realtimeCollectionOptions()`](../sdks/typescript#tanstack-db-realtimecollectionoptions). It takes the Realtime client directly, so there's no provider:

```ts filename="frontend/collections.ts"
import { createRealtimeClient } from "@neon/realtime/client"
import { drizzleParsers } from "@neon/realtime-drizzle/client"
import { realtimeCollectionOptions } from "@neon/realtime-tanstack"
import { createCollection } from "@tanstack/react-db"

import { fetchSealed, sendMessage } from "./api"

const NEON_REALTIME_URL = import.meta.env.VITE_NEON_REALTIME_URL as string

const client = createRealtimeClient({
  url: NEON_REALTIME_URL,
  // Optional, if using Drizzle
  parsers: { ...drizzleParsers }
})

export async function createMessagesCollection(channelId: string) {
  return createCollection(
    realtimeCollectionOptions({
      id: `messages:${channelId}`,
      client,
      query: await fetchSealed(channelId),
      refreshQuery: () => fetchSealed(channelId),
      getKey: (message) => message.id,
      onInsert: async ({ transaction, collection }) => {
        await Promise.all(
          transaction.mutations.map(async ({ modified }) => {
            const result = await sendMessage(modified)
            if (result.kind === 'committed') await collection.utils.awaitTxId(result.txid, 10_000)
          })
        )
      }
    })
  )
}

export type MessagesCollection = Awaited<ReturnType<typeof createMessagesCollection>>
```

TanStack&nbsp;DB applies each insert to the collection immediately, then calls `onInsert`. The handler writes through the same route as before and waits for the txid, so the optimistic row stays until the synced row replaces it. If the handler throws, the insert rolls back. `onUpdate` and `onDelete` work the same way, as the [mutations guide](../guides/mutations#with-tanstack-db-collections) shows.

Then swap `useQuery` for TanStack&nbsp;DB's own `useLiveQuery`, imported as `useCollectionQuery` to keep it distinct from the Realtime hook, and write with `insert()`:

```tsx filename="frontend/Messages.tsx"
import { useLiveQuery as useCollectionQuery } from "@tanstack/react-db"

function Messages({ messagesCollection, channelId, userId }) {
  const { data: messages } = useCollectionQuery({
    query: (q) =>
      q
        .from({ message: messagesCollection })
        .orderBy(({ message }) => message.created_at, 'asc')
  })

  function send(body: string) {
    messagesCollection.insert({
      id: crypto.randomUUID(),
      channel: channelId,
      author: userId,
      body,
      metadata: { edited: false },
      created_at: new Date(),
    })
  }

  // ...
}
```

Ordering runs in the local query, over the rows the collection holds. To switch channels, create a new collection:

<details>
  <summary>frontend/Channel.tsx</summary>

`Channel` creates the collection for its channel, then renders `<Messages>`:

```tsx filename="frontend/Channel.tsx"
import { useEffect, useState } from "react"

import { createMessagesCollection, type MessagesCollection } from "./collections"
import { Messages } from "./Messages"

export function Channel({ channelId, userId }: { channelId: string; userId: string }) {
  const [messagesCollection, setMessagesCollection] = useState<MessagesCollection>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    let active = true
    setMessagesCollection(undefined) // never show the previous channel's messages in a new channel
    setError(undefined)
    createMessagesCollection(channelId)
      .then((c) => active && setMessagesCollection(c))
      .catch((e: Error) => active && setError(e))
    return () => {
      active = false
    }
  }, [channelId])

  if (error) return <p role="alert">Could not load messages: {error.message}</p>
  if (!messagesCollection) return <p>Loading messages</p>
  return <Messages messagesCollection={messagesCollection} channelId={channelId} userId={userId} />
}
```

</details>

### From Convex with DB

If you already use Convex with TanStack&nbsp;DB, migration is simple. Swap out your collections defined with [`convexCollectionOptions`](https://tanstack.com/db/latest/docs/collections/convex-collection), for collections defined with [`realtimeCollectionOptions`](../sdks/typescript#tanstack-db-realtimecollectionoptions):

```ts filename="frontend/collections.ts"
const client = new ConvexClient(CONVEX_URL) // [!code --]
const client = createRealtimeClient({ url: NEON_REALTIME_URL, parsers: { ...drizzleParsers } }) // [!code ++]

export async function createMessagesCollection(channelId: string) {
  return createCollection(
    convexCollectionOptions({ // [!code --]
    realtimeCollectionOptions({ // [!code ++]
      id: `messages:${channelId}`,
      client,
      query: api.messages.list, // [!code --]
      queryArgs: { channelId }, // [!code --]
      getKey: (message) => message.clientId, // [!code --]
      query: await fetchSealed(channelId), // [!code ++]
      refreshQuery: () => fetchSealed(channelId), // [!code ++]
      getKey: (message) => message.id, // [!code ++]
      onInsert: async ({ transaction, collection }) => {
        await Promise.all(
          transaction.mutations.map(async ({ modified }) => {
            await client.mutation(api.messages.send, { channelId, clientId: modified.clientId, body: modified.body }) // [!code --]
            const result = await sendMessage(modified) // [!code ++]
            if (result.kind === 'committed') await collection.utils.awaitTxId(result.txid, 10_000) // [!code ++]
          })
        )
      }
    })
  )
}
```

The sealed query replaces `query` and `queryArgs`. Your server builds it with the arguments baked in, as in [Auth](#auth) but without `ORDER BY`, and `refreshQuery` renews it before it expires. `onInsert` calls your route instead of `client.mutation()`, then waits for the write's txid.

## Map other Convex features

| Convex                                | Neon                                                                                                                                                        | Notes                                                                                                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `ctx.scheduler.runAfter` / `runAt`    | A deadline column on the row, plus a job that applies overdue work                                                                                          | See [Where background work runs](#where-background-work-runs)                                                                                  |
| `crons.ts`                            | A timer in your server process, or a [Neon Function](/docs/compute/functions/overview) with a [schedule trigger](/docs/compute/functions/triggers/schedule) | Schedule triggers take a five-field cron in UTC                                                                                                |
| An `action` that streams an LLM reply | A job that writes the reply into its row as tokens arrive                                                                                                   | Call the model through the [AI Gateway](/docs/ai-gateway/overview). See [Streaming into rows](#streaming-into-rows)                            |
| `httpAction` / `http.ts`              | A route on your server                                                                                                                                      | Ids change with the default id strategy, so external links and webhooks that stored a Convex id stop matching. `--id-strategy text` keeps them |
| `usePaginatedQuery`                   | A live query with a growing `LIMIT`                                                                                                                         | On "load more", seal the query again with a larger `LIMIT`                                                                                     |
| `withSearchIndex`                     | A `tsvector` column with a GIN index, queried with `@@`                                                                                                     | The tool's default                                                                                                                             |
| `.vectorSearch`                       | [`pgvector`](/docs/extensions/pgvector) or [Lakebase Search](/docs/ai/lakebase-search)                                                                      |                                                                                                                                                |
| `ctx.storage`                         | [Neon Object Storage](/docs/storage/overview)                                                                                                               |                                                                                                                                                |
| Code inside a `query` handler         | SQL in the live query, or code on the client                                                                                                                | Compute what SQL can't from the live rows, for example in a `useMemo`                                                                          |

### Where background work runs

Keep scheduled work in rows, with a deadline column in place of `runAfter`, and have a periodic job apply overdue work. Run that job in your server process if you have a long-running one, or in a [Neon Function](/docs/compute/functions/overview) with a [schedule trigger](/docs/compute/functions/triggers/schedule) when it must survive restarts. Make each transition conditional on the row's current status, so a retry can't apply it twice.

### Streaming into rows

The job writes the reply into its message row as tokens arrive, in batches, for example every 100 ms. Each `UPDATE` commits on its own, so subscribers see the text grow. A `status` column (`streaming`, `done` or `error`) lets the client show progress.

## Frequently asked questions

<Faq>

<FaqItem question="Do I need TanStack DB to migrate my optimistic updates?">

No. Convex's `.withOptimisticUpdate` maps onto React's built-in `useOptimistic` plus `awaitTxId`, using only `@neon/realtime-react` and React. [TanStack DB](#tanstack-db) is an option for a normalized client store or cross-view consistency with automatic rollback, not a requirement.

</FaqItem>

<FaqItem question="Do writes still sync if they don't go through a mutation function?">

Yes. Realtime uses row-level delta sync, so any SQL write that touches a table underlying a sealed live query syncs to subscribers, whether it comes from your write endpoint, another service, or direct SQL. You don't have to funnel writes through one registered path.

</FaqItem>

</Faq>

<Admonition type="important" title="Learn more about Neon Realtime">

Realtime live SQL and reactive DX, built into Postgres. See the [Neon Realtime docs](/docs/realtime/overview) to learn more.

</Admonition>

<NeedHelp />
