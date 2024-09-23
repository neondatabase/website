---
title: High Availability (HA) in Neon
subtitle: Understanding Neon's approach to High Availability
enableTableOfContents: true
---

At Neon, our serverless architecture is resilient by default, with the separation of storage from compute giving us flexibility in designing High Availability (HA) solutions for each layer.

![Neon architecture diagram](/docs/introduction/neon_architecture_4.jpg)

The diagram shows this separation of compute (Postgres endpoints) from storage (Safekeepers, Pageservers, and object storage in S3). Reliability on the compute side is handled largely by our ability to spin up near-instant computes, while redundancy on the storage side involves replication of data across [Availability Zones](https://en.wikipedia.org/wiki/Availability_zone) within a region.

## What high availability means to us

Based on the separation of storage from compute, we can break HA into two main parts:

- **Compute resiliency** &#8212; _Keeping your application continuously connected_

  Our serverless compute architecture scales to handle traffic spikes and automatically fails over if an endpoint becomes unavailable.

- **Storage redundancy** &#8212; _Protecting both your long-term and active data_

  On the storage side, durable data is backed by S3 for long-term safety, while Pageserver and Safekeeper services are distributed across Availability Zones to provide redundancy for the cached data used by compute. For databases larger than 64 GB — and coming to all databases [soon](/docs/introduction/roadmap#what-were-working-on-now) — the Storage Controller service manages automatic failover of failed Pageservers to healthy ones. For smaller databases, failover requires manual intervention that Neon handles.

## To us, high availability does not mean...

_Multi-node active/standby configuration._ We do not support a traditional multi-node active/standby setup for compute endpoints. Instead, when a compute endpoint fails, a new endpoint is spun up quickly, eliminating the need for synchronization with a standby mode. This architecture reduces the need for a traditional active/standby model.

## Compute resiliency

Here is an illustration of the key steps involved in a compute failover, including detecting a failure, spinning up a new compute endpoint, and reconnecting to the storage layer.

![compute failover process](/docs/introduction/HA-compute-failover.png)

### Failover time

The entire process typically takes a few seconds. While some steps, like activating a new endpoint, may take only milliseconds, the full failover process involves additional actions such as connection routing and cache rebuilding, which extends the overall time to seconds.

In rare cases, such as when storage services (like Pageservers) experience a complex failure, or there is a system-wide load, failovers may take longer and require manual intervention. However, these extended times generally relate to storage service failover, not compute.

### What are the impacts on my application performance after a failover

The main impacts of a failover are:

- _Dropped connections_

  During a failover, all active connections to the old compute endpoint are dropped, which can cause application errors unless your application is designed to handle reconnections smoothly. If your app has robust retry or reconnection logic, you might experience minimal or no disruption.

- _Loss of session context_

  When an endpoint fails, its [session context](/docs/reference/compatibility#session-context) is lost; the context does not persist to the new endpoint. Session context can include Postgres parameters, temporary tables, prepared statements, and other session-specific data, including the Local File Cache (LFC), which stores frequently accessed data. This can lead to slower query performance until the cache is rebuilt.

Additionally, after a failover, Postgres memory buffers will be cold, causing initial queries to run more slowly until the buffers are warmed up.

## Storage redundancy

By distributing storage components across multiple Availability Zones (AZs), Neon ensures both data durability and operational continuity.

### General storage architecture

This diagram shows a simplified view of how failures of Safekeeper or Pageserver services are recovered across Availability Zones:

![HA storage failover](/docs/introduction/HA-storage-failover.png)

In this architecture:

- **Safekeepers replicate data across AZs**

  Safekeepers are distributed across multiple Availability Zones (AZs) to handle **Write-Ahead Log (WAL) replication**. WAL is replicated across these multi-AZ Safekeepers, ensuring your data is safe if any particular Safekeeper fails.

- **Pageservers**

  Pageservers act as a local disk cache, ingesting and indexing data from the WAL stored by Safekeepers and serving that data to your compute. In case of a Pageserver failure, data remains safe in S3, but impacted projects may become temporarily unavailable until reassigned to a new Pageserver by the Control Plane. For databases over 64 GB, this is an automatic process managed by the Storage Controller. For databases under 64 GB, this requires manual intervention on the Neon side (alerts and migration strategies).

- **Object storage**

  The primary, durable copy of your data resides in **cloud object storage** (e.g., S3), with **99.999999999%** durability to safeguard against any permanent data loss in event of Pageserver or Safekeeper failure.

### Storage controller for automatic failover

For larger databases (64 GB or more), Neon leverages the **Storage Controller** to handle **automatic failover** across Pageservers. The Storage Controller continuously monitors Pageservers using a heartbeat mechanism and automatically triggers failover when a Pageserver becomes unavailable. This process ensures that your database remains operational without manual intervention.

Here’s a simplified view of how the Storage Controller manages Pageserver failover:

![HA storage controller](/docs/introduction/HA-storage-controller.png)

In this architecture:

- **Storage Controller**: The Storage Controller monitors Pageservers through a heartbeat mechanism. When a Pageserver fails, the Storage Controller detects this failure and triggers the automatic failover process.
- **Automatic failover**: Once the failure is detected, the Storage Controller reassigns the project to a healthy Pageserver, which uses the WAL stream from teh Safekeepers to reconstruct the state of the database. This failover is typically fast and happens without manual intervention.

#### Sample failover

The chart below shows the impact of a Pageserver failure (the truncated green line). When a Pageserver fails, the projects it was handled are automatically reassigned to other healthy Pageservers. This migration starts immediately, proceeds without human intervention, and typically completes within seconds. By the next metric scrape interval, the system is fully operational again.

![chart showing pageserver failover via storage controller](/docs/introduction/HA-storage-failover-chart.png)

## Limitations

_No cross-region replication._ Neon's HA architecture is designed to mitigate failures within a single region by replicating data across multiple AZs. However, we currently do not support real-time replication across different cloud regions. This means that in the event of a region-wide outage, your data is not automatically replicated to another region and availability is limited to the scope of the affected region.
