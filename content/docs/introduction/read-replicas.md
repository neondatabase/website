---
title: Read replicas
subtitle: Learn about Neon's unique read replica feature
enableTableOfContents: true
isDraft: true
---

Read replicas in Neon are independent read-only compute instances designed to perform read operations on the same data accessed by your read-write computes. Made possible by Neon's architecture, which separates compute and storage, Neon read replicas do not replicate data across database instances. Instead, they offer direct, simultaneous access to the same data. This approach results in efficient storage use, immediate data consistency, and the none of data latency issues typically associated read replicas. The following diagram shows how read requests from both read-write and read-only computes instances are served from the same [Pageserver](/docs/refernce/glossary#pageserver).

![Read-only compute instances](/docs/introduction/read_replicas.png)

The read replica feature is a Neon [Pro plan](/docs/introduction/pro-plan) feature. It is not available with the [Neon Free Tier](/docs/introduction/free-tier).

## Use Cases

Neon's read replicas have a number of possible applications:

- **Throughput enhancement**: By distributing read requests among multiple read replicas, a higher throughput can be achieved.
- **Workload offloading**: Assign reporting or analytical workloads to a read replica to prevent any impact on the performance of read-write application workloads.
- **Access control**: Provide read-only data access to certain users or applications that do not need write access.
- **Resource customization**: Configure right-sized compute resources to cater to the specific needs of different users and applications.

## Advantages

Advantages of Neon's read replica feature include the following:

1. **Efficient storage usage**: With read-only compute instances sharing data with your read-write computes, no additional storage is consumed when you creating a read replica.
2. **Immediate data consistency**: All compute instances access a single, definitive source of data, ensuring immediate data consistency.
3. **Scalability**: Without data replication to contend with, rapid creation of read replicas is possible, providing instant and seamless scalability.
4. **Zero data latency**: All data is read from the same source, eliminating the common data latency issue seen with traditional replication.
5. **Cost effectiveness**: By eliminating data replication, costs associated with data transfer and storage are avoided. Read replicas in Neon also benefit from Neon's autoscaling and scale-to-zero features.

## Getting Started

The first step to leveraging the power of Neon's read replicas is to subscribe to the Neon Pro plan. Once subscribed, you can create and configure read replicas according to your specific needs. To get started, refer to our read replicas guide.
