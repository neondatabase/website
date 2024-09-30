---
title: High Availability (HA) in Neon
subtitle: Understanding Neon's approach to High Availability
enableTableOfContents: true
---

At Neon, our serverless architecture is resilient by default, with the separation of storage from compute giving us flexibility in designing High Availability (HA) solutions for each layer.

![Neon architecture diagram](/docs/introduction/neon_architecture_4.jpg)

Based on this separation of storage from compute, we can break HA into two main parts:

- **Compute resiliency** &#8212; _Keeping your application continuously connected_

  Our serverless architecture scales to handle traffic spikes and automatically restarts your compute if Postgres crashes or your compute becomes unavailable.

- **Storage redundancy** &#8212; _Protecting both your long-term and active data_

  On the storage side, all data is backed by cloud object storage for long-term safety, while Pageserver and Safekeeper services are distributed across [Availability Zones](https://en.wikipedia.org/wiki/Availability_zone) to provide redundancy for the cached data used by compute.

## Compute resiliency

Neon compute is stateless, meaning failures do not affect your data. In the most common compute failures, _your connection remains stable_. However, as with any stateless service, your application should be configured to reconnect automatically. Downtime usually lasts seconds, and your connection string stays the same.

### Compute endpoints are metadata

To understand how connections are maintained, think of your compute endpoint as metadata — with your connection string being the core element. The endpoint is not permanently tied to any specific resource but can be reassigned as needed. When you first connect to your database, Neon creates a new VM in a Kubernetes node and attaches your compute endpoint to this VM.

#### Postgres failure

Postgres runs inside the VM. If Postgres crashes, the VM detects the issue and restarts Postgres automatically, typically within a few seconds. This is the most common failure scenario.

![Postgres restarting after failure](/docs/introduction/postgres_fails.png)

#### VM failure

Less frequently, the VM itself may fail. If this happens, Neon immediately spins up a new VM and reattaches your compute endpoint. This process takes slightly longer than restarting Postgres but still typically happens within seconds. It's similar to what happens during an [Autosuspend](/docs/guides/auto-suspend-guide) restart: when a compute has been inactive for a set period, the VM is torn down, and when it's needed again, Neon spins up a new VM and reattaches the endpoint, just as it would after a failover.

![VM restarting after failure](/docs/introduction/vm_fails.png)

### What are the impacts on session data after a failure?

While your application should handle reconnections automatically, session-specific data like temporary tables, prepared statements, and the Local File Cache ([LFC](/docs/reference/glossary#local-file-cache)), which stores frequently accessed data, will not persist across a failover. As a result, queries may initially run more slowly until the Postgres memory buffers and cache are rebuilt.

### What about node-level failures?

The majority of failures are resolved at the Postgres or VM level. In the rare instance of a node-level failure — which can affect many users — recovery involves restarting and reassigning multiple VMs. These incidents can take longer to recover from, though again, your data remains safe throughout. Other issues, for example, if VM performance degrades but does not fail, detection and recovery can also take longer to resolve.

For details on uptime and performance guarantees, refer to our available [SLAs](/docs/introduction/support#slas).

## Storage redundancy

By distributing storage components across multiple Availability Zones (AZs), Neon ensures both data durability and operational continuity.

### General storage architecture

This diagram shows a simplified view of how failures of Safekeeper or Pageserver services are recovered across Availability Zones:

![HA storage failover](/docs/introduction/HA-storage-failover.png)

In this architecture:

- **Safekeepers replicate data across AZs**

  Safekeepers are distributed across multiple Availability Zones (AZs) to handle **Write-Ahead Log (WAL) replication**. WAL is replicated across these multi-AZ Safekeepers, ensuring your data is safe if any particular Safekeeper fails.

- **Pageservers**

  Pageservers act as a local disk cache, ingesting and indexing data from the WAL stored by Safekeepers and serving that data to your compute. In case of a Pageserver failure, data remains safe in cloud object storage, but impacted projects may become temporarily unavailable until the system reassigns them to a healthy Pageserver. The system continuously monitors the health of Pageservers using a heartbeat mechanism to ensure timely detection and failover.

- **Object storage**

  The primary, long-term copy of your data resides in **cloud object storage**, with **99.999999999%** durability, ensuring protection against permanent data loss in the event of Pageserver or Safekeeper failure.

## Limitations

_No cross-region replication._ Neon's HA architecture is designed to mitigate failures within a single region by replicating data across multiple AZs. However, we currently do not support real-time replication across different cloud regions. In the event of a region-wide outage, your data is not automatically replicated to another region, and availability depends on the cloud provider restoring service to the affected region. While region-wide outages are rare, a reminder that your long-term data remains safe in durable cloud object storage.
