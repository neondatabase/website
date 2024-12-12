---
title: Branch reset and restore
subtitle: Learn about the different branch reset and restore features in Neon
enableTableOfContents: true
updatedOn: '2024-12-12T15:31:10.131Z'
---

Neon retains a history of changes for all branches. This shared history provides the basis for a variety of branch restore and reset operations: resetting a branch to its parent, restoring a branch to its history, creating a new branch from a selected point-in-time, and Time Travel queries against the shared history. You can use these features to reset a development branch to main, to recover lost data, as a database backup strategy, or to view the past state of your database.

## History retention

By default, Neon's history retention window is set to **1 day** across all plans to help you avoid unexpected storage costs. Increasing your retention window gives you a better range for your reset and restore operations, but it can also increase storage costs. The history retention limit is up to 24 hours for [Neon Free Plan](/docs/introduction/plans#free-plan) users, 7 days for [Launch](/docs/introduction/plans#launch), 14 days for [Scale](/docs/introduction/plans#scale), and 30 days for [Business](/docs/introduction/plans#business) plan users.

You can configure the **History retention** setting in the Neon Console, under **Settings** > **Storage**. For further instructions, see [Configure history retention](/docs/manage/projects#configure-history-retention).
![History retention configuration](/docs/relnotes/history_retention.png)

Increasing the history retention period affects all branches in your Neon project and increases [project storage](/docs/introduction/usage-metrics#storage). You can scale **History retention** down to zero if reducing storage cost is more important than the ability to restore your data to a past state.

History is retained in the form of Write-Ahead-Log (WAL) records. As WAL records age out of the retention period, they are evicted from storage and no longer count toward project storage.

## Branch reset and restore features

Find out more about the different branch reset and restore features that Neon provides.

<DetailIconCards>

<a href="/docs/guides/branch-restore" description="Learn how to restore a branch to its history with Time Travel assist" icon="split-branch">Branch Restore with Time Travel</a>

<a href="/docs/manage/branches#reset-a-branch-from-parent" description="Learn how to restore a branch to its history with Time Travel assist" icon="split-branch">Reset a branch from its parent</a>

<a href="/docs/guides/branching-pitr" description="Create a new point-in-time branch from timestamp or LSN" icon="split-branch">Create a point-in-time branch</a>

</DetailIconCards>
