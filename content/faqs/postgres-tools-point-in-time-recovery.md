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

Lakebase Postgres has point-in-time recovery (called **instant restore**) built in for root branches, such as `production`. Child branches don't support it; you [reset them from their parent](/docs/cli/branches#reset) instead. The storage engine keeps a continuous log of WAL records, so you can restore a root branch to any moment within the history window, with no `pgBackRest`, `WAL-G`, or `Barman` setup and no base-backup-plus-WAL-replay wait.

## How to restore

From the Neon CLI:

```bash
# Restore the production branch to a timestamp, keeping the pre-restore state as a backup
neon branches restore production ^self@2026-05-15T14:30:00Z \
  --preserve-under-name production_pre_restore
```

From the API:

```bash
curl -X POST https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/restore \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "source_branch_id": "'$BRANCH_ID'",
    "source_timestamp": "2026-05-15T14:30:00Z",
    "preserve_under_name": "production_pre_restore"
  }'
```

The restore overwrites the branch with its state at that timestamp and usually takes a few seconds. Connection strings stay the same. Existing connections are interrupted during the restore, and your app can reconnect as soon as it finishes ([instant restore](/docs/postgres/backup-restore/branch-restore#connections-temporarily-interrupted)).

## How far back you can go

The maximum history window depends on your plan. New paid-plan projects default to 1 day, so raise it in **Settings** if you want the full window ([history window](/docs/postgres/backup-restore/history-window)).

| Plan        | Max history window                 | Cost           |
| ----------- | ---------------------------------- | -------------- |
| Free plan   | 6 hours, capped at 1 GB of changes | $0             |
| Launch plan | Up to 7 days                       | $0.20/GB-month |
| Scale plan  | Up to 30 days                      | $0.20/GB-month |

You can only restore root branches, so history storage is billed only on root branches. Child branches don't add to this charge ([plans](/docs/introduction/plans#instant-restore)).

## Time Travel Assist

Before you overwrite a production branch, confirm the data at the target timestamp looks right. [Time Travel Assist](/docs/postgres/backup-restore/time-travel-assist) lets you run read-only queries against a past state without restoring anything, so you can find when a bad migration ran or a row got deleted.

<Admonition type="important" title="Restore is an overwrite, not a merge">
A restore replaces the data and schema of every database on the branch with their state at the target time. Everything written after that point is excluded. Neon keeps the pre-restore state in a backup branch (named `{branch}_old_{timestamp}` in the Console, or the name you pass to `--preserve-under-name`), so you can undo the restore. Object Storage and Functions aren't part of the database timeline, so a restore doesn't revert them.
</Admonition>

## Snapshots for known-good points

To keep a copy of a branch that outlives the rolling history window, take a [snapshot](/docs/guides/backup-restore). The Free plan includes 1 manual snapshot, and the Launch and Scale plans include 100. Paid plans can also schedule automated backups, which don't count toward that limit. Snapshot storage is billed at $0.09/GB-month. You can restore a snapshot onto the existing branch in one step, or to a new branch you inspect first.

## How this compares to other Postgres services

Most managed Postgres services offer PITR. They differ in where the restore lands and how you pay for it.

| Provider                | Max history window                                                                                                            | Restore destination                                               | Notes                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Neon                    | 30 days (Scale plan)                                                                                                          | Overwrites the branch in place; auto-creates a backup branch      | Built in, billed per GB-month of change history on root branches                                                       |
| Amazon RDS for Postgres | [Up to 35 days](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html) | Restores to a new database instance                               | Setting retention to 0 days disables automated backups                                                                 |
| Aurora Postgres         | [Up to 35 days](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Backups.html)                    | Restores to a new database cluster                                | Continuous, incremental automated backups that can't be disabled                                                       |
| Supabase                | [Up to 28 days](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery)                                     | Restores in place; the project is inaccessible during the restore | PITR add-on from about $100/month for 7 days, requires Small compute or larger; daily backups otherwise (none on Free) |

A Neon restore doesn't copy data or boot a new instance. Neon creates a new branch at the target point in the existing storage history, moves your compute onto it, and renames it to match the original branch ([technical details](/docs/postgres/backup-restore/branch-restore#technical-details)).

<CTA title="Set up instant restore" description="Configure your history window and try a point-in-time restore in the Neon Console." buttonText="Read the guide" buttonUrl="https://neon.com/docs/postgres/backup-restore/branch-restore" />
