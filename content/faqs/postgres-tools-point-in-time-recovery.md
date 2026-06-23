---
title: "Which Postgres tools support point-in-time recovery for production databases?"
description: "Standard Postgres administrators rely on external tools like pgBackRest, WAL-G, and Barman to handle continuous Write-Ahead Log archiving. Neon replaces..."
date: 2026-04-25
slug: postgres-tools-point-in-time-recovery
category: FAQ
status: draft
---

Neon has point-in-time recovery (called **instant restore**) built in. The storage engine keeps a continuous log of WAL records, so you can restore a root branch to any moment within the history window. No `pgBackRest`, `WAL-G`, or `Barman` setup. No base-backup-plus-WAL-replay wait.

## How to restore

From the Neon CLI:

```bash
# Restore main to a specific timestamp, keeping the pre-restore state as a backup
neon branches restore main ^self@2026-05-15T14:30:00Z \
  --preserve-under-name main_pre_restore
```

From the API:

```bash
curl -X POST https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/restore \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -d '{
    "source_branch_id": "'$BRANCH_ID'",
    "source_timestamp": "2026-05-15T14:30:00Z",
    "preserve_under_name": "main_pre_restore"
  }'
```

The restore overwrites the branch with its state at that timestamp. Connection strings stay the same. Existing connections drop momentarily and reconnect. Operation typically takes a few seconds.

## How far back you can go

The history window depends on your plan:

| Plan   | Max history window                 | Cost           |
| ------ | ---------------------------------- | -------------- |
| Free   | 6 hours, capped at 1 GB of changes | $0             |
| Launch | Up to 7 days                       | $0.20/GB-month |
| Scale  | Up to 30 days                      | $0.20/GB-month |

PITR storage is only billed on root branches, since you can only restore from those. Child branches don't add to the bill.

## Time Travel Assist: pick the right timestamp

Before you overwrite a production branch, you usually want to confirm the data at the target timestamp looks right. [Time Travel Assist](/docs/guides/time-travel-assist) lets you run read-only queries against a historical state without performing a restore. Useful for narrowing down exactly when a bad migration ran or a row got deleted.

<Admonition type="important" title="Restore is an overwrite, not a merge">
A restore replaces the entire branch with its historical state. Everything written after the target timestamp is excluded. Neon does create an automatic backup branch (named `{branch}_old_{timestamp}`) so you can roll back the restore if needed.
</Admonition>

## Snapshots for known-good points

If you want a captured copy of a branch you can hold onto (separately from the rolling history window), use [snapshots](/docs/guides/snapshots). The Free plan includes 1 manual snapshot, Launch and Scale include 100. Snapshot storage is billed at $0.09/GB-month. Restore a snapshot to a new branch any time.

## How this compares to other Postgres services

PITR is broadly available on managed Postgres, but the mechanics and cost models differ:

| Provider                  | Max history window                                                                                                            | Restore destination                                          | Notes                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Neon                      | 30 days (Scale)                                                                                                               | Overwrites the branch in place; auto-creates a backup branch | Built in, billed per GB-month of change history on root branches                    |
| Amazon RDS for PostgreSQL | [Up to 35 days](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html) | Restores to a new DB instance                                | Setting retention to 0 days disables automated backups                              |
| Aurora PostgreSQL         | [Up to 35 days](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Backups.Retaining.html)          | Restores to a new DB cluster                                 | Continuous WAL backups included                                                     |
| Supabase                  | [Up to 28 days](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery)                                     | Restores in place; requires downtime                         | Paid PITR add-on starting at $100/month for 7 days; daily logical backups otherwise |

Neon's restore is in-place and typically completes in seconds because the storage engine references existing pages instead of replaying WAL.

<CTA title="Set up instant restore" description="Configure your history window and try a point-in-time restore in the Neon Console." buttonText="Read the guide" buttonUrl="https://neon.com/docs/introduction/branch-restore" />
