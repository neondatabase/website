---
title: Neon and Vercel overview
subtitle: Learn about different ways you can integrate Neon with Vercel
redirectFrom:
  - /docs/guides/vercel-postgres
enableTableOfContents: true
isDraft: false
updatedOn: '2024-06-14T07:55:54.409Z'
---

There are a few different ways you can integrate Neon with Vercel.

## Are you transitioning from Vercel Postgres?

If you're transitioning from Vercel Postgres to Neon, welcome! We're glad you're here. We've prepared a transition guide to answer questions you might have and get you started with Neon. We've also put together a guide for transitioning from the Vercel SDK to the Neon serverless driver, and we've provided a copy of the Vercel Postgres docs, which we'll keep for a while for your reference while you make the transition.

  <Admonition type="important">
  **Starting in November, 2024, Vercel will transition Vercel Postgres projects to a Neon Postgres Native Integration**. Until November, you can continue using Vercel Postgres as usual. Neon is currently working out a detailed transition process and timeline in partnership with the Vercel team. The transition will follow the principles outlined below:

  - Zero downtime without infrastructure changes so there's no impact on user applications
  - Integrated billing in Vercel
  - Access to all Neon features and plans

  No action is required on your part. The transition to the native integration will be performed for you.

  After the transition, you will be able to manage existing databases via the native Neon Postgres integration, accessible from the Storage tab in the Vercel Dashboard and from the Neon Console. 

  To learn more, please refer to the [Vercel announcement](https://vercel.com/blog/introducing-the-vercel-marketplace) and the [Neon announcement](https://neon.tech/blog/leveling-up-our-partnership-with-vercel).
  </Admonition>

<DetailIconCards>

<a href="/docs/guides/vercel-postgres-transition-guide" description="Everything you need to know about transitioning from Vercel Postgres to Neon" icon="vercel">Vercel Postgres Transition Guide</a>

<a href="/docs/guides/vercel-sdk-migration-guide" description="Learn how to migrate from the Vercel SDK to the Neon serverless driver" icon="vercel">Migrating from the Vercel SDK</a>

<a href="/docs/guides/vercel-postgres-docs" description="Find a copy of the Vercel Postgres docs for your reference while you transition" icon="vercel">Vercel Postgres docs</a>

</DetailIconCards>

## Add the Neon Postgres Native Integration

This integration is intended for Vercel users who want to add Neon Postgres to their Vercel project as native storage solution. **Neon Postgres Native Integration**: A first-party Vercel storage integration. This integration creates a Neon Postgres account for you. You get access to Neon features and plans. Billing is managed through Vercel.

<DetailIconCards>

<a href="/docs/guides/vercel-native-integration" description="Learn how to install the Install the Native Neon Postgres Integration from the Vercel Marketplace" icon="vercel">Native Neon Postgres Integration</a>

</DetailIconCards>

## Add the Neon Postgres Previews Integration

This integration is intended for existing Neon users who want to use Vercel for for preview deployments. **Neon Postgres Previews Integration**: A connectable account integration for existing Neon Postgres users that connects your Vercel project to a Neon database and creates a database branch with every preview deployment.

You can find the Neon Postgres Previews Integration on the [Vercel Integration Marketplace](https://vercel.com/integrations/neon). The integration connects your Vercel project to a Neon database and uses Neon's branching capability to create a database branch for each preview deployment.

<DetailIconCards>

<a href="/docs/guides/vercel-previews-integration" description="Learn how to install the Neon Postgres Preview Integration for a database branch with each preview deployment" icon="vercel">Neon Postgres Previews Integration</a>

</DetailIconCards>

## Connect your Vercel project to Neon manually (no integration)

If you're not interested in an integration, this method simply involves setting Vercel environment variables to connect your Vercel Project to your Neon database. See [Connect Vercel and Neon manually](/docs/guides/vercel-manual).



## Resources for working with Neon and Vercel
  
- [The Neon serverless driver](/docs/serverless/serverless-driver)

  The Neon serverless driver allows you to query data from [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions) and is a drop-in replacement for [node-postgres](https://node-postgres.com/), the popular npm `pg` package.
