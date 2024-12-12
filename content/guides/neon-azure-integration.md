---
title: 'Setting up Neon serverless Postgres as an Azure Native Integration'
subtitle: "A step-by-step guide to deploying Neon's serverless Postgres via the Azure Marketplace"
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2024-12-12T00:00:00.000Z'
updatedOn: '2024-12-12T00:00:00.000Z'
---

Neon's serverless Postgres is now available as a native integration within the Azure ecosystem, allowing organizations to provision Neon organizations directly from the Azure portal. This integration combines the power of Neon's serverless architecture with Azure's robust cloud infrastructure, offering features like Single Sign-On (SSO), unified billing, and seamless resource management. This guide walks you through the process of setting up and managing your Neon Serverless Postgres via the Azure Marketplace.

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/) with an active subscription

## Key benefits of Neon on Azure

The Azure Native integration delivers significant advantages that enhance both developer productivity and business operations:

- **Seamless Azure Integration**: Create and manage Neon organizations directly through the Azure portal, eliminating the need to switch between platforms
- **Enhanced Development Experience**: Leverage familiar tools including Azure CLI and popular SDKs (Node.js, Python, .NET, Java, Go) for consistent workflow management
- **Single Sign-On Capability**: Access Neon seamlessly using your Microsoft credentials, improving security and simplifying authentication
- **Unified Billing System**: Track and manage all your Neon expenses alongside other Azure services in one consolidated bill
- **Cost Optimization**: Optimize your cloud spend by applying Neon usage toward your Microsoft Azure Consumption Commitment

This integration is available in preview through the Azure Marketplace. Whether you're building AI applications, SaaS platforms, or scalable web services, Neon Serverless Postgres on Azure provides the foundation for modern database needs.

## Creating your Neon organization

To get started with Neon on Azure, you'll need to create a Neon organization within your Azure environment. This process is streamlined through the Azure portal, allowing you to manage your Neon resources alongside other Azure services.

### Access Neon through Azure Marketplace

