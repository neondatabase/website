---
title: Time Travel
subtitle: Learn how to query point-in-time connections against your data's history
enableTableOfContents: true
updatedOn: '2024-08-07T21:36:52.666Z'
---

To help review your data's history, Time Travel lets you connect to any selected point in time within your history retention window and then run queries against that connection.

You can use Time Travel from two places in the Neon Console, and from the Neon CLI:

- **SQL Editor** &#8212; Time Travel is built into the SQL editor letting you switch between queries of your current data and previous iterations of your data in the same view.
- **Restore** &#8212; Time Travel Assist is also built into the Branch Restore flow where it can help you make sure you've targeted the correct restore point before you restore a branch.
- **Neon CLI** &#8212; Use the Neon CLI to quickly establish point-in-time connections for automated scripts or command-line-based data analysis.

## How Time Travel works

Time Travel leverages Neon's instant branching capability to create a temporary branch and compute at the selected point in time, which are automatically removed once you are done querying against this point-in-time connection. The computes are ephemeral: they are not listed on the **Branches** page or in a CLI or API list branches request.

However, you can see the history of operations related to the creation and deletion of branches and ephemeral computes on the **Operations** page:

- start_compute
- create_branch
- delete_timeline
- suspend_compute

### How long do ephemeral endpoints remain active

The ephemeral endpoints are created according to your configured [default compute size](/docs/manage/projects#reset-the-default-compute-size). An ephemeral compute remains active for as long as you keep running queries against it. After 10 seconds of inactivity, the timeline is deleted and the endpoint is removed.

### History retention

You are only able to run Time Travel queries that fall within your history retention window, which starts at 24 hours for Free Plan users, up to 7 days for Launch plan users, and up to 30 days for Scale and Business plan users.

You cannot select a time outside your current retention window.

To change your retention period, see [Configure history retention](/docs/manage/projects#configure-history-retention).

### Data integrity

Time Travel only allows non-destructive read-only queries. You cannot alter historical data in any way. If you try to run any query that could alter historical data, you will get an error message like the following:

![time travel error message](/docs/guides/time_travel_error.png 'no-border')

### Time Travel with the SQL Editor

Time Travel in the SQL Editor offers a non-destructive way to explore your database's historical data through read-only queries. By toggling Time Travel in the editor, you switch from querying your current data to querying against a selected point within your history retention window.

You can use this feature to help with scenarios like:

- Investigating anomolies
- Assessing the impact of new features
- Troubleshooting
- Compliance auditing

Here's an example of a completed Time Travel query.

![time travel from sql editor](/docs/guides/time_travel_sql.png)

### Time Travel Assist with Branch Restore

Time Travel Assist is also available from the **Restore** page, as part of the [Branch Restore](/docs/guides/branch-restore) feature. Before completing a restore operation, it's a good idea to use Time Travel Assist to verify that you've targetted the correct restore point.

An SQL editor is built into the **Restore** page for this purpose. When you make your branch and timestamp selection to restore a branch, this selection can also be used as the point-in-time connection to query against.

Here is an example of a completed query:

![Time travel assist](/docs/guides/time_travel_assist.png)

## How to use Time Travel

Here is how to use Time Travel from both the **SQL Editor** and from the **Restore** page:

<Tabs labels={["SQL Editor", "Branch Restore", "CLI"]}>

<TabItem>

1. In the Neon Console, open the **SQL Editor**.
1. Use the **Time Travel** toggle to enable querying against an earlier point in time.

   ![Time Travel toggle](/docs/guides/time_travel_toggle.png)

1. Use the Date & Time selector to choose a point within your history retention window.
1. Write your read-only query in the editor, then click **Run**. You don't have to include time parameters in the query; the query is automatically targeted to your selected timestamp.

</TabItem>

<TabItem>

1. In the Neon Console, go to **Restore**.
1. Select the branch you want to query against, then select a timestamp, the same as you would to [Restore a branch](#restore-a-branch-to-an-earlier-state).

   ![time travel selection](/docs/guides/time_travel_restore_select.png 'no-border')

   This makes the selection for Time Travel Assist. Notice the updated fields above the SQL Editor show the **branch** and **timestamp** you just selected.

   ![Time travel assist](/docs/guides/time_travel_show_selected.png)

1. Check that you have the right database selected to run your query against. Use the database selector under the SQL Editor to switch to a different database for querying against.

   ![time travel select db](/docs/guides/time_travel_db_select.png)

1. Write your read-only query in the editor, then click **Query at timestamp** to run the query. You don't have to include time parameters in the query; the query is automatically targeted to your selected timestamp.

   If your query is successful, you will see a table of results under the editor.

   ![time travel results](/docs/guides/time_travel_results.png)

</TabItem>

<TabItem>

Using the Neon CLI, you can establish a connection to a specific point in your branch's history. To get the connection string, use the following command:

```bash
neon connection-string <branch>@<timestamp|LSN>
```

In the `branch` field, specify the name of the branch you want to connect to. Omit the `branch` field to connect to your default branch. Replace the `timestamp|LSN` field with the specific timestamp (in ISO 8601 format) or Log Sequence Number for the point in time you want to access.

Example:

```bash
neon connetion-string main@2024-04-21T00:00:00Z
postgresql://alex:AbC123dEf@br-broad-mouse-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&options=neon_timestamp%3A2024-04-21T00%3A00%3A00Z
```

### Connect directly with psql

Appending `--psql` to the command for a one-step psql connection. For example, to connect to `main` at its state on Jan 1st, 2024:

```bash
neon connection-string main@2024-01-01T00:00:00Z --psql
```

Here is the same command using aliases:

```bash
neon cs main@2024-01-01T00:00:00Z --psql
```

### Query at Specific LSNs

For more granular control, you can also establish the connection using a specific LSN.

Example:

```bash
neon cs main@0/234235
```

This retrieves the connection string for querying the 'main' branch at a specific Log Sequence Number, providing access to the exact state of the database at that point in the transaction log.

### Include project ID for multiple projects

If you are working with multiple Neon projects, specify the project ID to target the correct project:

```bash
neon connection-string <branch>@<timestamp|LSN> --project-id <project id>
```

Example:

```bash
neon cs main@2024-01-01T00:00:00Z --project-id noisy-pond-12345678
```

Alternatively, you can set a durable project context that remains active until you remove or change the context:

```bash
neon set-context --project-id <project id>
```

Read more about getting connection strings from the CLI in [Neon CLI commands — connection-string](/docs/reference/cli-connection-string), and more about setting contexts in [CLI - set-context](/docs/reference/cli-set-context).

</TabItem>

</Tabs>

## Billing considerations

The ephemeral endpoints used to run your Time Travel queries do contribute to your consumption usage totals for the billing period, like any other active endpoint that consumes resources.

A couple of details to note:

- The endpoints are shortlived. They are suspended 10 seconds after you stop querying.
- Since these endpoints are created according to your default compute size (which applies to all new branch computes you create), you may want to reduce this default if you're performing a lot of time-travel queries for troubleshooting.
