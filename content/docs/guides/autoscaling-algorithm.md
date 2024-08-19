---
title: Understanding Neon’s autoscaling algorithm
subtitle: How Neon’s algorithm scales resources to match your workload
enableTableOfContents: true
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>Key metrics that drive autoscaling decisions</p>
<p>How often the algorithm checks these metrics</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/introduction/autoscaling">Introduction to autoscaling</a>
<a href="/docs/guides/autoscaling-guide">Enabling autoscaling</a>
</DocsList>
</InfoBlock>

The key concept behind autoscaling is that compute resizing happens _automatically_ — once you set up your minimum and maximum [compute sizes](/docs/manage/endpoints#how-to-size-your-compute), there’s no action required on your part other than [monitoring](/docs/introduction/monitoring-page) your usage metrics to see if adjustments are needed.

That said, it can be helpful to understand exactly when and under what circumstances the algorithm optimizes your database on two key fronts — **performance** and **efficiency**. In a nutshell, the algorithm automatically **scales up** your compute to ensure optimal performance and **scales down** to maximize efficiency.

![autoscaling algorithm](/docs/guides/autoscaling_algorithm.png)

## How the algorithm works

Neon's autoscaling algorithm uses two components, the [vm-monitor](/docs/reference/glossary#vm-monitor) and the [autoscaler-agent](/docs/reference/glossary#autoscaler-agent), to continuously monitor three key metrics: your average CPU load, your memory usage, and the activity of your [Local File Cache (LFC)](/docs/reference/glossary#local-file-cache). These metrics determine how your compute resources — the virtual machine that powers your database — should be scaled to maintain performance and efficiency.

### The Formula

In essence, the algorithm is built on **goals**. We set a goal (an ideal compute size) for each of the three key metrics:

- **`cpuGoalCU`** &#8212; Keep the 1-minute average CPU load at or below 90% of the available CPU capacity.
- **`memGoalCU`** &#8212; Keep memory usage at or below 75% of the total allocated RAM.
- **`lfcGoalCU`** &#8212; Fit your frequently accessed working set within 75% of the compute's RAM allocated to the LFC.

The formula can be expressed as:

```
goalCU := max(cpuGoalCU, memGoalCU, lfcGoalCU)
```

The algorithm selects the highest value from these goals as the overall `goalCU`, ensuring your database has enough resources to handle the most demanding metric — while staying within the minimum and maximum limits you’ve set.

### The Metrics

Let's go into a bit more detail about each metric.

#### CPU load average

The CPU load average is a measure of how much work your CPU is handling. Every 5 seconds, the autoscaler-agent checks the 1-minute load average from the virtual machine (VM) running your database. This load average reflects the average number of processes waiting to be executed by the vCPU over the previous minute.

The goal is to keep the CPU load at or below 90% of the available vCPU capacity. If the load exceeds this threshold, the algorithm increases the compute allocated to your database to handle the additional demand.

In simpler terms, if your database is working too hard, the algorithm adds more CPU power to keep things running smoothly.

#### Memory Usage

Memory usage refers to the amount of RAM your database and its related processes are using. Every 5 seconds, the autoscaler-agent checks for the latest memory metrics from inside the VM, and every 100ms the vm-monitor checks memory usage from Postgres.

The algorithm aims to keep overall memory usage at or below 75% of the total allocated memory. If your database starts using more memory than this threshold, the algorithm increases compute size to allocate more memory, making sure your database has enough RAM to perform well without over-provisioning.

#### Local File Cache (LFC) working set size

An important part of the scaling algorithm is estimating your current working set size — a subset of your most frequently accessed data — and scaling your compute to ensure it fits within the LFC.

Every 20 seconds, the autoscaler-agent checks the working set size across a variety of time windows, ranging from 1 to 60 minutes. The goal is to fit your working set within 75% of the compute’s RAM allocated to the LFC. If your working set exceeds this threshold, the algorithm increases compute size to expand the LFC, keeping frequently accessed data in memory for faster access.

<Admonition type="note">
If your dataset is small enough, you can improve performance by keeping the entire dataset in memory. Check your database size on the Monitoring [dashboard](/docs/introduction/monitoring-page#database-size) and adjust your minimum compute size accordingly. For example, a 6.4 GiB database can comfortably fit within a compute size of 2 vCPU with 8 GB of RAM (where the LFC can use up to 80% of the available RAM).
</Admonition>

## How often the metrics are polled

To give you a sense of the algorithm's responsiveness, here's a summary of how often the metrics are polled:

- **Every 5 seconds** → the autoscaler-agent fetches load metrics from the VM, including CPU usage and overall memory usage.
- **Every 20 seconds** → the autoscaler-agent checks the Local File Cache (LFC) metrics, including the working set size across various time windows: 1 minute, 2 minutes, up to 60 minutes.
- **Every 100 milliseconds** → the vm-monitor checks memory usage specifically within Postgres.

This frequent polling allows the algorithm to respond swiftly to changes in workload, ensuring that your compute resources are always appropriately scaled to meet current demands.
