---
title: Separation of storage and compute without a performance tradeoff
description: How Neon uses LFC (Local File Cache) to keep reads fast
excerpt: >-
  Modern OLTP database systems such as Neon and AWS Aurora separate storage and
  compute. The main benefits of this architecture are elasticity and being
  “serverless”. Storage appears “bottomless” and compute scales up and down with
  the load. A user doesn’t need to commit to a certa...
date: '2025-07-11T17:33:25'
updatedOn: '2025-07-11T18:26:40'
category: engineering
categories:
  - engineering
authors:
  - john-spray
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/separation-of-storage-and-compute-perf/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Separation of storage and compute without a performance tradeoff - Neon
  description: How Neon uses LFC (Local File Cache) to keep reads fast
  keywords: []
  noindex: false
  ogTitle: Separation of storage and compute without a performance tradeoff - Neon
  ogDescription: >-
    Modern OLTP database systems such as Neon and AWS Aurora separate storage
    and compute. The main benefits of this architecture are elasticity and being
    “serverless”. Storage appears “bottomless” and compute scales up and down
    with the load. A user doesn’t need to commit to a certain amount of storage
    or compute and only pays for […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/separation-of-storage-and-compute-perf/social.jpg
---

Modern OLTP database systems such as Neon and AWS Aurora separate storage and compute. The main benefits of this architecture are elasticity and being “serverless”. Storage appears “bottomless” and compute scales up and down with the load. A user doesn’t need to commit to a certain amount of storage or compute and only pays for usage.

Neon compute runs Postgres, and storage is a multi-tenant key-value store for Postgres pages that is custom-built for the cloud. You can read more about [Neon architecture here](https://neon.com/docs/introduction/architecture-overview).

Traditionally, the downside of such separation is that it incurs an additional network hop from compute to storage which leads to higher latency on buffer pool misses. In this blog, we discuss how Neon’s local file cache component (LFC) allows us to have the best of both worlds: elasticity of separation of storage and compute architecture and same latency and throughput compared to running Postgres on local disks.

To get a baseline of Postgres performance you can put it in a VM with local fixed-size NVMe storage either yourself or via a database as a service vendor. Here are recent benchmarking [results](https://planetscale.com/blog/benchmarking-postgres) from Planetscale.

The downsides of a fixed-size VM with a single tier of local NVMe storage are:

- When you outgrow the fixed size disk you chose at setup time, things can break. You must plan ahead and migrate to a new instance size, [a manual process and a big step up in price](https://youtu.be/3r9PsVwGkg4?list=PLI72dgeNJtzqElnNB6sQoAn2R-F3Vqm15&t=703)
- Even if you pick the largest disk available, your database size is limited to the size of local disk available in your cloud.
- Since you need to pick a drive that’s big enough for your database & some growth, you are always paying for more storage than you’re using.
- Your instance is sized for your peak throughput, so the rest of the time you’re paying for more compute than you’re using.

Those limitations are why elastic systems like Neon are so popular: pay for only as much storage as you use, never outgrow it, and auto-scale compute based on usage.

But do you need to sacrifice performance for elasticity? The answer is no, with the introduction of a local file cache (LFC) backed by NVMe storage. With a sufficiently large LFC matching the database working set, Neon shows the same performance as overprovisioned Postgres in a VM with NVMe storage.

## Best of Both Worlds

Neon computes have a [Local File Cache](https://neon.com/docs/extensions/neon#what-is-the-local-file-cache) (LFC) – an extra caching layer between traditional postgres shared buffers and Neon storage. Shared buffers remain as a small hot cache on top of the LFC.

The LFC is a key component in Neon Autoscaling, as it is resizeable, while postgres shared buffers have a fixed size (although we’re working on making them resizable in future). The LFC leverages the linux page cache to provide RAM-like latencies up to a point, and then spills to disk when an LFC large than RAM is used.

By default, the LFC is sized to be around the size of the physical RAM on a compute node, to provide RAM-like latency (pages in the LFC are in the linux page cache) while remaining more flexible than shared buffers. However, we can easily configure a much bigger LFC and spill to disk, for workloads that benefit from a large NVMe cache between postgres and our storage backend.

<br />If we configure an LFC the same size as the database (for example, 500GB for the TPCC-like benchmark), then we provide the best of both worlds: storage remains elastic and decoupled from the compute, but there is also a hot local cache of the database on local SSD.

These large-cache configurations have been available as a Private Preview on [neon.com](https://neon.com) for select customers for some time, but only recently became publicly available as part of the Databricks Lakebase launch. We are currently working on integrating the capabilities of Lakebase and [neon.com](https://neon.com), to provide a seamless experience in every region.

## A quick note on benchmarks

We include some summarized numbers below that are based on the exact same TPCC-like benchmark [used recently](https://planetscale.com/benchmarks/neon-lakebase) by a competitor. Note that Percona, the original authors of this benchmark, **do not recommend using it in this way**, but we will use them to demonstrate the impact of LFC in this particular case.

Percona README for the benchmark used to compare read/write performance [says](https://github.com/Percona-Lab/sysbench-tpcc/commit/f110afa8023c7924b1ba00177232a9090624acb5):

<blockquote>
<p><em>This is NOT an implementation of TPCC workload. It is “TPCC-like” and uses only queries and schemas from TPCC specification. It does not respect the required “keying time”, and functions as a closed loop contention benchmark on a fixed data set, rather than an open loop benchmark that scales with the number of warehouses. It also does not respect multiple other TPCC specification requirements. </em><strong><em>Please do not use sysbench-tpcc to generate TPC-C results for comparing between vendors, or please attach a similar disclaimer as to the TPCC-like nature.</em></strong></p>
</blockquote>

So, we are using this benchmark not because it’s standard or representative of the real world usage, but because another vendor used it to evaluate Neon, and we want to demonstrate what those numbers look like with a different configuration.

## Results

So how different do things look when we enable a larger Neon’s Local File Cache on NVMe?

![Post image](https://cdn.neonapi.io/public/images/pages/blog/separation-of-storage-and-compute-perf/ad4nxfa1ppxdr8tjzjaksr2kynu6mdfaz4ztxd6oh4pqydoz5grvrn2yjoqnwcxcmjqvzwhlxxmuq1svr9r0klhrsyeqaruiyn4bcitpugkmtxqi4-fuvpcw77ecp3x3t3-6cyxsnfq-f2caa1a4.png)

**Figure 1: Comparing Neon 8CU + Large LFC (Red) with Neon 8CU baseline (Blue). Higher QPS is better, lower latency is better.**

We re-tested the Percona TPCC-like benchmark to confirm the expectation that local disk based solutions lose their advantage:

|                      | Neon + Large LFC (8CU) | Neon Defaults (8CU) | Local Disk Solution |
| -------------------- | ---------------------- | ------------------- | ------------------- |
| Local space required | 500GB                  | 0Gb                 | 929GB               |
| QPS                  | 17,030                 | 12,512              | ~18,000\*           |
| p99 latency (ms)     | 384                    | 593                 | ~330ms\*            |

_\* Approximate values from third party testing_

As you can see, Neon achieves around the same QPS with half as much high performance local NVMe required as the local disk solution – because our system can be configured to arbitrary cache sizes, our users do not have to bear the cost of buying the “next size up” from a menu of fixed disk sizes.

So have we given up our elasticity in order to achieve lower latency reads from local disk? No! The size of the cache is flexible, it doesn’t have to match the total database size. A 500GB Postgres database on EC2 can’t use a 500GB drive, you need to take the size of the database and then count up to the next disk size available. But Neon has a choice: we can size the LFC for the _working set_ rather than the full database – in subsequent testing, we also tested a 180GB LFC instead of 500GB, and only lost ~10% of peak QPS (that 180GB size came from [smart runtime estimation](https://neon.com/blog/dynamically-estimating-and-scaling-postgres-working-set-size) of the working set size).

## What’s Next?

Performance is a journey, and we’re never done. In this post we’ve explained how the Lakebase architecture delivers the best of both worlds when we enable our local SSD cache for workloads that are highly sensitive to read latency.

In future posts:

- Look out for updates to our product range that extend the availability of computes with larger local SSD caches.
- Look out for future posts where we’ll describe in more detail how we’re building the next generation of our local file cache, with finer grained caching and more efficient memory management.
