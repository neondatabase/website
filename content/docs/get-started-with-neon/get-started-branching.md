---
title: Get started with Branching
enableTableOfContents: true
isDraft: false
---

This topic describes how to get started with Neon's branching feature, which allows you to branch your data in the same way that you branch your code.

A branch is a clone of your data that you are free to play around with and modify without affecting the originating data.
For more information about what branches are and how to use them in your development workflows, see [Branching](../../conceptual-guides/branching).

_Neon Branching capabilities are not yet publicly available. If you would like to try this feature, reach out to [iwantbranching@neon.tech](mailto:iwantbranching@neon.tech) describing your use case and requesting that Neon enable branching for your account._

You can create and manage branches using the Neon Console or Neon API. In this topic, we cover branching using the Neon Console.

Before you can create a branch, you must have a Neon project. If you do not have a Neon project, see [Setting up a project](../setting-up-a-project).

## Create a branch

To create a branch:

1. In the Neon Console, select a project.
2. Select the **Branches** tab.
3. Click **New Branch** to open the branch creation dialog.
![Create branch dialog](./images/create_branch.png)
4. Enter a name for the branch.
5. Select a parent branch. You can branch from your Neon project's `main` branch or a previously created branch. Every Neon project is created with a default branch called `main`.  
6. Select one of the following branching options:
    - **Head**: Creates a branch with data up to the current point in time (the default).
    - **Time**: Creates a branch with data up to the specified date and time.
    - **LSN**: Creates a branch with data up to the specified [Log Sequence Number (LSN)](../../reference/glossary/#lsn).
7. Click **Create Branch** to create your branch.

You are directed to the **Branches** tab where you are shown the details for your new branch.

![Branch details](./images/branch_details.png)

Each branch is created with an endpoint, which is the compute instance associated with the branch. To connect to a branch, you must connect to the endpoint. For instructions, see [Connect to a branch](#connect-to-a-branch). The hostname of the branch endpoint is found on the branch details page, as shown in the example above. A endpoint hostname starts with an `ep-` prefix. You can also find an endpoint hostname in the branch connection string in the **Connection Details** widget on the project **Dashboard**.

## View branches

To view the branches in a Neon project:

1. In the Neon Console, select a project.
2. Select the **Branches** tab to view the branches for the project.
3. Select a branch from the table to view details about the branch, including the branch's endpoint hostname.

The **Branches** widget on the project **Dashboard** also lists the branches in a Neon project. Selecting **Manage** from the **Branches** widget directs you to the **Branches** page, where you can view and manage branches.

## Connect to a branch

Now that you have created a branch, how do you connect to it? You can connect to a branch using a connection string, as you would when connecting to any Neon database. The following steps describe how to connect to a branch using `psql`.

_**Note:**_ You can also query a branch from the Neon SQL Editor. For instructions, see [Query with Neon's SQL Editor](../query-with-neon-sql-editor).

1. In the Neon Console, select a project.
2. On the project **Dashboard**, under **Connection Details**, select the branch, the database, and the user you want to connect with.
![Connection details widget](./images/connection_details.png)
3. Copy the connection string. A connection string includes your user name, the endpoint hostname, and the database name. The endpoint is the compute instance associated with the branch.
5. Add your password to the connection string as shown below, and connect with `psql`. You can connect using the same user and password that you use to connect to the parent branch.

  ```bash
  psql postgres://casey:<password>@ep-patient-wildflower-627498.cloud.neon.tech/main
  ```

_**Note:**_ The endpoint hostname can also be found on the **Branches** page. For instructions, see [View branches](#view-branches).

If you want to connect to a branch from an application, the **Connection Details** widget on the project **Dashboard** also provides connection examples for various languages and frameworks.

## Delete a branch

Deleting a branch is a permanent action. Deleting a branch also deletes the branch endpoint, which is the compute instance associated with the branch.

To delete a branch:

1. In the Neon Console, select a project.
2. Select the **Branches** tab.
3. Select a branch from the table.
3. Click **Delete**.
4. On the **Delete the branch?** dialog, click **Delete**.
