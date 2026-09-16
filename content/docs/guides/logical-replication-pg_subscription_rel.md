---
title: "Monitoring and troubleshooting logical replication with pg_subscription_rel in Postgres"
subtitle: "Learn how to monitor and troubleshoot logical replication in Postgres using the pg_subscription_rel system catalog and understanding its internal workings."
enableTableOfContents: true
isDraft: false
updatedOn: '2025-03-27T00:00:00.000Z'
---

Postgres logical replication is a versatile mechanism for replicating data objects and their modifications. It differs from physical replication by focusing on transactional changes, based on object identity like primary keys, instead of byte-by-byte copying. This ensures changes on the subscriber maintain the same commit order as on the publisher, guaranteeing data consistency. Logical replication supports selective replication and works across different versions of Postgres.

This guide explains the inner workings of Postgres logical replication. It explores key processes and focuses on using the `pg_subscription_rel` system catalog for monitoring and troubleshooting.

<Admonition type="note" title="Prerequisites">
This guide assumes you have a basic understanding of Postgres logical replication concepts and have a working logical replication setup. If you need a refresher on logical replication basics, check out our [Postgres logical replication concepts guide](/docs/guides/logical-replication-concepts).
</Admonition>

## Understanding key processes in logical replication

Logical replication in Postgres relies on several components working together to replicate data changes accurately. Understanding these components is crucial for effective monitoring and troubleshooting. Here are the key processes involved in logical replication:

### Logical decoding

**Logical decoding** is fundamental to logical replication. It extracts changes from the Write-Ahead Log (WAL) and presents them in a structured format.

This process interprets the WAL, which records all database changes, and transforms it into an application-specific format like streams of tuples or SQL statements. The walsender process on the publisher handles logical decoding. Decoder plugins interpret WAL entries and convert them into a logical replication stream for the subscriber. These plugins translate raw WAL data into meaningful database modifications.

### The Apply worker process

The **apply worker process** is crucial for logical replication on the subscriber. It receives changes from the publisher and applies them to the subscriber database. Starting on the subscriber, it connects to the publisher and communicates with the walsender process. The apply worker receives a stream of decoded and filtered logical changes from the walsender. It then applies these changes to the correct tables in the subscriber database.

To maintain transactional consistency, the apply worker applies `INSERT`, `UPDATE`, `DELETE`, and `TRUNCATE` operations in the same commit order as on the publisher.

During subscription setup, the apply worker may start `tablesync worker` processes for initial table synchronization. The `max_logical_replication_workers` setting limits the total number of apply and tablesync workers allowed to run simultaneously.

### The Tablesync worker process

The **Tablesync worker process** handles initial data synchronization when creating a new subscription. Started by the apply worker, it manages copying existing data. For each table in a new subscription, the apply worker starts a tablesync worker.

The tablesync worker performs two critical tasks:

1. It creates a **temporary replication slot** on the publisher to ensure it gets a consistent snapshot of the data.
2. It uses the efficient `COPY` command to transfer all data from the publisher to the subscriber.

After copying, it must "catch up" by requesting the publisher to replicate changes that occurred _during_ the copy process. Once fully synchronized, the tablesync worker hands off control to the main apply worker and exits.

Crucially, multiple tablesync workers can run in parallel, but they are limited by the `max_sync_workers_per_subscription` configuration (default is usually 2). This limit is a common source of confusion when monitoring initialization.

## Workflow of data changes in logical replication

Let's walk through the typical workflow of data changes in Postgres logical replication. This sequence illustrates how data modifications on the publisher propagate to the subscriber, ensuring consistent replication. It consists of two main phases: initial synchronization and continuous replication.

### Initial data synchronization

When a new subscription is created (and `copy_data` is enabled, the default), the system must first synchronize existing data using **tablesync workers**:

1.  **Start of apply worker**: The apply worker starts when the subscription is created.
2.  **Launch of tablesync workers**: The apply worker launches tablesync workers up to the limit set by `max_sync_workers_per_subscription`. Each worker is assigned a table to synchronize.
3.  **Creation of temporary replication slots**: Each tablesync worker creates a replication slot on the publisher. This slot ensures a consistent snapshot of the table data.
4.  **Data copy**: The tablesync worker uses the `COPY` command to efficiently transfer the table's data to the subscriber.
5.  **Synchronization**: After copying, the tablesync worker synchronizes. It consumes the replication stream from the walsender to catch up on changes that occurred during the data copy. This ensures the subscriber table is consistent with the publisher at the point of synchronization.
6.  **Handover**: Once synchronized, the tablesync worker finishes, drops the temporary replication slot, and hands control back to the apply worker for ongoing replication of that table.

### Continuous replication flow

Once initial synchronization is complete, data modifications propagate continuously from publisher to subscriber:

