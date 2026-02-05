---
title: Cost optimization
subtitle: Strategies to manage and reduce your Neon costs
enableTableOfContents: true
updatedOn: '2025-12-11T15:40:49.867Z'
---

Managing your Neon costs effectively requires understanding how each billing factor works and implementing strategies to control usage. This guide provides actionable recommendations for optimizing costs across all billing metrics.

## Compute (CU-hours)

Compute is typically the largest component of your Neon bill. You're charged based on compute size (in CUs) multiplied by the hours your compute is running.

**Optimization strategies:**

- **Right-size your compute** — Start by determining the appropriate compute size for your workload. Your compute should be large enough to cache your frequently accessed data (your working set) in memory. A compute that's too small can lead to poor query performance, while an oversized compute wastes resources. See [How to size your compute](/docs/manage/computes#how-to-size-your-compute) for guidance.

- **Use autoscaling effectively** — Configure [autoscaling](/docs/introduction/autoscaling) to dynamically adjust compute resources based on demand. Set your minimum size to handle your baseline workload and your maximum to accommodate peak traffic. You only pay for what you use. See [Enable autoscaling](/docs/guides/autoscaling-guide) for configuration steps.

- **Enable scale to zero** — For non-production environments or databases with intermittent usage, enable [scale to zero](/docs/introduction/scale-to-zero) to suspend your compute after 5 minutes of inactivity. This can dramatically reduce compute costs for development, testing, and preview environments. See [Configuring scale to zero](/docs/guides/scale-to-zero-guide).

- **Manage persistent connections and scheduled jobs** — Applications that maintain long-lived connections or scheduled jobs (like cron tasks) can prevent your compute from scaling to zero, keeping it active 24/7. If these aren't critical, consider closing idle connections or adjusting job schedules to allow scale to zero during off-peak hours.

- **Be aware of logical replication impact** — If you're using [logical replication](/docs/guides/logical-replication-neon), note that computes with active replication subscribers will not scale to zero, resulting in 24/7 compute usage. Plan accordingly and consider whether logical replication is necessary for all environments.

## Storage (root and child branches)

Storage costs are based on actual data size for root branches and the minimum of accumulated changes or logical data size for child branches, billed in GB-months.

**Optimization strategies:**

