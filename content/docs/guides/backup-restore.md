---
title: Backup & Restore
subtitle: Restore your branch from a point in time or snapshot
enableTableOfContents: true
updatedOn: '2025-05-23T18:48:33.108Z'
---

<Admonition type="comingSoon" title="Snapshots in Early Access">
The new **Backup & Restore** page in the Neon Console, which introduces the new **snapshots** feature, is available for members of our Early Access Program. Read more about joining up [here](/docs/introduction/early-access).
</Admonition>

Use the **Backup & Restore** page in the Neon Console to restore a branch to a previous state or create snapshots of your data. This feature combines **instant point-in-time restore** and **snapshots** to help you recover from accidental changes, data loss, or schema issues.

![Backup and restore UI](/docs/guides/backup_restore_ui.png)

---

## What you can do

- ✅ Instantly restore a branch
- ✅ Preview data before restoring
- ✅ Create snapshots
- ✅ Restore from a snapshot

---

## Instantly restore a branch

Restore your branch to a specific time in its history. You can choose any timestamp within your [restore window](/docs/manage/projects#configure-your-restore-window) and preview data before restoring.

- **Available from**: Last 24 hours (Free Tier) or up to 7–30 days, depending on your Neon plan
- **How it works**: Select a time, preview the data, then restore

<Steps>

## Select a time

Click the date & time selector, choose a restore time, and click **Restore**.

![Backup and restore select a restore time](/docs/guides/backup_restore_select_time.png)

You'll see a confirmation modal that outlines what will happen:

- Your branch will be restored to its state at the selected date & time
- Your current branch will be saved as a backup, in case you want to revert

![Backup and restore preview data](/docs/guides/backup_restore_preview_modal.png)

At this point, you can either proceed or select **Preview data** to inspect the data first.

## Preview the data

Previewing lets you verify that you've selected the correct restore point. You can:

- **Browse data** in a **Tables** view
- **Query data** directly from the restore page
- **Compare schemas** using Neon’s schema diff tool

![Backup and restore preview data options](/docs/guides/backup_restore_preview_options.png)

<Tabs labels={["Browse data", "Query data", "Compare schemas"]}>

<TabItem>

**Browse data** lets you explore a read-only table view of your data at the selected restore point.

![Backup and restore browse data](/docs/guides/backup_restore_browse_data.png)

</TabItem>

<TabItem>

**Query data** allows you to run read-only queries against your data as it existed at the selected restore point.

![Backup and restore query data](/docs/guides/backup_restore_query_data.png)

</TabItem>

<TabItem>

**Compare schemas** shows a schema diff between your current schema (left) and the one at the selected restore point (right).

![Backup and restore compare schemas](/docs/guides/backup_restore_compare_schemas.png)

If your branch has multiple databases, use the database selector (top left) to compare each one.

</TabItem>

</Tabs>

## Restore

Click **Restore** to complete the restore operation, or **Cancel** to back out. You can also restore directly from any of the **Preview data** pages.

![Restore the data](/docs/guides/backup_restore_preview_modal.png)

When you restore, a backup branch is automatically created (named `<branch_name>_old_<timestamp>`) in case you need to revert back. You can find this branch on the **Branches** page.

![Backup branch on the Branches page](/docs/guides/backup_restore_backup_branch.png)

For information about removing backup branches, see [Deleting backup branches](/docs/introduction/branch-restore#deleting-backup-branches).

</Steps>

## Create snapshots

Snapshots are manual, point-in-time copies of your branch.

To create a snapshot, click **Create snapshot**. This captures the current state of your data and saves it as a **Manual snapshot**. It's a good idea to create a snapshot before making significant schema or data changes.

> A future release will include a snapshot scheduler that lets you schedule daily, weekly, or monthly snapshots.

![Backup branch on the Branches page](/docs/guides/backup_restore_create_snapshot.png)

## Restore from a snapshot

Restoring from a snapshot is a little different from the [instant branch restore](#instantly-restore-a-branch) operation described above. When restoring from a snapshot, the snapshot is restored to a new branch, and you need to add a compute to the new branch to access it. Additionally, to start using the new branch with your application, you'll need to swap out your current connection string for the connection string of the new branch. Follow the steps below.

<Steps>

## Select a snapshot

Find the **snapshot** you want to restore and click the **Restore** button.

A confirmation modal explains the operation:

- The restore happens instantly
- Your current branch is unchanged
- A new branch with the restored data is created

![Restore from snapshot confirmation modal](/docs/guides/backup_restore_create_snapshot_modal.png)

## Restore the snapshot

Click **Restore** to continue. You'll be redirected to the new branch created from the snapshot.

- This is a new branch with the restored data
- It doesn't have a compute yet — you’ll need to add one to access the data

![Restore branch page](/docs/guides/backup_restore_restored_snapshot.png)

## Add a compute to the restore branch

Click **Add compute** to add a compute to the new branch.

![Restore branch add compute](/docs/guides/backup_restore_add_compute.png)

Select your desired compute settings and click **Add**. Compute settings include compute size, autoscaling, and scale-to-zero. If you plan to switch over to this branch, you would typically use the same settings as the branch you will be replacing.

![Restore branch compute settings](/docs/guides/backup_restore_compute_settings.png)

With a compute added, you can now access to your restore branch and connect to its databases.

![Restore branch new compute](/docs/guides/backup_restore_new_compute.png)

## Connect to the restore branch

With a compute added, you can:

- Access the branch from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor)
- Browse tables on the branch from the [Tables page](/docs/guides/tables)
- Connect from your app or Postgres client using the restore branch connection string

Click the **Connect** button to get the connection string.

![Restore branch connect modal](/docs/guides/backup_restore_connect_modal.png)

> The restore branch connection string differs from the snapshot's source branch. It has a different hostname because each Neon branch is a separate Postgres instance.

## Switch your app to the restore branch

If you want to use the restore branch with your application, update your app to use the restore branch connection string. Before switching, pause write operations on the branch you are replacing, then resume them after switching to avoid data inconsistencies. Since Neon doesn't support read-only mode at the branch or database level, you'll need disable writes in your application.

> The restore branch name includes a timestamp and may be long. You can rename it. See [Rename a branch](/docs/manage/branches#rename-a-branch) for instructions.

</Steps>

<NeedHelp/>
