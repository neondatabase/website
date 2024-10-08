---
title: Neon and Vercel overview
subtitle: Learn about different ways you can integrate Neon and Vercel
redirectFrom:
  - /docs/guides/vercel-postgres
enableTableOfContents: true
isDraft: false
updatedOn: '2024-06-14T07:55:54.409Z'
---

Neon supports several options for integrating with Vercel:

- [The Neon Vercel Integration](/docs/guides/vercel)

  You can find the Neon Vercel Integration on the [Vercel Integration Marketplace](https://vercel.com/integrations/neon). The integration connects your Vercel project to a Neon database and uses Neon's branching capability to create a database branch for each preview deployment.

- [Connect Vercel and Neon manually](/docs/guides/vercel-manual)

  This method involves setting Vercel environment variables to connect your Vercel Project to your Neon database.

- [The Neon serverless driver](/docs/serverless/serverless-driver)

  The Neon serverless driver allows you to query data from [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions) and is a drop-in replacement for [node-postgres](https://node-postgres.com/), the popular npm `pg` package.

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

  Vercel Postgres is serverless Postgres **powered by Neon**. This integration allows you to create and manage a Postgres instance from the Vercel dashboard.

  <Admonition type="important">
  **Starting in November 2024, Vercel Postgres projects will be transitioned to Neon**. Until November, you can continue using Vercel Postgres as usual. Neon is currently working out a detailed transition process and timeline in partnership with the Vercel team. The transition will follow the principles outlined below:

  - Zero downtime without infrastructure changes so there's no impact on user applications
  - Billing via the Vercel Marketplace
  - Full access to Neon features and plans

  No action is required on your part. The transition will be performed for you.

  After the transition, you will be able to manage existing databases in the Neon Console and create new databases via a Neon integration in the Vercel Marketplace.

  To learn more, please refer to the [Vercel announcement](https://vercel.com/blog/introducing-the-vercel-marketplace) and the [Neon announcement](https://neon.tech/blog/leveling-up-our-partnership-with-vercel).
  </Admonition>
