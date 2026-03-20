---
title: 'Introducing Neon RLS: Simplifying Row-Level Security For Postgres'
description: 'RLS policies in your codebase, verified by Neon'
excerpt: >-
  Today we’re launching Neon RLS, a tool that aims to simplify the usage of
  Postgres row-level security policies while enabling new deployment models for
  app developers. With Neon RLS, you can manage RLS directly in your codebase
  and integrate with any authentication provider, maki...
date: '2024-10-30T13:58:41'
updatedOn: '2025-09-11T18:51:20'
category: engineering
categories:
  - engineering
  - company
authors:
  - david-gomes
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/introducing-neon-authorize/cover.png
  alt: null
isFeatured: false
seo:
  title: 'Introducing Neon RLS: Simplifying Row-Level Security For Postgres - Neon'
  description: >-
    Neon RLS simplifies Postgres row-level security policies for developers, so
    they can manage RLS directly in their codebase.
  keywords: []
  noindex: false
  ogTitle: 'Introducing Neon RLS: Simplifying Row-Level Security For Postgres - Neon'
  ogDescription: >-
    Neon RLS simplifies Postgres row-level security policies for developers, so
    they can manage RLS directly in their codebase.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/introducing-neon-authorize/social.jpg
source:
  wpId: 7413
  wpSlug: introducing-neon-authorize
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/introducing-neon-authorize/screenshot-2024-10-29-at-44318percente2percent80percentafpm-1024x571-4907ec49.png)

