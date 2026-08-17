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

## Short answer

Neon's [instant restore](/docs/introduction/branch-restore) returns a **root** branch to any timestamp in the history window. You don't run downgrade scripts or restore from a `pg_dump`. The change history is kept as Postgres WAL, so a restore reapplies the state up to the timestamp you pick. Child branches don't support instant restore.

## What the history window covers

Lakebase Postgres keeps a continuous log of database changes for the [history window](/docs/introduction/history-window) configured on your project:

- **Free plan**: 6 hours, capped at 1 GB of change history
- **Launch plan**: Up to 7 days, billed at $0.20/GB-month
- **Scale plan**: Up to 30 days, billed at $0.20/GB-month

Defaults are 6 hours on the Free plan and 1 day on paid plans. You only pay for history on root branches; child branches don't add to the bill.

## Rolling back a bad migration

Say you ran a migration at `14:32:10` that dropped a column the app still needs. Two options:

1. **Restore in place.** Reset the root branch to a moment before the migration. Existing connection strings keep working. Lakebase Postgres keeps a backup branch of the pre-restore state.
2. **Branch from a timestamp.** Create a new branch from the timestamp, verify the state, then promote it. Useful when you're not sure exactly when things went wrong.

```bash
# Reset the main root branch to 30 seconds before the bad migration
neon branches restore main ^self@2026-04-25T14:32:00Z \
  --preserve-under-name main_old_pre_migration

# Or branch from that point in time first
neon branches create --name pre-migration --parent 2026-04-25T14:32:00Z
```

<Admonition type="warning" title="Restore in place is destructive">
A restore-in-place overwrites the branch's current state. Any writes made after the target timestamp are dropped. Branch to a new copy first if you might need the post-incident data for forensics.
</Admonition>

## Why this beats traditional rollback

A standard Postgres rollback from `pg_basebackup` plus WAL replay can take hours on a multi-hundred-GB database, and you usually run it on a separate machine because you don't want to touch production. Lakebase Postgres storage already holds the WAL, so the restore is a metadata operation against a versioned storage layer, not a data copy. From your app's perspective the connection string stays the same.

## How other Postgres providers handle rollback

- **Amazon RDS for PostgreSQL.** [Point-in-time recovery via continuous backups](https://docs.aws.amazon.com/aws-backup/latest/devguide/point-in-time-recovery.html) is supported with a retention window of [0 to 35 days](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html). PITR creates a new database instance from automated backups; you then swap your application's connection string to the new instance. The original is left alone.

- **Aurora PostgreSQL.** Same PITR model, also up to 35 days. Restores produce a new cluster.

- **Supabase.** Daily backups are restored against the project, with downtime proportional to database size. [Point-in-Time Recovery](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery) is a paid add-on with retention of 7, 14, or 28 days (from about $100/month). PITR restores happen in place.

A Lakebase Postgres restore keeps the connection string stable on the same root branch. If you'd rather inspect history without overwriting the branch, create a new branch from the timestamp instead.

<CTA title="Test it on a branch first" description="Try a destructive migration on a Neon branch, then restore in one command." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
