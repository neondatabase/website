---
title: 'Improving Lakebase Compute Cache, Part 1'
description: >-
  Lakebase large Postgres compute nodes now run up to 2× faster and with lower
  latency by increasing the shared buffers size and backing with huge pages
excerpt: >-
  On large fixed-size Lakebase Postgres computes, we now put most of the
  machine's memory into Postgres shared buffers and back that cache with huge
  pages. Hot pages stay in DRAM instead of falling through to a local disk
  cache, so the same working set is served faster and with less CPU.
date: '2026-09-09T12:00:00'
updatedOn: '2026-09-09T13:23:00'
category: engineering
categories:
  - engineering
authors:
  - sunil-kamath
  - haoyu-huang
  - david-wein
  - em-sharnoff
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: Improving Lakebase Compute Cache, Part 1 - Neon
  description: >-
    Lakebase large Postgres compute nodes now run up to 2× faster and with lower
    latency by increasing the shared buffers size and backing with huge pages.
  keywords: []
  noindex: false
  ogTitle: Improving Lakebase Compute Cache, Part 1 - Neon
  ogDescription: >-
    Lakebase large Postgres compute nodes now run up to 2× faster and with lower
    latency by increasing the shared buffers size and backing with huge pages.
  image: null
---

<Admonition type="tip" title="TL;DR">
On large fixed-size [Lakebase Postgres](https://neon.com/docs/postgres/overview) computes, we now put most of the machine's memory into Postgres shared buffers and back that cache with huge pages. Hot pages stay in DRAM instead of falling through to a local disk cache, so the same working set is served faster and with less CPU. As a result, we're measuring up to about 2× throughput, fewer reads from the storage layer, and lower latency. This improvement is already live today on fixed-size computes at CU ≥ 80 on [Databricks](https://www.databricks.com/product/lakebase) and CU ≥ 18 on [Neon](https://neon.com/). Autoscaling computes are next (it'll be part 2 of this series).
</Admonition>

The disaggregated storage model of a lakebase provides a feature rich, flexible, low cost platform for Postgres.  Efficient caching of data is critical to provide high throughput and low latency while data is backed in an object store such as S3.

This caching takes place at two layers: in distributed storage, where Postgres pages are materialized for high write throughput and read serving; and on the Postgres compute itself to serve frequently accessed pages from DRAM for ultra fast access.

We've been hard at work making improvements to the compute side caching, and in this blog will lay out our near term plans and delve into what has already been shipped to customers.

First, some background on how we got here.

## The standard Postgres cache

Databases are famously hungry for DRAM (memory).  They primarily use this memory as a data cache and expect access to rows in the cache to be measured in nanoseconds - orders of magnitude faster than even the fastest NVMe drives.

Postgres organizes data in rows on pages, and pages actively being accessed must be loaded into a memory area known as "shared buffers". Because Postgres traditionally stores pages using the operating system's filesystem, the OS kernel will also use its flexible page cache to provide caching between Postgres shared buffers and the disk.

This shared buffers + page cache scheme works reasonably well but has some downsides and some challenges.

#### Downsides

1. Double buffering which reduces the amount of data you can effectively cache on the compute.  Consider a compute with 4 GB of RAM using 1 GB for shared buffers.  As you read pages from disk to populate the 1 GB of shared buffers, the reads go through the OS page cache, which also holds that data. You are now consuming 2 GB of RAM to cache 1 GB of data.
2. The OS page cache doesn't know anything about the shared buffers or Postgres internals, so it can't make smart decisions on which pages to replace.

#### Technical challenges

1. In a disaggregated storage system such as Lakebase, data read from storage does not travel through the OS filesystem or page cache.
2. Shared buffers is a static parameter, meaning that it is set prior to starting Postgres and cannot be changed without rebooting the database.  This is a meaningful challenge for a serverless autoscaling system such as Lakebase.
3. Postgres uses a separate operating system process for each active connection, so the larger the shared buffers - i.e. the more memory you give Postgres - the more memory management the OS must do for each and every connection, which in turn consumes memory.

## The lakebase cache path

**[ADD lakebase cache hierarchy DIAGRAM]**

Now that we've provided some background, let's talk about how we are solving them at Databricks.

**Our desired end state is to make the most efficient use of the DRAM on your compute via Postgres dynamic shared buffers that autoscale with your workload and use up to 75% of available memory.** 

We need to eventually adjust our compute platform to leverage autoscaling shared buffers, but we also want to deliver sensible incremental improvements to our customers as they become available.  Each incremental delivery allows us to confidently ship one or more pieces of the roadmap while giving real benefit to customers. So even if autoscaling computes are the goal, we started with fixed computes, as covered in the next section.   

<Admonition type="Note" title="Contributing upstream: next">
The Postgres machinery for achieving this goal has been discussed in the open source community with reasonable progress.  We've decided to collaborate in the open and accelerate delivery of this technology for the broader Postgres community. Coming soon.
</Admonition>

Here's what we implemented.

### Larger shared buffers

**[ADD Lakebase cache path diagram]**

If you recall from the technical challenges above, a disaggregated system such as Lakebase does not route its reads through the standard OS file system and its page cache.  Also recall that Postgres shared buffers are static and cannot autoscale.

To solve this we created a layer we called the local file cache (LFC). The LFC acted as a stand-in, creating an autoscaling cache that worked in tandem with shared buffers and kept as much data as possible cached on the compute. This was a clever and pragmatic solution that allowed Neon and Lakebase Postgres to launch autoscaling and has been in use on all compute since launch.

Although exposed as a single high-speed compute cache to users, the underlying architecture supports up to two tiers:

- **Shared buffers:** Postgres's in-memory shared buffer, representing the lowest-latency access path.
- **Local file cache:** An expanded secondary cache residing on the compute node's local NVMe, offering higher capacity than memory but requiring disk I/O to access a page.

Shared buffers were tuned conservatively so that they did not consume too much memory when running at minimum configured CU, with the maximum size ever configured at 1 GB of shared buffers and LFC consuming the remainder of the total compute cache capacity (up to 75% of DRAM). Any request that results in a miss across both tiers is routed from the compute node to the distributed storage layer.

On larger working sets, capping shared buffers at 1 GB forced most cache hits to pass through the slower LFC tier. The LFC has served us well, but our intent is to retire its current form as we progress towards fully dynamic shared buffers.

<Admonition type="tip" title="Fixed computes came first">
Our first delivery of larger shared buffers targets fixed-size computes, since shared buffers are not yet dynamic. On these, we now disable the LFC and set shared buffers to 75% of DRAM. This is live today for fixed-size computes with CU >= 18 (Neon) or >= 80 (Databricks). Eliminating the ~1 GB buffer cap keeps hot pages in the fastest memory layer instead of cascading down to local file storage. 
  To see if large shared buffers are enabled for your compute, run `show shared_buffers` within a Postgres connection.  An 80 CU Lakebase endpoint in Databricks should see a value of `20971520`
</Admonition>

Keeping hot data in shared buffers rather than the OS page cache also addresses the downsides described earlier. There is no double buffering, so 1 GB of cached data consumes 1 GB of RAM instead of 2 GB. And because the cache lives inside Postgres rather than the kernel, eviction decisions can be made with knowledge of database state — that positions us to pursue smarter replacement policies than the OS can offer.

Sizing shared buffers at 75% of DRAM on fixed-size computes was not as simple as making a configuration change.  That is because of the third technical challenge, the process per backend architecture. 

This next section describes our solution.

### Addressing memory and translation overhead with huge pages

Postgres uses a process-based structure in which each backend maps shared buffers into its own address space, requiring its own page table entries — the kernel-maintained structures the hardware walks to translate virtual addresses to physical memory. By default Linux does this mapping across 4 KB pages.

Some simple numbers: each 1 GB of shared buffers corresponds to 262,144 page table entries per process. At 32 GB of shared buffers and 512 backends, that is roughly 4.3 billion entries, or about 32 GB of page tables to map 32 GB of cache.

This working set also far exceeds the capacity of the Translation Lookaside Buffer (TLB), a cache in the CPU's memory management unit that speeds virtual-to-physical translation. Even a shared buffer hit then incurs a penalty from TLB misses and page table walks.

To mitigate this, the Postgres community advises using an OS mechanism named huge pages (2 MB each) with large shared buffers. Switching to huge pages reduces page table sizes by a factor of 512 and significantly lowers TLB miss rates. 

In our benchmark tests, configuring Postgres with huge pages reduced tail read latency by up to ~40% and decreased CPU utilization by up to ~30%.

### Huge page support in virtualized environments

Lakebase Postgres executes within lightweight guest virtual machines on bare-metal hosts. Memory address translation involves two virtualized layers. Capitalizing on huge pages requires a consistent implementation across the entire stack: from host-level reservation, through the hypervisor backing the VM's memory, to the guest kernel. A breakdown at any tier degrades the resulting performance benefits.

We recently introduced dedicated huge-page backing across our VM infrastructure. We chose to use explicit 2 MB HugeTLB pages rather than rely on best-effort transparent huge pages. Now, VMs allocated for large fixed-size computes initialize with a predetermined volume of huge pages sufficient for Postgres startup. To optimize system resources, compute startup automatically releases any surplus huge pages beyond those required by Postgres.

<Admonition type="tip" title="Tip">
To see if large explicit huge pages are enabled for your compute, run `show huge_pages` within a Postgres connection.  An 80 CU Lakebase endpoint should see a value of `"on"`
</Admonition>

To move beyond fixed sized computes, we've developed a protocol for autoscaling huge pages provided to the guest. Huge pages are scaled in concert with dynamic shared buffers, ensuring that we maintain efficient address translation even at high concurrency and memory sizes.

## Production results

The rollout started region by region a few weeks ago. The examples below were measured on large production endpoints after the restart that enabled the new configuration.

<Admonition type="tip" title="Tip">
If you're using Neon, the hit-rate charts are the same `Compute cache hit rate` metric you see on the Metrics tab.
</Admonition>

### Example 1: ~2× throughput, 5× fewer reads from storage

On one large endpoint, the change became active around 06:10 UTC on August 11. Accessed Postgres blocks per second doubled, which we use here as a proxy for throughput. The customer reported lower p50 and p99 latency compared with the prior day, week, and month.

**[ADD shared buffer hits & misses DIAGRAM]**

This endpoint configured a large local file cache. With larger shared buffers, the storage GetPage/s dropped from about 8K per second to about 1.5K.

**[ADD GetPage DIAGRAM]**


### Example 2: 1.3× throughput

On another large endpoint, the change became active around 01:30 UTC on August 14. Throughput rose about 43%.

**[ADD shared buffer hits & misses Aug 12-13 diagram]**

The compute cache hit rate reached nearly 100%, with requests served almost entirely from the shared buffers.

**[ADD shared buffer hit rate DIAGRAM]**

### Example 3: 5× lower CPU use, 2× higher throughput

On this workload, CPU use fell from 20 cores to 4 after the August 15 rollout. The compute cache hit rate rose to almost 100%, and the measured throughput doubled.

**[ADD CPU usage DIAGRAM]**

## Coming next: autoscaling

We are currently working to bring larger shared buffers to autoscaling Postgres computes. Autoscaling introduces additional complexity: we must dynamically expand shared buffers when scaling up and shrink them when scaling down—all while allocating the exact required volume of huge pages.

Our next post (part 2) will get into the technical details of the dynamic shared buffers implementation, including the current state of open source Postgres and the areas we've chosen to further advance the feature and contribute upstream.

## Related work: disabling full-page images

Worth mentioning that our performance optimization work extend to all compute sizes, not just large instances. Earlier this year, we [disabled Postgres full-page writes and delegated image generation to the storage tier](https://neon.com/blog/turning-off-fpw-for-faster-writes). This enhancement delivers a 94% reduction in WAL volume, up to 5× higher write throughput, and an increase from 17,000 to 62,000 rows/s on production synced-table workloads.

## Try it

All these performance improvements stem from the [lakebase architecture](https://neon.com/docs/introduction/architecture-overview). The storage layer acts as the authoritative system of record, a compute node is stateless - and its memory serves as a caching layer.

You can run Lakebase Postgres in two places — same core engine, different surroundings:

- On [Neon](https://neon.com/), as backend primitives for developers, startups, and agent platforms.
- On [Databricks](https://www.databricks.com/product/lakebase), integrated with the Data Intelligence Platform: Unity Catalog governance, lakehouse analytics, notebooks, and AI workflows.
