---
title: Neon on Azure
subtitle: Use Neon on Azure as a Native ISV Service
enableTableOfContents: true
isDraft: false
updatedOn: '2025-04-20T13:56:04.997Z'
---

<PublicPreview/>

[Neon is available on the Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/neon1722366567200.neon_serverless_postgres_azure_prod?tab=Overview) as an [Azure Native ISV Service](https://learn.microsoft.com/en-us/azure/partner-solutions/partners), allowing you to work with Neon the same way you work with other native solutions from Microsoft. Billing is handled directly through Azure, and you can choose from Neon pricing plans when deploying the service.

## Key benefits
Deploying Neon natively on Azure lets you manage your Neon organization alongside the rest of your Azure infrastructure. Key benefits include:

- **Azure-native management**: Provision and manage Neon organizations directly from the Azure portal.
- **Single sign-on (SSO)**: Access Neon using your Azure credentials—no separate logins required.
- **Consolidated billing**: Simplify cost management with unified billing through the Azure Marketplace.
- **Integrated workflows**: Use the Azure CLI and SDKs to manage Neon as part of your regular workflows, integrated with your existing Azure resources.

    <Admonition type="note">
    Management of Neon projects, databases, and branches is supported through the Neon Console, CLI, and API. However, this public preview lays the groundwork for further deeper between Neon and Azure, including integration with other Azure native services.
    </Admonition>

### Getting started

<DetailIconCards>

<a href="/docs/azure/azure-deploy" description="Deploy Neon Postgres as Native ISV Service from the Azure Marketplace" icon="enable">Deploy Neon on Azure</a>

<a href="/docs/introduction/billing-azure-marketplace" description="Manage billing for the Neon Native ISV Service on Azure" icon="enable">Manage billing on Azure</a>

<a href="/docs/azure/azure-manage" description="How to manage your Neon Native ISV Service on Azure" icon="cli">Manage Neon on Azure</a>

<a href="/docs/azure/azure-develop" description="Resource for developing with Neon on Azure" icon="code">Develop with Neon on Azure</a>

</DetailIconCards>
