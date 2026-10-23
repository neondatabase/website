---
title: Neon Docs search is now built on Neon
description: 'The search on neon.com now runs fully on Neon primitives: Lakebase Search, Neon Functions, Neon AI Gateway and Lakebase Postgres'
excerpt: >-
  We just released a new search for neon.com. Results for the docs, API
  reference, guides, changelog and blog now come from our own search service:
  Lakebase Search in Lakebase Postgres, served by a Neon Function.
date: '2026-10-26T12:00:00'
updatedOn: '2026-10-26T12:00:00'
category: product
categories:
  - product
authors:
  - andre-landgraf
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/neon-docs-search-lakebase-search/cover-v2.png'
  alt: 'Neon Docs search is now built on Neon'
isFeatured: false
seo:
  title: 'Neon Docs search is now built on Neon - Neon'
  description: 'The search on neon.com now runs fully on Neon primitives: Lakebase Search, Neon Functions, Neon AI Gateway and Lakebase Postgres'
  keywords: []
  noindex: false
  ogTitle: 'Neon Docs search is now built on Neon - Neon'
  ogDescription: 'The search on neon.com now runs fully on Neon primitives: Lakebase Search, Neon Functions, Neon AI Gateway and Lakebase Postgres'
  image: 'https://cdn.neonapi.io/public/images/pages/blog/neon-docs-search-lakebase-search/cover-v2.png'
---

