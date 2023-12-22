---
title: Branch Restore
subtitle: Learn how to revert changes or recover lost data with Neon's Branch Restore feature, including Time Travel assist to query historical data as part of your restore workflow.

s well as how Time Travel Assist 

Learn the different restore methods you can us a branch to an earlier point in time, restore a branch to a remote target Branch Restore to rollback a branch to an earlier point in time, remote restore to a target branch, or use Time Travel Assist to query historical data as part of the restore workflow.
enableTableOfContents: true
---

With Neon's copy-on-write branch creation capability, you can create branches instantly using data from any point in time within your history retention window. Just as easily, you can restore a branch to an earlier point in its own or another branch's history. You can also use Time Travel assist to run read-only queries against any point in this shared history, as a way preview data before you restore.

[Do we want to include any common or typical use cases?]

 to the restore. 

, to preview data as it existed at the point in time, letting you confirm that you You can also restore any branch to a point within this retention window

 this available shared history, you can use Time Travel Assist to run read-only queries against any point in time during the retention window. This helps you find the right point in time to restore your data to its desired state: an earlier point in time in its own history


With Neon's restore feature, this architecture is leveraged to help you restore a selected branch to an earlier time in its own history, or you can restore from another source branch's history. 


The Restore dashboard in the Neon Console leverages this architecture to help you restore a selected branch to an earlier time in its own history, or you can choose a target branch and restore your data to either...  to the current or earlier time in the history of any target branch, 

## How restore operations work

When you restore a branch, either to its own or another branch's history, you are performing a complete overwrite, not a merge or refresh. All data and schema on the destination branch is replaced with the data  The restore replaces all data on the destination branch with the selected data from the source.




 The restore operation preserves your branch's current data in a restore_backup file, in case you need to rollback the change. The file takes the following format:

```
{branch_name}_old_{head_timestamp}
```
Existing connections are temporarily interupted during the restore. However, your connection details do not change. All connections are re-established as soon as the restore operation is done.

By default, the Restore page lets you rollback your branch to an earlier timestamp in its own history. If you show advanced options, you can also use an LSN as the restore point, or select another branch as the source for the restore, pulling either the latest data or historical data from timestamp or LSN.

The source and destination branches are defined as:

* **Destination** &#8212; this is the branch you want to apply the restore operation to
* **Source** &#8212; this is the branch you want to pull changes from


## Restore methods

By default, the Restore page sets you up to rollback your branch to an earlier point in its own history. 


Neon supports the following click-to-restore branch restore methods:
* **Restore from branch history** &#8212; restore your selected branch to an earlier point in time within your history retention window.
* **Restore from target branch** &#8212; choose a target branch as your source and restore your selected branch to the target's current data or to an earlier time in its history.

<Admonition>
**Restore from backup** is in our roadmap, along with backup workflows and helper actions in general. See [Roadmap]().
</Admonition>

When selecting an earlier point in time, you can use either [timestamp](glossary link) or [LSN](glossary link) to identify the branch in question.

## Time travel assist

Because you may not be certain that a given point in time in either your selected or your target branch's history, you can use the SQL editor in the Time travel assist tool to run read-only queries against your selected timestamp as way to verify that you've got the right data identifed before you click-to-restore.

For more detail, see [Using time travel assist](#using-time-travel-assist)


## Restore from branch history

By default, when you navigate to the Restore page, the dashboard is ready to restore from branch history. Select a branch, choose a timestamp from its history, and then click the **Restore branch** button.

[pic]

Note that if

## Restore from target branch


## Using time travel assist

