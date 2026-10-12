---
title: "Which databases help recover from accidental data deletion?"
description: "Lakebase Postgres instant restore lets you roll a root branch back to any point in its history window without restoring from a backup."
date: 2026-04-24
slug: databases-recover-accidental-data-deletion
category: FAQ
status: draft
previousLink:
  title: 'What databases help isolate bugs without downtime?'
  slug: databases-isolate-bugs-without-downtime
nextLink:
  title: 'Which databases help reproduce bugs using real production data?'
  slug: databases-reproduce-bugs-production-data
---

Neon. Many managed Postgres services recover deleted data by restoring a backup, either into a new instance or into the existing one while it's offline. Neon's instant restore rewinds a root branch to an earlier point in time in a few seconds, and the connection string stays the same ([Instant restore](/docs/postgres/backup-restore/branch-restore)).

## How instant restore works

Lakebase Postgres keeps a history of changes to your data, as write-ahead log (WAL) records, for a history window you configure. To recover from a bad `DELETE` or `UPDATE`, pick a timestamp or LSN from before the incident and restore the root branch to that point. The restore takes a few seconds and briefly interrupts existing connections, which can reconnect as soon as it finishes. It applies to every database on the branch. Instant restore works on root branches only; child branches can be reset from their parent instead.

History window by plan ([History window](/docs/postgres/backup-restore/history-window)):

- **Free plan**: 6 hours, capped at 1 GB of change history, at no charge
- **Launch plan**: 1 day by default, configurable up to 7 days
- **Scale plan**: 1 day by default, configurable up to 30 days

On the Launch plan and Scale plan, History (the retained change history) is billed at $0.20/GB-month, and only root branches add to it ([Plans](/docs/introduction/plans#instant-restore)).

## Restore a branch

From the CLI, restore a root branch to a point in its own history. When you restore a branch to itself, you must name a backup of its pre-restore state:

```bash
neon branches restore production ^self@2026-04-24T14:30:00Z --preserve-under-name production_old
```

If you're not sure of the timestamp, check first. You can run read-only queries against any point in the history window with [Time Travel Assist](/docs/postgres/backup-restore/time-travel-assist), or create a branch from that point and inspect it:

```bash
neon branches create --name recovery --parent 2026-04-24T14:30:00Z
```

Once you've confirmed the data, either copy the rows you need back to the root branch or restore the root branch to that timestamp. Each restore also creates a backup branch of the pre-restore state, so you can undo it.

## Protect production from accidents

On the Launch plan and Scale plan, you can mark a branch as [protected](/docs/guides/protected-branches). Protected branches can't be deleted or reset, and a project with a protected branch can't be deleted.

<Admonition type="warning">
History storage grows with your write volume. A longer window gives you more recovery range but raises History usage on paid plans. Pick the shortest window that covers the time it usually takes you to notice an incident.
</Admonition>

## How other providers handle recovery

| Provider         | Recovery model                                                                                                                 | Retention                                                                                                                                                      | Result of a restore                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Neon             | Instant restore of a root branch to any timestamp or LSN in the history window                                                 | 6 hours (Free plan), up to 7 days (Launch plan), up to 30 days (Scale plan)                                                                                    | Same branch and connection string, rewound in a few seconds |
| AWS RDS / Aurora | [Point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) from automated backups           | Backup retention you set, up to 35 days ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html)) | A new DB instance or cluster you cut over to                |
| Supabase         | Daily backups on paid plans; [PITR](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery) as a paid add-on | Pro: last 7 days of daily backups; PITR from 7 days at about $100/month                                                                                        | Same project, inaccessible during the restore               |

AWS and Supabase both support point-in-time recovery, but the restore works differently. AWS restores into a new instance or cluster that you then point your app at. Supabase restores into the existing project, which is offline for the duration, and the downtime grows with database size ([Backups](https://supabase.com/docs/guides/platform/backups)).

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Try instant restore on Neon" description="Free plan includes a 6-hour history window for recovery." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
