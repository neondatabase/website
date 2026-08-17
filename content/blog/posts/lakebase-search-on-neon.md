---
title: 'Lakebase Search: vector and BM25 on Neon'
description: Hybrid vector + full-text retrieval, in one Postgres, designed for separated compute and storage.
excerpt: >-
  Today we're shipping the beta of Lakebase Search on Neon: hybrid vector +
  full-text retrieval via two Postgres extensions, lakebase_vector and
  lakebase_text. This post is the story of why and how we built it: IVF +
  RaBitQ instead of HNSW, BM25 with top-K pushdown instead of GIN on tsvector,
  and indexes that live on object storage so they survive scale-to-zero and
  branch instantly.
date: '2026-07-02T08:49:00'
category: company
categories:
  - company
authors:
  - savannah-longoria
  - pranav-aurora
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/lakebase-search-on-neon/cover.png'
  alt: 'Lakebase Search: vector and BM25 on Neon'
isFeatured: false
draft: false
seo:
  title: 'Lakebase Search: vector and BM25 on Neon - Neon'
  description: >-
    Lakebase Search brings scalable vector and BM25 full-text search to Neon
    via two new Postgres extensions, lakebase_vector and lakebase_text,
    designed for separated compute and storage.
  keywords: []
  noindex: false
  ogTitle: 'Lakebase Search: vector and BM25 on Neon - Neon'
  ogDescription: >-
    Hybrid vector + full-text retrieval in one Postgres, with indexes that
    live on object storage so they survive scale-to-zero and branch instantly.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/lakebase-search-on-neon/cover.png'
---

