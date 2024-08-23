---
title: Neon architecture
redirectFrom:
  - /docs/storage-engine/architecture-overview
  - /docs/conceptual-guides/architecture-overview
updatedOn: '2024-08-19T15:59:15.067Z'
---

Neon architecture is based on the separation of compute and storage and is orchestrated by the Neon Control Plane, which manages cloud resources across both storage and compute.

A Neon compute runs Postgres, and storage is a multi-tenant key-value store for Postgres pages that is custom-built for the cloud.

![Neon architecture diagram](/docs/introduction/neon_architecture_4.jpg)

Neon storage consists of three main components: Safekeepers, Pageservers, and cloud object storage.

Safekeepers are responsible for durability of recent updates.
Postgres streams [Write-Ahead Log (WAL)](/docs/reference/glossary#wal) to the Safekeepers, and the Safekeepers store the WAL durably until it has been processed by the Pageservers and uploaded to cloud storage.

Pageservers are responsible for serving read requests. To do that, Pageservers process the incoming WAL stream into a custom storage format that makes all [page](/docs/reference/glossary#page) versions easily accessible. Pageservers also upload data to cloud object storage, and download the data on demand.

Safekeepers can be thought of as an ultra-reliable write buffer that holds the latest data until it is processed and uploaded to cloud storage. Safekeepers implement the Paxos protocol for reliability. Pageservers also function as a read cache for cloud storage, providing fast random access to data pages.

## Durability

Durability is at the core of Neon's architecture. As described earlier, incoming WAL data is initially stored across multiple availability zones in a [Paxos](<https://en.wikipedia.org/wiki/Paxos_(computer_science)>) cluster before being uploaded to [S3](https://aws.amazon.com/s3/) (99.999999999% durability), both in raw WAL and materialized form. Additional copies are maintained across Pageservers to enhance the read performance of frequently accessed data. Consequently, there are always multiple copies of your data in Neon, ensuring durability.
