---
title: Integrating Neon with Vercel
subtitle: Choose the right connection path in seconds
redirectFrom:
  - /docs/guides/vercel-postgres
enableTableOfContents: true
updatedOn: '2025-07-02T00:00:00.000Z'
---

## Overview

This page helps you quickly choose the best Neon–Vercel integration for your project. Whether you're starting fresh or have existing infrastructure, we'll guide you to the right solution.

<Admonition type="tip" title="Quick Start">
Most new users should start with the **Vercel-Managed Integration** for the simplest setup and unified billing. Existing Neon users can seamlessly connect with the **Neon-Managed Integration**.
</Admonition>

---

## Compare the options at a glance

| Feature / Attribute     | [Vercel-Managed Integration](/docs/guides/vercel-managed-integration)                                 | [Neon-Managed Integration](/docs/guides/neon-managed-vercel-integration)                                     | [Manual Connection](/docs/guides/vercel-manual) |
| :---------------------- | :---------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- | :---------------------------------------------- |
| **Ideal for**           | New users, teams wanting a single Vercel bill                                                         | Existing Neon users, direct Neon billing                                                                     | Integration not required or custom              |
| **Neon account**        | Created automatically via Vercel                                                                      | Pre-existing Neon account                                                                                    | Pre-existing Neon account                       |
| **Billing**             | Paid **through Vercel**                                                                               | Paid **through Neon**                                                                                        | Paid **through Neon**                           |
| **Setup method**        | Vercel Marketplace → Native Integrations → "Neon Postgres"                                            | Vercel Marketplace → Connectable Accounts → "Neon"                                                           | Manual env-vars                                 |
| **Preview Branching**   | ✅                                                                           | ✅                                                                                   | ✖️                         |
| **Setup complexity**    | Low                                                                                                   | Medium                                                                                                       | High                                            |
| **Implementation type** | [Native Integration](https://vercel.com/docs/integrations/install-an-integration/product-integration) | [Connectable Account](https://vercel.com/docs/integrations/install-an-integration/add-a-connectable-account) | N/A                                             |

### Billing considerations

- **Vercel-Managed**: Consolidated billing through Vercel.
- **Neon-Managed**: Direct access to all Neon plans and pricing, including free tier benefits.
- **Manual**: Full control but requires more setup and maintenance overhead.

---

## Choose your integration path

<Admonition type="important" title="Do you need custom CI/CD control?">
**If you want to build preview branching into your own CI/CD pipelines (e.g., via GitHub Actions)**, use **[Manual Connections](/docs/guides/vercel-manual)** instead of the automated integrations below.
</Admonition>

For automated integrations, follow this simple flow:

<Steps>

## Do you have an existing Neon account?

**Do you already have a Neon account or project you want to keep using?**

- **✅ Yes** → Use **[Neon-Managed Integration](/docs/guides/neon-managed-vercel-integration)**
- **❌ No** → Continue below

## Choose your billing preference

**Where would you like to manage billing for Neon?**

- **Through my Vercel account** → Use **[Vercel-Managed Integration](/docs/guides/vercel-managed-integration)**
- **Directly with Neon** → Use **[Neon-Managed Integration](/docs/guides/neon-managed-vercel-integration)**

</Steps>

---

## Integration options overview

<DetailIconCards>
<a href="/docs/guides/vercel-managed-integration" title="Vercel-Managed Integration" 
   description="Create and manage Neon databases directly from your Vercel dashboard. Supports preview branches." icon="vercel">Vercel-Managed Integration</a>
<a href="/docs/guides/neon-managed-vercel-integration" title="Neon-Managed Integration" 
   description="Ideal for existing Neon users. Keep your current account and billing." icon="neon">Neon-Managed Integration</a>
<a href="/docs/guides/vercel-manual" title="Manual Connections" 
   description="Connect your Vercel project to a Neon database manually." icon="gear">Manual Connections</a>
</DetailIconCards>

<Admonition type="info">
All three options support preview branching, the main differences are in setup complexity and billing management.
</Admonition>

---

## Next steps

<CheckList title="Get Started Checklist">

<CheckItem title="Choose your integration type">
  Select Vercel-Managed, Neon-Managed, or Manual based on the decision flow above
</CheckItem>

<CheckItem title="Follow the setup guide">
  Click through to your chosen integration's detailed documentation
</CheckItem>

<CheckItem title="Configure preview branching">
  Set up database branching for your development workflow
</CheckItem>

<CheckItem title="Test your connection">
  Verify your database connection works in both production and preview environments
</CheckItem>

</CheckList>

<NeedHelp/>
