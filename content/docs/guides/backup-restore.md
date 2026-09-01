---
title: Backup & restore
subtitle: Restore your branch from a point in time or snapshot
summary: >-
  Neon's Backup & Restore feature combines instant point-in-time restore (PITR)
  and snapshots to recover a branch from accidental changes, schema issues, or
  data loss. Use it when you need to roll back a root branch to a specific
  timestamp or LSN, create manual snapshots before risky changes, or schedule
  automated daily, weekly, or monthly backups. Snapshot storage is billed at
  $0.09/GB-month. Scheduled snapshots do not count toward the manual snapshot
  limit.
tag: new
tagTheme: green
enableTableOfContents: true
updatedOn: '2026-08-31T19:23:51.024Z'
---

<Admonition type="note" title="Snapshots">
The **Snapshots** feature is available to all users. Manual snapshot limits: 1 on the Free plan and 100 on paid plans. On paid plans, snapshots created by backup schedules do not count toward this limit. Automated backup schedules are available on paid plans; on the Agent plan, they are available upon request. If you need higher limits, please reach out to [Neon support](/docs/introduction/support).

**Pricing:** Snapshot storage is billed at $0.09/GB-month.

Billing behavior: manual snapshots are charged as full snapshots. Scheduled snapshots are charged as full snapshots for the first scheduled snapshot, then as incremental (delta) storage for subsequent scheduled snapshots.
</Admonition>

Use the **Backup & restore** page in the Neon Console to instantly restore a branch to a previous state or create and restore snapshots of your data. This feature combines **instant point-in-time restore** and **snapshots** to help you recover from accidental changes, data loss, or schema issues.

The **Enhanced view** toggle in the Neon Console lets you access the Backup & Restore page with snapshot capabilities. When enabled, you can create and manage snapshots alongside instant point-in-time restore. Toggle it off to return to the original Restore page if needed.

You can also manage snapshots from the terminal with the Neon CLI. For every subcommand, flag, and default, see the [snapshots](/docs/cli/snapshots) CLI reference.

![Backup and restore UI](/docs/guides/backup_restore_ui.png)

---

## What you can do

- ✅ Instantly restore a branch
- ✅ Preview data before restoring
- ✅ Create snapshots manually
- ✅ Schedule automated snapshots
- ✅ Restore from a snapshot

---

## Instantly restore a branch

Instantly restore your branch to a specific time in its history.

> Instant restore is only supported for root branches. Typically, this is your project's `production` branch. [Learn more](/docs/manage/branches#root-branch).

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

You can restore from any time that falls within your project's [history window](/docs/postgres/backup-restore/history-window).

1. **Select a time**

   Click the date & time selector, choose a date & time, and click **Restore**.

   ![Backup and restore select a restore time](/docs/guides/backup_restore_select_time.png)

   You'll see a confirmation modal that outlines what will happen:
   - Your branch will be restored to its state at the selected date & time
   - Your current branch will be saved as a backup, in case you want to revert

   ![Backup and restore preview data](/docs/guides/backup_restore_preview_modal.png)

   At this point, you can either click **Restore** to proceed or select **Preview data** to inspect the data first.

2. **Preview the data**

   To preview the data to make sure you’ve selected the right restore point, you can:
   - **Browse data** in the **Tables** view to explore a read-only view of the data at the selected point in time
   - **Query data** directly from the restore page to run read-only SQL against the selected restore point
   - **Compare schemas** with the schema diff tool to see how your current schema differs from the one at the selected restore point

   ![Backup and restore preview data options](/docs/guides/backup_restore_preview_options.png)

