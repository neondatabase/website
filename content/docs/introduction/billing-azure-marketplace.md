---
title: Azure Marketplace
enableTableOfContents: true
subtitle: Neon as an Azure Native Service with unified billing through Azure Marketplace
tag: new
updatedOn: '2024-12-05T09:54:07.974Z'
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
   | **Region**                 | Select a region to deploy your Azure resource. This is the region for your Azure resource, not for your Neon projects and data. Neon will let you select from [supported regions](/docs/introduction/regions#azure-regions) when you create a Neon project, which you'll do after setting up the Neon resource in Azure. For example, you can create a Neon resource is the (US) West US 3 region and create a Neon project (Europe) Germany West Central.in |
   | **Neon Organization name** | Provide a name for your [Neon Organization](/docs/reference/glossary#organization), such as a team name or company name. The name you specify will be your [Organization](/docs/reference/glossary#organization) name in the Neon Console. Your Neon projects will reside in this named organization.                                                                                                                                                        |
   | **Plan**                   | Select a plan. You have three to choose from: **Free**, **Scale**, and **Business**. Select **Change Plan** to view details about each plan. For more information about Neon's plans, please refer to the [Neon Pricing](https://neon.tech/home) page. The Neon **Launch Plan** is currently not available in the Azure Marketplace.                                                                                                                         |
   | **Billing term**           | Select a billing term for the selected plan. You can choose from a **1-Month** or a **1-Year** billing term (monthly or yearly billing).                                                                                                                                                                                                                                                                                                                     |

   ![Create a resource group](/docs/introduction/azure_create_resource_group.png)

1. Review your **Price + Payment options** and **Subtotal**, select **Next** to optionally specify tags for your resource. For more about tags, see [Use tags to organize your Azure resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources).
1. Select **Review + Create** to navigate to the final step for resource creation. Review your selections, the [Azure Marketplace Terms](https://learn.microsoft.com/en-us/legal/marketplace/marketplace-terms), and the Neon [Terms of Use](https://neon.tech/terms-of-service) and [Privacy Policy](https://neon.tech/privacy-policy).
1. Select **Create** to initiate the resource deployment, which may take a few moments.
1. When your deployment is complete, click the **Go to resource** button under **Next steps** to view your new Neon resource.

   ![Go to resource button](/docs/introduction/azure_go_to_resource.png)

1. Select the **Go to Neon link** under **Getting started** to open the Neon Console.

   ![Azure get started](/docs/introduction/azure_get_started.png)

   You will be directed to the **Create project page** in the Neon Console, in your newly created Neon Organization.

   <Admonition type="note">
   A Neon Organization created via the Azure portal supports creating Neon projects in Azure regions only.
   </Admonition>

   ![Create project dialog for Azure](/docs/introduction/azure_create_project.png)

1. From here, you can follow the [Neon Getting Started](/docs/get-started-with-neon/signing-up) to create your first Neon project and familiarize yourself with the Neon platform.

## Neon pricing plans and overages

Neon pricing plans include allowances for compute, storage, and projects. For details on each plan's allowances, see [Neon Plans](/docs/introduction/plans). If you exceed these allowances on a paid plan, overage charges will apply to your monthly bill. You can track your usage on the **Billing** page in the Neon Console. For guidance, see [Monitoring Billing](/docs/introduction/monitor-usage).

## Changing your pricing plan

Changing the Neon pricing plan for an Azure subscription involves the following steps:

1. [Creating a new Neon resource](#create-a-neon-resource) with the desired pricing plan.  
2. Opening a [support ticket](https://console.neon.tech/app/projects?modal=support) to request transferring your existing Neon projects to the new Neon resource. The Neon support team will transfer your projects from the "old" Neon organization to the new one. If you're a Neon Free Plan and can't open a support ticket, you can email Neon support at `support@neon.tech`. 
3. Once the project transfer is complete, you can [delete your old Neon resource](#deleting-a-neon-resource-in-azure). If the old resource was on a paid plan, deleting it will stop billing.

   <Admonition type="important" title="Do not delete your old Neon resource until the transfer is completed">
   Deleting a Neon resource from Azure removes the Neon organization and all associated projects and data. Before deleting your old resource, ensure your projects and data have been successfully transferred to the new organization.
   </Admonition>

Alternatively, you can perform the migration to the new Neon resource yourself. First, create a new Neon resource as described above. This will create a new organization in Neon. Add a Neon project to the new organization, then migrate your data from the project in your old organization to the project in the new organization using `pg_dump` and `pg_restore`. See [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres#run-a-test-migration) for instructions. You can [delete your old Neon resource](#deleting-a-neon-resource-in-azure) after the transfer is complete.

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
