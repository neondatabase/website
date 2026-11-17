---
title: Neon is Now Available as an Azure Native Integration
description: Deploy Neon databases from the Azure Portal
excerpt: >-
  Our collaboration with Microsoft continues to grow. Last August, we announced
  a strategic investment from M12, Microsoft’s venture fund, with a goal to
  bring Neon closer into the Azure ecosystem. Today, we’re excited to introduce
  Neon as an Azure Native Integration, allowing deve...
date: '2024-12-03T17:28:17'
updatedOn: '2026-11-06T12:00:00.000Z'
category: company
categories:
  - company
authors:
  - nikita-shamgunov
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-is-now-available-as-an-azure-native-integration/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Neon is Now Available as an Azure Native Integration - Neon
  description: >-
    Neon's December 2024 Azure Native Integration launch. Neon Azure regions are now deprecated; see neon.com/docs/import/azure-regions-deprecation.
  keywords: []
  noindex: false
  ogTitle: Neon is Now Available as an Azure Native Integration - Neon
  ogDescription: >-
    Neon's December 2024 Azure Native Integration launch. Neon Azure regions are now deprecated; see neon.com/docs/import/azure-regions-deprecation.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-is-now-available-as-an-azure-native-integration/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/neon-is-now-available-as-an-azure-native-integration/neon-azure-1-3-1024x576-d3c56f8d.jpg)

<Admonition type="important" title="Neon Azure regions are deprecated">
Neon's Azure regions (`azure-eastus2`, `azure-westus3`, `azure-gwc`) were deprecated on April 7, 2026, and you can no longer create new projects in them. Active and paid projects in those regions keep running. See [Azure regions deprecation](/docs/import/azure-regions-deprecation) for your options and [regions](/docs/introduction/regions) for where you can create projects today.
</Admonition>

Our collaboration with Microsoft continues to grow. [Last August](https://neon.com/blog/neon-is-coming-to-azure), we announced a strategic investment from M12, Microsoft’s venture fund, with a goal to bring Neon closer into the Azure ecosystem. **Today, we’re excited to introduce Neon as an Azure Native Integration, allowing developers to provision databases directly from their Azure portal.**

<video autoPlay muted loop width="1576" height="1014">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/neon-is-now-available-as-an-azure-native-integration/screen-recording-2024-12-03-at-91626percente2percent80percentafam-9664673c.mov" />
</video>

This is a major win for Azure developers. If your company uses Azure, it’s now easier than ever to get started with Neon:

- Neon will be included in your Azure bill.
- You will be able to provision and manage Neon organizations directly within Azure, and you can also use the Azure CLI and SDK.
- You can access Neon using your Microsoft credentials, simplifying security and compliance.

## How Neon Completes the Postgres Options for Azure Developers

Neon’s serverless architecture is unique among Postgres services. We’re focused on adapting the Postgres experience to fit modern developer workflows by providing:

- **Instant scaling.** Neon databases automatically scale compute and memory resources according to load, eliminating the need to manage disks or worry about capacity limits.
- **Serverless-ready API for AI apps.** Agentic AI platforms like Replit use Neon as their fully automated, agent-managed database infrastructure.
- **Database branching for dev/test environments.** Teams use Neon’s branching to create ephemeral environments for development, CI/CD, and schema migrations. This agility reduces time-to-launch and keeps developers focused.

## Free Plan Also Available in Azure

We’re also including the Free plan in the Neon Native Integration. [Navigate to the Azure portal](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/neon1722366567200.neon_serverless_postgres_azure_prod?tab=overview) and create your first Neon database.
