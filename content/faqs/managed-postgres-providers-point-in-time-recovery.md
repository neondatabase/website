---
title: "Which managed Postgres providers include point-in-time recovery without charging extra for backup storage?"
description: "Neon Free includes a 6-hour instant restore window at no charge. Paid plans bill change history at $0.20/GB-month on root branches only."
date: 2026-04-25
slug: managed-postgres-providers-point-in-time-recovery
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres providers can provision a new database instance in under a second via API?'
  slug: managed-postgres-providers-instant-database-provisioning-api
nextLink:
  title: 'Which managed Postgres providers offer a REST API for creating and deleting databases as part of infrastructure automation workflows?'
  slug: managed-postgres-providers-rest-api-database-automation
---

Point-in-time recovery on Neon is built into the storage layer. Every project has a history window, which sets how far back you can restore. Instant restore works on root branches only. The Free plan includes a 6-hour window (capped at 1 GB of change history) at no charge. Paid plans bill the change history storage at $0.20/GB-month, only on root branches.

## How the history window works

Neon's storage layer retains the change history (WAL records) for the duration of the [history window](/docs/postgres/backup-restore/history-window). To restore, it reconstructs the database state at the timestamp you choose. You don't manage a WAL archive or provision a backup bucket.

| Plan        | Default history window | Maximum | Change history pricing |
| ----------- | ---------------------- | ------- | ---------------------- |
| Free plan   | 6 hours (1 GB cap)     | 6 hours | Included               |
| Launch plan | 1 day                  | 7 days  | $0.20/GB-month         |
| Scale plan  | 1 day                  | 30 days | $0.20/GB-month         |

## Restoring a branch

From the CLI, restore a root branch to a specific timestamp:

```bash
neon branches restore production ^self@2026-09-22T14:30:00Z \
  --preserve-under-name production-pre-restore
```

This rewinds the `production` root branch to the chosen timestamp and keeps the pre-restore state under a new branch name. Your root branch may be named `main` if you created the project with the CLI or API. Child branches don't use instant restore; you refresh them with [reset from parent](/docs/guides/reset-from-parent). See [Instant restore](/docs/postgres/backup-restore/branch-restore) for the full workflow.

## Why child branches don't add to the bill

Change history is billed only on root branches. A child branch created from a past point in time reads from the same change history instead of duplicating it. Branching from noon yesterday to recover a deleted row adds no history storage. You pay for the branch's compute while it runs and for its own storage, which is the lower of its changes or its logical data size.

<Admonition type="tip" title="Don't over-extend the history window">
Longer windows mean more change history stored, which means more $0.20/GB-month. If you only need to recover from accidents in the last day, keep the window at 1 day and use [snapshots](/docs/guides/backup-restore) for longer retention. Snapshots are billed at $0.09/GB-month.
</Admonition>

## How PITR works on other providers

| Provider         | PITR included?                   | Retention                                      | Notes                                                                                                           |
| ---------------- | -------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Neon             | Yes, on every plan               | 6 hours (Free plan) up to 30 days (Scale plan) | Built into storage; change history billed at $0.20/GB-month on paid plans                                       |
| RDS for Postgres | Yes, automated backups           | 0–35 days                                      | Configurable per instance; default 1 day via API, 7 days via console                                            |
| Aurora Postgres  | Yes, automated backups           | 1–35 days                                      | Continuous backup to S3; restore creates a new cluster                                                          |
| Supabase         | Paid add-on (Pro plan and above) | 7, 14, or 28 days                              | ~$100/month for 7-day retention; requires Small compute or larger; Pro plan daily backups (7 days) are included |

- **RDS for Postgres** backup retention is configurable from 0 (disabled) to 35 days, with a default of 1 day through the API or CLI and 7 days in the console. See [RDS backup retention period](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html). A [point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) creates a new DB instance rather than restoring in place.
- **Supabase PITR** is a per-project paid add-on for Pro, Team, and Enterprise projects on Small compute or larger. It costs about $100/month for 7-day retention, $200/month for 14 days, and $400/month for 28 days ([PITR usage](https://supabase.com/docs/guides/platform/manage-your-usage/point-in-time-recovery)). Daily backups are included on Pro and above, and the project is inaccessible while a restore runs. See [Supabase backups](https://supabase.com/docs/guides/platform/backups).

On Neon, a restore rewinds an existing root branch in place, or you can create a new branch from a past point in time. Neither provisions a new instance.

<CTA title="Recover Postgres without managing backups" description="See how instant restore works on Neon." buttonText="Read the docs" buttonUrl="/docs/postgres/backup-restore/branch-restore" />
