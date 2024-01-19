---
title: Branch Restore
subtitle: Learn how to revert changes or recover lost data using Neon Branch Restore with Time Travel Assist
enableTableOfContents: true
---

With Neon's branch restore capability, you can easily restore a branch to an earlier state in its history. You can also use Time Travel Assist to run read-only queries against any point in your history retention window to pinpoint the exact moment you need to restore to.

## How it works

### Restore from history

The restore operation lets you revert the state of a selected branch to an earlier point in time. For example, you can revert to a state just before a data loss occurred.

![branch restore to timestamp](/docs/guides/branch_restore_time.png)

By default, the history retention for a Neon project is 7 days. You can revert a branch to any time within that configured [retention window](/docs/manage/projects#configure-history-retention), down to the millisecond.

A few key points to keep in mind about the restore operation:
- [Current data is overwritten](#overwrite-not-a-merge)
- [Restore backups are created automatically in case you make a mistake](#automatic-backups)
- [All databases on a branch are restored](#changes-apply-to-all-databases)
- [Connections are temporarily interrupted](#connections-temporarily-interrupted)

#### Overwrite, not a merge

It is important to understand that whenever you restore a branch, you are performing a _complete_ overwrite, not a merge or refresh. Everything on your current branch, data and schema, is replaced with the contents from the historical source. All data changes from the selected restore point onwards are excluded from the branch.

#### Automatic backups

In case you need to rollback a restore, Neon preserves the branch's final state before the restore operation in an automatically created backup branch, which takes the following format:

```md
{branch_name}_old_{head_timestamp}
```

You can use this backup to rollback the restore operation if necessary.

#### Changes apply to all databases

A reminder that in Neon's [object hierarchy](/docs/manage/overview), a branch can include any number of databases. Keep this in mind when restoring branches. For example, let's say you want to restore lost data in a given database. If you restore your branch to an earlier point in time before the data loss occurred, the operation applies to _all_ databases on the branch, not just the one you are troubleshooting.

In general, Neon recommends that you avoid creating too many databases in a single Neon project. If you have multiple, distinct applications, each one deserves its own Neon project. A good rule of thumb: use one Neon project per source code repository.

#### Connections temporarily interrupted

Existing connections are temporarily interrupted during the restore operation. However, your connection details do not change. All connections are re-established as soon as the restore operation is finished.

#### Technical details

At Neon we aim for transparency, so if you are interested in understanding the technical implementation of a branch restore operation, see the details below.

<details>
<summary>View technical details</summary>

Similar to the manual restore operation using the Neon Console and API described [here](/docs/guides/branching-pitr), the Restore operation performs a similar set of actions, but automatically:

1. On initiating a restore action, Neon builds a new point-in-time branch by matching your selected timestamp to the corresponding LSN of the relevant entries in the shared WAL record.
1. The compute endpoint for your initial branch is moved to this new branch, so that your connection string remains stable.
1. We rename your new branch to the exact name as your initial branch, so the effect is seamless; it looks and acts like the same branch.
1. Your initial branch, which now has no compute attached to it, is renamed to _branch_name_old_head_timestamp_ to keep the pre-restore branch available should you need to rollback. Note that initial branch was the parent for your new branch, and this is reflected when you look at your branch details.

</details>

### Time Travel Assist

To help troubleshoot your data's history, you can use Time Travel Assist to run read-only queries against any selected timestamp within your history retention window. It's a good idea to run this kind of query to make sure you've targeted the correct restore point before you restore a branch.

The restore operation and time travel assist are meant to work together. When you select a branch and timestamp, you are setting up Time Travel Assist to automatically query against that particular point in time.

![Time travel assist](/docs/guides/branch_time_travel.png)

#### About ephemeral endpoints

Time travel queries leverage Neon's instant branching capability to create a temporary branch and compute endpoint at the selected point in time, which is automatically removed once you are done your time travel querying. The endpoints are ephemeral: they are not listed on the **Branches** page or in a CLI or API list branches request.

However, you can see the history of operations related to the creation and deletion of the ephemeral branch on the **Operations** page:

- start_compute
- create_branch
- delete_timeline
- suspend_compute

#### How long do ephemeral endpoints remain active

The ephemeral endpoints are created according to your configured [default](/docs/manage/projects#reset-the-default-compute-size) size. An ephemeral endpoint remains active for as long as you keep running queries against it. After 10 seconds of inactivity, the timeline is deleted and the endpoint is removed.

## How to use

### Restoring from history

Use the **Restore** page to restore a branch to an earlier timestamp in its history. Choose your branch, pick your timestamp, and then click the **Restore branch** button.

![branch restore to timestamp](/docs/guides/branch_restore_timestamp.png)

All databases on your selected branch are instantly updated with the data and schema from the chosen point in time. From the **Branches** page, you can now see the backup branch created from this restore point.

![branch restore backup branch](/docs/guides/branch_restore_backup_file.png)

To make sure you choose the right restore point, we encourage you to use Time Travel Assist _before_ running a restore job, but the backup branch is there if you need it.
If you do need to revert your changes, you can manually make the backup branch your primary branch using the steps described in [Branching - Point in time restore](/docs/guides/branching-pitr#change-your-primary-branch). 

<Admonition type="coming soon">
Restoring to another branch is coming soon. See our [roadmap](/docs/introduction/roadmap). Once available, you will be able to restore to any other branch, including this restore backup, using a similar one-click operation.
</Admonition>

### Performing time travel queries

Here is how to use the Time Travel Assist SQL editor:

1. Select the branch you want to query against, then select a timestamp, the same as you would to [Restore a branch](#restore-a-branch-to-an-earlier-state).

    This makes the selection for the Time Travel query. Notice the updated fields above the SQL editor show the **branch** and **timestamp** you just selected.
    ![Time travel query](/docs/guides/time_travel_assist.png)
  
1. Check that you have the right database selected to run your query against. Use the database selector under the SQL editor to switch to a different database for querying against.
1. Write your read-only query in the editor, then click **Query at timestamp** to run the query. You don't have to include time paramaters in the query; the query is automatically targetted to your selected timestamp.

If your query is successful, you will see a table of results under the editor.

Depending on your query and the selected timestamp, instead of a table of results, you might see different error messages like:
| Error                | Explanation             |
|----------------------|-------------------------|
| If you query a timestamp in the future         | Console request failed with 400 Bad Request: timestamp 2024-01-10 21:59:48.639 +0000 UTC is in the future, try an older timestamp |
| If you query a timestamp from before your project was created | Console request failed with 400 Bad Request: parent timestamp 2023-10-01 20:59:48.639 +0000 UTC is earlier than the project creation timestamp 2023-11-07 18:47:53.023515 +0000 UTC, try a more recent timestamp |
| If you query from earlier than your history retention window | Console request failed with 400 Bad Request: timestamp 2023-12-31 21:59:48.639 +0000 UTC precedes your project's history retention window of 168h0m0s, try a more recent timestamp |

Adjust your selected timestamp accordingly.

## Billing

There are minimal impacts to billing from these two related features.

### Restore from history (billing)

Restoring a branch to its own history adds to your number of branches &#8212; due to the restore_backup branch &#8212; but since they do not have any compute endpoint attached, they do not add to any consumption costs.

```//The retore_backup branches add to write costs. But since that is removed in v2Billing, let's not mention here. However, two questions I'm not clear about: 1) Do restore-backup branches add to synthetic storage size and so incur some small cost there? 2) What happens when the restore_backup branch ages out of your retention window? are these deleted automatically before that point?//```

### Time travel queries (billing)

The ephemeral endpoints used to run your Time Travel Assist queries do contribute to your consumption usage totals for the billing period, like any other active endpoint that consumes resource.

A couple details to note:

- The endpoints are shortlived. They are suspended 10 seconds after you stop querying.
- Since these endpoints are created according to your default compute size (which applies to all new branch computes you create),  you may want to reduce this default if you're performing a lot of time travel queries for troubleshooting.
