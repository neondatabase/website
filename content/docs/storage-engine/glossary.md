---
title: Neon Engine Glossary
---

#### Postgres glossary of terms

- WAL: Postgres uses a [Write Ahead Log (WAL)](https://www.postgresql.org/docs/current/wal-intro.html)for durability and replication. In Neon we additionally rely on this WAL to separate storage from compute.
- LSN: [Log Sequence Number](https://www.postgresql.org/docs/current/datatype-pg-lsn.html), a byte offset into a location inside the entire WAL stream.
- Page: An 8KB chunk of data, which is the smallest unit of storage that postgres uses for storing relations and indexes on disk. In Neon a page is also the smallest unit of data the Pageserver can be queried for. See [also](https://www.postgresql.org/docs/current/storage-page-layout.html)
