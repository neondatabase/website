---
title: Branch Restore
subtitle: Learn how to revert changes or recover lost data with Neon's Branch Restore feature, including Time Travel assist to query historical data as part of your restore workflow.
enableTableOfContents: true
---

With Neon's copy-on-write branch creation capability, you can create branches instantly using data from any point in time within your history retention window. Just as easily, you can restore a branch to an earlier point in time from its own or another branch's history. You can also use Time Travel assist to run read-only queries against any point in this shared history, as a way preview data before you restore.

[Do we want to include any common or typical use cases?]

## Restore methods

Neon supports the following one-click branch restore methods:
* **Restore from branch's history** &#8212; restores your selected branch to an earlier point in time within your history retention window.
* **Restore from source branch** &#8212; restores a destination branch from another (source) branch's current data, or from an earlier time in its history

<Admonition>
**Restore from backup** is in our roadmap as part of overall support for creating and managing database backups. See [Roadmap]().
</Admonition>

When selecting an earlier point in time, you can use either [timestamp](glossary link) or [LSN](glossary link) to identify the restore point.

## How restore operations work

When you restore a branch, either to its own or another branch's history, you are performing a complete overwrite, not a merge or refresh. All data and schema on the destination branch is replaced with the data from the selected source.

The source and destination branches are defined as:

* **Destination** &#8212; this is the branch you want to apply the restore operation to
* **Source** &#8212; this is the branch you want to pull changes from

The restore operation preserves your branch's current data in a restore_backup file, in case you need to rollback the change. The file takes the following format:

```
{branch_name}_old_{head_timestamp}
```
Existing connections are temporarily interupted during the restore. However, your connection details do not change. All connections are re-established as soon as the restore operation is done.

[important to note that this will apply to all databases on your branch; if you are trying to fix corrupted data on a database, you might not immediatley realize that rolling back the branch will affect any other dbs on that branch. We can add this as an admonition, or maybe it deserves a section, to reinforce the object hierarchy]

### Default and advanced
By default, the Restore page is set up to let rollback a selected branch to an earlier timestamp in its history.

Advanced options let you rollback using an LSN as the restore point, or you can select another branch as the source, pulling either the latest data to your destination branch, or pull historical data using timestamp or LSN as the restore point.





## Time travel assist

Because you may not be certain that a given point in time in either your selected or your target branch's history, you can use the SQL editor in the Time travel assist tool to run read-only queries against your selected timestamp as way to verify that you've got the right data identifed before you click-to-restore.

For more detail, see [Using time travel assist](#using-time-travel-assist)


## Restore from branch's own history

By default, the Restore page lets you restore a branch to an earlier timestamp in its own history. Choose your branch, pick your timestamp, and then click the **Restore branch** button.

[pic]

If you want to choose an LSN as your restore point, you need to select **Show Advanced options**.
1. Change your point in time selction from default **Timestamp** to **LSN**. 
1. Enter your LSN and click **Restore branch**. 

[pic]

## Restore from target branch


## Using time travel assist

