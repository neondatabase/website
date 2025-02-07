---
title: High Availability (HA) in Neon
subtitle: Understanding Neon's approach to High Availability
enableTableOfContents: true
updatedOn: '2024-10-08T17:24:35.409Z'
---

At Neon, our serverless architecture takes a different approach to high availability. Instead of maintaining idle standby replicas, we achieve multi-AZ resilience through our separation of storage and compute.

![Neon architecture diagram](/docs/introduction/neon_architecture_4.jpg)

Based on this separation, we can break our approach into two main parts:

- **Storage redundancy** &#8212; _Protecting both your long-term and active data_

  On the storage side, all data is backed by cloud object storage for long-term safety, while Pageserver and Safekeeper services are distributed across [Availability Zones](https://en.wikipedia.org/wiki/Availability_zone) to provide redundancy for the cached data used by compute.

- **Compute resiliency** &#8212; _Keeping your application running_

  Our architecture scales to handle traffic spikes and restarts or reschedules compute instances when issues occur, with recovery times typically ranging from a few seconds to a few minutes. While this means your application needs to handle brief disconnections, it eliminates the cost of maintaining idle standby instances.

## Storage redundancy

By distributing storage components across multiple Availability Zones (AZs), Neon ensures both data durability and continuous data access.

### General storage architecture

This diagram shows how Neon handles Safekeeper or Pageserver service recovery across Availability Zones:

![HA storage failover](/docs/introduction/HA-storage-failover.png)

In this architecture:

- **Safekeepers replicate data across AZs**

  Safekeepers are distributed across multiple Availability Zones (AZs) to handle **Write-Ahead Log (WAL) replication**. WAL is replicated across these multi-AZ Safekeepers, ensuring your data is safe if any particular Safekeeper fails.

- **Pageservers**

  Pageservers act as a disk cache, ingesting and indexing data from the WAL stored by Safekeepers and serving that data to your compute. To ensure high availability, Neon employs secondary Pageservers that maintain up-to-date copies of project data.

  In the event of a Pageserver failure, impacted projects are immediately reassigned to a secondary Pageserver, with minimal downtime. The system continuously monitors Pageserver health using a heartbeat mechanism to ensure timely detection and failover.

- **Object storage**

  Your data's primary, long-term storage is in **cloud object storage**, with **99.999999999%** durability, protecting against data loss regardless of Pageserver or Safekeeper status.

#### Recap of storage recovery times

Here's a summary of how different storage components handle and recover from failures:

| Component      | Failure impact                                 | Recovery mechanism                  | Recovery time |
| -------------- | ---------------------------------------------- | ----------------------------------- | ------------- |
| Safekeeper     | WAL writes continue to other Safekeepers       | Automatic redistribution across AZs | Seconds       |
| Pageserver     | Read requests automatically route to secondary | Automatic failover to secondary     | Seconds       |
| Object storage | No impact - 99.999999999% durability           | Multi-AZ redundancy built-in        | Immediate     |

## Compute resiliency

The compute layer is built for resiliency and quick recovery from failures. A Neon compute is stateless, meaning failures do not affect your data. In the most common compute failures, _your connection string stays the same and new connections are automatically routed to a newly instantiated compute instance_. However, as with any stateless service, your application should be configured to reconnect automatically. Downtime usually lasts seconds.

### Compute endpoints as metadata

Your compute endpoint exists essentially as metadata — with your connection string being the core element. This design means endpoints can be instantly reassigned to new compute resources without changing your application's configuration. When you first connect, Neon assigns your endpoint to an available VM from our ready-to-use pool, eliminating traditional provisioning delays.

#### Postgres failure

Postgres runs inside the VM. If Postgres crashes, an internal Neon process detects the issue and automatically restarts Postgres. This recovery process typically completes within a few seconds.

![Postgres restarting after failure](/docs/introduction/postgres_fails.png)

#### VM failure

In rarer cases, the VM itself may fail due to issues like a kernel panic or the host's termination. When this happens, Neon recreates the VM and reattaches your compute endpoint. This process may take a little longer than restarting Postgres, but it still typically resolves in seconds.

![VM restarting after failure](/docs/introduction/vm_fails.png)

#### Degraded endpoints

If a compute endpoint is in a degraded state (repeatedly crashing and restarting rather than failing outright), we will detect and reattach it automatically, typically within 5 minutes. During this time, your application may experience intermittent connectivity.

#### Node failures

Node failures can affect multiple customers simultaneously when a Kubernetes node becomes unavailable. The control plane will reschedule compute instances to other healthy nodes, a process that typically takes a few minutes. While your data remains safe during this process, compute availability will be impacted until rescheduling is complete.

#### Availability Zone failures

When an Availability Zone becomes unavailable, compute instances in that AZ will be automatically rescheduled to healthy AZs. Recovery time typically takes 1-10 minutes, depending on node availability in the destination AZs. Your connection string remains the same, and new connections will be routed to the recovered instance.

Multi-AZ support varies by region. **REGIONS LIST TBD**

#### Recap of compute recovery times

Here's a summary of how different types of compute failures are handled and their expected recovery times:

| Failure type              | Impact                             | Recovery mechanism                      | Recovery time   |
| ------------------------- | ---------------------------------- | --------------------------------------- | --------------- |
| Postgres crash            | Brief interruption                 | Automatic restart                       | Seconds         |
| VM failure                | Brief interruption                 | VM recreation and endpoint reattachment | Seconds         |
| Degraded endpoint         | Intermittent connectivity          | Automatic detection and reattachment    | Up to 5 minutes |
| Node failure              | Compute unavailable                | Rescheduling to healthy nodes           | ~2 minutes      |
| Availability Zone failure | Compute unavailable in affected AZ | Rescheduling to healthy AZs             | 1-10 minutes    |

### Impact on session data after a failure?

While your application should handle reconnections automatically, session-specific data like temporary tables, prepared statements, and the Local File Cache ([LFC](/docs/reference/glossary#local-file-cache)), which stores frequently accessed data, will not persist across a failover. As a result, queries may initially run more slowly until the Postgres memory buffers and cache are rebuilt.

For details on uptime and performance guarantees, refer to our available [SLAs](/docs/introduction/support#slas).

## Limitations

_No cross-region replication._ Neon's HA architecture is designed to mitigate failures within a single region by replicating data across multiple AZs. However, we currently do not support real-time replication across different cloud regions. In the event of a region-wide outage, your data is not automatically replicated to another region, and availability depends on the cloud provider restoring service to the affected region.
