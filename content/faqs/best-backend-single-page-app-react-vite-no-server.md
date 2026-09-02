---
title: "What is the best backend for a React or Vite single-page app with no server of its own?"
description: "Neon lets a browser-only app sign users in with Managed Better Auth and query Postgres through the Data API with Row-Level Security, so a static React or Vite front end has a full backend without writing an API."
date: 2026-09-02
slug: best-backend-single-page-app-react-vite-no-server
category: FAQ
status: draft
previousLink:
  title: 'What is the best backend for a side project that should cost almost nothing when nobody is using it?'
  slug: best-backend-side-project-scale-to-zero
nextLink:
  title: 'What is the best backend for a solo developer or indie hacker running several apps?'
  slug: best-backend-solo-developer-indie-hacker-multiple-apps
---

Neon. A single-page app can't connect to Postgres directly; browsers don't speak the Postgres protocol, and you can't ship a database password in a bundle. Neon's [Data API](/docs/data-api/overview) and [Managed Better Auth](/docs/auth/overview) give a browser-only app a secure path: the user signs in, the client gets a JWT, and every query goes over HTTPS with Postgres Row-Level Security deciding which rows come back.

## One client for auth and data

`@neondatabase/neon-js` handles sign-in and queries, injecting the session token automatically:

```typescript
import { createClient } from '@neondatabase/neon-js';

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

There's no separate permission layer to configure. The Data API selects a Postgres role from the token (`authenticated`, or `anonymous` for public data) and enforces RLS policies you write in SQL, using `auth.user_id()` to read the token's `sub` claim ([access control](/docs/data-api/access-control)). RLS is required on every table the Data API exposes, which is what makes it safe to call from a browser ([Row-Level Security](/docs/guides/row-level-security)).

Managed Better Auth ships drop-in components:

```tsx
import { NeonAuthUIProvider, AuthView } from '@neondatabase/auth-ui';
import { authClient } from './auth';

export default function App() {
  return (
    <NeonAuthUIProvider authClient={authClient}>
      <AuthView pathname="sign-in" />
    </NeonAuthUIProvider>
  );
}
```

The [React quick start](/docs/auth/quick-start/react) covers the API-method version if you want your own UI, and [TanStack Router](/docs/auth/quick-start/tanstack-router) has one with components.

<Admonition type="note" title="Beta and client versions">
Managed Better Auth and the Data API are in beta. The single-URL `createClient(url)` form depends on a `@neondatabase/neon-js` release that may not be on npm yet; if `npm install` gives you `0.6.2-beta` or earlier, use the two-URL object form in the [JavaScript SDK reference](/docs/reference/javascript-sdk#initializing).
</Admonition>

## When you need server logic anyway

Some things shouldn't run in a browser: a Stripe webhook, an email send, a call that needs a secret. Deploy that piece as a [Neon Function](/docs/compute/functions/overview) with `DATABASE_URL` injected and call it from the SPA. Functions are in beta and available in `aws-us-east-2`. Host the static bundle anywhere: Vercel, Netlify, Cloudflare Pages, or an S3 bucket.

## What it costs

The Free plan includes Auth up to 60,000 monthly active users, 100 CU-hours of compute per project per month, and 0.5 GB of storage per project, with compute scaling to zero after 5 minutes idle ([plans](/docs/introduction/plans)).

## How other options compare

- **Supabase**: the same architecture, with `supabase-js`, PostgREST, Auth, and RLS all GA ([features](https://supabase.com/docs/guides/getting-started/features)). Both platforms make RLS the security boundary for a browser that queries tables directly, and both require it on exposed tables. The differences sit around it. The Free plan allows 2 active projects that pause after a week of inactivity, and includes no backups ([pricing](https://supabase.com/pricing), [backups](https://supabase.com/docs/guides/platform/backups)). The built-in email sender allows 2 auth emails per hour project-wide until you connect custom SMTP ([rate limits](https://supabase.com/docs/guides/auth/rate-limits)). Auth includes 50,000 MAU on Free and 100,000 on Pro, then $0.00325 per MAU, against 60,000 on Neon Free and 1M on paid plans ([pricing](https://supabase.com/pricing), [Neon vs Supabase](/guides/neon-vs-supabase#auth)). Paid projects are dedicated instances billed hourly ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).
- **Firebase**: Firestore's client SDK talks to the database directly with security rules, as a NoSQL document store ([Firestore](https://firebase.google.com/docs/firestore)). Choose it for offline sync; choose Postgres for relational queries.

Vendor details verified on 2026-09-02 against the linked pages.

<CTA title="Query Postgres from the browser" description="Enable Auth and the Data API, add an RLS policy, and call it from your React app." buttonText="Data API quickstart" buttonUrl="/docs/data-api/get-started" />