3. **Restore**

   Click **Restore** to complete the restore operation, or **Cancel** to back out. You can also restore directly from any of the **Preview data** pages.

   When you restore, a backup branch is automatically created (named `<branch_name>_old_<timestamp>`) in case you need to revert back. You can find this branch on the **Branches** page.

   ![Backup branch on the Branches page](/docs/guides/backup_restore_backup_branch.png)

   For information about removing backup branches, see [Deleting backup branches](/docs/postgres/backup-restore/branch-restore#deleting-backup-branches).

</TabItem>

<TabItem>

To restore a branch to an earlier point in time, use the syntax `^self` in the `<source id|name>` field of the `branches restore` command. For example:

```bash shouldWrap
neon branches restore development ^self@2025-01-01T00:00:00Z --preserve-under-name development_old
```

This command resets the target branch `development` to its state at the start of 2025. The command also preserves the original state of the branch in a backup file called `development_old` using the `preserve-under-name` parameter (mandatory when resetting to self).

For full CLI documentation for `branches restore`, see [branches restore](/docs/cli/branches#restore).

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
| **source_timestamp**    | `string` | No       | A timestamp indicating the point in time on the source branch to restore from. Use RFC 3339 format for the date-time string.                                                                                                                                                                                                                                                              |
| **preserve_under_name** | `string` | No       | If specified, a backup is created: the latest version of the branch's state is preserved under a new branch using the specified name.<br /><br />**Note:** This field is required if:<br />- The branch has children. All child branches will be moved to the newly created branch.<br />- You are restoring a branch to its own history (`source_branch_id` equals the branch's own ID). |

#### Restoring a branch to its own history

In the following example, we are restoring branch `br-twilight-river-31791249` to an earlier point in time, `2024-02-27T00:00:00Z`, with a new backup branch named `backup-before-restore`. Note that the branch id in the `url` matches the value for `source_branch_id`.

```bash shouldWrap
curl --request POST \
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

</TabItem>

</Tabs>

## Create snapshots manually

Snapshots capture the state of your branch at a point in time. You can create snapshots manually (on root branches only). You can restore to these snapshots from any branch in your project.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

To create a snapshot manually, click **Create snapshot**. This captures the current state of your data and saves it as a **Manual snapshot**. It's a good idea to create a snapshot before making significant changes to your schema or data.

![Backup branch on the Branches page](/docs/guides/backup_restore_create_snapshot.png)

</TabItem>

<TabItem>

Use the [snapshots create](/docs/cli/snapshots#create) command to snapshot a branch. By default, it captures the head of the branch:

```bash
neon snapshots create --branch main --name pre-migration
```

To capture an earlier point within the branch's [history window](/docs/postgres/backup-restore/history-window), pass `--timestamp` or `--lsn`. The two options are mutually exclusive.

```bash
neon snapshots create --branch main --timestamp 2025-07-29T21:00:00Z
```

Use `--expires-at` to have the snapshot deleted automatically. It must be a future time. Omit it to keep the snapshot until you delete it.

```bash
neon snapshots create --branch main --name pre-upgrade --expires-at 2027-08-05T22:00:00Z
```

Both options use RFC 3339 format. Snapshot names must be unique within a project.

#### Update a snapshot's expiration

Use [snapshots update](/docs/cli/snapshots#update) to change a snapshot's expiration after it's created, or `--clear-expiration` to remove the expiration so it never expires:

```bash
neon snapshots update snap-1234 --expires-at 2027-12-31T00:00:00Z
```

```bash
neon snapshots update snap-1234 --clear-expiration
```

#### List and inspect snapshots

```bash
neon snapshots list
```

```bash
neon snapshots get snap-1234
```

For all subcommands and flags, see the [snapshots](/docs/cli/snapshots) CLI reference.

</TabItem>

<TabItem>

You can create a snapshot from a branch using the [Create snapshot](/docs/reference/api/snapshots/create-snapshot) endpoint. A snapshot can be created from a specific timestamp (RFC 3339 format) or LSN (for example 16/B3733C50) within the branch's [history window](/docs/postgres/backup-restore/history-window). The `timestamp` and `lsn` parameters are mutually exclusive; you can use one or the other, not both.

This endpoint takes its parameters in the query string. It has no request body, and a body you send is ignored without an error.

```bash shouldWrap
curl -X POST "https://console.neon.tech/api/v2/projects/project_id/branches/branch_id/snapshot?name=my_snapshot&timestamp=2025-07-29T21:00:00Z&expires_at=2027-08-05T22:00:00Z" \
  -H 'authorization: Bearer $NEON_API_KEY' |jq
```

The parameters used in the example above:

- `timestamp`: A point in time to create the snapshot from (RFC 3339 format).
- `name`: A user-defined name for the snapshot.
- `expires_at`: The timestamp when the snapshot will be automatically deleted (RFC 3339 format). Omit it to keep the snapshot until you delete it. Manual snapshots have no maximum expiration.

#### Update a snapshot's expiration

You can change a snapshot's expiration after it is created using the [Update snapshot](/docs/reference/api/snapshots/update-snapshot) endpoint. Set `expires_at` to a future timestamp to extend or change the retention deadline, or send `null` to clear it so the snapshot never expires. Omit the field to leave the expiration unchanged.

```bash
curl -X PATCH "https://console.neon.tech/api/v2/projects/project_id/snapshots/snapshot_id" \
  -H "Content-Type: application/json" \
  -H 'authorization: Bearer $NEON_API_KEY' \
  -d '{
    "snapshot": {
      "expires_at": "2026-12-31T00:00:00Z"
    }
  }' |jq
