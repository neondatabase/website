---
title: Point-in-time restore
subtitle: Restore your data to previous state
enableTableOfContents: true
---

Neon retains a history of changes, which allows you to create a branch that restores data to any point in time within the retention period. You can use this capability as a database [backup]/docs/manage/backups) strategy, to view a past state of your database, or to recover lost data, which is a form of Point-in-time restore (PITR). Neon retains 7 days of history by default. [Neon Pro plan](/docs/introduction/pro-plan) users can configure a Neon project to retain up to 30 days of history.

History is retained in the form of Write-Ahead-Log (WAL) records. Increasing the history retention period affects all branches in your Neon project and increases [project storage](/docs/introduction/billing#project-storage). [Neon Pro plan](/docs/introduction/pro-plan) plan users can scale retained history down to zero if reducing storage is more important than point-in-time restore capabilities. The supported range for history retention is 0 to 30 days. WAL records that age out of the retention period are evicted from storage and no longer count toward project storage.

The **History retention** setting for a Neon project is located in the Neon Console under **Settings** > **Storage**.

A point-in-time restore operation is performed by creating a branch using the **Time** or **LSN** option. To learn how to use this feature, refer to [Branching — Point-in-time restore](https://neon.tech/docs/guides/branching-pitr).
