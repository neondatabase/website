---
title: Deploy Neon on Azure
subtitle: Learn how to deploy Neon as a Native ISV Service on Azure
enableTableOfContents: true
isDraft: false
updatedOn: '2025-08-02T10:33:29.220Z'
---

<InfoBlock>

<DocsList title="What you will learn:">
<p>How to deploy on Azure as a native service</p>
<p>About creating Neon projects in Azure regions without the integration</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="/docs/manage/azure">Neon on Azure</a>
  <a href="/docs/azure/azure-develop">Developing with Neon on Azure</a>
</DocsList>

</InfoBlock>

[Neon is available on the Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/neon1722366567200.neon_serverless_postgres_azure_prod?tab=Overview) as an [Azure Native ISV Service](https://learn.microsoft.com/en-us/azure/partner-solutions/partners), allowing you to work with Neon the same way you work with other native solutions from Microsoft.

This guide steps you through deploying Neon as an Azure native service.

<Admonition type="note">
You can also create Neon projects in Azure regions without the native service integration—to learn more, see [Create Neon projects in Azure regions without the integration](#create-neon-projects-in-azure-regions-without-the-integration).
</Admonition>

## Prerequisites

- **Azure account**: If you don't have an active Azure subscription, [create a free account](https://azure.microsoft.com/free).
- **Access level**: Only users with **Owner** or **Contributor** access roles on the Azure subscription can set up the integration. Ensure you have the appropriate access before proceeding. For information about assigning roles in Azure, see [Steps to assign an Azure role](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-steps).

## Find Neon on Azure and subscribe

1. Use the search bar at the top of the [Azure portal](https://portal.azure.com/) to find the **Neon Serverless Postgres** offering.

   ![Search for Neon in the Azure Portal](/docs/introduction/azure_search_neon.png)

   Alternatively, go to the [Azure Marketplace](https://portal.azure.com/#view/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/home) and search for **Neon Serverless Postgres**.

2. Subscribe to the service. You will be directed to the [Create a Neon Serverless Postgres Resource](#create-a-neon-resource) page.

## Create a Neon Resource

1. On the **Create a Neon Serverless Postgres Resource** page, enter values for the properties described below.

   | Property                   | Description                                                                                                                                                                                                                                                                                                                                                                                                  |
   | :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Subscription**           | From the drop-down, select an Azure subscription where you have Owner or Contributor access.                                                                                                                                                                                                                                                                                                                 |
   | **Resource group**         | Select an existing Azure resource group or create a new one. A resource group is like a container or a folder used to organize and manage resources in Azure. For more information, see [Azure Resource Group overview](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview).                                                                                                 |
   | **Resource Name**          | Enter a name for the Azure resource representing your Neon organization. This name is used only in Azure.                                                                                                                                                                                                                                                                                                    |
   | **Region**                 | Select a region to deploy your Azure resource. This is the region for your Azure resource, not for your Neon projects and data. You will select from [Azure-supported regions](/docs/introduction/regions#azure-regions) when you create the Neon project in a later step. For example, you can create a Neon resource in the (US) West US 3 region and create a Neon project (Europe) Germany West Central. |
   | **Neon Organization name** | Provide a name for your [Neon Organization](/docs/reference/glossary#organization), such as a team name or company name. The name you specify will be your [Organization](/docs/reference/glossary#organization) name in the Neon Console. Your Neon projects will reside in this named organization.                                                                                                        |
   | **Plan**                   | Select a plan. You have three to choose from: **Free**, **Scale**, and **Business**. Select **Change Plan** to view details about each plan. For more information about Neon's plans, please refer to the [Neon Pricing](/pricing) page. The Neon **Launch Plan** is currently not available in the Azure Marketplace.                                                                                       |
   | **Billing term**           | Select a billing term for the selected plan. You can choose from a **1-Month** or a **1-Year** billing term (monthly or yearly billing).                                                                                                                                                                                                                                                                     |

   ![Create a resource group](/docs/introduction/azure_create_resource_group.png)

1. Review your **Price + Payment options** and **Subtotal**, select **Next**.
1. On the **Project** page, enter a name for your Neon project, select a Postgres version, specify a name for your database, and choose a region. We recommend selecting the region closest to your application.

   ![Create project in Azure](/docs/introduction/azure_create_project.png)

      <Admonition type="note">
        A Neon organization created via the Azure portal supports creating Neon projects in [Azure regions](/docs/introduction/regions#azure-regions) only. Neon's AWS regions are not supported with Neon on Azure.
      </Admonition>

1. Click **Next**.
1. Optionally specify tags for your resource, then click **Next**. For more about tags, see [Use tags to organize your Azure resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources).
1. On the **Review + Create** page, review your selections, the [Azure Marketplace Terms](https://learn.microsoft.com/en-us/legal/marketplace/marketplace-terms), and the Neon [Terms of Use](/terms-of-service) and [Privacy Policy](/privacy-policy).
1. Select **Create** to initiate the resource deployment, which may take a few moments.
1. When your deployment is complete, click the **Go to resource** button under **Next steps** to view your new Neon resource.

   ![Go to resource button](/docs/introduction/azure_go_to_resource.png)

1. Select the **Go to Neon** link under **Getting started** to open the Neon Console.

   ![Azure get started](/docs/introduction/azure_get_started.png)

   You will be directed to the Neon Console where you can start working with your newly created Neon organization and project.

   ![Project page in Neon](/docs/introduction/azure_neon_project_page.png)

1. From here, follow the [Neon Getting Started](/docs/get-started/signing-up) guide to begin working with your Neon project and get familiar with the platform.

## Create Neon projects in Azure regions without the integration

If you want to deploy a Neon project to an Azure region without using the **Azure Native ISV Service** integration, you can simply select one of our supported Azure regions when creating a Neon project from the Neon Console.

If you do not use the Azure integration, there is no difference from a Neon project created in an AWS region—your Neon project simply resides in an Azure region instead of AWS region.

You might consider this option if:

- Part of your infrastructure runs on Azure but you don't need the native integration
- An Azure region is closer to your application than a Neon AWS region
- You want to manage billing through Neon rather than Azure

Creating a Neon project in an Azure region without using the **Azure Native ISV Service** is supported via the Neon Console, CLI, and API.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

To create a Neon project from the console, follow the [Create project](/docs/manage/projects#create-a-project) steps. Select **Azure** as the **Cloud Service Provider**, and choose one of the available [Azure regions](/docs/introduction/regions).

</TabItem>

<TabItem>

To create a Neon project using the Neon CLI, use the [neon projects create](/docs/reference/cli-projects#create) command:

```bash
neon projects create --name mynewproject --region-id azure-eastus2
```

For Azure `region-id` values, see [Regions](/docs/introduction/regions).
</TabItem>

<TabItem>

To create a Neon project using the Neon API, use the [Create project](https://api-docs.neon.tech/reference/createproject) endpoint:

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "project": {
    "pg_version": 16,
    "region_id": "azure-eastus2"
  }
}
'
```

For Azure `region_id` values, see [Regions](/docs/introduction/regions).

</TabItem>

</Tabs>
