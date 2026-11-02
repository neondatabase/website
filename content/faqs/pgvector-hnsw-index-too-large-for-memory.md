---
title: "What do I do when my pgvector HNSW index no longer fits in memory?"
subtitle: "On Neon, add a lakebase_ann index from Lakebase Search to the same vector column. It uses IVF partitioning with RaBitQ quantization and lives in storage instead of compute memory, so your schema and queries stay the same."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I move a supabase-js app to another backend without rewriting my queries?'
  slug: move-supabase-js-app-without-rewriting-queries
nextLink:
  title: 'Can Postgres replace Elasticsearch or Algolia for app search?'
  slug: postgres-alternative-to-elasticsearch-algolia-app-search
---

Keep your `pgvector` column and change the index. On Neon, [Lakebase Search](/docs/ai/lakebase-search), a set of Postgres extensions for vector, BM25, and hybrid search in Lakebase Postgres, includes [`lakebase_vector`](/docs/extensions/lakebase-vector), which adds the `lakebase_ann` index type. It uses the same `vector` and `halfvec` types, the same distance operators (`<->`, `<#>`, `<=>`), and the same query syntax as `pgvector`. Only the `USING` clause changes.

## Why HNSW runs out of room

An HNSW index is a multilayer graph. It has a good speed-recall tradeoff, but it builds slowly and uses more memory than IVFFlat ([pgvector HNSW](/docs/extensions/pgvector#hnsw)). Builds are fast only while the graph fits in `maintenance_work_mem`. Past that point Postgres warns that "building will take significantly more time" ([HNSW build time](/docs/extensions/pgvector#hnsw-index-build-time)). At query time the graph is walked with random reads, so search stays fast only while the index stays in RAM. As the table grows, you end up sizing your compute around the index instead of your workload.

HNSW also caps the `vector` type at 2,000 dimensions (4,000 for `halfvec`) ([HNSW vector types](/docs/extensions/pgvector#hnsw-vector-types)).

## How lakebase_ann avoids it

`lakebase_ann` partitions the vector space with IVF and searches only the most relevant partitions at query time, using sequential I/O instead of graph traversal. RaBitQ quantization shrinks the vectors, which keeps the index small and builds fast; the docs put builds at 50 to 100x faster than HNSW. A single index scales to over 1 billion vectors ([why lakebase_vector](/docs/extensions/lakebase-vector)).

The index lives in Lakebase Postgres storage rather than compute memory. It survives scale-to-zero without a rebuild, and branches get it copy-on-write without re-indexing ([how lakebase_ann scales](/docs/ai/lakebase-search#how-lakebaseann-scales)). After a compute starts, `lakebase_ann_prewarm` loads the frequently accessed parts into memory if first-query latency matters ([prewarm](/docs/extensions/lakebase-vector#prewarm-an-index)).

## Switch without downtime

Lakebase Search needs Postgres 16 or later.

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;

-- Reads and writes continue during the build
CREATE INDEX CONCURRENTLY items_embedding_ann ON items
  USING lakebase_ann (embedding vector_cosine_ops);
```

Use the operator class that matches your queries, as with HNSW. Once you've confirmed the planner uses the new index (`EXPLAIN` your top-K query), drop the HNSW index to free its memory and storage.

To speed up the build, check `SHOW shared_buffers`. If it's 1 GB or less, consider temporarily resizing to a larger fixed-size compute, and raise `max_parallel_maintenance_workers` ([index build time](/docs/extensions/lakebase-vector#index-build-time)).

## Tune recall

`lakebase_ann.probes` sets how many IVF partitions each query scans. It's the counterpart of `hnsw.ef_search`: higher values improve recall and cost latency. The default `'auto'` is balanced. To pick a value from your own workload, pass real query vectors to `lakebase_ann_advise`, which returns candidate `probes` values with estimated recall@10 and measured latency (requires `lakebase_vector` 1.1.2 or later) ([recommended probes](/docs/extensions/lakebase-vector#get-recommended-probes-values)):

```sql
SELECT probes, recall, p50_ms, p95_ms
FROM lakebase_ann_advise(
  'items_embedding_ann'::regclass,
  ARRAY(SELECT embedding FROM lakebase_ann_sample(NULL::items, 512))
);
```

Choose the fastest row that meets your recall target and `SET lakebase_ann.probes` to it. With a pooled connection or the serverless driver, run the `SET` and the query in one transaction so they share a session. For tables up to 50 million vectors, `build_mode = 'quality'` trades a longer build for better recall.

## Other things to know

- On a small table, `lakebase_ann` uses exact search instead of IVF, and `probes` stays `''`.
- `lakebase_ann_advise` doesn't run when row-level security applies to your role on the table.
- New extension releases can bring a newer index storage format. Upgrade with `ALTER EXTENSION lakebase_vector UPDATE` and `REINDEX INDEX CONCURRENTLY` when convenient ([upgrades](/docs/extensions/lakebase-vector#upgrade-the-extension-and-indexes)).

If you generate embeddings with [AI Gateway](/docs/ai-gateway/embeddings), its models return 1024-dimension vectors, well under the HNSW cap if you keep HNSW elsewhere.

<CTA title="Move your vectors to lakebase_ann" description="Enable lakebase_vector and add an index to your existing pgvector column." buttonText="lakebase_vector reference" buttonUrl="/docs/extensions/lakebase-vector" />
