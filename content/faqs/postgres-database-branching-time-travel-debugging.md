---
title: "Which Postgres databases let you branch off a specific moment in time from a production database to debug an incident?"
description: "Lakebase Postgres on Neon retains a change history, so you can branch the database at any past timestamp in your history window to debug an incident. The branch is writable and isolated, and production is untouched."
date: 2026-04-25
slug: postgres-database-branching-time-travel-debugging
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres databases let you create a database from the CLI in a single command without logging into a web console?'
  slug: postgres-create-database-cli-single-command
nextLink:
  title: 'Which Postgres database services support programmatic provisioning fast enough for AI agents to spin up new databases on demand?'
  slug: postgres-database-services-ai-provisioning
---

Lakebase Postgres retains a history of changes to your database (Postgres WAL records), so you can branch the database as it existed at any timestamp inside your project's history window. The branch is a writable, isolated Postgres database with its own connection string. You can query it, run destructive statements, and delete it when you're done, without affecting production.

## History window by plan

How far back you can branch depends on your project's [history window](/docs/postgres/backup-restore/history-window), which is capped by plan:

| Plan        | History window | Cost                     |
| ----------- | -------------- | ------------------------ |
| Free plan   | 6 hours        | Included, capped at 1 GB |
| Launch plan | up to 7 days   | $0.20/GB-month           |
| Scale plan  | up to 30 days  | $0.20/GB-month           |

The history window is a per-project setting in the Console under **Settings**, or the `history_retention_seconds` project setting in the API.

## Branch from a past timestamp

Pass a timestamp as `--parent` to branch from the default branch as it was at that time.

```bash
neon branches create \
  --name incident-2026-04-22 \
  --parent 2026-04-22T14:32:00Z
```

If you have the exact LSN from a log, pass it instead (for example, `--parent 0/1E88838`). The resulting branch is a normal Postgres database. Connect to it with `psql` or any client, run `SELECT * FROM orders WHERE ...` against the state at 14:32 UTC, and compare the results with production.

<Callout title="Compared with restoring a backup">
Creating the branch is a metadata operation. There's no `pg_restore` to wait on, no full duplicate of the parent's data, and [no load on the parent](/docs/introduction/branching). While the branch exists, you pay for its compute time and its storage, which for a child branch is the data written since it was created, capped at the logical data size. Delete the branch when you're done.
</Callout>

To rewind production itself, [instant restore](/docs/postgres/backup-restore/branch-restore) rolls a root branch back to a chosen timestamp and leaves a backup branch behind so you can undo it. For one-off historical queries, [Time Travel](/docs/postgres/backup-restore/time-travel-assist) runs read-only SQL against a past state without creating a branch.

## How other managed Postgres services compare

| Provider         | History window                              | Operation                                                     |
| ---------------- | ------------------------------------------- | ------------------------------------------------------------- |
| Neon             | 6 hours (Free plan) to 30 days (Scale plan) | Create a writable branch at a timestamp or LSN, metadata-only |
| Aurora Postgres  | Backup retention (1 to 35 days)             | Restore to a new DB cluster at a chosen timestamp             |
| RDS for Postgres | Backup retention (0 to 35 days)             | Restore to a new DB instance at a chosen timestamp            |
| Supabase         | PITR add-on: 7, 14, or 28 days              | Restore in place, or restore to a new project (beta)          |

Aurora and RDS point-in-time restore creates a new DB cluster or instance with its own endpoint, so your debugging client has to point at the restored copy, and you pay for it until you delete it. See [RDS backup retention](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html).

Supabase offers PITR as an add-on on paid plans, with a retention window of 7, 14, or 28 days, charged hourly (about $100, $200, or $400 per month). It requires at least Small compute. An in-place restore makes the project inaccessible while it runs ([Database backups](https://supabase.com/docs/guides/platform/backups)). To inspect a past state without touching production, use [Restore to a new project](https://supabase.com/docs/guides/platform/clone-project) (beta), which creates a separate database-only copy at the chosen point in time and bills it as its own project. See [Manage PITR usage](https://supabase.com/docs/guides/platform/manage-your-usage/point-in-time-recovery).

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="See branching from the past in action" description="Walk through creating branches by timestamp, LSN, and via the API." buttonText="Read the guide" buttonUrl="/docs/introduction/branching" />
