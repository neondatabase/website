---
title: Branching — Point-in-time restore
subtitle: Create a new point-in-time branch or restore your data to a previous state
  using Neon's branching feature
enableTableOfContents: true
redirectFrom:
  - /docs/tutorial/data-recovery
  - /docs/guides/branching-data-recovery
updatedOn: '2024-09-05T17:14:45.248Z'
---

<Admonition type="comingSoon" title="New feature: Branch restore">
A simpler one-click branch restore operation is now available. Read more about it [here](/docs/guides/branch-restore). The restore procedure described on this page is still valid and might fit your specific use case.
</Admonition>

Neon retains a history of changes for all branches in a Neon project, which allows you to create a branch that restores data to any time within the defined history retention period. You can use this capability to recover lost data, which is a form of Point-in-time restore (PITR).

The history retention period is configurable. The supported limits are up to 24 hours for [Neon Free Plan](/docs/introduction/plans#free-plan) users, 7 days for [Launch](/docs/introduction/plans#launch), 14 days for [Scale](/docs/introduction/plans#scale), and 30 days for [Business](/docs/introduction/plans#business) plan users. For configuration instructions, see [Configure history retention](/docs/manage/projects#configure-history-retention).

This guide shows how to recover your data to a point in time before a data loss occurred using Neon's branching feature.

## Create a point-in-time branch

Suppose that you have a table named `orders` that was accidentally deleted by a faulty query. If you know the time you ran the faulty query or when the data loss was first discovered, you can create a point-in-time branch with the data as it existed before the data loss occurred.

To create a point-in-time branch:

1. In the Neon Console, select a project.
2. Select **Branches**.
3. Click **New Branch** to open the branch creation dialog.
   ![Create branch dialog](/docs/guides/create_data_recovery_branch.png)
4. Enter a name for the branch.
5. Select a parent branch.
6. Under **Include data up to**, select the **Specific date and time** option, which creates a branch with data up to the specified date and time. For example, if the data loss occurred on Nov 26, 2023 at 5:01pm, select Nov 11, 2023, at 5:00pm, just before the faulty query was run.

<Admonition type="note">
The **Specific date and time** option does not include data changes that occurred after the specified date and time, which means the branch contains data as it existed previously. You can only specify a date and time that falls within your history retention window. See [Configure history retention](/docs/manage/projects#configure-history-retention).
</Admonition>

7. Click **Create new branch** to create your branch.

You are directed to the **Branches** page where you are shown the details for your new branch.

<Admonition type="tip">
You can also create point-in-time branches using the [Neon CLI](/docs/reference/neon-cli). For example, you can perform the same action described above with the following CLI command:

```bash
neon branches create --name recovery_branch --parent 2023-07-11T10:00:00Z
```

The timestamp must be provided in ISO 8601 format. You can use this [timestamp converter](https://www.timestamp-converter.com/).

</Admonition>

## Connect to your branch

Connecting to your newly created branch requires connecting via the branch's compute. The following steps describe how to connect using `psql` and a connection string obtained from the Neon Console.

<Admonition type="note">
You can also query the databases in a branch from the Neon SQL Editor. For instructions, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor).
</Admonition>

To connect to your branch:

1. In the Neon Console, select your project.
2. On the project **Dashboard**, under **Connection Details**, select your `recovery_branch`, the database, and the role you want to connect with.
   ![Connection details widget recovery branch](/docs/guides/data_recovery_connection_details.png)
3. Copy the connection string. A connection string includes your role name, password, compute hostname, and database name.
4. Connect with `psql`.

   ```bash shouldWrap
   psql postgresql://[user]:[password]@[neon_hostname]/[dbname]
   ```

## Verify the data

Check to see if the lost data is now present. For instance, if you lost an `orders` table, you might run a query like this one to verify that the data is available in your newly created branch:

```sql
SELECT * FROM orders LIMIT 10;
```

## Change your default branch

You now have a production branch with lost data and a recovery branch with the data in the desired state. You could dump data from the recovery branch and load it into the production branch using dump and restore utilities like `pg_dump` and `pg_restore`, or you can make the recovery branch your new default branch and use it for production.

To make the recovery branch your new default:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.
3. Select your `recovery_branch` from the table.
4. On the branch details page, select **Set as Default**.

Making a branch your default branch ensures that access to data on the branch is never interrupted, even when you exceed project limits. For more information, see [default branch](/docs/manage/branches#default-branch).

<Admonition type="note">
If your previous default branch was your project's root branch (the initial branch created with your project), it cannot be deleted. Deleting a root branch is not yet supported. In the meantime, you can rename a root branch (perhaps adding an `OLD` or `DO_NOT_USE` prefix to its name) and remove data from it to ensure that it's not used accidentally or consuming storage space.
</Admonition>

## Update your connections

To use your new default branch with your applications, update your application connection details. To do so, replace your current connection details with the connection details for your new default branch, which you retrieved earlier when connecting to your branch.

Alternatively, if you do not want change connection details, you can move the compute from your old default branch to the new branch. See [Reassign the compute](#reassign-the-compute) for instructions.

## Reassign the compute

To avoid changing connection details in your application, you can reassign the compute from your old default branch to your new branch. If you followed the steps above, you created a branch with a compute. In this case, you have to:

1. **Remove the compute from the new branch**

   For instructions, see [Delete a compute](/docs/manage/endpoints#delete-a-compute).

2. **Move the compute from the old default branch to the new branch**

   This action is currently only supported in the Neon API. See [Update a compute with the CLI](/docs/manage/endpoints#update-a-compute-with-the-api) for instructions.

## Examples

- [Using Neon branching for instant point-in-time restore](https://neon.tech/blog/point-in-time-recovery). The blog post describes point-in-time restore and provides a script for creating a recovery branch, reassigning a compute, and setting the new branch as the default.
- [Time Travel with Serverless Postgres](https://neon.tech/blog/time-travel-with-postgres). This blog post (with video) describes a data recovery example that uses Neon's branching feature, the Neon API, and a bisect script to recover lost data.

The following GitHub repositories are available for these examples:

<DetailIconCards>
<a href="https://github.com/kelvich/branching_demo_bisect" description="Use Neon branching, the Neon API, and a bisect script to recover lost data" icon="github">Neon branch bisect demo</a>
</DetailIconCards>

<NeedHelp/>
