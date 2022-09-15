---
title: Overview
redirectFrom:
  - /docs/storage-engine/architecture-overview
---

### Introduction

Neon architecture based on separation of storage and compute and orchestrated by Neon Control Plane.
Compute is regular Postgres and storage is a custom built multi-tenant key value store of Postgres pages built for the cloud.
Neon Control Plane manages all the cloud resources across storage and compute.

![Neon architecture diagram](/docs-images/neon_architecture.png)

Neon storage consists of three main components: Safekeepers, Pageservers, and cloud storage.

The Safekeepers are responsible for durability of recent updates.
PostgreSQL streams [WAL](../glossary#postgres) to the Safekeepers, and the Safekeepers store the WAL durably,
until it has been processed by the Pageservers and uploaded to cloud storage.

Pageservers are responsible for serving read requests.
To do that, it processes the incoming WAL stream into a custom storage format that makes all [page](../glossary#postgres) versions easily accessible.
Pageservers also upload the data to cloud object storage, and download it back on demand.

Cloud object storage, S3, Azure Blob Storage, or Google Cloud Storage, is the final long-term storage.

Safekeepers can be thought of as an ultra reliable write buffer that holds latest data until it has been processed and uploaded to cloud storage. Safekeepers implement Paxos protocol for reliability.
Pageservers can be thought of as a read cache over the cloud storage, providing fast random access to data pages.
