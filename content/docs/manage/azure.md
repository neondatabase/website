---
title: Neon on Azure
enableTableOfContents: true
isDraft: false
updatedOn: '2025-03-05T21:09:38.754Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>Options for using Neon on Azure</p>
<p>About deploying Neon as an Azure Native ISV Service</p>
<p>About creating Neon projects in Azure regions</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="/docs/introduction/billing-azure-marketplace">Neon in the Azure Marketplace (Neon Docs)</a>
  <a href="https://azuremarketplace.microsoft.com/en-us/marketplace/apps/neon1722366567200.neon_serverless_postgres_azure_prod?tab=Overview">Neon Azure Marketplace Listing</a>
  <a href="https://learn.microsoft.com/en-us/azure/partner-solutions/neon/overview">What is Neon Serverless Postgres? (Azure Docs)</a>
  <a href="https://learn.microsoft.com/en-us/azure/partner-solutions/neon/create">Create a Neon Serverless Postgres resource (Azure Docs)</a>
</DocsList>

</InfoBlock>

## Deployment options on Azure

Neon offers the following deployment options on Azure:

- **Option 1: Deploy Neon as an Azure Native ISV Service** — use Neon as a native Azure service, integrated with the [Azure portal](https://portal.azure.com/#home), [CLI](https://learn.microsoft.com/en-us/cli/azure/neon?view=azure-cli-latest), and [SDKs](https://learn.microsoft.com/en-us/dotnet/api/overview/azure/neonpostgres?view=azure-dotnet-preview). This option enables you to manage Neon as part of your Azure infrastructure with unified billing in Azure.
  <PublicPreview/>
- **Option 2: Create Neon projects in Azure regions (no integration)** — create a Neon project in an Azure region without using the native Azure integration. Project creation and billing is managed through Neon. There is no difference from a Neon project created in an AWS region — your Neon project simply resides in an Azure region instead of AWS region.

## Option 1: Deploy Neon as an Azure Native ISV Service

This option integrates Neon natively into Azure, letting you manage your Neon organization alongside the rest of your Azure infrastructure. Key benefits include:

- **Azure-native management**: Provision and manage Neon organizations directly from the Azure portal.
- **Single sign-on (SSO)**: Access Neon using your Azure credentials—no separate logins required.
- **Consolidated billing**: Simplify cost management with unified billing through the Azure Marketplace.
- **Integrated workflows**: Use the Azure CLI and SDK to manage Neon organizations as part of your regular workflows, integrated with your existing Azure resources.

    <Admonition type="note">
    Management of Neon projects, databases, and branches is supported through the Neon Console, CLI, and API. However, this public preview lays the groundwork for further deeper between Neon and Azure, including integration with other Azure native services.
    </Admonition>

### Get started

To begin using **Neon as an Azure Native ISV Service**, refer to our [Azure Marketplace](/docs/introduction/billing-azure-marketplace) instructions. After you setup the integration, familiarize yourself with Neon by stepping through Neon's [Getting started](https://neon.tech/docs/introduction#get-started) guides. You can also manage your Neon Postgres Resource using the Azure CLI or SDK for .NET.

<DetailIconCards>

<a href="/docs/introduction/billing-azure-marketplace" description="Deploy Neon Postgres as Native ISV Service from the Azure Marketplace" icon="enable">Deploy Neon from Azure Marketplace</a>

<a href="https://neon.tech/docs/introduction#get-started" description="Familiarize yourself with Neon by stepping through our Getting started guides" icon="trend-up">Getting started with Neon</a>

<a href="https://learn.microsoft.com/en-us/cli/azure/neon?view=azure-cli-latest" description="Manage your Neon Resource with the Azure CLI" icon="cli">Azure CLI — az neon</a>

<a href="https://learn.microsoft.com/en-us/dotnet/api/overview/azure/neonpostgres?view=azure-dotnet-preview" description="Manage your Neon Resource with the Azure SDK for .NET" icon="code">Azure SDK for .NET</a>

</DetailIconCards>

## Option 2: Create Neon projects in Azure regions (no integration)

If you want to deploy a Neon project to an Azure region without using the **Azure Native ISV Service** integration, you can simply select one of our supported Azure regions when creating a Neon project. You might consider this option if:

- Part of your infrastructure runs on Azure but you don't need the native integration
- An Azure region is closer to your application than a Neon AWS region
- You want to manage billing through Neon rather than Azure

Creating a Neon project in an Azure region without using the **Azure Native ISV Service** is supported via the Neon Console, CLI, and API.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

To create a Neon project from the console, follow the [Create project](https://neon.tech/docs/manage/projects#create-a-project) steps. Select **Azure** as the **Cloud Service Provider**, and choose one of the available [Azure regions](/docs/introduction/regions).

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

## Azure region support

For supported Azure regions, refer to our [Regions](/docs/introduction/regions) page. For the Public Preview, Neon supports a limited number of Azure regions. To request support for other Azure regions, see [Request a region](/docs/introduction/regions#request-a-region).

## Resources to get you started with Neon on Azure

Find the resources you need to get started with Neon on Azure, from deployment options to integration guides and examples.

### Migrate data to Neon on Azure

- [Migrate data from Azure PostgreSQL](https://neon.tech/docs/import/migrate-from-azure-postgres) - Replicate data from Azure PostgreSQL to 

### Connect to Neon from Azure services

- [Connect with Azure Service Connector](https://neon.tech/guides/azure-service-connector) - Connect Azure services to Neon

### Azure functions & serverless

- [Query Postgres from Azure Functions](https://neon.tech/guides/query-postgres-azure-functions) - Connect from Azure Functions to Neon
- [Building a serverless referral system](https://neon.tech/guides/azure-functions-referral-system) - Create a referral system with Neon and Azure Functions
- [Building a robust JSON API with TypeScript](https://neon.tech/guides/azure-functions-hono-api) - Build APIs with TypeScript, Postgres, and Azure Functions
- [Azure Static Web Apps with Neon](https://neon.tech/guides/azure-todo-static-web-app) - Building Azure Static Web Apps with Neon
- [Azure Logic Apps with Neon](https://neon.tech/guides/azure-logic-apps) — Integrate Neon with Azure Logic Apps

### AI & machine learning with Neon on Azure

- [Multitenant RAG with Neon on Azure](https://neon.tech/blog/multitenant-private-ai-chat-with-neon-on-azure) - Build a tenant AI chat solution with Neon on Azure
- [Azure AI Language with Neon](https://neon.tech/guides/azure-ai-language) - Analyze customer feedback using Azure AI Language and store results in Neon
- [Building an AI chatbot with Neon](https://neon.tech/guides/azure-ai-chatbot) - Create AI-powered chatbots with Neon and Azure
- [Azure AI Search with Neon](https://neon.tech/guides/azure-ai-search) - Implement search functionality using Azure AI Search and Neon
- [AI-powered email assistant in Azure](https://neon.tech/blog/how-to-create-your-personal-ai-powered-email-assistant-in-azure) - Create a personal AI email assistant in Azure
- [SQL query assistant with .NET and Azure OpenAI](https://neon.tech/blog/building-sql-query-assistant-with-dotnet-azure-functions-openai) - Build an intelligent SQL query assistant with Neon, .NET, and Azure OpenAI
- [Generative feedback loops with Azure OpenAI](https://neon.tech/blog/generative-feedback-loops-with-neon-serverless-postgres-azure-functions-and-azure-openai) - Create generative feedback loops with Neon, Azure Functions, and Azure OpenAI
- [Build your first AI agent for Postgres on Azure](https://neon.tech/guides/azure-ai-agent-service) — Build an AI agent for Postgres using Azure AI Agent Service

### Frameworks & languages

- [.NET with Neon](https://neon.tech/docs/guides/dotnet-npgsql) - Connect a .NET (C#) application to Neon
- [Entity Framework with Neon](https://neon.tech/docs/guides/dotnet-entity-framework) - Connect Entity Framework applications to Neon
- [Entity Framework schema migrations](https://neon.tech/docs/guides/entity-migrations) - Schema migration with Neon and Entity Framework
- [Azure DevOps Entity Framework migrations](https://neon.tech/guides/azure-devops-entity-migrations) - Manage Entity Framework migrations with Azure DevOps
- [ASP.NET with Neon and Entity Framework](https://neon.tech/guides/dotnet-neon-entity-framework) - Build ASP.NET Core applications with Neon and Entity Framework
- [RESTful API with ASP.NET Core and Swagger](https://neon.tech/guides/aspnet-core-api-neon) - Build APIs with ASP.NET Core, Swagger, and Neon
- [Neon read replicas with Entity Framework](https://neon.tech/guides/read-replica-entity-framework) - Scale .NET applications with Entity Framework and Neon read replicas

### Security & access control

- [Row-level security with Azure AD](https://neon.tech/docs/guides/neon-rls-azure-ad) - Implement row-level security with Azure Active Directory


