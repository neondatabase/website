---
title: Big DX Improvements for Neon Users on Vercel
description: 'Now with automatic branch cleanup, team sync, and project transfers'
excerpt: >-
  Good news for Neon users on Vercel. We’ve shipped a few highly requested
  updates to the integration, plus a round of behind-the-scenes reliability and
  observability upgrades. Automatic Branch Cleanup Until now, Vercel-managed
  projects didn’t automatically clean up their database...
date: '2025-11-18T17:42:20'
updatedOn: '2025-11-18T18:07:21'
category: product
categories:
  - product
authors:
  - gustavo-salomao
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/big-dx-improvements-for-neon-users-on-vercel/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Big DX Improvements for Neon Users on Vercel - Neon
  description: >-
    Users managing Neon via Vercel now have automatic branch cleanup, synced
    teams, and smarter project management.
  keywords: []
  noindex: false
  ogTitle: Big DX Improvements for Neon Users on Vercel - Neon
  ogDescription: >-
    Users managing Neon via Vercel now have automatic branch cleanup, synced
    teams, and smarter project management.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/big-dx-improvements-for-neon-users-on-vercel/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/big-dx-improvements-for-neon-users-on-vercel/neon-vercel-1-1024x576-46519dcb.jpg)

Good news for [Neon users on Vercel.](https://vercel.com/marketplace/neon) We’ve shipped a few highly requested updates to the integration, plus a round of behind-the-scenes reliability and observability upgrades.

<Admonition type="important" title="Reminder: Two ways to connect Neon and Vercel">
Neon offers two types of Vercel integrations:<br />- [Vercel-Managed Integration (Native Integration via the Vercel Marketplace)](https://neon.com/docs/guides/vercel-managed-integration): You can add Neon to your Vercel project directly via the [Vercel Marketplace](https://vercel.com/marketplace/neon)**. This is the integration we’re focusing on in this post.**<br />- [Neon-Managed Integration (Connected Accounts):](https://neon.com/docs/guides/neon-managed-vercel-integration) This is for teams that prefer to keep billing on the Neon side, but still want to connect their Neon projects to Vercel (e.g. to create a branch per preview).
</Admonition>

## Automatic Branch Cleanup

Until now, Vercel-managed projects didn’t automatically clean up their database branches after preview deployments expired, leaving developers with long lists of inactive branches to remove manually. This update automates that process entirely, keeping your Neon project tidy and your storage usage lean.

<video autoPlay muted loop controls width="1860" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/big-dx-improvements-for-neon-users-on-vercel/neon-auto-delete-1-c57e5110.mp4" />
</video>

<Admonition type="note" title="Note">
[The Neon-managed integration](https://neon.com/docs/guides/neon-managed-vercel-integration) already supported automatic branch deletion based on Git branch cleanup. Now, the same convenience is also present in the Vercel-managed route.
</Admonition>

When you deploy from Vercel, each Git branch creates a corresponding Neon branch. That Neon branch stays active as long as there’s at least one deployment for that Git branch in Vercel.

- When multiple deployments exist for the same Git branch, Neon uses a single database branch for all of them.
- When the last deployment for that branch is deleted, whether manually or automatically via [Vercel’s Deployment Retention Policy,](https://vercel.com/docs/deployment-retention) Neon detects it, and deletes the corresponding branch automatically.

## Team Member Sync

When a user’s role changes or they’re removed from a Vercel team, those changes now propagate instantly to the corresponding Neon organization – a big security upgrade. Before this fix, users who left a Vercel team could still appear as members in Neon, generating confusion (and plenty of support tickets). Now, Neon continuously monitors for membership updates, ensuring both platforms stay perfectly aligned.

- When a team member’s role changes in Vercel, Neon updates their access level in the linked organization to match.
- Vercel’s roles don’t map one-to-one with Neon’s, so they’re grouped into two categories:
  - Admin: most Vercel roles (like Owner, Developer, Member) map to the Admin role in Neon
  - Member: read-only Vercel roles (like Billing or Viewer) map to Member in Neon.
- When a user is removed from a Vercel team, Neon automatically removes them from the corresponding Neon organization.

## Project Transfers

When a Vercel project connected to Neon is moved between Vercel teams, the linked Neon project now transfers automatically as well. This avoids the work of re-linking integrations when a project changes ownership inside Vercel. This is a nice upgrade for larger teams reorganizing projects as they grow or restructure.

## Asynchronous Webhook Handling

The last update isn’t visible for users, but it makes a big difference behind the scenes for us. Neon’s webhook processing for the Vercel Marketplace integration is now asynchronous, improving reliability and observability across the entire workflow.

Before this update, webhooks were handled synchronously, e.g. any delay or transient issue during processing could cause the webhook request to fail and trigger retries on Vercel’s side. That sometimes led to duplicate operations and unnecessary noise in the logs. This has also given us complete traceability across API controllers, webhook handlers, and background workers.

## Set it Up

Get started by [adding a free Neon Storage to your Vercel project](https://vercel.com/marketplace/neon) directly from the Vercel dashboard. Then [follow these steps](https://neon.com/docs/guides/vercel-managed-integration) to connect both accounts and start building.
