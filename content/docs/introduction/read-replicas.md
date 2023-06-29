---
title: Read replicas
subtitle: Learn about Neon's unique read replica feature
enableTableOfContents: true
isDraft: true
---

In Neon, read replicas are implemented as independent read-only compute instances that can perform read operations on the same data accessed by your read-write computes — a capability enabled by Neon's unique architecture that separates compute and storage. As your read-write compute instances introduce changes, read-replica computes are able to access those changes in real-time.

![Read-only compute instances](/docs/introduction/read_replicas.png)

Unlike traditional read-replica implementations, Neon's read replicas do not require replicating data across database instances. Instead, they provide simultaneous, direct access to the same data, resulting in efficient use of storage, immediate data consistency, and no data latency.

Read replicas are a Neon [Pro plan](/docs/introduction/pro-plan) feature. This feature is not available with the [Neon Free Tier](/docs/introduction/free-tier).

## Neon read replica advantages

Advantages of Neon's read replica feature include:

- Efficient use of storage: All instances access shared data. A read replica in Neon requires no additional storage.
- Immediate data consistency: In typical replication setups, maintaining data consistency across all replicas, especially under write-intensive workloads, can pose a challenge, and delays in propagating changes to replicas can lead to data inconsistencies. Neon read replicas offer immediate data consistency, with all compute instances (read and write) accessing a single, definitive source of data.
- Streamlined scaling: As no data replication is required, read replicas can be created instantly in Neon, enabling easy and rapid scaling, and read replica compute can be dispose of just as quickly.
- No data latency: Traditional replication can result in data latency, due to the time taken to propagate changes from a primary database instance to its replicas, which could lead to stale data being accessed from the replicas. Neon read replicas avoid this issue by having all data read from the same source.
- Cost-effectiveness: By eliminating data replication, Neon's read replica implementation avoids costs associated with data transfer and storage. Neon's read-replica compute instances also benefit from the same features as our read-write computes, including autoscaling and scale-to-zero.

## Use cases

Potential use cases for Neon's read replicas include:

- Distributing read requests to one or more read replicas to achieve higher throughput.
- Directing business reporting or analytical workloads to a read replica with its own compute resources to avoid impacting the performance of your read-write application workload.
- Providing read-only data access to specific users or applications who do not require write access.
- Configuring right-sized compute resources for different users and applications.

<Admonition type="note">
Currently, you can only provision read replicas in the same region as your Neon project. Support for creating read replicas in a different region will be added in a future release.
</Admonition>

## Get started with Neon read replicas

To get started with Neon read replicas, refer to our read replicas guide.
