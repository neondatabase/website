---
title: Develop with Neon on Azure
subtitle: Find the resources you need to start developing with Neon on Azure
enableTableOfContents: true
isDraft: false
updatedOn: '2025-04-22T18:19:49.140Z'
---

<PublicPreview/>

<InfoBlock>

<DocsList title="What you will find on this page:">
  <p>Getting started resources</p>
  <p>How to connect</p>
  <p>Azure CLIs and SDKs</p>
  <p>Azure-focussed guides, sample apps, and tutorials</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="/docs/manage/azure">Neon on Azure</a>
  <a href="/docs/manage/azure-deploy">Deploy Neon on Azure</a>
</DocsList>

</InfoBlock>

## Azure CLIs and SDKs for Neon

Azure provides an Azure-native CLI and SDKs for working with the Neon platform. In addition, the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api), [CLI](/docs/reference/neon-cli), and [SDKs](https://neon.tech/docs/reference/sdk) are also available to you.

<DetailIconCards>

<a href="https://learn.microsoft.com/en-us/cli/azure/neon?view=azure-cli-latest" description="Manage your Neon Resource with the Azure CLI" icon="cli">Azure CLI — az neon</a>

<a href="https://learn.microsoft.com/en-us/java/api/overview/azure/neonpostgres?view=azure-java-preview" description="Manage your Neon Resource with the Azure SDK for Java" icon="code">Azure SDK for Java</a>

<a href="https://learn.microsoft.com/en-us/javascript/api/overview/azure/neonpostgres?view=azure-node-preview" description="Manage your Neon Resource with the Azure SDK for JavaScript" icon="code">Azure SDK for JavaScript</a>

<a href="https://learn.microsoft.com/en-us/dotnet/api/overview/azure/neonpostgres?view=azure-dotnet-preview" description="Manage your Neon Resource with the Azure SDK for .NET" icon="code">Azure SDK for .NET</a>

<a href="https://learn.microsoft.com/en-us/python/api/overview/azure/neonpostgres?view=azure-python-preview" description="Manage your Neon Resource with the Azure SDK for Python" icon="code">Azure SDK for Python</a>

<a href="https://learn.microsoft.com/en-us/dotnet/api/microsoft.azure.powershell.cmdlets.neonpostgres?view=az-ps-latest" description="Manage your Neon Resource with Powershell" icon="code">Powershell</a>

</DetailIconCards>

## Getting started

- [Get started with Neon Serverless Postgres on Azure](https://neon.tech/guides/neon-azure-integration) — A step-by-step guide to deploying Neon's serverless Postgres via the Azure Marketplace
- [Familiarize yourself with Neon](/docs/get-started-with-neon/signing-up) — Get to know the Neon platform and features by stepping through our official getting started guides

## Migrate data to Neon on Azure

- [Migrating data to Neon](/docs/import/migrate-intro) — learn how to move data to Neon from various sources using different migration tools and methods

## Connect to Neon

- [Connecting to Neon](/docs/connect/connect-intro) – Learn about connecting to a Neon database
- [Connect with Azure Service Connector](https://neon.tech/guides/azure-service-connector) - Connect Azure services to Neon
- [Integrate Neon Serverless Postgres with Service Connector](https://learn.microsoft.com/en-us/azure/service-connector/how-to-integrate-neon-postgres?tabs=dotnet) — Azure documentation for Service Connector

## AI

- [Multitenant RAG with Neon on Azure](https://neon.tech/blog/multitenant-private-ai-chat-with-neon-on-azure) - Build a tenant AI chat solution with Neon on Azure
- [Azure AI Language with Neon](https://neon.tech/guides/azure-ai-language) - Analyze customer feedback using Azure AI Language and store results in Neon
- [Building an AI chatbot with Neon](https://neon.tech/guides/azure-ai-chatbot) - Create AI-powered chatbots with Neon and Azure
- [Azure AI Search with Neon](https://neon.tech/guides/azure-ai-search) - Implement search functionality using Azure AI Search and Neon
- [AI-powered email assistant in Azure](https://neon.tech/blog/how-to-create-your-personal-ai-powered-email-assistant-in-azure) - Create a personal AI email assistant in Azure
- [SQL query assistant with .NET and Azure OpenAI](https://neon.tech/blog/building-sql-query-assistant-with-dotnet-azure-functions-openai) - Build an intelligent SQL query assistant with Neon, .NET, and Azure OpenAI
- [Generative feedback loops with Azure OpenAI](https://neon.tech/blog/generative-feedback-loops-with-neon-serverless-postgres-azure-functions-and-azure-openai) - Create generative feedback loops with Neon, Azure Functions, and Azure OpenAI
- [Build your first AI agent for Postgres on Azure](https://neon.tech/guides/azure-ai-agent-service) — Build an AI agent for Postgres using Azure AI Agent Service
- [Semantic Kernel](/docs/ai/semantic-kernel) — Build AI RAG and agentic workflows with Semantic Kernel and Neon

### Live AI demos

<DetailIconCards>

<a href="https://multiuser-rag-g0e0g3h6ekhtf7cg.germanywestcentral-01.azurewebsites.net/" description="Creates a Neon project with a vector storage per user—each user's data is completely isolated" icon="enable">Multi-user RAG in Azure</a>

<a href="https://rag-vrjtpx5tgrsnm-ca.wittyriver-637b2279.eastus2.azurecontainerapps.io/" description="Ask questions about data in a Neon database using React and FastAPI in Python" icon="enable">AI-Powered Neon Database Q&A Chatbot in Azure</a>

</DetailIconCards>

## Frameworks & languages

- [.NET with Neon](https://neon.tech/docs/guides/dotnet-npgsql) - Connect a .NET (C#) application to Neon
- [Entity Framework with Neon](https://neon.tech/docs/guides/dotnet-entity-framework) - Connect Entity Framework applications to Neon
- [Entity Framework schema migrations](https://neon.tech/docs/guides/entity-migrations) - Schema migration with Neon and Entity Framework
- [Azure DevOps Entity Framework migrations](https://neon.tech/guides/azure-devops-entity-migrations) - Manage Entity Framework migrations with Azure DevOps
- [ASP.NET with Neon and Entity Framework](https://neon.tech/guides/dotnet-neon-entity-framework) - Build ASP.NET Core applications with Neon and Entity Framework
- [RESTful API with ASP.NET Core and Swagger](https://neon.tech/guides/aspnet-core-api-neon) - Build APIs with ASP.NET Core, Swagger, and Neon
- [Neon read replicas with Entity Framework](https://neon.tech/guides/read-replica-entity-framework) - Scale .NET applications with Entity Framework and Neon read replicas

## Functions & serverless

- [Query Postgres from Azure Functions](https://neon.tech/guides/query-postgres-azure-functions) - Connect from Azure Functions to Neon
- [Building a serverless referral system](https://neon.tech/guides/azure-functions-referral-system) - Create a referral system with Neon and Azure Functions
- [Building a robust JSON API with TypeScript](https://neon.tech/guides/azure-functions-hono-api) - Build APIs with TypeScript, Postgres, and Azure Functions
- [Azure Static Web Apps with Neon](https://neon.tech/guides/azure-todo-static-web-app) - Building Azure Static Web Apps with Neon
- [Azure Logic Apps with Neon](https://neon.tech/guides/azure-logic-apps) — Integrate Neon with Azure Logic Apps

## Security & access control

- [Row-level security with Azure AD](https://neon.tech/docs/guides/neon-rls-azure-ad) - Implement row-level security with Azure Active Directory
