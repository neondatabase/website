---
title: Neon and Vercel overview
subtitle: Learn about different options for integrating Neon with Vercel
redirectFrom:
  - /docs/guides/vercel-postgres
enableTableOfContents: true
isDraft: false
updatedOn: '2025-02-20T02:00:36.061Z'
---

Neon supports different options for integrating Neon and Vercel, including a native integration that you can install from the Vercel Marketplace, a "previews integration" that creates a database branch with every pull request, and a manual setup option. If you're currently a Vercel Postgres user, you'll also find information below about the upcoming transition from Vercel Postgres to Neon.

## Option 1: Add the Native Integration on Vercel

This integration is intended for Vercel users who want to add Neon Postgres to their Vercel project as a [first-party native integration](https://vercel.com/docs/integrations/install-an-integration/product-integration). The integration creates a Neon Postgres account for you if you do not have one. You get access to Neon features and plans. **Billing is managed through Vercel**. The integration also supports automatic creation of a database branch with each Vercel preview deployment so that you can preview application and database changes together without impacting your production database.

<DetailIconCards>

<a href="/docs/guides/vercel-native-integration" description="Learn how to install the Neon Postgres Native Integration from the Vercel Marketplace" icon="vercel">Vercel Native Integration</a>

<a href="/docs/guides/vercel-native-integration-previews" description="Create a database branch for every preview deployment with the Neon Postgres Native Integration" icon="vercel">Preview deployments</a>

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
**Vercel has now completed transitioning almost all Vercel Postgres stores to the Native Vercel Integration for Neon Postgres.**

You can now manage your databases via the Native Vercel Integration from the **Storage** tab on your Vercel Dashboard and in the Neon Console.
</Admonition>

For those who have transitioned from Vercel Postgres to Neon, welcome! We're glad you're here. We've prepared a **transition guide** to answer questions and help you get started.

<DetailIconCards>

<a href="/docs/guides/vercel-postgres-transition-guide" description="Everything you need to know about transitioning from Vercel Postgres to Neon" icon="vercel">Vercel Postgres Transition Guide</a>

</DetailIconCards>
