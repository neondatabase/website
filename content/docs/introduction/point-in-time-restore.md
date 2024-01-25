---
title: Branch reset and restore
subtitle: Learn about the different branch reset and restore features in Neon
enableTableOfContents: true
updatedOn: '2023-10-24T18:56:54.989Z'
---

Neon retains a shared history of changes for all branches, which provides the basis for a variety of branch restore and reset operations: resetting a branch to its parent, restoring a branch to its history, creating a new branch from a selected point-in-time, and Time Travel queries against the shared history. You can use these features to reset a development branch to main, to recover lost data, as a database backup strategy, or to view the past state of your database.

## History retention

The history retention period is 7 days, by default, but is configurable. The supported range is 0 to 7 days for [Neon Free Tier](/docs/introduction/free-tier) users, and 0 to 30 days for [Neon Pro Plan](/docs/introduction/pro-plan) users.

You can configure the **History retention** setting in the Neon Console, under **Settings** > **Storage**. For further instructions, see [Configure history retention](/docs/manage/projects#configure-history-retention).
![History retention configuration](/docs/relnotes/history_retention.png)

Increasing the history retention period affects all branches in your Neon project and increases [project storage](/docs/introduction/billing#project-storage). You can scale **History retention** down to zero if reducing storage cost is more important than the ability to restore your data to a past state.

History is retained in the form of Write-Ahead-Log (WAL) records. As WAL records age out of the retention period, they are evicted from storage and no longer count toward project storage.

## Branch reset and restore features

Find out more about the different branch reset and restore features that Neon provides.

<DetailIconCards>

<a href="/docs/guides/branch-restore" description="Learn how to restore a branch to its history with Time Travel assist" icon="split-branch">Branch restore with Time Travel</a>

<a href="/docs/manage/branches#reset-a-branch-from-parent" description="Learn how to restore a branch to its history with Time Travel assist" icon="split-branch">Reset a branch from its parent</a>

<a href="/docs/guides/branching-pitr" description="Create a new point-in-time branch from timestamp or LSN" icon="split-branch">Create a point-in-time branch</a>

</DetailIconCards>