```

### Snapshot size fields in API responses

Responses from the [Create snapshot](/docs/reference/api/snapshots/create-snapshot), [List project snapshots](/docs/reference/api/snapshots/list-snapshots), and [Update snapshot](/docs/reference/api/snapshots/update-snapshot) endpoints include a `snapshot` object that may contain optional **`full_size`** and **`diff_size`** (both **`int64`**, size in bytes).

#### Manual and scheduled snapshots

- **Manual** snapshots report **`full_size`**: the full logical size at the time of the snapshot.
- **Scheduled** snapshots: the **first** scheduled snapshot reports **`full_size`** (full logical size). **Subsequent** scheduled snapshots report **`diff_size`**, which is incremental storage since the **previous scheduled** snapshot, when the snapshot is billed on **incremental (diff)** usage.

#### The `full_size` field

Full logical size of the snapshot in bytes at the time it was taken. When the field is **absent**, the logical size has not been calculated yet and the snapshot is **not** being charged. When **present**, a value of **`0`** means the snapshot is **not** being charged.

#### The `diff_size` field

Incremental storage size in bytes since the **previous scheduled snapshot**, when the snapshot is billed on **incremental (diff)** usage. When **absent**, either the incremental size has not been calculated yet and the snapshot is **not** being charged, or the snapshot is charged at **full logical size** (in that case **`full_size`** is set).

Depending on billing mode and whether sizes have finished calculating, either field may be omitted. For parameter-level definitions, see each endpoint in the [Neon API Reference](/docs/reference/api).

**Related API references:**

- [Create snapshot](/docs/reference/api/snapshots/create-snapshot)
- [List project snapshots](/docs/reference/api/snapshots/list-snapshots)
- [Update snapshot](/docs/reference/api/snapshots/update-snapshot)
- [Delete snapshot](/docs/reference/api/snapshots/delete-snapshot)

</TabItem>

</Tabs>

## Create backup schedules

Schedule automated snapshots to run at regular intervals (daily, weekly, or monthly) to ensure consistent backups without manual intervention. Backup schedules are configured per branch and only apply to root branches.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

To create a backup schedule:

1. **Open the schedule editor**

   From the **Backup & restore** page, click **Edit schedule** to open the backup schedule configuration dialog.

   ![Edit schedule button on Backup & restore page](/docs/guides/edit_snapshot_schedule.png)

2. **Select a schedule frequency**

   Choose from the following options:
   - **No schedule**: Disables automated snapshots (default)
   - **Daily**: Creates a snapshot every day at a specified time
   - **Weekly**: Creates a snapshot on a specific day of the week
   - **Monthly**: Creates a snapshot on a specific day of the month

   ![Schedule frequency options dropdown](/docs/guides/snapshot_schedule_menu.png)

3. **Configure schedule details**

   Depending on your selected frequency, configure how often you want to create snapshots and how long to keep them.

Once configured, snapshots created by the backup schedule will appear on the **Backup & restore** page with a label indicating they were created automatically.

</TabItem>

<TabItem>

Use [snapshots schedule set](/docs/cli/snapshots#schedule-set) to set a branch's schedule. Pick a `--frequency`, then set the companion flags it requires:

| `--frequency` | Also required     | `--day` range       |
| ------------- | ----------------- | ------------------- |
| `daily`       | `--hour` (0-23)   | not used            |
| `weekly`      | `--day`, `--hour` | 1-7 (Monday-Sunday) |
| `monthly`     | `--day`, `--hour` | 1-31                |

Set a daily snapshot at 23:00 UTC, kept for 7 days:

```bash
neon snapshots schedule set --branch main --frequency daily --hour 23 --retention 604800
```

Set a weekly snapshot on Mondays at 04:00:

```bash
neon snapshots schedule set --branch main --frequency weekly --day 1 --hour 4
```

For a multi-entry schedule, pass JSON with `--schedule`, which overrides the single-entry flags:

```bash shouldWrap
neon snapshots schedule set --branch main --schedule '[{"frequency":"daily","hour":3},{"frequency":"weekly","day":1,"hour":4}]'
```

`--retention` is in seconds, from 3600 (1 hour) to 3024000 (35 days). See [Snapshot retention](#snapshot-retention) for what happens when you omit it.

To view the current schedule, use [snapshots schedule get](/docs/cli/snapshots#schedule-get):

```bash
neon snapshots schedule get --branch main
```

</TabItem>

<TabItem>

You can view and set backup schedules for branches using the Neon API. For complete API documentation, refer to the [Neon API Reference](/docs/reference/api).

**View backup schedule**

Retrieves the current backup schedule configuration for a branch using the [View backup schedule](/docs/reference/api/snapshots/get-snapshot-schedule) endpoint.

```bash
GET /projects/{project_id}/branches/{branch_id}/backup_schedule
```

```bash shouldWrap
curl 'https://console.neon.tech/api/v2/projects/<project_id>/branches/<branch_id>/backup_schedule' \
  -H 'Authorization: Bearer $NEON_API_KEY' | jq
