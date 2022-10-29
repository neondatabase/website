---
title: Get started with branching
enableTableOfContents: true
isDraft: true
---

This topic describes how to get started with branching. It walks you through creating and connecting to a branch.

A branch is a clone of your database that you are free play with and modify without affecting the parent database. Creating a branch is fast and easy, and when you are finished with it, it can be removed just as quickly.

You can create a branch using the Neon Console or Neon API. In this topic, we'll cover how to create a branch using the Neon Console. For Neon API branching instructions, see X.

Before you can create a branch, you must have a Neon project to branch from. If you do not already have a Neon project, see X.

## Creating a branch

To create a branch:

1. In the Neon Console, select a project from the project drop-down list at the top of the console.
2. Select the **Branches** tab.
2. Click **New Branch** to open the branch creation page.
3. Enter a name for the branch.
4. Select a parent branch. You can branch from your Neon project's `main` branch or a previously created branch.
5. Select one of the following branching options:
    - **Head**: Creates a branch with data up to the current point in time.
    - **Time**: Creates a branch with data up to the specified date and time.
    - **LSN**: Creates a branch with data up to the specified [Log Sequence Number (LSN)](../../reference/glossary/#lsn).
6. Click **Create Branch**.

## Connecting to a branch

Now that you have created a branch, how to do you connect to it from a client or application? You can connect to a branch endpoint using a connection string, as you would connect to any other Neon project database. The following steps describe how to connect to a branch using `psql`.

_**Note:**_ You can also query branch from the Neo Console's SQL Editor. See [Query from psql](/query-with-neon-sql-editor).

You can obtain a branch connection string from the **Connection Details** widget on the project dashboard.

1. In the Neon Console, select a project from the project drop-down list at the top of the console.
3. On the project **Dashboard**, under **Connection Details**, select the branch and database to connect to, and a user you want to connect with.
4. Copy the connection string.
5. Add your password to the connection string as shown below, and connect with `psql`:

  ```bash
  psql postgres://web_access:<password>@ep-snowy-butterfly-311850.cloud.stage.neon.tech/main
  ```

If you have misplaced the password for your branch endpoint, you can reset it. Users and passwords are managed on the **Settings** tab in the Neon Console.

If you want to connect to a branch from an application, the **Connection Details** widget on the project **Dashboard** provides connection details for various languages and frameworks.

## Next steps

For more information about branches, including how to view them, delete them, and use them in your development workflows, see X.
