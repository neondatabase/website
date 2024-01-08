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

We encourage you to use Time Travel Assist _before_ running a restore job, but if you end up needing to revert your changes, you can manually make this backup branch your primary branch using the steps described in [Branching - Point in time restore](docs/guides/branching-pitr#change-your-primary-branch). 

<Admonition type="note">
Restoring to another branch is coming soon. See our [roadmap](link to roadmap). Once its available you can use this same one-click Restore operation to restore your brnach to this backup. For now, you can use the procedures described in [Branching - Point in time restore](docs/guides/branching-pitr#change-your-primary-branch).
</Admonition>

### Changes are made to ALL databases

A reminder that in Neon's [object hierarchy](/docs/manage/overview), a branch can include any number of databases. It is important to realize this when you restoring branches. For example, let's say you want to fix some corrupted content in a given database. If you restore your branch to an earlier point in time, the operation applies to all databases on the branch, not just the one you are troubleshooting.

:construction_worker: <code>Can we give any opinionated recommendations on how to architect your branches and their databases to keep things in good order, letting you restore without risk of inadvertent issues? For example, you probalby would not want to create a database per customer on a single branch. Instead, a branch per customer with dedicated db.</code>:construction_worker:	

### Connections temporarily interrupted

Existing connections are temporarily interrupted during the restore operation. However, your connection details do not change. All connections are re-established as soon as the restore operation is done.

## Restore a branch to an earlier state

The **Restore** page lets you restore a branch to an earlier timestamp in its own history. Choose your branch, pick your timestamp, and then click the **Restore branch** button.

![branch restore to timestamp](/docs/guide/branch_restore_timestamp.png))

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

