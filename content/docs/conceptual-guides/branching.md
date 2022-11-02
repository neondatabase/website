---
title: Branching
enableTableOfContents: true
redirectFrom:
  - /docs/conceptual-guides/branches
---

<a id="branches-coming-soon/"></a>

Neon allows you to instantly branch your data in the same way that you branch your code. You can quickly and cost-effectively branch your data for development, testing, staging, and various of other purposes, enabling you to improve developer productivity and optimize continuous integration and delivery (CI/CD) pipelines. See [Branching workflows](#branching-workflows) for a discussion of different ways you can integrate branching into your development workflows.

_Neon Branching capabilities are not yet publicly available. If you would like to try this feature, reach out to [iwantbranching@neon.tech](mailto:iwantbranching@neon.tech) describing your use case and requesting that Neon enable branching for your account._

### What is a branch?

A branch is a copy-on-write clone of your database. You can create a branch from a current or past state of your data. For example, you can create a branch that includes all data up to the current point in time or up to a past point in time.

A branch is isolated from the originating data, so you are free to play around with it, modify it, and delete it when it's no longer needed. Changes to a branch are independent of the originating data and vice versa. A branch and its parent share the same history but diverge at the point of branch creation. Writes to a branch are saved as an independent delta.

Creating a branch does not increase load on the parent branch or affect it in any way, which means that you can create a branch at any time without impacting the performance of your production system.

An endpoint is created for each branch, which is the compute instance associated with the branch. Branch endpoints are read-write. When you connect to a branch from a client or application, you are connecting to the branch endpoint.

## Create a branch

Creating a branch requires that you have a Neon project. For information about creating a project, see [Setting up a project](/docs/getting-started-with-neon/setting-up-a-project).

To create a branch:

1. In the Neon Console, select a project.
2. Select the **Branches** tab.
2. Click **New Branch** to open the branch creation page.
![Create branch dialog](./images/create_branch.png)
3. Enter a name for the branch.
4. Select a parent branch. You can branch from your Neon project's `main` branch or a previously created branch. Each Neon project is created with a default branch called `main`.
5. Select one of the following branching options:
    - **Head**: Creates a branch with data up to the current point in time.
    - **Time**: Creates a branch with data up to the specified date and time.
    - **LSN**: Creates a branch with data up to the specified Log Sequence Number (LSN).
6. Click **Create Branch**.

You are directed to the **Branches** tab where you are shown the details for your new branch.

## View branches

To view the branches associated with a Neon project:

1. In the Neon Console, select a project from the project drop-down list.
2. Select the **Branches** tab to view the branches for the project.
![Branches page](./images/view_branches.png)
3. Select a branch from the table to view details about the branch.

The **Branches** widget on the project **Dashboard** also lists the branches associated with a Neon project. Selecting **Manage** from the **Branches** widget directs you to the **Branches** page, where you can view and manage branches.

## Delete a branch

Deleting a branch is a permanent action. Deleting a branch also deletes the branch endpoint, which is the compute instance associated with the branch.

To delete a branch:

1. In the Neon Console, select a project from the project drop-down list.
2. Select the **Branches** tab.
3. Select a branch from the table.
3. Click **Delete**.
4. On the **Delete the branch?** dialog, click **Delete**.

## Connect to a branch

This topic describes how to connect to a branch using `psql`.

_**Note:**_ You can also query branch from the Neon SQL Editor. See [Query with Neon's SQL Editor](../../get-started-with-neon/query-with-neon-sql-editor).

You can obtain a branch connection string from the **Connection Details** widget on the project dashboard.

1. In the Neon Console, select a project from the project drop-down list.
3. On the project **Dashboard**, under **Connection Details**, select the branch, database, and user you want to connect with.
4. Copy the connection string. A connection string includes your user name, the endpoint name, and database name. The endpoint is the compute instance associated with the branch.
5. Obtain a password for your branch by navigating to **Settings** > **Users**. Select the user you want to connect with and click **Reset password**.
6. Add your password to the connection string as shown and connect with `psql`:

  ```bash
  psql postgres://<user>:<password>@ep-snowy-butterfly-311850.cloud.stage.neon.tech/main
  ```

If you want to connect to a branch from an application, the **Connection Details** widget on the project **Dashboard** provides connection examples for various languages and frameworks.

## Branching workflows

You can use Neon's branching feature in variety development workflows, a few of which are discussed below:

### Development

You can create a branch of your production database that developers are free to play with and modify. A branch has access to all of the data that existed at the time the branch was created, eliminating the setup time required to deploy and maintain a development database. Branching is so easy and cost-effective that you can create a branch for each developer to work on. For example, you can create branches from a primary development branch to assign tasks to be worked on in parallel.

### Testing

Branching enables testers to use the most recent production data. Testers can create new database branches for testing schema changes, validating new queries, or testing potentially destructive queries before deploying them to production. A branch is isolated from its parent branch but has all of the parent branch's data up to the point of branch creation, which eliminates the effort involved in hydrating a database for testing. Testers can also run tests on separate branches in parallel, with each branch having dedicated compute resources.

Another testing scenario enabled by branching is creating a branch from a past point in time to track down a failure or data quality issue. Neon permits creating a branch that includes data up to a user-specified time or Log Sequence Number (LSN). For example, you can create and dispose of as many point-in-time database branches as necessary to determine when an issue first occurs.

### Staging

With Neon's branching capabilities, you can create a staging database by branching your production database. Using the Neon API, you can automate the creation of a database branch for every pull request in your CI/CD pipeline.

### Data recovery

If you lose data due to an unintended deletion or some other event, you can create a branch with data as it existed before the event occurred allowing you to recover the lost data.

### Analytics

You can run costly, long-running queries on an isolated branch of your production data, each with its own compute resources. With automation scripts, you can create and dispose of branches on a defined schedule to ensure that queries always run on an up-to-date copy of your production data.

### Machine Learning

You can create point-in-time branches to ensure repeatability when training machine learning models.
