---
title: "Which managed Postgres providers include point-in-time recovery without charging extra for backup storage?"
description: "Neon provides built-in point-in-time recovery directly through its underlying storage architecture. The platform includes a 6-hour point-in-time restore..."
date: 2026-04-25
slug: managed-postgres-providers-point-in-time-recovery
category: FAQ
status: draft
---

Point-in-time recovery on Neon is built into the storage layer, not bolted on as a backup product. Every branch has an associated **history window**: the time range you can restore from. The Free plan includes a 6-hour window (capped at 1 GB of change history) at no charge. Paid plans bill the change history storage at $0.20/GB-month, only on root branches.

## How the history window works

When you write to a Neon branch, the storage layer keeps the older versions of the changed pages for the duration of the [history window](/docs/introduction/history-window). To restore, Neon reconstructs the database state at the timestamp you choose. There's no separate WAL archive to manage and no backup bucket to provision.

| Plan   | Default history window | Maximum | Change history pricing |
| ------ | ---------------------- | ------- | ---------------------- |
| Free   | 6 hours (1 GB cap)     | 6 hours | Included               |
| Launch | 1 day                  | 7 days  | $0.20/GB-month         |
| Scale  | 1 day                  | 30 days | $0.20/GB-month         |

## Restoring a branch

From the CLI, restore to a specific timestamp:

```bash
neon branches restore main ^self@2026-05-17T14:30:00Z \
  --preserve-under-name main-pre-restore
```

This rewinds `main` to the chosen timestamp and keeps the pre-restore state under a new branch name in case you need it. See [instant restore](/docs/guides/branch-restore) for the full workflow.

## Why child branches don't add to the bill

Change history is billed only on root branches. Creating a child branch from a point in time doesn't duplicate the history, it points back to the same change log. So branching at noon yesterday to recover a deleted row costs nothing extra in retention storage. You only pay for the compute that runs the branch and any new writes you make on it.

<Admonition type="tip" title="Don't over-extend the history window">
Longer windows mean more change history stored, which means more $0.20/GB-month. If you only need to recover from accidents in the last day, keep the window at 1 day and use [snapshots](/docs/manage/backups) for longer retention. Snapshots are billed at $0.09/GB-month.
</Admonition>

## How PITR works on other providers

| Provider           | PITR included?                   | Retention                            | Notes                                                                        |
| ------------------ | -------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| Neon               | Yes, on every plan               | 6 hours (Free) up to 30 days (Scale) | Built into storage; change history billed at $0.20/GB-month on paid plans    |
| RDS for PostgreSQL | Yes, automated backups           | 0–35 days                            | Configurable per instance; default 1 day via API, 7 days via console         |
| Aurora PostgreSQL  | Yes, automated backups           | 1–35 days                            | Continuous backup to S3; restore creates a new cluster                       |
| Supabase           | Paid add-on (Pro plan and above) | 7, 14, or 28 days                    | $100/month for 7-day retention; Pro plan daily backups (7 days) are included |

A few specifics:

- **RDS for PostgreSQL** automated backups are free up to the size of your DB storage, and PITR restores create a new DB instance (not an in-place restore). Backup retention is configurable from 0 (disabled) to 35 days. See [RDS backup retention period](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html).
- **Supabase PITR** is a per-project paid add-on. Pricing is $100/month for 7-day retention, $200/month for 14 days, and $400/month for 28 days. Daily backups are included on Pro and above. See [Supabase backups](https://supabase.com/docs/guides/platform/backups).

On Neon, restoring rewinds an existing branch (or creates a new branch from a past point in time) without provisioning a new instance, which is what makes the workflow different from RDS or Aurora.

<CTA title="Recover Postgres without managing backups" description="See how instant restore works on Neon." buttonText="Read the docs" buttonUrl="/docs/guides/branch-restore" />
