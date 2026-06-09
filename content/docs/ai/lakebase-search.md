---
title: Lakebase Search
subtitle: Scalable vector and full-text search for Postgres
summary: >-
  Lakebase Search is two Postgres extensions (lakebase_vector and lakebase_text)
  that bring scalable vector and BM25 full-text search to Neon. Use this page
  to understand the architecture advantages (scale from 0 to 1B vectors, 10x
  faster index builds, branching without rebuilds, scale-to-zero compatibility),
  learn what each extension provides, and navigate to the extension reference
  pages.
enableTableOfContents: true
updatedOn: '2026-06-09T00:14:08.087Z'
---

<EarlyAccessProps feature_name="Lakebase Search" />

Lakebase Search is two Postgres extensions that bring scalable vector and BM25 full-text search to Neon, designed for AI agent backends that need both semantic and keyword search in a single database.

- **[`lakebase_vector`](/docs/extensions/lakebase-vector)**: adds the `lakebase_ann` index type for vector similarity search. No migration from `pgvector` required; the same `vector` types, distance operators, and query syntax work unchanged. Scales to over 1 billion vectors on a single index.
- **[`lakebase_text`](/docs/extensions/lakebase-text)**: adds the `lakebase_bm25` index type for BM25 keyword search. No migration from PostgreSQL FTS required; standard `tsvector` types and query operators work unchanged. Adds BM25 ranking and top-K pushdown that native GIN lacks.

## Why Lakebase architecture

`lakebase_ann` uses IVF partitioning and RaBitQ quantization, an architecture built to scale beyond what HNSW can reach. HNSW indexes must fit in memory and traverse the graph with random I/O at query time. IVF partitions the vector space into lists and searches only the most relevant ones, enabling sequential I/O and 4–8x compression. The result:

- **Scale to 1 billion+ vectors**: a single `lakebase_ann` index grows with your data without resharding or rebuilding
- **Faster index builds**: compression reduces index size significantly, making builds and cold starts faster than HNSW
- **Branching without index rebuilds**: Neon branches copy-on-write; your search indexes are available instantly on every branch without re-indexing
- **Scale-to-zero compatible**: indexes survive cold starts without warmup; you don't pay for idle compute

## Get started

<DetailIconCards>

<a href="/docs/ai/lakebase-search-get-started" description="Enable both extensions, create a schema, insert documents with embeddings, and run your first searches" icon="openai">Quickstart</a>

<a href="/docs/extensions/lakebase-vector" description="Index options, operator classes, and tuning reference for lakebase_vector" icon="openai">lakebase_vector reference</a>

<a href="/docs/extensions/lakebase-text" description="BM25 operators, functions, fallback parameters, and prefilter reference for lakebase_text" icon="openai">lakebase_text reference</a>

</DetailIconCards>

<NeedHelp />
