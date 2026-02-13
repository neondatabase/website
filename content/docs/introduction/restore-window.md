---
title: Restore window
subtitle: Configure how far back you can restore your data and run Time Travel queries
summary: >-
  Covers the configuration of the restore window in Neon, detailing how it
  affects data retention for Time Travel queries, instant restores, and
  associated storage costs based on different plan limits.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.105Z'
---

The **restore window** determines how far back Neon retains a history of changes for your branches. This history retention period powers several Neon features: instant restore (point-in-time recovery), Time Travel queries, branching from past states, and snapshots.

## Defaults and plan limits

| Plan   | Default | Maximum                             |
| ------ | ------- | ----------------------------------- |
| Free   | 6 hours | 6 hours (capped at 1 GB of history) |
| Launch | 1 day   | 7 days                              |
| Scale  | 1 day   | 30 days                             |

A longer restore window means:

- You can restore branches to earlier points in time
- Time Travel queries can reach further back
- You can create branches from older historical states
- More WAL records are stored, increasing instant restore storage costs

## How it works

Neon stores a continuous record of all changes to your data in the form of Write-Ahead Log (WAL) records. The restore window determines the retention period for this history.

WAL records that exceed your restore window are automatically removed and stop contributing to your project's storage costs.

## Storage and billing

The restore window directly affects your instant restore storage costs. Neon retains WAL records for the duration of your restore window. The more history you retain, the more storage you use, and the higher your instant restore storage charges.

| Plan   | Cost                       |
| ------ | -------------------------- |
| Free   | No charge (capped at 1 GB) |
| Launch | $0.20/GB-month             |
| Scale  | $0.20/GB-month             |

This is separate from your regular storage charges for branch data. You're billed for:

- **Storage**: Your actual data size (root branches) or the minimum of accumulated changes or logical data size (child branches)
- **Instant restore storage**: The WAL history retained within your restore window

**Understand the trade-offs:** Reducing your restore window decreases instant restore storage costs but limits how far back you can restore data. Consider your actual recovery requirements and set the window accordingly.

See [Cost optimization](/docs/introduction/cost-optimization#instant-restore-storage).

## Configure your restore window

Changing the restore window affects **all branches** in your project.

<Tabs labels={["Console", "API"]}>

<TabItem>

1. Select your project.
2. Go to **Settings** > **Instant restore**.

   ![Restore window configuration](/docs/manage/instant_restore_setting.png)

3. Use the slider to select your desired **restore window**.
4. Click **Save**.

</TabItem>

<TabItem>

Use the `history_retention_seconds` property in the project settings:

```bash
curl -X PATCH 'https://console.neon.tech/api/v2/projects/{project_id}' \
  -H 'Authorization: Bearer $NEON_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "project": {
      "history_retention_seconds": 604800
    }
  }'
```

The value is specified in seconds:

- 6 hours = 21600
- 1 day = 86400
- 7 days = 604800
- 30 days = 2592000

</TabItem>

</Tabs>

<Admonition type="note">
Reducing the restore window to zero minimizes instant restore storage costs but disables the ability to restore data or run Time Travel queries.
</Admonition>

## Production recommendations

For production workloads, consider extending your restore window to 7 days. This provides:

- Protection against data loss from human or application errors that may go unnoticed for several days
- Compliance with retention requirements that may apply to your industry

See [Getting ready for production](/docs/get-started/production-checklist#increase-your-projects-restore-window-to-7-days).

## Related features

The restore window determines what's available for these features:

- [Branching](/docs/introduction/branching): Create branches from past states
- [Time Travel](/docs/guides/time-travel-assist): Query historical data
- [Instant restore](/docs/introduction/branch-restore): Restore a branch to any point within the window
- [Snapshots](/docs/guides/backup-restore): Capture and restore from specific points

<Admonition type="note">
The restore window is for branch point-in-time recovery (PITR), which restores data to a previous state. This is different from the deletion recovery period, which allows you to recover (undelete) a deleted project. For information about recovering deleted projects, see [Project recovery](/docs/manage/projects#recover-a-deleted-project).
</Admonition>

<NeedHelp/>
