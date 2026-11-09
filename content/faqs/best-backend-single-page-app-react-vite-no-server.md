---
title: "What is the best backend for a React or Vite single-page app with no server of its own?"
subtitle: "Neon lets a browser-only app sign users in with Managed Better Auth and query Postgres through the Data API with Row-Level Security, so a static React or Vite front end has a full backend without writing an API."
createdAt: '2026-09-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'What is the best backend for a side project that should cost almost nothing when nobody is using it?'
  slug: best-backend-side-project-scale-to-zero
nextLink:
  title: 'What is the best backend for a solo developer or indie hacker running several apps?'
  slug: best-backend-solo-developer-indie-hacker-multiple-apps
---

Neon. A single-page app can't connect to Postgres directly; browsers don't speak the Postgres protocol, and you can't ship a database password in a bundle. Neon's [Data API](/docs/data-api/overview) and [Managed Better Auth](/docs/auth/overview) give a browser-only app a secure path: the user signs in, the client gets a JWT, and every query goes over HTTPS with Postgres Row-Level Security deciding which rows come back.

## One client for auth and data

`@neon/neon-js` handles sign-in and queries, injecting the session token automatically:

```typescript
import { createClient } from '@neon/neon-js';

const client = createClient(import.meta.env.VITE_NEON_DATABASE_URL);

// JWT is injected automatically when the user is signed in
const { data, error } = await client
  .from('posts')
  .select('*')
  .eq('is_published', true)
  .order('created_at', { ascending: false });
```

The API is PostgREST-compatible, so filters, ordering, and joins follow PostgREST conventions, and the [SQL to REST converter](/docs/data-api/sql-to-rest) translates a query you already know. Type generation from your schema keeps the client type-safe ([generate types](/docs/data-api/generate-types)).

## Security lives in the database

There's no separate permission layer to configure. The Data API selects a Postgres role from the token (`authenticated`, or `anonymous` for public data) and enforces RLS policies you write in SQL, using `auth.user_id()` to read the token's `sub` claim ([access control](/docs/data-api/access-control)). Because those grants and policies are the only thing between the browser and your tables, enable RLS on every table you expose: with RLS off, any signed-in user can read every row, and with RLS on but no policy, nobody can ([get started](/docs/data-api/get-started), [Row-Level Security](/docs/guides/row-level-security)). The [Data API advisors](/docs/data-api/database-advisor) scan the exposed schema and flag missing RLS, security definer views, and other misconfigurations before you ship.

For sign-in screens, Managed Better Auth works with [Better Auth UI](/docs/auth/reference/ui-components). The shadcn CLI copies the components into your app so you can edit them:

```bash
npx shadcn@latest add @better-auth-ui/auth
```

Then wrap the app in the copied `AuthProvider`, pass it your `@neon/auth` client, and render `<Auth view="signIn" />` ([basic usage](/docs/auth/about#basic-usage)). The [React quick start](/docs/auth/quick-start/react) covers the API-method version if you want your own UI, and [TanStack Router](/docs/auth/quick-start/tanstack-router) has one with components.

<Admonition type="note" title="Package names">
`@neon/neon-js` is the current name of the package previously published as `@neondatabase/neon-js` ([generate types](/docs/data-api/generate-types)). Better Auth UI replaces the deprecated `@neondatabase/auth-ui`, and apps that already use it keep working ([UI components](/docs/auth/reference/ui-components)).
</Admonition>

## When you need server logic anyway

Some things shouldn't run in a browser: a Stripe webhook, an email send, a call that needs a secret. Deploy that piece as a [Neon Function](/docs/compute/functions/overview) with `DATABASE_URL` injected and call it from the SPA. Functions are available in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), with support expanding toward [all regions](/docs/introduction/regions). Host the static bundle anywhere: Vercel, Netlify, Cloudflare Pages, or an S3 bucket.

## What it costs

The Free plan includes Auth up to 60,000 monthly active users per project, 100 CU-hours of compute per project per month, and 1 GB of storage per project, with compute scaling to zero after 5 minutes idle ([plans](/docs/introduction/plans)).

## How other options compare

- **Supabase**: the same architecture, with `supabase-js`, PostgREST, Auth, and RLS all GA ([features](https://supabase.com/docs/guides/getting-started/features)). Both make RLS the security boundary for a browser that queries tables directly. Supabase's Free plan allows 2 active projects that pause after a week of inactivity, and includes no backups ([pricing](https://supabase.com/pricing), [backups](https://supabase.com/docs/guides/platform/backups)). The built-in email sender allows 2 auth emails per hour project-wide until you connect custom SMTP ([rate limits](https://supabase.com/docs/guides/auth/rate-limits)). Auth includes 50,000 MAU on Free and 100,000 on Pro, then $0.00325 per MAU, against 60,000 per project on Neon Free and 1M per project on paid plans ([pricing](https://supabase.com/pricing), [Neon vs Supabase](/guides/neon-vs-supabase#auth)). Paid projects are dedicated instances billed hourly ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).
- **Firebase**: Firestore's client SDK talks to the database directly with security rules, as a NoSQL document store ([Firestore](https://firebase.google.com/docs/firestore)). It fits apps that need offline sync; Postgres fits apps that need relational queries.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Query Postgres from the browser" description="Enable Auth and the Data API, add an RLS policy, and call it from your React app." buttonText="Data API quickstart" buttonUrl="/docs/data-api/get-started" />
