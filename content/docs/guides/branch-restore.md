---
title: Branch Restore
subtitle: Learn how to revert changes or recover lost data using Neon Branch Restore with Time Travel Assist
enableTableOfContents: true
---
<Admonition type="comingSoon">
This feature is available for select users and will be expanded to all users soon.
</Admonition>

With Neon's branch restore capability, you can easily restore a branch to an earlier state in its history. You can also use Time Travel Assist to run read-only queries against any point in your history retention window to pinpoint the exact moment you need to restore to.

## How branch restore works

### Restore from history

The restore operation lets you revert the state of a selected branch to an earlier point in time. For example, you can revert to a state just before a data loss occurred.

![branch restore to timestamp](/docs/guides/branch_restore_time.png)

By default, the history retention for a Neon project is 7 days. You can revert a branch to any time within that configured [retention window](/docs/manage/projects#configure-history-retention), down to the millisecond.

A few key points to keep in mind about the restore operation:

- [Restore backups are created automatically in case you make a mistake](#automatic-backups)
- [Current data is overwritten](#overwrite-not-a-merge)
- [All databases on a branch are restored](#changes-apply-to-all-databases)
- [Connections to the selected branch are temporarily interrupted](#connections-temporarily-interrupted)

#### Automatic backups

In case you need to rollback a restore, Neon preserves the branch's final state before the restore operation in an automatically created backup branch, which takes the following format:

```md
{branch_name}_old_{head_timestamp}
```

You can use this backup to rollback the restore operation if necessary. The backup branches are listed on the **Branches** page in the Neon Console among your other branches.

This backup becomes the parent of your original branch, which makes rolling back the restore operation simple: [Reset from parent](/docs/manage/branches#reset-a-branch-from-parent).

![Backup branch as parent to original](/docs/guides/branch_restore_backup.png)

#### Overwrite, not a merge

It is important to understand that whenever you restore a branch, you are performing a _complete_ overwrite, not a merge or refresh. Everything on your current branch, data and schema, is replaced with the contents from the historical source. All data changes from the selected restore point onwards are excluded from the branch.

#### Changes apply to all databases

A reminder that in Neon's [object hierarchy](/docs/manage/overview), a branch can include any number of databases. Keep this in mind when restoring branches. For example, let's say you want to restore lost data in a given database. If you restore your branch to an earlier point in time before the data loss occurred, the operation applies to _all_ databases on the branch, not just the one you are troubleshooting. You can expect the restore operation to last a few seconds.

In general, Neon recommends that you avoid creating too many databases in a single Neon project. If you have multiple, distinct applications, each one deserves its own Neon project. A good rule of thumb: use one Neon project per source code repository.

#### Connections temporarily interrupted

Existing connections to the selected branch are temporarily interrupted during the restore operation. However, your connection details do not change. Applications can automatically re-establish their database connections as soon as the restore operation is finished.

#### Technical details

Neon is open source and built in public, so if you are interested in understanding the technical implementation of a branch restore operation, see the details below.

<details>
<summary>View technical details</summary>

Similar to the manual restore operation using the Neon Console and API described [here](/docs/guides/branching-pitr), the Restore operation performs a similar set of actions, but automatically:

1. On initiating a restore action, Neon builds a new point-in-time branch by matching your selected timestamp to the corresponding LSN of the relevant entries in the shared WAL record.
1. The compute endpoint for your initial branch is moved to this new branch so that your connection string remains stable.
1. We rename your new branch to the exact name as your initial branch, so the effect is seamless; it looks and acts like the same branch.
1. Your initial branch, which now has no compute attached to it, is renamed to _branch_name_old_head_timestamp_ to keep the pre-restore branch available should you need to roll back. Note that the initial branch was the parent for your new branch, and this is reflected when you look at your branch details.

</details>

### Time Travel Assist

To help troubleshoot your data's history, you can use Time Travel Assist to run read-only queries against any selected timestamp within your history retention window. It's a good idea to run this kind of query to make sure you've targeted the correct restore point before you restore a branch.

The restore operation and Time Travel Assist are meant to work together. When you select a branch and timestamp, you are setting up Time Travel Assist to automatically query against that particular point in time.

![Time travel assist](/docs/guides/branch_time_travel.png)

#### Ephemeral endpoints

Time travel queries leverage Neon's instant branching capability to create a temporary branch and compute endpoint at the selected point in time, which is automatically removed once you are done with your time travel querying. The compute endpoints are ephemeral: they are not listed on the **Branches** page or in a CLI or API list branches request.

However, you can see the history of operations related to the creation and deletion of the ephemeral branch on the **Operations** page:

- start_compute
- create_branch
- delete_timeline
- suspend_compute

#### How long do ephemeral endpoints remain active

The ephemeral endpoints are created according to your configured [default compute size](/docs/manage/projects#reset-the-default-compute-size). An ephemeral endpoint remains active for as long as you keep running queries against it. After 10 seconds of inactivity, the timeline is deleted and the endpoint is removed.

## How to use branch restore

### Restoring from history

Use the **Restore** page to restore a branch to an earlier timestamp in its history. Choose your branch, pick your timestamp, and then click the **Restore branch** button.

![branch restore to timestamp](/docs/guides/branch_restore_timestamp.png)

All databases on the selected branch are instantly updated with the data and schema from the chosen point in time. From the **Branches** page, you can now see a backup branch was created with the state of the branch at the restore point in time.

![branch restore backup branch](/docs/guides/branch_restore_backup_file.png)

To make sure you choose the right restore point, we encourage you to use Time Travel Assist _before_ running a restore job, but the backup branch is there if you need it.
If you do need to revert your changes, you can [Reset from parent](/docs/manage/branches#reset-a-branch-from-parent) since that is your branch's relationship to the restore point backup.

### Performing time travel queries

Here is how to use the Time Travel Assist SQL editor:

1. Select the branch you want to query against, then select a timestamp, the same as you would to [Restore a branch](#restore-a-branch-to-an-earlier-state).

    This makes the selection for the Time Travel query. Notice the updated fields above the SQL editor show the **branch** and **timestamp** you just selected.
    ![Time travel query](/docs/guides/time_travel_assist.png)
  
1. Check that you have the right database selected to run your query against. Use the database selector under the SQL editor to switch to a different database for querying against.
1. Write your read-only query in the editor, then click **Query at timestamp** to run the query. You don't have to include time parameters in the query; the query is automatically targeted to your selected timestamp.

If your query is successful, you will see a table of results under the editor.

Depending on your query and the selected timestamp, instead of a table of results, you might see different error messages like:
| Error                | Explanation             |
|----------------------|-------------------------|
| If you query a timestamp in the future         | Console request failed with 400 Bad Request: timestamp [timestamp] is in the future, try an older timestamp |
| If you query a timestamp from before your project was created | Console request failed with 400 Bad Request: parent timestamp [timestamp] is earlier than the project creation timestamp [timestamp], try a more recent timestamp |
| If you query from earlier than your history retention window | Console request failed with 400 Bad Request: timestamp [timestamp] recedes your project's history retention window of 168h0m0s, try a more recent timestamp |

Adjust your selected timestamp accordingly.

## Billing considerations

There are minimal impacts to billing from the branch restore and Time Travel Assist features.

### Restore from history (billing)

Restoring a branch to its own history adds to your number of branches &#8212; due to the restore_backup branch &#8212; but since they do not have any compute endpoint attached, they do not add to any consumption costs.

### Time travel queries (billing)

The ephemeral endpoints used to run your Time Travel Assist queries do contribute to your consumption usage totals for the billing period, like any other active endpoint that consumes resources.

A couple of details to note:

- The endpoints are shortlived. They are suspended 10 seconds after you stop querying.
- Since these endpoints are created according to your default compute size (which applies to all new branch computes you create),  you may want to reduce this default if you're performing a lot of time-travel queries for troubleshooting.

## Limitations

- You cannot delete a backup branch without first removing the child branch.
- Once you restore a branch, [Reset from parent](/docs/manage/branches#reset-a-branch-from-parent) restores from the restore backup branch, not the original parent.
