---
title: Neon and Vercel overview
subtitle: Learn about different ways you can integrate Neon and Vercel
redirectFrom:
  - /docs/guides/vercel-postgres
enableTableOfContents: true
isDraft: false
updatedOn: '2024-06-14T07:55:54.409Z'
---

## Installing Neon Postgres from the Vercel Marketplace

If you're a Vercel customer and want to install the native Neon Postgres integration from the Vercel Marketplace, these docs are for you.

<DetailIconCards>

<a href="/docs/guides/vercel-marketplace" description="Learn how to install Neon from the Vercel Marketplace" icon="check">Install Neon Postgres from the Vercel Marketplace</a>

</DetailIconCards>

## Install the Neon Postgres Previews integration

If you're a Neon customer, you can install the Neon Postgres Previews integration to create a Neon branch with every preview deployment. The integration connects your Vercel project to a Neon database and uses Neon's branching capability to create a database branch for each preview deployment.

<DetailIconCards>

<a href="(/docs/guides/vercel" description="Learn how to setup the Neon Vercel Postgres Preview Integration for a database branch with every deployment preview" icon="check">Neon Postgres Previews Integration</a>

</DetailIconCards>

## Transitioning to Neon from Vercel Postgres?

If you're transitioning from Vercel Postgres to Neon, welcome. We're glad you're here. We've prepared a transition guide to answer questions you might have and get you started with Neon. We've also put together a guide for transitioning from the Vercel SDK to the Neon serverless driver, and we've provided a copy of the Vercel Postgres docs, which we'll keep for a while for your reference while you make the transition.

<Admonition type="note" title="Did you know">
**The Vercel SDK is a wrapper around the the Neon serverless driver.** There's no need to switch immediately. The Vercel SDK will continue to work for the forseeable future, but if you would like to user the Neon serverless driver directly (maintained by Neon), please refer to our migration guide for instructions.
</Admonition>

<DetailIconCards>

<a href="/docs/guides/vercel-postgres-transition-guide" description="Everything you need to know about transitioning from Vercel Postgres to Neon" icon="check">Vercel Postgres Transition Guide</a>

<a href="/docs/guides/vercel-sdk-migration-guide" description="Learn how to migrate from the Vercel SDK to the Neon Serverless driver" icon="check">Migrating from the Vercel SDK</a>

<a href="/docs/guides/vercel-postgres-docs" description="Find a copy of the Vercel Postgres docs for your reference while you transition" icon="check">Vercel Postgres docs</a>

</DetailIconCards>

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
