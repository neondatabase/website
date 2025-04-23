---
title: Backup & restore
subtitle: Restore your branch from a point in time or snapshot
tag: early access
enableTableOfContents: true
updatedOn: '2025-02-28T11:10:41.825Z'
---

Use the **Backup & Restore** page in the Neon Console to restore a branch to a previous state or manage snapshots of your data. This feature combines **instant point-in-time restore** and **snapshots** to help you recover from accidental changes, data loss, or schema errors.

![Backup and restore UI](/docs/guides/backup_restore_ui.png)

---

## What you can do

- Instantly restore a branch to any point in time within your restore window
- Preview data from the selected point in time before your restore 
- Create snapshots
- Restore from a snapshot

---

## Restore options

### Instantly restore a branch

Use this option to revert your branch to a specific time in its history. You can choose a timestamp within your configured [restore window](/docs/manage/projects#configure-your-restore-window) and preview data before committing to the restore.

- **Available from**: The last 24 hours (Free Tier), or up to 7–30 days depending on your Neon plan
- **How it works**: Select a time, preview the data, then restore

<Steps>

## Select a time

![Backup and restore select a restore time](/docs/guides/backup_restore_select_time.png)

## Preview the data

When you preview a historical state using Time Travel Assist, you can:

- **Browse data** using the Tables page
- **Query data** directly from the restore page
- **Compare schemas** using Neon’s Schema Diff

![Backup and restore preview data](/docs/guides/backup_restore_select_time.png)

## Restore

If you're confident, click **Restore** to complete the operation.

> A backup is created automatically so you can roll back.

![Restore the data](/docs/guides/backup_restore_select_time.png)

## Switch over to your restored branch

</Steps>



## Create snapshots

Snapshots are point-in-time copies of your branch that you can create manually.

## Restore from a snapshot

To restore from a snapshot:

1. Choose a snapshot from the list.
1. Click **Restore**.

A confirmation modal appears before applying changes.

---

## Backup branches

When you restore a branch (via either method), Neon automatically creates a backup branch with the state of your branch before the restore. The name format is: `{branch_name}old{head_timestamp}`

These backup branches:

- Show up on your **Branches** page
- Can be reset from using **Reset from parent**
- Do not consume compute unless you attach compute
- Can be renamed for better organization


## Related docs

- [Configure restore window](./configure-restore-window.md)
- [Schema Diff](./schema-diff.md)
- [Time Travel Assist](./time-travel-assist.md)

