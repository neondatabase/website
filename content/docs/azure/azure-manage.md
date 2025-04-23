---
title: Manage Neon on Azure
subtitle: Instructions for managing your Neon resource on Azure
enableTableOfContents: true
isDraft: false
updatedOn: '2025-04-20T14:00:23.877Z'
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

## Create additional Neon projects

All Neon plans, including the Free plan, support multiple Neon projects. You can add Neon projects to an existing Neon resource from the **Projects** page in Azure or from the Neon Console.

In Azure, navigate to the **Projects** page and select **Create Project**.

![Project page in Neon](/docs/introduction/azure_project_form.png)

See [Create a project](/docs/manage/projects#create-a-project) for how to create a project from the Neon Console.

## Create branches

A branch is an independent copy of your database that you can use for development or testing. It will not increase storage until you modify data or the branch falls out of your project's [restore window](/docs/manage/projects#configure-your-restore-window). Changes made on a branch do not affect the parent database. To learn more, see [Branching](/docs/introduction/branching).

To create branches in the Azure Portal:

1. Navigate to your Neon resource and select the **Projects** page.
1. Select your Neon project. You should see your existing branches. 
1. To create a new branch, select **Create branch** to open the **Create new branch** drawer.
1. Specify a branch name, select the parent branch, and select an **Include data up to** option. You can include current data or data as it existed at a specified time.
1. After making your selections, click **Create**.

You now have an independent and isolated copy of your database with its own compute resources. For how to integrate branching into your developer workflow, see our [Database branching workflow primer](https://neon.tech/docs/get-started-with-neon/workflow-primer).

You can also create branches in the Neon Console. See [Create a branch](/docs/manage/branches#create-a-branch) for instructions.
## Delete branches

You can delete branches in the Azure Portal or the Neon Console. We'll cover branch deletion in the Azure Portal below. For Neon Console instructions, see [Delete a branch](/docs/manage/branches#delete-a-branch).

Important points about branch deletion:
- A branch deletion action cannot be undone.
- You cannot delete a branch that has children. You need to delete any child branches first.

To delete a branch in the Azure Portal:

1. Navigate to your Neon resource,
1. Select your Neon project. You should see your existing branches.
1. Select the branch you want to delete.
1. Select **Delete branch** to open the **Delete a branch** drawer. You'll need to type the branch name to confirm the deletion.
1. Click **Delete** and confirm.

## Connect to a database

You can connect to your Neon database using a Postgres database connection URL. 

To find a connection URL:

1. Navigate to your Neon resource.
1. Select **Projects** > **Settings** > **Connect**.
1. On the **Connect** page, use the drop-down menus to select a Neon project and branch. 

  A connection string is provided. By default, the connection string uses the first database and role created on the branch. To connect with a different database and role, you can modify the connection string manually or copy one from the Neon Console. 

  You can toggle **Connection pooling** to use a pooled connection string, which supports up to 10,000 concurrent connections. A pooled connection string is recommended for most use cases. Use a direct connection for `pg_dump`, session-dependent features, or schema migrations. For more about pooled connections, see [Connection pooling](docs/connect/connection-pooling).

For more about connecting to your Neon database, see [Connect from any app](/connect/connect-from-any-app).

## Transfer projects to an Azure-created Neon organization

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

## Delete a Neon Resource in Azure

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

## Troubleshoot

If you encounter issues, check the documentation in Azure's troubleshooting guide for Neon: [Troubleshoot Neon Serverless Postgres](https://learn.microsoft.com/en-us/azure/partner-solutions/neon/troubleshoot). If you still need help, contact [Neon Support](/docs/introduction/support).
