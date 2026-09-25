---
title: Choosing between NextAuth.js, Managed Better Auth, and Better Auth for Postgres
subtitle: Understand how NextAuth.js, Managed Better Auth, and Better Auth differ in session management, migrations, and handling authentication data across Postgres branches.
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2026-04-21T02:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

If you are adding authentication to a Next.js application that already uses Postgres, you will run into three options that sound similar but behave very differently in practice: [Auth.js (NextAuth.js)](https://authjs.dev/), [Managed Better Auth](/docs/auth/overview), and [Better Auth](https://www.better-auth.com/).

They are not interchangeable implementations of the same idea. Two of them are libraries you run inside your app. One is a managed service that is tightly integrated with a specific Postgres provider. The right choice usually comes down to how you want identity data to live in Postgres, how you want sessions to be managed, and how much infrastructure you want to own.

This article compares Auth.js (NextAuth.js), Managed Better Auth, and Better Auth by examining their approach to data storage, session strategy, and operational workflow. It ends with situations where each one fits, without naming a single option as the “best” choice.

## The common ground

All three options can be Postgres-backed. That matters because it changes how you reason about auth:

- You can query users and sessions with SQL.
- You can join auth data to application data.
- You can treat auth state as something that moves with your database when you clone, branch, or restore environments.

The differences are about where the auth logic runs, what schema gets created, and who operates the auth API.

## Auth.js (NextAuth.js): framework-native auth with adapters and flexible session strategies

Auth.js (often referred to as NextAuth.js) is a **framework-oriented auth library** with [first-class Next.js support](https://authjs.dev/getting-started/migrating-to-v5). It supports many providers and flows, and it can either:

- Keep sessions primarily in [cookies and signed tokens](https://authjs.dev/concepts/session-strategies#jwt-session), or
- Persist sessions and user records via a [database adapter](https://authjs.dev/getting-started/database).

If your goal is "use Postgres as the source of truth for users and sessions", the key decision in Auth.js is usually [adapter choice](https://authjs.dev/reference/overview) and [session strategy](https://authjs.dev/concepts/session-strategies).

With Postgres, the official adapter is [`@auth/pg-adapter`](https://authjs.dev/getting-started/adapters/pg). A typical Next.js configuration uses `pg` and `Pool` to enable database sessions:

```tsx
import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [
    // ... OAuth, Email, Credentials, etc.
  ],
  session: { strategy: "database" },
});
```

Auth.js publishes [the SQL schema](https://authjs.dev/getting-started/adapters/pg#schema) the adapter expects (tables like `users`, `accounts`, `sessions`, and `verification_token`) on its adapter page for Postgres. If you prefer an ORM-centric integration, Auth.js also supports adapters for [Prisma](https://authjs.dev/getting-started/adapters/prisma), [Drizzle](https://authjs.dev/getting-started/adapters/drizzle), and others via the `@auth/*` ecosystem.

Auth.js fits a Next.js app where you want authentication integrated with application logic. It's a good choice if you want a broad set of providers and a large ecosystem of adapters. Auth.js lets you choose between stateless JWT sessions and persistent database sessions, and you can change that choice as your needs for scale, durability, or performance change.

When using a Postgres-backed adapter, there are several important considerations. Every authentication event (sign in, session validation, etc.) will generate database queries, so your database's connection pooling, throughput limits, and latency matter, especially in production. This is particularly relevant in serverless environments (such as Vercel or AWS Lambda), where each incoming request might create a fresh connection to your Postgres instance. Without a connection pooler (e.g., PgBouncer) or a serverless-optimized database, you can quickly exhaust available connections or introduce latency spikes. Planning for this requires understanding the [trade-offs between connection-heavy and stateless session management modes](https://authjs.dev/concepts/session-strategies#disadvantages-1).

Another nuance appears when you want to branch your database. Auth.js stores all authentication data (users, sessions, account links, verification tokens) directly in tables managed by your app. If you use database branching (as offered by providers like Neon), your authentication data will be cloned with the rest of your application tables. This can simplify staging and previews by providing consistent auth state, but it also means that **session cookies or JWTs from one branch won’t automatically work in another, and you’ll need to handle cross-environment secrets and re-authentication flows**.

Because the authentication schema lives in your application’s database, you have full control to customize and extend it. However, you’re also responsible for **applying migrations and ensuring schema drift does not occur across environments (production, staging, previews)**. That operational work grows as your application and team grow.

## Managed Better Auth: managed auth that stores identity in your database on Neon and branches with the database

Managed Better Auth is a **managed authentication service** that stores users, sessions, and configuration **directly in your Lakebase Postgres database on Neon**. The core design goal is database-centric auth where identity becomes ordinary Postgres state.

When you use Managed Better Auth, your authentication data is stored in your database on Neon under [the `neon_auth` schema](/docs/auth/overview). This makes all auth state accessible with standard SQL queries, and fully compatible with patterns like [Row Level Security](/docs/guides/row-level-security). Because the auth data lives alongside your application data, branching a Neon database [also branches the auth state](/docs/auth/branching-authentication). Preview environments and end-to-end authentication tests behave just like your production setup.

Managed Better Auth builds on Better Auth, so if you’ve worked with Better Auth before, many of the APIs and overall concepts will feel familiar. Unlike running your own instance of Better Auth, [Managed Better Auth is a managed service](/docs/auth/overview#when-to-use-managed-better-auth-vs-self-hosting-better-auth). Your app communicates with it using SDKs provided by Neon, so you don’t have to host or operate your own authentication service.

Below is a basic example of how you might set up Managed Better Auth in a Next.js application using the [Managed Better Auth SDK](/docs/reference/javascript-sdk):

```ts title="lib/auth/server.ts"
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET,
  },
});
```

You could then wire up this handler to your Next.js middleware, for example:

```ts title="middleware.ts"
import { auth } from '@/lib/auth/server';
import { NextRequest } from 'next/server';

const authMiddleware = auth.middleware({
  loginUrl: '/auth/sign-in',
});

export default function middleware(request: NextRequest) {
  if (request.headers.has('Next-Action')) return;
  return authMiddleware(request);
}

export const config = {
  matcher: ['/', '/account/:path*'],
};
```

With Managed Better Auth, your authentication state (users, sessions, etc.) lives in your database on Neon under the `neon_auth` schema. You can query it directly with SQL, and when you branch your database on Neon, app and auth state branch together, so each preview or integration environment gets its own copy of both.

Managed Better Auth works best when you want authentication state to follow your database lifecycle, including branching, previews, and continuous integration. It’s a good fit if you prefer a managed authentication API, want to keep your application logic slim, and if SQL-level access to identity and Postgres-native authorization (like RLS) is important to you.

Managed Better Auth is designed specifically for Neon and is currently available in AWS regions only, so it matters if you ever want to switch Postgres providers. As with any managed service, check that its features and plans fit where you want your project to go.

## Better Auth: app-owned auth with a first-class Postgres adapter and explicit database workflow

Better Auth is a **library you run in your application**. It is explicitly designed to support database-backed auth, and its docs are direct about schema, adapters, and migrations.

For Postgres, Better Auth supports [a Postgres adapter](https://better-auth.com/docs/adapters/postgresql) (via `pg.Pool` and a Kysely-based implementation) and provides a CLI to generate and migrate the required tables:

```tsx
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
});
```

Better Auth documents its database-backed approach in detail. The [schema documentation](https://better-auth.com/docs/concepts/database#core-schema) lays out which tables are involved, such as users, sessions, accounts, and verification records, and explains [how migrations work in practice](https://better-auth.com/docs/concepts/database#running-migrations).

If you use Better Auth, **you manage authentication entirely** within your application and your database, so you can tailor the APIs to your needs and deploy them wherever your app runs, on Neon or any other Postgres provider. The schema and migrations for auth data are treated just like any other part of your application’s schema, which gives you both flexibility and control.

Branching is an important aspect when you rely on Postgres as the source of truth for auth. When you branch your Postgres database, your auth data branches right along with it. Staging, previews, and production can each have their own isolated authentication state that starts from realistic data. However, it also means that **session tokens and cookies are only valid within the branch where they were issued, so users will need to log in again on different branches**. You’ll also want to coordinate secrets across environments to avoid confusion.

Since you’re running the auth system in your own stack, **you’re responsible for operational details**. This includes [handling database connection pooling](/docs/connect/connection-pooling) (especially if you’re in a serverless setup where each request might open a new connection) and [keeping your migrations in sync as you make schema changes](/docs/guides/integrations#schema-migration). Any upgrades or updates to Better Auth are in your hands, so you set the pace for moving to new versions and rolling out changes.

## Choosing the right auth for your project

When you compare these three, a practical way to decide is to focus on who “owns” the auth runtime and how tightly it is attached to the database.

If you want the simplest mental model, ask these questions:

- Do you want a **managed auth service** that is tightly integrated with your database provider?
- Do you want auth to be a **library inside your app**, deployed wherever your app runs?
- Do you need auth to be **portable across Postgres providers**, or is a provider-integrated service a feature?

Common scenarios:

- If you are building a Next.js app and want auth that feels native to the framework, Auth.js is often the fastest path, and you can decide later whether sessions live in Postgres.
- If your workflow depends on database branching and you want auth state to follow branches automatically, Managed Better Auth is designed for that.
- If you want a database-centric auth system you can run anywhere and you are comfortable owning the runtime, Better Auth is a strong fit.

## Neon's role in database-centric authentication

Database-centric auth works best when you treat identity like first-class Postgres state: tables you can query, policies you can apply, and environments you can reproduce.

On Neon specifically, that framing lines up with features like branching and preview databases. If auth state lives in Postgres, your “auth environment” can become just another branch, which is hard to replicate with cookie-only or external auth systems. If you want that benefit but still want to keep auth app-owned, Auth.js with a Postgres adapter or Better Auth with a Postgres adapter can get you close. If you want it built in and managed, Managed Better Auth leans into that model directly.
