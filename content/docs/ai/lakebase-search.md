---
title: Lakebase Search
subtitle: A search system built for agents, running inside your Postgres database
summary: >-
  Lakebase Search adds vector, keyword, and hybrid search to Lakebase Postgres
  on Neon. It scales vector search past pgvector's HNSW memory limits by keeping
  indexes in storage, so a single lakebase_ann index handles 100 million vectors
  and beyond with serverless scale-to-zero. lakebase_text adds BM25 keyword
  search, and hybrid search runs as plain SQL.
enableTableOfContents: true
redirectFrom:
  - /docs/extensions/pg_search
  - /docs/extensions/migrate-pg-search-to-lakebase-text
  - /guides/pg-search
  - /guides/pg-search-vs-tsvector
updatedOn: '2026-11-17T16:35:36.759Z'
---

Lakebase Search gives your agents and apps semantic, keyword, and hybrid search over your own data, running as plain SQL inside your [Lakebase Postgres](/docs/postgres/overview) database on Neon.

<AgentPrompt title="Set up with your agent" src="/prompts/lakebase-search-landing.md" buttonText="Copy prompt" />

<Callout title="About Lakebase Search">
Lakebase Search is developed by Databricks. The same extensions power search on Neon and on the Databricks Lakebase platform.
</Callout>

## Scaling search past pgvector

Most teams start vector search in Postgres with `pgvector`, and it holds up until the data grows. The usual `pgvector` index, HNSW (Hierarchical Navigable Small World), has to stay in memory, and that memory grows with the number of vectors, not with how often you query. Past roughly tens of millions of vectors you're paying for a large, always-on instance just to hold the index, index builds get slow enough to disrupt the database, and every tuning pass trades recall against latency.

The other common fix, moving vectors into a dedicated vector database, swaps those problems for a second system to run and a pipeline to keep in sync. Your search then lags your writes, and you own the plumbing in between. Lakebase Search keeps search in the same database as your data, so a row is searchable the moment it's written: no pipeline, no second system, no sync lag.

This doesn't mean leaving `pgvector` behind. `lakebase_vector` is a strict superset of `pgvector`, with the same types, operators, and SQL. You keep what you already use and swap in an index built to scale further, without the HNSW memory wall.

## How Lakebase Search works

Lakebase Search separates storage from compute, the architecture Neon already uses for Postgres. Your indexes live in storage instead of compute memory, so compute stays stateless and scales to zero when the database is idle. It adds two search engines to Postgres, `lakebase_vector` for vector search and `lakebase_text` for keyword search, plus `lakebase_tokenizer` for tokenization.

<InlineSvg src="/docs/ai/lakebase-search-architecture.svg" title="Your app sends one SQL query to Postgres, which runs vector search by meaning and text search by keywords on your tables and returns one ranked result." />

`lakebase_vector` builds the `lakebase_ann` index, which splits vectors into IVF (Inverted File) lists and scans only the relevant ones, reading sequentially instead of chasing pointers through an in-memory graph. It compresses the vectors with RaBitQ quantization to keep the index small and the build fast. Because the index lives in storage, a cold start needs no rebuild or re-index; the first query pays object-storage latency while the cache warms, which you can avoid by calling `lakebase_ann_prewarm` ahead of time.

`lakebase_text` builds the `lakebase_bm25` index, which adds BM25 ranking with Block-Max WAND top-K pushdown, so it returns the top matches directly instead of scoring every row the way a GIN index does. Because both are ordinary Postgres indexes, hybrid search is just SQL: run both in one query and fuse or rerank the results.

## Benchmarks

For throughput and recall figures, Databricks has published benchmarks for Lakebase Search at 100-million-vector scale. See the Databricks engineering blog, [Lakebase Search: state-of-the-art full-text and vector search in Postgres](https://www.databricks.com/blog/lakebase-search-state-art-full-text-and-vector-search-postgres). Those results were measured by Databricks on Databricks Lakebase, not on Neon.

## Vector, keyword, and hybrid search

Those two engines back three kinds of query. [`lakebase_vector`](/docs/extensions/lakebase-vector) handles vector (semantic) search through the `lakebase_ann` index: you query with an embedding and get the nearest rows by meaning, for natural-language questions, recommendations, and retrieval-augmented generation (RAG). [`lakebase_text`](/docs/extensions/lakebase-text) handles keyword (full-text) search through the `lakebase_bm25` index, ranking rows by BM25 for names, codes, and exact terms. Hybrid search runs both and merges the results; the [Get started guide](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search) shows how to fuse them with Reciprocal Rank Fusion (RRF) or rerank them with Jev, a reranking model on Neon AI Gateway. For custom tokenization, including Chinese, Japanese, and Korean (CJK) text, [`lakebase_tokenizer`](/docs/extensions/lakebase-tokenizer) emits standard `tsvector` values.

## Get started

<DetailIconCards>

<a href="/docs/ai/lakebase-search-get-started" description="Install lakebase_vector and lakebase_text, create a schema, insert documents with embeddings, and run your first searches" icon="openai">Quickstart</a>

<a href="/docs/extensions/lakebase-vector" description="Index options, operator classes, and tuning reference for lakebase_vector" icon="openai">lakebase_vector reference</a>

<a href="/docs/extensions/lakebase-text" description="BM25 operators, functions, fallback parameters, and prefilter reference for lakebase_text" icon="openai">lakebase_text reference</a>

<a href="/docs/extensions/lakebase-tokenizer" description="Whole-word and CJK tokenization, built-in language configurations, custom stop words, synonyms, and stemming" icon="openai">lakebase_tokenizer reference</a>

</DetailIconCards>

<NeedHelp />