1.  **Data modification on the publisher**: A transaction on the publisher database modifies data in a published table. This can be `INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE`.

2.  **Write-ahead log (WAL) generation**: Postgres records every modification in the Write-Ahead Log (WAL) before applying changes to tables. Each change is a WAL record with a unique Log Sequence Number (LSN). This ensures data durability and crash recovery.

3.  **Logical decoding by the walsender**:
    - When a subscriber connects and a subscription is active, a walsender process starts on the publisher.
    - The walsender reads the WAL from the replication slot's position for that subscriber.
    - It uses the `pgoutput` plugin (default) to transform raw WAL entries into a stream of logical changes: `INSERT`, `UPDATE`, or `DELETE` statements.
    - The walsender filters these changes based on the publication definition, only considering modifications to subscribed tables.

4.  **Streaming of changes via the replication slot**:
    - The walsender transmits decoded, filtered changes to the subscriber through the replication slot.
    - The replication slot on the publisher tracks replication progress, recording the LSN of the last sent change.
    - LSN tracking ensures WAL segments are retained by the publisher, even if the subscriber is temporarily offline, until the subscriber confirms data reception.

5.  **Reception and application of changes by the apply worker**:
    - On the subscriber, the apply worker receives the stream of logical changes.
    - The apply worker maps these operations to tables in the subscriber database.
    - Critically, the apply worker applies changes in the _exact commit order_ from the publisher, maintaining transactional consistency.

This combined workflow ensures reliable and consistent replication, handling both the initial data load and real-time updates. Tablesync workers handle initial synchronization, and walsender and apply worker processes manage continuous, real-time replication of incremental changes.

## Monitoring replication status with pg_subscription_rel

Now that we've covered the internal workings, let's focus on monitoring replication using `pg_subscription_rel`. This system catalog provides real-time insights into the replication status of tables within a subscription.

### What is pg_subscription_rel?

`pg_subscription_rel` is a Postgres system catalog providing **real-time status information for each table in a logical replication subscription.** It's a detailed, table-specific dashboard for your replication setup.

Unlike catalogs with broader replication statistics, `pg_subscription_rel` shows the **relationship between subscriptions and replicated tables.** It offers a detailed view of which tables belong to which subscriptions and their current replication state.

### Key columns in pg_subscription_rel

To use `pg_subscription_rel` for monitoring, understanding its key columns is essential:

- **`srsubid` (oid):** A foreign key linking to the `pg_subscription` catalog. It uniquely identifies the **subscription** for a table. Each row in `pg_subscription_rel` is associated with a subscription.

- **`srrelid` (oid):** Another foreign key, linking to `pg_class`. It identifies the **specific table (relation)** being replicated. This column shows which table's replication status is reported in that row.

