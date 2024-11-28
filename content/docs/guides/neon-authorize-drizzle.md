---
title: Simplify RLS with Drizzle
subtitle: Use Drizzle crudPolicy to manage Row-Level Security with Neon Authorize
enableTableOfContents: true
---

<InfoBlock>
<DocsList title="What you'll learn">
<p>How to simplify Row-Level Security using crudPolicy</p>
<p>Common RLS patterns with Drizzle</p>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/guides/neon-authorize">About Neon Authorize</a>
  <a href="https://orm.drizzle.team/docs/rls">RLS in Drizzle</a>
</DocsList>

</InfoBlock>

## Why simplify RLS policies?

Using Row-Level Security (RLS) policies in your database schema is a best practice in application development. While it may not be your only security measure, RLS acts as a reliable last line of defense, protecting your data from unauthorized access where it lives: at the database level.

However, implementing RLS comes with a few challenges. Writing and maintaining SQL for each CRUD operation (Create, Read, Update, Delete) can lead to repetitive code and increased complexity: both tedious and prone to errors.

### For example

To illustrate, let's consider a simple **Todo** list app with RLS policies applied to a `todos` table. Postgres RLS policies use two types of conditions:

- `USING` clause — controls which existing rows can be accessed
- `WITH CHECK` clause — controls what new or modified data can be written

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

With each new feature or role, the number of policies grows. This complexity can lead to subtle bugs, like accidentally allowing a user to update todos they can't read, or forgetting to apply a policy to a new table. These issues can be hard to spot in a large schema file filled with SQL statements.

## How crudPolicy simplifies RLS

Drizzle's `crudPolicy` simplifies RLS by replacing multiple SQL statements with a single configuration:

```typescript
import { crudPolicy, authenticatedRole, authUid } from "drizzle-orm/neon";

export const todos = pgTable(
  "todos",
  {
    id: bigint().primaryKey(),
    userId: text().notNull().default(sql`(auth.user_id())`),
    task: text().notNull(),
    isComplete: boolean().notNull().default(false),
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),    // users can only read their own todos
      modify: authUid(table.userId),   // users can only modify their own todos
    }),
  ]
);
```

The `crudPolicy` function accepts three key parameters:

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

It returns an array of RLS policy definitions, one for each operation (select, insert, update, delete).

Notice that `authUid` is a wrapper around Neon Authorize's `auth.user_id()` function. While `auth.user_id()` comes from the [pg_session_jwt](/docs/guides/neon-authorize#how-the-pgsessionjwt-extension-works) Postgres extension, Drizzle provides this wrapper to make it easier to use in your schema:

```typescript
export const authUid = (userIdColumn: AnyPgColumn) => sql`(select auth.user_id() = ${userIdColumn})`;
```

This wrapper:

- Integrates smoothly with Drizzle schemas
- Simplifies comparing the authenticated user ID with your table's user column

## Common patterns

Here are two typical ways to use `crudPolicy` for securing your tables:

### Basic access control

The most common pattern is restricting users to their own data:

```typescript shouldWrap
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

```typescript shouldWrap
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

## Example application

Check out our [social wall sample application](https://github.com/neondatabase-labs/social-wall-drizzle-neon-authorize), a simple schema that demonstrates RLS policies with `crudPolicy`. It implements a social wall where:

- Anyone can view the wall
- Authenticated users can modify their own posts

<NeedHelp/>
