---
title: Connect a React application to Neon
subtitle: Choose a React framework and connect its server side to Lakebase Postgres on Neon
summary: >-
  To connect a React app to Lakebase Postgres on Neon, use the server-side guide for
  your framework: Next.js, React Router, TanStack Start, RedwoodSDK, or Remix (v2).
  Browser code can't query Lakebase Postgres directly, so the connection belongs on
  the server. Managed Better Auth quick starts for Next.js and TanStack Router are
  linked here too.
enableTableOfContents: true
updatedOn: '2026-11-20T21:29:59.067Z'
---

React is an open-source JavaScript library for building component-based user interfaces.

Connect to Lakebase Postgres from the server side of a React application, never from the browser. Each React framework below has a guide for configuring a server-side connection.

## React frameworks

<TechCards>

<a href="/docs/guides/nextjs" title="Next.js" description="Connect a Next.js app to Lakebase Postgres on Neon" icon="next-js"></a>

<a href="/docs/guides/react-router" title="React Router" description="Connect a React Router app to Lakebase Postgres on Neon" icon="react"></a>

<a href="/docs/guides/tanstack-start" title="TanStack Start" description="Connect a TanStack Start app to Lakebase Postgres on Neon" icon="tanstack"></a>

<a href="/docs/guides/redwoodsdk" title="RedwoodSDK" description="Connect a RedwoodSDK app to Lakebase Postgres on Neon" icon="redwoodsdk"></a>

<a href="/docs/guides/remix" title="Remix" description="Connect an existing Remix v2 app to Lakebase Postgres on Neon" icon="remix"></a>

</TechCards>

## Managed Better Auth

After you connect your database, add managed authentication with [Managed Better Auth](/docs/auth/overview). Quick starts are available for these React frameworks:

<TechCards>

<a href="/docs/auth/quick-start/nextjs-api-only" title="Next.js" description="Set up Managed Better Auth with Next.js" icon="next-js"></a>

<a href="/docs/auth/quick-start/tanstack-router" title="TanStack Router" description="Set up Managed Better Auth with TanStack Router" icon="tanstack"></a>

</TechCards>

For a client-only React app built with Vite, follow the [React quick start](/docs/auth/quick-start/react).

## Next steps

- [Managed Better Auth](/docs/auth/overview): Sign-up, sign-in, and sessions stored in your database.
- [Object Storage](/docs/storage/overview): S3-compatible buckets for uploads and files.
- [AI Gateway](/docs/ai-gateway/overview): One credential for models from Anthropic, OpenAI, Google, and more.
- [Neon Functions](/docs/compute/functions/overview): Long-running Node.js compute next to your database.
- [Realtime](/docs/realtime/sdks/typescript/react) (beta): Live SQL query subscriptions.

<NeedHelp/>
