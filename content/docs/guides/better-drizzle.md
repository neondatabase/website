---
title: Connect from Better Drizzle to Neon
subtitle: Learn how to connect to Neon from Better Drizzle
summary: >-
  Better Drizzle connection guide for Lakebase Postgres walks through setting up
  better-drizzle 0.3 with Drizzle ORM 1.0 and the node-postgres driver. Learn
  how to configure a Better Drizzle client, define relations with
  defineRelations, seed data, run CRUD queries, use plugins, and manage
  transactions with savepoints.
enableTableOfContents: true
updatedOn: '2026-10-08T19:32:04.700Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to set up better-drizzle with Lakebase Postgres</p>
<p>How to define schemas, seed, and query your database</p>
<p>How to use plugins, hooks, and transactions in better-drizzle</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="https://better-drizzle.com/docs">better-drizzle documentation</a>
  <a href="https://github.com/almeidazs/better-drizzle">better-drizzle GitHub</a>
  <a href="/docs/guides/drizzle">Neon Drizzle setup guide</a>
</DocsList>

</InfoBlock>

[better-drizzle](https://better-drizzle.com) is a thin wrapper around [Drizzle ORM](https://orm.drizzle.team) that gives every table a consistent, type-safe API without replacing Drizzle itself. If you are already using Drizzle with Lakebase Postgres, better-drizzle removes the repetitive query glue you would otherwise rewrite in every service while staying close to the metal.

better-drizzle is **sponsored by Neon**, and is maintained by [Hiago Almeida](https://github.com/almeidazs).

## What better-drizzle adds

better-drizzle wraps your existing Drizzle client and generates one delegate per table. You get:

- **Consistent CRUD**: `findMany`, `findFirst`, `findUnique`, `create`, `update`, `delete`, `upsert`, and `upsertMany` on every table
- **Typed relation loading**: `include` and `select` with full type inference from your Drizzle schema
- **Nested relation filters**: `some`, `every`, `none`, and `is` for filtering by related rows
- **Pagination with metadata**: Offset (`paginate`) and cursor (`cursor`) pagination, both returning `{ data, pagination }`
- **Lifecycle hooks**: Cross-cutting concerns like audit trails, tracing, and metrics without sprinkling them through every call
- **First-class plugins**: Timestamps, soft delete, and custom behavior packaged as reusable plugins
- **Transactions with savepoints**: Nested transactions, rollback, `afterCommit` callbacks, and automatic retries

All of this compiles down to Drizzle queries. You still define your schema in Drizzle, choose your driver, and drop to raw SQL whenever you need to.

To connect a TypeScript/Node.js project to Lakebase Postgres using better-drizzle, follow these steps:

<Steps>

## Create a TypeScript/Node.js project

Create a new directory for your project and navigate into it:

```bash
mkdir better-drizzle-demo
cd better-drizzle-demo
```

Initialize a new Node.js project with a `package.json` file:

```bash
npm init -y
```

## Create a project on Neon

If you do not have one already, create a project.

1.  Navigate to the [Projects](https://console.neon.tech/app/projects) page in the console.
2.  Click **New Project**.
3.  Specify your project settings and click **Create Project**.

## Get your connection string

Find your database connection string by clicking the **Connect** button in the Console nav to open the **Connect to your branch** modal. Select a branch, a user, and the database you want to connect to. A connection string is constructed for you.
![Connection details modal](/docs/connect/connect_to_branch_modal.png)
The connection string includes the user name, password, hostname, and database name.

Create a `.env` file in your project's root directory. Add the pooled connection string (the hostname includes `-pooler`) as `DATABASE_URL` for your application, and the direct connection string (without `-pooler`) as `DATABASE_URL_UNPOOLED` for Drizzle Kit migrations. To get the direct string, turn off **Connection pooling** in the **Connect to your branch** modal, or remove `-pooler` from the hostname. Your `.env` file should look like this:

```text shouldWrap
DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=verify-full&channel_binding=require"
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/[dbname]?sslmode=verify-full&channel_binding=require"
```

The Console's connection string uses `sslmode=require`. `pg` 8.23 and later print a `SECURITY WARNING` for `sslmode=require`, so change it to `sslmode=verify-full`, which keeps the same behavior without the warning.

<Admonition type="note">
A pooled connection string routes through a PgBouncer connection pool, which suits your application at runtime. Running migrations through the pooler can lead to errors, so Drizzle Kit uses the direct connection. For more information, see [Connection pooling](/docs/connect/connection-pooling) and [Schema migration with Drizzle ORM](/docs/guides/drizzle-migrations).
</Admonition>

## Install dependencies

Install the dependencies:

```bash
npm install better-drizzle drizzle-orm@1.0.0-rc.4 pg dotenv
npm install -D drizzle-kit@1.0.0-rc.4 tsx @types/pg @types/node
```

<Admonition type="note" title="Drizzle ORM version">
better-drizzle 0.3 supports only Drizzle ORM `1.0.0-rc.4` and its `defineRelations` API. Install `drizzle-orm` and `drizzle-kit` with that exact version: a plain `npm install drizzle-orm` resolves to 0.x, and later release candidates aren't supported yet. Projects on Drizzle ORM 0.x need better-drizzle 0.2.x. See [Upgrading](https://better-drizzle.com/docs/guides/upgrading) in the better-drizzle docs.
</Admonition>

## Configure Drizzle Kit

Drizzle Kit uses a configuration file to manage schema and migrations. Create a `drizzle.config.ts` file in your project root. It uses the direct connection string, since migrations shouldn't run through the connection pooler:

```typescript filename="drizzle.config.ts"
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL_UNPOOLED) {
  throw new Error('DATABASE_URL_UNPOOLED is not set in the .env file');
}

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED,
  },
});
```

## Define your schema and relations

better-drizzle reads your Drizzle tables and relations to generate each table's typed API. The relations you define power `include`, `select`, and nested relation filters.

Create a `src/schema.ts` file with two tables: `users` and `posts`.

```typescript filename="src/schema.ts"
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
```

Declare the relations with Drizzle's `defineRelations` in a `src/relations.ts` file. Each user can have many posts, and each post belongs to one user.

```typescript filename="src/relations.ts"
import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
  users: {
    posts: r.many.posts(),
  },
  posts: {
    author: r.one.users({
      from: r.posts.authorId,
      to: r.users.id,
    }),
  },
}));
```

## Initialize the Better Drizzle client

Create a Drizzle client with your relations and wrap it with `better()` to get the Better client. `better()` reads the tables and relations from the Drizzle instance. Create a `src/db.ts` file:

```typescript filename="src/db.ts"
import 'dotenv/config';
import { better } from 'better-drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { relations } from './relations';

export const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle({ client: pool, relations });

export const client = better(db);
```

## Generate migrations

Generate your migration files using Drizzle Kit:

```bash
npx drizzle-kit generate
```

## Apply migrations

Apply the generated SQL migrations to your Neon database:

```bash
npx drizzle-kit migrate
```

## Seed the database

Create a `src/seed.ts` file to populate the database with some users and posts:

```typescript filename="src/seed.ts"
import { client, pool } from './db';

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
      { authorId: alice!.id, title: 'Branching with Neon', published: true },
      { authorId: bob!.id, title: 'Secret draft', published: false },
    ],
  });

  console.log('Seeded 3 users and 4 posts.');
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
```

Run the seed script once:

```bash
npx tsx src/seed.ts
```

The script upserts users but inserts posts with `createMany`, so running it again adds duplicate posts and changes the query output shown below.

</Steps>

## Query with better-drizzle

### Reads with typed relations

Each table gets a delegate (`client.users`, `client.posts`) with methods that are fully typed against your schema. To try the examples in this section, put them in an `async` function in a file such as `src/queries.ts` that imports `client` and `pool` from `./db`, call `pool.end()` when you're done, and run it with `npx tsx src/queries.ts`.

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
      { "id": 3, "title": "Branching with Neon" },
      { "id": 2, "title": "better-drizzle is great" },
      { "id": 1, "title": "Hello World" }
    ]
  }
]
```

<Admonition type="note" title="select vs include">
By default, queries return all table columns.
- Use **`include`** to return all columns *plus* nested relations (e.g., `include: { posts: true }`).
- Use **`select`** to return *only* the specified columns and drop everything else (e.g., `select: { id: true, title: true }`).

`select` and `include` are mutually exclusive at the same query level, but you can nest a `select` inside an `include` to narrow the fields of a related table (as shown in the active users query above).
</Admonition>

Find a single user by a unique field:

```typescript
const alice = await client.users.findUnique({
  where: { email: 'alice@example.com' },
});
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

