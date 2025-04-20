---
title: Manage Neon on Azure
subtitle: Instructions for managing your Neon resource on Azure
enableTableOfContents: true
isDraft: false
updatedOn: '2025-04-08T22:55:27.451Z'
---

<PublicPreview/>

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to create additional Neon projects on Azure</p>
<p>How to transfer Neon projects to Azure</p>
<p>How to delete a Neon resource on Azure</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="/docs/manage/azure">Neon on Azure</a>
  <a href="/docs/manage/azure-deploy">Deploying Neon on Azure</a>
  <a href="/docs/manage/azure-develop">Develop with Neon on Azure</a>
</DocsList>

</InfoBlock>

This topic describes how to manage your Neon resource on Azure. It covers how to create additional Neon projects, how to transfer Neon projects to an Azure-created Neon organization, how to delete a Neon resource, and troubleshooting.

## Creating additional Neon projects

All Neon plans, including the Free plan, support multiple Neon projects. You can add Neon projects to an existing Neon resource from the **Projects** page in Azure or from the Neon Console.

In Azure, navigate to the **Projects** page and select **Create Project**.

![Project page in Neon](/docs/introduction/azure_project_form.png)

See [Create a project](/docs/manage/projects#create-a-project) for how to create a project from the Neon Console.

## Transfer existing Neon projects to an Azure-created Neon organization

You can transfer existing Neon projects to an Azure-created organization, but note these restrictions:

- The Neon project you are transferring must belong to a personal Neon account, not an organization.
- The Neon project you are transferring must be in an [Azure region](/docs/introduction/regions#azure-regions). Azure-created Neon organizations do not support projects created in [AWS regions](/docs/introduction/regions#aws-regions).
- The billing plan of the Azure-managed organization must match or exceed the billing plan of the personal Neon account you are transferring projects from. For example, attempting to transfer projects from a Neon paid plan personal account to a Free plan Azure-managed organization will result in an error.

For detailed transfer steps, see [Transfer projects to an organization](/docs/manage/orgs-project-transfer).

If the restrictions above prevent you from transferring your project, consider these options:

- Open a [support ticket](https://console.neon.tech/app/projects?modal=support) for assistance with transferring your Neon project (supported only for projects that reside in [Azure regions](/docs/introduction/regions#azure-regions)). If you're on the Neon Free Plan and can't open a support ticket, you can email Neon support at `support@neon.tech`.
- Create a new Neon project in an Azure-managed organization and migrate your database using one of these options:
    - [Neon Import Data Assistant](/docs/import/import-data-assistant)
    - [pg_dump and pg_restore](/docs/import/migrate-from-postgres#run-a-test-migration)

## Deleting a Neon Resource in Azure

If you no longer need your Neon resource, you can delete it to stop all associated billing through the Azure Marketplace.

<Admonition type="important">
Deleting a Neon resource from Azure removes the Neon Organization and all Neon projects and data associated with that resource.
</Admonition>

Follow these steps to delete the resource:

1. In the Azure portal, select the Neon resource you want to delete.
2. On the **Overview** page, select **Delete**.
3. Confirm the deletion by entering the resource's name.
4. Choose the reason for deleting the resource.
5. Select **Delete** to finalize.

Once the resource is deleted, billing will stop immediately, and the Neon Organization and all Neon projects and data associated with that resource will be removed.

## Troubleshooting

If you encounter issues, check the documentation in Azure's troubleshooting guide for Neon: [Troubleshoot Neon Serverless Postgres](https://learn.microsoft.com/en-us/azure/partner-solutions/neon/troubleshoot). If you still need help, contact [Neon Support](/docs/introduction/support).