```

**Example response:**

```json
{
  "schedule": [
    {
      "frequency": "daily",
      "hour": 23,
      "retention_seconds": 1209600
    }
  ]
}
```

**Set backup schedule**

Set the backup schedule for a branch using the [Update backup schedule](/docs/reference/api/snapshots/set-snapshot-schedule) endpoint.

```bash
PUT /projects/{project_id}/branches/{branch_id}/backup_schedule
```

The request body must include a `schedule` array. Each item in the array can specify:

- `frequency` (required): `daily`, `weekly`, or `monthly`
- `hour`: Hour of the day (0–23) to take the snapshot. Required for every frequency.
- `day`: Day of the week (1–7, Monday to Sunday) for `weekly`, or day of the month (1–31) for `monthly`. Required for those two frequencies, and setting it also requires `hour`.
- `retention_seconds` (optional): How long to keep each snapshot before it is automatically deleted, from 3600 (1 hour) to 3024000 (35 days). See [Snapshot retention](#snapshot-retention) for what happens when you omit it.

Although the schema marks `hour` and `day` optional, the server rejects a schedule that leaves out the values its frequency needs, with an error such as `daily schedules must specify the hour of the day`.

**Example: set a daily schedule**

```bash shouldWrap
curl -X PUT "https://console.neon.tech/api/v2/projects/<project_id>/branches/<branch_id>/backup_schedule" \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "schedule": [
      {
        "frequency": "daily",
        "hour": 23,
        "retention_seconds": 604800
      }
    ]
  }'
