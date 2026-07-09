---
title: "Better Drizzle: Type-safe repositories, pagination, nested filters, plugins, and hooks for Drizzle ORM"
subtitle: Add type-safe repositories, pagination, nested relation filters, plugins, and hooks to your Drizzle ORM codebase with better-drizzle.
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-07-09T00:00:00.000Z'
updatedOn: '2026-07-09T18:32:05.503Z'
---

[better-drizzle](https://better-drizzle.com) is a thin wrapper around [Drizzle ORM](https://orm.drizzle.team) that gives every table a consistent, type-safe API without replacing Drizzle itself. If you are already using Drizzle with Neon, better-drizzle removes the repetitive query glue you would otherwise rewrite in every service while staying close to the metal.

better-drizzle is **sponsored by Neon**, and is maintained by [Hiago Almeida](https://github.com/almeidazs)

This guide walks you through setting up better-drizzle with Neon Postgres and shows you how its features (typed delegates, nested relation filters, pagination, plugins, hooks, and transactions) can simplify your data access layer.

## What better-drizzle adds

better-drizzle wraps your existing Drizzle client and generates one delegate per table. You get:

- **Consistent CRUD**. `findMany`, `findFirst`, `findUnique`, `create`, `update`, `delete`, `upsert`, and `upsertMany` on every table
- **Typed relation loading**. `include` and `select` with full type inference from your Drizzle schema
- **Nested relation filters**. `some`, `every`, `none`, and `is` for filtering by related rows
- **Unified pagination**. Offset and cursor pagination returning the same `{ data, pagination }` shape
- **Lifecycle hooks**. Cross-cutting concerns like audit trails, tracing, and metrics without sprinkling them through every call
- **First-class plugins**. Timestamps, soft delete, and custom behavior packaged as reusable plugins
- **Transactions with savepoints**. Nested transactions, rollback, `afterCommit` callbacks, and automatic retries

All of this compiles down to Drizzle queries. You still define your schema in Drizzle, choose your driver, and drop to raw SQL whenever you need to.

## Prerequisites

- A [Neon account](https://console.neon.tech/signup) and a project with a running Postgres database
- [Node.js](https://nodejs.org/) installed on your machine

## Create a new project

```bash
mkdir better-drizzle-demo
cd better-drizzle-demo
npm init -y
```

Install the dependencies depending on your driver of choice. If you are using `node-postgres`, install `pg`. If you are using Neon serverless, install `@neondatabase/serverless` instead.

<CodeTabs labels={["node-postgres", "Neon serverless driver"]}>

```bash
npm install better-drizzle drizzle-orm pg
npm install -D drizzle-kit dotenv @types/pg
```

```bash
npm install better-drizzle drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit dotenv
```

</CodeTabs>

## Configure Drizzle Kit

Drizzle Kit uses a configuration file to manage schema and migrations. Create a `drizzle.config.ts` file in your project root:

```typescript filename="drizzle.config.ts"
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Define your schema and relations

better-drizzle reads your Drizzle schema (including relations) to generate each table's typed API. The relations you define are what power `include`, `select`, and nested relation filters.

Here is a small `users → posts` schema using `drizzle-orm/pg-core`:

```typescript filename="src/schema.ts"
import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  active: boolean('active').notNull().default(true),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id),
  title: text('title').notNull(),
  published: boolean('published').notNull().default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));

export const schema = {
  users,
  usersRelations,
  posts,
  postsRelations,
};
```

## Create the Better client

Create a normal Drizzle client first, then wrap it once with `better()`:

<CodeTabs labels={["node-postgres", "Neon serverless driver"]}>

```typescript filename="src/db.ts"
import { better } from 'better-drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema } from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

export const client = better(db, { schema });
```

```typescript filename="src/db.ts"
import { better } from 'better-drizzle';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { schema } from './schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export const client = better(db, { schema });
```

</CodeTabs>

<Admonition type="note" title="Any driver works">
better-drizzle detects the dialect from your Drizzle instance. The same `client` API works whether you use `neon-http`, `neon-serverless`, `node-postgres`, or `postgres-js`. See the [Neon Drizzle guide](/docs/guides/drizzle) for setup details for each driver.
</Admonition>

## Seed the database

Before running queries, seed the `users` and `posts` tables with sample data. Create a seed script at `src/seed.ts`:

```typescript filename="src/seed.ts"
import { client } from './db';

async function seed() {
  await client.users.upsertMany({
    data: [
      { email: 'alice@example.com', name: 'Alice', active: true },
      { email: 'bob@example.com', name: 'Bob', active: false },
      { email: 'charlie@example.com', name: 'Charlie', active: true },
    ],
    target: ['email'],
    update: ['name'],
  });

  const alice = await client.users.findUnique({
    where: { email: 'alice@example.com' },
  });

  const bob = await client.users.findUnique({
    where: { email: 'bob@example.com' },
  });

  await client.posts.createMany({
    data: [
      { authorId: alice!.id, title: 'Hello World', published: true },
      { authorId: alice!.id, title: 'better-drizzle is great', published: true },
      { authorId: alice!.id, title: 'Neon Postgres rocks', published: true },
      { authorId: bob!.id, title: 'Secret draft', published: false },
    ],
  });

  console.log('Seeded 3 users and 4 posts.');
}

seed();
```

Run the seed script:

```bash
npx tsx src/seed.ts
```

```json title="Output"
Seeded 3 users and 4 posts.
```

Now your database has three users (Alice, Bob, Charlie) and four posts (three by Alice, one draft by Bob).

## Query with better-drizzle

### Reads with typed relations

Each table gets a delegate (`client.users`, `client.posts`) with methods that are fully typed against your schema.

List active users with their three most recent published posts:

```typescript
const users = await client.users.findMany({
  where: { active: true },
  include: {
    posts: {
      where: { published: true },
      select: { id: true, title: true },
      orderBy: [{ id: 'desc' }],
      take: 3,
    },
  },
  orderBy: [{ id: 'desc' }],
  take: 20,
});
```

The query returns active users with their published posts nested under each user:

```json title="Output"
[
  {
    "id": 3,
    "email": "charlie@example.com",
    "name": "Charlie",
    "active": true,
    "posts": []
  },
  {
    "id": 1,
    "email": "alice@example.com",
    "name": "Alice",
    "active": true,
    "posts": [
      { "id": 3, "title": "Neon Postgres rocks" },
      { "id": 2, "title": "better-drizzle is great" },
      { "id": 1, "title": "Hello World" }
    ]
  }
]
```

Find a single user by a unique field:

```typescript
const alice = await client.users.findUnique({
  where: { email: 'alice@example.com' },
});
```

```json title="Output"
{
  "id": 1,
  "email": "alice@example.com",
  "name": "Alice",
  "active": true
}
```

Filter posts by conditions on their related author with nested relation filters:

```typescript
const posts = await client.posts.findMany({
  where: {
    published: true,
    author: { is: { active: true } },
  },
  select: {
    id: true,
    title: true,
    author: { select: { id: true, name: true } },
  },
  orderBy: [{ id: 'desc' }],
  take: 20,
});
```

The `author: { is: { active: true } }` filter keeps only posts where the author is active, excluding Bob's posts since he is inactive:

```json title="Output"
[
  {
    "id": 3,
    "title": "Neon Postgres rocks",
    "author": { "id": 1, "name": "Alice" }
  },
  {
    "id": 2,
    "title": "better-drizzle is great",
    "author": { "id": 1, "name": "Alice" }
  },
  {
    "id": 1,
    "title": "Hello World",
    "author": { "id": 1, "name": "Alice" }
  }
]
```

### Writes with skipDuplicates and upsertMany

```typescript
// Create a new user, skipping if the email already exists
const maybeCreated = await client.users.create({
  data: {
    email: 'better@example.com',
    name: 'better',
    active: true,
  },
  skipDuplicates: ['email'],
});

if (!maybeCreated) {
  console.log('User already existed');
}
```

The first run creates the user. A second run with the same email returns `null` and logs "User already existed".

Bulk upsert multiple users in a single batch operation:

```typescript
await client.users.upsertMany({
  data: [
    { email: 'alice@example.com', name: 'Alice Updated', active: true },
    { email: 'bob@example.com', name: 'Bob Updated', active: true },
  ],
  target: ['email'],
  update: ['name', 'active'],
  select: { id: true, name: true },
});
```

The query matches Alice and Bob by email, updates their `name` and `active` columns, and returns the updated rows:

```json title="Output"
{
  "count": 2,
  "data": [
    { "id": 1, "name": "Alice Updated" },
    { "id": 2, "name": "Bob Updated" }
  ]
}
```

### Pagination: one shape for offset and cursor

```typescript
import { PaginationType } from 'better-drizzle';

// Offset pagination
const page1 = await client.users.paginate({
  type: PaginationType.Offset,
  where: { active: true },
  select: { id: true, name: true },
  orderBy: [{ id: 'desc' }],
  skip: 0,
  limit: 10,
});
```

Both offset and cursor pagination return the same `{ data, pagination }` shape:

```json title="Output"
{
  "data": [
    { "id": 3, "name": "Charlie" },
    { "id": 1, "name": "Alice" }
  ],
  "pagination": { "count": 2, "hasNext": false, "hasPrevious": false }
}
```

Cursor pagination uses the last item's cursor to fetch the next page:

```typescript
const page2 = await client.users.paginate({
  type: PaginationType.Cursor,
  where: { active: true },
  select: { id: true, name: true },
  after: { id: page1.data[page1.data.length - 1]?.id },
  limit: 10,
  orderBy: [{ id: 'desc' }],
});
```

```json title="Output"
{
  "data": [
    { "id": 1, "name": "Alice" }
  ],
  "pagination": { "count": 1, "hasNext": false, "hasPrevious": false }
}
```

### Count and exists

```typescript
const activeCount = await client.users.count({
  where: { active: true },
});
```

```json title="Output"
2
```

```typescript
const exists = await client.users.exists({
  where: { id: 1 },
});
```

```json title="Output"
true
```

## Use plugins for cross-cutting behavior

better-drizzle ships with official plugins for common patterns. Plugins can inject fields, rewrite queries, add typed operation arguments, and extend delegates without wrapping `better()` yourself.

### Timestamps

Auto-manage `createdAt` and `updatedAt` columns on every write:

```bash
npm install @better-drizzle/timestamps
```

```typescript filename="db.ts"
import { timestamps } from '@better-drizzle/timestamps';

const client = better(db, {
  schema,
  plugins: [
    timestamps({
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }),
  ],
});
```

Now every `create`, `update`, and `upsert` automatically fills timestamp columns.

### Soft delete

Turn `delete()` into a recoverable state change. Rows are hidden by default and restorable:

```bash
npm install @better-drizzle/soft-delete
```

```typescript filename="db.ts"
import { softDelete } from '@better-drizzle/soft-delete';

const client = better(db, {
  schema,
  plugins: [
    softDelete({
      column: 'deleted_at',
      defaults: { mode: 'soft', visibility: 'without' },
    }),
  ],
});

// Soft-deletes the row (sets deleted_at) instead of removing it
await client.users.delete({ where: { id: 1 } });

// Query with plugin-added typed args
await client.users.findMany({ deleted: 'only' });

// Restore a soft-deleted row
await client.users.restore({ where: { id: 1 } });
```

<Admonition type="note">
Plugins run in array order. If two plugins transform the same operation, the earlier one runs first. See the [plugins docs](https://better-drizzle.com/docs/plugins/overview) for composing and writing your own plugins.
</Admonition>

## Add lifecycle hooks

Hooks let you observe operations for auditing, tracing, metrics, and authorization without duplicating logic in every service:

```typescript filename="db.ts"
const client = better(db, {
  schema,
  hooks: {
    beforeCreate(ctx) {
      console.log(`Creating ${ctx.table}`, ctx.args.data);
    },
    afterCreate(ctx) {
      console.log(`Created ${ctx.table}`, ctx.row);
    },
    beforeQuery(ctx) {
      console.log(`Querying ${ctx.table}`, ctx.action, ctx.args.where);
    },
    afterQuery(ctx) {
      console.log(`Query result`, ctx.result);
    },
  },
});
```

With these hooks in place, each operation logs before and after it runs:

```json title="Output (example)"
Querying users findMany { active: true }
Query result [
  { id: 3, name: 'Charlie', active: true },
  { id: 1, name: 'Alice', active: true }
]
Creating users { email: 'new@example.com', name: 'New User', active: true }
Created users { id: 4, email: 'new@example.com', name: 'New User', active: true }
```

Thread request-scoped metadata through every call:

```typescript
await client.users.findMany({
  where: { active: true },
  meta: { requestId: 'req_123', userId: 'admin_7' },
});
```

Hook callbacks receive `ctx.meta`, ideal for logging request IDs, tenant IDs, or user context in a server environment.

<Admonition type="tip" title="Hooks vs plugins">
Use **hooks** to observe and coordinate (logging, tracing, metrics). Use **plugins** to change behavior (rewrite `where`, inject fields, add delegate methods). Keep hooks narrow; plugins do the heavy lifting for behavior changes.
</Admonition>

## Transactions with savepoints

Transactions live on the client. The callback receives a full Better client bound to the transaction, so delegates, plugins, hooks, and raw SQL all work inside it:

```typescript
const user = await client.transaction(async (tx) => {
  const created = await tx.users.create({
    data: { email: 'new@example.com', name: 'New User', active: true },
  });

  await tx.posts.create({
    data: { authorId: created.id, title: 'Hello World', published: true },
  });

  tx.afterCommit(() => {
    console.log('Committed user', created.email);
  });

  return created;
});
```

Nested transactions use **savepoints** that can roll back independently of the outer transaction:

```typescript
await client.transaction(async (tx) => {
  await tx.users.create({
    data: { id: 1, email: 'a@test.com', name: 'Alice', active: true },
  });

  try {
    await tx.transaction(async (nested) => {
      await nested.users.create({
        data: { id: 2, email: 'b@test.com', name: 'Bob', active: true },
      });
      nested.rollback('duplicate email, rolling back nested savepoint');
    });
  } catch {
    // Only the nested savepoint was rolled back
  }

  // Outer transaction continues
  await tx.users.create({
    data: { id: 3, email: 'c@test.com', name: 'Charlie', active: true },
  });
});
```

### Automatic retries

Opt into retries for transient failures like deadlocks:

```typescript
await client.transaction(
  async (tx) => {
    await tx.users.create({
      data: { email: 'retry@example.com', name: 'Retry', active: true },
    });
  },
  {
    retries: {
      attempts: 3,
      on: ['deadlock', 'serializationFailure'],
      delayMs: (attempt) => attempt * 25,
    },
  },
);
```

## Integrate with Next.js app router

Import the Better client from a shared server module and use it in route handlers, server actions, and React Server Components:

<CodeTabs labels={["node-postgres", "Neon serverless driver"]}>

```typescript filename="lib/db.ts"
import { better } from 'better-drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema } from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

export const client = better(db, { schema });
```

```typescript filename="lib/db.ts"
import { better } from 'better-drizzle';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { schema } from './schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export const client = better(db, { schema });
```

</CodeTabs>

```typescript filename="app/api/posts/route.ts"
import { client } from '@/lib/db';

export async function GET() {
  const posts = await client.posts.findMany({
    include: { author: true },
    orderBy: [{ id: 'desc' }],
    take: 10,
  });
  return Response.json(posts);
}
```

```typescript filename="app/actions.ts"
'use server';

import { client } from '@/lib/db';

export async function createUserAndPost(input: {
  email: string;
  name: string;
  title: string;
}) {
  return client.transaction(async (tx) => {
    const user = await tx.users.create({
      data: { email: input.email, name: input.name, active: true },
    });
    return tx.posts.create({
      data: { authorId: user.id, title: input.title, published: false },
    });
  });
}
```

<Admonition type="note">
Instantiate the Better client once in a shared module and import it everywhere. This keeps connection pooling sane and gives you one place to add hooks and plugins. The pattern works identically for Bun, Express, Fastify, and other frameworks. See the [framework integration guide](https://better-drizzle.com/docs/guides/frameworks).
</Admonition>

## Performance

better-drizzle is measured against raw Drizzle at the API-parity level, same work and same return shape. Reads land within 0–18% of raw Drizzle, with fast paths making point lookups and offset pagination faster. Writes are within ~4%. The wrapper uses materially less heap for reads and writes.

| Operation                 | better-drizzle vs raw Drizzle |
| ------------------------- | ----------------------------- |
| Point lookup              | −5.6% (faster)                |
| Offset pagination         | −11.2% (faster)               |
| Active count              | −17.9% (faster)               |
| Complex relation filter   | +9.4%                         |
| Create + delete roundtrip | −3.6% (faster)                |
| Multi-op transaction      | −0.3%                         |

See the full [benchmarks](https://better-drizzle.com/docs/performance/benchmarks) for details on latency, memory, and how the comparisons are structured.

## When to reach for raw Drizzle

better-drizzle is additive, not all-or-nothing. Reach for raw Drizzle (directly or via `client.$raw`) when:

- You need database-specific SQL functions or window functions
- A reporting query reads better as SQL than as a builder
- You are in a measured hot path and want to hand-tune the exact query

The Better client and your raw Drizzle `db` share the same connection and the same transaction. Use the repository API for routine CRUD and drop to raw SQL where it earns its place, even inside the same transaction:

```typescript
await client.transaction(async (tx) => {
  await tx.users.create({
    data: { email: 'report@example.com', name: 'Report', active: true },
  });

  // Drop to raw SQL for a reporting query
  const stats = await tx.$raw<{ month: string; count: number }>`
    SELECT to_char(created_at, 'YYYY-MM') as month, count(*) as count
    FROM users
    GROUP BY month
    ORDER BY month
  `;
});
```

## Conclusion

better-drizzle removes the repetitive query patterns that accumulate across a Drizzle codebase without abstracting away the SQL-level control you chose Drizzle for. With Neon Postgres as the backing database, you get type-safe repositories, built-in pagination, nested relation filters, plugins for timestamps and soft deletes, lifecycle hooks, and full transaction support, all on top of your existing Drizzle schema.

## Resources

- [better-drizzle documentation](https://better-drizzle.com/docs)
- [better-drizzle GitHub](https://github.com/almeidazs/better-drizzle)
- [better-drizzle vs raw Drizzle](https://better-drizzle.com/docs/comparison)
- [Neon Drizzle setup guide](/docs/guides/drizzle)
- [Schema migration with Neon and Drizzle](/docs/guides/drizzle-migrations)

<NeedHelp />
