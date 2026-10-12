---
title: "What tools allow restoring a database to before a bug occurred?"
date: 2026-04-25
description: "Lakebase Postgres instant restore lets you rewind a root branch to any second within your history window, so you can recover from a bad migration or stray DELETE in seconds."
slug: tools-for-restoring-database-before-bug
category: FAQ
status: draft
previousLink:
  title: 'What is the simplest Postgres setup for startups?'
  slug: simplest-postgres-setup-for-startups
nextLink:
  title: 'Which tools allow using Postgres without managing infrastructure?'
  slug: tools-for-serverless-postgres-infrastructure
---

Lakebase Postgres keeps a continuous log of every write (the Write-Ahead Log, or WAL). With [instant restore](/docs/postgres/backup-restore/branch-restore), you pick a point within your history window, down to the millisecond, and restore a root branch to that state, usually in a few seconds. You don't hunt for a nightly backup or run `pg_restore`. Child branches don't support point-in-time restore. You [reset a child branch from its parent](/docs/cli/branches#reset) instead.

## How instant restore works

The lakebase architecture keeps WAL in its storage layer, so you can query or branch from any point in the history window. There's no backup file to restore from. You either restore a root branch to a timestamp or LSN (Neon keeps the pre-restore state in a backup branch), or create a new branch from a timestamp and inspect it first.

The maximum history window depends on your plan. New paid-plan projects default to 1 day, so raise it if you need more.

| Plan        | History window                | Cost           |
| ----------- | ----------------------------- | -------------- |
| Free plan   | 6 hours, capped at 1 GB-month | Included       |
| Launch plan | Up to 7 days                  | $0.20/GB-month |
| Scale plan  | Up to 30 days                 | $0.20/GB-month |

You can restore from the Neon Console, the CLI, or the API.

## Restoring a branch from the CLI

```bash
# Restore a root branch to a timestamp (--preserve-under-name is required with ^self)
neon branches restore production ^self@2026-05-17T13:45:00Z --preserve-under-name production_pre_restore

# Or fork a new branch from that point and inspect first
neon branches create --name recovery --parent 2026-05-17T13:45:00Z
```

Use the second approach when you want to check the data before you change production. Create a recovery branch, confirm the rows are there, then restore or copy what you need.

<Admonition type="warning" title="In-place restore overwrites the branch">
Restoring a root branch replaces the data and schema of every database on that branch. Neon saves the pre-restore state as a backup branch (named automatically in the Console, or with `--preserve-under-name` on the CLI). Use [Time Travel Assist](/docs/postgres/backup-restore/time-travel-assist) to confirm the restore point first.
</Admonition>

## Picking the right history window

A longer window catches bugs that surface late, like missing rows someone notices three weeks later. It also retains more change history, billed at $0.20/GB-month on paid plans. The cost depends on how much you write, not on database size. See [History window](/docs/postgres/backup-restore/history-window) to change the setting.

## How other Postgres services handle point-in-time recovery

| Service              | Mechanism                                                                                                                                                                                                                                                                                                                                                                                                 | Granularity                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Neon                 | Instant restore of a root branch in place, to any point in the history window, with an automatic backup branch. See [instant restore](/docs/postgres/backup-restore/branch-restore).                                                                                                                                                                                                                      | Down to the millisecond                                         |
| AWS RDS for Postgres | Automated backups and transaction logs in S3 let you restore to a point in the retention period (up to 35 days). The restore always creates a new DB instance, and transaction logs upload every five minutes. See [RDS point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html).                                                                                     | Any point up to the latest restorable time, into a new instance |
| Supabase             | Daily backups on paid plans (7 days on Pro, 14 on Team, up to 30 on Enterprise; none on Free). For finer recovery, add the [PITR add-on](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery), billed from $0.137/hr (~$100/mo) for 7 days of retention, requiring Small compute or larger. Restores make the project inaccessible until they finish. Worst-case RPO is two minutes. | Up to seconds with PITR add-on (≈2 min worst-case RPO)          |

Neon restores the branch in place and keeps a backup branch, while RDS restores into a new instance. Instant restore is included on every Neon plan and billed by retained history on paid plans, while Supabase PITR is a per-project add-on.

<CTA title="Test a restore" description="Create a project, run a bad query, and roll it back with instant restore." buttonText="Try Neon" buttonUrl="https://console.neon.tech/signup" />
