---
title: 'Migrate from Convex'
subtitle: "Move a Convex app's reactive model onto Neon Realtime and standard Postgres."
summary: >-
  Map each Convex building block, schema, reactive queries, mutations with optimistic updates, client wiring and auth, onto Neon Realtime: SQL live queries, sealed subscriptions, useLiveQuery and React's useOptimistic, on standard Postgres.
enableTableOfContents: true
---

Convex and Neon Realtime share the same reactive model: you define queries, subscribe to them, write data, and the UI updates as that data changes. So moving an app across is mostly a mechanical remapping. Each Convex building block has a Realtime equivalent that runs on Postgres with ordinary web tooling.

This guide maps the reactive development model: your schema, reactive reads, mutations with optimistic UI, client wiring, and auth. It doesn't cover Convex features that aren't part of reactivity, such as actions, the scheduler, crons, file storage, and vector search. Those route to other Neon services, listed under [What doesn't map](#what-doesnt-map).

## How the reactive models differ

There's one conceptual difference worth understanding before you start, because it changes how you write your mutations.

Convex reactivity is **query-level invalidation**. When a write touches data that a query read, Convex re-runs the whole query function on the server and pushes a fresh result to every subscriber. Writes only ever go through a registered `mutation` function.

Neon Realtime is **row-level delta sync**. Changes to the Postgres rows underlying a sealed live query sync to subscribers as deltas. Writes can originate from anywhere that touches the table: your write endpoint, another service, or direct SQL. They don't have to funnel through one registered path.

The practical consequence for the migration: you keep writing ordinary SQL writes. There's no special mutation path every write has to pass through. Any write that touches the table syncs to the live query on its own.

## Concept mapping

| Convex                                                                 | Neon Realtime / Postgres                                                                                                                                                           |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `convex/schema.ts` (`defineSchema` / `defineTable` / `v.*` / `.index`) | Postgres tables and SQL schema (Drizzle first; raw SQL or Kysely as alternatives). `v.id(...)` refs become foreign-key columns and joins; nested objects become columns or `jsonb` |
| System fields `_id`, `_creationTime`                                   | an explicit `id` primary key and `created_at timestamptz default now()`                                                                                                            |
| `query` fn + `useQuery(api.x, args)` (full re-run invalidation)        | a SQL **live query**, sealed with **`seal({ query })`** in a server handler, subscribed with **`useLiveQuery`** (row-level delta sync)                                             |
| `mutation` fn + `useMutation(api.x)`                                   | a **write endpoint** running SQL `INSERT` / `UPDATE` / `DELETE`; the live query syncs the change back. Return the commit **txid** via SQL `RETURNING`                              |
| `.withOptimisticUpdate(...)` with automatic rollback                   | React's built-in **`useOptimistic`** plus `awaitTxId(txid, timeout)`                                                                                                               |
| `ConvexReactClient` + `ConvexProvider`; `ConvexHttpClient` (SSR)       | one `createRealtimeClient` inside a `RealtimeProvider`, created in the React tree; SSR via a normal Postgres query feeding `initialData`                                           |
| Convex Auth / Clerk / Auth0, `ctx.auth`                                | Managed Better Auth; authorize in the handler, then `seal()`                                                                                                                       |
| `action` / `internalAction` / scheduler / crons                        | Neon Functions and Function Triggers (no Realtime mapping)                                                                                                                         |
| file storage (`ctx.storage`)                                           | Neon Object Storage (separate service)                                                                                                                                             |
| vector search (`.vectorSearch`)                                        | Postgres `pgvector` / Lakebase Search (separate service)                                                                                                                           |

The worked example throughout is a small chat app: channels, channel membership, messages, "list the messages in a channel" for reads, and "send a message" for writes.

<Steps>

## Set up Neon Realtime

Enable Realtime on your Neon branch and install the React-path packages. The fastest way to see the shape of a working app is the `realtime-react` bootstrap template.

Follow the [quickstart](../quickstart) to enable Realtime and get your `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET`, or scaffold a running example:

```bash filename="Terminal"
neon bootstrap my-app --template realtime-react
```

To add Realtime to your existing app, install the packages. You'll need [Node.js 22 or later](https://nodejs.org/):

```bash filename="Terminal"
npm install @neon/realtime @neon/realtime-react @neon/realtime-drizzle
```

For the full enablement and setup details, see [Setup](../guides/queries#setup) in the queries guide. This guide links into the guides for depth rather than repeating them.

## Migrate your schema

Convex tables are document definitions. On Neon you write ordinary Postgres tables. Lead with Drizzle: it's the closest match to Convex's typed TypeScript DX and it's what the template uses.

Your Convex schema declares tables and indexes, and Convex adds `_id` and `_creationTime` to every document for you:

```ts filename="convex/schema.ts"
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  channels: defineTable({
    name: v.string(),
  }),

  messages: defineTable({
    channel: v.id('channels'), // reference to a channels document
    author: v.string(),
    body: v.string(),
    metadata: v.object({ edited: v.boolean() }), // nested object
  }).index('by_channel', ['channel']),
});
```

The Postgres equivalent declares the system fields explicitly, turns `v.id(...)` references into real foreign keys, and maps the nested object to a `jsonb` column:

```ts filename="backend/schema.ts"
import { index, jsonb, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const channels = pgTable('channels', {
  // No default: the client generates the id, so an optimistic row already has its key
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey(),
    channel_id: uuid('channel_id')
      .notNull()
      .references(() => channels.id), // v.id("channels") -> real FK
    author_id: text('author_id').notNull(),
    body: text('body').notNull(),
    metadata: jsonb('metadata').notNull(), // v.object(...) -> jsonb
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('messages_channel_id_idx').on(table.channel_id)] // .index(...) -> SQL index
);

export const channelMembers = pgTable(
  'channel_members',
  {
    channel_id: uuid('channel_id')
      .notNull()
      .references(() => channels.id),
    user_id: text('user_id').notNull(),
  },
  (table) => [primaryKey({ columns: [table.channel_id, table.user_id] })] // one row per member per channel
);

export type Channel = typeof channels.$inferSelect;
export type Message = typeof messages.$inferSelect;
```

The `channel_members` table records who belongs to each channel, which backs the per-channel authorization you'll wire up in [Migrate auth](#migrate-auth).

Field by field:

| Convex                        | Neon / Postgres (Drizzle)                                                   |
| ----------------------------- | --------------------------------------------------------------------------- |
| `_id` (implicit)              | `id: uuid('id').primaryKey()`                                               |
| `_creationTime` (implicit)    | `created_at: timestamp(..., { withTimezone: true }).notNull().defaultNow()` |
| `channel: v.id('channels')`   | `channel_id: uuid(...).references(() => channels.id)` (a real foreign key)  |
| `author: v.string()`          | `author_id: text('author_id').notNull()`                                    |
| `body: v.string()`            | `body: text('body').notNull()`                                              |
| `metadata: v.object({...})`   | `metadata: jsonb('metadata').notNull()` (or flatten to columns)             |
| `.index('by_channel', [...])` | `index('messages_channel_id_idx').on(table.channel_id)`                     |

A couple of notes carry over from Convex's document model. `v.id("channels")` stores a document ID with no database-enforced integrity, because Convex has no joins; on Postgres you get a real foreign key and real joins. A single-field `v.object` can also be flattened into its own column (`boolean('edited').notNull()`); reach for `jsonb` when the shape is open-ended.

Prefer plain SQL? The same schema is a standard `CREATE TABLE` with a `uuid PRIMARY KEY`, a `REFERENCES` foreign key, and a `CREATE INDEX`. Kysely works the same way. Use whichever you already have.

<Callout title="Realtime table requirements">
Realtime streams row changes through logical replication, and each table needs a stable replica identity. A primary key gives you that, so the `id` column above is enough. For the full details, see [Table requirements](../guides/queries#table-requirements) in the queries guide.
</Callout>

Your live queries and writes share one Drizzle client. Create it once from a `pg` pool, the same setup the [Drizzle example](../examples/drizzle) uses:

```ts filename="backend/db.ts"
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

const pool = new Pool({
  // Neon URLs say sslmode=require. Asking pg for verify-full keeps today's checks and skips its warning
  connectionString: process.env.DATABASE_URL!.replace('sslmode=require', 'sslmode=verify-full'),
});
export const db = drizzle(pool, { schema });

// So an idle connection error, for example when the compute scales to zero, doesn't crash the API
pool.on('error', (error: Error) => console.error(error));
```

The query and write files below both import this `db`. Realtime never runs your live queries through it; the adapter only compiles them to SQL. `db` still runs your writes and any server-side reads, such as the rows you server-render.

## Migrate your data

This is a one-time snapshot migration, not the reactive model. Keep it simple.

1. **Export from Convex.** Run `npx convex export --path ./convex-snapshot.zip` to get a ZIP snapshot of your deployment's tables. (Add `--include-file-storage` only if you also need stored files; those go to Neon Object Storage, not Realtime.)

   ```bash filename="Terminal"
   npx convex export --path ./convex-snapshot.zip
   ```

2. **Transform documents to rows.** Map each document to a Postgres row: `_id` to `id`, `_creationTime` (milliseconds since the epoch) to a `created_at` timestamp, nested objects to `jsonb` or flattened columns, and each `v.id(...)` reference to the matching foreign-key value.
3. **Load into Postgres.** Insert the rows with your usual tooling (SQL `INSERT`, `COPY`, or a Drizzle seed script) against your Neon branch once the schema exists.

Pick one id strategy and apply it consistently. Either keep Convex `_id` strings as `text` primary keys, which skips reference remapping but means changing the `uuid` columns above to `text`, or assign new `uuid`s and build an old-to-new id map during the transform so you can rewrite every reference. The schema above uses `uuid` to match the client-generated-id pattern that makes optimistic writes flicker-free, so the second option is the default.

## Migrate your queries

A Convex read lives in a registered `query` function and a `useQuery` subscription:

```ts filename="convex/messages.ts"
import { query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: { channelId: v.id('channels') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_channel', (q) => q.eq('channel', args.channelId))
      .order('asc')
      .collect();
  },
});
```

On Neon you write the same read as an ordinary SQL query, seal it in a server handler, and subscribe to the sealed query on the client. Three pieces replace the Convex `query` plus `useQuery` pair:

**1. The live query (SQL).** Write it with Drizzle. This query joins through a `channel_members` table so it only returns messages from channels the user belongs to, and that join is also the authorization (more on that in [Migrate auth](#migrate-auth)):

```ts filename="backend/queries.ts"
import { and, asc, eq, getTableColumns } from 'drizzle-orm';

import { db } from './db';
import { channelMembers, messages } from './schema';

export function messagesQuery(userId: string, channelId: string) {
  return db
    .select(getTableColumns(messages)) // keep the row flat so it seals; a bare select() over a join won't
    .from(messages)
    .innerJoin(channelMembers, eq(channelMembers.channel_id, messages.channel_id))
    .where(and(eq(channelMembers.user_id, userId), eq(messages.channel_id, channelId)))
    .orderBy(asc(messages.created_at)); // oldest first, newest at the bottom, matching the Convex order
}
```

Raw SQL and Kysely work too; a raw query must be a single `SELECT` with `$1`, `$2` placeholders. See [Defining live queries](../guides/queries#defining-live-queries).

**2. Authorize, then seal.** Create the Realtime server once with the Drizzle adapter, then expose an endpoint that reads the verified identity, builds the query with server-side parameters, and seals it. `seal({ query })` takes an object with a `query` field and returns a short-lived, opaque `SealedLiveQuery` the client can subscribe to:

```ts filename="backend/realtime.ts"
import { createRealtime } from '@neon/realtime/server';
import { drizzleAdapter } from '@neon/realtime-drizzle';

export const realtime = createRealtime({
  secret: process.env.NEON_REALTIME_SECRET!,
  db: 'neondb',
  adapter: drizzleAdapter(),
});
```

```ts filename="backend/server.ts"
import { Hono } from 'hono';

import { requireUser } from './auth';
import { messagesQuery } from './queries';
import { realtime } from './realtime';

const app = new Hono().post('/api/messages/live', async (c) => {
  const user = await requireUser(c); // verified identity, never the client
  const { channelId } = await c.req.json();

  const query = messagesQuery(user.id, channelId); // bake the verified user id in
  const sealedQuery = await realtime.seal({ query }); // then seal

  return c.json(sealedQuery);
});

export default app;
```

This mirrors Convex's "check auth at the top of the function." The `user.id` comes from the verified session, never the client; the client only supplies `channelId`. You add the write route to this same app in [Migrate your mutations](#migrate-your-mutations). See [Sealing queries](../guides/queries#sealing-queries) and [Exposing queries](../guides/queries#exposing-queries).

**3. Subscribe with `useLiveQuery`.** The hook takes a sealed query (not raw params) and returns `{ data, status, error, utils }`. `data` is `undefined` until the first result arrives, which is the same loading contract as Convex's `useQuery` returning `undefined`:

```tsx filename="frontend/Messages.tsx"
import { useLiveQuery } from '@neon/realtime-react';
import type { SealedLiveQuery } from '@neon/realtime/client';

import type { Message } from '../backend/schema';

interface Props {
  sealedQuery: SealedLiveQuery<Message>;
  refreshQuery: () => Promise<SealedLiveQuery<Message>>;
}

export function Messages({ sealedQuery, refreshQuery }: Props) {
  const { data, status, error } = useLiveQuery(sealedQuery, { refreshQuery });

  if (status === 'error') return <p role="alert">Live updates stopped: {error.message}</p>;
  if (data === undefined) return <p>Loading messages</p>;

  return (
    <ul>
      {status === 'stale' && <li role="status">Updating</li>}
      {data.map((message) => (
        <li key={message.id}>{message.body}</li>
      ))}
    </ul>
  );
}
```

This is the read-only version. In [Migrate your mutations](#migrate-your-mutations) you extend this same `Messages` component with a send form, optimistic state, and SSR `initialData`, keeping the `refreshQuery` it already has.

Two differences from Convex are worth knowing:

- **Sealed queries expire** (currently 60 seconds). To keep a subscription running, pass a `refreshQuery` callback that returns a fresh sealed query for the _same_ query; the hook renews it before it expires. See [refreshQuery](../guides/reactivity#refreshquery).
- **To change parameters** (switch channels), fetch a new sealed query for the new channel and pass it in. A new sealed query is a new logical subscription, so build a matching `refreshQuery` for the new parameters. See [Changing query parameters](../guides/reactivity#changing-query-parameters).

## Migrate your mutations

Convex's `.withOptimisticUpdate` maps onto **React's built-in `useOptimistic`**.

In Convex, writes go through a registered `mutation` that validates its args and inserts the document:

```ts filename="convex/messages.ts"
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const send = mutation({
  args: { channelId: v.id('channels'), body: v.string() },
  handler: async (ctx, { channelId, body }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error('Unauthenticated');
    await ctx.db.insert('messages', {
      channel: channelId,
      author: identity.subject,
      body,
      metadata: { edited: false },
    });
  },
});
```

Optimistic UI is a callback on the client that patches the query cache, with automatic rollback. The optimistic document carries every field the schema requires, so it matches a real row:

```tsx filename="src/MessageSender.tsx"
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import type { Id } from '../convex/_generated/dataModel';

const sendMessage = useMutation(api.messages.send).withOptimisticUpdate((localStore, args) => {
  const { channelId, body } = args;
  const existing = localStore.getQuery(api.messages.list, { channelId });
  if (existing !== undefined) {
    localStore.setQuery(api.messages.list, { channelId }, [
      ...existing,
      {
        _id: crypto.randomUUID() as Id<'messages'>,
        _creationTime: Date.now(),
        channel: channelId,
        author: 'me', // the signed-in user, which the client already knows
        body,
        metadata: { edited: false },
      },
    ]);
  }
});
// usage: await sendMessage({ channelId, body })
```

On Neon you build this in two stages: a basic reactive write first, then the optimistic overlay.

### Stage 1: a basic reactive write

The write is a plain POST endpoint running SQL. Its own `RETURNING` clause hands back the commit txid, which you'll use in stage 2:

```ts filename="backend/mutations.ts"
import { sql } from 'drizzle-orm';

import { db } from './db';
import { messages } from './schema';

// Read the txid in the write's own RETURNING. One statement = one transaction = one txid,
// no extra round trip. ::text keeps the 64-bit value exact in JS.
const txid = sql<string>`pg_current_xact_id()::text`;

// POST /api/messages  { id, channelId, body }
export async function sendMessage(
  user: { id: string },
  input: { id: string; channelId: string; body: string }
) {
  const [row] = await db
    .insert(messages)
    .values({ id: input.id, channel_id: input.channelId, body: input.body, author_id: user.id, metadata: {} })
    .returning({ txid });

  return row ? { kind: 'committed' as const, txid: row.txid } : { kind: 'unchanged' as const };
}
```

Expose it as a route on the same Hono app from [Migrate your queries](#migrate-your-queries). Hono wants every route chained onto one `new Hono()`, so here's the app with both the live-query endpoint and the write route. The handler reads the verified user, parses `{ id, channelId, body }`, and calls `sendMessage`:

```ts filename="backend/server.ts"
import { Hono } from 'hono';

import { requireUser } from './auth';
import { messagesQuery } from './queries';
import { sendMessage } from './mutations';
import { realtime } from './realtime';

const app = new Hono()
  .post('/api/messages/live', async (c) => {
    const user = await requireUser(c); // verified identity, never the client
    const { channelId } = await c.req.json();

    const query = messagesQuery(user.id, channelId); // bake the verified user id in
    const sealedQuery = await realtime.seal({ query }); // then seal

    return c.json(sealedQuery);
  })
  .post('/api/messages', async (c) => {
    const user = await requireUser(c); // same verified identity
    const { id, channelId, body } = await c.req.json();

    return c.json(await sendMessage(user, { id, channelId, body }));
  });

export default app;
```

On the client, POST. The live query picks up the new row on its own once it syncs back. There's no `revalidate` and no manual refetch, only a visible round-trip plus replication lag before the message appears:

```tsx
async function send(body: string) {
  await fetch('/api/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: crypto.randomUUID(), channelId, body }),
  });
}
```

This already replaces Convex's registered mutation plus automatic query re-run. The sealed live query delivers the change by row-level delta sync.

### Stage 2: optimistic UI with `useOptimistic`

To make the write feel instant, overlay React's `useOptimistic`. The client picks the id with `crypto.randomUUID()`, applies the change optimistically inside `startTransition`, POSTs the write, and awaits the returned txid. The synced row carries the same id, so there's no flicker, and React drops the optimistic state when the transition ends.

```tsx filename="frontend/optimistic.ts"
import type { Message } from '../backend/schema';

export type OptimisticMessage = Message & { pending?: true };
export type OptimisticAction = { type: 'send'; message: Message };

// React re-applies pending actions to every new live snapshot, so each case must be
// safe to re-run: skip the message if the synced rows already include it.
export function applyOptimisticAction(
  messages: readonly OptimisticMessage[],
  action: OptimisticAction
): readonly OptimisticMessage[] {
  switch (action.type) {
    case 'send':
      return messages.some((m) => m.id === action.message.id)
        ? messages
        : [...messages, { ...action.message, pending: true }]; // append: oldest first, new row at the bottom
  }
}

export const SYNC_TIMEOUT_MS = 10_000; // always pass a timeout to awaitTxId
```

This is the final `Messages` component. It extends the read-only version from [Migrate your queries](#migrate-your-queries): it keeps `refreshQuery` (without it the sealed query expires after about 60 seconds) and accepts SSR `initialData`, then layers the send form and optimistic state on top. The [parent that wires it up](#wire-up-the-client) passes `sealedQuery`, `refreshQuery`, `channelId`, and `userId`, plus `initialData` when the page is server-rendered.

```tsx filename="frontend/Messages.tsx"
import { type FormEvent, startTransition, useOptimistic } from 'react';
import { useLiveQuery } from '@neon/realtime-react';
import type { SealedLiveQuery } from '@neon/realtime/client';

import type { Message } from '../backend/schema';
import { applyOptimisticAction, SYNC_TIMEOUT_MS } from './optimistic';
import type { OptimisticAction, OptimisticMessage } from './optimistic';

interface Props {
  sealedQuery: SealedLiveQuery<Message>;
  refreshQuery: () => Promise<SealedLiveQuery<Message>>;
  initialData?: readonly Message[];
  channelId: string;
  userId: string;
}

export function Messages({ sealedQuery, refreshQuery, initialData, channelId, userId }: Props) {
  // refreshQuery renews the sealed query before it expires; initialData renders the SSR rows at once.
  const { data, status, error, utils } = useLiveQuery(sealedQuery, { refreshQuery, initialData });

  const [messages, addOptimistic] = useOptimistic<readonly OptimisticMessage[], OptimisticAction>(
    data ?? initialData ?? [],
    applyOptimisticAction
  );

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = String(new FormData(form).get('body') ?? '').trim();
    if (!body) return;
    form.reset();

    // The client picks the id, so the optimistic row and the synced row share a key.
    const message: Message = {
      id: crypto.randomUUID(),
      channel_id: channelId,
      body,
      author_id: userId,
      metadata: {},
      created_at: new Date(),
    };

    startTransition(async () => {
      addOptimistic({ type: 'send', message });

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: message.id, channelId, body }),
      });
      const result: { kind: 'committed'; txid: string } | { kind: 'unchanged' } = await res.json();

      if (result.kind === 'committed') {
        // Hold the transition until the stream has applied this transaction. awaitTxId
        // resolves after the rows are published, so data already has the write: no flicker.
        await utils.awaitTxId(result.txid, SYNC_TIMEOUT_MS);
      }
      // When the transition ends, React drops the optimistic state. By then the same-id row
      // is in data. If the write failed or timed out, the optimistic row drops the same way.
    });
  }

  if (status === 'error') return <p role="alert">Live updates stopped: {error.message}</p>;
  if (data === undefined) return <p>Loading messages</p>;

  return (
    <section>
      <form onSubmit={send}>
        <input name="body" placeholder="Message" required />
        <button type="submit">Send</button>
      </form>
      {status === 'stale' && <p role="status">Updating</p>}
      <ul>
        {messages.map((m) => (
          <li key={m.id} aria-busy={m.pending}>
            {m.body}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

The mapping, piece by piece:

| Convex                                                         | Neon Realtime (React only)                                                                                           |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `useMutation(api.x).withOptimisticUpdate((localStore) => ...)` | `useOptimistic(data, reducer)` plus `addOptimistic(action)` inside `startTransition`                                 |
| client auto-rolls-back when the mutation completes             | React drops the optimistic state when the transition ends; `awaitTxId(txid, timeout)` holds it until the row arrives |
| Convex assigns `_id`                                           | the client picks `id` with `crypto.randomUUID()` so optimistic and synced rows share a key                           |

Two things to get right:

<Admonition type="important" title="Read the txid from RETURNING, and always pass a timeout">
Get the txid from the write's own `RETURNING pg_current_xact_id()::text`. One statement is one transaction is one txid, with no extra round trip. Don't wrap the write in `db.transaction()` just to `SELECT pg_current_xact_id()`: that's four round trips (`BEGIN`, write, `SELECT`, `COMMIT`) and holds a pooled connection the whole time.

Always pass a timeout to `awaitTxId`. Its default is to wait forever. With a timeout, a write that never syncs rejects, the optimistic row drops, and your UI can show that it couldn't confirm. The guides use `10_000` (10 seconds).
</Admonition>

See [How optimistic mutations work](../guides/mutations#how-optimistic-mutations-work) and [With React's `useOptimistic` hook](../guides/mutations#with-reacts-useoptimistic-hook).

If you keep state in a normalized client store, or need the same optimistic change to stay consistent across several views with automatic rollback, use the TanStack DB binding instead (see [TanStack DB](../guides/reactivity#tanstack-db) and [With TanStack DB collections](../guides/mutations#with-tanstack-db-collections)). It's an option, not a requirement; the core path above is React only.

## Wire up the client

Convex wraps your app in a `ConvexProvider` fed by a `ConvexReactClient` singleton:

```tsx filename="src/main.tsx"
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

root.render(
  <ConvexProvider client={convex}>
    <App />
  </ConvexProvider>
);
```

Neon Realtime is the same shape: one `createRealtimeClient` wrapped in a `RealtimeProvider`. Create it once inside the React tree, in a `useState` initializer, so the same code works with or without SSR and browser-only setup stays out of server code. `createRealtimeClient` takes a single options object with a required `url` and an optional `parsers`. There's no `secret` on the client; it carries no credential, because the sealed query is the authorization. The `drizzleParsers` spread keeps live-row types matching your Drizzle server reads:

```tsx filename="frontend/RealtimeRoot.tsx"
import { createRealtimeClient } from '@neon/realtime/client';
import { drizzleParsers } from '@neon/realtime-drizzle/client';
import { RealtimeProvider } from '@neon/realtime-react';
import { type ReactNode, useState } from 'react';

export function RealtimeRoot({ url, children }: { url: string; children: ReactNode }) {
  // Create the client once. Creating it opens no connection, so it's safe during a server render;
  // the subscription connects in the browser after hydration.
  const [client] = useState(() => createRealtimeClient({ url, parsers: { ...drizzleParsers } }));
  return <RealtimeProvider client={client}>{children}</RealtimeProvider>;
}
```

Wrap your app in it, passing the URL from the server:

```tsx filename="frontend/main.tsx"
import { RealtimeRoot } from './RealtimeRoot';

root.render(
  <RealtimeRoot url={import.meta.env.VITE_NEON_REALTIME_URL}>
    <App />
  </RealtimeRoot>
);
```

Components inside the provider read the shared client from context. `useLiveQuery` does this for you; when a component needs the client directly, it calls [`useRealtimeClient()`](../sdks/typescript#react-userealtimeclient), which returns the provider's client.

One parent component ties the pieces together: it fetches the sealed query for a channel, builds a matching `refreshQuery`, and renders the final `Messages`.

<details>
  <summary>The parent that fetches the sealed query and renders Messages</summary>

First, a helper that POSTs the channel id and gets back a sealed query. Send your Managed Better Auth token in the `Authorization` header, as the [subscribing guide](../guides/subscribing#fetch-from-an-api-endpoint) shows:

```ts filename="frontend/api.ts"
import type { SealedLiveQuery } from '@neon/realtime/client';

import type { Message } from '../backend/schema';

export async function fetchSealedMessages(channelId: string): Promise<SealedLiveQuery<Message>> {
  const res = await fetch('/api/messages/live', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ channelId }),
  });
  if (!res.ok) throw new Error(`Could not fetch the sealed query (${res.status})`);
  return (await res.json()) as SealedLiveQuery<Message>;
}
```

Then the parent. It fetches the sealed query when the channel changes, builds a `refreshQuery` that re-fetches a fresh one for the _same_ channel, and renders `Messages`. Under SSR, skip the fetch and pass the server's rows from `loadMessagesPage` to `Messages` as `initialData` instead:

```tsx filename="frontend/Channel.tsx"
import { useCallback, useEffect, useState } from 'react';
import type { SealedLiveQuery } from '@neon/realtime/client';

import type { Message } from '../backend/schema';
import { fetchSealedMessages } from './api';
import { Messages } from './Messages';

interface SealedChannel {
  channelId: string;
  sealedQuery?: SealedLiveQuery<Message>;
  error?: unknown;
}

function useSealedQuery(channelId: string): SealedChannel | undefined {
  const [sealed, setSealed] = useState<SealedChannel>();

  useEffect(() => {
    let cancelled = false;
    fetchSealedMessages(channelId).then(
      (sealedQuery) => {
        if (!cancelled) setSealed({ channelId, sealedQuery });
      },
      (error: unknown) => {
        if (!cancelled) setSealed({ channelId, error });
      }
    );
    return () => {
      cancelled = true;
    };
  }, [channelId]);

  // Never hand the previous channel's sealed query to the new channel
  return sealed?.channelId === channelId ? sealed : undefined;
}

export function Channel({ channelId, userId }: { channelId: string; userId: string }) {
  const sealed = useSealedQuery(channelId);
  // Renewals must be for the same query, so refresh with the same channel
  const refreshQuery = useCallback(() => fetchSealedMessages(channelId), [channelId]);

  if (sealed?.sealedQuery) {
    return (
      <Messages sealedQuery={sealed.sealedQuery} refreshQuery={refreshQuery} channelId={channelId} userId={userId} />
    );
  }
  if (sealed?.error) return <p role="alert">Couldn't open this channel</p>;
  return <p>Loading messages</p>;
}
```

The `channelId` check never hands the previous channel's sealed query to a new channel, and the `cancelled` flag drops a response that arrives after the channel changed. See [Changing query parameters](../guides/reactivity#changing-query-parameters).

</details>

For server-side rendering, Convex constructs a `ConvexHttpClient` (from `convex/browser`) per request to prefetch a one-off snapshot. Neon needs no special SSR client: run an ordinary Postgres query on the server for the initial rows, seal the _same_ query, and pass the rows to `useLiveQuery` as `initialData`. Awaiting the Drizzle builder runs it for the initial read; `realtime.seal({ query })` compiles the same builder without running it:

```ts filename="backend/messages-page.ts"
import { messagesQuery } from './queries';
import { realtime } from './realtime';

export async function loadMessagesPage(userId: string, channelId: string) {
  const query = messagesQuery(userId, channelId);
  const [initialData, sealedQuery] = await Promise.all([query, realtime.seal({ query })]);
  return { initialData, sealedQuery };
}
```

`Messages` passes `initialData` into `useLiveQuery` so the server's rows render straight away, then the live subscription takes over after hydration. `RealtimeRoot` already creates the client in the React tree, so the same wiring renders on the server and connects in the browser. See [Server-side rendering](../guides/ssr) and [React](../guides/reactivity#react).

## Migrate auth

Convex checks auth at the top of a function through `ctx.auth`, whatever the provider (Convex Auth, Clerk, or Auth0):

```ts filename="convex/messages.ts"
export const list = query({
  args: { channelId: v.id('channels') },
  handler: async (ctx, { channelId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error('Unauthenticated');
    // scope the read by the verified identity...
  },
});
```

On Neon, the same check moves into your request handler, which you already saw in [Migrate your queries](#migrate-your-queries): read the verified session or JWT, authorize with your own business logic, build the query with parameters baked in from the verified identity, then `seal()`. Managed Better Auth provides the identity. A sealed query is opaque and short-lived, and the client can't read or change its parameters, so they're fixed server-side.

Here's the `requireUser` the handler calls. With Vite and Hono, the browser sends its Managed Better Auth session as a bearer token, and the API verifies that JWT against your [Managed Better Auth JWKS](/docs/auth/guides/plugins/jwt#verify-a-token) with `jose`. Next.js and TanStack Start mount Managed Better Auth on your app's own origin and read the session from its cookie instead, as the [Next.js example](../examples/nextjs) and the [SSR guide](../guides/ssr) show.

<details>
  <summary>backend/auth.ts: verify the token and return the user id</summary>

```ts filename="backend/auth.ts"
import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const authUrl = process.env.NEON_AUTH_BASE_URL!;
const origin = new URL(authUrl).origin;
const jwks = createRemoteJWKSet(new URL(`${authUrl}/.well-known/jwks.json`));

async function verifyUserId(token: string): Promise<string | undefined> {
  try {
    const { payload } = await jwtVerify(token, jwks, { issuer: origin, audience: origin });
    return payload.sub;
  } catch {
    return undefined;
  }
}

export async function getUser(headers: Headers): Promise<{ id: string } | undefined> {
  const header = headers.get('Authorization');
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;
  const userId = token ? await verifyUserId(token) : undefined;
  return userId ? { id: userId } : undefined;
}

// requireUser reads the verified identity from the request and returns { id }, or rejects with 401.
export async function requireUser(c: Context): Promise<{ id: string }> {
  const user = await getUser(c.req.raw.headers);
  if (!user) throw new HTTPException(401, { message: 'Unauthorized' });
  return user;
}
```

`jose` validates the token against the JWKS, so install it alongside Hono (`npm install hono jose`). This is the same helper the [queries guide's endpoint](../guides/queries#exposing-an-endpoint) uses.

</details>

The handler then uses it exactly as [Migrate your queries](#migrate-your-queries) showed: `requireUser(c)` authorizes, you build the query with `user.id`, then `seal()`.

Two properties are worth calling out:

- **Live authorization.** The authorization is part of the query. `messagesQuery` joins through `channel_members` and filters on the user id, so it only returns messages from channels the user belongs to. Because that join is in the live query, removing someone from a channel revokes their access to its messages in real time. Realtime authorizes the query, not the connection. See [Live authorization](../guides/queries#live-authorization).
- **RLS isn't the model yet.** Realtime reuses your existing backend auth logic rather than Postgres row-level security. RLS support is planned before GA but isn't the recommended approach today. See [Why not row-level security](../guides/queries#why-not-row-level-security).

</Steps>

## What doesn't map

Some Convex features aren't part of the reactive model, so there's no Realtime equivalent. Route them to the right Neon service instead:

- **`action` / `internalAction`, the scheduler, and crons** map to [Neon Functions](/docs/compute/functions/overview), with [Function Triggers](/docs/compute/functions/triggers/overview) for scheduled runs and object-storage events.
- **File storage (`ctx.storage`)** maps to [Neon Object Storage](/docs/storage/overview).
- **Vector search (`.vectorSearch`)** maps to Postgres [`pgvector`](/docs/extensions/pgvector) or [Lakebase Search](/docs/ai/lakebase-search).
- **External LLM calls** map to the [Neon AI Gateway](/docs/ai-gateway/overview).

These are deliberately out of scope for a reactivity migration. Move your reactive reads and writes onto Realtime first, then wire up these services separately.

## Next steps

- [Next.js example](../examples/nextjs) and [TanStack example](../examples/tanstack): full-stack apps you can read end to end.
- [Quickstart](../quickstart): enable Realtime and run your first live query.
- [TypeScript SDK reference](../sdks/typescript): every `@neon/*` symbol used above.

## Frequently asked questions

<Faq>

<FaqItem question="Do I need TanStack DB to migrate my optimistic updates?">
No. Convex's `.withOptimisticUpdate` maps onto React's built-in `useOptimistic` plus `awaitTxId`, using only `@neon/realtime-react` and React. TanStack DB is an option for a normalized client store or cross-view consistency with automatic rollback, not a requirement for the core reactive model.
</FaqItem>

<FaqItem question="What happens to my Convex actions, scheduler, and crons?">
They move to [Neon Functions](/docs/compute/functions/overview), with [Function Triggers](/docs/compute/functions/triggers/overview) for scheduled runs and object-storage events. They aren't part of the reactivity migration, so wire them up separately after your reads and writes are on Realtime.
</FaqItem>

<FaqItem question="Do writes still sync if they don't go through a mutation function?">
Yes. Realtime uses row-level delta sync, so any SQL write that touches a table underlying a sealed live query syncs to subscribers, whether it comes from your write endpoint, another service, or direct SQL. You don't have to funnel writes through one registered path.
</FaqItem>

</Faq>

<NeedHelp />