- **Manage child branch storage** — Child branches are billed for the minimum of accumulated data changes or your logical data size—capped at your actual data size. While this prevents charges from exceeding your data size, managing branches effectively still helps minimize costs:
  - Set a [time to live](/docs/guides/branch-expiration) on development and preview branches
  - Delete child branches when they're no longer needed
  - For production workloads, use a [root branch](/docs/manage/branches#root-branch) instead—root branches are billed on your actual data size.

- **Implement branch lifecycle management** — Review your branches regularly and delete any that are no longer needed. Keeping your branch count under control reduces both storage costs and potential [extra branch charges](/docs/introduction/plans#extra-branches).

### Storage FAQs

<details>
<summary>**Do branches add to storage?**</summary>

When branches are created, they initially do not add to storage since they share data with the parent branch. However, as soon as changes are made to a branch, new WAL records are created, adding to your history. Additionally, when a branch ages out of your project's restore window, its data is no longer shared with its parent and is counted independently, thus adding to storage.

To avoid branches consuming storage unnecessarily:

- Set a [branch expiration](/docs/guides/branch-expiration) (time to live) to automatically delete branches after a specified period
- [Reset](/docs/guides/reset-from-parent) branches to restart the clock
- [Delete](/docs/manage/branches) branches before they age out of the restore window

</details>

<details>
<summary>**Does a delete operation add to storage?**</summary>

Yes. Any data-modifying operation, such as deleting a row from a table in your database, generates a WAL record, so even deletions temporarily increase your history size until those records age out of your restore window.

</details>

<details>
<summary>**What increases the size of history?**</summary>

Any data-modifying operation increases the size of your history. As WAL records age out of your [restore window](/docs/introduction/restore-window), they are removed, reducing your history and potentially decreasing your total storage size.

</details>

<details>
<summary>**What can I do to minimize my storage?**</summary>

Here are some strategies to consider:

- **Optimize your restore window**

  Your restore window setting controls how much change history your project retains. Decreasing history reduces the window available for things like instant restore or time-travel. Retaining no history at all would make branches expensive, as a branch can only share data with its parent if history is retained. Your goal should be a balanced restore window configuration; one that supports the features you need but does not consume too much storage. See [Restore window](/docs/introduction/restore-window) for how to configure your restore window.

- **Use branches instead of duplicating data**

  Use short-lived Neon branches for things like testing, previews, and feature development instead of creating separate standalone databases. As long as your branch remains within the restore window, it shares data with its parent, making branches very storage-efficient. Added to that, branches can be created instantly, and they let you work with data that mirrors production.

- **Consider the impact of deletions**

  It may seem counterintuitive, but deleting rows from a table temporarily increases storage because delete operations are logged as part of your change history. The records for those deletions remain part of your history until they age out of your [restore window](/docs/introduction/restore-window). For mass deletions, `DELETE TABLE` and `TRUNCATE TABLE` operations are more storage-efficient since they log a single operation rather than a record for each deleted row.

- **Delete or reset branches before they age out**

  [Delete](/docs/manage/branches) old branches or [reset](/docs/guides/reset-from-parent) them before they age out of the restore window. Deleting branches before they age out avoids potentially large increases in storage. Resetting a branch sets the clock back to zero for that branch.

</details>

<details>
<summary>**What happens when I reach my storage limit?**</summary>

Storage limits depend on your Neon plan:

- **Free plan**: The Free plan includes 0.5 GB of storage per project. If you reach this limit, database operations that would increase storage (inserts, updates, and deletes) will fail until you reduce your storage or upgrade to a paid plan.
- **Paid plans**: Launch and Scale plans have no storage limit. Storage is billed based on actual usage at $0.35/GB-month, so you simply pay for what you use.

</details>

<details>
<summary>**I have a small database. Why is my storage so large?**</summary>

These factors could be contributing to your high storage consumption:

- **Frequent data modifications:** If you are performing a lot of writes (inserts, updates, deletes), each operation generates WAL records, which are added to your history. For instance, rewriting your entire database daily can lead to a storage amount that is a multiple of your database size, depending on the number of days of history your Neon project retains.
- **Restore window:** The length of your restore window plays a significant role. If you perform many data modifications daily and your restore window is set to 7 days, you will accumulate a 7-day history of those changes, which can increase your storage significantly.

To mitigate this issue, consider adjusting your [restore window](/docs/introduction/restore-window) setting. Perhaps you can do with a shorter window for instant restore, for example. Retaining less history should reduce your future storage consumption.

Also, make sure you don't have old branches lying around. If you created a bunch of branches and let those age out of your restore window, that could also explain why your storage is so large.

</details>

<details>
<summary>**How does running `VACUUM` or `VACUUM FULL` affect my storage costs?**</summary>

If you're looking to control your storage costs, you might start by deleting old data from your tables, which reduces the data size you're billed for going forward. Since, in typical Postgres operations, deleted tuples are not physically removed until a vacuum is performed, you might then run `VACUUM`, expecting to see a further reduction in the `Data size` reported in the Console — but you don't see the expected decrease.

**Why no reduction?**

In Postgres, [VACUUM](https://www.postgresql.org/docs/current/sql-vacuum.html) doesn't reduce your storage size. Instead, it marks the deleted space in the table for reuse, meaning future data can fill that space without increasing data size. While, `VACUUM` by itself won't make the data size smaller, it is good practice to run it periodically, and it does not impact availability of your data.

```sql
VACUUM your_table_name;
```

**Use VACUUM FULL to reclaim space**

Running `VACUUM FULL` _does_ reclaim physical storage space by rewriting the table, removing empty spaces, and shrinking the table size. This can help lower the **Data size** part of your storage costs. It's recommended to use `VACUUM FULL` when a table has accumulated a lot of unused space, which can happen after heavy updates or deletions. For smaller tables or less frequent updates, a regular `VACUUM` is usually enough.

To reclaim space using `VACUUM FULL`, you can run the following command per table you want to vacuum:

```sql
VACUUM FULL your_table_name;
```

However, there are some trade-offs:

- **Table locking** — `VACUUM FULL` locks your table during the operation. If this is your production database, this may not be an option.
- **Temporary storage spike** — The process creates a new copy of the table, temporarily increasing your storage usage. On the Free plan, this could cause the operation to fail if you hit the 0.5 GB storage limit.

In short, `VACUUM FULL` can help reduce your data size and future storage costs, but be aware of the temporary storage spike and table locking during the operation.

**Recommendations**

- **Set a reasonable history window** — We recommend setting your restore window to balance your data recovery needs and storage costs. Longer history means more data recovery options, but it consumes more storage.
- **Use VACUUM FULL sparingly** — Because it locks tables and can temporarily increase storage costs, only run `VACUUM FULL` when there is a significant amount of space to be reclaimed and you're prepared for a temporary spike in storage consumption.
- **Consider timing** — Running `VACUUM FULL` near the end of the month can help minimize the time that temporary storage spikes impact your bill, since charges are prorated.
- **Manual VACUUM for scale to zero users** — In Neon, [autovacuum](https://www.postgresql.org/docs/current/routine-vacuuming.html#AUTOVACUUM) is enabled by default. However, when your compute endpoint suspends due to inactivity, the database activity statistics that autovacuum relies on are lost. If your project uses [scale to zero](/docs/guides/scale-to-zero-guide#considerations), it's safer to run manual `VACUUM` operations regularly on frequently updated tables rather than relying on autovacuum. This helps avoid potential issues caused by the loss of statistics when your compute endpoint is suspended.

  To clean a single table named `playing_with_neon`, analyze it for the optimizer, and print a detailed vacuum activity report:

  ```sql
  VACUUM (VERBOSE, ANALYZE) playing_with_neon;
  ```

  See [VACUUM and ANALYZE statistic](/docs/postgresql/query-reference#vacuum-and-analyze-statistics) for a query that shows the last time vacuum and analyze were run.

</details>

<details>
<summary>**What is the maximum data size that Neon supports?**</summary>

Paid plans (Launch and Scale) support a logical data size of up to 16 TB per branch. The Free plan is limited to 0.5 GB per project. To increase the 16 TB limit, [contact the Neon Sales team](/contact-sales).

</details>

## Instant restore storage

Instant restore storage is based on the amount of change history (WAL records) retained, not the number of restores performed.

**Optimization strategies:**

- **Adjust your restore window** — By default, Neon retains history for 6 hours on Free plan projects and 1 day on paid plan projects. You can increase this up to the maximum for your plan (6 hours for Free, 7 days for Launch, 30 days for Scale). If you don't need much recovery capability, you can reduce your restore window to lower costs. Find the right balance between restore capability and cost. See [Restore window](/docs/introduction/restore-window).

- **Understand the trade-offs** — Reducing your restore window decreases instant restore storage costs but limits how far back you can restore data. Consider your actual recovery requirements and set the window accordingly.

## Extra branches

Extra branches beyond your plan's allowance are billed at $1.50/branch-month, prorated hourly. Plans include 10 branches for Free and Launch, 25 for Scale.

**Optimization strategies:**

- **Use branch expiration** — Set automatic deletion timestamps on temporary branches using [branch expiration](/docs/guides/branch-expiration) to ensure they're cleaned up when no longer needed.

- **Automate cleanup** — Consider implementing automated cleanup scripts using the [Neon API](/docs/manage/branches#branching-with-the-neon-api) or [Neon CLI](/docs/guides/branching-neon-cli) to stay within your plan's branch allowance.

## Public data transfer

Public network transfer (egress) is the data sent from your databases over the public internet. Free plans include 5 GB/month, while paid plans include 100 GB/month, then $0.10/GB.

**Optimization strategies:**

- **Monitor your data transfer** — Be aware of how much data you're transferring out of Neon. This includes:
  - Data sent to client applications
  - [Logical replication](/docs/reference/glossary#logical-replication) to any destination, including other Neon databases

- **Review your bill** — If you see unexpectedly high public data transfer charges, [contact support](/docs/introduction/support) for assistance. Neon does not currently expose detailed data transfer metrics in the Console.
