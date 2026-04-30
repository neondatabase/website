---
title: Higher-level CRUD Abstraction for Postgres RLS
description: Simplify row-level security via a concise API
excerpt: >-
  Postgres Row-Level Security is notoriously difficult to comprehend and use.
  The policy access model for a todos table in a Todo List app can be declared
  as per the following table: Operation Using(applies to data being returned)
  Wich Check(applies to data being written) Select au...
date: '2024-11-13T17:09:49'
updatedOn: '2025-09-11T18:56:13'
category: postgres
categories:
  - postgres
authors:
  - david-gomes
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/higher-level-crud-abstraction-for-postgres-rls/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Higher-level CRUD Abstraction for Postgres RLS - Neon
  description: Simplify row-level security via a concise API
  keywords: []
  noindex: false
  ogTitle: Higher-level CRUD Abstraction for Postgres RLS - Neon
  ogDescription: >-
    Postgres Row-Level Security is notoriously difficult to comprehend and use.
    The policy access model for a todos table in a Todo List app can be declared
    as per the following table: Operation Using(applies to data being returned)
    Wich Check(applies to data being written) Select auth.user_id() = user_id
    Insert – auth.user_id() = user_id Update auth.user_id() = […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/higher-level-crud-abstraction-for-postgres-rls/social.jpg
source:
  wpId: 7567
  wpSlug: higher-level-crud-abstraction-for-postgres-rls
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/higher-level-crud-abstraction-for-postgres-rls/neon-crud-1-1024x576-583320ed.jpg)

<Admonition type="important" title="Update: Neon RLS is now part of the Neon Data API">
We’ve moved the functionality previously known as Neon RLS / Neon Authorize into the Neon Data API. You can [read more about the Data API here](https://neon.com/docs/data-api/get-started) and start using it in your projects today.
</Admonition>

[Postgres Row-Level Security](https://neon.tech/postgresql/postgresql-administration/postgresql-row-level-security) is notoriously difficult to comprehend and use. The policy access model for a `todos` table in a Todo List app can be declared as per the following table:

| Operation | Using<br />_(applies to data being returned)_ | Wich Check<br />_(applies to data being written)_ |
| --------- | --------------------------------------------- | ------------------------------------------------- |
| Select    | `auth.user_id() = user_id`                    |                                                   |
| Insert    | –                                             | `auth.user_id() = user_id`                        |
| Update    | `auth.user_id() = user_id`                    | `auth.user_id() = user_id`                        |
| Delete    | –                                             | `auth.user_id() = user_id`                        |

And the SQL code would look like this:

```sql
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

This is an extremely low-level API. And for most applications and data models, it will get very repetitive. So, **we’ve designed a more concise API that’s specifically designed for CRUD apps.**

This is what it looks like:

```typescript
import { crudPolicy, authenticatedRole, authUid } from “drizzle-orm/neon”;

export const todos = pgTable(
  "todos",
  {
    id: bigint().primaryKey(),
    userId: text()
      .notNull()
      .default(sql`(auth.user_id())`),
    task: text().notNull(),
    isComplete: boolean().notNull().default(false),
    insertedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId),
    }),
  ],
);
```

The `crudPolicy` function is implemented [here](https://github.com/drizzle-team/drizzle-orm/blob/83daf2d5cf023112de878bc2249ee2c41a2a5b1b/drizzle-orm/src/neon/rls.ts#L15). And these are its inputs:

- role: The PostgreSQL role(s) to apply the policy to. Can be a single `PgRole` instance or an array of `PgRole` instances or role names.
- read: The SQL expression or boolean value that defines the read policy. Set to `true` to allow all reads, `false` to deny all reads, or provide a custom SQL expression. Set to `null` to prevent the policy from being generated.
- modify: The SQL expression or boolean value that defines the modify (insert, update, delete) policies. Set to `true` to allow all modifications, `false` to deny all modifications, or provide a custom SQL expression. Set to `null` to prevent policies from being generated.

And it returns an array of PostgreSQL policy definitions, one for each data operation (select, insert, update, delete).

The `authUid` function is specific to [pg_session_jwt](https://github.com/neondatabase/pg_session_jwt), but its implementation is very simple. It simply allows you to connect `auth.user_id` to a column in your table.

```typescript
export const authUid = (userIdColumn: AnyPgColumn) => sql`(select auth.user_id() = ${userIdColumn})`;
```

This API is a much higher-level abstraction on top of Postgres RLS, which will hopefully be helpful to **anyone** using Postgres RLS (on Neon, or not, with pg_session_jwt or not).

---

**Coming soon:** If you’re curious about this API and what it looks like in a more complete data model, we’ll be publising a blog post with a reference RLS implemenration for a social media network.
