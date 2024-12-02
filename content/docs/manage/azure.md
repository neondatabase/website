---
title: Neon on Azure
enableTableOfContents: true
tag: new
isDraft: false
updatedOn: '2024-01-12T16:49:12.349Z'
---

<PublicPreview/>

Neon offers the following deployment options on Azure:

1. **Deploy Neon as an Azure Native ISV Service** — use Neon as a native Azure service, integrated with the [Azure portal](https://portal.azure.com/#home), [CLI](https://learn.microsoft.com/en-us/cli/azure/), and [SDKs](https://azure.microsoft.com/en-us/downloads/). This option enables you to manage Neon as part of your Azure infrastructure with unified billing in Azure.
2. **Create Neon projects in Azure regions (no integration)** — create a Neon project in an Azure region without using the native Azure integration. Project creation and billing is managed through Neon. There is no difference from a Neon project created in an AWS region — your Neon project simply resides in an Azure region instead of AWS region.

## Deploy Neon as an Azure Native ISV Service

This option integrates Neon natively into Azure, letting you manage your Neon organization alongside the rest of your Azure infrastructure. Key benefits include:

- **Azure-native management**: Provision and manage Neon organizations directly from the Azure portal.
- **Single sign-on (SSO)**: Access Neon using your Azure credentials—no separate logins required.
- **Consolidated billing**: Simplify cost management with unified billing through the Azure Marketplace.
- **Integrated workflows**: Use the Azure CLI and SDK to manage Neon organizations as part of your regular workflows, integrated with your existing Azure resources.

    <Admonition type="note">
    Management of Neon projects, databases, and branches is supported through the Neon Console, CLI, and API. However, this public preview lays the groundwork for further deeper between Neon and Azure, including integration with other Azure native services.
    </Admonition>

### Get started

To begin using **Neon as an Azure Native ISV Service**, refer to our [Azure Marketplace](/docs/introduction/billing-azure-marketplace) instructions.

## Create Neon projects in Azure regions (no integration)

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
