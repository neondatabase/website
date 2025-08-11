---
title: Simplify RLS with Drizzle
subtitle: Use Drizzle crudPolicy to manage Row-Level Security policies
enableTableOfContents: true
updatedOn: '2025-08-11T00:30:08.267Z'
redirectFrom:
  - /docs/guides/neon-rls-authorize-drizzle
  - /docs/guides/neon-authorize-drizzle
  - /docs/guides/neon-rls-drizzle
---

<InfoBlock>
<DocsList title="What you'll learn">
<p>How to simplify Row-Level Security using `crudPolicy`</p>
<p>Common RLS patterns with Drizzle</p>
<p>Using RLS with Data API and Neon RLS</p>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/guides/row-level-security">Row-Level Security with Neon</a>
  <a href="/docs/guides/neon-rls">Neon RLS (JWT/JWKS Integration)</a>
  <a href="/docs/data-api/get-started">Data API</a>
  <a href="https://orm.drizzle.team/docs/rls">RLS in Drizzle</a>
</DocsList>

</InfoBlock>

## Why simplify RLS policies?

Row-Level Security (RLS) is an important last line of defense for protecting your data at the database level. However, implementing RLS requires writing and maintaining separate SQL policies for each CRUD operation (Create, Read, Update, Delete), which can be both tedious and error-prone.

### For example

To illustrate, let's consider a simple **Todo** list app with RLS policies applied to a `todos` table. Postgres RLS policies use two types of conditions:

- `USING` clause — controls which existing rows can be accessed
- `WITH CHECK` clause — controls what new or modified data can be written

<Admonition type="note" title="A note on auth.user_id()">
You can use the same Drizzle policies with both the Data API and Neon RLS because they both provide an `auth.user_id()` function to identify the current user.

It's important to know that while the function is the same, the underlying features work differently and **are not compatible**. In general, we recommend the Data API: make sure Neon RLS is disabled for your project if you want to use Data API on a given branch.
</Admonition>

Here's how these clauses apply to each operation:

| Operation | USING clause               | WITH CHECK clause          |
| --------- | -------------------------- | -------------------------- |
| Select    | `auth.user_id() = user_id` |                            |
| Insert    |                            | `auth.user_id() = user_id` |
| Update    | `auth.user_id() = user_id` | `auth.user_id() = user_id` |
| Delete    | `auth.user_id() = user_id` |                            |

And the SQL code would look like this:

```sql shouldWrap
CREATE TABLE IF NOT EXISTS "todos" (
    "id" bigint PRIMARY KEY,
    "user_id" text DEFAULT (auth.user_id()) NOT NULL,
    "task" text NOT NULL,
    "is_complete" boolean DEFAULT false NOT NULL,
    "inserted_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "todos" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "create todos" ON "todos" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = user_id));

CREATE POLICY "view todos" ON "todos" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = user_id));

CREATE POLICY "crud-authenticated-policy-update" ON "todos" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "todos"."user_id")) WITH CHECK ((select auth.user_id() = "todos"."user_id"));

CREATE POLICY "delete todos" ON "todos" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = user_id));
```

As you add new features, you'll need to add more policies to match. This growing complexity can lead to subtle bugs that can be hard to spot in a large schema file filled with SQL statements.

## Simplifying RLS with crudPolicy

The `crudPolicy` function generates RLS policies by accepting a simple configuration object. Let's break down its usage:

```typescript {16-20}
import { crudPolicy, authenticatedRole, authUid } from 'drizzle-orm/neon';

// Define a table with RLS policies
export const todos = pgTable(
  'todos',
  {
    id: bigint().primaryKey(),
    userId: text()
      .notNull()
      .default(sql`(auth.user_id())`),
    task: text().notNull(),
    isComplete: boolean().notNull().default(false),
  },
  (table) => [
    // Apply RLS policy
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId),
    }),
  ]
);
```

### Configuration parameters

The `crudPolicy` function accepts these parameters:

- `role`: The Postgres role(s) to apply the policy to. Can be a single role or an array of roles
- `read`: Controls SELECT operations:
  - `true` to allow all reads
  - `false` to deny all reads
  - A custom SQL expression
  - `null` to prevent policy generation
