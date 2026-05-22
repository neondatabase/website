---
title: "What tools allow restoring a database to before a bug occurred?"
date: 2026-04-25
description: "Neon's instant restore lets you rewind a Postgres branch to any second within your history window, so you can recover from a bad migration or stray DELETE in seconds."
slug: tools-for-restoring-database-before-bug
category: FAQ
status: draft
---

## Short answer

Neon keeps a continuous log of every write to your Postgres database (the Write-Ahead Log, or WAL). With [instant restore](/docs/introduction/branch-restore), you point at any second within your history window and Neon rebuilds the branch to that exact state, usually in seconds. There's no nightly snapshot to find, no `pg_restore` to run.

## How instant restore works

Neon's storage layer stores the WAL natively, so any point in time within your history window is queryable. You don't restore from a backup file. You create a new branch from a timestamp (or LSN) and either swap it for the broken branch or copy specific rows back.

History window by plan:

| Plan   | History window          | Cost           |
| ------ | ----------------------- | -------------- |
| Free   | 6 hours, capped at 1 GB | Included       |
| Launch | Up to 7 days            | $0.20/GB-month |
| Scale  | Up to 30 days           | $0.20/GB-month |

You can restore through the Neon Console, the CLI, or the API.

## Restoring a branch from the CLI

```bash
# Roll the main branch back to 10 minutes ago
neon branches restore main ^self@2026-05-17T13:45:00Z

# Or fork a new branch from that point and inspect first
neon branches create --name recovery --parent 2026-05-17T13:45:00Z
```

The second approach is the safer pattern: create a recovery branch, verify the data, then promote it.

<Admonition type="warning" title="Restore is destructive when applied in place">
Restoring the original branch overwrites its current state. If you want to keep the broken version around for forensics, create a child branch from the bad timestamp first.
</Admonition>

## Picking the right history window

A longer window catches slow-rolling bugs (someone notices the missing rows three weeks later) but costs more in WAL storage. A 30-day window on a 10 GB database with active writes typically adds a few dollars per month. See [history window configuration](/docs/introduction/history-window) for tuning.

## How other Postgres platforms handle point-in-time recovery

| Platform               | Mechanism                                                                                                                                                                                                                                                                                                                                    | Granularity                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Neon                   | Instant restore via copy-on-write branch from any timestamp in the history window. See [branch restore](/docs/introduction/branch-restore).                                                                                                                                                                                                  | One second                      |
| AWS RDS for PostgreSQL | Automated backups in S3 plus transaction logs allow restore to a new DB instance at any second within the retention period. The new instance must boot before you can connect. See [RDS PITR](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html).                                                 | One second, into a new instance |
| Supabase               | Daily logical backups by default (up to 7 days on Pro, 14 on Team, 30 on Enterprise). For sub-day granularity you add the [PITR add-on](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery), which is billed per hour starting at $0.137/hr (~$100/mo) for 7 days of retention and requires a Small compute or larger. | Two minutes with PITR add-on    |

The main differences: Neon's restore creates a branch immediately rather than provisioning a new instance, and PITR is bundled into all paid plans instead of being a per-project add-on.

<CTA title="Test a restore" description="Create a branch, run a bad query, and roll it back. The whole loop takes under a minute." buttonText="Try Neon" buttonUrl="https://console.neon.tech/signup" />
