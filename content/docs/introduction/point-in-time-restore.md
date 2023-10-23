---
title: Point-in-time restore
subtitle: Restore your data to a previous state
enableTableOfContents: true
updatedOn: '2023-10-07T10:43:33.406Z'
---

Neon retains a history of changes for all branches, enabling point-in-time restore. This feature allows you to restore data to any point within the retention period. You can use the point-in-time restore feature as a database [backup](/docs/manage/backups) strategy, to view the past state of your database, or to recover lost data.

## History retention

The history retention period is 7 days, by default, but is configurable. The supported range is 0 to 7 days for [Free Tier](/docs/introduction/free-tier) users, and 0 to 30 days for [Pro plan](/docs/introduction/pro-plan) users.

You can configure the **History retention** setting in the Neon Console, under **Settings** > **Storage**. For further instructions, see [Configure history retention](/docs/manage/projects#configure-history-retention).
![History retention configuration](/docs/relnotes/history_retention.png)

Increasing the history retention period affects all branches in your Neon project and increases [project storage](/docs/introduction/billing#project-storage). You can scale **History retention** down to zero if reducing storage cost is more important than the ability to restore your data to a past state.

History is retained in the form of Write-Ahead-Log (WAL) records. As WAL records age out of the retention period, they are evicted from storage and no longer count toward project storage.

## Point-in-time restore

A point-in-time restore operation is performed by creating a branch using the **Time** or **LSN** option. Your **History retention** period dictates how far back you can restore your data. To learn how to perform a point-in-time restore operation, refer to [Branching — Point-in-time restore](https://neon.tech/docs/guides/branching-pitr).
