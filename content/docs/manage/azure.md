---
title: Neon on Azure
enableTableOfContents: true
tag: new
isDraft: false
updatedOn: '2024-01-12T16:49:12.349Z'
---

<PublicPreview/>

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

## Related resources

<TechnologyNavigation open>

<a href="/docs/guides/dotnet-npgsql" title=".NET" description="Connect a .NET (C#) application to Neon" icon="dotnet"></a>

<a href="https://neon.tech/guides/query-postgres-azure-functions" title="Azure Functions" description="Connect from Azure Functions to Neon" icon="azure"></a>

<a href="/docs/guides/dotnet-entity-framework" title="Connect from Entity Framework" description="Connect a Dotnet Entity Framework application to Neon" icon="entity"></a>

<a href="/docs/guides/entity-migrations" title="Entity Framework Schema Migrations" description="Schema migration with Neon and Entity Framework" icon="entity"></a>

<a href="/docs/import/migrate-from-azure-postgres" title="Replicate data from Azure PostgreSQL" description="Replicate data from Azure PostgreSQL to Neon" icon="azure"></a>

<a href="https://neon.tech/guides/dotnet-neon-entity-framework" title="ASP.NET with Neon and Entity Framework" description="Building ASP.NET Core Applications with Neon and Entity Framework Core" icon="entity"></a>

<a href="https://neon.tech/guides/aspnet-core-api-neon" title="ASP.NET Core, Swagger, and Neon" description="Building a RESTful API with ASP.NET Core, Swagger, and Neon" icon="entity"></a>

<a href="https://neon.tech/guides/read-replica-entity-framework" title="Neon Read Replicas with Entity Framework" description="Scale your .NET application with Entity Framework and Neon Postgres Read Replicas" icon="entity"></a>

</TechnologyNavigation>
