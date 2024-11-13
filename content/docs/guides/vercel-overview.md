---
title: Neon and Vercel overview
subtitle: Learn about different ways you can integrate Neon with Vercel
redirectFrom:
  - /docs/guides/vercel-postgres
enableTableOfContents: true
isDraft: false
updatedOn: '2024-06-14T07:55:54.409Z'
---

Select one of the following options to get started get started:

- **[Transitioning from Vercel Postgres](#transitioning-from-vercel-postgres)**

  Find everything you need to know about transitioning from Vercel Postgres to Neon

- **[Add the Neon Postgres Native Integration](#add-the-neon-postgres-native-integration)**

  Choose this option if you're a Vercel user looking to add Neon Postgres as a native storage solution in Vercel

- **[Add the Neon Postgres Previews Integration](#add-the-neon-postgres-previews-integration)**

  If you're a Neon user, install this integration for an instant database branching workflow that creates a database branch for every Vercel preview deployment

- **[Connect your Vercel project to Neon manually (no integration)](#connect-your-vercel-project-to-neon-manually-no-integration)**

  Select this option for a simple, manual integration setup that connects your app to a Neon database

## Transitioning from Vercel Postgres

  <Admonition type="important">
  **Starting in November, 2024, Vercel will transition Vercel Postgres projects to a new native Vercel integration for Neon Postgres**. Until November, you can continue using Vercel Postgres as usual. The transition will follow the principles outlined below:

- Zero downtime so there's no impact on user applications
- Integrated billing in Vercel
- Access to all Neon features and plans

No action is required on your part. Vercel will perform the transition for you.

After the transition, you will be able to manage your database via the native Neon Postgres integration from the **Storage** tab on your Vercel Dashboard. You will also be able to access your databases from the Neon Console.

To learn more, please refer to the [Vercel announcement](https://vercel.com/blog/introducing-the-vercel-marketplace) and the [Neon announcement](https://neon.tech/blog/leveling-up-our-partnership-with-vercel).
</Admonition>

If you're transitioning from Vercel Postgres to Neon, welcome! We're glad you're here. We've prepared a **transition guide** to answer questions and help you get started.

<DetailIconCards>

<a href="/docs/guides/vercel-postgres-transition-guide" description="Everything you need to know about transitioning from Vercel Postgres to Neon" icon="vercel">Vercel Postgres Transition Guide</a>

<a href="https://neon.tech/guides/vercel-sdk-migration" description="Learn how to migrate from the Vercel SDK to the Neon serverless driver" icon="vercel">Migrating from the Vercel SDK</a>

</DetailIconCards>

## Add the Neon Postgres Native Integration

This integration is intended for Vercel users who want to add Neon Postgres to their Vercel project as native storage solution. The **Neon Postgres Native Integration** is a first-party Vercel storage integration. It creates a Neon Postgres account for you if you do not have one. You get access to Neon features and plans. **Billing is managed through Vercel**.

<DetailIconCards>

<a href="/docs/guides/vercel-native-integration" description="Learn how to install the Install the Native Neon Postgres Integration from the Vercel Marketplace" icon="vercel">Native Neon Postgres Integration</a>

</DetailIconCards>

## Add the Neon Postgres Previews Integration

This integration is intended for existing Neon users. The **Neon Postgres Previews Integration** is a connectable account integration that connects your Vercel project to a Neon database and creates a database branch with every Vercel preview deployment.

<DetailIconCards>

<a href="/docs/guides/vercel-previews-integration" description="Learn how to install the Neon Postgres Preview Integration for a database branch with each preview deployment" icon="vercel">Neon Postgres Previews Integration</a>

</DetailIconCards>

## Connect your Vercel project to Neon manually (no integration)

If you're not interested in an integration, this setup simply involves setting Vercel environment variables to connect your Vercel Project to your Neon database.

<DetailIconCards>

<a href="/docs/guides/vercel-previews-integration" description="Connect your Vercel project to Neon manually (no integration)" icon="vercel">Connect Vercel and Neon manually</a>

</DetailIconCards>
