### Support for pgvector v0.5.0

We are pleased to announce support for [pgvector v0.5.0](https://github.com/pgvector/pgvector) on Neon. This new version introduces:

- Hierarchical Navigable Small Worlds (HNSW) indexing for faster retrieval
- Faster distance functions
- Parallel builds for `ivfflat` indexes

If you already use `pgvector` with Neon, you can upgrade by running the following command:

```sql
ALTER EXTENSION vector UPDATE TO '0.5.0';
```