<Admonition type="important" title="Update: Neon RLS is now part of the Neon Data API">
We’ve moved the functionality previously known as Neon RLS / Neon Authorize into the Neon Data API. You can [read more about the Data API here](https://neon.com/docs/data-api/get-started) and start using it in your projects today.
</Admonition>

Today we’re launching [Neon RLS](https://neon.tech/docs/guides/neon-authorize), a tool that aims to simplify the usage of Postgres row-level security policies while enabling new deployment models for app developers. With Neon RLS, you can manage RLS directly in your codebase and integrate with any authentication provider, making it easier to enforce fine-grained access control without added complexity.

Every app needs a database. And every app needs authentication and authorization.

However, it can be cumbersome to bind these things together. If you’ve worked on application backends before, it’s very likely you’ve seen code like this:

```javascript
try {
  const result = await query(
    `SELECT r.role_name
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = $1 AND r.role_name = $2`,
    [userId, "admin"]
  );

  if (result.rows.length > 0) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
}
```

This type of database access is hard to properly secure. The core issue is that it’s quite easy to mess up the authorization check – `WHERE ur.user_id = $1 AND r.role_name = $2)` .

This is where [Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) in Postgres come in. This feature allows developers to configure **declarative** access rules for their tables. As an example, let’s say you have the following `users` table:

```sql
Table "public.projects"
┌───────────────┬──────────────────────────┬──────────┬───────────────────┐
│    Column     │           Type           │ Nullable │      Default      │
├───────────────┼──────────────────────────┼──────────┼───────────────────┤
│ id            │ uuid                     │ not null │                   │
│ owner_user_id │ uuid                     │ not null │                   │
│ name          │ text                     │ not null │                   │
│ created_at    │ timestamp with time zone │          │ CURRENT_TIMESTAMP │
│ updated_at    │ timestamp with time zone │          │ CURRENT_TIMESTAMP │
└───────────────┴──────────────────────────┴──────────┴───────────────────┘
```

To secure it with RLS, you’d configure the following rules:

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting own records
CREATE POLICY select_own_records ON public.projects
FOR SELECT
USING ((select owner_user_id = auth.user_id()));

-- Create policy for inserting rows
CREATE POLICY insert_policy ON public.projects
FOR INSERT
WITH CHECK ((select owner_user_id = auth.user_id()));

-- Here, we're missing similar policies for DELETE and UPDATE.
```

Notice that `auth.user_id()` and `auth.session()` are part of the open-source [pg_session_jwt](https://github.com/neondatabase/pg_session_jwt) Postgres extension, authored by the Neon team.

<Admonition type="info">
The advantage of RLS is that the authorization layer for your application is now **declarative**. Just like React.js brought declarative views to frontend development, RLS rules bring declarative access logic to backends.
</Admonition>

With access logic at the database level, your application becomes much safer. Just like foreign keys enforce referential integrity, and [CASCADE deletes](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK) can be used to enforce data correctness, RLS can enforce authorization on every database query.

## Expanding access to RLS

**With Neon RLS, we’re making it easier for developers to use RLS by providing an integration between any authentication provider and Postgres on Neon.** After setting it up, calls to the database can be authenticated with a [JWT](https://jwt.io/introduction) (JSON Web Token) generated by the auth provider, which will be:

– Verified by the Neon Proxy

– Added to the request and made available for RLS rules and WHERE clauses alike

Furthermore, you’ll also have access to a few utility functions such as `auth.session()` and `auth.user_id()` which will help you use the JWTs that are coming from your auth provider.

![Image](https://cdn.neonapi.io/public/images/pages/blog/introducing-neon-authorize/ad4nxd92vysnm6xspmhzmqsjmw9565bsulhhucx7nvlydqeujjb7w4bqlrawrknmvfqy3g8hz08hdfkynkdwftsvcwegpquxyorswjtgiyxmqge3uv4khdcbshe3d6b7zaar9txedmmxfyy6zoszx7ivkyc5zv-ecc590e8.png)

Any authentication provider is automatically supported by our platform as long as it can generate JWTs and provide some URL for us to download the JWKS. Here’s an example of using the JWT in a filter:

```sql
SELECT
	u.name,
	u.email
FROM
	users u
WHERE
	auth.user_id() = u.user_id
```

Here’s a list of Auth providers we’ve already tested in partnership with each team (more to come):

- Clerk – [Example Repo](https://github.com/neondatabase-labs/clerk-nextjs-neon-authorize)
- Stack Auth – [Example Repo](https://github.com/neondatabase-labs/stack-nextjs-neon-authorize)
- Auth0 – [Example Repo](https://github.com/neondatabase-labs/auth0-nextjs-neon-authorize)
- Stytch – [Example Repo](https://github.com/neondatabase-labs/stytch-nextjs-neon-authorize)
- AWS Cognito – [Example Repo](https://github.com/neondatabase-labs/aws-cognito-express-htmx-neon-authorize)
- Azure AD – [Example Repo](https://github.com/neondatabase-labs/azure-ad-b2c-nextjs-neon-authorize)
- Descope Auth – [Example Repo](https://github.com/neondatabase-labs/descope-react-frontend-neon-authorize)
- Supertokens – [Example Repo](https://github.com/neondatabase-labs/supertokens-nestjs-solidjs-drizzle-neon-authorize)
- Firebase Auth
- Keycloak
- GCP Cloud Identity

Refer to the [Neon RLS docs](https://neon.tech/docs/guides/neon-authorize) for all the details.

## The elephant in the room: RLS’s SQL syntax

One of the biggest issues with Postgres RLS is the difficult-to-understand SQL syntax. While LLMs can be great at generating this syntax, it still can easily become too hard to reason about.

That’s why we’ve partnered with [Drizzle ORM](https://orm.drizzle.team/) to offer a cleaner, more intuitive way of defining RLS rules. **With Drizzle and Neon, developers can set up RLS policies in a declarative format right alongside their schema definitions**. This means you can manage RLS in the same place as your schema and data models, making your codebase more organized and easier to maintain.

<Admonition type="note" title="What if I'm not using Drizzle?">
That's completely fine: you can still use Neon RLS. Drizzle is not a requirement but an enhancement.
</Admonition>

We worked with the Drizzle team in order to design and test both the `pgPolicy` function, as well as a `crudPolicy` higher-level API that can be used as a helper utility to generate multiple Postgres policies with one function call.

Here’s a sneak peek of what it looks like to use `@drizzle-orm/pg` and `@drizzle-orm/neon` together. Also in this repo:

[https://github.com/neondatabase-labs/social-wall-drizzle-neon-authorize](https://github.com/neondatabase-labs/social-wall-drizzle-neon-authorize)

```typescript
import { sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { authenticatedRole, anonymousRole, crudPolicy, authUid } from "drizzle-orm/neon";

/**
* This defines a simple schema with two tables:
* - users: a table of users
* - posts: a table of social posts
*
* The schema has two RLS policies:
* - users: admin-only
* - posts: anyone can read, authenticated users can modify their own posts
*/

// private table, without RLS policies this is admin-only
export const users = pgTable("users", {
 userId: text("user_id").primaryKey(),
 email: text("email").unique().notNull(),
 createdAt: timestamp("created_at").defaultNow().notNull(),
 updatedAt: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS();

// posts table with RLS policies
// - anyone can read
// - authenticated users can read any post and can modify their own posts
export const posts = pgTable(
 "posts",
 {
   id: text("id").primaryKey(),
   title: text("title").notNull(),
   content: text("content").notNull(),
   userId: text("userId").references(() => users.userId),
 },
 (table) => [
   // anyone (anonymous) can read
   crudPolicy({
     role: anonymousRole,
     read: true,
   }),
   // authenticated users can read any post, and modify only their own posts
   crudPolicy({
     role: authenticatedRole,
     read: true,
     // `userId` column matches `auth.user_id()` allows modify
     modify: authUid(table.userId),
   }),
 ],
);
```

In this schema, we’re using Postgres for a bunch of different things:

– Column uniqueness

– Referential integrity

– Cascade deletes

– And with RLS: access rules!

_Of course_, one can also just keep all these rules in “regular application code”. We’re not forcing anyone to use RLS policies. By having authenticated database requests with JWTs, developers can make use of their payloads in `WHERE` clauses from their app’s backend as well.

## Get started with Neon RLS + Drizzle + Clerk

If you’re using [Clerk](https://clerk.com/), we have a [tutorial](https://neon.tech/docs/guides/neon-authorize-tutorial) to help you get set up quickly, using a sample todos app built with Next.js. Also in [this repo.](https://github.com/neondatabase-labs/clerk-nextjs-neon-authorize)

What you’ll learn:

- How to configure Neon RLS with Clerk for authentication
- How to set up RLS policies via Drizzle in a clear, declarative way alongside your schema
- How to test and verify your setup to ensure smooth, secure access control

## Wrapping Up

Neon RLS is just the start of our journey towards making application development faster with Postgres. We hope to partner with more authentication providers and ORMs in the future to streamline all of this even more.

One of the novelties that comes out of this new feature is that you can now develop applications that are entirely client-side without a server/backend. We believe that for simple apps, you can get away with hosting them (for free) on GitHub Pages and then using Neon together with your auth provider of choice, without a backend. However, for more serious projects, we still recommend that you build a backend to protect your database.

## RLS for everything or not?

Whether to use PG RLS for everything or not is an interesting debate. For the most part, we recommend defining some RLS rules for very important and core authorization logic. For example, [multi-tenant enterprise applications](https://neon.tech/blog/multi-tenancy-and-database-per-user-design-in-postgres#shared-schema) can definitely benefit from having RLS for extra security. However, it’s probably better to define very intricate access logic in your backend code.
