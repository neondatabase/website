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

## Creating additional Neon projects

All Neon plans, including the Free plan, support multiple Neon projects. You can add Neon projects to an existing Neon resource from the **Projects** page in Azure or from the Neon Console.

In Azure, navigate to the **Projects** page and select **Create Project**.

![Project page in Neon](/docs/introduction/azure_project_form.png)

See [Create a project](/docs/manage/projects#create-a-project) for how to create a project from the Neon Console.

## Creating branches

In Neon, you can branch your database. A branch is an independent copy of your database that you can use for development or testing. It will not increase storage until you modify data or the branch falls out of your project's restore window. Changes made on a branch do not affect the parent database. To learn more, see [Branching](/docs/introduction/branching).

You can create branches in the Azure Portal or the Neon Console. We'll cover branch creation in the Azure portal below. For Neon Console instructions, see [Create a branch](/docs/manage/branches#create-a-branch). 

To create branches in the Azure Portal:

1. Navigate to your Neon resource and select the **Projects** page.
1. Select your Neon project. You should see your existing branches. 
1. To create a new branch, select **Create branch** to open the **Create new branch** drawer.
1. Specify a branch name, select the parent branch, and select an **Include data up to** option. You can include current data or data as it existing at a specified time.
1. After making your selections, click **Create**.

You now have an independent and isolated copy of your database with its own compute resources. For how to integrate branching into your developer workflow, see our [Database branching workflow primer](https://neon.tech/docs/get-started-with-neon/workflow-primer).


## Deleting branches

You can delete branches in the Azure Portal or the Neon Console. We'll cover branch deletion in the Azure Portal below. For Neon Console instructions, see [Delete a branch](/docs/manage/branches#delete-a-branch).

Important points about branch deletion:
- A branch deletion action cannot be undone.
- You cannot delete a branch that has children. You need to delete any child branches first.

To delete branches in the Azure Portal:

1. Navigate to your Neon resource and select the **Projects** page.
1. Select your Neon project. You should see your existing branches.
1. Select the branch you want to delete.
1. Select **Delete branch** to open the **Delete a branch** drawer. You'll need to type the branch name to confirm the deletion.
1. Click **Delete** and confirm.

## Connect to a database

To connect to a database in Neon, you can use a Postgres database connection URL. You can find your database connection URL by navigating to 


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
