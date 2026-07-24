---
title: Our Approach to High Availability
description: HA is not an add-on but a fundamental design choice
excerpt: >-
  The expression “high availability” (or HA) is used in managed databases to
  refer to the system’s ability to remain operational and accessible “for a high
  percentage of time,” even in the event of failures. But yes, you’re guessing
  it right—there’s no universal definition for what...
date: '2024-10-25T16:16:59'
updatedOn: '2024-10-25T22:53:47'
category: engineering
categories:
  - engineering
  - company
authors:
  - anna-stepanyan
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/our-approach-to-high-availability/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Our Approach to High Availability - Neon
  description: >-
    In Neon, high availability isn't an add-on but a design choice. Our
    architecture is resilient to both compute and storage failures.
  keywords: []
  noindex: false
  ogTitle: Our Approach to High Availability - Neon
  ogDescription: >-
    In Neon, high availability isn't an add-on but a design choice. Our
    architecture is resilient to both compute and storage failures.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/our-approach-to-high-availability/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/our-approach-to-high-availability/neon-high-availability-1-1024x576-3898833c.jpg)

The expression “high availability” (or HA) is used in managed databases to refer to the system’s ability to remain operational and accessible “for a high percentage of time,” even in the event of failures.

But yes, you’re guessing it right—there’s no universal definition for what percentage qualifies as highly available. The exact definition depends on the vendor and the service.

Despite this ambiguity, the concept of high availability is crucial. One of the inherent promises of managed databases is that they’re exactly that—managed—and users want to know what the provider’s plan is to prevent issues. In this blog post, we’ll discuss how we approach high availability at Neon.

## High availability in an architecture with separated storage and compute

