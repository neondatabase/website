---
title: Neon docs search is now powered by Lakebase Search
description: The search on neon.com now runs on our own service, built with Lakebase Search on Neon
excerpt: >-
  We're releasing a new search for neon.com. Results for the docs, API
  reference, guides, changelog and blog now come from our own search service:
  Lakebase Search in Lakebase Postgres, served by a Neon Function.
date: '2026-10-21T12:00:00'
updatedOn: '2026-10-21T12:00:00'
category: product
categories:
  - product
authors:
  - andre-landgraf
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/neon-docs-search-lakebase-search/cover.png'
  alt: 'Neon docs search is now powered by Lakebase Search'
isFeatured: false
seo:
  title: 'Neon docs search is now powered by Lakebase Search - Neon'
  description: The search on neon.com now runs on our own service, built with Lakebase Search on Neon
  keywords: []
  noindex: false
  ogTitle: 'Neon docs search is now powered by Lakebase Search - Neon'
  ogDescription: The search on neon.com now runs on our own service, built with Lakebase Search on Neon
  image: 'https://cdn.neonapi.io/public/images/pages/blog/neon-docs-search-lakebase-search/cover.png'
---

We're releasing a new search for neon.com. Open the search on any docs page (or press Cmd+K) and the results now come from [Lakebase Search](https://neon.com/docs/ai/lakebase-search), running on Neon. The docs, API reference, PostgreSQL tutorial, guides, FAQs, changelog and blog all live in one index.

Until this week, the search box ran on a hosted search vendor and it worked well for us. We moved to our own service because Neon now ships Postgres-native search and our own docs should run on it.

## What is Lakebase Search

Lakebase Search adds vector, keyword and hybrid search to Lakebase Postgres through Postgres extensions:

- `lakebase_vector` adds the `lakebase_ann` index for vector similarity search. It uses the same `vector` types and operators as `pgvector`.
- `lakebase_text` adds the `lakebase_bm25` index for BM25 keyword search on standard `tsvector` columns, with the top-K pushdown that GIN lacks.
- `lakebase_tokenizer` manages synonyms and stop words as SQL tables.

The indexes live in object storage, so they're available right after a cold start and show up on every new branch without a rebuild. If you want the full story, the [launch post](https://neon.com/blog/lakebase-search-on-neon) covers how the indexes work, the [GA post](https://neon.com/blog/lakebase-search-retrieval-agents) covers retrieval for agents and [BM25 is only as good as your tokens](https://neon.com/blog/bm25-is-only-as-good-as-your-tokens) covers custom dictionaries.

## Why we built our own

The first reason is dogfooding. If we tell you to keep search in Postgres, our own search should live in Postgres too.

The second reason is personal. I build applications; I'm not a search engineer. I don't usually feel qualified to pick index types, tune BM25 or decide how to merge vector and keyword rankings. It turns out I didn't have to. Lakebase Search is SQL I already know: a column, an index and an `ORDER BY`. Here are the two indexes behind neon.com search:

```sql
CREATE INDEX search_chunks_tsv_bm25 ON search_chunks USING lakebase_bm25 (tsv);
CREATE INDEX search_chunks_embedding_ann ON search_chunks USING lakebase_ann (embedding vector_cosine_ops);
```

The `neon-postgres` [agent skill](https://neon.com/docs/ai/agent-skills) now includes the Lakebase Search instructions, so my coding agent knew the extensions, the query syntax and how to combine both rankings with reciprocal rank fusion (RRF). With today's models and that skill, a custom hybrid search on Postgres is something an application builder can ship.

## How it works

The whole service runs on Neon:

- **Index:** neon.com publishes every page as markdown. An ingest step splits each page into chunks by heading, generates an embedding per chunk through [Neon AI Gateway](https://neon.com/docs/ai-gateway/overview) and stores the text, the embedding and a `tsvector` in one Lakebase Postgres table.
- **Serve:** a [Neon Function](https://neon.com/docs/compute/functions/overview) runs a [Hono](https://hono.dev/) API. The website's search route forwards each query to it.
- **Stay current:** when a docs change merges in the [website repo](https://github.com/neondatabase/website), a GitHub Action sends the changed pages to the Function, which re-indexes them.

Search-as-you-type sends a request on every keystroke and an embedding call per keystroke would be too slow, so the semantic part is cached. For common queries, we precompute result lists offline with hybrid search (vector and BM25 merged with RRF) plus an LLM rerank. Queries the cache hasn't seen fall back to BM25 alone. Either way, the Function answers in a few milliseconds.

That's the trade-off: a long-tail query gets keyword ranking instead of the full hybrid pipeline. For a search box that updates on every keystroke, we'll take the speed.

## Get started

Install the Neon agent skills:

```bash
npx skills add neondatabase/agent-skills -y
```

Then give your agent this prompt:

```text
Tell me about Lakebase Search on Neon and when to use vector, BM25 or hybrid
search. Then look at my app's data and propose a search setup: which tables
and columns to index, the SQL to enable lakebase_vector and lakebase_text,
and a hybrid query I can call from my API. Wait for my approval before
changing anything.
```

Try the result on [neon.com/docs](https://neon.com/docs) and let us know in [Discord](https://neon.com/discord) what you'd like it to find better.

Happy coding!
