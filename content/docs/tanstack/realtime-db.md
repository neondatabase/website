---
title: Neon Realtime with TanStack DB
subtitle: Sync live SQL query results into TanStack DB collections
summary: >-
  Use @neon/realtime-tanstack to sync a sealed, read-only SQL query on Lakebase
  Postgres into a keyed TanStack DB collection. Covers sealing queries in
  TanStack Start server functions, the collection descriptor, optimistic writes
  confirmed by Postgres transaction ID, SSR with a per-request DbClient, and
  common mistakes.
enableTableOfContents: true
noindex: true
updatedOn: '2026-11-13T07:16:27.663Z'
---

<FeatureBetaProps feature_name="Realtime" />

[Neon Realtime](/docs/realtime/overview) keeps the result of a read-only SQL query live. The `@neon/realtime-tanstack` adapter syncs that result into a keyed [TanStack DB](https://tanstack.com/db) collection, so components query it locally with `useLiveQuery()` and every client sees the same rows. Any read-only query works, including joins, aggregates, window functions and subqueries. Writes go through your own server functions.

## Before you begin

- Your Neon project must be in a [supported region](/docs/realtime/overview#which-regions-is-it-enabled-in).
- Enabling Realtime permanently turns on [logical replication](/docs/guides/logical-replication-neon) for the project and suspends every compute on every branch, which drops active connections. Each compute starts again on its next connection.
- Tables in live queries need a stable replica identity. A primary key is enough.
- For SSR in TanStack Start, `@tanstack/react-router-with-db` requires `@tanstack/react-db` 1.0.0-rc.1 or later.

## Install

```bash filename="Terminal"
npm install @neon/realtime @neon/realtime-tanstack @tanstack/react-db pg zod
npm install -D @types/pg
npm install @tanstack/react-router-with-db # TanStack Start SSR only
```

Enable Realtime in `neon.ts` and run `neon deploy`. It writes `DATABASE_URL`, `NEON_REALTIME_URL` and `NEON_REALTIME_SECRET` to `.env.local`:

```ts filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  preview: {
    realtime: {
      allowedOrigins: ['http://localhost:3000'],
    },
  },
});
```

| Variable                 | Where       |
| ------------------------ | ----------- |
| `DATABASE_URL`           | Server only |
| `NEON_REALTIME_SECRET`   | Server only |
| `VITE_NEON_REALTIME_URL` | Browser     |

```bash filename="Terminal"
echo 'VITE_NEON_REALTIME_URL=$NEON_REALTIME_URL' >> .env.local
```

Never give `NEON_REALTIME_SECRET` a `VITE_` prefix. The browser only sees the Realtime URL and sealed queries.

## Define and seal the query

The server reads initial rows and writes through a `pg` pool on the pooled connection string. See [Serverless driver vs node-postgres for TanStack Start](/docs/tanstack/drivers) for other deploy targets:

```ts filename="src/db.server.ts"
import { Pool } from 'pg';

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```

Define each live query once in server code. Run it for the SSR rows and [seal](/docs/realtime/guides/queries#sealing-queries) it for the browser, so both return the same rows:

```ts filename="src/todos.server.ts"
import { createRealtime, rawSql } from '@neon/realtime/server';

export const realtime = createRealtime({
  secret: process.env.NEON_REALTIME_SECRET!,
  db: 'neondb',
});

export type Todo = { id: string; title: string; completed: boolean };

export const TODOS_SQL = 'SELECT id, title, completed FROM todos WHERE user_id = $1';

export const todosQuery = (userId: string) => rawSql<Todo>(TODOS_SQL, [userId]);
```

Every server function that reads, seals or writes todos runs `requirePageUser`. It checks the session with `requireUser` and rejects a page that was loaded for a different user, for example after signing in as someone else in another tab:

```ts filename="src/page-user.functions.ts"
import { createMiddleware } from '@tanstack/react-start';
import { setResponseStatus } from '@tanstack/react-start/server';
import { z } from 'zod';

import { requireUser } from './auth.functions';

// Loose, so each server function's own fields reach its validator.
export const requirePageUser = createMiddleware({ type: 'function' })
  .middleware([requireUser])
  .validator(z.looseObject({ userId: z.string() }))
  .server(({ next, context, data }) => {
    if (context.user.id !== data.userId) {
      setResponseStatus(401);
      throw new Error('UNAUTHENTICATED');
    }
    return next({ context: { user: context.user } });
  });
```

```ts filename="src/todos.functions.ts"
import { createServerFn } from '@tanstack/react-start';

import { pool } from './db.server';
import { requirePageUser } from './page-user.functions';
import { realtime, todosQuery, TODOS_SQL, type Todo } from './todos.server';

// The page's rows, plus a sealed live query for exactly the same rows.
export const loadTodos = createServerFn({ method: 'POST' })
  .middleware([requirePageUser])
  .handler(async ({ context }) => {
    const [{ rows }, query] = await Promise.all([
      pool.query<Todo>(TODOS_SQL, [context.user.id]),
      realtime.seal({ query: todosQuery(context.user.id) }),
    ]);
    return { rows, query };
  });

// Re-seals the same query before the current one expires.
export const refreshTodosQuery = createServerFn({ method: 'POST' })
  .middleware([requirePageUser])
  .handler(({ context }) => realtime.seal({ query: todosQuery(context.user.id) }));
```

- The user ID comes from the session, never from the browser. The `WHERE` clause is the authorization boundary.
- A sealed query is a bearer credential. Return it from `POST` server functions and keep pages that embed it out of shared caches.
- `refreshQuery` must seal the same SQL and parameters as the loader.
- Drizzle and Kysely queries can be sealed directly by passing `drizzleAdapter()` from `@neon/realtime-drizzle` or the Kysely adapter as `adapter` to `createRealtime()`. See [Using a query builder or ORM](/docs/realtime/guides/queries#using-a-query-builder-or-orm).

`requireUser` reads the session and puts the signed-in user on `context`. For Managed Better Auth on TanStack Start, see [Neon Auth with TanStack Start and Router](/docs/tanstack/auth).

## Define the collection

Define the collection as a descriptor with `collectionOptions(id, factory)`, so the route loader and the component resolve the same collection inside one `DbClient`:

```ts filename="src/todos.collection.ts"
import type { RealtimeClient, SealedLiveQuery } from '@neon/realtime/client';
import { realtimeCollectionOptions } from '@neon/realtime-tanstack';
import { collectionOptions } from '@tanstack/react-db';

import { createTodos, refreshTodosQuery } from './todos.functions';
import type { Todo } from './todos.server';

// The session is gone or belongs to another user: reload, which drops this
// page's DbClient and the previous user's rows.
function leaveIfSignedOut(error: unknown): never {
  if (error instanceof Error && error.message === 'UNAUTHENTICATED') window.location.assign('/');
  throw error;
}

export function todosCollection(userId: string, query: SealedLiveQuery<Todo>) {
  const id = `todos:${userId}`;
  return collectionOptions(id, (db) =>
    realtimeCollectionOptions({
      id,
      query,
      client: db.requireDependency<RealtimeClient>('realtime'),
      getKey: (todo) => todo.id,
      // A collection rebuilt after garbage collection would restart from an expired sealed query.
      gcTime: 0,
      refreshQuery: () => refreshTodosQuery({ data: { userId } }).catch(leaveIfSignedOut),
      onInsert: async ({ transaction, collection }) => {
        const { txid } = await createTodos({
          data: { userId, batch: transaction.mutations.map((m) => m.modified) },
        }).catch(leaveIfSignedOut);
        if (txid) await collection.utils.awaitTxId(txid, 10_000);
      },
    })
  );
}
```

The adapter syncs eagerly. It has no `syncMode` option. See the [`realtimeCollectionOptions()` reference](/docs/realtime/sdks/typescript#tanstack-db-realtimecollectionoptions) for every option.

## Return the transaction ID from writes

Each mutation handler sends the whole TanStack DB transaction to one server function. The server function writes it in one SQL statement and returns that statement's Postgres transaction ID, so the handler can wait for the change to arrive on the subscription:

```ts filename="src/todos.functions.ts"
import { z } from 'zod';

// Strips unknown keys, so a row's user_id can never come from the browser.
const newTodosInput = z.object({
  userId: z.string(),
  batch: z.array(z.object({ id: z.string().uuid(), title: z.string().min(1), completed: z.boolean() })),
});

export const createTodos = createServerFn({ method: 'POST' })
  .middleware([requirePageUser])
  .validator(newTodosInput)
  .handler(async ({ data: { batch }, context }) => {
    const { rows } = await pool.query<{ txid: string }>(
      `INSERT INTO todos (id, user_id, title, completed)
       SELECT id, $1, title, completed
       FROM jsonb_to_recordset($2::jsonb) AS t(id uuid, title text, completed boolean)
       RETURNING pg_current_xact_id()::text AS txid`,
      [context.user.id, JSON.stringify(batch)]
    );
    return { txid: rows[0]?.txid ?? null };
  });
```

- Read `pg_current_xact_id()::text` inside the same transaction as the write. The collection expects a decimal string.
- If no row changed, return `txid: null` and skip the wait.
- Scope `UPDATE` and `DELETE` statements to the session user as well as the row ID.
- Once the server returned a transaction ID, the write committed. If `awaitTxId()` times out, show the change as saved and don't resend it. See [optimistic mutations](/docs/realtime/guides/mutations).

## Server-side rendering with TanStack Start

Create the `DbClient` in `getRouter()`, which TanStack Start calls once per server request and once per page load in the browser:

```tsx filename="src/router.tsx"
import { createRealtimeClient } from '@neon/realtime/client';
import { DbClient } from '@tanstack/react-db';
import { createRouter } from '@tanstack/react-router';
import { routerWithDbClient } from '@tanstack/react-router-with-db';

import { routeTree } from './routeTree.gen';

export interface RouterContext {
  readonly dbClient: DbClient;
}

export function getRouter() {
  const realtime = createRealtimeClient({ url: import.meta.env.VITE_NEON_REALTIME_URL });
  const dbClient = new DbClient({ realtime });
  const router = createRouter({ routeTree, context: { dbClient } });
  return routerWithDbClient(router, dbClient);
}
```

Declare `RouterContext` on the root route, which `routerWithDbClient()` requires, and load the session there. A `_authed` layout route redirects signed-out visitors and passes a non-null `user` to its children, as in [Neon Auth with TanStack Start and Router](/docs/tanstack/auth#read-the-session-in-middleware):

```tsx filename="src/routes/__root.tsx"
import { createRootRouteWithContext } from '@tanstack/react-router';

import { getSessionUser } from '../auth.functions';
import type { RouterContext } from '../router';

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => ({ user: await getSessionUser() }),
  headers: () => ({ 'Cache-Control': 'private, no-store', Vary: 'Cookie' }),
});
```

```tsx filename="src/routes/_authed.tsx"
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      // An SSR redirect skips the root route's headers.
      throw redirect({ to: '/sign-in', headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } });
    }
    return { user: context.user };
  },
});
```

Seed the collection in the route loader and query it in the component:

```tsx filename="src/routes/_authed/index.tsx"
import { createFileRoute } from '@tanstack/react-router';
import { useLiveQuery } from '@tanstack/react-db';

import { todosCollection } from '../../todos.collection';
import { loadTodos } from '../../todos.functions';

export const Route = createFileRoute('/_authed/')({
  staleTime: Infinity,
  loader: async ({ context }) => {
    const { rows, query } = await loadTodos({ data: { userId: context.user.id } });
    context.dbClient.collection(todosCollection(context.user.id, query), { initialData: rows });
    return { query };
  },
  component: TodosPage,
});

function TodosPage() {
  const { query } = Route.useLoaderData();
  const { user } = Route.useRouteContext();
  const todos = todosCollection(user.id, query);
  const { data, isReady } = useLiveQuery({
    query: (q) => q.from({ todo: todos }).orderBy(({ todo }) => todo.title),
  });

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

The server renders the seeded rows without subscribing. `routerWithDbClient()` restores them in the browser before hydration, then the collection subscribes with the sealed query and the first live result replaces the seeded rows. Set `Cache-Control: private, no-store` and `Vary: Cookie` on routes that embed rows or sealed queries.

## Common pitfalls

| Pitfall                                                        | Fix                                                                                                |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Sealing a query with a user ID from the request                | Seal with the session user from middleware.                                                        |
| A stale tab writing after another tab signs in as someone else | Pass the page's `userId`, reject a mismatch in `requirePageUser`, and reload on `UNAUTHENTICATED`. |
| A module-global `DbClient` or collection                       | Create the `DbClient` in `getRouter()`, so no collection is shared between users.                  |
| `ORDER BY` in the live query                                   | The collection is keyed and unordered. Sort with `orderBy` in `useLiveQuery()`.                    |
| Result column names that differ from the row keys              | Realtime matches columns to keys by name. Alias them, for example `created_at AS "createdAt"`.     |
| Treating an `awaitTxId()` timeout as a failure                 | The write committed. Show it as saved and let the subscription catch up.                           |

## Source code

The complete app is in [`realtime/with-tanstack`](https://github.com/neondatabase/examples/tree/main/realtime/with-tanstack) in the `neondatabase/examples` repository.

---

## Related docs (TanStack)

- [Neon Auth with TanStack Start and Router](/docs/tanstack/auth)
- [Postgres with Drizzle for TanStack Start](/docs/tanstack/postgres-drizzle)
- [Realtime TanStack example](/docs/realtime/examples/tanstack)
- [Realtime server-side rendering](/docs/realtime/guides/ssr)
- [Realtime TypeScript SDK](/docs/realtime/sdks/typescript)
