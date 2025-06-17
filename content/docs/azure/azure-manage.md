---
title: Manage Neon on Azure
subtitle: Instructions for managing your Neon resource on Azure
enableTableOfContents: true
isDraft: false
updatedOn: '2025-06-02T15:04:05.564Z'
---

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
1. To create a new branch, select **Create branch** to open the **Create new Branch** drawer.
   ![create branch drawer](/docs/azure/azure_create_branch_drawer.png)

1. Specify a branch name and select a parent branch, and click **Create**.

You now have an independent and isolated copy of your parent branch with its own compute resources.

The branch page shows the following information for each branch:

![Branch page](/docs/azure/azure_branch_page.png)

| **Column**          | **Description**                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Branch**          | The name of the database branch.                                                                                                      |
| **Parent**          | The parent branch from which the branch was created.                                                                                  |
| **Compute hours**   | Total [compute hours](/docs/reference/glossary#compute-hours) used by the branch's primary compute.                                   |
| **Primary Compute** | The allocated autoscaling range, in [Compute Units (CU)](/docs/reference/glossary#compute-unit-cu), for the branch's primary compute. |
| **Data size**       | The [logical size](/docs/reference/glossary#logical-data-size) of the data stored in the branch.                                      |

To learn about integrating branching into your developer workflow, see our [Database branching workflow primer](/docs/get-started-with-neon/workflow-primer).

You can also create branches in the Neon Console. See [Create a branch](/docs/manage/branches#create-a-branch) for instructions.

## Delete branches

Important points about branch deletion:

- A branch deletion action cannot be undone.
- You cannot delete a branch that has children. You need to delete the child branches first.

To delete a branch in the Azure Portal:

1. Navigate to your Neon resource.
1. Select your Neon project. You should see your existing branches.
1. Select the branch you want to delete.
1. Select **Delete Neon branch** to open the **Delete Branch** drawer. You'll need to type the branch name to enable the **Delete** button.
1. Click **Delete** and confirm.

You can also delete branches in the Neon Console. For instructions, see [Delete a branch](/docs/manage/branches#delete-a-branch).

## Connect to a database

You can connect to your Neon database using a Postgres database connection URL.

To retrieve a connection URL for your Neon database:

1. Navigate to your Neon resource.
1. Select **Settings** > **Connect**.
1. On the **Connect** page, use the drop-down menus to select a Neon **Project**, **Branch**, **Database**, **Role**, and **Compute**.

   ![Connection string UI](/docs/azure/azure_connection_page.png)

   The values you select define the connection string for your database:

   | Value        | Description                                                                                                                                                                            |
   | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Project**  | The [Neon project](/docs/reference/glossary#project) you want to connect to. A Neon project includes databases and branches.                                                           |
   | **Branch**   | A [branch](/docs/reference/glossary#branch) within your Neon project where your database resides.                                                                                      |
   | **Database** | The name of the [Postgres database](/docs/reference/glossary#database) you want to connect to.                                                                                         |
   | **Role**     | The [Postgres role](/docs/reference/glossary#postgres-role) (user) you want to connect with.                                                                                           |
   | **Compute**  | The compute that runs Postgres. Usually "Primary"—this is the read-write compute for the branch, but you may also have [read replica](/docs/reference/glossary#read-replica) computes. |

You can toggle the **Connection pooling** option to use a pooled connection string, which supports up to 10,000 concurrent connections. A pooled connection string is recommended for most use cases. Use a direct connection for `pg_dump`, session-dependent features, or schema migrations. For more about pooled connections, see [Connection pooling](/docs/connect/connection-pooling).

For more about connecting to your Neon database, see [Connect from any app](/docs/connect/connect-from-any-app).

## Transfer projects to an Azure-created Neon organization

You can transfer existing Neon projects to an Azure-created organization, but note these restrictions:

- The Neon project you are transferring must be in an [Azure region](/docs/introduction/regions#azure-regions). Azure-created Neon organizations do not support projects created in [AWS regions](/docs/introduction/regions#aws-regions).
- The billing plan of the Azure-managed organization must match or exceed the billing plan of the organization you are transferring projects from. For example, attempting to transfer projects from a Neon paid plan organization to a Free plan Azure-managed organization will result in an error.

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
