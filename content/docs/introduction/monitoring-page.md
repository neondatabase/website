---
title: Monitoring dashboard
subtitle: Monitor various project metrics from Neon's monitoring dashboard
enableTableOfContents: false
---

The **Monitoring** dashboard page in the Neon console provides several graphs for monitoring the Neon project metrics. You can access the **Monitoring** dashboard from the sidebar in the Neon Console. The observable metrics are described below.

Your Neon plan defines the data range of data you can access.

| Neon Plan | Data Access  |
|-----------|--------------|
| Free Tier | Last hour     |
| Launch    | Up to the last day (24 hours)       |
| Scale     | Up to the last 7 days      |

The dashboard displays data for the selected **Branch** and **Compute endpoint**. Use the drop-down menus to view data for a different branch or compute endpoint.

### RAM

This graph shows the amount of RAM allocated (available) to your compute and the amount of RAM used over time. 

**ALLOCATED**: RAM is allocated according to the size of your compute or your autoscaling configuration, if applicable. For example, if your compute size is .25 CU (.25 vCPU with 1 GB RAM), your allocated RAM is 1 (GiB) when your compute is active. With autoscaling, allocated RAM increases and decreases as your compute size scales up and down in response to load. If autosuspend is enabled and your compute transitions to an idle state after a period of inactivity, allocated RAM drops to 0.

**RAM (GiB)**: The chart plots a line showing the amount of RAM used while your compute is active. If this line regularly reaches the maximum amount of allocated RAM, consider increasing your compute size to increase the amount of allocated RAM. To see the amount of RAM for each Neon compute size, see [Compute size and autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration).

![Monitoring page RAM graph](/docs/introduction/monitor_ram.png)

### CPU

The **CPU** graph shows the allocated CPU size and CPU usage over time. CPU is measured in Compute Unit (CU) size.

**ALLOCATED**: The amount of allocated CPU. CPU is allocated according to the size of your compute or your autoscaling configuration, if applicable. For example, if your compute size is .25 CU (.25 vCPU with 1 GB RAM), your allocated CPU is .25 when your compute is active. With autoscaling, allocated CPU increases and decreases as your compute size scales up and down in response to load. If autosuspend is enabled and your compute transitions to an idle state after a period of inactivity, the allocated CPU drops to 0.

**CPU (CU)**: The amount of CPU used while your compute is active. If the plotted line regularly reaches the maximum amount of allocated CPU, consider increasing your compute size. To see the compute sizes available with Neon, see [Compute size and autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration).

![Monitoring page CPU graph](/docs/introduction/monitor_cpu.png)

### Connections count

The **Connections count** graph shows the number of idle connections, active connections, and the total number of connections over time for the selected compute endpoint and branch.

**ACTIVE**: The number of active database connections for the selected compute endpoint and branch. Monitoring active connections helps you understand the database's workload at any given time. If the number of active connections is consistently high, it might indicate that your database is under heavy load, which could lead to performance issues such as slow query response times. See [Connections](/docs/postgres/query-reference#connections) for related SQL queries.

**IDLE**: The number of idle database connections for the selected compute endpoint and branch. Idle connections are those that are open but not currently being used. While a few idle connections are generally harmless, a large number of idle connections can consume unnecessary resources, leaving less room for active connections and potentially affecting performance. Identifying and closing unnecessary idle connections can help free up resources. See [Find long-running or idle connections](/docs/postgres/query-reference#find-long-running-or-idle-connections).

**TOTAL**: The sum of active and idle connections for the selected compute endpoint and branch. The limit on the maximum number of simultaneous connections (`max_connections`) is defined according to your Neon compute size and whether you are using connection pooling. Monitoring the total number of connections helps ensure you don't hit your connection limit, as reaching it can prevent new connections from being established, leading to connection errors. Knowing your connection usage patterns can help you configure the appropriate connection limits. For connection limits for each Neon compute size, see [How to size your compute](https://neon.tech/docs/manage/endpoints#how-to-size-your-compute). To learn about connection pooling in Neon, which can support up to 10,000 simultaneous connections, see [Connection pooling](/docs/connect/connection-pooling).

![Monitoring page connections graph](/docs/introduction/monitor_connections.png)

### Buffer cache hit rate

The **Buffer cache hit rate** graph shows the percentage of read requests served from memory (from Neon's Local File Cache (LFC)). Queries not served from memory retrieve data from storage, which is more costly and can result in slower query performance. For OLTP workloads, you should aim for a cache hit ratio of 99% or better. However, the ideal cache hit ratio depends on your specific workload and data access patterns. In some cases, a slightly lower ratio might still be acceptable, especially if the workload involves a lot of sequential scanning of large tables where caching might be less effective. To learn more, see [What is the Local File Cache?](/docs/extensions/neon#what-is-the-local-file-cache).

![Monitoring page cache hit rate graph](/docs/introduction/monitor_cache.png)

### Database size

The **Database size** graph shows the logical data size (the size of your actual data) for the named user-created database and the total size for all user-created databases (**Database total size**) on the selected branch. The named database is always the oldest database on the selected branch.  Database size differs from the [storage](/docs/introduction/usage-metrics#storage) size of your Neon project, which includes the logical data size plus history. The **Database total size** metric is only shown if there is more than one database on the selected branch.

<Admonition type="important">
Database size metrics are only shown in the graph while your compute is active. If your compute is idle, database size values are not reported, and your **Database size** graph shows zero, even when data is present in your databases.
</Admonition>

![Monitoring page database size graph](/docs/introduction/monitor_data_size.png)

### Deadlocks

The **Deadlocks** graph shows a count of deadlocks over time for the named database on the selected branch. The named database is always the oldest database on the selected branch.

Deadlocks occur in a database when two or more transactions simultaneously block each other by holding onto resources the other transactions need, creating a cycle of dependencies that prevent any of the transactions from proceeding. Monitoring deadlocks is important because they halt transaction progress, potentially leading to performance issues or application errors. For lock-related queries you can run to troubleshoot deadlocks, see [Performance tuning](/docs/postgres/query-reference#performance-tuning). To learn more about deadlocks in Postgres, see [Deadlocks](/docs/current/explicit-locking.html#LOCKING-DEADLOCKS).

![Monitoring page deadlocks graph](/docs/introduction/monitor_deadlocks.png)

### Rows

The **Rows** graph shows the number of rows deleted, updated, and inserted over time for the named database on the selected branch. The named database is always the oldest database on the selected branch. These metrics are reset on a compute restart. 

![Monitoring page rows graph](/docs/introduction/monitor_rows.png)