![Lakebase Search extensions on Neon](https://cdn.neonapi.io/public/images/pages/blog/lakebase-search-on-neon/cover.png)

Now available to everyone: **Lakebase Search on Neon**. Hybrid vector + full-text retrieval via two Postgres extensions, `lakebase_vector` and `lakebase_text`.

If you're wondering about the naming: Lakebase refers to the Postgres database architecture where storage is separated from compute. The extensions are called `lakebase_vector` and `lakebase_text` because each runs industry-standard vector (ANN) and text (BM25) search algos in a way that is optimized for the lakebase storage-compute separation. The [Databricks announcement](https://www.databricks.com/blog/announcing-lakebase-search-agent-native-retrieval-built-lakebase-postgres) has more lakebase context, including benchmarks.

This post is the story of why and how we built it.

## Limits of default search in Postgres

When you're starting out, keeping search in Postgres is quick and easy compared to the alternatives. The architecture often looks something like this:

- `pgvector` with HNSW for vectors
- A generated `tsvector` column with a GIN index for keyword search
- One database, one connection string, one transaction

This is the pattern many of our own examples follow and recommend. It works well, but as you scale, you inevitably hit one of three issues:

1. **HNSW eats your RAM.** Once you're past 5–10M vectors, you start sizing your Postgres instance around the vector index instead of your actual workload. Past 100M vectors, the working set stops fitting; query latency climbs, and your index takes hours to build. `pgvector`'s `vector` type caps HNSW at 2,000 dimensions. Current-generation embedding models like `text-embedding-3-large` (3072d) force you to cast to `halfvec` (giving up fp32 precision), use binary quantization, truncate dimensions via Matryoshka, or skip HNSW entirely.
2. **GIN isn't really BM25.** `ts_rank` doesn't use corpus-wide IDF, so your relevance scores quietly drift as the table grows. GIN also has no top-K pushdown, so every matching document gets scored before your `LIMIT` kicks in. The bigger the corpus, the slower the query, and the weaker the ranking.
3. **You own the hybrid query.** Score normalization, tie-breaking, and per-tenant filtering: it's all SQL you're writing and maintaining yourself.

If you've outgrown that setup, your options haven't been great. You have to choose between running a new Postgres extension or doing search in a separate vector database. A separate database means another system to sync, state that drifts between them, and the [200ms-range search latencies](https://neon.com/blog/vecstore-replacing-pinecone-and-rds-with-neon) Vecstore wrote about before they consolidated onto Neon.

Lakebase Search takes the extension path, and optimizes each for Neon's unique architecture.

## What is Lakebase Search

Lakebase Search is two Postgres extensions, `lakebase_vector` and `lakebase_text`, that bring scalable ANN and BM25 full-text search to Neon, designed for backends that need both semantic and keyword search in a single database.

![Lakebase Search Postgres extensions: lakebase_vector and lakebase_text](https://cdn.neonapi.io/public/images/pages/blog/lakebase-search-on-neon/extensions.png)

- **`lakebase_vector`**: adds the `lakebase_ann` index type for vector similarity search. **100% compatibility with `pgvector`**. Built on the same vector types, distance operators, and query syntax, so existing queries work unchanged. Scales to over 1 billion vectors on a single index.
- **`lakebase_text`**: adds the `lakebase_bm25` index type for BM25 keyword search. No migration from PostgreSQL FTS required. Standard `tsvector` types and query operators work unchanged. Adds BM25 ranking and top-K pushdown that native GIN lacks.

## Under the hood

Neon separates compute from storage, with a hierarchy of caches in between. Storage on Neon is tiered from hot to cold: RAM, local NVMe, pageserver, object storage. Hot pages return at local-disk latency. Object storage only enters the read path when a read misses every tier above it.

<figure>
<video autoPlay muted loop playsInline width="708" height="398" aria-label="Flexible cache/data tiers">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/lakebase-search-on-neon/cache-data-tiers-1416.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/videos/pages/blog/lakebase-search-on-neon/cache-data-tiers-1416.mp4" type="video/mp4" />
</video>
</figure>

Both `lakebase_ann` and `lakebase_bm25` are shaped for this hierarchy: footprints small enough to mostly live in the upper tiers, and layouts that turn deeper reads into big sequential block fetches.

`lakebase_vector` uses IVF (inverted file) partitioning plus [RaBitQ](https://arxiv.org/abs/2405.12497) quantization.

<figure>
<video autoPlay muted loop playsInline width="708" height="282" aria-label="IVF + RaBitQ on object storage">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/lakebase-search-on-neon/ivf-rabitq-object-store-1416.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/videos/pages/blog/lakebase-search-on-neon/ivf-rabitq-object-store-1416.mp4" type="video/mp4" />
</video>
<figcaption className="wp-element-caption"><em>Hierarchical-IVF + RaBitQ is built for that storage hierarchy. The vector space is pre-partitioned into clusters, and each cluster maps to a contiguous block on object storage. A query identifies a small number of relevant clusters via their centroids, then pulls those clusters in parallel, since the cluster IDs are known up front. RaBitQ keeps the quantized vectors small enough that scanning the contents of each block stays cheap. A query becomes a handful of large, independent reads.</em></figcaption>
</figure>

RaBitQ compresses vectors about 32x, so a 100M-vector index that would traditionally need ~300GB of RAM as HNSW fits in under 10GB. We keep `pgvector`'s vector types and distance operators (`<->`, `<#>`, `<=>`); only the index type changes. Builds run up to 50–100x faster than HNSW on the same data.

`lakebase_text` replaces the GIN-on-`tsvector` pattern with a BM25-native index. The index stores corpus-wide statistics (document frequencies, average document length) at build time. `<@>` returns real BM25 scores. The scores are negative, so `ORDER BY score` ascending puts the most relevant results first. The query path uses Block-Max WAND for top-K pushdown: the index returns the K most relevant documents without scoring every match. GIN can't do that. The layout is sequential, so each read pulls a contiguous block of pages off storage. Standard `tsvector` and `tsquery` still work; the new pieces are the `<@>` operator and the `to_bm25query()` helper.

Because both indexes live inside the same Postgres, hybrid search is just SQL. A single query can join against your operational tables, filtered by tenant or any other column, and run in one transaction. No sync, no second connection string, no state drift between two systems.

## Lakebase Search is the solution to a problem we've been trying to solve for a long time

This isn't our first attempt at native vector search on Neon. Back in 2023 we shipped [pg_embedding](https://neon.com/blog/pg-embedding-extension-for-vector-search), an HNSW extension. The truth is it didn't work as we hoped, because HNSW is a graph index designed for a traditional server: local NVMe, and a long‑lived process that keeps the entire graph pinned in RAM between queries. Every search walks the graph through a bunch of small, random reads, and assumes those reads land in hot memory rather than going back to storage.

<figure>
<video autoPlay muted loop playsInline width="1416" height="564" style={{ aspectRatio: '1416 / 564' }} src="https://cdn.neonapi.io/public/videos/pages/blog/lakebase-search-on-neon/hnsw-object-store.mp4"></video>
<figcaption className="wp-element-caption"><em>A graph index like HNSW is fast when neighbor lists are cheap to touch. In memory or on local SSD, pointer chasing through the graph happens at microsecond latency. On object storage, each hop becomes a dependent remote read: you can't issue the next read until the current one tells you which neighbor to visit. The whole query serializes into a chain of round trips, each one tens of milliseconds long. This is why object-store search needs a different physical design.</em></figcaption>
</figure>

On Neon, the "disk" is object storage and the compute can scale to zero. Random reads against S3 take tens of milliseconds, and a cold start means rehydrating the whole graph before the first query can return. Swapping which extension ships in the box was never going to fix that, and it's why first-class search on Neon has been unfinished business for us for a while.

Lakebase Search indexes are durable on object storage, the same layer the rest of your data already lives on. That's why the extensions are called `lakebase_vector` and `lakebase_text`: indexes living on a data lake. Putting them behind the same separation of compute and storage that made data lakes work for analytics is what makes scale-to-zero possible in the first place. When the compute shuts down, the index keeps existing where it sits, ready for the next compute to attach to. That single design choice is what makes the rest of this work.

Scale-to-zero stops requiring a warmup, because the index is durable on its own and the compute on top is just a cache that can be rebuilt on demand from the bytes already sitting in object storage. The cache itself is empty after a cold start, so the first few queries pay object-storage latency while it fills. For latency-sensitive workloads, `lakebase_ann_prewarm()` loads the index into memory before the first query.

Branching lets you tune search without touching prod. Because indexes live on object storage and branches are copy-on-write, you can branch a production database in seconds and inherit the same `lakebase_ann` and `lakebase_bm25` indexes. On that branch, you can try different fusion strategies (RRF with varying k, or weighted blends of vector and BM25 scores), run your eval suite against real production data, and compare recall and latency side by side. If the new configuration wins, apply it to prod with confidence. If it loses, delete the branch. Prod kept serving the whole time.

![Branch, eval, rollback: without rebuilding indexes](https://cdn.neonapi.io/public/images/pages/blog/lakebase-search-on-neon/branching-v2.png)

## Hybrid retrieval, on the same foundation as your Neon data

With Lakebase Search, you stop needing to wire together a vector store, a search cluster, and a transactional database for the same application. The whole retrieval lifecycle lives inside one Postgres: the scale and economics of tiered cloud object storage underneath, the real-time read/write ergonomics on top that agentic workflows depend on. Indexes on a data lake, queried like a database.

To get started, the [Lakebase Search quickstart](https://neon.com/docs/ai/lakebase-search-get-started) walks you through enabling the feature on a Neon project and shipping your first hybrid query. For the full reference, including index parameters and tuning knobs, see the [`lakebase_vector` docs](https://neon.com/docs/extensions/lakebase-vector).

Stay tuned for a follow-up post with the full benchmarks of `lakebase_vector` against `pgvector` on Neon.