1. Navigate to the [Azure Portal](https://portal.azure.com)
2. Search for **Neon Serverless Postgres** in the search bar
3. Select the offering from the Marketplace results
   ![Search for Neon Serverless Postgres on Azure](/docs/guides/search-for-neon-on-azure.png)

## Choosing the right plan

You will be prompted to select a plan based on your organization's requirements:
While starting with the Free Plan is an excellent way to explore Neon's capabilities, understanding the full range of plans helps you make informed decisions as your needs evolve.

### Free plan: Perfect for getting started

The Free Plan provides an excellent entry point for developers and small projects. With 10 projects, 0.5 GB storage, and 190 compute hours, you can build and test applications while experiencing Neon's core features like [database branching](/docs/introduction/branching), [read replicas](/docs/introduction/read-replicas) and [Postgres extensions](https://neon.tech/docs/extensions/pg-extensions)

### Scale plan: Growing with your application

As your application grows, the Scale Plan offers substantial increases in resources with 1,000 projects and 50 GB storage. This plan introduces critical features for growing organizations:

- Organization accounts for team collaboration
- IP Allow Rules for enhanced security
- [Datadog integration](/docs/guides/datadog) for advanced monitoring
- Increased autoscaling capabilities up to 8 compute units

### Business plan: Enterprise-Ready features

For organizations requiring enterprise-grade features, the Business Plan provides comprehensive capabilities:

- Enhanced compliance with SOC 2 and ISO certifications
- Guaranteed 99.95% SLA for mission-critical applications
- Priority support for quick issue resolution
- Private Link support for secure connectivity
- Expanded resources with 5,000 projects and 500 GB storage

<Admonition type="note" title="Note">
For custom enterprise requirements beyond the Business Plan, [contact Neon's sales team](https://neon.tech/contact-sales).
</Admonition>

## Configuring your resource

For this guide, we'll use the Free Tier, but you can easily upgrade later as your needs grow. We will proceed to the resource configuration stage by clicking on **Subscribe** with the Free Plan selected.

![Subscribe to Neon on Azure](/docs/guides/subscribe-to-neon-on-azure.png)

After selecting your plan, you'll need to configure your Neon resource within Azure. Begin by selecting your Azure subscription and creating or choosing an existing resource group. The resource group helps you organize and manage related Azure resources together. Next, provide a meaningful resource name that helps you identify this Neon deployment within your Azure environment.

![Neon Resource Configuration on Azure](/docs/guides/neon-resource-configuration-on-azure.png)

When selecting a region, consider the geographical location of your applications and users. Currently, Neon is available in `East US 2`, `Germany West Central`, and `West US 3` while under preview. Choose the region that provides the lowest latency for your primary user base. Finally, create a distinctive organization name that reflects your company or project structure, as this will be visible in both Azure and the Neon Console.

Click **Review + Create** to proceed to the final stage of the deployment process. The Azure portal will validate your configuration settings, ensuring that all required fields are correctly filled. Once the validation is successful, click **Create** to deploy your Neon resource. Azure will begin provisioning your resource, which typically takes a few minutes. You should see a notification indicating that your Neon resource has been successfully deployed.

![Neon Resource Deployment Complete on Azure](/docs/guides/neon-resource-deployment-complete-on-azure.png)

## Managing your Neon resource

### Accessing the Neon Console

After successful deployment, accessing your Neon console is straightforward through Azure's SSO integration. Navigate to your newly created Neon resource in the Azure portal, where you'll find the **SSO link** under **Portal URL**

![Neon SSO Link in Azure Portal](/docs/guides/neon-sso-link-in-azure-portal.png)

This link provides seamless access to the Neon Console using your Azure credentials, eliminating the need for separate authentication processes.

### Creating your first project

Upon accessing the Neon Console, you'll be directed to the project creation view. Here, you can create your first Neon project.

![Neon Azure Create Project](/docs/guides/neon-azure-create-project.png)

Neon organizes your databases into projects, each serving as an independent unit for database management and development. You can customize your project with the following details:

- Project name and database name
- Default branch configuration
- Auto-scaling configuration, where you can set the minimum and maximum vCPUs and memory

### Exploring your project and database

Once your project is created, a default branch and database are automatically generated within it. You will be redirected to the project dashboard which displays details of your project. This dashboard is your central hub for monitoring resources, setting up connections, and managing your database.

![Neon Project Dashboard](/docs/guides/neon-project-dashboard.png)

Here are some key features you'll find:

- **Connection string:** The connection string provides the necessary details to connect your applications to the database.
- **Branching:** You can create new database branches from the default one. Learn more about [database branching here](/docs/introduction/branching).
- **Monitoring**: The dashboard allows you to monitor resource usage, including compute, storage, and connections count.

### Connecting your application

To connect your application to the Neon database, copy the connection URL from the project dashboard and use it in your application stack. This URL contains the necessary credentials and connection details to establish a secure connection to your Neon database.

With your application connected to Neon, you can start building and deploying your projects with confidence, knowing that Neon's serverless Postgres is handling your database needs efficiently.

## Platform-Specific Management: Azure Portal vs. Neon console

### Azure Portal: Your Administrative hub

The Azure portal provides a unified management experience for your Neon resources, serving as the primary entry point within the Azure ecosystem. It allows you to create and manage Neon organizations, which can then be accessed through the dedicated Neon Console. The Azure portal also centralizes your Neon financial management, providing transparent cost views, allowing application of your Microsoft Azure Consumption Commitment, and enabling unified billing reports

Moreover, the Azure portal streamlines the process, taking advantage of Azure's SSO, thereby simplifying access to the Neon console. Crucially, access control to your overall Neon organization is also handled via familiar Azure RBAC.

In essence, the Azure portal provides a centralized platform for managing the administrative and financial aspects of your Neon integration within Azure, providing an overview of all resources. While it provides this crucial oversight, it's important to note that detailed management of databases, individual projects, and their advanced features requires transitioning to the specialized Neon console.

### Neon Console: Your Database management and development hub

The Neon Console is your dedicated environment for the day-to-day management of your Postgres databases and development workflows, providing a specialized set of tools beyond what's available in the Azure portal. This is where you create and manage individual database projects, configure auto-scaling to adapt to your workload, and access detailed monitoring metrics to ensure optimal performance.

Within the Neon Console you gain the ability to create read replicas to scale your read operations without impacting your primary database. You can leverage Neon's powerful branching capabilities, enabling you to quickly create instant copies of your database for isolated development and testing purposes, which can be instrumental when implementing database changes or developing new features.

If needed, the Neon Console facilitates database restoration from backups. Furthermore, this console provides robust performance monitoring tools, allowing you to track resource usage, and monitor database connections, providing you insights needed for continuous improvement. The Neon Console also allows for various integrations with popular developer tools and services, enhancing the overall workflow, which is essential to ensure that your database functions are streamlined and integrated into your development ecosystem.

In short, the Neon Console provides the essential capabilities needed for database administration, development, and optimization of your Postgres databases, giving you granular control over your data and your development workflow.

## Support

Neon offers a range of support options to help you get the most out of your Neon on Azure deployment. The following table outlines the support channels available at each plan level:

| Support channels                                                                                | Free Plan | Scale Plan | Business Plan | Enterprise |
| :---------------------------------------------------------------------------------------------- | :-------: | :--------: | :-----------: | :--------: |
| [Neon Discord Server](/docs/introduction/support#neon-discord-server) (not an official channel) |  &check;  |  &check;   |    &check;    |  &check;   |
| [Neon AI Chat](/docs/introduction/support#neon-ai-chat) (not an official channel)               |  &check;  |  &check;   |    &check;    |  &check;   |
| [Support tickets](/docs/introduction/support#support-tickets)                                   |     -     |  &check;   |    &check;    |  &check;   |
| [Prioritized support tickets](/docs/introduction/support#prioritized-support-tickets)           |     -     |     -      |    &check;    |  &check;   |
| [Video chat](/docs/introduction/support#video-chat)                                             |     -     |     -      |      \*       |     \*     |
| [SLAs](/docs/introduction/support#slas)                                                         |     -     |     -      |    &check;    |  &check;   |

<div style={{margin: '-30px 0 30px 0'}}>
<small><sup>*</sup>Video chats may be scheduled on a case-by-case basis. See [Video chat](/docs/introduction/support#video-chat).</small>
</div>

## Additional Resources

- [Neon Documentation](/docs)
- [Microsoft Azure Documentation](https://docs.microsoft.com/en-us/azure/)
- [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/)
- [Microsoft Azure Consumption Commitment Benefit](https://learn.microsoft.com/en-us/marketplace/azure-consumption-commitment-benefit)

<NeedHelp />
