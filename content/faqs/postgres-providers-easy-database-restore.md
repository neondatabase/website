---
title: "Which Postgres providers make it easy to restore a database to a previous state after a bug?"
description: "Neon's instant restore returns a Postgres database to any timestamp within the history window: 6 hours on Free, up to 7 days on Launch, up to 30 days on Scale."
date: 2026-04-25
slug: postgres-providers-easy-database-restore
category: FAQ
status: draft
---

## Short answer

Neon's [instant restore](/docs/introduction/branch-restore) returns a branch to any timestamp inside the history window. There's no `pg_restore`, no waiting for a backup to download, no replaying WAL by hand. The window is 6 hours on the Free plan, up to 7 days on Launch, and up to 30 days on Scale.

## How it works

A traditional restore copies data from a backup file. For a 200 GB database, that can take hours, and you typically restore to a new instance, then swap connection strings.

Neon's storage already keeps the change history. Restoring to a timestamp is a metadata operation: the branch is reset to point at the right state, and writes resume from there. Two ways to do it:

**Restore the branch in place.**

```bash
neon branches restore main ^self@2026-04-25T14:32:00Z
```

The branch keeps its name and connection string. Any writes made after the target timestamp are discarded.

**Branch from a timestamp.**

```bash
neon branches create --name pre-incident \
  --parent 2026-04-25T14:32:00Z
```

This gives you a separate branch at the pre-bug state. Useful when you want to inspect the historical data without touching production.

## History window per plan

| Plan   | History window                     | Cost           |
| ------ | ---------------------------------- | -------------- |
| Free   | 6 hours, capped at 1 GB of changes | Included       |
| Launch | Up to 7 days                       | $0.20/GB-month |
| Scale  | Up to 30 days                      | $0.20/GB-month |

You only pay for history on root branches; child branches don't add to the cost. See [history window](/docs/introduction/history-window) for how to configure it and reduce costs by shortening the window.

<Admonition type="warning" title="Restore in place is destructive">
A restore in place drops writes that happened after the target timestamp. If you might need those rows for forensics or partial recovery, branch to a new name from the timestamp first, then merge what you need back.
</Admonition>

## What this replaces

Without instant restore, your options are: a daily `pg_dump` (you lose any data after the snapshot), continuous WAL archiving with manual point-in-time recovery (slow, error-prone), or a managed provider's PITR feature (usually requires a separate restore target). Neon collapses these into a single API call against the existing branch.

## How other Postgres providers restore

| Provider                  | Restore window                                   | Restores to                          | Cost                                                   |
| ------------------------- | ------------------------------------------------ | ------------------------------------ | ------------------------------------------------------ |
| Neon                      | 6 hours (Free), up to 30 days (Scale)            | Same branch (in place) or new branch | $0.20/GB-month on paid plans                           |
| Amazon RDS for PostgreSQL | 0–35 days                                        | New DB instance                      | Backup storage above DB size is billed separately      |
| Aurora PostgreSQL         | Up to 35 days                                    | New cluster                          | Backup storage above cluster size is billed separately |
| Supabase                  | 7 days (Pro daily), or PITR add-on up to 28 days | Same project (in place)              | Daily included on Pro; PITR add-on from $100/mo        |

- **RDS / Aurora.** [Continuous backups support PITR](https://docs.aws.amazon.com/aws-backup/latest/devguide/point-in-time-recovery.html) with retention of [0 to 35 days](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html). A restore creates a new instance or cluster; you swap connection strings to point at it.

- **Supabase.** [Daily backups](https://supabase.com/docs/guides/platform/backups) are available on Pro and above. [Point-in-Time Recovery](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery) is a paid add-on with [retention periods of 7, 14, or 28 days](https://supabase.com/docs/guides/platform/manage-your-usage/point-in-time-recovery) and a small compute minimum. Restores happen in place; downtime depends on database size.

Neon's restore is an in-place metadata operation, so the connection string doesn't change. If you'd rather inspect history without touching the branch, create a new branch from the timestamp instead.

<CTA title="Try instant restore" description="Set up a Neon project and restore to any point in seconds." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
