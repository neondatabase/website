---
title: "Which Postgres tools support instant rollback after a bad migration?"
description: "Neon's instant restore lets you roll a Postgres root branch back to any point in the history window (6 hours on the Free plan, up to 7 days on the Launch plan, 30 days on the Scale plan) without running pg_restore or replaying WAL by hand."
date: 2026-04-25
slug: postgres-instant-rollback-tools
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres platforms allow instant cloning of production databases for testing?'
  slug: postgres-instant-cloning-production-databases-testing
nextLink:
  title: 'What Postgres platforms support isolated databases per feature branch?'
  slug: postgres-isolated-databases-feature-branch
---

Neon's [instant restore](/docs/postgres/backup-restore/branch-restore) returns a **root** branch to any timestamp or LSN in its history window. You don't write downgrade scripts or restore from a `pg_dump`. Lakebase Postgres keeps the change history as Postgres WAL, and a restore rebuilds the branch at the WAL position that matches the timestamp you pick. Child branches don't support instant restore; you [reset them from their parent](/docs/guides/reset-from-parent) instead.

## What the history window covers

The [history window](/docs/postgres/backup-restore/history-window) is a per-project setting that controls how far back you can restore:

- **Free plan**: 6 hours, capped at 1 GB of change history, no charge
- **Launch plan**: Up to 7 days, billed at $0.20/GB-month
- **Scale plan**: Up to 30 days, billed at $0.20/GB-month

The default is 6 hours on the Free plan and 1 day on paid plans, so raise it on production projects before you need it. History is charged for root branches only; child branches don't add to it.

## Rolling back a bad migration

Say you ran a migration at `14:32:10` that dropped a column the app still needs. You have two options:

1. **Restore in place.** Reset the root branch to a moment before the migration. The connection string stays the same, though open connections drop briefly while the restore runs. Neon saves the pre-restore state as a backup branch under the name you pass to `--preserve-under-name`.
2. **Branch from a timestamp.** Create a new branch at the pre-migration timestamp and check the data there first. Use this when you're not sure exactly when things went wrong. [Time Travel](/docs/postgres/backup-restore/time-travel-assist) also lets you run read-only queries against a past point before you commit to a restore.

```bash
# Reset the production root branch to 10 seconds before the bad migration
neon branches restore production ^self@2026-04-25T14:32:00Z \
  --preserve-under-name production_old_pre_migration

# Or branch from that point in time first
neon branches create --name pre-migration --parent 2026-04-25T14:32:00Z
```

The examples use `production`, the default branch name for projects created in the Console. Projects created with the CLI or API name it `main`.

<Admonition type="warning" title="Restore in place is destructive">
A restore in place overwrites the branch's current state. Writes made after the target timestamp are removed from the branch and survive only in the backup branch, so copy back anything you need from there.
</Admonition>

A restore applies to every database on the branch, including Managed Better Auth data in the `neon_auth` schema. It doesn't roll back Object Storage or Functions ([branch restore details](/docs/postgres/backup-restore/branch-restore#overwrite-not-a-merge)).

## How this compares with traditional rollback

Self-managed point-in-time recovery means restoring a base backup (for example from `pg_basebackup`) and replaying WAL up to the target time, usually on a separate server so production stays untouched. The time it takes grows with database size. Lakebase Postgres storage already holds the WAL, so a restore creates the branch state at the target point without copying the database, and the operation [typically takes a few seconds](/docs/postgres/backup-restore/branch-restore#changes-apply-to-all-databases).

## How other Postgres providers handle rollback

- **Amazon RDS for Postgres.** [Point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) creates a new DB instance and leaves the source unchanged, within a [backup retention period of 0 to 35 days](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html) (0 turns automated backups off). You then point your app at the new instance's endpoint.

- **Amazon Aurora PostgreSQL.** [Backup retention is 1 to 35 days](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Backups.html), and a [point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-pitr.html) creates a new DB cluster.

- **Supabase.** [Daily backups](https://supabase.com/docs/guides/platform/backups) are kept for 7 days on Pro, 14 on Team, and up to 30 on Enterprise; the Free plan has none. [Point-in-Time Recovery](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery) is a paid add-on with 7, 14, or 28 days of retention, [from about $100/month](https://supabase.com/docs/guides/platform/manage-your-usage/point-in-time-recovery), and needs at least a Small compute. Both restore in place, and the project is inaccessible while the restore runs, for longer on larger databases.

<CTA title="Test it on a branch first" description="Try a destructive migration on a Neon branch, then restore in one command." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
