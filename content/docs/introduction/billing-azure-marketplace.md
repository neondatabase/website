---
title: Azure Marketplace
enableTableOfContents: true
subtitle: Use Neon as an Azure Native ISV Integration with unified billing through the Azure Marketplace
updatedOn: '2024-10-14T11:46:51.927Z'
---

Neon Postgres is available on Azure as an [Azure Native ISV Service](https://learn.microsoft.com/en-us/azure/partner-solutions/partners), allowing you to work with Neon in much the same way you would work with solutions from Microsoft. As a native ISV service, billing is managed in Azure.

## Prerequisites for setting up Neon on Azure 

- **Azure account**: If you don't have an active Azure subscription, [create a free account](https://azure.microsoft.com/free).
- **Access level**: Only users with **Owner** or **Contributor** access on the Azure subscription can set up the Azure integration. Ensure you have the appropriate access before proceeding.

## Find Neon Serverless Postgres on Azure and subscribe

1. Use the search in the [Azure portal](https://portal.azure.com/) to find the **Neon Serverless Postgres** offering.  
2. Alternatively, go to the [Azure Marketplace](https://portal.azure.com/#view/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/home) and search for **Neon Serverless Postgres**.  
3. Subscribe to the service.

## Create a Neon organization

Set the following values in the **Create Neon organization** section.

| Property                 | Description                                                                                                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Subscription**         | From the drop-down, select your Azure subscription where you have Owner or Contributor access.                                                                               |
| **Resource group**       | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview). |
| **Resource Name**        | Enter the name for the Neon organization you want to create.                                                                                                                 |
| **Region**               | Select a region to deploy your resource. Neon Serverless Postgres will let you choose a region while creating a project.                                                     |
| **Neon Organization name** | Corresponds to the name of your company, usually.                                                                                                                          |
| **Pricing Plan**         | Choose a plan of your choice. For information about Neon's plans, please refer to the [Neon Pricing](https://neon.tech/home) page.                                                    |

If you have questions or need further guidance on purchasing Neon through Azure Marketplace, please don't hesitate to [reach out to us](https://neon.tech/contact-sales).
