---
title: History window
subtitle: >-
  Control how long Neon keeps change history for instant restore, Time Travel,
  and branching from past states
summary: >-
  The history window is a per-project setting (Console: Settings → Instant
  restore) that controls how far back Neon retains WAL records for instant
  restore, Time Travel queries, and branching from past states. Free plans cap
  retention at 6 hours (1 GB), Launch plans allow up to 7 days, and Scale
  plans allow up to 30 days. Retained WAL is billed as History storage at
  $0.20/GB-month. Set the window with the Console slider or the
  history_retention_seconds API property. Setting it to zero disables instant
  restore and Time Travel entirely.
enableTableOfContents: true
redirectFrom:
  - /docs/introduction/restore-window
updatedOn: '2026-06-05T17:20:32.620Z'
---

**Instant restore** is Neon's point-in-time recovery feature: you can roll a root branch back to an earlier state without copying the whole database. Instant restore (and Time Travel queries, branching from past states, and snapshots) rely on Neon retaining a **history** of changes. The **history window** is the Console control—on **Settings → Instant restore**—that sets how long that change history is kept, which defines how far back instant restore and the other features can reach.

## Defaults and plan limits

| Plan   | Default | Maximum                             |
| ------ | ------- | ----------------------------------- |
| Free   | 6 hours | 6 hours (capped at 1 GB of history) |
| Launch | 1 day   | 7 days                              |
| Scale  | 1 day   | 30 days                             |

A longer history window means:

- Instant restore can reach further back in time
- Time Travel queries can reach further back
- You can create branches from older historical states
- More WAL records are stored, increasing **History** usage (the change history metered for instant restore on your bill)

## How it works

Neon stores a continuous record of all changes to your data in the form of Write-Ahead Log (WAL) records. The history window setting determines the retention period for this history, which instant restore and related features use.

WAL records that fall outside the configured history window are automatically removed and stop contributing to your project's storage costs.

## Storage and billing

The history window directly affects **History** on your usage dashboard (billed as instant restore storage on invoices). Neon retains WAL records for that duration. The more history you retain, the more storage you use, and the higher those charges.

| Plan   | Cost                       |
| ------ | -------------------------- |
| Free   | No charge (capped at 1 GB) |
| Launch | $0.20/GB-month             |
| Scale  | $0.20/GB-month             |

This is separate from your regular storage charges for branch data. You're billed for:

- **Storage**: Your actual data size (root branches) or the minimum of accumulated changes or logical data size (child branches)
- **History**: The WAL history retained within your history window for instant restore

**Understand the trade-offs:** Shortening the history window decreases History usage and cost but limits how far back **instant restore** (and Time Travel) can go. Set the window to match your recovery needs.

See [Cost optimization](/docs/introduction/cost-optimization#instant-restore-storage).

## Configure the history window for instant restore

Changing the history window affects **all branches** in your project.

<Tabs labels={["Console", "API"]}>

<TabItem>

1. Select your project.
2. Go to **Settings** > **Instant restore**.

   ![History window configuration](/docs/manage/instant_restore_setting.png)

3. Under **History window**, use the slider to choose how long to keep change history (used for instant restore, Time Travel, and branching from past states). You can open **history storage** from the description on that page for details.
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
Reducing the history window to zero minimizes History usage and cost but disables **instant restore** and Time Travel queries.

</Admonition>

## Production recommendations

For production workloads, consider extending the history window to 7 days so **instant restore** can reach further back. This provides:

- Protection against data loss from human or application errors that may go unnoticed for several days
- Compliance with retention requirements that may apply to your industry

See [Getting ready for production](/docs/get-started/production-checklist#size-the-history-window-for-instant-restore).

## Related features

The history window setting bounds how far back these capabilities can go:

- [Instant restore](/docs/introduction/branch-restore): Restore a root branch to an earlier point in time
- [Time Travel](/docs/guides/time-travel-assist): Query historical data
- [Branching](/docs/introduction/branching): Create branches from past states
- [Snapshots](/docs/guides/backup-restore): Capture and restore from specific points

<Admonition type="note">
Instant restore and the history window apply to branch data (point-in-time recovery). That is different from the **deletion recovery period**, which allows you to recover (undelete) an entire deleted project. For information about recovering deleted projects, see [Project recovery](/docs/manage/projects#recover-a-deleted-project).
</Admonition>

<NeedHelp/>
