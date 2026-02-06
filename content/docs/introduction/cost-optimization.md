---
title: Cost optimization
subtitle: Strategies to manage and reduce your Neon costs
summary: >-
  Covers strategies for managing and reducing Neon costs by optimizing compute
  usage, including right-sizing, effective autoscaling, enabling scale to zero,
  and managing persistent connections.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.089Z'
---

Managing your Neon costs effectively requires understanding how each billing factor works and implementing strategies to control usage. This guide provides actionable recommendations for optimizing costs across all billing metrics.

To monitor your current usage, check the **Billing** page in the [Neon Console](https://console.neon.tech), which shows your charges to date for each billing metric. For programmatic access to usage data, see [Consumption metrics](/docs/guides/consumption-metrics).

## Compute (CU-hours)

Compute is typically the largest component of your Neon bill. You're charged based on compute size (in CUs) multiplied by the hours your compute is running.

**Optimization strategies:**

- **Right-size your compute.** Start by determining the appropriate compute size for your workload. Your compute should be large enough to cache your frequently accessed data (your working set) in memory. A compute that's too small can lead to poor query performance, while an oversized compute wastes resources. See [How to size your compute](/docs/manage/computes#how-to-size-your-compute) for guidance.

- **Use autoscaling effectively.** Configure [autoscaling](/docs/introduction/autoscaling) to dynamically adjust compute resources based on demand. Set your minimum size to handle your baseline workload and your maximum to accommodate peak traffic. You only pay for what you use. See [Enable autoscaling](/docs/guides/autoscaling-guide) for configuration steps.

- **Enable scale to zero.** For non-production environments or databases with intermittent usage, enable [scale to zero](/docs/introduction/scale-to-zero) to suspend your compute after 5 minutes of inactivity. This can dramatically reduce compute costs for development, testing, and preview environments. See [Configuring scale to zero](/docs/guides/scale-to-zero-guide).

- **Manage persistent connections and scheduled jobs.** Applications that maintain long-lived connections or scheduled jobs (like cron tasks) can prevent your compute from scaling to zero, keeping it active 24/7. If these aren't critical, consider closing idle connections or adjusting job schedules to allow scale to zero during off-peak hours.

- **Be aware of logical replication impact.** If you're using [logical replication](/docs/guides/logical-replication-neon), note that computes with active replication subscribers will not scale to zero, resulting in 24/7 compute usage. Plan accordingly and consider whether logical replication is necessary for all environments.

- **Consider read replica costs.** [Read replicas](/docs/introduction/read-replicas) are billed as separate compute endpoints. If you have read replicas, they add to your total compute hours. Review whether all replicas are needed, and consider scale to zero settings for replicas used infrequently.

## Storage (root and child branches)

Storage costs are based on actual data size for root branches and the minimum of accumulated changes or logical data size for child branches, billed in GB-months.

**Optimization strategies:**

- **Clean up unused data.** Delete old rows, drop unused tables, and remove test data to reduce your root branch data size. Be aware that delete operations generate WAL records that temporarily add to your [instant restore storage](#instant-restore-storage) until they age out of your restore window. For bulk deletions, use `TRUNCATE TABLE` instead of `DELETE` when possible (it generates far less WAL).

- **Reclaim space from bloated tables.** Frequent updates and deletes leave dead tuples that inflate your data size. You can run `VACUUM FULL` on heavily modified tables to reclaim space. However, see the [VACUUM FAQ](#how-does-running-vacuum-or-vacuum-full-affect-my-storage-costs) first to understand the trade-offs before taking action.

- **Manage child branch storage.** Child branches are billed for the minimum of accumulated data changes or your logical data size, capped at your actual data size. While this prevents charges from exceeding your data size, managing branches effectively still helps minimize costs:
  - Set a [time to live](/docs/guides/branch-expiration) on development and preview branches
  - [Delete](/docs/manage/branches#delete-a-branch) child branches when they're no longer needed
  - For production workloads, use a [root branch](/docs/manage/branches#root-branch) instead (root branches are billed on actual data size)

- **Implement branch lifecycle management.** Review your branches regularly and [delete](/docs/manage/branches#delete-a-branch) any that are no longer needed. Keeping your branch count under control reduces both storage costs and potential [extra branch charges](/docs/introduction/plans#extra-branches).

### Storage FAQs

<details>
<summary>**Do branches add to storage?**</summary>

When branches are created, they initially do not add to storage since they share data with their parent through copy-on-write. However, as soon as changes are made to a branch, new data is written, adding to child branch storage. See [Manage child branch storage](#storage-root-and-child-branches) above for strategies to control branch storage costs.

</details>

<details>
<summary>**Do delete operations add to storage?**</summary>

Yes. Any data-modifying operation, including deletes, generates [WAL records](/docs/reference/glossary#write-ahead-logging-wal) that temporarily increase your storage size until they age out of your restore window. For mass deletions, `TRUNCATE TABLE` is more storage-efficient since it logs a single operation rather than a record for each deleted row.

</details>

<details>
<summary>**What happens when I reach my storage limit?**</summary>

Storage limits depend on your Neon plan:

- **Free plan**: The Free plan includes 0.5 GB of storage per project. If you reach this limit, database operations that would increase storage (inserts, updates, and deletes) will fail until you reduce your storage or [upgrade to a paid plan](/docs/introduction/manage-billing#change-your-plan).
- **Paid plans**: Launch and Scale plans have no storage limit. Storage is billed based on actual usage, so you simply pay for what you use.

</details>

<details>
<summary>**I have a small database. Why is my bill higher than expected?**</summary>

If your database is small but your bill seems high, check these factors:

- **Instant restore history:** Neon charges for point-in-time restore (PITR) storage only for branches you can point-in-time restore from: **root branches**. Child branches do not add to PITR storage charges. If you perform many data modifications on your root branch(es) with a 7-day restore window, you'll accumulate 7 days of that billable history at $0.20/GB-month. See [Instant restore storage](#instant-restore-storage) for optimization strategies.
- **Unused branches:** If you created branches, performed write operations, and forgot about the branches, they could be contributing to your storage costs. Review and [delete](/docs/manage/branches#delete-a-branch) branches you no longer need.
- **Table bloat:** Frequent updates and deletes can cause table bloat (dead tuples), which can make your data size larger than expected. See the [VACUUM FAQ](#how-does-running-vacuum-or-vacuum-full-affect-my-storage-costs) for details.

To see what's driving your costs, check the **Billing** page in the Neon Console, which shows your charges to date for each billing metric.

</details>

<details>
<summary>**How does running `VACUUM` or `VACUUM FULL` affect my storage costs?**</summary>

If you're looking to control your storage costs, you might start by deleting old data from your tables, which reduces the data size you're billed for going forward. Since, in typical Postgres operations, deleted tuples are not physically removed until a vacuum is performed, you might then run `VACUUM`, expecting to see a further reduction in the `Data size` reported in the Console. But you don't see the expected decrease.

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

- **Table locking.** `VACUUM FULL` locks your table during the operation. If this is your production database, this may not be an option.
- **Temporary storage spike.** The process creates a new copy of the table, temporarily increasing your storage usage. On the Free plan, this could cause the operation to fail if you hit the 0.5 GB storage limit.

In short, `VACUUM FULL` can help reduce your data size and future storage costs, but be aware of the temporary storage spike and table locking during the operation.

**Recommendations**

- **Use VACUUM FULL sparingly.** Because it locks tables and can temporarily increase storage, only run `VACUUM FULL` when there is a significant amount of space to be reclaimed.
- **Manual VACUUM for scale to zero users.** In Neon, [autovacuum](https://www.postgresql.org/docs/current/routine-vacuuming.html#AUTOVACUUM) is enabled by default. However, when your compute suspends due to inactivity, the database activity statistics that autovacuum relies on are lost. If your project uses [scale to zero](/docs/guides/scale-to-zero-guide#considerations), consider running manual `VACUUM` operations regularly on frequently updated tables.

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

Instant restore storage (PITR storage) is the change history retained for point-in-time recovery. Neon only charges for PITR storage on branches you can point-in-time restore from: **root branches**. You cannot point-in-time restore from child branches, so child branches do not add to this charge. Instant restore storage is billed at $0.20/GB-month on paid plans, separate from your data storage. The Free plan includes up to 1 GB of instant restore history at no charge.

**Optimization strategies:**

- **Adjust your restore window.** By default, Neon retains instant restore history for 6 hours on Free plan projects and 1 day on paid plan projects. You can increase this up to the maximum for your plan (6 hours for Free, 7 days for Launch, 30 days for Scale). If you don't need much recovery capability, reduce your restore window to lower costs. See [Restore window](/docs/introduction/restore-window).

- **Understand the trade-offs.** A longer restore window means more recovery options but higher instant restore storage costs. A shorter window reduces costs but limits how far back you can restore. Consider your actual recovery requirements when setting the window.

- **High-write workloads on root branches generate more history.** The more writes on your root branch(es), the more instant restore history accumulates. For write-heavy root branches, a shorter restore window can significantly reduce costs.

## Extra branches

Extra branches beyond your plan's allowance are billed at $1.50/branch-month, prorated hourly. Plans include 10 branches for Free and Launch, 25 for Scale.

**Optimization strategies:**

- **Use branch expiration.** Set automatic deletion timestamps on temporary branches using [branch expiration](/docs/guides/branch-expiration) to ensure they're cleaned up when no longer needed.

- **Automate cleanup.** Consider implementing automated cleanup scripts using the [Neon API](/docs/manage/branches#branching-with-the-neon-api) or [Neon CLI](/docs/guides/branching-neon-cli) to stay within your plan's branch allowance.

## Public data transfer

Public network transfer (egress) is the data sent from your databases over the public internet. Free plans include 5 GB/month, while paid plans include 100 GB/month, then $0.10/GB.

**Optimization strategies:**

- **Optimize query results.** Select only the columns you need rather than using `SELECT *`. For large result sets, use pagination or streaming instead of fetching all rows at once.

- **Consider logical replication costs.** [Logical replication](/docs/guides/logical-replication-neon) to external destinations counts as public data transfer. If you're replicating large amounts of data, factor this into your transfer costs.

- **Monitor with the consumption API.** Track data transfer programmatically using the [Consumption API](/docs/guides/consumption-metrics), or check the **Billing** page in the Console for current charges.
