---
title: Lakebase Postgres is built on object storage, but 99.99999% of reads never touch it
description: >-
  The lakebase architecture prioritizes performance, serving the vast majority
  of page reads from the compute node's local cache
excerpt: >-
  The most common argument against running Postgres on object storage is that a
  Postgres backed by object storage must be a slow Postgres. The premise is
  right, but the conclusion isn't.
date: '2026-11-05T12:00:00'
updatedOn: '2026-11-04T14:07:00.000Z'
category: engineering
categories:
  - engineering
authors:
  - carlota-soto
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: Lakebase Postgres is built on object storage, but 99.99999% of reads never touch it - Neon
  description: >-
    The lakebase architecture prioritizes performance, serving the vast majority
    of page reads from the compute node's local cache
  keywords: []
  noindex: false
  ogTitle: Lakebase Postgres is built on object storage, but 99.99999% of reads never touch it - Neon
  ogDescription: >-
    The lakebase architecture prioritizes performance, serving the vast majority
    of page reads from the compute node's local cache
  image: null
---

The most common argument against running Postgres on object storage goes like this:

- Postgres processes many small, latency-sensitive reads
- Object storage is built for larger requests at higher latency, and a single read from it can take hundreds of milliseconds
- Therefore, a Postgres backed by object storage must be a slow Postgres

The premise is right, but the conclusion isn't: it assumes that a database built on object storage has to read from object storage to answer queries, and Lakebase Postgres almost never does.

