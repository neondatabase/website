---
title: Azure Marketplace
enableTableOfContents: true
subtitle: Neon as an Azure Native Service with unified billing through Azure Marketplace
tag: new
updatedOn: '2024-10-14T11:46:51.927Z'
---

<PublicPreview/>

Neon is available as an [Azure Native ISV Service](https://learn.microsoft.com/en-us/azure/partner-solutions/partners), allowing you to work with Neon the same way you work with other native solutions from Microsoft. Billing is handled directly through Azure, and you can choose from Neon pricing plans when setting up the integration.

## Prerequisites for setting up the Neon integration

- **Azure account**: If you don't have an active Azure subscription, [create a free account](https://azure.microsoft.com/free).
- **Access level**: Only users with **Owner** or **Contributor** access on the Azure subscription can set up the Azure integration. Ensure you have the appropriate access before proceeding.

## Find Neon on Azure and subscribe

1. Use the search in the [Azure portal](https://portal.azure.com/) to find the **Neon Serverless Postgres** offering.
2. Alternatively, go to the [Azure Marketplace](https://portal.azure.com/#view/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/home) and search for **Neon Serverless Postgres**.
3. Subscribe to the service.

After subscribing, you will be directed to the [Create a Neon Serverless Postgres Resource](#create-a-neon-resource) page.

## Create a Neon Resource

1. On the **Create a Neon Serverless Postgres Resource** page, enter values for the following properties:

   | Property                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Subscription**           | From the drop-down, select an Azure subscription where you have Owner or Contributor access.                                                                                                                                                                                                                                                                                                                                                                 |
   | **Resource group**         | Select an existing Azure resource group or create a new one. A resource group is like a container or a folder used to organize and manage resources in Azure. For more information, see [Azure Resource Group overview](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview).                                                                                                                                                 |
   | **Resource Name**          | Enter a name for the Azure resource representing your Neon organization. This name is used only in Azure.                                                                                                                                                                                                                                                                                                                                                    |
   | **Region**                 | Select a region to deploy your Azure resource. This is the region for your Azure resource, not for your Neon projects and data. Neon will let you select from [supported regions](/docs/introduction/regions#azure-regions) when you create a Neon project, which you'll do after setting up the Neon resource in Azure. For example, you can create a Neon resource is the (US) West US 3 region and create a Neon project (Europe) Germany West Central.in |
   | **Neon Organization name** | Provide a name for your [Neon Organization](/docs/reference/glossary#organization), such as a team name or company name. The name you specify will be your [Organization](/docs/reference/glossary#organization) name in the Neon Console. Your Neon projects will reside in this named organization.                                                                                                                                                        |
   | **Plan**                   | Select a plan. You have three to choose from: **Free**, **Scale**, and **Business**. Select **Change Plan** to view details about each plan. For more information about Neon's plans, please refer to the [Neon Pricing](https://neon.tech/home) page. The Neon **Launch Plan** is currently not available in the Azure Marketplace.                                                                                                                         |
   | **Billing term**           | Select a billing term for the selected plan. You can choose from a **1-Month** or a **1-Year** billing term (monthly or yearly billing).                                                                                                                                                                                                                                                                                                                     |

1. After reviewing your **Price + Payment options** and **Subtotal**, select **Next** to optionally specify tags for your resource. For more about tags, see [Use tags to organize your Azure resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources).
1. Select **Review + Create** to navigate to the final step for resource creation. On the **Review + Create** page, review your selections, the [Azure Marketplace Terms](https://learn.microsoft.com/en-us/legal/marketplace/marketplace-terms), and the Neon [Terms of Use](https://neon.tech/terms-of-service) and [Privacy Policy](https://neon.tech/privacy-policy).
1. Select **Create** to initiate the resource deployment, which may take a few moments.
1. Under **Next steps**, click the **Go to resource** button.
1. Select the **Neon Console** or **Go to Neon link**. You will be directed to the **Create project page** in the Neon Console, in your newly created Neon Organization.

   ![Create project dialog for Azure](/docs/introduction/azure_create_project.png)

1. From here, you can follow the Neon **Getting Started**, beginning at [Step 2 - Onboarding in the Neon Console](/docs/get-started-with-neon/signing-up#step-2-onboarding-in-the-neon-console).

## Overages

Neon plans include allowances for compute, storage, and projects. For details on each plan's allowances, see [Neon Plans](/docs/introduction/plans). If you exceed these allowances on a paid plan, overage charges will apply to your monthly bill. You can track your usage on the **Billing** page in the Neon Console. For guidance, see [Monitoring Billing](/docs/introduction/monitor-usage).

## Changing your pricing plan

Changing your Neon pricing plan requires [creating a new Neon Resource](#create-a-neon-resource) with the desired pricing plan and opening a [support ticket](https://console.neon.tech/app/projects?modal=support) with Neon to have your existing Neon projects transferred to the new Neon Resource — creating a Neon Resources creates an Organization in Neon. The Neon Support team will transfer your Neon projects from your existing Neon Organization to your new Neon Organization.

<Admonition type="important">
Removing a Neon resource from Azure removes the Neon Organization and all Neon projects and data associated with that resource. When changing a Neon plan, do not remove your old Neon resource from Azure before you have verified that your Neon projects and data were transferred successfully to the Neon Organization associated with your new Neon resource.
</Admonition>

## Enterprise Plan

Neon's **Enterprise Plan** is designed for large teams with unique requirements that aren't covered by Neon's self-serve plans. For details, see the [Enterprise Plan](/docs/introduction/plans#enterprise). To explore this option, contact our [Sales](https://neon.tech/contact-sales) team to discuss a custom private offer available through the Azure Marketplace.

## Questions?

If you have questions or need further guidance on setting up Neon through Azure Marketplace, please don't hesitate to [reach out to us](https://neon.tech/contact-sales).
