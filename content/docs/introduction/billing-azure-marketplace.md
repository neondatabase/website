---
title: Azure Marketplace
enableTableOfContents: true
subtitle: Neon as an Azure Native Service offers unified billing through Azure
  Marketplace
summary: >-
  Covers the setup of Neon as an Azure Native Service, detailing pricing plans,
  billing through Azure Marketplace, and the transition from deprecated
  Azure-managed organizations to Neon-managed organizations.
updatedOn: '2026-02-06T22:07:33.085Z'
---

<Admonition type="important" title="deprecated">
The Neon Azure Native Integration is deprecated and reaches end of life on **January 31, 2026**. After this date, Azure-managed organizations will no longer be available. [Transfer your projects to a Neon-managed organization](/docs/import/migrate-from-azure-native) to continue using Neon.
</Admonition>

<InfoBlock>

<DocsList title="What you will learn:">
<p>About Neon pricing plans and billing on Azure</p>
<p>About Microsoft Azure Consumption Commitment (MACC) support</p>
<p>How to change your plan</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="/docs/manage/azure">Neon on Azure</a>
  <a href="/docs/azure/azure-deploy">Deploying Neon on Azure</a>
</DocsList>

</InfoBlock>

To get started, see [Deploying Neon on Azure](/docs/azure/azure-deploy).

## Neon pricing plans and overages

Neon pricing plans include allowances for compute, storage, and projects. If you exceed these allowances on a paid plan, overage charges will apply to your monthly bill. You can track your usage on the **Billing** page in the Neon Console. For guidance, see [Monitoring Billing](/docs/introduction/monitor-usage).

<Admonition type="note">
Azure Marketplace users are currently on legacy Neon plans. Neon's latest [pricing plans](/docs/introduction/plans) will be introduced on Azure at a later date.
</Admonition>

## Enterprise plan support on Azure

Neon's **Enterprise Plan** is designed for large teams with unique requirements that aren't covered by Neon's self-serve plans. For details, see the [Enterprise Plan](/docs/introduction/plans#enterprise). To explore this option, contact our [Sales](/contact-sales) team to discuss a custom private offer available through the Azure Marketplace.

## Microsoft Azure Consumption Commitment (MACC)

As an Azure Benefit Eligible partner on Azure Marketplace, Neon Postgres purchases made through the Azure Marketplace contribute towards your Microsoft Azure Consumption Commitment (MACC). This means that any spending on Neon Postgres through Azure Marketplace will help fulfill your organization's committed Azure spend.

### How it works

- When you purchase Neon Postgres via Azure Marketplace, the cost is billed through your Microsoft Azure subscription.
- These charges are eligible to count toward your MACC, helping you maximize your existing commitment to Azure.
- There are no additional steps required—your eligible Neon Postgres spend is automatically applied to your MACC.

For more details on how MACC applies to marketplace purchases, see [Microsoft's documentation on MACC](https://learn.microsoft.com/en-us/marketplace/azure-consumption-commitment-benefit)

## Changing your pricing plan

Changing the Neon pricing plan for an Azure subscription involves the following steps:

1. Navigate to the [Azure portal](https://portal.azure.com/) and sign in.
2. Locate your Neon Serverless Postgres resource by searching for it at the top of the page or locating it under **Resources** or **Navigate** > **All resources**.
3. Select your Neon resource to open the **Overview** page.
4. Select the **Change Plan** tab. This will open the **Change Plan** drawer where you can select from available Neon plans. A description of what's included in each plan is provided in the **Description** column in the drawer, but for more information about Neon plans, please visit our [Pricing](/pricing) page.

   ![Azure change plan](/docs/introduction/azure_change_plan.png)

5. Click **Change Plan** to complete the plan change.

## Stop billing on Azure

To stop billing for Neon on Azure, you can remove your Neon resource. For instructions, see [Deleting a Neon resource in Azure](/docs/azure/azure-manage#deleting-a-neon-resource-in-azure).

## Questions?

If you have questions or need further guidance regarding billing through Azure Marketplace, please [reach out to us](/contact-sales).
