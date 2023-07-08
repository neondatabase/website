---
title: Write Path
isDraft: true
redirectFrom:
  - /docs/storage-engine/write-path
---

PostgreSQL --> Safekeepers --> Pageserver --> Cloud storage

The Safekeepers are responsible for durability of recent database changes. PostgreSQL streams [WAL](/docs/glossary/#postgres) to the Safekeepers, and a quorum algorithm based on Paxos ensures that when a transaction is acknowledged as committed to the client, it is stored on a majority of Safekeepers and can be recovered if any single node is lost. The Safekeepers are deployed in different availability zones to ensure high availability and durability.

The Pageserver reads the WAL from the Safekeepers. The Pageserver understands the PostgreSQL WAL format to figure out which pages are being modified by each WAL record. It accumulates and indexes the incoming WAL in memory, and writes it out to the disk in batches. Each batch is written out to an immutable file that is never modified after creation. Using the immutable files, the Pageserver can quickly reconstruct any version of any page, back to a user-defined retention period.

The Pageserver also uploads every immutable file to cloud storage. The cloud storage is the final destination and is assumed to be highly durable; once a file has been successfully uploaded to S3, the corresponding original WAL can be removed from the Safekeepers.
