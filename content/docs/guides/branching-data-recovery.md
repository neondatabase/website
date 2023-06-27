---
title: Branching — Point-in-time recovery (PITR)
subtitle: Learn how to recover your database to previous state using Neon's database branching feature
enableTableOfContents: true
isDraft: true
---

A Neon project has a default 7-day data retention window and the ability to create branches at specific points in time or to a specific Log Sequence Number (LSN). The process of recovering your database from an unwanted state due to a faulty query is a form of Point-in-time recovery (PITR).

This guide here's provides a high-level example of how you could recover your database to point in time before the table was deleted using Neon's branching feature.

## Identify the point in time or LSN before the faulty query

Suppose that you have a table named `orders` that was erroneously deleted by a query that you ran in the Neon SQL Editor. Since the query was run from the Neon **SQL Editor**, you can check the **History** for the date and time you ran the query.

![Find query time](/docs/tutorial/delete_query_time.png)

## Create a database branch at the desired point in time

Now that you know when the data loss occurred, you can restore your data to a point in time just before that by creating a database branch.

1. Navigate to the **Branches** page in the Neon Console.
![Branches page](/docs/tutorial/branches_page.png)
1. Click **New Branch** to open the branch creation dialog.
1. Enter a name for the branch.
1. Select the parent branch. The data loss occurred on your project's [primary branch](../reference/glossary/#primary-branch) (`main`), so select that branch as the parent.
1. Select the **Time** option to create a branch with data up to a specific date and time. You determined that the data loss occurred on March 20, 2023 at 8:58am, so you set it to 8:57am, just before you ran the `DELETE` query.
![Create a point in time branch](/docs/tutorial/create_branch_time.png)
1. Click **Create Branch** to create your branch. You should see a dialog similar to the following with the connection details for your new branch.
![New branch connection details](/docs/tutorial/new_branch_connection_details.png)

## Connect to your branch

Connecting to a database in a branch requires connecting via a compute endpoint associated with the branch. The following steps describe how to connect using `psql` and a connection string obtained from the Neon Console.

<Admonition type="tip">
You can also query the databases in a branch from the Neon SQL Editor. For instructions, see [Query with Neon's SQL Editor](../get-started-with-neon/query-with-neon-sql-editor).
</Admonition>

1. In the Neon Console, select a project.
2. On the project **Dashboard**, under **Connection Details**, select the branch, the database, and the role you want to connect with.
![Connection details widget](/docs/connect/connection_details.png)
3. Copy the connection string. A connection string includes your role name, the compute endpoint hostname, and database name.
4. Connect with `psql` as shown below.

  <CodeBlock shouldWrap>

  ```bash
  psql postgres://daniel:<password>@ep-mute-rain-952417.us-east-2.aws.neon.tech/neondb
  ```

  </CodeBlock>

## Verify the data

Check to see if the lost data is now present. For instance, if you lost an `orders` table, you might run a query like:

```sql
SELECT * FROM orders LIMIT 10;
```

## Change your primary branch

You now have a production branch with lost data and recovery branch with the data in the desired state. You could dump data from the recovery branch and load it into the production branch using dump and restore utilities like `pg_dump` and `pg_restore` or you can make the recovery branch your new primary branch.

To make the recovery branch your new primary:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.
3. Select a branch from the table to view details about the branch.
4. On the branch details page. select **Set as Primary**.

## Update your connections

To use your new primary branch with your application, update your application connection details. To do so, replace your current connection details with the connection details for your new primary branch, which you retrieved earlier when connecting to your branch.

For another data recovery example using Neon's branching feature, refer to [Time Travel with Serverless Postgres](https://neon.tech/blog/time-travel-with-postgres). This example uses a bisect script and the Neon API to create branches to recover to the last known good.
