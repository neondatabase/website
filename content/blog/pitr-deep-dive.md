---
title: A Deep Dive Into Neon’s Instant PITR
description: How our storage model enables instant restores even at multi-TB scale
excerpt: >-
  Our instant restore feature is a favorite with customers managing
  multi-terabyte databases—it gives them peace of mind knowing they can recover
  everything instantly to any point in time if something goes wrong. Most
  Postgres services offer PITR, but Neon’s implementation is uniqu...
date: '2025-03-26T01:52:56'
updatedOn: '2025-04-02T00:32:35'
category: engineering
categories:
  - engineering
  - workflows
authors:
  - carlota-soto
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/pitr-deep-dive/cover.jpg'
  alt: null
isFeatured: false
seo:
  title: A Deep Dive Into Neon’s Instant PITR - Neon
  description: >-
    We’ll take a deep dive into how instant restores work in Neon, exploring the
    architecture that enables it and how it differs from others.
  keywords: []
  noindex: false
  ogTitle: A Deep Dive Into Neon’s Instant PITR - Neon
  ogDescription: >-
    We’ll take a deep dive into how instant restores work in Neon, exploring the
    architecture that enables it and how it differs from others.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/pitr-deep-dive/social.jpg'
source:
  wpId: 8957
  wpSlug: pitr-deep-dive
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/pitr-deep-dive/neon-pitr-1-1024x576-2265889e.jpg)