```

This example creates a daily snapshot at 23:00 (11:00 PM) UTC and keeps it for 7 days (604800 seconds).

</TabItem>

</Tabs>

### Snapshot retention

Manual and scheduled snapshots expire on different rules:

- **Scheduled snapshots** are kept for 35 days unless you set a shorter retention, and 35 days is also the maximum. The Console shows this per frequency as 35 days, 5 weeks, or 1 month.
- **Manual snapshots** never expire unless you give them an expiration, which has no maximum. Backup schedule retention settings do not apply to them.

You can adjust retention at any time by editing the schedule. Shorter retention periods help manage storage. On paid plans, the per-plan snapshot limit applies only to manual snapshots; scheduled backup snapshots do not count. Deleted snapshots cannot be recovered.

## Update backup schedules

Change an existing backup schedule or turn it off.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

From the **Backup & restore** page, click **Edit schedule** to open the **Edit backup schedule** modal. Change the frequency or schedule details, then click **Update schedule** to save.

**To turn off a snapshot schedule:** Select **No schedule** from the dropdown in the **Edit backup schedule** modal, then click **Update schedule**. No snapshots will be created until you set a schedule again.

![Edit backup schedule modal](/docs/guides/edit_backup_schedule_modal.png)

</TabItem>

<TabItem>

To change a schedule, run [snapshots schedule set](/docs/cli/snapshots#schedule-set) again with the new values. The command replaces the existing schedule rather than adding to it.

```bash
neon snapshots schedule set --branch main --frequency weekly --day 1 --hour 4
```

**To turn off a backup schedule:** pass an empty JSON array with `--schedule`:

```bash
neon snapshots schedule set --branch main --schedule '[]'
```

</TabItem>

<TabItem>

To update a backup schedule via API, use the same PUT endpoint and request format as for creating a schedule. See [Create backup schedules](#create-backup-schedules) for the endpoint, request body parameters, and example.

**To turn off a backup schedule:** Send a PUT request with an empty `schedule` array in the request body:

```bash shouldWrap
curl -X PUT "https://console.neon.tech/api/v2/projects/<project_id>/branches/<branch_id>/backup_schedule" \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "schedule": []
  }'
```

</TabItem>

</Tabs>

## Restore from a snapshot

You can restore from any snapshot in your project using one of two methods:

- **One-step restore** – Instantly restore data from the snapshot into the existing branch. The branch name and connection string remain the same, but the branch ID changes.
- **Multi-step restore** – Create a new branch from the snapshot. Use this option if you want to inspect or test the data before switching to the new branch.

### One-step restore

Use this option if you want to restore the snapshot data immediately without inspecting the data first.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

1. Locate the snapshot you want to use and click **Restore → One-step restore**.

   ![One step restore option](/docs/guides/one_step_restore.png)

2. The **One-step restore** modal explains the operation:
   - The restore operation will occur instantly.
   - The current branch will be restored to the snapshot state.
   - A branch named `<branch_name> (old)` will be created as a backup. Other snapshots you may have taken previously remain attached to this branch.

   ![One step restore confirmation modal](/docs/guides/one_step_restore_modal.png)

   Click **Restore** to proceed with the operation.

3. Your branch is immediately restored to the snapshot state, and the `<branch_name> (old)` branch is created, which you'll find on the **Branches** page in the Neon Console, as shown here:
   ![Branches page that shows the backup branch](/docs/guides/one_step_restore_branches_page.png)

   After you verify that the restore operation was successful, you can delete the backup branch if you no longer need it.

</TabItem>

<TabItem>

Use [snapshots restore](/docs/cli/snapshots#restore) with `--finalize` to restore and swap the branch in one step. This restores the snapshot to a new branch, moves your computes onto it, and replaces the target branch, so your connection details stay the same.

```bash
neon snapshots restore snap-1234 --target-branch main --finalize
```

Options:

- `--target-branch`: The branch to restore onto. Defaults to the snapshot's source branch. Recommended whenever you finalize, and especially if you apply several snapshots in succession, so the restore doesn't target a branch renamed by an earlier restore.
- `--name`: Name for the newly restored branch. Auto-generated when omitted.

Find the snapshot ID with `neon snapshots list`. The replaced branch is kept as a backup, renamed to `<branch_name> (old)`. If the branch being replaced was **protected**, that protection is **moved** to the branch with the restored data, not left on both branches.

</TabItem>

<TabItem>

A one-step restore operation is performed using the [Restore snapshot](/docs/reference/api/snapshots/restore-snapshot) endpoint. This operation creates a new branch, restores the snapshot to the new branch, and moves computes from your current branch to the new branch.

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/project_id/snapshots/snapshot_id/restore" \
  -H "Content-Type: application/json" \
  -H 'authorization: Bearer $NEON_API_KEY' \
  -d '{
    "name": "restored_branch",
    "target_branch_id": "br-twilight-river-31791249",
    "finalize_restore": true
  }' |jq
```

