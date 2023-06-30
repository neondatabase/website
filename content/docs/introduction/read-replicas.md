---
title: Read replicas
subtitle: Learn about Neon's unique read replica feature
enableTableOfContents: true
isDraft: true
---

Read replicas in Neon are independent read-only compute instances designed to perform read operations on the same data as your read-write computes. Neon read replicas do not replicate data across database instances. Instead, all read requests from a single source — a capability made possible by Neon's architecture, which separates storage and compute. The following diagram shows how read requests from both read-write and read-only compute instances are served from the same Neon [Pageserver](/docs/refernce/glossary#pageserver).

![Read-only compute instances](/docs/introduction/read_replicas.png)

In terms of data replication, Neon's read replica feature is considered asynchronous. As updates are made by your read-write computes, data is made available to Neon's Pageservers via a Write-Ahead Log (WAL) stream. Discounting other factors, any amount of read lag you might experience on a read replica is likely attributeable to high-intensity write activity on your read-write computes. Otherwise, Neon's read replicas offer near-instant data consistency for read replicas that reside in the same region as your database. Cross-region read replica support is planned for a future release.

## Use cases

Neon's read replicas have a number of potential applications:

- **Throughput enhancement**: By distributing read requests among multiple read replicas, you can achieve a higher throughput for both read-write and read-only workloads.
- **Workload offloading**: Assign reporting or analytical workloads to a read replica to prevent any impact on the performance of read-write application workloads.
- **Access control**: Provide read-only data access to certain users or applications that do not need write access.
- **Resource customization**: Configure right-sized compute resources to cater to the specific needs of different users and applications. You are able to specify the amount of CPU and memory allocated to a read replica compute instance.

## Advantages

Advantages of Neon's read replica feature include the following:

1. **Efficient storage usage**: With read-only compute instances reading from the same source as your read-write computes, no additional storage is consumed when you create a read replica. Data is neither duplicated nor replicated.
2. **Data consistency**: All compute instances read data from a single source, ensuring a high degree of data consistency.
3. **Scalability**: Without data replication to contend with, Neon read replicas can be created almost instantly, providing fast and seamless scalability.
4. **Reduced data latency**: All data is read from the same source, significantly reducing common data latency issues seen with traditional replication.
5. **Cost effectiveness**: By eliminating data replication, costs associated with data transfer and storage are avoided. Read replicas in Neon also benefit from Neon's autoscaling and scale-to-zero features, which enable you to manage compute costs.

## Get started with read replicas

The first step to leveraging Neon's read replica feature is to sign up for Neon's [Pro plan](/docs/introduction/pro-plan). Once subscribed, you will be able create and configure read replicas. To get started, refer to our [Working with read replics](/docs/guides/read-replica-guide) guide.
