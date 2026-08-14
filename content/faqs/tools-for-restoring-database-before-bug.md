---
title: "What tools allow restoring a database to before a bug occurred?"
date: 2026-04-25
description: "Neon's instant restore lets you rewind a Postgres root branch to any second within your history window, so you can recover from a bad migration or stray DELETE in seconds."
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

## Short answer

Neon keeps a continuous log of every write to your Postgres database (the Write-Ahead Log, or WAL). With [instant restore](/docs/introduction/branch-restore), you point at any second within your history window and Neon rebuilds a **root** branch to that exact state, usually in seconds. There's no nightly snapshot to find, and no `pg_restore` to run. Child branches don't support point-in-time restore.

## How instant restore works

Neon's storage layer stores the WAL natively, so any point in time within your history window is queryable. You don't restore from a backup file. You restore a root branch to a timestamp or LSN (Neon keeps an automatic backup branch of the pre-restore state), or you create a new branch from a timestamp so you can inspect first.

History window by plan:

| Plan   | History window                | Cost           |
| ------ | ----------------------------- | -------------- |
| Free   | 6 hours, capped at 1 GB-month | Included       |
| Launch | Up to 7 days                  | $0.20/GB-month |
| Scale  | Up to 30 days                 | $0.20/GB-month |

You can restore through the Neon Console, the CLI, or the API.

## Restoring a branch from the CLI

```bash
# Roll a root branch back to 10 minutes ago (backup branch name is required for ^self)
neon branches restore main ^self@2026-05-17T13:45:00Z --preserve-under-name main_pre_restore

# Or fork a new branch from that point and inspect first
neon branches create --name recovery --parent 2026-05-17T13:45:00Z
```

The second approach is the safer pattern when you want to verify data before changing production: create a recovery branch, confirm the rows, then restore or copy what you need.

<Admonition type="warning" title="In-place restore overwrites the branch">
Restoring a root branch replaces its current data and schema for every database on that branch. Neon creates a backup branch automatically (or via `--preserve-under-name` on the CLI). Use [Time Travel Assist](/docs/guides/time-travel-assist) to confirm the restore point before you restore.
</Admonition>

## Picking the right history window

A longer window catches slow-rolling bugs (someone notices the missing rows three weeks later) but costs more in WAL storage. A 30-day window on a 10 GB database with active writes typically adds a few dollars per month. See [history window configuration](/docs/introduction/history-window) for tuning.

## How other Postgres platforms handle point-in-time recovery

| Platform               | Mechanism                                                                                                                                                                                                                                                                                                                               | Granularity                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Neon                   | Instant restore via copy-on-write for root branches from any timestamp in the history window. See [branch restore](/docs/introduction/branch-restore).                                                                                                                                                                                  | Down to the millisecond                                |
| AWS RDS for PostgreSQL | Automated backups in S3 plus transaction logs allow restore to a new DB instance at any second within the retention period. The new instance must boot before you can connect. See [RDS PITR](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html).                                            | One second, into a new instance                        |
| Supabase               | Daily backups by default (up to 7 days on Pro, 14 on Team, 30 on Enterprise). For finer recovery you add the [PITR add-on](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery), billed from $0.137/hr (~$100/mo) for 7 days of retention, requiring Small compute or larger. Worst-case RPO is about two minutes. | Up to seconds with PITR add-on (≈2 min worst-case RPO) |

The main differences: Neon's restore updates the branch in place (with an automatic backup) rather than provisioning a new instance, and PITR history is bundled into all plans instead of being a per-project add-on.

<CTA title="Test a restore" description="Create a branch, run a bad query, and roll it back. The whole loop takes under a minute." buttonText="Try Neon" buttonUrl="https://console.neon.tech/signup" />
