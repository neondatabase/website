---
title: Lakebase Search
subtitle: Scalable vector and full-text search for Postgres
summary: >-
  Lakebase Search adds vector, keyword, and hybrid search to Neon through the
  lakebase_vector and lakebase_text Postgres extensions. Use this page to
  understand the search types, how the extensions work, the scale-to-zero
  architecture advantages, and where to get started.
enableTableOfContents: true
updatedOn: '2026-06-25T14:26:46.592Z'
---

<FeatureBetaProps feature_name="Lakebase Search" />

<Callout title="About Lakebase">
Lakebase Search is developed by Databricks. These extensions are part of the shared technology foundation between Neon and the Databricks Lakebase platform.
</Callout>

Lakebase Search adds vector, keyword, and hybrid search to your Neon project. Enable it once, then install the `lakebase_vector` and `lakebase_text` Postgres extensions to start building search features.

## Vector, keyword, and hybrid search

Lakebase Search gives you two complementary ways to search. Use either on its own, or combine them:

- **Vector (semantic) search** finds rows whose meaning is closest to your query, even when they share no words. You search with an embedding (a numeric vector from a model), and the `lakebase_ann` index returns the nearest vectors by distance. Use it for natural-language questions, recommendations, and retrieval-augmented generation (RAG).
- **Keyword (full-text) search** ranks rows by how well they match the exact terms in your query, using BM25 relevance scoring from the `lakebase_bm25` index. Use it for names, codes, and exact-term lookups where wording matters.
- **Hybrid search** runs both and merges the results into one ranking, so you get semantic and exact-term matches together. Use it when queries mix intent with specific terms, which covers most real-world search. The [Get started guide](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search) shows a worked hybrid query.

![Keyword search matches only documents that contain the typed words and misses synonyms like "quick automobile" for "fast sports car." Vector search places the query and documents in the same embedding space and returns the nearest neighbors by meaning, including those synonyms.](/docs/ai/lakebase-search-keyword-vs-vector.png)

## How it works

Lakebase Search is two Postgres extensions:

- **[`lakebase_vector`](/docs/extensions/lakebase-vector)**: adds the `lakebase_ann` index type for vector similarity search. No migration from `pgvector` required. The same `vector` types, distance operators, and query syntax work unchanged. Scales to over 1 billion vectors on a single index.
- **[`lakebase_text`](/docs/extensions/lakebase-text)**: adds the `lakebase_bm25` index type for BM25 keyword search. No migration from Postgres full-text search required. Standard `tsvector` types and query operators work unchanged. Adds BM25 ranking and top-K pushdown that native GIN lacks.

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
