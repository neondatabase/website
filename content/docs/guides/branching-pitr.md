---
title: Branching — Point-in-time restore (PITR)
subtitle: Recover your data to previous state using Neon's branching feature
enableTableOfContents: true
---

A Neon project has a default 7-day data retention window, which enables creating a branch that reflects the state of your data at a past time. You can use this capability to recover lost data, which is a form of Point-in-time restore (PITR).

This guide provides an example of how to recover your data to point in time before a data loss occurred using Neon's branching feature.

## Create a point-in-time branch

Suppose that you have a table named `orders` that was accidentally deleted by a faulty query. If you know the time you ran the faulty query or when the data loss was first discovered, you can create a point-in-time branch with the data as it existed before the data loss occurred.

To create a point-in-time branch:

1. Navigate to the **Branches** page in the Neon Console.
1. Click **Create branch** to open the branch creation dialog.
1. Enter a name for the branch. You can call it `data_recovery`, for example.
    ![Data recovery create branch dialog](/docs/guides/data_recovery_create_branch.png)
1. For the **Parent branch**, select the branch where the data loss occurred.
1. Select the **Time** option to create a branch with data as it existed at a specific date and time. For example, if the data loss occurred on July 11, 2023 at 10:01am, set the time to July 11, 2023, at 10:00am, just before the faulty query was run.
1. Leave the **Create compute endpoint** option selected. A compute endpoint is required to connect to the new branch.
1. Click **Create Branch** to create your point-in-time branch.

<Admonition type="tip">
You can also create point-in-time branches using the [Neon CLI](/docs/reference/neon-cli). For example, you can perform the same action described above with the following CLI command:

```bash
neonctl branches create --name data_recovery --parent 2023-07-11T10:00:00Z
```

The timestamp must be provided in ISO 8601 format. You can use this [timestamp converter](https://www.timestamp-converter.com/).

</Admonition>

## Connect to your branch

Connecting to your newly created branch requires connecting via the branch's compute endpoint. The following steps describe how to connect using `psql` and a connection string obtained from the Neon Console.

<Admonition type="note">
You can also query the databases in a branch from the Neon SQL Editor. For instructions, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor).
</Admonition>

To connect to your branch:

1. In the Neon Console, select your project.
2. On the project **Dashboard**, under **Connection Details**, select the `data_recovery` branch, the database, and the role you want to connect with.
![Connection details widget recovery branch](/docs/guides/data_recovery_connection_details.png)
3. Copy the connection string. A connection string includes your role name, password, compute endpoint hostname, and database name.
4. Connect with `psql`. Your connection string will look something like this:

   <CodeBlock shouldWrap>

   ```bash
   psql postgres://daniel:<password>@ep-black-tree-62582846.us-east-2.aws.neon.tech/neondb
   ```

   </CodeBlock>

## Verify the data

Check to see if the lost data is now present. For instance, if you lost an `orders` table, you might run a query like the following to verify that the data is available in your newly created branch:

```sql
SELECT * FROM orders LIMIT 10;
```

## Change your primary branch

You now have a production branch with lost data and a recovery branch with the data in the desired state. You could dump data from the recovery branch and load it into the production branch using dump and restore utilities like `pg_dump` and `pg_restore`, or you can make the recovery branch your new primary branch and use it for production.

To make the recovery branch your new primary:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.
3. Select your `data_recovery` branch from the table.
4. On the branch details page, select **Set as Primary**.

Making a branch your primary branch ensures that access to data on the branch is never interrupted, even when you exceed project limits. For more information, see [Primary branch](/docs/manage/branches#primary-branch).

<Admonition type="note">
If your previous primary branch was your project's root branch (the initial branch created with your project), it cannot be deleted. Deleting a root branch is not yet supported. In the meantime, you can rename a root branch (perhaps adding an `OLD` or `DO_NOT_USE` prefix to its name) and remove data from it to ensure that it's not used accidentally or taking up storage space.
</Admonition>

## Update your connections

To use your new primary branch with your applications, update your application connection details. To do so, replace your current connection details with the connection details for your new primary branch, which you retrieved earlier when connecting to your branch.

Alternatively, if you do not want change connection details, you can move the compute endpoint from your old primary branch to the new  branch. See [Reassign your compute endpoint](#reassign-the-compute-endpoint) for instructions.

## Reassign the compute endpoint

To avoid changing connection details in your application, you can reassign the compute endpoint from your old primary branch to your new  branch. If you followed the steps above, you created a branch with a compute endpoint. In this case, you have to:

1. **Remove the compute endpoint from the new branch.**

   For instructions, see [Delete a compute endpoint](/docs/manage/endpoints#delete-a-compute-endpoint).

2. **Move the compute endpoint from the old primary branch to the new branch.**

   This action is currently only supported in the Neon API. See [Update a compute endpoint with the CLI](/docs/manage/endpoints#update-a-compute-endpoint-with-the-api) for instructions.

## Examples

- For a blog post that covers point-in-time restore (PITR), see [Using Neon branching for instant Point in time restore](https://neon.tech/blog/point-in-time-recovery). The blog post describes PITR and provides a script for creating a recovery branch, reassigning a compute endpoint, and setting the new branch as the primary branch.
- For a data recovery example that uses Neon's branching feature, the Neon API, and a bisect script to recover lost data, refer to [Time Travel with Serverless Postgres](https://neon.tech/blog/time-travel-with-postgres).

Check out the GitHub repositories for these examples:

<DetailIconCards>
<a href="https://github.com/neondatabase/restore-neon-branch" description="A script to restore a Neon branch to a previous state while preserving the same endpoint" icon="github">Restore a Neon database</a>
<a href="https://github.com/kelvich/branching_demo_bisect" description="Use a bisect script and the Neon API to recover lost data" icon="github">Neon branch bisect demo</a>
</DetailIconCards>

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
