---
title: Read replicas
subtitle: Maximize scalability and more with read replicas
enableTableOfContents: true
updatedOn: '2024-08-27T12:23:05.820Z'
---

Neon read replicas are independent computes designed to perform read operations on the same data as your primary read-write compute. Neon's read replicas do not replicate data across database instances. Instead, read requests are directed to a same data source as your read/write compute. The following diagram shows how your primary compute and read replicas send read requests to the same Pageserver, which is the component of the [Neon architecture](/docs/introduction/architecture-overview) that is responsible for serving read requests.

![read replica computes](/docs/introduction/read_replicas.jpg)

Neon read replicas are asynchronous, which means they are _eventually consistent_. As updates are made by your primary compute, Safekeepers store the data changes durably until they are processed by Pageservers. At the same time, Safekeepers keep read replica computes up to date with the most recent changes to maintain data consistency.

Neon supports creating read replicas in the same region as your database. Cross-region read replicas are currently not supported.

You can instantly create one or more read replicas for any branch in your Neon project and configure the amount of vCPU and memory allocated to each. Read replicas also support Neon's Autoscaling and Autosuspend features, providing you with control over the compute resources used by your read replicas.

## How can you use read replicas?

Neon's read replicas have a number of potential applications:

- **Increase throughput**: By distributing read requests among multiple read replicas, you can achieve higher throughput for both read-write and read-only workloads.
- **Offloading work**: You can assign reporting or analytical workloads to a read replica to prevent any impact on the performance of read-write application workloads.
- **Access control**: You can use read replicas to provide read-only data access to certain users or applications that do not need write access.
- **Resource customization**: You configure different compute size, autoscaling, and autosuspend settings for each read replica to cater to the specific needs of different users and applications.

## What are the advantages of Neon's read replica architecture?

Neon's read replicas perform read operations on the same data as your read-write compute &#8212; there's no replicating data across database instances. This has several advantages:

1. **Efficient storage**: With read replicas reading from the same source as your primary read-write compute, no additional storage is required to create a read replica. Data is neither duplicated nor replicated, which means there's no additional storage required.
2. **Data consistency**: Your primary read-write compute and read replicas read data from a single source, ensuring a high degree of data consistency.
3. **Near-instant scalability**: With no data replication required, you can create read replicas almost instantly. You can also scale read replica compute resources the same way you scale your primary read-write compute resources, by increasing the compute size.
4. **Cost effectiveness**: With no additional storage or tranfer of data, costs associated with storage and data transfer are avoided. Neon's read replicas also benefit from Neon's [Autoscaling](/docs/introduction/autoscaling) and [Autosuspend](/docs/manage/endpoints#auto-suspend-configuration) features, which enable efficient management of compute resources.
5. **Instant availability**. With an architecture that separates storage and compute, you can allow read replicas to scale to zero when not in use without introducing lag. When a read replica starts up, it is up to date with your primary read-write compute almost instantly.

## Get started with read replicas

To get started, refer to the [Working with read replicas](/docs/guides/read-replica-guide) guide.
