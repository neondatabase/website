---
title: Branch Restore
subtitle: Learn how to revert changes or recover lost data using Neon Branch Restore, with Time Travel Assist to query historical data as part of your restore workflow.
enableTableOfContents: true
---

With Neon's copy-on-write branch creation capability, just as you can instantly create branches from any point in your history retention window, you can just as easily restore a branch to an earlier state in that history. You can also use Time Travel Assist to help troubleshoot issues: run read-only queries against any point in your history retention window as a way to pinpoint the exact moment you need to restore to, before you proceed.

## How the restore operation works

The restore operation lets you revert the state of a selected branch to an earlier point in time. For example, revert to just before some corruption or loss of data.

![branch restore to timestamp](/docs/guides/branch_restore_time.png)

By default, your history retention is set to 7 days. You can revert a branch to any time within that configured [retention window](/docs/manage/projects#configure-history-retention), down to the millisecond.

A few key points to keep in mind about the restore operation:
- [Current data is overwritten](#overwrite-not-a-merge)
- [Restore backups are created automatically](#automatic-backups)
- [All databases on a branch are updated](#changes-apply-to-all-databases)
- [Connections are temporarily interrupted](#connections-temporarily-interrupted)

### Overwrite, not a merge

It is important to understand that whenever you restore a branch, you are performing a _complete_ overwrite, not a merge or refresh. Everything on your current branch, data and schema, is replaced with the contents from the historical source. All interim data from the selected restore point onwards is removed from the branch.

### Automatic backups

In case you need to rollback the update, Neon preserves the branch's final state before the restore operation in an automatically created backup branch, which takes the following format:

```md
{branch_name}_old_{head_timestamp}
```

You can use this backup to rollback the restore operation if necessary.

### Changes apply to all databases

A reminder that in Neon's [object hierarchy](/docs/manage/overview), a branch can include any number of databases. Keep this in mind when restoring branches. For example, let's say you want to fix some corrupted content in a given database. If you restore your branch to an earlier point in time before the corruption occurred, the operation applies to _all_ databases on the branch, not just the one you are troubleshooting.

In general, Neon recommends that you avoid overstuffing a project with too many databases. If you have multiple, distinct applications, each one deserves its own Neon project. A good rule of thumb: one Neon project per source code repository.

### Connections temporarily interrupted

Existing connections are temporarily interrupted during the restore operation. However, your connection details do not change. All connections are re-established as soon as the restore operation is finished.

### Technical details

At Neon we aim for transparency, so if you are interested in understanding the technical implementation behind the scenes, see the details below.

View technical details

Similar to the manual restore operation using the Neon API described [here](/docs/guides/branching-pitr), the Restore operation performs a similar set of actions, but automatically:

1. On initiating a restore action, Neon builds a new point-in-time branch by matching your selected timestamp to the corresponding LSN of the relevant entries in the shared WAL record.
1. The compute endpoint for your initial branch is moved to this new branch, so that your connection string remains stable.
1. We rename your new branch to the exact name as your initial branch, so the effect is seamless; it looks and acts like the same branch.
1. Your initial branch, which now has no compute attached to it, is renamed to:

    '''
    [branch_name]_old_[head_timestamp]
    '''
    to keep the pre-restore branch available should you need to rollback. Note that initial branch was the parent for your new branch, and this is reflected when you look at your branch details.

Note there are other ways to implement this feature and these details may change in the future.

## Restore a branch to an earlier state

Use the **Restore** page to restore a branch to an earlier timestamp in its history. Choose your branch, pick your timestamp, and then click the **Restore branch** button.

![branch restore to timestamp](/docs/guides/branch_restore_timestamp.png)

All databases on your selected branch are instantly updated with the data and schema from the chosen point in time. From the **Branches** page, you can now see the backup branch created from this restore point.

![branch restore backup branch](/docs/guides/branch_restore_backup_file.png)

To make sure you choose the right restore point, we encourage you to use Time Travel Assist _before_ running a restore job, but the backup branch is there if you need it. If you do need to revert your changes, you can manually make the backup branch your primary branch using the steps described in [Branching - Point in time restore](/docs/guides/branching-pitr#change-your-primary-branch). 

<Admonition type="note">
Restoring to another branch is coming soon. See our [roadmap](/docs/introduction/roadmap). Once available, you will be able to restore to any other branch, including this restore backup, using a similar one-click operation.
</Admonition>

## Time travel assist

To help troubleshoot your data's history, use the SQL editor in the Time Travel assist tool to run read-only queries against any selected timestamp within your history retention window. It's a good idea to run this kind of query before you restore a branch.

Here is how to use the editor:

1. Select the branch you want to query against, then select a timestamp, the same as you would to [Restore a branch](#restore-a-branch-to-an-earlier-state).

    This makes the selection for the Time Travel query. Notice the updated fields above the SQL editor show the **branch** and **timestamp** you just selected.
    ![Time travel query](/docs/guides/time_travel_assist.png)
  
1. Check that you have the right database selected to run your query against. Use the database selector under the SQL editor to switch to a different database for querying against.
1. Write your read-only query in the editor, then click **Query at timestamp** to run the query.

If your query is successful, you will see a table of results under the editor.

Depending on your query and the selected timestamp, instead of a table of results, you might see different error messages like:
| Error                | Explanation             |
|----------------------|-------------------------|
| If you query a timestamp in the future         | Console request failed with 400 Bad Request: timestamp 2024-01-10 21:59:48.639 +0000 UTC is in the future, try an older timestamp |
| If you query a timestamp from before your project was created | Console request failed with 400 Bad Request: parent timestamp 2023-10-01 20:59:48.639 +0000 UTC is earlier than the project creation timestamp 2023-11-07 18:47:53.023515 +0000 UTC, try a more recent timestamp |
| If you query from earlier than your history retention window | Console request failed with 400 Bad Request: timestamp 2023-12-31 21:59:48.639 +0000 UTC precedes your project's history retention window of 168h0m0s, try a more recent timestamp |

Adjust your selected timestamp accordingly.

### Billing for ephemeral endpoints

Time travel queries leverage Neon's instant branching capability to create a temporary branch and compute endpoint at the selected point in time, which is automatically removed a few moments later after your query is completed. These ephemeral endpoints are not listed on the **Branches** page or in a CLI or API list branches request &#8212; however, you can see the history of operations related to the creation and deletion of the ephemeral branch on the **Operations** page:

- start_compute
- create_branch
- delete_timeline
- suspend_compute

#### How long do ephemeral endpoints remain active

The ephemeral endpoints are created as per the configured [default](/docs/manage/projects#reset-the-default-compute-size) size. An ephemeral endpoint remains active for as long as you keep running queries against it. After 10 seconds of inactivity, the timeline is deleted and the endpoint is removed.

These ephemeral endpoints do contribute to your consumption usage totals for the billing period, like any other active endpoint consuming resources.
