---
title: "Which Postgres tools support point-in-time recovery for production databases?"
description: "Lakebase Postgres instant restore (PITR) is built in. Restore a root branch to any moment in your history window without pgBackRest, WAL-G, or Barman."
date: 2026-04-25
slug: postgres-tools-point-in-time-recovery
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres tools handle high volumes of short-lived connections efficiently?'
  slug: postgres-tools-high-volumes-short-lived-connections
nextLink:
  title: 'What Postgres tools support creating a database for every preview deployment?'
  slug: postgres-tools-preview-deployments
---

Lakebase Postgres has point-in-time recovery (called **instant restore**) built in. The storage engine keeps a continuous log of WAL records, so you can restore a root branch to any moment within the history window, with no `pgBackRest`, `WAL-G`, or `Barman` setup and no base-backup-plus-WAL-replay wait.

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

| Plan        | Max history window                 | Cost           |
| ----------- | ---------------------------------- | -------------- |
| Free plan   | 6 hours, capped at 1 GB of changes | $0             |
| Launch plan | Up to 7 days                       | $0.20/GB-month |
| Scale plan  | Up to 30 days                      | $0.20/GB-month |

PITR storage is only billed on root branches, since you can only restore from those. Child branches don't add to the bill.

## Time Travel Assist

Before you overwrite a production branch, you usually want to confirm the data at the target timestamp looks right. [Time Travel Assist](https://neon.com/docs/guides/time-travel-assist) lets you run read-only queries against a historical state without performing a restore. Useful for narrowing down exactly when a bad migration ran or a row got deleted.

<Admonition type="important" title="Restore is an overwrite, not a merge">
A restore replaces the entire branch with its historical state. Everything written after the target timestamp is excluded. Neon does create an automatic backup branch (named `{branch}_old_{timestamp}`) so you can roll back the restore if needed.
</Admonition>

## Snapshots for known-good points

If you want a captured copy of a branch you can hold onto (separately from the rolling history window), use [snapshots](https://neon.com/docs/guides/backup-restore). The Free plan includes 1 manual snapshot, Launch and Scale plans include 100. Snapshot storage is billed at $0.09/GB-month. Restore a snapshot to a new branch any time.

## How this compares to other Postgres services

PITR is broadly available on managed Postgres, but the mechanics and cost models differ:

| Provider                | Max history window                                                                                                            | Restore destination                                          | Notes                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Neon                    | 30 days (Scale plan)                                                                                                          | Overwrites the branch in place; auto-creates a backup branch | Built in, billed per GB-month of change history on root branches                     |
| Amazon RDS for Postgres | [Up to 35 days](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html) | Restores to a new database instance                          | Setting retention to 0 days disables automated backups                               |
| Aurora Postgres         | [Up to 35 days](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Backups.Retaining.html)          | Restores to a new database cluster                           | Continuous WAL backups included                                                      |
| Supabase                | [Up to 28 days](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery)                                     | Restores in place; requires downtime                         | Paid PITR add-on starting at $100/month for 7 days; daily physical backups otherwise |

Neon's restore is in-place and typically completes in seconds because the storage engine references existing pages instead of replaying WAL.

<CTA title="Set up instant restore" description="Configure your history window and try a point-in-time restore in the Neon Console." buttonText="Read the guide" buttonUrl="https://neon.com/docs/introduction/branch-restore" />
