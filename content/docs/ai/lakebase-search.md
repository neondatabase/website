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
updatedOn: '2026-06-09T20:13:02.957Z'
---

<RequestForm type="lakebase-search" />

<Callout title="About Lakebase">
Lakebase Search is developed by Databricks. These extensions are part of the shared technology foundation between Neon and the Databricks Lakebase platform.
</Callout>

Lakebase Search is two Postgres extensions, `lakebase_vector` and `lakebase_text`, that bring scalable vector and BM25 full-text search to Neon, designed for backends that need both semantic and keyword search in a single database.

- **[`lakebase_vector`](/docs/extensions/lakebase-vector)**: adds the `lakebase_ann` index type for vector similarity search. No migration from `pgvector` required. The same `vector` types, distance operators, and query syntax work unchanged. Scales to over 1 billion vectors on a single index.
- **[`lakebase_text`](/docs/extensions/lakebase-text)**: adds the `lakebase_bm25` index type for BM25 keyword search. No migration from PostgreSQL FTS required. Standard `tsvector` types and query operators work unchanged. Adds BM25 ranking and top-K pushdown that native GIN lacks.

## How `lakebase_ann` scales

`lakebase_ann` is designed for the separated compute/storage architecture that powers Neon. Because the index lives in storage rather than in compute memory, it works naturally with Neon's scale-to-zero model: your vector index is available immediately after a cold start, with no warmup required. You only pay for compute when your database is actively serving requests. This holds for production workloads and for development or staging environments where the database sits idle most of the time.

It uses IVF (Inverted File) partitioning to divide the vector space into lists and searches only the relevant ones at query time, using sequential I/O that suits storage-backed systems. RaBitQ quantization compresses vectors 4–8x, keeping index size and build time down. The result:

- **Scale to 1 billion+ vectors**: a single `lakebase_ann` index grows with your data without resharding or rebuilding
- **Faster index builds**: compression reduces index size significantly, making builds 50–100x faster than HNSW
- **Branching without index rebuilds**: Neon branches copy-on-write; your search indexes are available instantly on every branch without re-indexing
- **Scale-to-zero compatible**: indexes survive cold starts without warmup; you don't pay for idle compute

## Get started

<DetailIconCards>

<a href="/docs/ai/lakebase-search-get-started" description="Enable both extensions, create a schema, insert documents with embeddings, and run your first searches" icon="openai">Quickstart</a>

<a href="/docs/extensions/lakebase-vector" description="Index options, operator classes, and tuning reference for lakebase_vector" icon="openai">lakebase_vector reference</a>

<a href="/docs/extensions/lakebase-text" description="BM25 operators, functions, fallback parameters, and prefilter reference for lakebase_text" icon="openai">lakebase_text reference</a>

</DetailIconCards>

<NeedHelp />
