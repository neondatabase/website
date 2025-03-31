---
title: Instant restore
subtitle: Learn how to instantly recover your database to any point in time within your restore window
enableTableOfContents: true
redirectFrom:
  - /docs/guides/branch-restore
  - /docs/guides/branching-pitr
  - /docs/guides/branch-refresh
  - /docs/guides/branch-promote
updatedOn: '2025-02-28T11:10:41.825Z'
---

Neon's instant restore capability (also known as point-in-time restore or PITR in the industry) lets you recover your database to any specific moment within your restore window. This powerful feature is built on Neon's architecture, which maintains a history of changes through Write-Ahead Log (WAL) records.

With instant restore, you can:
- Recover lost data by restoring to a point before the data loss occurred
- Create a new branch from any point in time within your restore window
- Use Time Travel Assist to preview data at any point before restoring
- Compare schemas between branches using Schema Diff before restoring

## How instant restore works

### Restore from history

The restore operation lets you revert the state of a selected branch to an earlier point in time in its own or another branch's history, using time and date or Log Sequence Number (LSN). For example, you can revert to a state just before a data loss occurred.

![branch restore to timestamp](/docs/guides/branch-restore_feature.png)

The default restore window for a Neon project differs by plan. You can revert a branch to any time within your configured [restore window](/docs/manage/projects#configure-restore-window), down to the millisecond.

A few key points to keep in mind about the restore operation:

- [Restore backups are created automatically in case you make a mistake](#automatic-backups)
- [Current data is overwritten](#overwrite-not-a-merge)
- [All databases on a branch are restored](#changes-apply-to-all-databases)
- [Connections to the selected branch are temporarily interrupted](#connections-temporarily-interrupted) 