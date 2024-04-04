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

The **CPU** graph shows the allocated CPU size CPU usage over time. CPU is measured in Compute Unit (CU) size.

![Monitoring page CPU graph](/docs/introduction/monitor_cpu.png)

### Connections count

The **Connections count** graph shows the number of idle connections, active connections, and the total number of connections over time.

![Monitoring page connections graph](/docs/introduction/monitor_connections.png)

### Buffer cache hit rate

The **Buffer cache hit rate** rate graph shows the percentage of read request served from your computes buffer cache.

![Monitoring page cache hit rate graph](/docs/introduction/monitor_cache.png)

### Database size

The **Database size** graph shows the size of your database.

![Monitoring page database size graph](/docs/introduction/monitor_data_size.png)

### Deadlocks

The **Deadlocks** graph shows a count of deadlocks over time.

![Monitoring page deadlocks graph](/docs/introduction/monitor_deadlocks.png)

### Rows

The **Rows** graph shows rows deleted, updated, and inserted.

![Monitoring page rows graph](/docs/introduction/monitor_rows.png)