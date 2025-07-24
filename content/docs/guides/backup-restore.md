---
title: Backup & restore
subtitle: Restore your branch from a point in time or snapshot
tag: new
enableTableOfContents: true
updatedOn: '2025-05-23T18:48:33.108Z'
---

<Admonition type="comingSoon" title="Snapshots in Early Access">
The new **Backup & restore** page in the Neon Console, which introduces the new **snapshots** feature, is available for members of our Early Access Program. Read more about joining up [here](/docs/introduction/early-access).
</Admonition>

Use the **Backup & restore** page in the Neon Console to restore a branch to a previous state or create snapshots of your data. This feature combines **instant point-in-time restore** and **snapshots** to help you recover from accidental changes, data loss, or schema issues.

![Backup and restore UI](/docs/guides/backup_restore_ui.png)

---

## What you can do

- ✅ Instantly restore a branch
- ✅ Preview data before restoring
- ✅ Create snapshots
- ✅ Schedule snapshots
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

Snapshots are point-in-time copies of your branch.

To create a snapshot manually, click **Create snapshot**. This captures the current state of your data and saves it as a **Manual snapshot**. It's a good idea to create a snapshot before making significant changes to your schema or data.

![Backup branch on the Branches page](/docs/guides/backup_restore_create_snapshot.png)

## Schedule snapshots

You can automate snapshot creation by setting a snapshot schedule for a branch.

To edit the snapshot schedule:

1. Click **Edit schedule**.
2. In the **Edit snapshot schedule** modal, configure: 

   - **Frequency** – Daily, weekly, or monthly snapshots.
   - **Retention** – How long to retain snapshots before they expire.
   - **Custom retention rules** – Optionally keep specific daily or weekly snapshots for longer.

   For example, you can configure daily snapshots at 01:00 UTC, keep Monday snapshots for a few weeks, and retain monthly snapshots for several months.

3. Click **Update schedule** to apply changes.

Snapshots created via the schedule are listed under the Snapshots section, along with manual snapshots.

![snapshot schedule dialog](/docs/guides/snapshot_schedule.png)

<Admonition type="tip">
The Neon API supports finer-grained control over snapshot scheduling.
</Admonition>

## Restore from a snapshot

You can restore from a snapshot using one of two methods:

- **One-step restore** – Instantly restore data from the snapshot into the existing branch. The branch name and connection string remain the same, but the branch ID changes.
- **Multi-step restore** – Create a new branch from the snapshot. This option is useful if you want to inspect or test data before switching to the restored branch.

## One-step restore

1. Locate the snapshot you want to use and click **Restore → One-step restore**.

   ![One step restore option](/docs/guides/one_step_restore.png)
2. Confirm the operation in the **One-step restore** modal, which explains the operation:

   - The restore operation occurs instantly
   - The current branch will be restored to the snapshot state
   - A branch named `<branch_name (old)>` will be created as a backup

   ![One step restore confirmation modal](/docs/guides/one_step_restore_modal.png)
3. Your branch is immediately restored to the snapshot state, and the `<branch_name>_old` branch is created, which you'll find on the **Branches** page in the Neon Console, as shown here:
   ![Branches page that shows the backup branch](/docs/guides/one_step_restore_branches_page.png)

   Once you’ve verified that the restore was successful, you can delete the backup branch if you no longer need it.

## Multi-step restore

1. Locate the snapshot you want to use and click **Restore → Multi-step restore**.
   ![Multi-step restore option](/docs/guides/multi_step_restore.png)
2. Confirm the operation in the **Multi-step restore** modal, which explains the operation:
   - The restore occurs instantly
   - Your current branch is unchanged
   - A new branch with the snaphot data is created

   ![Multi-step restore confirmation modal](/docs/guides/multi_step_restore_modal.png)
3. Clicking **Restore** creates a new branch with the restored data and directs you to the **Branch overview** page where you can:
   - **Get connection details** for the new branch to preview the data restored from the snapshot 
   - **Migrate connectioons and settings** to move your database URLs and compute settings from the old branch to the new branch instead of resetting connections in your app

   ![Branch overview page](/docs/guides/branch_overview_page.png)

<NeedHelp/>