Parameters:

- `name`: (Optional) Name of the new branch with the restored snapshot data. If not provided, a default branch name will be generated. Pass this in the request body; the `name` query parameter is deprecated.
- `finalize_restore`: Set to `true` to finalize the restore immediately, which is what makes this a one-step restore. Finalizing the restore moves computes from your current branch to the new branch with the restored snapshot data for a seamless restore operation; no need to change the connection details in your application. If the branch being replaced was **protected**, that protection is **moved** to the branch with the restored data (it is not left on both branches). Set it to `false` for a [multi-step restore](#multi-step-restore) instead.
- `target_branch_id`: (Optional but recommended) The ID of the branch you want to replace when finalizing the restore. If omitted, subsequent snapshot restores may target the branch renamed to `<branch_name> (old)` from a previous restore, not your intended production branch.

<Admonition type="note">
If you plan to apply multiple snapshots in succession, always supply `target_branch_id` to ensure the restore is finalized against the correct branch (typically your current production branch). Without it, a second snapshot may be applied to the previously renamed "(old)" branch.
</Admonition>

**Related API references:**

- [Restore snapshot](/docs/reference/api/snapshots/restore-snapshot)
- [List project snapshots](/docs/reference/api/snapshots/list-snapshots)

</TabItem>

</Tabs>

### Multi-step restore

Use this option if you need to inspect the restored data before you switch over to the new branch.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

1. Locate the snapshot you want to use and click **Restore → Multi-step restore**.
   ![Multi-step restore option](/docs/guides/multi_step_restore.png)
2. The **Multi-step restore** modal explains the operation:
   - The restore will occur instantly
   - Your current branch will remain unchanged
   - A new branch with the snapshot data will be created

   ![Multi-step restore confirmation modal](/docs/guides/multi_step_restore_modal.png)

3. Clicking **Restore** creates the new branch with the restored data and directs you to the **Branch overview** page where you can:
   - **Get connection details** for the new branch to preview the data restored from the snapshot
   - **Migrate connections and settings** to move your database URLs and compute settings from the old branch to the new branch so you don't have to update the connection configuration in your application

   ![Branch overview page](/docs/guides/branch_overview_page.png)

</TabItem>

<TabItem>

1.  **Restore the snapshot to a new branch**

    Run [snapshots restore](/docs/cli/snapshots#restore) without `--finalize`, which leaves the restore un-finalized so you can inspect the new branch first:

    ```bash
    neon snapshots restore snap-1234 --target-branch main --name my_restored_branch
    ```

    Options:
    - `--name`: (Optional) Name for the newly restored branch. Auto-generated when omitted.
    - `--target-branch`: (Optional but recommended) The branch you intend to replace when you later finalize (typically your production branch). Providing this avoids finalizing against the `<branch_name> (old)` branch created by an earlier restore.

    Find the snapshot ID with `neon snapshots list`. The command prints the ID of the restored branch along with the exact `finalize` command to run.

2.  **Inspect the new branch**

    Connect to the restored branch and query it to confirm the data is what you expect:

    ```bash
    neon connection-string my_restored_branch
    ```

3.  **Finalize the restore**

    Pass the restored branch, not the target branch, to [snapshots finalize](/docs/cli/snapshots#finalize):

    ```bash
    neon snapshots finalize br-twilight-river-31791249
    ```

    This performs the same actions as the API's finalize step: it moves the original branch's computes to the restored branch, renames the restored branch to the original's name, and renames the original to `<branch_name> (old)`. Any backup schedule moves to the restored branch, and if the original was **protected**, that protection is **moved** rather than left on both branches. Use `--name` to choose the replaced branch's name instead of the generated one.

</TabItem>

<TabItem>

1.  **Restore the snapshot to a new branch**

    The first step in a multi-step restore operation is to restore the snapshot to a new branch using the [Restore snapshot](/docs/reference/api/snapshots/restore-snapshot) endpoint:

    ```bash
    curl -X POST "https://console.neon.tech/api/v2/projects/project_id/snapshots/snapshot_id/restore" \
    -H "Content-Type: application/json" \
    -H 'authorization: Bearer $NEON_API_KEY' \
    -d '{
       "name": "my_restored_branch",
       "finalize_restore": false
    }' |jq
    ```

    Parameters:
    - `name`: (Optional) Name of the new branch with the restored snapshot data. If not provided, a default branch name will be generated.
    - `finalize_restore`: Set to `false` so that you can inspect the new branch before finalizing the restore operation.
    - `target_branch_id`: (Optional but recommended) Specify the branch ID you intend to replace when you later finalize the restore (typically your production branch). Providing this avoids subsequent operations defaulting to the `<branch_name> (old)` branch created by an earlier restore.

       <Admonition type="note">
          You can find the `snapshot_id` using the [List project snapshots](/docs/reference/api/snapshots/list-snapshots) endpoint.

             ```bash
             curl -X GET "https://console.neon.tech/api/v2/projects/project_id/snapshots" \
             -H "Content-Type: application/json" \
             -H "Authorization: Bearer $NEON_API_KEY" |jq
             ```

       </Admonition>

       <Admonition type="note">
          If you will finalize the restore later or plan multiple restores, include `target_branch_id` during the restore call to anchor the operation to the correct target branch.
       </Admonition>

2.  **Inspect the new branch**

    After restoring the snapshot, you can connect to the new branch and run queries to inspect the data. You can get the branch connection string from the Neon Console or using the [Retrieve connection URI](/docs/reference/api/projects/get-connection-uri) endpoint.

    ```bash
    curl --request GET \
      --url 'https://console.neon.tech/api/v2/projects/project_id/connection_uri?branch_id=branch_id&database_name=db_name&role_name=role_name&pooled=true' \
      --header 'accept: application/json' \
      --header 'authorization: Bearer $NEON_API_KEY' |jq
    ```

3.  **Finalize the restore**

    If you're satisfied with the data on the new branch, finalize the restore operation using the [Finalize restore](/docs/reference/api/branches/finalize-restore-branch) endpoint. This step performs the following actions:
    - Moves your original branch's computes to the new branch and restarts the computes.
    - Renames the new branch to original branch's name.
    - Renames the original branch to `<branch_name> (old)`. Other snapshots you may have taken remain attached to this branch.
    - Moves any backup schedule from the original branch to the branch that now has the restored data, so scheduled snapshots continue on the active branch after finalize.
    - If the original branch was **protected**, that protection is **moved** to the branch that ends up with your restored data (the renamed branch that keeps your connection string). The previous branch is no longer protected, so your [protected branch](/docs/guides/protected-branches) count stays correct.

    ```bash
    curl -X POST "https://console.neon.tech/api/v2/projects/project_id/branches/branch_id/finalize_restore" \
    -H "Content-Type: application/json" \
    -H 'authorization: Bearer $NEON_API_KEY' |jq
    ```

    Parameters:
    - `project_id`: The Neon project ID.
    - `branch_id`: The branch ID of the branch created by the snapshot restore operation.

</TabItem>

</Tabs>

## Limitations

- Instant restore (PITR) is currently not supported on branches created from a snapshot restore. If you restore a snapshot to create a new branch, you cannot perform point-in-time restore on that branch at this time. Attempting to do so will return an error: `restore from snapshot on target branch is still ongoing`.
- **Reset from parent is unavailable on child branches for up to 24 hours after restoring a parent from a snapshot.** When you restore a branch from a snapshot, any child branches of that restored branch cannot use the [Reset from parent](/docs/guides/reset-from-parent) feature for up to 24 hours.

<NeedHelp/>
