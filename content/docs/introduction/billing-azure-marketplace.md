---
title: Azure Marketplace
enableTableOfContents: true
subtitle: Neon as an Azure Native Service offers unified billing through Azure
  Marketplace
updatedOn: '2025-04-20T13:56:04.996Z'
---

<PublicPreview/>

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

[Neon is available on the Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/neon1722366567200.neon_serverless_postgres_azure_prod?tab=Overview) as an [Azure Native ISV Service](https://learn.microsoft.com/en-us/azure/partner-solutions/partners), allowing you to work with Neon the same way you work with other native solutions from Microsoft. Billing is handled directly through Azure, and you can choose from Neon pricing plans when setting up the integration.

To get started, see [Deploying Neon on Azure](/docs/azure/azure-deploy).

## Neon pricing plans and overages

Neon pricing plans include allowances for compute, storage, and projects. For details on each plan's allowances, see [Neon Plans](/docs/introduction/plans). If you exceed these allowances on a paid plan, overage charges will apply to your monthly bill. You can track your usage on the **Billing** page in the Neon Console. For guidance, see [Monitoring Billing](/docs/introduction/monitor-usage).

## Enterprise plan support on Azure

Neon's **Enterprise Plan** is designed for large teams with unique requirements that aren't covered by Neon's self-serve plans. For details, see the [Enterprise Plan](/docs/introduction/plans#enterprise). To explore this option, contact our [Sales](https://neon.tech/contact-sales) team to discuss a custom private offer available through the Azure Marketplace.

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
4. Select the **Change Plan** tab. This will open the **Change Plan** drawer where you can select from available Neon plans. A description of what's included in each plan is provided in the **Description** column in the drawer, but for more information about Neon plans, please visit our [Pricing](https://neon.tech/pricing) page.

   ![Azure change plan](/docs/introduction/azure_change_plan.png)

5. Click **Change Plan** to complete the plan change.

## Stop billing on Azure

To stop billing for Neon on Azure, you can remove your Neon resource. For instructions, see [Deleting a Neon resource in Azure](/docs/azure/azure-manage#deleting-a-neon-resource-in-azure).

## Questions?

If you have questions or need further guidance regarding billing through Azure Marketplace, please [reach out to us](https://neon.tech/contact-sales).