- **`srsubstate` (char):** The most important column for monitoring. A single-character code indicating the **current replication state** of the table within the subscription. State codes are detailed in the [next section](#understanding-the-srsubstate-codes).

- **`srsublsn` (pg_lsn):** It stores the **Log Sequence Number (LSN)** from the publisher, associated with the most recent state change for the table. LSNs track replication progress and ensure data consistency. This value is meaningful in 'synchronized' or 'ready' states, reflecting the subscriber's progress in the publisher's transaction log.

### Understanding the `srsubstate` codes

The `srsubstate` column uses single-character codes for different stages in a table's replication lifecycle.

- **`i` - Initialize:** A table enters **"Initialize"** when added to a subscription. It is waiting for a `tablesync worker` to become available. If all worker slots are full, tables will remain in this state.

- **`d` - Data is being copied:** Initial data synchronization is active. A `tablesync worker` has been assigned and is copying table data from publisher to subscriber using `COPY`.

- **`f` - Finished table copy (Catch-up phase):** The `COPY` command is done, but the table is not yet consistent. The `tablesync worker` is now actively consuming WAL from the publisher to "catch up" on changes that occurred while the copy was running. **This is where high-volume tables often spend the most time.**

- **`s` - Synchronized (Waiting for handover):** The `tablesync worker` has fully caught up with the publisher. It has marked the table as safe and is waiting for the main `apply worker` to acknowledge this state and take over control.

- **`r` - Ready (Normal replication):** The `tablesync worker` has exited. The main `apply worker` is now responsible for this table and applies transactions as part of the main replication stream.

**Typical state progression:**

| State code | Description                                                               |
| :--------- | :------------------------------------------------------------------------ |
| `i`        | Table is queued for sync.                                                 |
| `d`        | Initial data copy (`COPY` command) in progress.                           |
| `f`        | **Catch-up phase:** applying changes that happened during copy.           |
| `s`        | **Handover phase:** Sync complete, waiting for Apply worker to take over. |
| `r`        | Normal replication active (Apply worker in charge).                       |

States progress sequentially from 'i' to 'r' (`i` -> `d` -> `f` -> `s` -> `r`), with `'r'` (Ready) being the desired state for normal ongoing replication.

Understanding state progression is key to interpreting replication status and quickly identifying issues. Unexpected or prolonged states can signal potential problems in the replication setup. We'll delve into troubleshooting based on these states later in the [guide](#troubleshooting-logical-replication-issues).

<Admonition type="note" title="Still Confused between 's' and 'r' states?">
It's easy to confuse 's' (Synchronized) and 'r' (Ready) states. Here's the technical distinction:

**'s' (Synchronized)**: The **Tablesync Worker** has successfully finished copying and catching up. It is effectively "done" and is waiting for the main Apply Worker to acknowledge the work and take over. (If a table stays here, it's usually waiting for a lock).

**'r' (Ready)**: The Tablesync Worker has exited. The **Apply Worker** (the main supervisor) is now fully responsible for this table and applies transactions as part of the main real-time replication stream.
</Admonition>

## Monitoring replication status using SQL queries

To check the replication state of tables within a specific subscription, execute the following SQL query on the subscriber database:

```sql
SELECT srrelid::regclass, srsubstate
FROM pg_subscription_rel
WHERE srsubid = 'your_subscription_oid'::oid;
```

**Before running this query, you need to replace `'your_subscription_oid'` with the actual Object Identifier (OID) of your subscription.** You can find your subscription's OID by querying the `pg_subscription` system catalog. For example:

```sql
SELECT oid, subname FROM pg_subscription;
```

This query returns the OID and name of all subscriptions in the database. Use the OID of the subscription you want to monitor in the `pg_subscription_rel` query.

## Troubleshooting logical replication issues

Once you have successfully monitored the replication status using `pg_subscription_rel`, you can use the information to troubleshoot common logical replication issues. The `srsubstate` column is particularly useful for diagnosing problems based on the current state of each table in the subscription.

![Troubleshooting in pg_subscription_rel](/docs/guides/pg_subscription_rel_troubleshoot.png)

**Troubleshooting steps based on `srsubstate`:**

- **Table stuck in 'i' (initialize) state:**
  - **Check Worker Availability (Most Common):** Postgres limits how many tables can sync at once via `max_sync_workers_per_subscription` (default 2). If you subscribe to 100 tables, 2 will be in 'd' and 98 will be stuck in 'i' waiting their turn. This is normal queuing behavior.
  - **Check Connection/Privileges:** If _no_ tables are moving to 'd', verify the subscription user has privileges and can connect to the publisher.

- **Table stuck in 'd' (data copy) state:**
  - **Investigate network connectivity:** Check network connection between subscriber and publisher. Look for latency or instability slowing down data copy.
  - **Monitor resource utilization:** Check CPU, memory, disk I/O on both subscriber and publisher. Resource bottlenecks prolong data copy.
  - **Assess table size:** Large tables take longer to copy. A prolonged 'd' state may be normal for very large tables.Ensure the network isn't dropping connections and that `statement_timeout` on the publisher isn't killing the `COPY` command.

- **Table stuck in 'f' (finished copy / catch-up) state:**
  - **High Write Volume (The "Infinite Loop"):** This is the catch-up phase. If the publisher is writing to this table faster than the tablesync worker can apply the changes, the worker will never catch up to the current timestamp. It will remain in 'f' indefinitely. You may need to temporarily stop writes to this table on the publisher to allow the subscriber to catch up.
  - **Constraint Violations:** Transactions occurring during the copy phase are applied here. If a row was inserted on the publisher but conflicts with a constraint on the subscriber, the sync will fail here.

- **Table stuck in 's' (synchronized) state:**
  - **Apply Worker Lag:** The table remains in 's' until the main apply worker's replay position reaches or exceeds the LSN at which the tablesync worker finished. If there are many transactions being applied to other tables, this handover is delayed. Check `pg_stat_subscription` to see the apply worker's current position.

- **Not reaching 'r' (ready) state:**
  - If a table cycles between 'd' and 'f' repeatedly, check the Postgres logs on the subscriber. It is likely hitting an error (like a unique constraint violation or data type mismatch), crashing, and restarting the sync process from scratch.

In addition to monitoring the `pg_subscription_rel` catalog, ensure you monitor disk space on the publisher. High resource usage can often indicate performance bottlenecks in the replication process which need to be addressed. If a subscription is broken or paused, the replication slot will prevent WAL cleanup, potentially filling the disk on the publisher.

## References

- [pg_subscription_rel on PostgreSQL documentation](https://www.postgresql.org/docs/current/catalog-pg-subscription-rel.html)
- [Logical Replication Configuration Settings](https://www.postgresql.org/docs/current/runtime-config-replication.html#RUNTIME-CONFIG-REPLICATION-SUBSCRIBER)
