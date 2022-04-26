---
title: Neon Engine Architecture Overview
---

Neon Storage Engine consists of three main components: Safekeepers, Pageservers, and cloud storage. In addition to the storage system, there is a control plane that manages the storage nodes and PostgreSQL compute nodes.

The Safekeepers are responsible for durability of recent updates. PostgreSQL streams [WAL](#postgres-glossary-of-terms) to the Safekeepers, and the Safekeepers store the WAL durably, until it has been processed by the Pageservers and uploaded to cloud storage.

The Pageservers are responsible for serving read requests. To do that, it processes the incoming WAL stream into a custom storage format that makes all [page](#postgres-glossary-of-terms) versions easily accessible. The Pageserver also uploads the data to cloud storage, and can download it back on demand.

Cloud storage, S3 or compatible, is the final long-term storage. The Safekeepers can be thought of as a write cache that holds data until it has been processed and uploaded to cloud storage, and the Pageserver can be thought of as a read cache over the cloud storage, providing fast random access to data pages.
