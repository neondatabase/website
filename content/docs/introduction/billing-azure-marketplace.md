---
title: Azure Marketplace
enableTableOfContents: true
subtitle: Neon as an Azure Native Service with unified billing through Azure Marketplace
updatedOn: '2025-03-20T21:23:07.251Z'
---

<PublicPreview/>

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to set up the Neon native integration on Azure</p>
<p>About Neon pricing plans and overages</p>
<p>How to change your plan</p>
<p>How to delete a Neon resource on Azure</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="/docs/manage/azure">Neon on Azure (Neon Docs)</a>
  <a href="https://learn.microsoft.com/en-us/azure/partner-solutions/neon/overview">What is Neon Serverless Postgres? (Azure Docs)</a>
  <a href="https://learn.microsoft.com/en-us/azure/partner-solutions/neon/create">Create a Neon Serverless Postgres resource (Azure Docs)</a>
  <a href="https://learn.microsoft.com/en-us/azure/partner-solutions/neon/troubleshoot">Troubleshoot (Azure Docs)</a>
</DocsList>

</InfoBlock>

[Neon is available on the Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/neon1722366567200.neon_serverless_postgres_azure_prod?tab=Overview) as an [Azure Native ISV Service](https://learn.microsoft.com/en-us/azure/partner-solutions/partners), allowing you to work with Neon the same way you work with other native solutions from Microsoft. Billing is handled directly through Azure, and you can choose from Neon pricing plans when setting up the integration.

## Prerequisites for setting up the Neon integration

- **Azure account**: If you don't have an active Azure subscription, [create a free account](https://azure.microsoft.com/free).
- **Access level**: Only users with **Owner** or **Contributor** access roles on the Azure subscription can set up the integration. Ensure you have the appropriate access before proceeding. For information about assigning roles in Azure, see [Steps to assign an Azure role](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-steps).

## Find Neon on Azure and subscribe

1. Use the search bar at the top of the [Azure portal](https://portal.azure.com/) to find the **Neon Serverless Postgres** offering.

   ![Search for Neon in the Azure Portal](/docs/introduction/azure_search_neon.png)

   Alternatively, go to the [Azure Marketplace](https://portal.azure.com/#view/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/home) and search for **Neon Serverless Postgres**.

2. Subscribe to the service. You will be directed to the [Create a Neon Serverless Postgres Resource](#create-a-neon-resource) page.

## Create a Neon Resource

1. On the **Create a Neon Serverless Postgres Resource** page, enter values for the properties described below.

   | Property                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Subscription**           | From the drop-down, select an Azure subscription where you have Owner or Contributor access.                                                                                                                                                                                                                                                                                                                                                                 |
   | **Resource group**         | Select an existing Azure resource group or create a new one. A resource group is like a container or a folder used to organize and manage resources in Azure. For more information, see [Azure Resource Group overview](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview).                                                                                                                                                 |
   | **Resource Name**          | Enter a name for the Azure resource representing your Neon organization. This name is used only in Azure.                                                                                                                                                                                                                                                                                                                                                    |
   | **Region**                 | Select a region to deploy your Azure resource. This is the region for your Azure resource, not for your Neon projects and data. Neon will let you select from [supported regions](/docs/introduction/regions#azure-regions) when you create a Neon project, which you'll do after setting up the Neon resource in Azure. For example, you can create a Neon resource in the (US) West US 3 region and create a Neon project (Europe) Germany West Central |
   | **Neon Organization name** | Provide a name for your [Neon Organization](/docs/reference/glossary#organization), such as a team name or company name. The name you specify will be your [Organization](/docs/reference/glossary#organization) name in the Neon Console. Your Neon projects will reside in this named organization.                                                                                                                                                        |
   | **Plan**                   | Select a plan. You have three to choose from: **Free**, **Scale**, and **Business**. Select **Change Plan** to view details about each plan. For more information about Neon's plans, please refer to the [Neon Pricing](https://neon.tech/home) page. The Neon **Launch Plan** is currently not available in the Azure Marketplace.                                                                                                                         |
   | **Billing term**           | Select a billing term for the selected plan. You can choose from a **1-Month** or a **1-Year** billing term (monthly or yearly billing).                                                                                                                                                                                                                                                                                                                     |

   ![Create a resource group](/docs/introduction/azure_create_resource_group.png)

1. Review your **Price + Payment options** and **Subtotal**, select **Next**.
1. On the **Project** page, enter a name for your Neon project, select a Postgres version, specify a name for your database, and choose a region. We recommend selecting the region closest to your application. 

   ![Create project in Azure](/docs/introduction/azure_create_project.png)

1. Click **Next**.
1. Optionally specify tags for your resource, then click **Next**. For more about tags, see [Use tags to organize your Azure resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources).
1. On the **Review + Create** page, review your selections, the [Azure Marketplace Terms](https://learn.microsoft.com/en-us/legal/marketplace/marketplace-terms), and the Neon [Terms of Use](https://neon.tech/terms-of-service) and [Privacy Policy](https://neon.tech/privacy-policy).
1. Select **Create** to initiate the resource deployment, which may take a few moments.
1. When your deployment is complete, click the **Go to resource** button under **Next steps** to view your new Neon resource.

   ![Go to resource button](/docs/introduction/azure_go_to_resource.png)

1. Select the **Go to Neon** link under **Getting started** to open the Neon Console.

   ![Azure get started](/docs/introduction/azure_get_started.png)

   You will be directed to the Neon Console where you can start working with your newly created Neon organization and project.

   <Admonition type="note">
   A Neon Organization created via the Azure portal supports creating Neon projects in Azure regions only.
   </Admonition>

   ![Project page in Neon](/docs/introduction/azure_neon_project_page.png)

1. From here, you can follow the [Neon Getting Started](/docs/get-started-with-neon/signing-up) to start working with your Neon project and familiarizing yourself with the Neon platform.

## Creating additional Neon projects

All Neon plans, including the Free plan, support multiple Neon projects. You can add Neon projects to an existing Neon resource from the **Projects** page in Azure or from the Neon Console.

In Azure, navigate to the **Projects** page and select **Create Project**.

![Project page in Neon](/docs/introduction/azure_project_form.png)

See [Create a project](/docs/manage/projects#create-a-project) for how to create a project from the Neon Console.

## Neon pricing plans and overages

Neon pricing plans include allowances for compute, storage, and projects. For details on each plan's allowances, see [Neon Plans](/docs/introduction/plans). If you exceed these allowances on a paid plan, overage charges will apply to your monthly bill. You can track your usage on the **Billing** page in the Neon Console. For guidance, see [Monitoring Billing](/docs/introduction/monitor-usage).

## Microsoft Azure Consumption Commitment (MACC)

As an Azure Benefit Eligible partner on Azure Marketplace, Neon Postgres purchases made through the Azure Marketplace contribute towards your Microsoft Azure Consumption Commitment (MACC). This means that any spending on Neon Postgres through Azure Marketplace will help fulfill your organization's committed Azure spend.

### How it works

- When you purchase Neon Postgres via Azure Marketplace, the cost is billed through your Microsoft Azure subscription.
- These charges are eligible to count toward your MACC, helping you maximize your existing commitment to Azure.
- There are no additional steps required—your eligible Neon Postgres spend is automatically applied to your MACC.

For more details on how MACC applies to marketplace purchases, see [Microsoft's documentation on MACC](https://learn.microsoft.com/en-us/marketplace/azure-consumption-commitment-benefit).

## Transfer existing Neon projects to an Azure-created Neon organization

You can transfer existing Neon projects to an Azure-created organization, but note these restrictions:

- The Neon project must belong to a personal Neon account, not an organization. Transfers between organizations are not yet supported.
- The Neon project must be in an [Azure region](/docs/introduction/regions#azure-regions). Azure-created Neon organizations do not support projects created in [AWS regions](/docs/introduction/regions#aws-regions).
- The billing plan of the Azure-managed organization must match or exceed the billing plan of the personal Neon account you are transferring projects from. For example, attempting to transfer projects from a Scale plan personal account to a Free plan organization will result in an error.

For detailed transfer steps, see [Transfer projects to an organization](/docs/manage/orgs-project-transfer).

If the restrictions above prevent you from transferring your project, consider these options:

- Open a [support ticket](https://console.neon.tech/app/projects?modal=support) for assistance with transferring your Neon project (supported only for projects that reside in [Azure regions](/docs/introduction/regions#azure-regions)). If you're on the Neon Free Plan and can't open a support ticket, you can email Neon support at `support@neon.tech`.
- Migrate your data to the Azure organization project using `pg_dump` and `pg_restore`. Refer to [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres#run-a-test-migration) for instructions.

## Changing your pricing plan

Changing the Neon pricing plan for an Azure subscription involves the following steps:

1. Navigate to the [Azure portal](https://portal.azure.com/) and sign in.
2. Locate your Neon Serverless Postgres resource by searching for it at the top of the page or locating it under **Resources** or **Navigate** > **All resources**.
3. Select your Neon resource to open the **Overview** page.
4. Select the **Change Plan** tab. This will open the **Change Plan** drawer where you can select from available Neon plans. Supported plans include the Neon Free Plan, Scale Plan, and Business Plan. A description of what's included in each plan is provided in the **Description** column in the drawer, but for more information about Neon plans, please visit our [Pricing](https://neon.tech/pricing) page.

   ![Azure change plan](/docs/introduction/azure_change_plan.png)

5. Click **Change Plan** to complete the plan change.

## Enterprise Plan

Neon's **Enterprise Plan** is designed for large teams with unique requirements that aren't covered by Neon's self-serve plans. For details, see the [Enterprise Plan](/docs/introduction/plans#enterprise). To explore this option, contact our [Sales](https://neon.tech/contact-sales) team to discuss a custom private offer available through the Azure Marketplace.

## Troubleshooting

If you encounter issues, check the documentation in Azure's troubleshooting guide for Neon: [Troubleshoot Neon Serverless Postgres](https://learn.microsoft.com/en-us/azure/partner-solutions/neon/troubleshoot). If you still need help, contact [Neon Support](/docs/introduction/support).

## Deleting a Neon Resource in Azure

If you no longer need your Neon resource, you can delete it to stop all associated billing through the Azure Marketplace.

<Admonition type="important">
Deleting a Neon resource from Azure removes the Neon Organization and all Neon projects and data associated with that resource.
</Admonition>

Follow these steps to delete the resource:

1. In the Azure portal, select the Neon resource you want to delete.
2. On the **Overview** page, select **Delete**.
3. Confirm the deletion by entering the resource's name.
4. Choose the reason for deleting the resource.
5. Select **Delete** to finalize.

Once the resource is deleted, billing will stop immediately, and the Neon Organization and all Neon projects and data associated with that resource will be removed.

## Questions?

If you have questions or need further guidance on setting up Neon through Azure Marketplace, please don't hesitate to [reach out to us](https://neon.tech/contact-sales).
