---
title: Read replicas
subtitle: Maximize scalability and more with Neon's instant read replica feature
enableTableOfContents: true
isDraft: true
---

Neon read replicas are independent read-only compute instances designed to perform read operations on the same data as your read-write computes. The Neon read replica implementation does not replicate data across database instances. Instead, all read requests are directed to a single source — a capability made possible by Neon's architecture, which separates storage and compute. The following diagram shows how read requests from both read-write and read-only compute instances are served from the same Neon [Pageserver](/docs/refernce/glossary#pageserver).

![Read-only compute instances](/docs/introduction/read_replicas.png)

In data replication terms, Neon's read replica feature is considered asynchronous. As updates are made by your read-write computes, the latest changes are first persisted by Safekeepers via Paxos concensus algorithm and then made available to Neon Pageservers via a Write-Ahead Log (WAL) stream. Neon supports creating read replicas in the same region as your database. Cross-region read replicas are currently not supported. You can expect that feature in a future release.

You can instantly create one or more read replicas for any branch in your Neon project and configure the amount of vCPU and memory allocated to each. Read replicas also support Neon's Autoscaling and Auto-suspend features, providing you with control over the compute resources used by your read replicas.

## Use cases

Neon's read replicas have a number of potential applications:

- **Throughput enhancement**: By distributing read requests among multiple read replicas, you can achieve higher throughput for both read-write and read-only workloads.
- **Workload offloading**: Assign reporting or analytical workloads to a read replica to prevent any impact on the performance of read-write application workloads.
- **Access control**: Provide read-only data access to certain users or applications that do not need write access.
- **Resource customization**: Configure different CPU and memory resources for each read replica to cater to the specific needs of different users and applications.

## Advantages

Advantages of Neon's read replica feature include the following:

1. **Efficient storage**: With read-only compute instances reading from the same source as your read-write computes, no additional storage is required to create a read replica. Data is neither duplicated nor replicated, which means there is zero additional storage cost when adding a read replica. You can create as many read replicas as you need without any additional storage cost.
2. **Data consistency**: Read-write and read-only compute instances read data from a single source, ensuring a high degree of data consistency.
3. **Scalability**: With no data replication required, you can create read replicas almost instantly, providing fast and seamless scalability. You can scale read replica compute resources in Noen the same way that you can scale read-write compute resources.
4. **Cost effectiveness**: By removing the need for additional storage and avoiding data replication, costs associated with storage and data transfer due to replication are avoided. Your primary cost is compute and traffic. Neon's read replicas also benefit from Neon's _Autoscaling_ and _Auto-suspend_ features, which enable efficient management of compute resources.
5. **Instant availability**. With Neon's architecture that separate storage and compute, you can allow your read-replicas to scale to zero when not in use without introducing lag. When the read replica starts up again, it is instantly up to date with your read-write primary. You do not have to wait until the read replica receives updates.

## Get started with read replicas

The first step to leveraging Neon's read replica feature is to sign up for Neon's [Pro plan](/docs/introduction/pro-plan). Once subscribed, you will be able to create and configure read replicas. To get started, refer to the [Working with read replicas](/docs/guides/read-replica-guide) guide.
