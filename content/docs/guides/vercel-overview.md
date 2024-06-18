---
title: Neon and Vercel overview
subtitle: Learn about different ways you can integrate Neon and Vercel
enableTableOfContents: true
isDraft: false
updatedOn: '2024-06-14T07:55:54.409Z'
---

Neon supports several options for integrating with Vercel:

- [Vercel Postgres](/docs/guides/vercel-postgres)

  Vercel Postgres is serverless Postgres **powered by Neon**. This integration allows you to seamlessly create and manage a serverless Postgres instance from the Vercel dashboard. A Neon account is not required.

- [The Neon Vercel Integration](/docs/guides/vercel)

  You can find the Neon Vercel Integration on the [Vercel Integration Marketplace](https://vercel.com/integrations/neon). The integration connects your Vercel project to a Neon database and uses Neon's branching capability to create a database branch for each preview deployment.

- [The Neon serverless driver](/docs/serverless/serverless-driver)

  The Neon serverless driver allows you to query data from [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions) and is a drop-in replacement for [node-postgres](https://node-postgres.com/), the popular npm `pg` package.

- [Connect Vercel and Neon manually](/docs/guides/vercel-manual)

  This method involves setting Vercel environment variables to connect your Vercel Project to your Neon database.
