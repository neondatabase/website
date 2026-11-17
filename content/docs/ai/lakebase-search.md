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
updatedOn: '2026-11-17T21:48:30.966Z'
---

Lakebase Search gives your agents and apps semantic, keyword, and hybrid search over your own data, running as plain SQL inside your [Lakebase Postgres](/docs/postgres/overview) database on Neon.

<AgentPrompt title="Set up with your agent" src="/prompts/lakebase-search-landing.md" buttonText="Copy prompt" />

## How Lakebase Search works

Lakebase Search separates storage from compute, the same architecture Neon uses for Postgres. Your indexes live in storage, not in compute memory, so compute stays stateless and scales to zero when the database is idle.

It adds two search engines to Postgres: `lakebase_vector` for vector search and `lakebase_text` for keyword search, plus `lakebase_tokenizer` for tokenization. Both build ordinary Postgres indexes, so you query them, and combine them, with plain SQL.

<InlineSvg src="/docs/ai/lakebase-search-architecture.svg" title="Your app sends one SQL query to Postgres, which runs vector search by meaning and text search by keywords on your tables and returns one ranked result." />

Search by meaning is a single SQL query: order rows by the distance between their embedding and your query vector, then take the top matches.

```sql
-- Semantic search is one SQL query: order rows by the distance
-- between their embedding and the query vector. No separate vector store.
SELECT id, title
FROM documents
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

Keyword search and hybrid search run the same way, as SQL. Hybrid search combines the vector and keyword results into one ranked list (using Reciprocal Rank Fusion, or RRF), and can optionally reorder them with Jev, a reranking model on Neon AI Gateway. See the [Get started guide](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search) for the full runnable hybrid query.

### How the vector index scales

`lakebase_vector` builds the `lakebase_ann` index. It sorts vectors into groups and only searches the groups closest to your query, so it reads a small part of the index instead of scanning all of it (this grouping is called IVF, short for Inverted File). It also shrinks each vector into a smaller form, which keeps the index small and quick to build (this compression is called RaBitQ).

Because the index lives in storage, a cold start needs no rebuild or re-index. The first query pays object-storage latency while the cache warms; call `lakebase_ann_prewarm` ahead of time to skip that.

### How the text index ranks

`lakebase_text` builds the `lakebase_bm25` index. It ranks results with BM25 and finds the best matches without scoring every matching row, so text search stays fast as your data grows (the technique for this is called Block-Max WAND). A standard Postgres full-text index (GIN) scores all the matching rows first and then picks the top ones; `lakebase_bm25` goes straight to the best matches.

## Scaling search past pgvector

Most teams start vector search in Postgres with `pgvector`, and the limits show up as the data grows. Its usual index, HNSW (Hierarchical Navigable Small World), keeps the whole vector index in RAM, so its memory grows with the number of vectors, not with how often you query.

Past roughly tens of millions of vectors, you run into several limits:

- a large, always-on instance just to hold the index in memory
- index builds slow enough to disrupt the database
- a recall-versus-latency tradeoff on every tuning pass (recall means how many of the true matches you actually get back)

The `lakebase_ann` index lives in storage instead of RAM, so the index size no longer sets the instance size.

A dedicated vector database trades the memory problem for a sync problem: a second system to run and a pipeline to keep in step, so your search lags your writes. Lakebase Search keeps search in the same database as your data, so a row is searchable the moment it's written. There's no separate search system to keep in sync, and no lag between a write and when its row is searchable.

`lakebase_vector` is a strict superset of `pgvector`: the same types, operators, and SQL. You keep your existing queries and add the `lakebase_ann` index.

## Benchmarks

On VectorDBBench at 100-million-vector scale, Lakebase Search is the fastest and most cost-efficient system measured, running roughly 4x more cost-effectively than a standard cloud `pgvector` setup. See the [Databricks benchmark](https://www.databricks.com/blog/lakebase-search-state-art-full-text-and-vector-search-postgres) for the full results.

## Which search to use: vector, keyword, or hybrid

Pick the search that fits the query:

- **Vector (semantic) search** when you care about meaning: natural-language questions, recommendations, and retrieval-augmented generation (RAG).
- **Keyword (full-text) search** when the exact words matter: names, codes, and other precise terms.
- **Hybrid search** when you want both. It runs the vector and keyword searches and merges them into one ranked list.

For Chinese, Japanese, and Korean (CJK) text or other custom tokenization, add `lakebase_tokenizer`.

## Get started

<DetailIconCards>

<a href="/docs/ai/lakebase-search-get-started" description="Install lakebase_vector and lakebase_text, create a schema, insert documents with embeddings, and run your first searches" icon="openai">Quickstart</a>

<a href="/docs/extensions/lakebase-vector" description="Index options, operator classes, and tuning reference for lakebase_vector" icon="openai">lakebase_vector reference</a>

<a href="/docs/extensions/lakebase-text" description="BM25 operators, functions, fallback parameters, and prefilter reference for lakebase_text" icon="openai">lakebase_text reference</a>

<a href="/docs/extensions/lakebase-tokenizer" description="Whole-word and CJK tokenization, built-in language configurations, custom stop words, synonyms, and stemming" icon="openai">lakebase_tokenizer reference</a>

</DetailIconCards>

<NeedHelp />
