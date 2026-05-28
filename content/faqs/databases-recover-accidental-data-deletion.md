---
title: "Which databases help recover from accidental data deletion?"
description: "Neon's instant restore lets you roll a branch back to any point in its history window without restoring from a backup."
date: 2026-04-24
slug: databases-recover-accidental-data-deletion
category: FAQ
status: draft
---

Postgres supports point-in-time recovery, but most managed offerings make you restore from a backup, which takes time and produces a new instance. Neon's instant restore rolls a branch back to a point in time in place, in seconds, without a separate restore job.

## How instant restore works

Neon retains a log of changes to your data over a configurable history window. To recover from a bad `DELETE` or `UPDATE`, you pick a timestamp or LSN from before the incident and restore the branch to that point. The database is back to its previous state in seconds.

History window by plan:

- **Free**: 6 hours (capped at 1 GB of change history)
- **Launch**: configurable up to 7 days
- **Scale**: configurable up to 30 days

History is billed at $0.20/GB-month on root branches only. See [History window](https://neon.com/docs/introduction/history-window).

## Restore a branch

From the CLI:

```bash
neon branches restore main ^self@2026-04-24T14:30:00Z
```

You can also create a new branch from the past, inspect it, then promote it. This is the safer pattern when you're not 100% sure about the timestamp:

```bash
neon branches create --name recovery --parent 2026-04-24T14:30:00Z
```

Connect to the new branch, verify the data is what you expect, then either copy rows back to `main` or promote the recovery branch. See [Instant restore](https://neon.com/docs/introduction/branch-restore).

## Protect production from accidents

On Launch and Scale, you can mark a branch as [protected](https://neon.com/docs/guides/protected-branches). Protected branches can't be deleted or reset, and they require explicit confirmation for destructive operations.

<Admonition type="warning">
Storage for the history window grows with your write volume. A longer window gives you more recovery range but raises your storage bill. Pick the shortest window that covers your typical incident detection time.
</Admonition>

## How other providers handle recovery

| Provider         | Recovery model                                                                                                                                               | Retention                                                         | Result of a restore                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | -------------------------------------------------------------------- |
| Neon             | Instant restore in place to any LSN/timestamp                                                                                                                | 6 hours (Free), up to 7 days (Launch), up to 30 days (Scale)      | Same branch, rewound in seconds                                      |
| AWS RDS / Aurora | [Point-in-time restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.BackupRetention.html) from automated backups | 0–35 days (you set retention)                                     | A new DB instance you cut over to                                    |
| Supabase         | Daily logical backups; [PITR](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery) as paid add-on                                       | Pro: 7 daily backups; PITR add-on starts at 7 days for $100/month | Same project, but restore makes it inaccessible during the operation |

Both AWS and Supabase support point-in-time recovery, but the operational shape is different: AWS's PITR provisions a new instance, and Supabase's restore takes the project offline during the operation. Neon's instant restore rewinds the existing branch in seconds, so connection strings stay the same.

<CTA title="Try instant restore on Neon" description="Free plan includes a 6-hour history window for recovery." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
