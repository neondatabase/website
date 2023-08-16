### On-disk support for HNSW indexes with pg_embedding

Neon's [pg_embedding](/docs/extensions/pg_embedding) extension, which enables graph-based vector similarity search in Postgres using the Hierarchical Navigable Small World (HNSW) algorithm (HNSW), now persists HNSW indexes to disk. In the previous `pg_embedding` version (0.1.0 and earlier), indexes resided in memory.

Additionally, `pg_embedding` now supports cosine and Manhattan distance metrics.

#### Cosine distance

<CodeBlock shouldWrap>

```sql
CREATE INDEX ON documents USING hnsw(embedding ann_cos_ops) WITH (dims=3, m=3, efconstruction=5, efsearch=5);
SELECT id FROM documents ORDER BY embedding <=> array[3,3,3] LIMIT 1;
```

</CodeBlock>

#### Manhattan distance

<CodeBlock shouldWrap>

```sql
CREATE INDEX ON documents USING hnsw(embedding ann_manhattan_ops) WITH (dims=3, m=3, efconstruction=5, efsearch=5);
SELECT id FROM documents ORDER BY embedding <~> array[3,3,3] LIMIT 1;
```

</CodeBlock>

If you have an existing `pg_embedding` installation and want to upgrade to the new version,  see [Upgrade to pg_embedding with on-disk indexes](/docs/extensions/pg_embedding#upgrade-to-pgembedding-for-on-disk-indexes) for instructions.

If you currently use `pgvector` and want to try `pg_embedding`, refer to [Migrate from pgvector to pg_embedding](/docs/extensions/pg_embedding#migrate-from-pgvector-to-pgembedding). The vector storage types in `pg_embedding` and `pgvector` are compatible, allowing you to migrate without modifying tables.

Also, be sure to check out the new [Neon AI page](https://neon.tech/ai) on our website, and our [docs](https://neon.tech/docs/ai/ai-intro), which include links to new [AI example applications](https://neon.tech/docs/ai/ai-intro#example-applications) built with Neon Serverless Postgres.
