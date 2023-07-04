---
title: Read replicas
subtitle: Learn about Neon's unique read replica feature
enableTableOfContents: true
isDraft: true
---

Neon read replicas are independent read-only compute instances designed to perform read operations on the same data as your read-write computes. The Neon read replica implementation does not replicate data across database instances. Instead, all read requests are directed to a single source — a capability made possible by Neon's architecture, which separates storage and compute. The following diagram shows how read requests from both read-write and read-only compute instances are served from the same Neon [Pageserver](/docs/refernce/glossary#pageserver).

![Read-only compute instances](/docs/introduction/read_replicas.png)

In data replication terms, Neon's read replica feature is considered asynchronous. As updates are made by your read-write computes, the latest changes are made available to Neon Pageservers via a Write-Ahead Log (WAL) stream. Neon's read replicas offer near-instant data consistency for read replicas residing in the same region as your database. Cross-region read replicas are currently not supported. You can expect that feature in a future release.

You can create one or more read replicas for any branch in your Neon project, and you can configure the amount of vCPU and memory allocated to each. Read replicas also support Neon's Autoscaling and Auto-suspend features, providing you with control over the compute resources used by your read replicas.

## Use cases

Neon's read replicas have a number of potential applications:

- **Throughput enhancement**: By distributing read requests among multiple read replicas, you can achieve a higher throughput for both read-write and read-only workloads.
- **Workload offloading**: Assign reporting or analytical workloads to a read replica to prevent any impact on the performance of read-write application workloads.
- **Access control**: Provide read-only data access to certain users or applications that do not need write access.
- **Resource customization**: Configure right-sized CPU and memory resources to cater to the specific needs of different users and applications.

## Advantages

Advantages of Neon's read replica feature include the following:

1. **Efficient storage**: With read-only compute instances reading from the same source as your read-write computes, no additional storage is required to create a read replica. Data is neither duplicated nor replicated.
2. **Data consistency**: Read-write and read-only compute instances read data from a single source, ensuring a highest degree of data consistency.
3. **Scalability**: Without no data replication required, you can create read replicas almost instantly, providing fast and seamless scalability.
4. **Reduced data latency**: All data is read from the same source, avoiding common data latency issues seen with traditional replication.
5. **Cost effectiveness**: By eliminating data replication, costs associated with data transfer and storage are avoided. Neon read replicas also benefit from Neon's autoscaling and scale-to-zero features, which enable you to manage compute costs.

## Get started with read replicas

The first step to leveraging Neon's read replica feature is to sign up for Neon's [Pro plan](/docs/introduction/pro-plan). Once subscribed, you will be able create and configure read replicas. To get started, refer to the [Working with read replics](/docs/guides/read-replica-guide) guide.
