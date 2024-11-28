---
title: Get started with Neon on Azure
subtitle: Learn how to deploy Neon as a native service on Azure
enableTableOfContents: true
updatedOn: '2024-10-22T15:41:04.370Z'
---

## Find Neon on Azure and subscribe

1. Use the search in the [Azure portal](https://portal.azure.com/) to find the **Neon Serverless Postgres** offering.
2. Alternatively, go to the [Azure Marketplace](https://portal.azure.com/#view/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/home) and search for **Neon Serverless Postgres**.
3. Subscribe to the service.

After subscribing, you will be directed to the [Create a Neon Resource](#create-a-neon-resource) page.

## Create a Neon Resource

1. On the **Create a Neon Serverless Postgres Resource** page, set the following values in the **Create Neon Resource** section.

   | Property                   | Description                                                                                                                                                                                                                                                                                                                           |
   | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Subscription**           | From the drop-down, select your Azure subscription where you have Owner or Contributor access.                                                                                                                                                                                                                                        |
   | **Resource group**         | Specify whether you want to create a new Azure resource group or use an existing one. A resource group is like a container or a folder used to organize and manage resources in Azure. For more information, see [Azure Resource Group overview](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview). |
   | **Resource Name**          | Enter a name for Neon resource. This name is used only in Azure.                                                                                                                                                                                                                                                                      |
   | **Region**                 | Select a region to deploy your resource. Neon Serverless Postgres will let you choose a region while creating a project.                                                                                                                                                                                                              |
   | **Neon Organization name** | The name you assign to your [Neon Organization](/docs/reference/glossary#organization), such as a team name or company name. The name you specify appears as your [Organization](/docs/reference/glossary#organization) name in the Neon Console.                                                                                     |
   | **Pricing Plan**           | Select a plan. For information about Neon's plans, please refer to the [Neon Pricing](https://neon.tech/home) page. Neon offers a Free Plan and paid plans (**Scale** and **Business**) you can choose from.                                                                                                                          |

    <Admonition type="note">
    The Neon **Launch Plan** is currently not available in the Azure Marketplace.
    </Admonition>

2. After specifying the details above, select the **Next: Review + Create** to navigate to the final step for resource creation. When you get to the **Review + Create** page, review your selections and the Neon and Azure Marketplace terms and conditions.
3. Select **Overview** in the **Resource** menu to see information on the deployed resource.
4. Select the **Single-Sign-On** URL to redirect to the newly created Neon Organization.
