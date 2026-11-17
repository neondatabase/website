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
updatedOn: '2026-11-17T17:30:27.940Z'
---

Lakebase Search gives your agents and apps semantic, keyword, and hybrid search over your own data, running as plain SQL inside your [Lakebase Postgres](/docs/postgres/overview) database on Neon.

<AgentPrompt title="Set up with your agent" src="/prompts/lakebase-search-landing.md" buttonText="Copy prompt" />

## How Lakebase Search works

Lakebase Search separates storage from compute, the same architecture Neon uses for Postgres. Your indexes live in storage, not in compute memory, so compute stays stateless and scales to zero when the database is idle.

It adds two search engines to Postgres: `lakebase_vector` for vector search and `lakebase_text` for keyword search, plus `lakebase_tokenizer` for tokenization. Both build ordinary Postgres indexes, so you query them, and combine them, with plain SQL.

<InlineSvg src="/docs/ai/lakebase-search-architecture.svg" title="Your app sends one SQL query to Postgres, which runs vector search by meaning and text search by keywords on your tables and returns one ranked result." />

Both searches and the fusion are one statement. This query takes candidates from the `lakebase_ann` vector index and the `lakebase_bm25` keyword index, then merges them with Reciprocal Rank Fusion (RRF):

```sql
WITH vector_ranked AS (
  SELECT id, RANK() OVER (ORDER BY dist) AS rank
  FROM (
    SELECT id, embedding <=> $1::vector AS dist
    FROM documents
    WHERE embedding IS NOT NULL
    ORDER BY dist
    FETCH FIRST 40 ROWS WITH TIES
  ) v
),
keyword_ranked AS (
  SELECT id, RANK() OVER (ORDER BY score) AS rank
  FROM (
    SELECT id, score
    FROM (
      SELECT id, body_tsv <@> to_bm25query(
        to_tsvector('english', $2), 'documents_bm25'
      ) AS score
      FROM documents
    ) AS scored
    WHERE score < 0
    ORDER BY score, id
    LIMIT 40
  ) k
)
SELECT d.id, d.title,
  COALESCE(1.0 / (60 + v.rank), 0) + COALESCE(1.0 / (60 + k.rank), 0) AS rrf_score
FROM documents d
LEFT JOIN vector_ranked v ON d.id = v.id
LEFT JOIN keyword_ranked k ON d.id = k.id
WHERE v.id IS NOT NULL OR k.id IS NOT NULL
ORDER BY rrf_score DESC, d.id
LIMIT 5;
```

For the full runnable version, including Jev reranking, see the [Get started guide](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search).

### How the vector index scales

`lakebase_vector` builds the `lakebase_ann` index. It splits vectors into IVF (Inverted File) lists and scans only the relevant ones, reading sequentially instead of chasing pointers through an in-memory graph. It compresses the vectors with RaBitQ quantization to keep the index small and the build fast.

Because the index lives in storage, a cold start needs no rebuild or re-index. The first query pays object-storage latency while the cache warms; call `lakebase_ann_prewarm` ahead of time to skip that.

### How the text index ranks

`lakebase_text` builds the `lakebase_bm25` index. It ranks with BM25 and uses Block-Max WAND top-K pushdown to return the top matches directly, instead of scoring every row the way a GIN index does.

## Scaling search past pgvector

Most teams start vector search in Postgres with `pgvector`, and the limits show up as the data grows. Its usual index, HNSW (Hierarchical Navigable Small World), keeps the whole vector index in RAM, so its memory grows with the number of vectors, not with how often you query.

Past roughly tens of millions of vectors, you run into several limits:

- a large, always-on instance just to hold the index in memory
- index builds slow enough to disrupt the database
- a recall-versus-latency tradeoff on every tuning pass

The `lakebase_ann` index lives in storage instead of RAM, so the index size no longer sets the instance size.

A dedicated vector database trades the memory problem for a sync problem: a second system to run and a pipeline to keep in step, so your search lags your writes. Lakebase Search keeps search in the same database as your data, so a row is searchable the moment it's written. There's no separate search system to keep in sync, and no lag between a write and when its row is searchable.

`lakebase_vector` is a strict superset of `pgvector`: the same types, operators, and SQL. You keep your existing queries and add the `lakebase_ann` index.

## Benchmarks

For throughput and recall figures, Databricks has published benchmarks for Lakebase Search at 100-million-vector scale. See the Databricks engineering blog, [Lakebase Search: state-of-the-art full-text and vector search in Postgres](https://www.databricks.com/blog/lakebase-search-state-art-full-text-and-vector-search-postgres). Those results were measured by Databricks on Databricks Lakebase, not on Neon.

## Vector, keyword, and hybrid search

Lakebase Search answers three kinds of query, each mapped to an extension you can read about in depth:

- **Vector (semantic) search** with [`lakebase_vector`](/docs/extensions/lakebase-vector): query the `lakebase_ann` index with an embedding to get the nearest rows by meaning, for natural-language questions, recommendations, and retrieval-augmented generation (RAG).
- **Keyword (full-text) search** with [`lakebase_text`](/docs/extensions/lakebase-text): rank rows by BM25 through the `lakebase_bm25` index, for names, codes, and exact terms.
- **Hybrid search**: run both in one query and merge the results. The [Get started guide](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search) shows how to fuse them with Reciprocal Rank Fusion (RRF) or rerank them with Jev, a reranking model on Neon AI Gateway.

For custom tokenization, including Chinese, Japanese, and Korean (CJK) text, [`lakebase_tokenizer`](/docs/extensions/lakebase-tokenizer) emits standard `tsvector` values.

## Get started

<DetailIconCards>

<a href="/docs/ai/lakebase-search-get-started" description="Install lakebase_vector and lakebase_text, create a schema, insert documents with embeddings, and run your first searches" icon="openai">Quickstart</a>

<a href="/docs/extensions/lakebase-vector" description="Index options, operator classes, and tuning reference for lakebase_vector" icon="openai">lakebase_vector reference</a>

<a href="/docs/extensions/lakebase-text" description="BM25 operators, functions, fallback parameters, and prefilter reference for lakebase_text" icon="openai">lakebase_text reference</a>

<a href="/docs/extensions/lakebase-tokenizer" description="Whole-word and CJK tokenization, built-in language configurations, custom stop words, synonyms, and stemming" icon="openai">lakebase_tokenizer reference</a>

</DetailIconCards>

<NeedHelp />