To understand how Neon stays highly available, let’s start by mapping the types of failures that might cause your database to go down. [Neon natively separates storage and compute](https://neon.tech/blog/architecture-decisions-in-neon), so in a given database, there are primarily two components that can experience failures: compute and storage. Each can potentially cause a loss of availability, but they affect the system in different ways.

In Neon, “compute” refers to the stateless processing nodes that handle database operations. A **compute failure** could happen due to a crash or malfunction of the Postgres process, or due to VM crashes from hardware issues, a kernel panic, or the termination of the host machine.

Neon’s storage [is designed to be independent of the compute layer](https://neon.tech/blog/what-you-get-when-you-think-of-postgres-storage-as-a-transaction-journal), and it is responsible for persisting the actual data via Write-Ahead Logs (WAL records). A **storage failure** could result from issues with the distributed storage service, such as network connectivity problems, failure of a Safekeeper responsible for WAL replication, or a Pageserver malfunction.

So, what does Neon do to solve these issues?

## How Neon stays highly available: the TL;DR

**In Neon, compute failures can be resolved quickly.** Since compute nodes in Neon are stateless, most issues can be addressed by immediately provisioning a new compute node. The queries being processed at the time of failure may be interrupted, but the expected downtime typically ends there.

**In terms of storage, Neon’s custom-built design offers not just redundancy, but also ultra-high durability through the use of cloud object storage.** [Neon’s architecture automatically replicates and distributes data across multiple nodes for failure tolerance](https://neon.tech/blog/get-page-at-lsn), always keeping a full data copy on object storage.

If you want the long story, keep reading.

## How Neon solves compute failures

<Admonition type="info" title="The key">
Independently of the compute failure origin, Neon resolves it quickly—typically within a few seconds, without any action needed from you.
</Admonition>

In Neon, the compute endpoint acts as a flexible connection point. It’s not permanently tied to any specific resource but can be dynamically reassigned to different compute instances as needed. When you connect to your database, Neon assigns a pre-provisioned VM from its pool and attaches your compute endpoint to this instance. The connection string remains the same, ensuring a seamless user experience even during failover scenarios.

### Handling Postgres failures

This is the most common type of compute failure. Postgres operates within the compute node VM. If Postgres crashes, Neon’s internal processes immediately detect the issue and automatically restart Postgres. This recovery typically completes within a few seconds without requiring any user intervention.

![Image](https://cdn.neonapi.io/public/images/pages/blog/our-approach-to-high-availability/ad4nxdbgpdqnlpgn3bqv8ymgnwci2hl5k8ne-ikeuq5eewel-zsynpqadlxlzjx-alcvsmhbpjaigjh6pv7y0kjwyfqoivjcesxo7ywjuurcuszola6ruzxoziwz9d9zul0abw4cocpdwhfml9l2lmk2usk-73b44027.png)

### VM failures and recovery

This is a rarer situation, but the entire VM hosting Postgres might sometimes fail due to hardware issues, a kernel panic, or the termination of the host machine. When this happens, Neon recreates the VM and reattaches your compute endpoint to the new instance. While this process may take slightly longer than a simple Postgres restart, it is still typically resolved within seconds.

![Image](https://cdn.neonapi.io/public/images/pages/blog/our-approach-to-high-availability/ad4nxeoxxae-g0v-ndpbmntbmmh6tmikdbgclzozjtgtjfqs1qivibtjie5uvshu8pykiqqn1igx0ckgh0mtcx1ixicai4uqor3pgtoc6vnslh7dk0v8suxbqlwbjteafifhnm9evrs1d5pgewjjyfczpfp06-d4862ba6.png)

##

## Why Neon storage is highly available by default

<Admonition type="info" title="The key">
Neon’s storage is highly available by design. It distributes its storage components across multiple Availability Zones (AZs) for fault tolerance, and it provides the ultra-high durability of object storage—your data is always protected.
</Admonition>

Neon’s storage layer is designed with high availability and fault tolerance as core principles. By distributing critical storage components across multiple AZs, Neon ensures both data durability and operational continuity.

Neon’s storage architecture consists of multiple distributed components—**Safekeepers**, **Pageservers**, and **cloud object storage**. Each component plays a distinct role in maintaining data consistency, availability, and durability:

- **Safekeepers** handle Write-Ahead Log (WAL) replication with redundancy across multiple AZs.
- **Pageservers** act as a fast-access disk cache for compute, ingesting data from WAL and storing frequently accessed pages. Pageservers maintain redundant copies of project data to ensure fast recovery from cache failures.
- **Cloud object storage** serves as the long-term, highly durable storage.

### Safekeepers: WAL Replication Across AZs

WAL is critical for maintaining the consistency of Neon databases, as it records every change made to the data before committing the change. Safekeepers distribute and replicate the WAL across several AZs, ensuring that even if a single AZ or Safekeeper fails, your data is still safe and recoverable from the remaining Safekeepers.

If a Safekeeper fails, the system automatically redirects the WAL to the remaining active Safekeepers, maintaining uninterrupted data logging.

### Pageservers: Disk cache for fast data access

Pageservers act as high-performance disk caches, enabling fast access to frequently used data. They index the data from the WAL, which is ingested by Safekeepers, save it to object storage, and then serve it quickly to the compute layer. Safekeepers, in this process, serve as intermediaries between Pageservers and compute nodes, ensuring that the data flows efficiently through the system without directly interacting with slower, long-term object storage.

To ensure high availability, Neon runs secondary Pageservers that maintain synchronized copies of the project’s data. If the primary Pageserver fails, the affected project is seamlessly reassigned to a secondary Pageserver. The platform constantly monitors the health of Pageservers, enabling quick detection of any failures and facilitating automated failover with minimal disruption.

### Object storage: Long-term data durability

The primary copy of all data resides in cloud object storage, which provides ultra-high durability (99.999999999%). While Pageservers cache data for fast access, **the full, long-term copy of your data is stored in object storage in the cloud.** Even in the (very unlikely) event of both a Safekeeper and a Pageserver failure, your data remains safe and recoverable.

## Conclusion

Everyone’s approach to high availability is different. Other vendors opt to build HA systems only for their more expensive plans, but Neon has the advantage of high availability built directly into its architecture. By keeping compute nodes ephemeral, a new one can quickly be spun up in the event of a failure, without any impact on data. And Neon’s storage design includes multi-tenant redundancy and the ultra-high durability of object storage.**This is true for all our plans, including Free databases.** If you don’t have an account yet, [get started today.](https://console.neon.tech/signup)
