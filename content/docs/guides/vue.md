---
title: Connect a Vue.js application to Neon
subtitle: Connect a Vue.js app to Lakebase Postgres on Neon from the server side with Nuxt
summary: >-
  To connect a Vue.js app to Lakebase Postgres on Neon, run your database queries on
  the server, because the database can't be queried directly from the browser. Use
  a Vue meta-framework such as Nuxt, which has a guide linked here, and expose the
  data to your Vue frontend.
enableTableOfContents: true
updatedOn: '2026-11-27T01:39:33.820Z'
---

Vue.js is a progressive JavaScript framework for building user interfaces.

Connect to Lakebase Postgres from the server side of a Vue.js application, never from the browser. A Vue meta-framework such as Nuxt runs your queries on the server.

## Vue meta-frameworks

<TechCards>

<a href="/docs/guides/nuxt" title="Nuxt" description="Connect a Nuxt app to Lakebase Postgres on Neon" icon="nuxt"></a>

</TechCards>

## Vue apps without a server

A Vue app built with Vite and no meta-framework runs only in the browser. To give it a backend that queries the database, deploy an API on Neon Functions: see [Add a backend API to a frontend app](/docs/compute/functions/frontend-api).

## Next steps

- [Managed Better Auth](/docs/auth/overview): Sign-up, sign-in, and sessions stored in your database.
- [Object Storage](/docs/storage/overview): S3-compatible buckets for uploads and files.
- [AI Gateway](/docs/ai-gateway/overview): One credential for models from Anthropic, OpenAI, Google, and more.
- [Neon Functions](/docs/compute/functions/overview): Long-running Node.js compute next to your database.
- [Realtime](/docs/realtime/overview) (beta): Live SQL query subscriptions.

<NeedHelp/>