- `modify`: Controls INSERT, UPDATE, and DELETE operations:
  - `true` to allow all modifications
  - `false` to deny all modifications
  - A custom SQL expression
  - `null` to prevent policy generation

When executed, `crudPolicy` generates an array of RLS policy definitions covering all CRUD operations (select, insert, update, delete).

### The authUid Helper

For user-specific policies, Drizzle provides the `authUid` helper function:

```typescript
export const authUid = (userIdColumn: AnyPgColumn) =>
  sql`(select auth.user_id() = ${userIdColumn})`;
```

This helper:

1. Uses the `auth.user_id()` function to extract the user ID from JWT tokens
2. Compares the authenticated user's ID with a table column
3. Returns a SQL expression suitable for use in `read` and `modify` parameters

## Common patterns

Now that we understand how `crudPolicy` works, let's look at typical ways to secure your tables:

### Basic access control

The most common pattern is restricting users to their own data:

```typescript {15-19} shouldWrap
import { crudPolicy, authenticatedRole, authUid } from 'drizzle-orm/neon';

export const todos = pgTable(
  'todos',
  {
    id: bigint().primaryKey(),
    userId: text()
      .notNull()
      .default(sql`(auth.user_id())`),
    task: text().notNull(),
    isComplete: boolean().notNull().default(false),
    insertedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId), // users can only read their own todos
      modify: authUid(table.userId), // users can only modify their own todos
    }),
  ]
);
```

### Role-based access control

For more complex scenarios, you might want different permissions for different roles:

```typescript {15-19,21-25} shouldWrap
import { crudPolicy, authenticatedRole, anonymousRole } from 'drizzle-orm/neon';

export const posts = pgTable(
  'posts',
  {
    id: bigint().primaryKey(),
    userId: text()
      .notNull()
      .default(sql`(auth.user_id())`),
    content: text().notNull(),
    published: boolean().notNull().default(false),
  },
  (table) => [
    // Public read access
    crudPolicy({
      role: anonymousRole,
      read: true, // anyone can read posts
      modify: false, // no modifications allowed
    }),
    // Authenticated user access
    crudPolicy({
      role: authenticatedRole,
      read: true, // can read all posts
      modify: authUid(table.userId), // can only modify own posts
    }),
  ]
);
```

### Complex relationships

For tables with foreign key relationships, you can create policies that check ownership through related tables:

```typescript {15-19,21-25,38-42,44-48} shouldWrap
import { crudPolicy, authenticatedRole, pgPolicy } from 'drizzle-orm/neon';

export const notes = pgTable(
  'notes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ownerId: text('owner_id')
      .notNull()
      .default(sql`auth.user_id()`),
    title: text('title').notNull().default('untitled note'),
    shared: boolean('shared').default(false),
  },
  (table) => [
    // Users can only access their own notes
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.ownerId),
      modify: authUid(table.ownerId),
    }),
    // Shared notes are visible to authenticated users
    pgPolicy('shared_policy', {
      for: 'select',
      to: authenticatedRole,
      using: sql`${table.shared} = true`,
    }),
  ]
);

export const paragraphs = pgTable(
  'paragraphs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    noteId: uuid('note_id').references(() => notes.id),
    content: text('content').notNull(),
  },
  (table) => [
    // Users can only access paragraphs from their own notes
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select notes.owner_id = auth.user_id() from notes where notes.id = ${table.noteId})`,
      modify: sql`(select notes.owner_id = auth.user_id() from notes where notes.id = ${table.noteId})`,
    }),
    // Shared note paragraphs are visible to authenticated users
    pgPolicy('shared_policy', {
      for: 'select',
      to: authenticatedRole,
      using: sql`(select notes.shared from notes where notes.id = ${table.noteId})`,
    }),
  ]
);
```

## Example applications

Check out these sample applications that demonstrate RLS policies with `crudPolicy`:

- **[Data API Demo](https://github.com/neondatabase-labs/neon-data-api-neon-auth)**: A note-taking app using Data API with RLS
- **[Social Wall Demo](https://github.com/neondatabase-labs/social-wall-drizzle-neon-rls)**: A social wall using Neon RLS with RLS

Both applications use the same Drizzle RLS patterns, demonstrating how `crudPolicy` works with both Data API and Neon RLS.

<NeedHelp/>