We recently launched [Lakebase Search](https://neon.com/docs/ai/lakebase-search), a set of Postgres extensions for vector, BM25 keyword and hybrid search in Lakebase Postgres. So it was obvious to us that we needed to dogfood it for our own docs search. Until this week, the search box on neon.com ran on a hosted search vendor. Now it's built fully on Neon primitives and powered by Lakebase Search. In this post, I want to share how it went.

## What is Lakebase Search

[Lakebase Search](https://neon.com/docs/ai/lakebase-search) brings scalable vector and BM25 full-text search to Lakebase Postgres through two extensions:

- `lakebase_vector` is a `pgvector`-compatible extension for vector search. Your existing types, operators and queries keep working, but the index needs a fraction of the memory of HNSW (under 10 GB for 100M vectors, where HNSW needs about 300 GB) and scales to over a billion vectors.
- `lakebase_text` brings BM25 to Postgres. Native Postgres full-text search ranks matches with `ts_rank`, which scores each document on its own. BM25, the industry-standard ranking for keyword search, also weighs how rare each term is across all documents and how long each document is, so the most relevant results rise to the top. `lakebase_text` works on standard `tsvector` columns and returns the top results without scoring every match.

Both extensions ship new index types: `lakebase_ann` for vectors and `lakebase_bm25` for text. They're designed for the lakebase architecture, where compute and storage are separated.

Because both indexes live in the same Postgres as your data, hybrid search is just SQL: one query, joined with your operational tables, in one transaction. Read more about Lakebase Search in the [launch post](https://neon.com/blog/lakebase-search-on-neon), which explains why and how we built it.

## How it works

Neon Docs search is a standalone service that runs as its own Neon project. It uses three Neon services:

- **[Lakebase Postgres](https://neon.com/docs/introduction/neon-and-lakebase)** stores the page chunks, their embeddings and the Lakebase Search indexes.
- **[Neon Functions](https://neon.com/docs/compute/functions/overview)** run a [Hono](https://hono.dev/) API that ingests changed pages and answers search requests.
- **[Neon AI Gateway](https://neon.com/docs/ai-gateway/overview)** generates the embeddings and reranks hybrid results.

![Diagram of neon.com search. Indexing: a merge in the neondatabase/website GitHub repo triggers a GitHub Action that sends changed pages to a Neon Function running a Hono API, which fetches the pages as markdown, chunks them by heading, embeds each chunk through Neon AI Gateway and upserts them into Lakebase Postgres. Search: the neon.com search box calls the website's API route, which forwards the query to the Function's site-search endpoint, which reads cached hybrid results or falls back to BM25 in Lakebase Postgres.](https://cdn.neonapi.io/public/images/pages/blog/neon-docs-search-lakebase-search/how-it-works.png)

To ingest the site, we needed a clean representation of its content, like markdown. Thanks to our agent experience work, neon.com already publishes every page as markdown (try [neon.com/pricing.md](https://neon.com/pricing.md)). So ingestion mostly means getting notified when production content changes. Whenever a change merges in the [website repo](https://github.com/neondatabase/website), a GitHub Action sends the changed pages to the Function. The Function fetches each page as markdown, splits it into chunks by heading, gets an embedding per chunk through AI Gateway and writes the text, embedding and `tsvector` to one Lakebase Postgres table.

The same Function serves a `/site-search` endpoint, which the website's search route calls for every query. The index holds seven kinds of content: docs, the API reference, the PostgreSQL tutorial, guides, FAQs, the changelog and blog posts. When we index a page, we tag it with its category based on the URL. That way, a search can ask for only docs and API reference results:

```json
{ "query": "create branch", "categories": ["docs", "api"] }
```

## Building search as an application builder

As an app builder, I was comfortable with most of this: setting up the Neon Function, calling AI Gateway for embeddings, wiring up the GitHub Action and the website route. Where I personally don't have expertise is search itself: which algorithms to use, how to structure semantic search, how to merge keyword and semantic matches and what trade-offs each option comes with. In the past, this is where I'd reach for Algolia or another search provider.

This time, I relied on my agent and the `neon-postgres` [agent skill](https://neon.com/docs/ai/agent-skills). Our incredible Lakebase engineering team had already put their search knowledge into the skill. So my agent walked me through the options: a `lakebase_bm25` index for keyword matches, a `lakebase_ann` index for semantic matches and reciprocal rank fusion (RRF) to merge both rankings. My job was to make the calls and check that the results made sense. The result matches or beats our previous search experience.

## Designing for search-as-you-type

Docs search has to feel instant. The search box sends a request on every keystroke, so both search paths have to stay under 32 ms at p50 and 150 ms at p95 of server time.

Semantic search matters too: questions like "How do Neon branches work?" don't always share keywords with the right page. The full hybrid pipeline (an embedding call, `lakebase_ann` and `lakebase_bm25` results merged with RRF, then an LLM rerank) finds those pages, but its two model calls take seconds. So we split the work:

- **Cached hybrid results:** we run the full pipeline offline for common queries and store the ranked lists in a `site_search_cache` table. Lookups match on the normalized query and its content words, so "what's neon" and "tell me about neon" read the same row.
- **BM25 for everything else:** queries the cache hasn't seen go straight to the `lakebase_bm25` index, with no model call.

Cache hits take 1.9 ms at p50 and 2.8 ms at p95 on the server; BM25 misses take 8.6 ms and 11.5 ms. Of course, long-tail queries get keyword ranking without the semantic half. For docs search, I want speed first.

That said, we wanted the new search to be at least as good as the old one in both result quality and speed.

## Evaluating relevance and latency

With search, you have to verify that it performs where you want it to: does the right page show up and how long does a search take? That matters even more once you keep changing things, because every tweak to the ranking or the index can quietly hurt results you already had.

It was incredibly easy for my agent to set up a few baseline and regression benchmarks for this. They also told us when the new search matched or beat our previous one:

- **Hit rate:** 171 real queries, including the most common searches on neon.com, each paired with the page it should return. A change fails if an expected page falls out of the top five.
- **Ranking quality:** a public search benchmark ([NFCorpus](https://huggingface.co/datasets/CohereLabs/beir-embed-english-v3/tree/main/nfcorpus)) with labeled results, so changes to the search SQL can't make rankings worse.
- **Speed:** after every deploy, we time the search and fail if either path goes over its budget.

The biggest ranking change ran on a Neon branch of the production database first, so the evals saw real indexes without touching live search. Here's how the new search compares to our previous one on the same queries:

![Bar chart comparing the new and previous neon.com search on the same queries, run on October 23. On 153 golden queries, excluding answers that only live in the PostgreSQL tutorial, the new search returns the right page in the top five for 94.1% of queries versus 79.7% and as the first result for 58.8% versus 54.2%. Over 342 requests per engine from the same client, the search round trip is 210 ms versus 202 ms at p50 and 333 ms versus 380 ms at p95.](https://cdn.neonapi.io/public/images/pages/blog/neon-docs-search-lakebase-search/compare.png)

The new search finds the right page in the top five for 94% of queries, where the previous search found it for 80%. We left out queries whose answer only lives in the PostgreSQL tutorial, since the previous search rarely returned those pages. Round trips take about the same time on both. Almost all of it is network: the Function itself spends single-digit milliseconds on each search.

## Try it on your own data

If I can build hybrid search for neon.com, your agent can build it for your app. Install the Neon agent skills:

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

To see the result, head to the [Neon docs](https://neon.com/docs), press Cmd+K and give the new search a try. Let us know in [Discord](https://neon.com/discord) what it should find better.

Happy coding!
