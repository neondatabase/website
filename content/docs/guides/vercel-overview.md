---
title: Vercel with Neon overview
subtitle: Learn about integrating Neon and Vercel
enableTableOfContents: true
isDraft: true
---

Neon supports several options for integrating with Vercel:

- Connect your Vercel project to Neon manually. This method simply requires setting Vercel environment variables to point to your Neon database. For instructions, see [Connect Vercel and Neon manually](../vercel-manual).
- Use the [Neon Vercel Integration](https://vercel.com/integrations/neon) from the Vercel Integration Marketplace. The integration connects your Vercel project to a Neon database and uses Neon's branching capability to create a database branch for each preview deployment. To learn more, see [Connect with the Neon Vercel integration](../vercel).
- Use the [Neon serverless driver](https://github.com/neondatabase/serverless) to query data from [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions). The driver is a drop-in replacement for [node-postgres](https://node-postgres.com/), the popular npm `pg` package that you may already be familiar with. For more information, see [Neon serverless driver](../serverless/serverless-driver).
- Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres), which is serverless Postgres **powered by Neon**. This option allows you to seamlessly create and manage a serverless Postgres instance from the Vercel dashboard. A Neon account is not required. For more information, refer to the brief [Vercel Postgres introduction](../vercel-postgres) in the Neon documentation, which provides links to the relevant information and resources on the Vercel site.
