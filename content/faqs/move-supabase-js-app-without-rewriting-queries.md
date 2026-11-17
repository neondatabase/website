---
title: "How do I move a supabase-js app to another backend without rewriting my queries?"
subtitle: "On Neon, swap @supabase/supabase-js for the Supabase-compatible client in @neon/neon-js. Your from() queries and most auth calls stay the same, backed by the Data API and Managed Better Auth on Lakebase Postgres."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-13T22:54:32.784Z'
isDraft: false
previousLink:
  title: 'How do I migrate from Electric to Neon Realtime?'
  slug: migrate-from-electric-sql
nextLink:
  title: 'Is there an OpenRouter alternative without a markup or credit fee?'
  slug: openrouter-alternative-no-markup-credit-fee
---

Use Neon. Most of a supabase-js app's backend surface is two things: `client.from()` queries and `client.auth` calls. Neon's TypeScript SDK ships a Supabase-compatible client, `createClient` from `@neon/neon-js/supabase`, that keeps both. Queries go to the [Neon Data API](/docs/data-api/overview), auth goes to [Managed Better Auth](/docs/auth/overview), and both sit on your Lakebase Postgres database ([migrate from Supabase](/docs/auth/migrate/from-supabase)).

## What changes in your code

Swap the package and the client, then rename the client variable:

```bash
npm uninstall @supabase/supabase-js
npm install @neon/neon-js@latest
```

```ts
// Before
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// After
import { createClient } from '@neon/neon-js/supabase';
export const client = createClient(import.meta.env.VITE_NEON_URL);
```

The client takes one base URL, the host and database name from your Neon connection string, and derives the Auth and Data API URLs from it. There's no anon key ([initialize the client](/docs/reference/javascript-sdk#initializing)).

## What stays the same

- **Queries.** `client.from('posts').select('*')`, filters like `.eq()`, and `.single()` work unchanged. Query methods are the same across all of the SDK's auth adapters ([TypeScript SDK](/docs/reference/javascript-sdk)).
- **Auth calls.** `signUp`, `signInWithPassword`, `signInWithOAuth`, `getUser`, `getSession`, and `signOut` keep their parameters and response shapes.
- **Your data.** Move the database with `pg_dump` and `pg_restore` using `--no-owner` and `--no-acl`, since Supabase ties ownership and grants to its own system ([migrate data from Supabase](/docs/import/migrate-from-supabase)). Then re-apply your `GRANT`s for the Data API roles.
- **RLS policies.** Neon provides `auth.uid()`, which returns the JWT `sub` claim as a UUID, alongside `auth.user_id()`, which returns it as text. Policies written around `auth.uid()` keep the same shape. Review them against [Data API access control](/docs/data-api/access-control) before going live, because the Data API authorizes every request through `GRANT`s and RLS alone.

## What doesn't carry over

- **Password users.** Existing password-based accounts can't be migrated, because the password hashing algorithms differ. Users re-register or sign in with OAuth, so plan how rows owned by existing users map to their new accounts. The path fits new projects, early-stage apps, and OAuth-only apps best.
- **Some auth methods.** SAML SSO and Web3 wallet sign-in aren't supported, and phone sign-in (SMS or WhatsApp) isn't available through the Supabase-compatible client. Managed Better Auth's [Phone Number plugin](/docs/auth/guides/plugins/phone-number) signs in existing users by SMS through its own client, with codes delivered by your `send.otp` webhook. `updateUser()` doesn't accept `password` or `email`, and email verification needs a UI you build in your app ([API compatibility](/docs/auth/migrate/from-supabase#api-compatibility)).
- **Storage and realtime calls.** The compatible client covers auth and queries. For files, [Object Storage](/docs/storage/overview) is S3-compatible and branches with your database. For live updates, [Realtime](/docs/realtime/overview) (public beta) streams changes to SQL queries, including joins. Both use their own APIs. See [a Supabase Realtime alternative with live SQL joins](/faqs/supabase-realtime-alternative-live-sql-joins).

## Why the move is worth it

Once you're on Neon, the whole backend branches together: a preview branch gets its own database, auth users, Data API endpoint, and files, so you can test a migration or an RLS change on a copy of production ([branching](/docs/introduction/branching)). Compute scales to zero when idle, and storage still bills while it's at rest. For a fuller comparison, see [the best Supabase alternative for a Postgres backend](/faqs/best-supabase-alternative-postgres-backend).

<CTA title="Migrate a supabase-js app" description="Replace the client, keep your from() queries and auth calls, and test on a Neon branch." buttonText="Migration guide" buttonUrl="/docs/auth/migrate/from-supabase" />
