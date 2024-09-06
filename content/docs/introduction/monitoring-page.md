---
title: Monitoring dashboard
enableTableOfContents: true
updatedOn: '2024-09-02T13:42:56.659Z'
---

The **Monitoring** dashboard in the Neon console provides several graphs for monitoring system and database metrics. You can access the **Monitoring** dashboard from the sidebar in the Neon Console. Observable metrics include:

- [RAM](#ram)
- [CPU](#cpu)
- [Connections count](#connections-count)
- [Database size](#database-size)
- [Deadlocks](#deadlocks)
- [Rows](#rows)
- [Replication delay bytes](#replication-delay-bytes)
- [Replication delay seconds](#replication-delay-seconds)

Your Neon plan defines the range of data you can view.

| Neon Plan                                       | Data Access              |
| ----------------------------------------------- | ------------------------ |
| [Free Plan](/docs/introduction/plans#free-plan) | Last day (24 hours)      |
| [Launch](/docs/introduction/plans#launch)       | Last 7 days (168 hours)  |
| [Scale](/docs/introduction/plans#scale)         | Last 14 days (336 hours) |
| [Business](/docs/introduction/plans#business)         | Last 14 days (336 hours) |

A shorter or custom period can be selected within the permitted range by selecting the desired option from the **Other** menu on the dashboard.

The dashboard displays metrics for the selected **Branch** and **Compute endpoint**. Use the drop-down menus to view metrics for a different branch or compute. Use the **Refresh** button to update the displayed metrics.

If your compute was idle or there has not been much activity, charts may display this message: `There is not enough metrics data for this compute`. In this case, try again later after more usage data has been collected.

<Admonition type="note">
The values and plotted lines in your graphs may go to `0` during periods when your compute is not active. For example, **RAM**, **CPU**, and **Database size** values lines go to `0` when a compute transitions to an idle state due to being suspended after a period of inactivity.
</Admonition>

### RAM

This graph shows allocated RAM and usage over time for the selected compute.

**ALLOCATED**: The amount of allocated RAM.

RAM is allocated according to the size of your compute or your [autoscaling](/docs/guides/autoscaling-guide) configuration, if applicable. For example, if your compute size is .25 CU (.25 vCPU with 1 GB RAM), your allocated RAM is always 1 (GiB). With autoscaling, allocated RAM increases and decreases as your compute size scales up and down in response to load. If [autosuspend](/docs/guides/auto-suspend-guide) is enabled and your compute transitions to an idle state after a period of inactivity, allocated RAM drops to 0.

**Used**: The amount of RAM used.

The chart plots a line showing the amount of RAM used. If the line regularly reaches the maximum amount of allocated RAM, consider increasing your compute size to increase the amount of allocated RAM. To see the amount of RAM allocated for each Neon compute size, see [Compute size and autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration).

![Monitoring page RAM graph](/docs/introduction/monitor_ram.jpg)

### CPU

This graph shows the amount of allocated CPU and usage over time for the selected compute.

**ALLOCATED**: The amount of allocated CPU.

CPU is allocated according to the size of your compute or your [autoscaling](/docs/guides/autoscaling-guide) configuration, if applicable. For example, if your compute size is .25 CU (.25 vCPU with 1 GB RAM), your allocated CPU is always 0.25. With autoscaling, allocated CPU increases and decreases as your compute size scales up and down in response to load. If [autosuspend](/docs/guides/auto-suspend-guide) is enabled and your compute transitions to an idle state after a period of inactivity, allocated CPU drops to 0.

**Used**: The amount of CPU used, in [Compute Units (CU)](/docs/reference/glossary#compute-unit-cu).

If the plotted line regularly reaches the maximum amount of allocated CPU, consider increasing your compute size. To see the compute sizes available with Neon, see [Compute size and autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration).

![Monitoring page CPU graph](/docs/introduction/monitor_cpu.jpg)

### Connections count

The **Connections count** graph shows the number of idle connections, active connections, and the total number of connections over time for the selected compute.

**ACTIVE**: The number of active connections for the selected compute.

Monitoring active connections can help you understand your database workload at any given time. If the number of active connections is consistently high, it might indicate that your database is under heavy load, which could lead to performance issues such as slow query response times. See [Connections](/docs/postgresql/query-reference#connections) for related SQL queries.

**IDLE**: The number of idle connections for the selected compute.

Idle connections are those that are open but not currently being used. While a few idle connections are generally harmless, a large number of idle connections can consume unnecessary resources, leaving less room for active connections and potentially affecting performance. Identifying and closing unnecessary idle connections can help free up resources. See [Find long-running or idle connections](/docs/postgresql/query-reference#find-long-running-or-idle-connections).

**TOTAL**: The sum of active and idle connections for the selected compute.

The limit on the maximum number of simultaneous connections (defined by the Postgres `max_connections` setting) is set according to your Neon compute size. Monitoring the total number of connections helps ensure you don't hit your connection limit, as reaching it can prevent new connections from being established, leading to connection errors. For the connection limit for each Neon compute size, see [How to size your compute](https://neon.tech/docs/manage/endpoints#how-to-size-your-compute). Increasing your compute size is one way to increase your connection limit. Another option is to use connection pooling, which supports up to 10,000 simultaneous connections. To learn more, see [Connection pooling](/docs/connect/connection-pooling).

![Monitoring page connections graph](/docs/introduction/monitor_connections.jpg)

{/*

- [Buffer cache hit rate](#buffer-cache-hit-rate)

### Buffer cache hit rate

The **Buffer cache hit rate** graph shows the percentage of read requests served from memory &#8212; from Neon's Local File Cache (LFC). Queries not served from memory retrieve data from storage, which is more costly and can result in slower query performance. For OLTP workloads, you should aim for a cache hit ratio of 99% or better. However, the ideal cache hit ratio depends on your specific workload and data access patterns. In some cases, a slightly lower ratio might still be acceptable, especially if the workload involves a lot of sequential scanning of large tables where caching might be less effective. To learn more, see [What is the Local File Cache?](/docs/extensions/neon#what-is-the-local-file-cache)

![Monitoring page cache hit rate graph](/docs/introduction/monitor_cache.jpg)

*/}

### Database size

The **Database size** graph shows the logical data size (the size of your actual data) for the named database and the total size for all user-created databases (**Database total size**) on the selected branch. The named database is always the oldest database on the selected branch. Database size differs from the [storage](/docs/introduction/usage-metrics#storage) size of your Neon project, which includes the logical data size plus history. The **Database total size** metric is only shown when there is more than one database on the selected branch.

<Admonition type="important">
Database size metrics are only displayed while your compute is active. When your compute is idle, database size values are not reported, and the **Database size** graph shows zero even though data may be present.
</Admonition>

![Monitoring page database size graph](/docs/introduction/monitor_data_size.jpg)

### Deadlocks

The **Deadlocks** graph shows a count of deadlocks over time for the named database on the selected branch. The named database is always the oldest database on the selected branch.

Deadlocks occur in a database when two or more transactions simultaneously block each other by holding onto resources the other transactions need, creating a cycle of dependencies that prevent any of the transactions from proceeding, potentially leading to performance issues or application errors. For lock-related queries you can use to investigate deadlocks, see [Performance tuning](/docs/postgresql/query-reference#performance-tuning). To learn more about deadlocks in Postgres, see [Deadlocks](/docs/current/explicit-locking.html#LOCKING-DEADLOCKS).

![Monitoring page deadlocks graph](/docs/introduction/monitor_deadlocks.jpg)

### Rows

The **Rows** graph shows the number of rows deleted, updated, and inserted over time for the named database on the selected branch. The named database is always the oldest database on the selected branch. Row metrics are reset to zero whenever your compute restarts.

Tracking rows inserted, updated, and deleted over time provides insights into your database's activity patterns. You can use this data to identify trends or irregularities, such as insert spikes or an unusual number of deletions.

![Monitoring page rows graph](/docs/introduction/monitor_rows.jpg)

### Replication delay bytes 

The **Replication delay bytes** graph shows the total size, in bytes, of the data that has been sent from the primary compute but has not yet been applied on the replica. A larger value indicates a higher backlog of data waiting to be replicated, which may suggest issues with replication throughput or resource availability on the replica. This chart is only visible when selecting a **Replica** compute from the **Compute** drop-down menu.

![Replication delay bytes](/docs/introduction/rep_delay_bytes.png)

### Replication delay seconds 

The **Replication delay seconds** graph shows the time delay, in seconds, between the last transaction committed on the primary compute and the application of that transaction on the replica. A higher value suggests that the replica is behind the primary, potentially due to network latency, high replication load, or resource constraints on the replica. This chart is only visible when selecting a **Replica** compute from the **Compute** drop-down menu.

![Replication delay seconds](/docs/introduction/rep_delay_seconds.png)
