---
title: "Can Postgres replace Elasticsearch or Algolia for app search?"
subtitle: "For many apps, yes. Lakebase Search on Neon adds BM25 keyword, vector, and hybrid search to Lakebase Postgres, and neon.com moved its own site search onto it from a hosted search vendor, raising top-five hit rate from 80% to 94%."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'What do I do when my pgvector HNSW index no longer fits in memory?'
  slug: pgvector-hnsw-index-too-large-for-memory
nextLink:
  title: 'Which Postgres databases let you create a database from the CLI in a single command without logging into a web console?'
  slug: postgres-create-database-cli-single-command
---

For many apps, yes. On Neon, [Lakebase Search](/docs/ai/lakebase-search), a set of Postgres extensions for vector, BM25, and hybrid search in Lakebase Postgres, gives you the two ranking engines that app search depends on: a `lakebase_bm25` index for keyword relevance and a `lakebase_ann` index for semantic matches. The index sits next to the rows it searches, so there's no copy to keep in sync.

## What changes when search lives in your database

A hosted search service searches its own copy of your data. You push records to it after every insert, update, and delete, and handle the lag when the copy is behind. Permission rules have to be copied over as well.

With Lakebase Search, a row is indexed in the same transaction that writes it. BM25 corpus statistics refresh when `VACUUM` runs ([keep the index accurate](/docs/extensions/lakebase-text#keep-the-index-accurate)). Filters are `WHERE` clauses on your real tables, so tenant scoping or "only published" rules are the same SQL your app already runs. One connection string, one backup, and the same branching as the rest of your data: a branch gets the indexes copy-on-write, without re-indexing ([Lakebase Search](/docs/ai/lakebase-search)).

## The search engine underneath

- **Keyword relevance.** [`lakebase_text`](/docs/extensions/lakebase-text) scores `tsvector` columns with real BM25, using corpus-wide statistics, and returns the top K results with Block-Max WAND instead of scoring every match. Plain Postgres `ts_rank` with GIN can't do either.
- **Semantic matches.** [`lakebase_vector`](/docs/extensions/lakebase-vector) adds an IVF index with RaBitQ quantization on standard `pgvector` columns. It scales to over 1 billion vectors on one index.
- **Hybrid ranking.** Fuse both result lists in one SQL query with reciprocal rank fusion, or rerank candidates with the Jev decision model through AI Gateway ([hybrid search](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search)).
- **Language handling.** [`lakebase_tokenizer`](/docs/extensions/lakebase-tokenizer) adds stop words, synonyms, stemming, and Chinese, Japanese, and Korean tokenization. For fuzzy matching on short strings, Postgres has `pg_trgm`.

## How neon.com search moved over

The search box on neon.com used to run on a hosted search vendor. It now runs on Neon ([neon.com search](/blog/neon-docs-search-lakebase-search)):

- **Ingestion.** When a page changes in the website repo, a GitHub Action sends it to a [Neon Function](/docs/compute/functions/overview). The Function fetches the page as markdown, chunks it by heading, embeds each chunk through [AI Gateway](/docs/ai-gateway/embeddings), and upserts the text, embedding, and `tsvector` into one table.
- **Serving.** The same Function exposes a search endpoint. Common queries read hybrid results computed offline from a cache table; everything else goes straight to the `lakebase_bm25` index with no model call.
- **Latency.** Cache hits take 1.9 ms of server time at p50; BM25 queries take 8.6 ms at p50 and 11.5 ms at p95. End-to-end round trips were about the same as the previous vendor's, because almost all of the time is network.
- **Quality.** On the same golden queries, the right page appears in the top five for 94% of queries, up from 80%.

The engineer who built it relied on an agent with the Neon agent skills to choose the indexes and fusion method, then gated changes on hit-rate, ranking, and latency benchmarks.

## What you build yourself

Lakebase Search gives you indexes and ranking in SQL. It's not a search UI, a query analytics dashboard, or a hosted crawler. Like the neon.com setup, you write the ingestion code, the endpoint, and the evaluation suite. Neon Functions bill only while a request is being processed ([plans](/docs/introduction/plans#functions)). Embeddings and Jev reranking go through AI Gateway, which needs prepaid credits; BM25-only search doesn't. Lakebase Search requires Postgres 16 or later.

## How other options compare

- **Algolia**: doesn't query your database. It searches a copy of your data stored as records in an Algolia index, and you send changes from your source to that index after the first import ([Algolia: send and update your data](https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/)).
- **Elasticsearch**: supports hybrid ranking through an RRF retriever that combines two or more child retrievers, with a default rank constant of 60 ([Elastic RRF](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)). Lakebase Search gets the same fusion from a SQL query.

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Build search on your own data" description="Enable lakebase_text and lakebase_vector and run keyword, vector, and hybrid queries." buttonText="Get started" buttonUrl="/docs/ai/lakebase-search-get-started" />
