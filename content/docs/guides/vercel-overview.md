---
title: Neon and Vercel overview
subtitle: Learn about different options for integrating Neon with Vercel
redirectFrom:
  - /docs/guides/vercel-postgres
enableTableOfContents: true
isDraft: false
updatedOn: '2024-11-25T13:41:05.634Z'
---

Neon supports different options for integrating Neon and Vercel, including a native integration that you can install from the Vercel Marketplace, a "previews integration" that creates a database branch with every pull request, and a manual setup option. If you're currently a Vercel Postgres user, you'll also find information below about the upcoming transition from Vercel Postgres to Neon.

## Option 1: Add the Native Integration on Vercel

This integration is intended for Vercel users who want to add Neon Postgres to their Vercel project as a [first-party native integration](https://vercel.com/docs/integrations/install-an-integration/product-integration). The integration creates a Neon Postgres account for you if you do not have one. You get access to Neon features and plans. **Billing is managed through Vercel**.

<DetailIconCards>

<a href="/docs/guides/vercel-native-integration" description="Learn how to install the Neon Postgres Native Integration from the Vercel Marketplace" icon="vercel">Vercel Native Integration</a>

</DetailIconCards>

## Option 2: Add the Postgres Previews Integration

This integration is intended for users who are registered with Neon directly. The **Postgres Previews Integration** is a [connectable account integration](https://vercel.com/docs/integrations/install-an-integration/add-a-connectable-account#manage-connectable-accounts) that connects your Vercel project to a Neon database and creates a database branch with each Vercel preview deployment.

<DetailIconCards>

<a href="/docs/guides/vercel-previews-integration" description="Learn how to install the Neon Postgres Preview Integration for a database branch with each preview deployment" icon="vercel">Neon Previews Integration</a>

</DetailIconCards>

## Option 3: Connect your Vercel project to Neon manually (no integration)

This setup simply involves setting environment variables in Vercel to connect your Vercel Project to your Neon database.

<DetailIconCards>

<a href="/docs/guides/vercel-manual" description="Connect your Vercel project to Neon manually (no integration)" icon="vercel">Connect Vercel and Neon manually</a>

</DetailIconCards>

## Transitioning from Vercel Postgres?

  <Admonition type="important">
  **Starting in Q4, 2024, Vercel will transition Vercel Postgres stores to the Native Vercel Integration for Neon Postgres**. Until November, you can continue using Vercel Postgres as usual. The transition will follow the principles outlined below:

- Zero downtime, so there's no impact on user applications
- Integrated billing in Vercel
- Access to all Neon features and plans

No action is required on your part. Vercel will perform the transition for you.

After the transition, you will be able to manage your databases via the Native Vercel Integration from the **Storage** tab on your Vercel Dashboard. You will also be able to access your databases from the Neon Console.

To learn more, please refer to the [Vercel announcement](https://vercel.com/blog/introducing-the-vercel-marketplace) and the [Neon announcement](https://neon.tech/blog/leveling-up-our-partnership-with-vercel).
</Admonition>

If you're transitioning from Vercel Postgres to Neon, welcome! We're glad you're here. We've prepared a **transition guide** to answer questions and help you get started.

<DetailIconCards>

<a href="/docs/guides/vercel-postgres-transition-guide" description="Everything you need to know about transitioning from Vercel Postgres to Neon" icon="vercel">Vercel Postgres Transition Guide</a>

<a href="https://neon.tech/guides/vercel-sdk-migration" description="Learn how to migrate from the Vercel SDK to the Neon serverless driver" icon="vercel">Migrating from the Vercel SDK</a>

</DetailIconCards>
