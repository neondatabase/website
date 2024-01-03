---
title: Branch Restore
subtitle: Learn how to revert changes or recover lost data using Neon Branch Restore, with Time Travel Assist to query historical data as part of your restore workflow.
enableTableOfContents: true
---

With Neon's copy-on-write branch creation capability, you can create branches instantly using data from any point in time within your history retention window. Just as easily, you can restore a branch to an earlier point in time from its own or another branch's shared history. You can also use Time Travel Assist to run read-only queries against any point in this shared history, as a way to preview data before you restore.

[Do we want to include any common or typical use cases?]

## Restore methods &#8212; default vs advanced

Neon supports several one-click branch restore methods:
* **From branch's own history** &#8212; restore a selected branch to any point in your history retention window.
* **From source branch** &#8212; restore a destination branch from another (source) branch's data, from either its current state or from an earlier point in its history.

<Admonition>
Restoring from backup is not yet supported as a full feature. Adding support for creating and managing database backups is on our roadmap. See [Roadmap]().
</Admonition>

### Default vs advanced

By default, the **Restore** page provides a simple view for rewinding a selected branch to an earlier timestamp in its history.

For other restore options, select **Show advanced**. You can then rewind your branch using an LSN as the restore point, or select another branch as the source for the restore operation. 

When selecting an earlier point in time, you can use either [timestamp](glossary link) or [LSN](glossary link) to identify the restore point.

## How the restore operation works

It is important to understand that whenever you restore a branch, either to its own or another branch's history, you are performing a _complete_ overwrite, not a merge or refresh. Everything on your destination branch, data and schema, is replaced with the contents from the selected source.

To avoid confusion, let's define our key terms:

* **Destination branch** &#8212; The target for the restore operation.
* **Source branch** &#8212; The origin of the updates that will be applied.

### Restore backups for data safety

Neon preserves your destination branch's latest data in an automatically created backup file, using the following format:

```
{branch_name}_old_{head_timestamp}
```

We encourage you to use Time Travel Assist _before_ running a restore job, but if you end up needing to revert your changes, you can use this restore_backup file. 

[test this - and if you do want to rollback, do you just do another restore, but select this as your source?
]

### Changes are made to ALL databases

A reminder that in Neon's [object hierarchy](/docs/manage/overview), a branch can include any number of databases. It is important to realize this when you restoring branches. For example, let's say you want to fix some corrupted content in a given database. If you restore your branch to an earlier point in time, the operation applies to all databases on the branch, not just the one you are troubleshooting.

[any opinionated recommendation on a workflow to keep your branches in good order, letting you restore without risk of inadvertent issues?]

### Connections temporarily interrupted

Existing connections are temporarily interrupted during the restore. However, your connection details do not change. All connections are re-established as soon as the restore operation is done.

## Restore from branch's own history

By default, the Restore page lets you restore a branch to an earlier timestamp in its own history. Choose your branch, pick your timestamp, and then click the **Restore branch** button.

[pic]

If you want to choose an LSN as your restore point, you need to select **Show Advanced options**.
1. Change your point in time selction from default **Timestamp** to **LSN**. 
1. Enter your LSN and click **Restore branch**. 

[pic]

## Restore from target branch

[TBD]

## Time travel assist

Because you may not be certain that a given point in time in either your selected or your target branch's history, you can use the SQL editor in the Time travel assist tool to run read-only queries against your selected timestamp as way to verify that you've got the right data identifed before you click-to-restore.

For more detail, see [Using time travel assist](#using-time-travel-assist)





## Using time travel assist

