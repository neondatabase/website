---
title: Postgres with Drizzle for TanStack Start
subtitle: Query Lakebase Postgres on Neon from TanStack Start server functions with Drizzle
summary: >-
  Connect a TanStack Start app to Lakebase Postgres on Neon with Drizzle ORM. Covers
  getting a connection string (including Claimable Neon without an account), the
  pooled and direct connection strings, the Drizzle schema and migrations, querying
  from createServerFn, and testing migrations and previews on database branches.
enableTableOfContents: true
noindex: true
updatedOn: '2026-11-13T07:00:38.286Z'
---

This page connects a [TanStack Start](https://tanstack.com/start) app to Lakebase Postgres on Neon with [Drizzle ORM](https://orm.drizzle.team). All database access stays in [server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions), because TanStack Start route loaders also run in the browser.

A TanStack Router single-page app has no server to hold a database connection. For browser-side reads and writes, use the [Data API](/docs/tanstack/data-api) instead.

## Get a connection string

- **Existing Neon project:** click **Connect** in the Neon Console and copy the pooled and direct connection strings.
- **No account yet:** run `npx neon@latest claim create --file .env.local`. It provisions a [Claimable Neon](/docs/reference/claimable-neon) project and writes `DATABASE_URL` and `DATABASE_URL_UNPOOLED` to `.env.local`. Claim the project into a Neon account before it expires.

```bash filename=".env.local"
# Pooled connection for the app
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
# Direct connection for Drizzle Kit
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=require&channel_binding=require"
```

Use the pooled connection string (the hostname includes `-pooler`) for application traffic, and the direct one for migrations and session-level features such as `LISTEN` or advisory locks. See [Connection pooling](/docs/connect/connection-pooling).

## Install

```bash filename="Terminal"
npm install drizzle-orm pg
npm install -D drizzle-kit dotenv @types/pg
```

`pg` (node-postgres) suits a long-running Node server. For serverless and edge deploy targets, see [Serverless driver vs node-postgres for TanStack Start](/docs/tanstack/drivers).

## Define the schema

```ts filename="src/db/schema.ts"
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

```ts filename="drizzle.config.ts"
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

if (!process.env.DATABASE_URL_UNPOOLED) {
  throw new Error('DATABASE_URL_UNPOOLED is not set in .env.local');
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED },
});
```

```bash filename="Terminal"
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Create the Drizzle client

Keep the client in a `.server.ts` file so it never reaches the browser bundle:

```ts filename="src/db/index.server.ts"
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema });
```

## Query from server functions

```ts filename="src/todos.functions.ts"
import { createServerFn } from '@tanstack/react-start';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { requireUser } from './auth.functions';
import { db } from './db/index.server';
import { todos } from './db/schema';

export const listTodos = createServerFn({ method: 'GET' })
  .middleware([requireUser])
  .handler(({ context }) => db.select().from(todos).where(eq(todos.userId, context.user.id)));

export const toggleTodo = createServerFn({ method: 'POST' })
  .middleware([requireUser])
  .validator(z.object({ id: z.string().uuid(), completed: z.boolean() }))
  .handler(async ({ data, context }) => {
    await db
      .update(todos)
      .set({ completed: data.completed })
      .where(and(eq(todos.id, data.id), eq(todos.userId, context.user.id)));
  });
```

Call the server function from the route loader:

```tsx filename="src/routes/_authed/todos.tsx"
import { createFileRoute } from '@tanstack/react-router';

import { listTodos } from '../../todos.functions';

export const Route = createFileRoute('/_authed/todos')({
  loader: () => listTodos(),
  component: TodosPage,
});

function TodosPage() {
  const todos = Route.useLoaderData();
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

- Scope every query by the session user, including the `WHERE` clause of updates and deletes. See [Neon Auth with TanStack Start and Router](/docs/tanstack/auth) for `requireUser`.
- After a mutation, call `router.invalidate()` so loaders refetch.
- For rows that should update live across clients, see [Neon Realtime with TanStack DB](/docs/tanstack/realtime-db).

## Test migrations and previews on branches

A Neon [branch](/docs/introduction/branching) is a copy-on-write copy of the database, so creating one doesn't copy data and takes the same time for any database size.

```bash filename="Terminal"
neon branches create --name preview/pr-123
neon connection-string preview/pr-123 --pooled
```

- Run new migrations against a branch with production data before applying them to the production branch.
- Give each preview deployment its own branch. The [Neon Vercel integration](/docs/guides/vercel-overview) creates one per preview deployment.

---

## Related docs (TanStack)

- [Serverless driver vs node-postgres for TanStack Start](/docs/tanstack/drivers)
- [Neon Auth with TanStack Start and Router](/docs/tanstack/auth)
- [Neon Realtime with TanStack DB](/docs/tanstack/realtime-db)
- [Drizzle with Neon](/docs/guides/drizzle)
- [Schema migration with Drizzle ORM](/docs/guides/drizzle-migrations)
- [Choosing your connection method](/docs/connect/choose-connection)
