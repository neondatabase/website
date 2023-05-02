---
title: Vercel with Neon overview
subtitle: Learn about different ways you can integrate Neon and Vercel
enableTableOfContents: true
isDraft: true
---

Neon supports several options for integrating with Vercel:

- [Connect Vercel and Neon manually](../guides/vercel-manual). This method simply requires setting Vercel environment variables to point to your Neon database.
- [Use the Neon Vercel Integration](https://vercel.com/integrations/neon). You can find this integration on the [Vercel Integration Marketplace](https://vercel.com/integrations). The integration connects your Vercel project to a Neon database and uses Neon's branching capability to create a database branch for each preview deployment. To learn more, see [Connect with the Neon Vercel integration](../vercel).
- [Use the Neon serverless driver](https://github.com/neondatabase/serverless). The driver allows you to query data from [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions) and is a drop-in replacement for [node-postgres](https://node-postgres.com/), the popular npm `pg` package that you may already be familiar with. For more information, see [Neon serverless driver](../serverless/serverless-driver).
- [Use Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres). Vercel Postgres is serverless Postgres **powered by Neon**. This integration allows you to seamlessly create and manage a serverless Postgres instance from the Vercel dashboard. A Neon account is not required. For more information, refer to the [Vercel Postgres introduction](../guides/vercel-postgres) in the Neon documentation, which provides links to the information and resources on the Vercel site.
