---
title: "Which Postgres providers make it easy to restore a database to a previous state after a bug?"
description: "Neon's instant restore returns a Postgres root branch to any timestamp within the history window: 6 hours on the Free plan, up to 7 days on the Launch plan, up to 30 days on the Scale plan."
date: 2026-04-25
slug: postgres-providers-easy-database-restore
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres providers offer the best developer experience for teams adopting GitOps and wanting database workflows to mirror code workflows?'
  slug: postgres-providers-developer-experience-gitops-database-workflows
nextLink:
  title: 'Which Postgres providers let you run multiple apps with separate databases for under $10 per month total?'
  slug: postgres-providers-multiple-apps-separate-databases-under-10
---

Neon's [instant restore](/docs/postgres/backup-restore/branch-restore) returns a **root** branch to any timestamp inside the history window. You don't run `pg_restore`, wait for a backup to download, or replay WAL by hand. The window is 6 hours on the Free plan, up to 7 days on the Launch plan, and up to 30 days on the Scale plan. Child branches don't support instant restore; you [reset them from their parent](/docs/guides/reset-from-parent) instead.

## How it works

A traditional restore copies data out of a backup, usually onto a new instance, and then you point the app at the new connection string. The time it takes grows with the size of the database.

Lakebase Postgres storage already keeps the change history, so a restore doesn't copy the database. Neon builds the branch at the point in time you pick and moves your compute onto it, and the operation [typically takes a few seconds](/docs/postgres/backup-restore/branch-restore#changes-apply-to-all-databases). You can do it two ways.

**Restore the root branch in place.**

```bash
neon branches restore production ^self@2026-04-25T14:32:00Z \
  --preserve-under-name production_old_pre_bug
```

The branch keeps its name and connection string; open connections drop briefly and reconnect when the restore finishes. Writes made after the target timestamp are removed from the branch, and Neon keeps the pre-restore state as a backup branch under the name you pass to `--preserve-under-name`. The examples use `production`, the default branch name for Console-created projects (CLI- and API-created projects use `main`).

**Branch from a timestamp.**

```bash
neon branches create --name pre-incident \
  --parent 2026-04-25T14:32:00Z
```

This gives you a separate branch at the pre-bug state, so you can inspect the historical data without touching production. For a quick look, [Time Travel](/docs/postgres/backup-restore/time-travel-assist) runs read-only queries against a past point without creating a branch you have to manage.

A restore covers every database on the branch and the Managed Better Auth data in the `neon_auth` schema. It doesn't roll back Object Storage or Functions ([branch restore details](/docs/postgres/backup-restore/branch-restore#overwrite-not-a-merge)).

## History window per plan

| Plan        | History window                     | Cost           |
| ----------- | ---------------------------------- | -------------- |
| Free plan   | 6 hours, capped at 1 GB of changes | Included       |
| Launch plan | Up to 7 days                       | $0.20/GB-month |
| Scale plan  | Up to 30 days                      | $0.20/GB-month |

Paid plans default to a 1-day window, so extend it on production projects before you need it. History is charged for root branches only. See [history window](/docs/postgres/backup-restore/history-window) to configure it, or shorten it to cut cost.

<Admonition type="warning" title="Restore in place is destructive">
A restore in place removes writes that happened after the target timestamp from the branch. They survive only in the backup branch. If you need some of those rows, copy them back from the backup branch, or branch from the timestamp instead of restoring in place.
</Admonition>

## What this replaces

Without instant restore, your options are a periodic `pg_dump` (you lose anything written after the dump), continuous WAL archiving with a manual point-in-time recovery, or a managed provider's PITR feature, which often restores to a separate target. On Neon it's one CLI command or API call against the existing root branch.

## How other Postgres providers restore

| Provider                | Restore window                                                   | Restores to                    | Cost                                                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neon                    | 6 hours (Free plan) to 30 days (Scale plan)                      | Same root branch or new branch | $0.20/GB-month on paid plans                                                                                                                                   |
| Amazon RDS for Postgres | 0 to 35 days                                                     | New DB instance                | Backup storage billed per GB-month                                                                                                                             |
| Aurora PostgreSQL       | 1 to 35 days                                                     | New DB cluster                 | [No charge for backup storage up to 100% of cluster size](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Backups.Retaining.html) |
| Supabase                | Daily backups (7 days on Pro), or PITR add-on with up to 28 days | Same project (in place)        | Daily backups included on Pro; PITR add-on from ~$100/month                                                                                                    |

- **RDS and Aurora.** RDS [point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) creates a new DB instance within a [retention period of 0 to 35 days](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html). Aurora [point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-pitr.html) creates a new DB cluster within a [retention period of 1 to 35 days](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Backups.html). In both cases you point your app at the new endpoint.

- **Supabase.** [Daily backups](https://supabase.com/docs/guides/platform/backups) are kept 7 days on Pro, 14 on Team, and up to 30 on Enterprise; the Free plan has none. [Point-in-Time Recovery](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery) is a paid add-on with [retention of 7, 14, or 28 days](https://supabase.com/docs/guides/platform/manage-your-usage/point-in-time-recovery) and needs at least a Small compute. Restores happen in place, and the project is inaccessible until the restore finishes, which takes longer on larger databases.

<CTA title="Try instant restore" description="Set up a Neon project and restore to any point in seconds." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