<Admonition type="note" title="Get the deep dive">
This post gives you the short version of how the lakebase read path works. For the full story, read [WAL + S3: Lakebase storage for the era of agents](https://neon.com/blog/wal-s3-lakebase-storage-for-the-era-of-agents).
</Admonition>

## Let's start with some numbers

To show what we mean by "almost never," we looked at page read stats across a slice of our production fleet. [In the lakebase architecture, reads are split into tiers](https://neon.com/docs/introduction/architecture-overview#read-path-serving-data-without-object-store-latency), and every page read is served by the first tier that has the page:

- The compute's local cache serves the fastest reads, without the read ever leaving the compute node
- On a local miss, the read crosses the network to a pageserver, which serves it from its own local NVMe
- Only if the pageserver doesn't have the data locally does the read reach object storage.

Our stats showed:

- **The compute's local cache served ~1.1 billion page accesses per second, about 99.46% of the total**
- **Pageserver local NVMe served ~6 million reads per second, about 0.54% of the total**
- **Object storage served only ~39 requests per second**

Put another way:

- **The vast majority of Lakebase Postgres reads are served by the fastest tier.** 99.46% of page accesses are answered from the compute node's local cache, at memory or microsecond-level latency, the same way a traditional Postgres reads from a warm cache.
- **Reads that need the pageserver are served from NVMe.** When page accesses extend beyond the compute node, the pageserver efficiently answers them directly from its own local NVMe.
- **Reads that need object storage are rare and special case.** Only about 1 in 28 million page accesses needs a fetch from object storage, so more than 99.99999% are served without it. Reads that pass through to object storage are typically wakeups of long dormant projects, restores, or branches created in the past.

## Building on object storage doesn't mean reading from it

[Lakebase Postgres is Postgres built on object storage](https://neon.com/lakebase) since it opens the path for

- Durability: object storage like S3 is designed for 99.999999999% durability, so durable state doesn't depend on any single machine
- Cheap storage with no provisioning: storage grows with the data, with no disks to size and no risk of running out of space
- Immutable, addressable history: because history is kept as immutable layer files, [branching](https://neon.com/docs/introduction/branching) and [instant restores](https://neon.com/docs/postgres/backup-restore/branch-restore) are metadata operations and don't need data copies
- Stateless compute: durable state lives outside the compute node, so compute can [scale to zero](https://neon.com/docs/introduction/scale-to-zero) and start again without moving data
- One copy for transactions and analytics: once operational data lives in the lake, analytical engines can read the same copy through [LTAP](https://www.databricks.com/blog/lakebase-ltap-rethinking-database-storage)

When you build on object storage, speed is the part you have to design around. To keep Postgres fast on top of it, we designed the storage layer so that object storage never sits in front of a query - reads go through tiers that keep hot data in local caches, on the compute node and on the pageservers, and object storage only backs them.

Here's a closer look at how a read moves through those tiers:

## How a read moves through the lakebase

The [lakebase architecture](https://neon.com/docs/introduction/architecture-overview) decouples compute and storage for Postgres:

- **The compute layer** runs standard Postgres. It keeps hot pages in a local cache on the compute node. It holds no durable state, so it can start, stop, scale, or fail without putting data at risk.
- **The storage layer** owns correctness, durability, and history. It is built from three components:
  - **Safekeepers** replicate the WAL. A transaction is committed once a quorum of safekeepers acknowledges the record. A Paxos-based protocol handles leader election and failover.
  - **Pageservers** turn WAL into pages. They build an LSM tree on local NVMe and persist materialized history to object storage asynchronously.
  - **Object storage** holds the immutable, long-term history. It backs the pageservers, and Postgres never reads from it directly.

This architecture differs enough from conventional Postgres that [we've given it its own category: the lakebase](https://www.databricks.com/blog/what-is-a-lakebase). Lakebase Postgres, the database at the center of [the Neon backend](https://neon.com/), follows the lakebase principles.

<Admonition type="note" title="Also accessible directly from Databricks">
Lakebase Postgres runs on the same architecture on Neon and on Databricks, where it's called [Lakebase](https://www.databricks.com/product/lakebase). Everything in this post applies to both.
</Admonition>

When Lakebase Postgres needs a page,

- **It first checks the compute's local cache:** if the page is there, the read ends on the compute node, as in any Postgres with a warm cache. That's the ~1.1 billion page accesses per second
- **On a local miss, it sends** `GetPage@LSN` **to a pageserver:** the request names a page and an LSN, and the pageserver returns the page as it existed at that LSN. In almost every case, the pageserver already has the layers it needs on its own NVMe (that's the ~6 million reads per second we shared earlier)
- **Only if the pageserver doesn't have those layers locally does it fetch them from object storage.** That's the ~39 requests per second

In this design, every tier caches what it fetches from the tier below. A page returned by the pageserver lands in the compute's local cache - layers fetched from object storage land on pageserver NVMe. The cost of a deeper tier is paid once, and the next read of the same data stays local.

<Admonition type="note" title="The technical read">
For a deeper look at how pageservers organize data and serve `GetPage@LSN`, see [Deep dive into Neon storage engine](https://neon.com/blog/get-page-at-lsn).
</Admonition>

## When a read leaves the compute node: inside the pageserver

So, as we just saw, reads that leave the compute node are a small minority, and almost all of them stop at the pageserver.

The pageserver organizes data into two kinds of layer files:

- An **image layer** holds a snapshot of every page in a key range at one LSN
- A **delta layer** holds the WAL records for a key range across a range of LSNs

To answer `GetPage@LSN`, the pageserver:

1. Starts at the requested page and LSN
2. Walks down through the layers, collecting the WAL records (deltas) for that page
3. Stops at the first image of the page
4. Replays the collected deltas on top of that image and returns the result

The number of deltas applied is the measure of how much work a read takes on the pageserver. With zero deltas, the page comes straight from an image. With many, the pageserver has to replay a long chain of WAL before it can return.

This sounds like a lot of work, but it is not so much in practice. Here's data that illustrates this, across our us-east-1 fleet:

- **p90 stayed under 1 delta per** `GetPage`**.** This means most requests are served straight from an image, with no replay at all
- **p99 was around 6.** This dropped to that level after we rolled out a change that creates base pages (images) more eagerly. With images closer to the LSNs that reads ask for, fewer reads have a long chain of WAL to replay.

## The least frequent path: misses that reach object storage

Only a tiny fraction of the reads that reach a pageserver go one step further. The ~39 requests per second that reach object storage have one thing in common - they ask for data that nobody has read recently. In practice, this means one of these two cases practically every time:

- **Branches or restores at old points in time.** A [Neon branch](https://neon.com/docs/introduction/branching) is a pointer to an LSN. Point-in-time restore and snapshot restore use the same mechanism: they create a new branch at that LSN rather than rewriting the current one. When the restore point is far in the past, that history may not be on pageserver NVMe, so the first reads fetch it from object storage.
- **Inactive projects waking up after a long time sleeping.** A [Neon project](https://neon.com/docs/manage/projects) that has [scaled to zero](https://neon.com/docs/introduction/scale-to-zero) for weeks no longer has its data cached, so its first reads after waking up go to object storage.

**It's important to note how even in both these cases, only the first reads pay the cost.** After that, the data is cached in the fastest tiers, and reads follow the same local path as any active workload. In active query execution, object storage is simply not in the critical path in the lakebase.

## Wrap up

A Postgres built on object storage doesn't have to read from object storage to answer queries. In Lakebase, a read goes to the compute's local cache, then the pageserver, and every tier caches what it fetches from the one below.

Image layers keep the pageserver's replay chains short. Together, these keep object storage off the read path - more than 99.99999% of page accesses are served from local caches on compute and pageservers, which is how Lakebase Postgres gets the benefits of object storage while staying fast.

_For the full picture of the lakebase architecture, see [WAL + S3: Lakebase storage for the era of agents](https://neon.com/blog/wal-s3-lakebase-storage-for-the-era-of-agents) and [A New Era of Databases: Lakebase](https://www.databricks.com/blog/what-is-a-lakebase)._
