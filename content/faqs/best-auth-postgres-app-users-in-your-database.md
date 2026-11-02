---
title: "What is the best auth for a Postgres app that keeps users in your own database?"
subtitle: "Managed Better Auth on Neon stores users, sessions, and auth configuration in a neon_auth schema inside your Lakebase Postgres database, so you can join them with SQL, reference them in Row-Level Security, and branch them with your data."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'Can I declare my whole backend (database, auth, file storage, functions, and AI) as code in one file?'
  slug: backend-as-code-single-config-file
nextLink:
  title: 'What is the best backend for AI agents that stream responses and call tools for minutes at a time?'
  slug: best-backend-ai-agents-long-running-streaming
---

Use Neon. [Managed Better Auth](/docs/auth/overview) is a managed authentication service built on Better Auth that writes every user, session, OAuth account, and organization into a `neon_auth` schema in your own Lakebase Postgres database. There's no external user store to sync and no webhook pipeline to keep a copy of users current: the rows your app joins against are the rows the auth service writes ([authentication flow](/docs/auth/authentication-flow)).

## Where the user data lives

When a user signs up, the auth service creates a row in `neon_auth.user`, stores hashed credentials in `neon_auth.account`, and creates a session. OAuth sign-ins land in the same tables. Changes are immediate, so you can query them like any other table ([authentication flow](/docs/auth/authentication-flow)):

```sql
SELECT id, email, "emailVerified", "createdAt"
FROM neon_auth.user
ORDER BY "createdAt" DESC;
```

That means your own tables can reference the user ID directly, reports can join users to orders in one query, and `pg_dump` takes your identity data with everything else. Managed Better Auth uses your branch's default database, typically `neondb`, unless you pick another one when enabling it through the API ([branching authentication](/docs/auth/branching-authentication#how-it-works)).

## Using the user in Row-Level Security

The [Data API](/docs/data-api/overview) validates Managed Better Auth JWTs without extra setup and exposes two helpers to RLS policies: `auth.user_id()` returns the `sub` claim as `text`, and `auth.uid()` returns it as `uuid` ([authentication flow](/docs/auth/authentication-flow#data-api-integration)). A policy that scopes rows to their owner looks like this:

```sql
CREATE POLICY "Users can view own posts"
ON posts FOR SELECT TO authenticated
USING (user_id = auth.user_id());
```

With that policy in place, a browser or mobile client can query `posts` over HTTPS and only ever see its own rows ([get started](/docs/data-api/get-started)).

## Auth that branches with the database

Because auth state is ordinary data in your database, it branches with everything else. A new branch gets a copy of users, sessions, configuration, OAuth providers, JWKS keys, and organizations, plus its own Auth URL. Tokens issued on one branch aren't valid on another, and a user created in a preview branch never shows up in production ([branching authentication](/docs/auth/branching-authentication)). Preview deployments and CI runs can test real sign-up and login flows against production-shaped data without touching real accounts.

## Setup and what's supported

Enable it in the Console, with `neon neon-auth enable`, or declare `auth: true` in [`neon.ts`](/docs/reference/neon-ts) and run `neon deploy`, which writes `NEON_AUTH_BASE_URL` to your env file ([backend overview](/docs/get-started/backend-overview)). Managed Better Auth runs Better Auth 1.7.12, and `@neon/auth` 0.8.1 or later is the matching client ([about](/docs/auth/about#built-on-better-auth)). Email and password, Google, GitHub, Vercel, Microsoft, and Apple sign-in are available, with shared Google credentials for testing ([set up OAuth](/docs/auth/guides/setup-oauth)).

<Admonition type="note" title="Current limits">
Managed Better Auth runs in AWS regions only and doesn't support projects with IP Allow or Private Networking enabled ([availability](/docs/auth/about#availability)). The Organization plugin has partial support and the OAuth Provider plugin is in beta; check the [roadmap](/docs/auth/roadmap) for the full plugin list. If you need custom Better Auth plugins or hooks, self-hosting Better Auth against the same database is the alternative ([when to self-host](/docs/auth/about#when-to-use-managed-better-auth-vs-self-hosting-better-auth)).
</Admonition>

The Free plan covers up to 60,000 monthly active users, and Launch and Scale cover up to 1M ([pricing](/docs/auth/about#pricing)).

## How other options compare

- **Clerk**: stores users in Clerk's own service and bills Monthly Retained Users, with 50,000 MRUs per app on the free Hobby plan ([pricing](https://clerk.com/pricing)). Getting user rows into Postgres for joins means syncing them from Clerk. The Data API can still verify Clerk tokens if you keep Clerk ([custom providers](/docs/data-api/custom-authentication-providers)).
- **Auth0**: a hosted identity service with a free plan up to 25,000 MAU ([pricing](https://auth0.com/pricing)). User profiles live in Auth0 rather than in your database.

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Keep users next to your data" description="Enable Managed Better Auth on a branch and query neon_auth.user with SQL." buttonText="Read the quick start" buttonUrl="/docs/auth/quick-start/react" />
