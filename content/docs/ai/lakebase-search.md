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
updatedOn: '2026-11-18T15:34:53.666Z'
---

Lakebase Search is search built for agents: retrieval over your own data as plain SQL, inside your [Lakebase Postgres](/docs/postgres/overview) database on Neon.

<AgentPrompt title="Set up with your agent" src="/prompts/lakebase-search-landing.md" buttonText="Copy prompt" />

## How Lakebase Search works

Lakebase Search adds two engines to Postgres: `lakebase_vector` for vector search and `lakebase_text` for keyword search, plus `lakebase_tokenizer` for tokenization. Both build ordinary Postgres indexes, so a single SQL query can run vector search, keyword search, or both, and come back as one ranked result.

<InlineSvg src="/docs/ai/lakebase-search-architecture.svg" title="An agent sends one SQL query to stateless compute that runs the lakebase_vector and lakebase_text engines. Their lakebase_ann and lakebase_bm25 indexes persist in separate storage, and ranked results return to the agent." />

The engines run on stateless compute, and their indexes persist in separate storage, the same architecture Neon uses for Postgres. Compute scales to zero when the database is idle. Because the indexes stay in storage, waking the database doesn't rebuild or re-index anything. The first query after a wake is slower while the data loads into memory, and you can run `lakebase_ann_prewarm` ahead of time to avoid it.

Vector search is a single SQL query: order rows by the distance between their embedding and your query vector, then return the top matches.

```sql
-- Vector search
SELECT id, title
FROM documents
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

Keyword search and hybrid search also run as SQL. Hybrid search combines the vector and keyword results into one ranked list (using Reciprocal Rank Fusion, or RRF). You can also reorder the results with Jev, a reranking model on the Neon AI Gateway. See the [Get started guide](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search) for the full runnable hybrid query.

### How the vector index scales

`lakebase_vector` builds the `lakebase_ann` index. It sorts vectors into groups and only searches the groups closest to your query, so it reads a small part of the index instead of scanning all of it (IVF, for Inverted File). It also shrinks each vector into a smaller form, which keeps the index small and quick to build (RaBitQ).

### How the text index ranks

`lakebase_text` builds the `lakebase_bm25` index. It ranks results with BM25 and finds the best matches without scoring every matching row, so text search stays fast as your data grows (Block-Max WAND). A standard Postgres full-text index (GIN) scores all the matching rows first and then picks the top ones; `lakebase_bm25` goes straight to the best matches.

## Scaling search past pgvector

While `pgvector` is the standard extension for vector search in Postgres, its limits show up as the data grows. On traditional Postgres, a search index has to stay resident in memory to answer quickly, so `pgvector`'s usual HNSW (Hierarchical Navigable Small World) index grows its memory with the number of vectors, not with how often you query.

Past roughly tens of millions of vectors, you run into several limits:

- a large, always-on instance just to hold the index in memory
- index builds slow enough to disrupt the database
- a recall-versus-latency tradeoff on every tuning pass (recall means how many of the true matches you actually get back)

<InlineSvg src="/docs/ai/lakebase-search-contrast.svg" title="In traditional Postgres the search index sits in RAM on always-on compute. In Lakebase Search the index lives in storage, and stateless compute reads it on demand." />

Lakebase Search keeps the `lakebase_ann` index in storage and reads it from stateless compute on demand, so the index size no longer sets the instance size. You no longer need an always-on instance sized to hold the whole index in memory, and a single index scales to 100 million vectors and beyond.

A separate vector database avoids that memory problem, but then you have to keep it in sync with your Postgres data: a second system to run and a pipeline to keep in step, so your search lags your writes. Lakebase Search keeps search in the same database as your data, so a row is searchable the moment it's written. There's no separate search system to keep in sync, and no lag between a write and when its row is searchable.

`lakebase_vector` is a strict superset of `pgvector`: the same types, operators, and SQL. You keep your existing queries and add the `lakebase_ann` index.

## Benchmarks

Lakebase Search is built to stay fast and cost-efficient at large scale, around 4x more cost-effective than a standard cloud `pgvector` setup. Databricks benchmarked it with VectorDBBench on a 100-million-vector dataset; see the [Databricks benchmark](https://www.databricks.com/blog/lakebase-search-state-art-full-text-and-vector-search-postgres) for the results. They were measured by Databricks on Databricks Lakebase, so treat them as a reference point.

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
