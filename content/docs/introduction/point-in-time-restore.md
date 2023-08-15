---
title: Point-in-time restore
subtitle: Restore your data to previous state
enableTableOfContents: true
---

Neon retains a history of changes, which allows you to create a branch that restores data to any point within the retention period. You can use this capability as a database [backup](/docs/manage/backups) strategy, to view the past state of your database, or to recover lost data.

## History retention

Neon retains a 7-day history by default. The history retention period is configurable. The supported range is 0 to 7 days for [Free Tier](/docs/introduction/free-tier) users, and 0 to 30 days for [Pro plan](/docs/introduction/pro-plan) users.

You can configure the **History retention** setting in the Neon Console, under **Settings** > **Storage**.
![History retention configuration](/docs/relnotes/history_retention.png)

For instructions, see [Configure history retention](/docs/manage/projects#configure-history-retention).

History is retained in the form of Write-Ahead-Log (WAL) records. Increasing the history retention period affects all branches in your Neon project and increases [project storage](/docs/introduction/billing#project-storage). You can scale retained history down to zero if reducing storage is more important than point-in-time restore capabilities. WAL records that age out of the retention period are evicted from storage and no longer count toward project storage.

## Point-in-time restore

A point-in-time restore operation is performed by creating a branch using the **Time** or **LSN** option. Your retention period dictates how far back you can restore to. To learn how to to perform a point-in-time restore operation, refer to [Branching — Point-in-time restore](https://neon.tech/docs/guides/branching-pitr).