The `author: { is: { active: true } }` filter keeps only posts where the author is active, so Bob's draft is excluded.

### Writes with skipDuplicates and upsertMany

Create a new user, or skip the insert if the email already exists. `create` returns `null` when it skips:

```typescript
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

### Pagination

Use `paginate` for offset pagination:

```typescript
const page = await client.users.paginate({
  where: { active: true },
  select: { id: true, name: true },
  orderBy: [{ id: 'desc' }],
  skip: 0,
  limit: 10,
});
```

The result includes the rows and the page metadata. With only the seed data loaded (before the write examples above), it looks like this:

```json filename="Output"
{
  "data": [
    { "id": 3, "name": "Charlie" },
    { "id": 1, "name": "Alice" }
  ],
  "pagination": {
    "type": "offset",
    "page": 1,
    "perPage": 10,
    "total": 2,
    "pageCount": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

Use `cursor` for feed-style pagination. Pass the previous page's `nextCursor` as `after` to fetch the next page:

```typescript
const first = await client.users.cursor({
  where: { active: true },
  select: { id: true, name: true },
  orderBy: [{ id: 'desc' }],
  limit: 1,
});

const second = await client.users.cursor({
  where: { active: true },
  select: { id: true, name: true },
  orderBy: [{ id: 'desc' }],
  limit: 1,
  after: first.pagination.nextCursor ?? undefined,
});
```

Cursor results return `hasNext`, `hasPrevious`, `nextCursor`, and `previousCursor` in `pagination`. With only the seed data loaded, `first.pagination` is `{ "type": "cursor", "hasNext": true, "hasPrevious": false, "nextCursor": { "id": 3 }, "previousCursor": null }`.

### Count and exists

```typescript
const activeCount = await client.users.count({
  where: { active: true },
});

const exists = await client.users.exists({
  where: { id: 1 },
});
```

## Use plugins for cross-cutting behavior

Plugins can manage timestamps, soft deletes, and custom behavior. The timestamps and soft delete plugins ship with `better-drizzle`, so there's nothing extra to install.

### Timestamps

Auto-manage `createdAt` and `updatedAt` columns on every write. In `src/db.ts`, import the plugin and pass it to `better()`:

```typescript filename="src/db.ts"
import { timestamps } from 'better-drizzle/timestamps';

export const client = better(db, {
  plugins: [
    timestamps({
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }),
  ],
});
```

<Admonition type="important" title="Timestamps plugin">
Use the property names defined in your Drizzle schema, not the Postgres column names. For example, if your schema defines `createdAt: timestamp('created_at')`, reference `createdAt` in the plugin configuration, not `created_at`.
</Admonition>

The plugin sets `createdAt` and `updatedAt` when a row is created and updates `updatedAt` on every update. Add `createdAt` and `updatedAt` timestamp columns to your schema, then run `npx drizzle-kit generate` and `npx drizzle-kit migrate` again:

```typescript filename="src/schema.ts"
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at'), // [!code ++]
  updatedAt: timestamp('updated_at'), // [!code ++]
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id),
  title: text('title').notNull(),
  published: boolean('published').notNull().default(false),
  createdAt: timestamp('created_at'), // [!code ++]
  updatedAt: timestamp('updated_at'), // [!code ++]
});
```

### Soft delete

To use soft deletes, add a `deletedAt` column to your schema, then generate and apply a migration:

```typescript filename="src/schema.ts"
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id),
  title: text('title').notNull(),
  published: boolean('published').notNull().default(false),
  deletedAt: timestamp('deleted_at'), // [!code ++]
});
```

In `src/db.ts`, import the soft delete plugin and pass it to `better()`:

```typescript filename="src/db.ts"
import { softDelete } from 'better-drizzle/soft-delete';

export const client = better(db, {
  plugins: [
    softDelete({
      column: 'deletedAt',
      defaults: { mode: 'soft', visibility: 'without' },
    }),
  ],
});

// Soft-deletes the row instead of removing it
await client.posts.delete({ where: { id: 1 } });

// Get only deleted posts
await client.posts.findMany({ deleted: 'only' });

// Restore a soft-deleted row
await client.posts.restore({ where: { id: 1 } });
```

## Add lifecycle hooks

Observe operations for auditing, metrics, or custom metadata. Pass `hooks` to `better()` in `src/db.ts`:

```typescript filename="src/db.ts"
export const client = better(db, {
  hooks: {
    beforeCreate(ctx) {
      console.log('beforeCreate', ctx.action, ctx.table);
    },
    afterCreate(ctx) {
      console.log('afterCreate', ctx.row);
    },
    beforeQuery(ctx) {
      console.log('beforeQuery', ctx.action, ctx.args.where);
    },
    afterQuery(ctx) {
      console.log('afterQuery', ctx.action, ctx.result);
    },
  },
});
```

The example above shows create and query hooks, but Better Drizzle also supports `beforeUpdate` / `afterUpdate`, `beforeDelete` / `afterDelete`, transaction hooks (`beforeTransaction`, `afterTransactionCommit`, `afterTransactionRollback`, `onTransactionError`), raw SQL hooks (`beforeRaw`, `afterRaw`, `onRawError`), and a catch-all `onError`. See the [hooks docs](https://better-drizzle.com/docs/advanced/hooks) for details.

Hook callbacks receive `ctx.meta`, ideal for logging request IDs, tenant IDs, or user context in a server environment.

## Transactions with savepoints

Transactions run on the client, with the callback receiving a Better client bound to the transaction context:

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

Nested transactions use **savepoints** that roll back independently of the outer transaction:

```typescript
await client.transaction(async (tx) => {
  await tx.users.create({
    data: { email: 'a@test.com', name: 'Alice', active: true },
  });

  try {
    await tx.transaction(async (nested) => {
      await nested.users.create({
        data: { email: 'b@test.com', name: 'Bob', active: true },
      });
      nested.rollback('duplicate email, rolling back nested savepoint');
    });
  } catch {
    // Only the nested savepoint was rolled back
  }

  await tx.users.create({
    data: { email: 'c@test.com', name: 'Charlie', active: true },
  });
});
```

### Automatic retries

Opt into transaction retries for transient failures like deadlocks:

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

## Other features

To explore more advanced capabilities of better-drizzle, refer to the following topics in the official documentation:

- **Querying & Reads**: [Reads & Filters](https://better-drizzle.com/docs/querying/filters), [Selecting fields](https://better-drizzle.com/docs/querying/selecting-fields), [Relations](https://better-drizzle.com/docs/querying/relations), and [Pagination](https://better-drizzle.com/docs/querying/pagination)
- **Writing & CRUD**: [CRUD Operations](https://better-drizzle.com/docs/writing/crud) and [Throwing Results](https://better-drizzle.com/docs/writing/throwing-results)
- **Core Concepts**: [Transactions](https://better-drizzle.com/docs/advanced/transactions), [Hooks](https://better-drizzle.com/docs/advanced/hooks), and [Error Handling](https://better-drizzle.com/docs/advanced/error-handling)
- **Plugins**: [Plugins Overview](https://better-drizzle.com/docs/plugins/overview) and [Writing Custom Plugins](https://better-drizzle.com/docs/plugins/writing-plugins)
- **Advanced Patterns**: [Service-layer Patterns](https://better-drizzle.com/docs/guides/service-patterns) and [Dynamic Repositories](https://better-drizzle.com/docs/guides/dynamic-repositories)

## Resources

- [better-drizzle documentation](https://better-drizzle.com/docs)
- [better-drizzle GitHub repository](https://github.com/almeidazs/better-drizzle)
- [Neon Drizzle setup guide](/docs/guides/drizzle)
- [Schema migration with Neon and Drizzle](/docs/guides/drizzle-migrations)
- [Realtime live SQL queries with Drizzle](/docs/realtime/examples/drizzle)

<NeedHelp />
