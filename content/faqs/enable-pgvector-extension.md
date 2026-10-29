---
title: 'How do I enable the pgvector extension in my Neon database?'
subtitle: 'Run CREATE EXTENSION vector once and start storing embeddings.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How do I enable or disable connection pooling for my Neon database?'
  slug: enable-disable-connection-pooling-neon
nextLink:
  title: 'How do I export or download my Neon database as a SQL file?'
  slug: export-database-sql-file
---

Connect to your database and run `CREATE EXTENSION IF NOT EXISTS vector;`. There's nothing else to install, and `pgvector` is available on every Neon plan with no add-on required. Run the statement from the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor), psql, or any Postgres client. See [The pgvector extension](/docs/extensions/pgvector) for distance operators, index types, and supported vector types.

## Enable the extension

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Extensions are installed per database, not per project, so if you have several databases on a branch, run it in each one where you want to store vectors.

To confirm it's installed and check the version:

```sql
SELECT extname, extversion
FROM pg_extension
WHERE extname = 'vector';
```

Neon also lets you install the version one back from the latest supported release. Check the [Postgres extensions page](/docs/extensions/pg-extensions) for the latest version on your Postgres major version, then pass the prior version explicitly:

```sql
CREATE EXTENSION vector VERSION '<prior_version>';
```

## Try it with embeddings

Create a table with a vector column, insert two rows, and run a similarity query:

```sql
CREATE TABLE items (
  id BIGSERIAL PRIMARY KEY,
  embedding vector(3)
);

INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');

SELECT id, embedding <-> '[3,1,2]' AS distance
FROM items
ORDER BY embedding <-> '[3,1,2]'
LIMIT 5;
```

`<->` is L2 distance. `pgvector` also supports `<#>` (negative inner product), `<=>` (cosine distance), and `<+>` (L1 distance).

Without an index, `pgvector` runs an exact nearest-neighbor scan. For larger tables, add an approximate index. Compared with IVFFlat, HNSW has a better speed-recall tradeoff and needs no training step, so you can create it on an empty table. It builds more slowly and uses more memory. This index matches the L2 query above:

```sql
CREATE INDEX ON items USING hnsw (embedding vector_l2_ops);
```

The operator class has to match the distance operator you query with: `vector_l2_ops` for `<->`, `vector_ip_ops` for `<#>`, `vector_cosine_ops` for `<=>`, and `vector_l1_ops` for `<+>`. Otherwise the planner won't use the index.

<Admonition type="tip" title="Sizing index builds">
HNSW indexes build much faster when the graph fits in `maintenance_work_mem`. You can raise it for the session, for example `SET maintenance_work_mem = '4 GB';` on a 4 CU (≈16 GB RAM) compute. Keep it under 50 to 60 percent of your compute's RAM. See [HNSW index build time](/docs/extensions/pgvector#hnsw-index-build-time).
</Admonition>

<CTA title="Tune pgvector for production" description="Walk through HNSW vs IVFFlat, vector types (halfvec, bit, sparsevec), and query tuning for similarity search." buttonText="Read the pgvector docs" buttonUrl="/docs/extensions/pgvector" />
