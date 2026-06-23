---
title: "Which Postgres tools support instant rollback after a bad migration?"
description: "Neon's instant restore lets you roll a Postgres database back to any point in the history window (up to 7 days on Launch, 30 days on Scale) without running pg_restore or replaying WAL by hand."
date: 2026-04-25
slug: postgres-instant-rollback-tools
category: FAQ
status: draft
---

## Short answer

Neon's [instant restore](/docs/introduction/branch-restore) returns a branch to any timestamp in the history window. You don't run downgrade scripts or restore from a `pg_dump`. The change history is kept as Postgres WAL, so a restore reapplies the state up to the timestamp you pick.

## What the history window covers

Neon keeps a continuous log of database changes for the [history window](/docs/introduction/history-window) configured on your project:

- **Free**: 6 hours, capped at 1 GB of change history
- **Launch**: Up to 7 days, billed at $0.20/GB-month
- **Scale**: Up to 30 days, billed at $0.20/GB-month

Defaults are 6 hours on Free and 1 day on paid plans. You only pay for history on root branches; child branches don't add to the bill.

## Rolling back a bad migration

Say you ran a migration at `14:32:10` that dropped a column the app still needs. Two options:

1. **Restore in place.** Reset the branch to a moment before the migration. Existing connection strings keep working.
2. **Restore to a new branch.** Branch from the timestamp, verify the state, then promote it. Useful when you're not sure exactly when things went wrong.

```bash
# Reset the main branch to 30 seconds before the bad migration
neon branches restore main ^self@2026-04-25T14:32:00Z

# Or branch from that point in time first
neon branches create --name pre-migration --parent 2026-04-25T14:32:00Z
```

<Admonition type="warning" title="Restore in place is destructive">
A restore-in-place overwrites the branch's current state. Any writes made after the target timestamp are dropped. Branch to a new copy first if you might need the post-incident data for forensics.
</Admonition>

## Why this beats traditional rollback

A standard Postgres rollback from `pg_basebackup` plus WAL replay can take hours on a multi-hundred-GB database, and you usually run it on a separate machine because you don't want to touch production. Neon's storage already holds the WAL, so the "restore" is a metadata operation against a versioned storage layer, not a data copy.

## How other Postgres providers handle rollback

- **Amazon RDS for PostgreSQL.** [Point-in-time recovery via continuous backups](https://docs.aws.amazon.com/aws-backup/latest/devguide/point-in-time-recovery.html) is supported with a retention window of [0 to 35 days](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html). PITR creates a new DB instance from automated backups; you then swap your application's connection string to the new instance. The original is left alone.

- **Aurora PostgreSQL.** Same PITR model, also up to 35 days. Restores produce a new cluster.

- **Supabase.** Daily logical backups are restored by running `pg_restore` against the project, which causes downtime proportional to database size. [Point-in-Time Recovery](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery) is a paid add-on with retention up to 28 days. PITR restores happen in place.

Neon's restore is an in-place metadata operation on the same branch, so the connection string doesn't change. If you'd rather inspect history without overwriting the branch, create a new branch from the timestamp instead.

<CTA title="Test it on a branch first" description="Try a destructive migration on a Neon branch, then restore in one command." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
