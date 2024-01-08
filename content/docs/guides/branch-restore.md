---
title: Branch Restore
subtitle: Learn how to revert changes or recover lost data using Neon Branch Restore, with Time Travel Assist to query historical data as part of your restore workflow.
enableTableOfContents: true
---

With Neon's copy-on-write branch creation capability, you can create branches instantly using data from any point in time within your history retention window. Just as easily, you can restore a branch to an earlier point in time from its history. You can also use Time Travel Assist to run read-only queries against any point in your history retention window, as a way to preview data before you restore.

[Do we want to include any common or typical use cases?]

## How the restore operation works

It is important to understand that whenever you restore a branch, you are performing a _complete_ overwrite, not a merge or refresh. Everything on your current branch, data and schema, is replaced with the contents from the historical source.

### Restore backups for data safety

Neon preserves your destination branch's latest data in an automatically created backup file, using the following format:

```
{branch_name}_old_{head_timestamp}
```

### Changes are made to ALL databases

A reminder that in Neon's [object hierarchy](/docs/manage/overview), a branch can include any number of databases. Keep this in mind when restoring branches. For example, let's say you want to fix some corrupted content in a given database. If you restore your branch to an earlier point in time, the operation applies to _all_ databases on the branch, not just the one you are troubleshooting.

:construction_worker: 
<code>Can we give any opinionated recommendations on how to architect your branches and their databases to keep things in good order, letting you restore without risk of inadvertent issues? For example, you probably would not want to create a database per customer on a single branch. Instead, a branch per customer with a dedicated db.</code>
:construction_worker:	

### Connections temporarily interrupted

Existing connections are temporarily interrupted during the restore operation. However, your connection details do not change. All connections are re-established as soon as the restore operation is finished.

## Restore a branch to an earlier state

Use the **Restore** page to restore a branch to an earlier timestamp in its history. Choose your branch, pick your timestamp, and then click the **Restore branch** button. Your current branch is instantly updated to the data and schema from the selected point in time.

![branch restore to timestamp](/docs/guides/branch_restore_timestamp.png)

From the **Branches** page, you can then see the backup branch created from this restore point.

!pic!

To make sure you choose the right restore point, we encourage you to use Time Travel Assist _before_ running a restore job, but if you end up needing to revert your changes, you can manually make the backup branch your primary branch using the steps described in [Branching - Point in time restore](/docs/guides/branching-pitr#change-your-primary-branch). 

<Admonition type="note">
Restoring to another branch is coming soon. See our [roadmap](link to roadmap). Once available, you can use a similar one-click Restore operation to rollback your branch to this restore backup. For now, however, use the procedures described in [Branching - Point in time restore](docs/guides/branching-pitr#change-your-primary-branch).
</Admonition>

## Time travel assist

To help with troubleshooting, use the SQL editor in the Time Travel assist tool to run read-only queries against any selected timestamp within your history retention window. It's a good idea to run this kind of query before you restore a branch.

Here is the recommended process:
1. Select the branch you want to query against, then select a timestamp, the same as you would to [Restore a branch](#restore-a-branch-to-an-earlier-state).
1. Instead of clicking **Branch Restore**, look to the Time Travel Assist window where you will find the SQL editor you can use to write your query.
    ![Time travel query](/docs/guides/time_travel_assist.png)
    Note that Time Travel Assist window shows the selected branch and timestamp against which this query will be run.
1. Make sure you select the right database to run your query against; the database selection dropdown appears under the SQL editor.
1. Write your read-only query in the editor, then click **Query at timestamp** to run the query.

If your query is successful, you will see a table of results under the editor.

Depending on your query and the selected timestamp, instead of a table of results, you might see different error messages, like:
* If you query a timestamp in the future:
    ```Console request failed with 400 Bad Request: timestamp 2024-01-10 21:59:48.639 +0000 UTC is in the future, try an older timestamp```
* If you query a timestamp from before your project was created:
    ```Console request failed with 400 Bad Request: parent timestamp 2023-10-01 20:59:48.639 +0000 UTC is earlier than the project creation timestamp 2023-11-07 18:47:53.023515 +0000 UTC, try a more recent timestamp```
* If you query from earlier than your history retention window:
    ```Console request failed with 400 Bad Request: timestamp 2023-12-31 21:59:48.639 +0000 UTC precedes your project's history retention window of 168h0m0s, try a more recent timestamp```

Adjust your selected timestamp accordingly.
