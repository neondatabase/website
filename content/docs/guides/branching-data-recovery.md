---
title: Branching — Point-in-time recovery (PITR)
subtitle: Recover your data to previous state using Neon's branching feature
enableTableOfContents: true
---

A Neon project has a default 7-day data retention window, which enables creating a branch that reflects the state of your data at a past time. You can use this capability to recover lost data, which is a form of Point-in-time recovery (PITR).

This guide provides an example of how to recover your data to point in time before a data loss occurred using Neon's branching feature.

## Create a point-in-time branch

Suppose that you have a table named `orders` that was accidentally deleted by a faulty query. If you know the time you ran the faulty query or when the data loss was first discovered, you can create a point-in-time branch with the data as it existed before the data loss occurred.

To create a point-in-time branch:

1. Navigate to the **Branches** page in the Neon Console.
1. Click **Create branch** to open the branch creation dialog.
1. Enter a name for the branch. You can call it `recovery_branch`, for example.
    ![Data recovery create branch dialog](/docs/guides/data_recodver_create_branch.png)
1. For the **Parent branch**, select the branch where the data loss occurred.
1. Select the **Time** option to create a branch with data up to a specific date and time. For example, if the data loss occurred on July 11, 2023 at 10:01am, set the time to July 11, 2023, at 10:00am, just before the faulty query was run.
1. Leave the **Create compute endpoint** option selected. A compute endpoint is required to connect to the new branch.
    <Admonition type="note">
    Pro plan users can configure the amount of vCPU and RAM for a compute endpoint to define the amount of processing power for the branch. For more information, see [Compute size and Autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration).
    </Admonition>
1. Click **Create Branch** to create your branch.

## Connect to your branch

Connecting to your newly created branch requires connecting via the branch's compute endpoint. The following steps describe how to connect using `psql` and a connection string obtained from the Neon Console.

<Admonition type="tip">
You can also query the databases in a branch from the Neon SQL Editor. For instructions, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor).
</Admonition>

To connect to your branch:

1. In the Neon Console, select your project.
2. On the project **Dashboard**, under **Connection Details**, select the `sales_query` branch you, the database, and the role you want to connect with.
![Connection details widget recovery branch](/docs/guides/data_recovery_connection_details.png)
3. Copy the connection string. A connection string includes your role name, password, the compute endpoint hostname, and database name.
4. Connect with `psql`. Your connection string will look something like this:

   <CodeBlock shouldWrap>

   ```bash
   postgres://daniel:<password>@ep-black-tree-62582846.us-east-2.aws.neon.tech/neondb
   ```

   </CodeBlock>

## Verify the data

Check to see if the lost data is now present. For instance, if you lost an `orders` table, you might run a query like the following to verify that the data is available in your newly created branch:

```sql
SELECT * FROM orders LIMIT 10;
```

## Change your primary branch

You now have a production branch with lost data and a recovery branch with the data in the desired state. You could dump data from the recovery branch and load it into the production branch using dump and restore utilities like `pg_dump` and `pg_restore`, or you can make the recovery branch your new primary branch.

To make the recovery branch your new primary:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.
3. Select your recovery branch from the table.
4. On the branch details page, select **Set as Primary**.

<Admonition type="note">
If your previous primary branch was your project's root branch (the initial branch created with your project), it cannot be deleted. Deleting a root branch is not yet supported. In the meantime, you can rename a root branch (perhaps adding an `OLD` or `DO_NOT_USE` prefix to its name) and remove data from it to ensure that it's not used accidentally or consuming storage space.
</Admonition>

## Update your connections

To use your new primary branch with your applications, update your application connection details. To do so, replace your current connection details with the connection details for your new primary branch, which you retrieved earlier when connecting to your branch.

For another data recovery example using Neon's branching feature, refer to [Time Travel with Serverless Postgres](https://neon.tech/blog/time-travel-with-postgres). This example uses a bisect script and the Neon API to create branches to recover to the last known good.
