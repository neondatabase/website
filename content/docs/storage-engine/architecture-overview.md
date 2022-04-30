---
title: Overview
---

Neon architectural foundation is separation of storage and compute. 
Compute is regular Postgres and storage is a multi-tenant cloud native key value store of Postgres pages.
In addition to the low level storage and compute Neon Control Plane schedules compute in response to the demans of an app as well as
manages storage nodes.

![Neon Architecture Diagram](/docs-images/neon_architecture.png)

Neon Storage consists of three main components: Safekeepers, Pageservers, and cloud storage. 

The Safekeepers are responsible for durability of recent updates. 
PostgreSQL streams [WAL](../glossary#postgres) to the Safekeepers, and the Safekeepers store the WAL durably, 
until it has been processed by the Pageservers and uploaded to cloud storage.

Pageservers are responsible for serving read requests. 
To do that, it processes the incoming WAL stream into a custom storage format that makes all [page](../glossary#postgres) versions easily accessible. 
Pageservers also upload the data to cloud object store, and download it back on demand.

Cloud object store, S3, Azure Blob Store, or Google Cloud Storage, is the final long-term storage.
Safekeepers can be thought of as an ultra reliable write buffer that holds latest data until it has been processed and uploaded to cloud storage. Safekeepers implement Paxos protocol for reliability.
Pageservers can be thought of as a read cache over the cloud storage, providing fast random access to data pages.
