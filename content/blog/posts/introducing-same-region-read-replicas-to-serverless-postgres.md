---
title: Introducing Same-Region Read Replicas to Serverless Postgres
description: Unlocking database efficiency and scalability
excerpt: >-
  Today, we are excited to introduce same-region read replicas to Neon’s
  serverless architecture, an important milestone in achieving global
  replication. To start using Neon’s read replicas, you’ll need to sign up for
  Neon’s Pro plan. You can create a read replica on the Neon conso...
date: '2023-07-11T11:37:53'
updatedOn: '2025-10-14T06:31:52'
category: community
categories:
  - community
authors:
  - raouf-chebri
  - daniel-price
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/introducing-same-region-read-replicas-to-serverless-postgres/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Introducing Same-Region Read Replicas to Serverless Postgres - Neon
  description: Unlocking database efficiency and scalability
  keywords: []
  noindex: false
  ogTitle: Introducing Same-Region Read Replicas to Serverless Postgres - Neon
  ogDescription: >-
    Today, we are excited to introduce same-region read replicas to Neon’s
    serverless architecture, an important milestone in achieving global
    replication. To start using Neon’s read replicas, you’ll need to sign up for
    Neon’s Pro plan. You can create a read replica on the Neon console: Or using
    the Neon CLI: Why are Neon read replicas […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/introducing-same-region-read-replicas-to-serverless-postgres/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/introducing-same-region-read-replicas-to-serverless-postgres/image-7-1024x576-b3bbff6d.jpg)

Today, we are excited to introduce same-region read replicas to Neon’s serverless architecture, an important milestone in achieving global replication.

To start using Neon’s read replicas, you’ll need to sign up for Neon’s Pro plan. You can create a read replica on the Neon console:

<figure>
<video autoPlay playsInline muted loop controls width="3340" height="2160">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/introducing-same-region-read-replicas-to-serverless-postgres/read-replicas-demo-20124547.mp4" />
</video>
</figure>

Or using the Neon CLI:

<figure>
<video autoPlay playsInline muted loop width="10056" height="2160">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/introducing-same-region-read-replicas-to-serverless-postgres/neonctl-add-compute-5e0ed184.mp4" />
</video>
</figure>

Why are Neon read replicas important, and why should you care? Before answering those questions and diving deeper into Neon read replicas and their benefits, let’s explore traditional read replicas in PostgreSQL.

## What are PostgreSQL Read Replicas?

In PostgreSQL, a read replica is a copy of the primary database. It is synchronized with the primary database and is typically used to handle read traffic. By offloading read queries to the read replica, it allows the primary database to focus on write operations, thus enhancing performance.

Traditional read replicas are primarily used for scaling read operations. They are also used for reporting and analytics, as running these resource-intensive queries on the primary database can impact performance. Additionally, they serve as a disaster recovery strategy.

![Image](https://cdn.neonapi.io/public/images/pages/blog/introducing-same-region-read-replicas-to-serverless-postgres/what-are-postgresql-read-replicas-1024x316-dbe7356b.png)

## Replication and Synchronization

The data in the read replicas is synchronized using log-based replication. Changes to the primary database are recorded in a Write-Ahead Log (WAL), which is then replayed on the read replicas. This process ensures that the data remains consistent across the primary database and its replicas.

## Neon Read Replicas

### Why should you use replicas?

Neon’s read replicas have several potential applications:

- **Increase throughput**: By distributing read requests among multiple read replicas, you can achieve higher throughput for both read-write and read-only workloads.
- **Workload offloading**: Assign reporting or analytical workloads to a read replica to prevent any impact on the performance of read-write application workloads.
- **Access control**: Provide read-only data access to certain users or applications that do not need write access.
- **Resource customization**: Configure different CPU and memory resources for each read replica to cater to the specific needs of different users and applications.

### How does it work under the hood?

Neon separates storage and compute, which makes its read replicas fundamentally different from traditional PostgreSQL’s. Unlike traditional PostgreSQL read replicas, Neon doesn’t replicate data across instances. Instead, Neon’s storage engine persists the data, then streams it to all replicas.

![Read Replicas in Neon](https://cdn.neonapi.io/public/images/pages/blog/introducing-same-region-read-replicas-to-serverless-postgres/image-8-1024x453-20789a2b.png)

As illustrated in the diagram above, updates made by the primary (Read/Write) compute instance are made available to Safekeepers, which first persist the data using Paxos consensus algorithm, then asynchronously streams Write-Ahead-Log (WAL) records to Pageserver, S3 Cloud Storage, and replicas.

Replicas then update cache pages in the shared buffers. This ensures eventual consistency for read replicas within the same region as your database.

## Autoscaling Read Replicas

Read-replicas instances behave similarly to any Neon compute instance. Read replicas can independently scale up or down to zero, which makes them pair well with Neon’s autoscaling feature for varying workloads.

![Image](https://cdn.neonapi.io/public/images/pages/blog/introducing-same-region-read-replicas-to-serverless-postgres/screenshot-2023-07-11-at-144648-1024x519-5a7a8a09.png)

## Benefits of Using Neon’s Read Replicas in PostgreSQL

- **Efficient Storage**: Neon’s approach eliminates the need for data duplication. All read-only compute instances read from the same data source as read-write computes, saving substantial storage space.
- **Data Consistency**: Reading data from a single source ensures data consistency. This addresses a common challenge in traditional read replicas where there might be a replication lag.
- **Scalability**: Neon allows you to instantly create read replicas without data duplication. This makes scaling fast and seamless.
- **Cost-Effectiveness**: By removing data replication, Neon reduces data transfer and storage costs. Moreover, Neon’s Autoscaling and Auto-suspend features allow efficient compute resource management.
- **Resource Customization**: Neon allows you to allocate different CPU and memory resources for each replica.
- **Access Control**: Read replicas in Neon can provide read-only data access to certain users or applications that do not need write access.

## Conclusion

Through an architecture that separates storage and compute, scaling down to zero and autoscaling, Neon’s read replicas offer a robust solution to scale your database efficiently.

We encourage you to experience the benefits of Neon’s read replicas firsthand. Sign up for the Neon Pro plan and take your PostgreSQL database to the next level.
