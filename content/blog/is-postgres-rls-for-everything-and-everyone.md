---
title: Is Postgres RLS for Everything and Everyone?
description: 'Maybe, but there are some pitfalls to consider'
excerpt: >-
  In Neon, we recommend using a project-per-user pattern for multitenancy
  whenever possible. If this doesn’t work for you and you’re placing all your
  tenants within a single Postgres database, you should at least use RLS to
  prevent cross-tenant access—but expressing your entire aut...
date: '2024-11-15T17:32:58'
updatedOn: '2025-09-11T18:54:30'
category: postgres
categories:
  - postgres
authors:
  - david-gomes
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/is-postgres-rls-for-everything-and-everyone/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Is Postgres RLS for Everything and Everyone? - Neon
  description: >-
    A common question we get is: should all the authorization for my app be
    expressed with RLS? We explore the answer in this post.
  keywords: []
  noindex: false
  ogTitle: Is Postgres RLS for Everything and Everyone? - Neon
  ogDescription: >-
    A common question we get is: should all the authorization for my app be
    expressed with RLS? We explore the answer in this post.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/is-postgres-rls-for-everything-and-everyone/social.jpg
source:
  wpId: 7665
  wpSlug: is-postgres-rls-for-everything-and-everyone
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/is-postgres-rls-for-everything-and-everyone/neon-rls-2-1024x576-da8557f6.jpg)

<Admonition type="important" title="Update: Neon RLS is now part of the Neon Data API">
We’ve moved the functionality previously known as Neon RLS / Neon Authorize into the Neon Data API. You can [read more about the Data API here](https://neon.com/docs/data-api/get-started) and start using it in your projects today.
</Admonition>

In Neon, we recommend using a [project-per-user pattern](https://neon.tech/use-cases/database-per-tenant) for multitenancy whenever possible. If this doesn’t work for you and you’re placing all your tenants within a single Postgres database, you should at least use RLS to prevent cross-tenant access—but expressing your entire authorization model with RLS is not for the faint of heart. In this blog post, we uncover why.

With the [recent launch of Neon RLS](https://neon.tech/blog/introducing-neon-authorize), I’ve been building a lot of things with [Postgres RLS](https://neon.tech/postgresql/postgresql-administration/postgresql-row-level-security), as well as talking to a lot of people who use it for their apps. And one question that keeps coming up is: **should all of the authorization for my app be expressed with RLS?** Should I even use RLS?

I’ll start by saying that RLS is not the best authorization model out there. First of all, the syntax itself is very dense and repetitive. For example, if you’re building a todo list, this is the SQL you’ll have to write to properly protect your `todos` table:

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

Now, to be fair, we collaborated with [Drizzle ORM](https://orm.drizzle.team) to make this much simpler in TypeScript:

```typescript
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

However, it’s still not as expressive as something like [Zenstack’s authorization syntax](https://zenstack.dev/docs/reference/zmodel-language#using-authentication-in-policy-rules):

```bash
model Todo {
  owner User @relation(...)

  @@allow('read', auth() == owner)
  @@allow('update', auth() == owner)
}
```

## Challenges of using RLS for authorization

But RLS has other issues! For example, if you are trying to check whether a user belongs to a given organization in order to let them access or manage a specific resource, you will likely bump into “[infinite recursion detected in policy](https://stackoverflow.com/questions/72369134/infinite-recursion-rls)”. We learned this the hard way while working on the [RLS implementation for a social network](https://github.com/neondatabase-labs/social-network-drizzle-rls). There’s a couple of different ways around it:

- Create a view (what we did [here](https://github.com/neondatabase-labs/social-network-drizzle-rls/blob/02c37d657102aa73828978341b54bfa69d60962d/schema.ts#L173))
- Use a [function that bypasses RLS](https://github.com/orgs/supabase/discussions/3328#discussioncomment-1386551)

Furthermore, RLS comes with a bunch of different pitfalls:

- You should not write `USING (auth.user_id() = user_id)` but rather `USING ((select auth.user_id() = user_id))` so that Postgres can actually use its optimizer and cache the results per-statement.
- If you have multiple policies for the same operation on the same table, sometimes they will be OR’d and other times they will be AND’d. This depends on whether they’re “permissive” or “restrictive” policies. Yikes!
- When RLS is applied to functions or views, you have to think about whether to define them with security*invoker as true or false. This will change whether RLS is checked for the role that \_defined* the policy, or the role that _invokes_ the function (or selects from the view). This is tricky to get right.
  - By default, the RLS policy will be executed with the permissions of the owner of the view instead of with the permissions of the user executing the current query.
- Testing RLS is notoriously difficult. You have to write integration tests that launch Postgres and then make sure that you’re calling queries with different roles and different session settings, which is very hard to set up.

## When and how to use RLS effectively

Even with all of these limitations, there’s still good reasons to express an app’s entire authorization model using RLS. But, as your data model gets more complex, you should move your authorization model to a higher-level framework that is easier to reason about and to test properly (e.g., [CASL](https://casl.js.org/v6/en/)).

In this hybrid scenario, you can and should use RLS for certain core authorization checks. As an example, if you’re building a multi-tenant B2B SaaS application, you should at the very least use RLS to prevent any cross-tenant access. Cross-tenant data leaks will be terrible for your business, so protecting yourself at the lowest level of your stack will surely pay off.

It’s actually very easy to do this. You can simply make sure all of your tables have a `tenant_id` column and then apply the exact same set of RLS policies to all your tables. Using Drizzle’s RLS syntax, this is what that can look like:

```typescript
const tenantPolicy = (table) =>
  crudPolicy({
      to: authenticatedRole,
      view: sql`((select auth.session()->>'tenantId' = ${table.tenantId}))`,
      modify: sql`((select auth.session()->>'tenantId' = ${table.tenantId}))`,
    });

export const projects = pgTable(
  "projects",
  {
    projectId: bigint()
      .primaryKey(),
    tenantId: text(),
    name: text(),
    // ...
  },
  table => [
    tenantPolicy(table),
    // other RLS policies!
  ]
);
```

Then, just make sure that the JWTs you’re passing to [Neon RLS](https://neon.tech/docs/guides/neon-authorize) have a `tenantId` claim, and you’re much better protected against data leaks.

## Conclusion

So, is RLS for everyone? Well, no technology is for everyone. But RLS has its place and we at Neon are committed to supporting it with Neon RLS and [pg_session_jwt](https://github.com/neondatabase/pg_session_jwt). Reach out on [our Discord](https://neon.tech/discord) if you have any questions!