Our [instant restore feature](https://neon.tech/blog/recover-large-postgres-databases) is a favorite with customers managing multi-terabyte databases—it gives them peace of mind knowing they can recover everything instantly to any point in time if something goes wrong. Most Postgres services offer PITR, but Neon’s implementation is unique—designed around its architecture and novel approach to storage.

In this post, we’ll take a technical deep dive into how instant PITR works in Neon, exploring the architecture that enables it and how it differs from other implementations.

<Admonition type="important" title="disclaimer">
You don’t need to know any of this to take advantage of Neon’s PITR. Restores are extremely easy to run in Neon—see [this blog post](https://neon.tech/blog/outage-simulator) if you’d rather jump straight into a demo.
</Admonition>

## A refresher on the Neon architecture

As we just mentioned, Neon’s instant restores are possible due to its unique design, particularly its storage architecture. Before diving into the PITR mechanism, let’s review a few key design principles that are essential to understanding the restore process.

At a high level, Neon’s architecture is built on the [separation of compute and storage](https://neon.tech/blog/architecture-decisions-in-neon), orchestrated by a control plane that manages cloud resources across both layers.

Unlike traditional Postgres setups, where each compute instance controls its own storage, Neon’s compute nodes run Postgres without local persistence. In Neon, all reads and writes go through a [multi-tenant storage system](https://neon.tech/blog/get-page-at-lsn), keeping compute nodes ephemeral.

### Neon’s storage system

Neon’s multi-tenant storage system is designed for high availability, durability, and efficient data retrieval, with [redundancy across multiple availability zones (AZs)](https://neon.tech/docs/introduction/high-availability) to ensure fault tolerance. It consists of three key components:

- **WAL safekeepers**: A durable write buffer that receives WAL records from compute nodes, replicates them across multiple nodes for fault tolerance, and ensures transactions are safely persisted before being processed by the pageserver.
- **Pageservers**: The engine that reconstructs database pages on demand by applying WAL changes to historical snapshots, serving reads efficiently, and caching frequently accessed data for performance.
- **Cloud object storage**: The long-term archive where immutable WAL segments and database snapshots are stored.

These three components work together behind the scenes in Neon, even though for the most part, the end-user experience remains equivalent to running Postgres on traditional monolithic infrastructure (e.g. EC2/EBS).

But instead of persisting data locally, Neon’s compute nodes stream WAL records to safekeepers, which ensure durability through quorum writes before forwarding WAL to pageservers. Pageservers then reconstruct and serve database pages on demand, using a combination of WAL-based delta layers and periodic image snapshots, all of which are efficiently stored in cloud object storage for long-term retention.

![Image](https://cdn.neonapi.io/public/images/pages/blog/pitr-deep-dive/screenshot-2025-03-25-at-62152percente2percent80percentafpm-1024x718-61c2e772.png)

Let’s describe this flow in more detail. In particular, the concept of the **Log Sequence Number (LSN)**, introduced below, will be key to understanding how Neon’s restore mechanism works.

### Step 1: WAL safekeepers capture all data changes

Safekeepers act as a highly reliable write buffer for data updates. When a Neon compute node writes data, it streams WAL records to multiple safekeeper nodes. These safekeepers store WAL until the pageserver has processed it and uploaded it to object storage (see next steps).

To prevent data loss, safekeepers use a Paxos-based consensus mechanism, ensuring that a WAL record is considered safe only when a majority of safekeepers have stored it. For long-term durability, WAL records are also asynchronously pushed to object storage.

#### Step 2: Pageservers organize and serve data

Pageservers process incoming WAL data and store database pages in a format optimized for fast access, serving as a read cache by keeping frequently accessed data locally on SSDs/NVMe for faster performance.

Beyond their role as a cache, pageservers are the core of Neon’s storage system. Unlike traditional Postgres storage, Neon follows a **non-overwriting, copy-on-write model**, which is key to enabling instant restores. In Neon, new changes are appended rather than modifying existing data, making historical versions easily accessible. Pageservers can retrieve not only the current version of the database _but also all past versions._

**This leads us to the concept of LSN.** Every data change in Neon is assigned a Log Sequence Number (or LSN), a monotonically increasing identifier representing a specific position in the WAL stream. When a page is requested at a past state, the pageserver:

1. Retrieves the latest image layer before that LSN
2. Applies any delta layers up to the target LSN
3. Returns the reconstructed page as it existed at that exact point in time.

LSNs allow Neon to reconstruct the exact database state at any given moment _very quickly_. This is the essence of PITR in Neon, as we’ll see down below.

#### Step 3: Object storage preserves all history long-term

Once data is processed by the pageserver, it is uploaded to object storage (e.g., Amazon S3) for long-term durability. Object storage provides Neon with essential scalability and reliability, leveraging the scale capacity of object stores along with their 99.999999999% durability.

## Mechanics of PITR in Neon

Now, let’s break down what actually happens when you run a restore in Neon.

Instead of triggering a traditional restore process, when you trigger PITR, Neon creates a new _branch_ of the database at a specific LSN, instantly making the restored state available. The workflow looks like this:

1. A user specifies a precise timestamp for recovery (e.g., the exact moment before a corruption event)
2. Neon’s control plane translates the timestamp into the corresponding WAL position: the LSN
3. A new branch is created at that LSN by the pageserver, which dynamically reconstructs the database state as it was at that moment using the function [GetPage@LSN](https://www.google.com/search?client=safari&rls=en&q=GetPage%40LSN&ie=UTF-8&oe=UTF-8).

No data is truly “copied”; the branch simply references existing storage layers up to that point, retrieved by pageservers either from cache (for recent changes) or object storage (for older history).

![Image](https://cdn.neonapi.io/public/images/pages/blog/pitr-deep-dive/screenshot-2025-03-25-at-65227percente2percent80percentafpm-1024x826-fcbca286.png)

The result is a “restored branch”. This is logically equivalent to a restored instance in other Postgres services, except no data needs to be “copied” to a new Postgres instance.

This eliminates hours of restore time and expensive compute operations. Users can immediately switch to the restored branch if they wish or trigger other [recovery mechanisms](https://neon.tech/blog/recover-production-database), such as selectively retrieving and restoring corrupted data back into the original branch, depending on their specific needs.

## How Neon’s PITR differs from traditional restore processes (e.g., AWS RDS)

If you’ve made it this far into this blog post, you already have an intuitive understanding of how Neon’s PITR is fundamentally different from traditional database restore mechanisms such as those used in AWS RDS. Neon’s architecture and storage design is what makes this branch-based approach possible, something that could never be replicated in a system like RDS.

[This blog post provides an in-depth comparison between recovering a large database in Neon vs. AWS RDS.](https://neon.tech/blog/recover-large-postgres-databases) But from a practical perspective, the core difference can be summarized as follows:

**Neon’s process is instant and requires no data copying.** Instead of restoring a new database instance, Neon can create a branch at a specific timestamp, referencing existing storage layers without copying any data.

**This process completes in less than a second, regardless of how much data is stored—a massive advantage at scale.** Restoring in RDS requires creating an entirely new database instance, loading the latest snapshot into that instance, and replaying WAL logs up to the recovery point. This is a slow and resource-intensive process, and it can take hours for multi-TB databases. In Neon, it’s typically less than a second.

![Image](https://cdn.neonapi.io/public/images/pages/blog/pitr-deep-dive/screenshot-2025-03-25-at-65135percente2percent80percentafpm-1024x585-65bdb89c.png)

1.

## Conclusion

Neon’s PITR design introduces a new paradigm for how Postgres restores work. It offers a faster, more efficient alternative to traditional solutions like AWS RDS by leveraging a copy-on-write storage model.

Don’t just take our word for it: try it yourself. [Sign up for Neon using this link and get $100 in credits](https://fyi.neon.tech/credits) to test our instant PITR—and see how much time and costs you can save.
