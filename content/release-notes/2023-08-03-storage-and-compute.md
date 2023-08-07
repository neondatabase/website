---
label: 'Storage'
---

### What's new

Neon's [pg_embedding](/docs/extensions/pg_embedding) extension, which enables storing vector embeddings and graph-based vector similarity search in Postgres using HNSW, now persists indexes to disk. The previous `pg_embedding` version (0.1.0 and earlier) stored indexes in memory.

Additionally, `pg_emdedding` now supports cosine and Manhattan distance metrics in addition to Euclidean (L2) distance.

If you have an existing `pg_embedding` installation and want to upgrade to the new version, please see [Upgrade to pg_embedding with on-disk indexes](/docs/extensions/pg_embedding#upgrade-to-pgembedding-for-on-disk-indexes) for instructions.

If you currently use `pgvector` and want to try `pg_embedding`, refer to [Migrate from pgvector to pg_embedding](/docs/extensions/pg_embedding#migrate-from-pgvector-to-pgembedding) for instructions. The vector storage types used `pg_embedding` and `pgvector` are compatible, allowing you to migrate without modifying data types in your existing vector tables.

Also, be sure to check out the new [Neon AI page](https://neon.tech/ai) on our website, and our [docs](https://neon.tech/docs/ai/ai-intro), which include links to new [AI example applications](https://neon.tech/docs/ai/ai-intro#example-applications) built with Neon Serverless Postgres as your vector database.
