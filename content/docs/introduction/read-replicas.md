---
title: Read replicas
subtitle: Maximize scalability and more with Neon's instant read replicas
enableTableOfContents: true
updatedOn: '2023-11-21T13:34:56.940Z'
---

Neon read replicas are independent read-only compute instances designed to perform read operations on the same data as your read-write computes. Neon read replicas do not replicate data across database instances. Instead, read requests are directed to a single source — a capability made possible by Neon's architecture, which separates storage and compute. The following diagram shows how read-write and read-only compute instances send read requests to the same Neon [Pageserver](/docs/reference/glossary#pageserver).

![Read-only compute instances](/docs/introduction/read_replicas.png)

In data replication terms, Neon read replicas are asynchronous, which meanas they are _eventually consistent_. As updates are made by read-write computes, Safekeepers store the data changes durably until they are processed by Pageservers. At the same time, Safekeepers keep read-only computes up to date with the latest changes to maintain data consistency.

Neon supports creating read replicas in the same region as your database. Cross-region read replicas are currently not supported. You can expect that feature in a future release.

You can instantly create one or more read replicas for any branch in your Neon project and configure the amount of vCPU and memory allocated to each. Read replicas also support Neon's Autoscaling and Auto-suspend features, providing you with control over the compute resources used by your read replicas.

<video autoPlay playsInline muted loop width="800" height="600">
  <source type="video/mp4" src="/docs/introduction/read_replicas_demo.mp4"/>
</video>

## Use cases

Neon's read replicas have a number of potential applications:

- **Increase throughput**: By distributing read requests among multiple read replicas, you can achieve higher throughput for both read-write and read-only workloads.
- **Workload offloading**: Assign reporting or analytical workloads to a read replica to prevent any impact on the performance of read-write application workloads.
- **Access control**: Provide read-only data access to certain users or applications that do not need write access.
- **Resource customization**: Configure different CPU and memory resources for each read replica to cater to the specific needs of different users and applications.

## Advantages

Advantages of Neon's read replica feature include the following:

1. **Efficient storage**: With read-only compute instances reading from the same source as your read-write computes, no additional storage is required to create a read replica. Data is neither duplicated nor replicated, which means zero additional storage cost.
2. **Data consistency**: Read-write and read-only compute instances read data from a single source, ensuring a high degree of data consistency.
3. **Scalability**: With no data replication required, you can create read replicas almost instantly, providing fast and seamless scalability. You can also scale read replica compute resources the same way you scale read-write compute resources.
4. **Cost effectiveness**: By removing the need for additional storage and data replication, costs associated with storage and data transfer are avoided. Neon's read replicas also benefit from Neon's [Autoscaling](/docs/introduction/autoscaling) and [Auto-suspend](/docs/manage/endpoints#auto-suspend-configuration) features, which enable efficient management of compute resources.
5. **Instant availability**. With an architecture that separates storage and compute, you can allow read-replicas to scale to zero when not in use without introducing lag. When a read replica starts up, it is up to date with your read-write primary almost instantly.

## Get started with read replicas

The first step to leveraging Neon's read replica feature is to sign up for the [Neon Pro Plan](/docs/introduction/pro-plan). After subscribing, you will be able to create and configure read replicas. To get started, refer to the [Working with read replicas](/docs/guides/read-replica-guide) guide.
