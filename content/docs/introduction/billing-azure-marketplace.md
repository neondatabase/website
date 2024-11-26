---
title: Azure Marketplace
enableTableOfContents: true
subtitle: Neon as an Azure Native Service with unified billing through Azure Marketplace
updatedOn: '2024-10-14T11:46:51.927Z'
---

Neon is available as an [Azure Native ISV Service](https://learn.microsoft.com/en-us/azure/partner-solutions/partners), allowing you to work with Neon the same way you work with other native solutions from Microsoft. Billing is handled directly through Azure, and you can choose from Neon pricing plans when setting up the integration.

## Prerequisites for setting up the Neon integration

- **Azure account**: If you don't have an active Azure subscription, [create a free account](https://azure.microsoft.com/free).
- **Access level**: Only users with **Owner** or **Contributor** access on the Azure subscription can set up the Azure integration. Ensure you have the appropriate access before proceeding.

## Find Neon on Azure and subscribe

1. Use the search in the [Azure portal](https://portal.azure.com/) to find the **Neon Serverless Postgres** offering.
2. Alternatively, go to the [Azure Marketplace](https://portal.azure.com/#view/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/home) and search for **Neon Serverless Postgres**.
3. Subscribe to the service.

After subscribing, you will be directed to the [Create a Neon Resource](#create-a-neon-resource) page.

## Create a Neon Resource

1. On the **Create a Neon Resource** page, set the following values in the **Create Neon Resource** section.

   | Property                   | Description                                                                                                                                                                                                                                                                                                        |
   | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Subscription**           | From the drop-down, select your Azure subscription where you have Owner or Contributor access.                                                                                                                                                                                                                     |
   | **Resource group**         | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview). |
   | **Resource Name**          | Enter the name for the Neon organization you want to create.                                                                                                                                                                                                                                                       |
   | **Region**                 | Select a region to deploy your resource. Neon Serverless Postgres will let you choose a region while creating a project.                                                                                                                                                                                           |
   | **Neon Organization name** | Corresponds to the name of your company, usually.                                                                                                                                                                                                                                                                  |
   | **Pricing Plan**           | Choose a plan of your choice. For information about Neon's plans, please refer to the [Neon Pricing](https://neon.tech/home) page. Neon offers a Free Plan and paid plans (**Scale**, and **Business**) that you can choose from.                                                                    |

2. After specifying the details above, select the **Next: Review + Create** to navigate to the final step for resource creation. When you get to the **Review + Create** page, review your selections and the Neon and Azure Marketplace terms and conditions.
3. Select **Overview** in the **Resource** menu to see information on the deployed resource.
4. Select the **Single-Sign-On** URL to redirect to the newly created Neon organization.

## Overages

Neon plans include allowances for compute, storage, and projects. For details on each plan's allowances, see [Neon Plans](/docs/introduction/plans). If you exceed these allowances on a paid plan, overage charges will apply to your monthly bill. You can track your usage on the **Billing** page in the Neon Console. For guidance, see [Monitoring Billing](/docs/introduction/monitor-usage).

## Changing your pricing plan

To change your Neon pricing plan, you can cancel your current subscription and create a new one. However, this approach does not preserve your existing Neon projects. If you want to keep your projects while changing plans, please open a [support ticket](https://console.neon.tech/app/projects?modal=support). The Neon Support team will help you update your plan and migrate your projects to the new plan.

## Enterprise Plan

Neon's **Enterprise Plan** is designed for large teams with unique requirements that aren't covered by Neon's self-serve plans. For more details, see the [Enterprise Plan](/docs/introduction/plans#enterprise). To explore this plan, contact our [Sales](https://neon.tech/contact-sales) team to discuss a custom private offer available through the Azure Marketplace.

## Questions?

If you have questions or need further guidance on setting up Neon through Azure Marketplace, please don't hesitate to [reach out to us](https://neon.tech/contact-sales).
