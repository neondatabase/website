---
title: High Availability (HA) in Neon
subtitle: Understanding Neon's approach to High Availability
enableTableOfContents: true
updatedOn: '2025-02-21T19:10:29.546Z'
---

At Neon, our serverless architecture takes a different approach to high availability. Instead of maintaining idle standby compute replicas, we achieve multi-AZ resilience through our separation of storage and compute.

![Neon architecture diagram](/docs/introduction/neon_architecture_4.jpg)

Based on this separation, we can break our approach into two main parts:

- **Storage redundancy** &#8212; _Protecting both your long-term and active data_

  On the storage side, all data is backed by cloud object storage for long-term safety, while Pageserver and Safekeeper services are distributed across [Availability Zones](https://en.wikipedia.org/wiki/Availability_zone) to provide redundancy for the cached data used by compute.

- **Compute resiliency** &#8212; _Keeping your application running_

  Our architecture scales to handle traffic spikes and restarts or reschedules compute instances when issues occur, with recovery times typically ranging from a few seconds to a few minutes. While this means your application needs to handle brief disconnections, it provides cost efficiency by eliminating the need for continuously running standby compute instances.

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

## Compute failover

Our serverless architecture manages compute failures through rapid recovery and automatic traffic redirection, without the need to maintain idle standby replicas. Because compute instances are stateless, failures don't affect your data, and your connection string remains unchanged. The system typically resolves issues within seconds to minutes, depending on the type of failure. However, your application should be configured to handle brief disconnections and reconnect automatically.

### Compute endpoints are ephemeral

Your compute endpoint exists essentially as metadata — with your connection string being the core element. This design means endpoints can be instantly reassigned to new compute resources without changing your application's configuration. When you first connect, Neon assigns your endpoint to an available VM from our ready-to-use pool, eliminating traditional provisioning delays.

### Postgres failure

Postgres runs inside the VM. If Postgres crashes, an internal Neon process detects the issue and automatically restarts Postgres. This recovery process typically completes within a few seconds.

![Postgres restarting after failure](/docs/introduction/postgres_fails.png)

### VM failure

In rarer cases, the VM itself may fail due to issues like a kernel panic or the host's termination. When this happens, Neon recreates the VM and reattaches your compute endpoint. This process may take a little longer than restarting Postgres, but it still typically resolves in seconds.

![VM restarting after failure](/docs/introduction/vm_fails.png)

### Unresponsive endpoints

If a compute endpoint becomes unhealthy or unresponsive, we will automatically detect and reattach it to a new compute after 5 minutes. Your application may experience connectivity issues until the endpoint is restored.

### Node failures

Kubernetes nodes are the underlying infrastructure hosting multiple compute instances. When a node becomes unavailable, Neon automatically reschedules compute instances to other healthy nodes, a process that typically takes 1-2 minutes. While your data remains safe during this process, compute availability will be temporarily affected until rescheduling is complete.

### Availability Zone failures

Availability Zones are physically separate data centers within a cloud region. When an AZ becomes unavailable, compute instances in that AZ will be automatically rescheduled to healthy AZs. Recovery time typically takes 1-10 minutes, depending on node availability in the destination AZs. Your connection string remains stable, and new connections will be routed to the recovered instance.

Multi-AZ support is available in all regions for recovery purposes. While compute instances run in a single AZ at any given time, storage components are continuously distributed across multiple AZs, and compute can be automatically rescheduled to other AZs if needed.

### Recap of failover times

Here's a summary of how different types of compute failures are handled and their expected recovery times:

| Failure type              | Impact                             | Recovery mechanism                      | Recovery time |
| ------------------------- | ---------------------------------- | --------------------------------------- | ------------- |
| Postgres crash            | Brief interruption                 | Automatic restart                       | Seconds       |
| VM failure                | Brief interruption                 | VM recreation and endpoint reattachment | Seconds       |
| Unresponsive endpoint     | Intermittent connectivity          | Automatic recovery initiation           | 5 minutes     |
| Node failure              | Compute unavailable                | Rescheduling to healthy nodes           | 1-2 minutes   |
| Availability Zone failure | Compute unavailable in affected AZ | Rescheduling to healthy AZs             | 1-10 minutes  |

### Impact on session data after failover?

While your application should handle reconnections automatically, session-specific data like temporary tables, prepared statements, and the Local File Cache ([LFC](/docs/reference/glossary#local-file-cache)), which stores frequently accessed data, will not persist across a failover. As a result, queries may initially run more slowly until the Postgres memory buffers and cache are rebuilt.

For details on uptime and performance guarantees, refer to our available [SLAs](/docs/introduction/support#slas).

## Limitations

_No cross-region replication._ Neon's HA architecture is designed to mitigate failures within a single region by replicating data across multiple AZs. However, we currently do not support real-time replication across different cloud regions. In the event of a region-wide outage, your data is not automatically replicated to another region, and availability depends on the cloud provider restoring service to the affected region.
