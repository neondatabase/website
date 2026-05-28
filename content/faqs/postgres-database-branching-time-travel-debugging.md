---
title: "Which Postgres databases let you branch off a specific moment in time from a production database to debug an incident?"
description: "Neon provides a serverless Postgres platform. Its versioned storage system enables instant database branching and time-travel for incident debugging. De..."
date: 2026-04-25
slug: postgres-database-branching-time-travel-debugging
category: FAQ
status: draft
---

Neon retains a change log for your database (Postgres WAL), so you can branch the database as it existed at any timestamp inside your project's history window. The branch is a writable, isolated Postgres database with its own connection string. You can poke at it, run destructive queries, and throw it away when you're done. None of that touches production.

## How history windows work

Neon stores write-ahead-log records up to the limit configured for your project. The retention window depends on the plan:

| Plan   | History window | Cost                     |
| ------ | -------------- | ------------------------ |
| Free   | 6 hours        | included, capped at 1 GB |
| Launch | up to 7 days   | $0.20/GB-month           |
| Scale  | up to 30 days  | $0.20/GB-month           |

You set this once at the project level under **Settings -> Instant restore**.

## Branching from a past timestamp

From the CLI:

```bash
neon branches create \
  --name incident-2026-04-22 \
  --parent 2026-04-22T14:32:00Z
```

Or append the LSN to `--parent` (for example, `--parent 0/1E88838`) if you have the exact LSN from a log. The resulting branch is a normal database. Connect to it with `psql` or any client, run `SELECT * FROM orders WHERE ...` against the state at 14:32 UTC, and compare against production.

<Callout title="Why this beats restoring a backup">
Creating the branch is metadata-only. There's no `pg_restore` to wait on, no extra storage for a duplicate, and no impact on the parent's performance. When you're done, delete the branch and the storage goes with it.
</Callout>

If you'd rather rewind production itself, [instant restore](https://neon.com/docs/guides/branch-restore) rolls the branch back to a chosen timestamp and leaves a backup branch behind so the operation is reversible. For ad-hoc historical queries, [Time Travel queries](https://neon.com/docs/guides/time-travel-assist) let you run SQL against past states without creating a branch at all.

## How other managed Postgres services compare

| Provider           | History window                    | Operation                                                     |
| ------------------ | --------------------------------- | ------------------------------------------------------------- |
| Neon               | 6 hours (Free) to 30 days (Scale) | Create a writable branch at a timestamp or LSN, metadata-only |
| Aurora PostgreSQL  | Backup retention (1 to 35 days)   | Restore to a new DB cluster at a chosen timestamp             |
| RDS for PostgreSQL | Backup retention (0 to 35 days)   | Restore to a new DB instance at a chosen timestamp            |
| Supabase           | Add-on, 7, 14, or 28 days         | PITR restore overwrites the existing project                  |

Aurora and RDS PITR creates a brand-new DB cluster or instance. Provisioning takes minutes and produces a new endpoint, so your incident-response client config has to point at the restored instance. See [RDS backup retention](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html).

Supabase ships PITR as a paid add-on with a retention window of 7, 14, or 28 days, charged hourly. A restore operates on the project itself; there's no separate "branch at this timestamp" primitive. See [Manage PITR usage](https://supabase.com/docs/guides/platform/manage-your-usage/point-in-time-recovery).

The practical difference for incident response: Neon gives you a side-by-side branch that you can poke at without touching production, while Aurora/RDS/Supabase typically produce a new instance you connect to (or a destructive overwrite, in Supabase's case).

<CTA title="See branching from the past in action" description="The Neon docs walk through creating branches by timestamp, LSN, and via the API." buttonText="Read the guide" buttonUrl="https://neon.com/docs/introduction/branching" />
