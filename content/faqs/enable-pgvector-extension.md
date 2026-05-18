---
title: 'How do I enable the pgvector extension in my Neon database?'
subtitle: 'Run CREATE EXTENSION vector once and start storing embeddings.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T14:42:53.313Z'
isDraft: false
redirectFrom: []
---

Connect to your database and run `CREATE EXTENSION IF NOT EXISTS vector;`. That's the whole install step. `pgvector` is available on every Neon plan with no add-on or paid tier required. You can run the statement from the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor), psql, or any Postgres client. See [The pgvector extension](/docs/extensions/pgvector) for distance operators, index types, and supported vector types.

## Enable the extension

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Run it once per database. The extension is installed per database, not per project, so if you have multiple databases on a branch you need to enable it in each one.

To confirm it's installed and check the version:

```sql
SELECT extname, extversion
FROM pg_extension
WHERE extname = 'vector';
```

To install the prior supported version (one back from latest):

```sql
CREATE EXTENSION vector VERSION '0.7.4';
```

Check the [Postgres extensions page](/docs/extensions/pg-extensions) for the current latest supported version on Neon.

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

For production-sized datasets, add an approximate index. HNSW is a good default; it doesn't need a training step and has the better speed-recall tradeoff:

```sql
CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);
```

Match the operator class (`vector_cosine_ops`, `vector_l2_ops`, `vector_ip_ops`, and so on) to the distance function you query with.

<Admonition type="tip" title="Sizing index builds">
HNSW index builds are much faster when the graph fits in `maintenance_work_mem`. For larger datasets, bump it for the session: `SET maintenance_work_mem = '4 GB';`. Keep it under 50 to 60 percent of your compute's RAM. See [HNSW index build time](/docs/extensions/pgvector#hnsw-index-build-time).
</Admonition>

<CTA title="Tune pgvector for production" description="Walk through HNSW vs IVFFlat, vector types (halfvec, bit, sparsevec), and query tuning for similarity search." buttonText="Read the pgvector docs" buttonUrl="/docs/extensions/pgvector" />
