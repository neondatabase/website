---
title: Autoscaling Lakebase Postgres
description: A deep dive into how we scale Postgres in real time
excerpt: >-
  Choosing a database instance size before you know the workload is an old
  building pattern. Lakebase Postgres omits the sizing experience altogether
  thanks to autoscaling.
date: '2026-08-31T12:00:00'
updatedOn: '2026-08-29T14:11:00'
category: engineering
categories:
  - engineering
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/autoscaling-lakebase-postgres/cover.jpg
  alt: The post title beside a compute chart labeled autoscaling active, showing a
    live resize from 4 CU to 8 CU that keeps connections open and Postgres online
isFeatured: false
seo:
  title: Autoscaling Lakebase Postgres - Neon
  description: A deep dive into how we scale Postgres in real time
  keywords: []
  noindex: false
  ogTitle: Autoscaling Lakebase Postgres - Neon
  ogDescription: A deep dive into how we scale Postgres in real time
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/autoscaling-lakebase-postgres/cover.jpg
---

Choosing a database instance size before you know the workload is an old building pattern. The process is generally wonky and feels very wasteful of compute, especially [now that compute is becoming a luxury](https://www.reuters.com/technology/openai-projects-50-billion-spending-computing-power-this-year-brockman-says-2026-05-05/).

Lakebase Postgres, the [Neon database](https://neon.com/docs/postgres/overview), omits the sizing experience altogether thanks to autoscaling. [The average production database on Neon changes compute size 32,016 times per month](https://neon.com/autoscaling-report), or about once every 81 seconds. That autoscaling responsiveness comes from in-place VM resizing and an algorithm that tracks CPU, memory, and the database’s working set.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/autoscaling-lakebase-postgres/autoscaling-sample-hour.png" alt="Provisioned compute units for a sample of Lakebase Postgres databases over one hour, each line rising and falling between 0 and 8 CU" />
<figcaption><em>How autoscaling looks like for an arbitrary sample of Lakebase Postgres databases. Note that this is only one hour.</em></figcaption>
</figure>

## The architectural requirement

Our autoscaling implementation is rooted on the [lakebase architecture](https://neon.com/docs/introduction/architecture-overview). Traditional Postgres runs as a stateful process tied to a machine and its disks; replacing or resizing that machine is a database operation because the machine owns both execution and durable state. But Lakebase Postgres separates those responsibilities:

- The compute layer runs Postgres and executes queries. It uses RAM and local NVMe for low-latency access, and owns no durable state.
- The storage layer owns durability and history. WAL is replicated by safekeepers running on SSDs, pageservers (also SSDs) reconstruct page versions, and object storage keeps the long-term immutable record. *(This blog post focuses on compute, but [we wrote a deep dive on the storage piece](https://neon.com/blog/wal-s3-lakebase-storage-for-the-era-of-agents) if you are also interested.)*

A compute node can therefore start, stop, move, or change size without moving the database underneath it. This is an essential foundation.

![An ephemeral compute node, holding shared_buffers in RAM and a performance cache on NVMe, reads pages from and writes WAL to a durable storage layer of pageservers, safekeepers, and object storage](https://cdn.neonapi.io/public/images/pages/blog/autoscaling-lakebase-postgres/compute-storage-architecture.png)

Now, when it comes to implementing autoscaling, there are two parts to the story: first, one has to determine when to adjust capacity up and down, and second, how to do it without stopping Postgres.

Let's cover both in order.

## Part I: The algorithm

### The three autoscaling signals

To deduce when to resize, the Lakebase Postgres autoscaling algorithm tracks three signals, with each signal producing its own target compute size:

- CPU load: `cpuGoalCU`
- Memory use: `memGoalCU`
- Compute-cache working set size: `lfcGoalCU`

The final scaling target is the largest of the three, [constrained to the minimum and maximum compute sizes that the user has configured for that database (the autoscaling limits)](https://neon.com/docs/introduction/autoscaling#configuring-autoscaling):

```
goalCU = max(cpuGoalCU, memGoalCU, lfcGoalCU)
```

### CPU (cpuGoalCU)

CPU is the most straightforward of the three signals. The algorithm keeps a close watch on how hard the processor is working:

- Every **five seconds**, the autoscaler-agent reads the **VM’s one-minute CPU load average**.
- The CPU goal aims to keep that load at or below 90% of available CPU capacity.
- When the load rises above that target, cpuGoalCU increases. When sustained load falls, the goal falls with it.

Using a one-minute average filters very short fluctuations while still responding to meaningful changes in demand. The five-second polling interval lets the system update the target as that average moves.

CPU alone, however, is not enough to autoscale Postgres properly. A query waiting for data to arrive over the network can show low CPU use while performing poorly. The algorithm also needs to account for memory and cache pressure.

### Memory (memGoalCU)

Memory has a different failure mode from CPU. If demand briefly exceeds the available CPU, queries become slower; but if Postgres allocates more memory than the VM has, the kernel can terminate processes. The autoscaler therefore needs a much faster signal than CPU for memory exhaustion.

So the system watches memory at two frequencies:

- Every **five seconds**, the autoscaler-agent reads **overall memory metrics from the VM**.
- Every **100 milliseconds**, the vm-monitor checks **memory used by Postgres**.

The memory goal keeps use below 75% of allocated RAM. That headroom gives the system space to respond to new allocations and leaves memory for the guest operating system and other processes.

The vm-monitor also checks every proposed downscale. Memory cannot be removed if doing so would leave the running processes without enough space.

<Admonition type="note" title="A bit of history">
This polling approach replaced an earlier design based on the cgroup `memory.high` event. Crossing `memory.high` caused Linux to reclaim memory and throttle the processes inside the cgroup. Polling proved more predictable and stable while still giving the system a 100-millisecond view of Postgres memory.
</Admonition>

### The compute cache (lfcGoalCU)

The third signal measures whether the workload’s active data fits close to Postgres. The high level story is this:

Lakebase Postgres separates storage and compute; when a page is not available locally, the compute requests it from the pageserver; the returned page is cached for subsequent reads. The compute cache, which we originally called the Local File Cache or (LFC), is a disk-backed cache sized to fit in the kernel page cache. It acts as a resizable extension of Postgres shared buffers. When a compute grows, the vm-monitor expands the cache to use part of the added memory.

For many OLTP workloads, performance changes sharply once the working set fits in local memory. This exposes a blind spot in CPU-only autoscaling: cache misses leave queries waiting on network requests, which reduces CPU use. The system may therefore see low CPU pressure at the exact moment when a larger cache would improve performance. So in Lakebase Postgres, there’s a third autoscaling signal that estimates the Postgres working set directly.

This is the most interesting part of the algorithm, so let’s look at how that estimate works.

### Zooming in: how we estimate the Postgres working set

A workload’s working set is the set of database and index pages it accesses repeatedly over a given period. To exactly count every page for the purpose of autoscaling would require too much memory, so the classic way to solve for this is to rely on [HyperLogLog](https://en.wikipedia.org/wiki/HyperLogLog), a probabilistic cardinality estimator that can estimate the number of distinct items in a set using a small, fixed amount of state.

For each Postgres page access, a standard HyperLogLog implementation,

- Hashes the page identifier.
- Uses the first bits of the hash to select a register.
- Counts the leading zeroes in the remaining bits.
- Updates the selected register if this observation exceeds its previous value.

The distribution of those register values would provide an estimate of how many distinct pages have been observed.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/autoscaling-lakebase-postgres/hyperloglog-standard.png" alt="A hash of a page identifier selects register index 1, and the remaining bits set that register to 1" />
<figcaption><em>Standard HyperLogLog</em></figcaption>
</figure>

However, there’s an issue with simply using HyerLogLog for autoscaling: a standard HyperLogLog only grows. Once a register has observed a value, it cannot tell which item produced it or when that item was last seen.

That makes it good at answering, “How many distinct pages has this compute accessed since Postgres started?” But autoscaling needs a different answer, closer to “How many distinct pages belong to the workload running now?”

Without a time boundary, an old import or analytical query would remain in the estimate and keep the compute oversized long after that work ended. So we changed what the HyperLogLog registers store.

### Adding time to HyperLogLog

This is how things actually work in Lakebase Postgres:

Instead of setting a bit when a hash is observed, the estimator stores the current timestamp at that position. To estimate cardinality since time T, it treats positions updated after T as set and older positions as unset.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/autoscaling-lakebase-postgres/hyperloglog-timestamps.png" alt="The same register array stores timestamps instead of bits, with register index 1 updated to 03:00" />
<figcaption><em>Modified HyperLogLog in Lakebase Postgres autoscaling</em></figcaption>
</figure>

This produces an estimate for any window ending at the present, including

- Distinct pages accessed in the last minute
- Distinct pages accessed in the last five minutes
- Distinct pages accessed in the last hour

So, going back to the algorithm, this is how the granularity actually works: **every 20 seconds**, the autoscaler-agent collects **working-set estimates for windows from one to 60 minutes**.

But the story does not end here. As surely you’re noticing, this is a wide time window. How do we actually choose it?

### Choosing the working set time window

The problem is this: there is no universal window that describes a database’s current working set. If we pick a short window, the autoscaling engine responds quickly when a workload ends, but it would discard cache too aggressively between bursts. If we pick a long window, the algorithm would protect the cache, but it would also keep memory allocated for work that is no longer running.

The algorithm solves this by looking at how the working set changes overtime. For example: for a steady workload, the estimated number of pages initially grows, and then levels off. Extending the window adds time, but few new pages are added, because the same working set is being accessed repeatedly.

![Working set size plotted against HLL window duration: the lighter current workload grows and levels off, then the estimate jumps once the window reaches the older heavy workload](https://cdn.neonapi.io/public/images/pages/blog/autoscaling-lakebase-postgres/working-set-plateau-and-jump.png)

Now, consider a heavy workload that ended recently. Short windows contain only the current, lighter workload; but once the window reaches far enough into the past to include the previous workload, the estimate jumps. The algorithm searches for that jump, which marks the end of the current plateau.

![A search beginning at the five-minute window finds no sharp jump in the curve and falls back to the estimate from the longest window](https://cdn.neonapi.io/public/images/pages/blog/autoscaling-lakebase-postgres/working-set-window-search.png)

In short, 

```text
start after the initial downscale delay

for each working-set window:
    measure growth before this point
    measure growth after this point

    if later growth is much larger than earlier growth:
        return the estimate before the jump

return the estimate from the 60-minute window
```

The implementation starts its search after five minutes. This prevents the compute from shrinking immediately during a short pause and then regrowing for the next burst. But if the algorithm finds no sharp increase, it uses the 60-minute estimate - that is the expected result for a stable workload whose working set remains active throughout the hour.

![A short plateau for the lighter workload ends just after the five-minute mark, where a sharp jump to the older heavy workload begins](https://cdn.neonapi.io/public/images/pages/blog/autoscaling-lakebase-postgres/working-set-jump-detected.png)

### Projecting cache growth

There’s one last piece to it. Measuring the current working set lands slightly too late: suppose a workload begins scanning a new set of pages. If the compute cache grows only after those pages have been read, early pages may already have been evicted to make room for later ones. The cache then has to fetch some of the same data again.

So the algorithm also projects working-set growth forward. It examines how the estimate increases from one duration to the next and allocates enough cache for the working set expected by the next control interval.

Because cache metrics are fetched every 20 seconds, the projection covers only a fraction of a minute. Longer projections would react earlier, but they would also amplify brief spikes and make the compute oscillate.

![The measured working set curve extended by a dashed projection to the size expected by the next control interval](https://cdn.neonapi.io/public/images/pages/blog/autoscaling-lakebase-postgres/working-set-projection.png)

The projected size becomes `lfcGoalCU`. And the algorithmic goal is to fit the working set within the portion of memory available to the compute cache, up to 75% of the compute’s RAM.

## Part II: Resizing the running compute

To recap: the scaling target was,

```
goalCU = max(cpuGoalCU, memGoalCU, lfcGoalCU)
```

Those three signals tell the system what size to aim for. Applying that size means changing CPU and memory on a running VM without interrupting Postgres.

Each Postgres instance in Lakebase Postgres runs inside its own virtual machine in a Kubernetes cluster. We use VMs because they provide a strong isolation boundary and, unlike a conventional container allocation, allow CPU and memory to be added to or removed from a running guest.

Four components coordinate each compute resize:

- The **autoscaler-agent** runs on every Kubernetes node. It collects metrics from the Postgres VMs on that node, calculates target sizes, and initiates scaling.
- The **vm-monitor** runs inside each VM. It watches Postgres memory closely, validates downscaling requests, and resizes the compute cache.
- A **modified Kubernetes scheduler** maintains the global view of available resources. Every upscale must be approved by the scheduler before memory is committed.
- **NeonVM** applies the change. It is a custom Kubernetes resource and controller, built with QEMU and KVM, that can add or remove CPU and memory from a running VM.

![Inside a Kubernetes node, the autoscaler-agent exchanges metrics and scaling requests with a vm-monitor running beside Postgres in each VM, and coordinates with the modified K8s scheduler and NeonVM](https://cdn.neonapi.io/public/images/pages/blog/autoscaling-lakebase-postgres/autoscaling-components.png)

### Scaling up

As we just saw, scaling up happens when one of the three goals calls for more compute than the VM currently has. An upscale follows this sequence:

1. The autoscaler-agent calculates the new target from the CPU, memory, and working-set goals.
2. The Kubernetes scheduler checks whether the node can satisfy the request without overcommitting memory.
3. Once approved, the autoscaler-agent updates the NeonVM resource.
4. The NeonVM controller adds CPU and memory to the running VM.
5. The vm-monitor expands the compute cache to use the new capacity.

The scheduler is the single source of truth for allocation. It sees both ordinary Kubernetes scheduling and autoscaling requests. Without that coordination, the scheduler could place a new workload on a node at the same moment the autoscaler committed the remaining memory to a Postgres VM.

If a node is too full to grow in place, NeonVM can live-migrate the VM to another node. The VM keeps its IP address, so existing connections stay open. Lakebase Postgres computes have little durable local state to move, so migration is mostly VM memory and runtime state.

### Scaling down

A downscale uses the exact same components, with one extra check inside the VM. The vm-monitor confirms that removing memory will still leave enough for Postgres and the rest of the guest. If it would not, the downscale does not proceed.

<Admonition type="note" title="Scaling down counts as much as scaling up">
Some autoscaling systems are quick to add capacity but slow to give it back, leaving databases oversized long after a spike has passed. Lakebase Postgres treats both directions the same way. The goal is to track the workload as closely as possible moment to moment, so you stop paying for capacity as soon as you stop needing it.
</Admonition>

## Wrap up

Lakebase Postgres watches the workload as it runs and resizes compute to match in real time. The lakebase architecture makes this possible: since storage is decoupled and durable on its own, compute is free to move without worrying about the data.

![CPU load, memory, and working set each produce a target compute size, combined as goalCU equals the maximum of the three and clamped to the configured autoscaling limits](https://cdn.neonapi.io/public/images/pages/blog/autoscaling-lakebase-postgres/autoscaling-algorithm-overview.png)

The resulting system scales in both directions, on a live database, without dropping connections. Most importantly, it looks past the obvious signal: tracking CPU alone would miss a workload stalled on cache misses, so the algorithm also tracks memory pressure and a time-aware estimate of the working set.

The final loop runs at three timescales:

- 100 milliseconds: the vm-monitor checks Postgres memory to catch rapid allocation
- 5 seconds: the autoscaler-agent reads CPU and overall memory
- 20 seconds: the autoscaler-agent evaluates working-set estimates across windows from one to 60 minutes

That is how a production database can change size more than [32,000 times per month](https://neon.com/autoscaling-report).

As compute gets more expensive and more contested, paying for a peak you rarely reach is a building pattern that might not be possible very soon. Autoscaling prepares Postgres for workloads where wasted compute is not an option.

## Run it

Lakebase Postgres runs in two places, on the same infrastructure and with the same core feature set. What differs is what surrounds it:

- On Neon, it anchors a complete set of cloud backend primitives for developers, startups, and agent platforms
- On Databricks, it is integrated with the rest of the Data Intelligence Platform: Unity Catalog governance, lakehouse analytics, notebooks, and AI workflows

Ask your agent to deploy either of those, and put autoscaling to the test.
