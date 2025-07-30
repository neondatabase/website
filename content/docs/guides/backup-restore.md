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

Restore your branch to a specific time in its history.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

You can choose any timestamp within your [restore window](/docs/manage/projects#configure-your-restore-window) and preview data before restoring.

- **Available from**: Last 24 hours (Free Tier) or up to 7–30 days, depending on your Neon plan
- **How it works**: Select a time, preview the data, then restore

1. **Select a time**

   Click the date & time selector, choose a restore time, and click **Restore**.

   ![Backup and restore select a restore time](/docs/guides/backup_restore_select_time.png)

   You'll see a confirmation modal that outlines what will happen:
   - Your branch will be restored to its state at the selected date & time
   - Your current branch will be saved as a backup, in case you want to revert

   ![Backup and restore preview data](/docs/guides/backup_restore_preview_modal.png)

   At this point, you can either proceed or select **Preview data** to inspect the data first.

2. **Preview the data**

   Preview a restore point to make sure you’ve selected the right one. You can:
   - **Browse data** in the **Tables** view to explore a read-only snapshot of your data at that point in time
   - **Query data** directly from the restore page to run read-only SQL against the selected restore point
   - **Compare schemas** with Neon’s schema diff tool to see how your current schema differs from the one at the selected point

   ![Backup and restore preview data options](/docs/guides/backup_restore_preview_options.png)

3. **Restore**

   Click **Restore** to complete the restore operation, or **Cancel** to back out. You can also restore directly from any of the **Preview data** pages.

   ![Restore the data](/docs/guides/backup_restore_preview_modal.png)

   When you restore, a backup branch is automatically created (named `<branch_name>_old_<timestamp>`) in case you need to revert back. You can find this branch on the **Branches** page.

   ![Backup branch on the Branches page](/docs/guides/backup_restore_backup_branch.png)

   For information about removing backup branches, see [Deleting backup branches](/docs/introduction/branch-restore#deleting-backup-branches).

</TabItem>

<TabItem>

Using the CLI, you can restore a branch to an earlier point in its history or another branch's history using the following command:

```bash shouldWrap
neon branches restore <target id|name> <source id|name @ timestamp|lsn>
```

In the `target id|name` field, specify the ID or name of the branch you want to restore. In the `source id|name timestamp|lsn` field, specify the source branch you want to restore from (mandatory), along with the point-in-time identifier (optional), which can be either an ISO 8601-formatted timestamp or the LSN. If you omit the point-in-time identifier, the operation defaults to the latest data (HEAD) for the source branch. Concatenate the source identifier and time identifier with `@`: for example, `development@2023-12-12T12:00:00Z`.

#### Restore a branch to its own history

If you want to restore a branch to an earlier point in time, use the syntax `^self` in the `<source id|name>` field. For example:

```bash shouldWrap
neon branches restore development ^self@2024-01-01T00:00:00Z --preserve-under-name development_old
```

This command resets the target branch `development` to its state at the start of 2024. The command also preserves the original state of the branch in a backup file called `development_old` using the `preserve-under-name` parameter (mandatory when resetting to self).

#### Restore from parent

If you want to restore a target branch from its parent, you can use the special syntax `^parent` in the `<source id|name>` field. For example:

```bash
neon branches restore development ^parent
```

This command will restore the target branch `development` to the latest data (HEAD) of its parent branch.

#### Restore to another branch's history

Here is an example of a command that restores a target branch to an earlier point in time of another branch's history:

```bash shouldWrap
neon branches restore development production@0/12345
```

This command will restore the target branch `development` to an earlier point in time from the source branch `production`, using the LSN `0/12345` to specify the point in time. If you left out the point-in-time identifier, the command would default to the latest data (HEAD) for the source branch `production`.

For full CLI documentation for `branches restore`, see [branches restore](/docs/reference/cli-branches#restore).

</TabItem>

<TabItem>

To restore a branch using the API, use the endpoint:

```bash
POST /projects/{project_id}/branches/{branch_id_to_restore}/restore
```

This endpoint lets you restore a branch using the following request parameters:

| Parameter               | Type     | Required | Description                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **source_branch_id**    | `string` | Yes      | The ID of the branch you want to restore from.<br /><br />To restore to the latest data (head), omit `source_timestamp` and `source_lsn`.<br /><br />To restore a branch to its own history (`source_branch_id` equals branch's own Id), you must include:<br />- A time period: `source_timestamp` or `source_lsn`<br />- A backup branch: `preserve_under_name`                         |
| **source_lsn**          | `string` | No       | A Log Sequence Number (LSN) on the source branch. The branch will be restored with data up to this LSN.                                                                                                                                                                                                                                                                                   |
| **source_timestamp**    | `string` | No       | A timestamp indicating the point in time on the source branch to restore from. Use ISO 8601 format for the date-time string.                                                                                                                                                                                                                                                              |
| **preserve_under_name** | `string` | No       | If specified, a backup is created: the latest version of the branch's state is preserved under a new branch using the specified name.<br /><br />**Note:** This field is required if:<br />- The branch has children. All child branches will be moved to the newly created branch.<br />- You are restoring a branch to its own history (`source_branch_id` equals the branch's own ID). |

#### Restoring a branch to its own history

In the following example, we are restoring branch `br-twilight-river-31791249` to an earlier point in time, `2024-02-27T00:00:00Z`, with a new backup branch named `backup-before-restore`. Note that the branch id in the `url` matches the value for `source_branch_id`.

```bash shouldWrap
curl --request POST \ // [!code word:br-twilight-river-31791249]
     --url https://console.neon.tech/api/v2/projects/floral-disk-86322740/branches/br-twilight-river-31791249/restore \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '
{
  "source_branch_id": "br-twilight-river-31791249",
  "source_timestamp": "2024-02-27T00:00:00Z",
  "preserve_under_name": "backup-before-restore"
}
' | jq
```

### Restoring to the latest data from another branch

In this example, we are restoring a development branch `dev/alex` (branch ID `br-twilight-river-31791249`) to the latest data (head) of its parent branch `br-jolly-star-07007859`. Note that we don't include any time identifier or backup branch name; this is a straight reset of the branch to the head of its parent.

```bash shouldWrap
curl --request POST \ // [!code word:br-twilight-river-31791249]
     --url https://console.neon.tech/api/v2/projects/floral-disk-86322740/branches/br-twilight-river-31791249/restore \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \ // [!code word:br-jolly-star-07007859]
     --data '
{
  "source_branch_id": "br-jolly-star-07007859"}
' | jq
```

### Restoring to the earlier state of another branch

In this example, we are restoring branch `dev/jordan` (branch ID `br-damp-smoke-91135977`) to branch `dev/alex` (branch ID `br-twilight-river-31791249`) at the point in time of `Feb 26, 2024 12:00:00.000 AM`.

```bash shouldWrap
curl --request POST \ // [!code word:br-damp-smoke-91135977]
     --url https://console.neon.tech/api/v2/projects/floral-disk-86322740/branches/br-damp-smoke-91135977/restore \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \ //  [!code word:br-jolly-star-07007859]
     --header 'Content-Type: application/json' \
     --data '
{
  "source_branch_id": "br-jolly-star-07007859",
  "source_timestamp": "2024-02-26T12:00:00Z"
}
' | jq
```

</TabItem>

</Tabs>

## Create snapshots

Snapshots are point-in-time copies of your branch.

<Tabs labels={["Console", "API"]}>

<TabItem>

To create a snapshot manually, click **Create snapshot**. This captures the current state of your data and saves it as a **Manual snapshot**. It's a good idea to create a snapshot before making significant changes to your schema or data.

![Backup branch on the Branches page](/docs/guides/backup_restore_create_snapshot.png)

</TabItem>

<TabItem>

You can create a snapshot from a branch using the [Create snapshot](https://api-docs.neon.tech/reference/createSnapshot) endpoint. A snapshot can be created from a specific timestamp (ISO 8601 format) or LSN (e.g. 16/B3733C50) within the branch's point-in-time recovery (PiTR) window. The timestamp and lsn parameters are mutually exclusive.

```
curl -X POST "https://api.neon.tech/projects/project_id/branches/branch_id/snapshot" \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2025-07-29T21:00:00Z",
    "name": "my_snapshot",
    "expires_at": "2025-08-05T22:00:00Z"
  }'
```

The parameters used in the example above:

- `timestamp`: A point in time to create the snapshot from (in RFC 3339 format).
- `name`: A user-defined name for the snapshot.
- `expires_at`: The timestamp when the snapshot will be automatically deleted.

</TabItem>

## Schedule snapshots

You can automate snapshot creation by setting a snapshot schedule for a branch.

<Tabs labels={["Console", "API"]}>

<TabItem>

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

</TabItem>

<TabItem>

You can set and retrieve a snapshot schedule using the Neon API.

### Set a snapshot schedule

This example sets a snapshot schedule for a Neon branch. It configures a snapshot to be taken on December 31 at 23:00 (11 PM), with a retention period of one hour (3600 seconds). The `frequency` field must be set to a supported value such as `"monthly"`, `"weekly"`, or `"daily"` depending on your use case. Replace `project_id`, `branch_id`, and `$NEON_API_KEY` with your actual project ID, branch ID, and API token.

```bash
curl -X PUT "https://console.neon.tech/api/v2/projects/{project_id}/branch_id/{branch_id}/snapshot_schedule" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -d '{
    "schedule": [
      {
        "frequency": "string",
        "hour": 23,
        "day": 31,
        "month": 12,
        "retention_seconds": 3600
      }
    ]
  }'
```

### Retrieve a branch snapshot schedule

This example shows how to retrieve a snapshot schedule for a branch. Replace `project_id`, `branch_id`, and `$NEON_API_KEY` with your actual project ID, branch ID, and API token.

```bash
curl -X GET "https://console.neon.tech/api/v2/projects/project_id/branches/branch_id/snapshot_schedule" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

</TabItem>

</Tabs>

## Restore from a snapshot

You can restore from a snapshot using one of two methods:

- **One-step restore** – Instantly restore data from the snapshot into the existing branch. The branch name and connection string remain the same, but the branch ID changes.
- **Multi-step restore** – Create a new branch from the snapshot. This option is useful if you want to inspect or test data before switching to the restored branch.

### One-step restore

Use this option if you need to restore the snapshot data to your existing branch quickly and do not need to inspect or test the data first.

1. Locate the snapshot you want to use and click **Restore → One-step restore**.

   ![One step restore option](/docs/guides/one_step_restore.png)

2. The **One-step restore** modal explains the operation:
   - The restore operation will occur instantly
   - The current branch will be restored to the snapshot state
   - A branch named `<branch_name (old)>` will be created as a backup

   ![One step restore confirmation modal](/docs/guides/one_step_restore_modal.png)

   Click **Restore** to proceed with the operation.

3. Your branch is immediately restored to the snapshot state, and the `<branch_name>_old` branch is created, which you'll find on the **Branches** page in the Neon Console, as shown here:
   ![Branches page that shows the backup branch](/docs/guides/one_step_restore_branches_page.png)

   After you verify that the restore operation was successful, you can delete the backup branch if you no longer need it.

### Multi-step restore

Use this option if you need to inspect the snapshot data before you switch over to the new branch.

1. Locate the snapshot you want to use and click **Restore → Multi-step restore**.
   ![Multi-step restore option](/docs/guides/multi_step_restore.png)
2. The **Multi-step restore** modal explains the operation:
   - The restore will occur instantly
   - Your current branch will remain unchanged
   - A new branch with the snaphot data will be created

   ![Multi-step restore confirmation modal](/docs/guides/multi_step_restore_modal.png)

3. Clicking **Restore** creates a new branch with the restored data and directs you to the **Branch overview** page where you can:
   - **Get connection details** for the new branch to preview the data restored from the snapshot
   - **Migrate connectioons and settings** to move your database URLs and compute settings from the old branch to the new branch so you don't have to update the connection configuration in your application

   ![Branch overview page](/docs/guides/branch_overview_page.png)

<NeedHelp/>
