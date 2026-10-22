---
title: Neon docs search is now powered by Lakebase Search
description: 'The search on neon.com now runs fully on Neon primitives: Lakebase Search, Neon Functions, Neon AI Gateway and Lakebase Postgres'
excerpt: >-
  We just released a new search for neon.com. Results for the docs, API
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
  description: 'The search on neon.com now runs fully on Neon primitives: Lakebase Search, Neon Functions, Neon AI Gateway and Lakebase Postgres'
  keywords: []
  noindex: false
  ogTitle: 'Neon docs search is now powered by Lakebase Search - Neon'
  ogDescription: 'The search on neon.com now runs fully on Neon primitives: Lakebase Search, Neon Functions, Neon AI Gateway and Lakebase Postgres'
  image: 'https://cdn.neonapi.io/public/images/pages/blog/neon-docs-search-lakebase-search/cover.png'
---

We recently launched [Lakebase Search](https://neon.com/docs/ai/lakebase-search), a set of Postgres extensions for vector, BM25 keyword and hybrid search in Lakebase Postgres. So it was obvious to us that we needed to dogfood it for our own docs search. Until this week, the search box on neon.com ran on a hosted search vendor. Now it's built fully on Neon primitives and powered by Lakebase Search.

In this post, I want to share how it went.

## What is Lakebase Search

Lakebase Search adds vector, keyword and hybrid search to Lakebase Postgres through Postgres extensions:

- `lakebase_vector` adds the `lakebase_ann` index for vector similarity search. It uses the same `vector` types and operators as `pgvector`.
- `lakebase_text` adds the `lakebase_bm25` index for BM25 keyword search on standard `tsvector` columns, with the top-K pushdown that GIN lacks.
- `lakebase_tokenizer` manages synonyms and stop words as SQL tables.

The indexes live in object storage, so they're available right after a cold start and show up on every new branch without a rebuild. The [launch post](https://neon.com/blog/lakebase-search-on-neon) covers how the indexes work, the [GA post](https://neon.com/blog/lakebase-search-retrieval-agents) covers retrieval for agents and [BM25 is only as good as your tokens](https://neon.com/blog/bm25-is-only-as-good-as-your-tokens) covers custom dictionaries.

## How it works

The service runs entirely on Neon. neon.com already publishes every page as markdown, so ingestion mostly means reading those files. Each page gets split into chunks by heading, each chunk gets an embedding through [Neon AI Gateway](https://neon.com/docs/ai-gateway/overview) and the text, embedding and `tsvector` land in one Lakebase Postgres table.

A [Neon Function](https://neon.com/docs/compute/functions/overview) runs a [Hono](https://hono.dev/) API that the website's search route calls. Whenever a docs change merges in the [website repo](https://github.com/neondatabase/website), a GitHub Action sends the changed pages to the Function, which re-indexes them.

![Diagram of neon.com search. Indexing: a merge in the neondatabase/website GitHub repo triggers a GitHub Action that sends changed pages to a Neon Function running a Hono API, which fetches the pages as markdown, chunks them by heading, embeds each chunk through Neon AI Gateway and upserts them into Lakebase Postgres. Search: the neon.com search box calls the website's API route, which forwards the query to the Function's site-search endpoint, which reads cached hybrid results or falls back to BM25 in Lakebase Postgres.](https://cdn.neonapi.io/public/images/pages/blog/neon-docs-search-lakebase-search/how-it-works.png)

## Building search as an application builder

As an app builder, I was comfortable with most of this: setting up the Neon Function, calling AI Gateway for embeddings, wiring up the GitHub Action and the website route. Where I personally don't have expertise is search itself: which algorithms to use, how to structure semantic search, how to merge keyword and semantic matches and what trade-offs each option comes with.

In the past, that's usually the point where a team hired a search specialist or paid a vendor. Today, you point your agent at a good, industry-standard search system and hope for the best. I guess that's what I did and it went great!

Nobody really writes SQL by hand anymore; agents do. So I relied on the `neon-postgres` [agent skill](https://neon.com/docs/ai/agent-skills) and our incredible Lakebase engineering team. My agent walked me through the options: a `lakebase_bm25` index for keyword matches, a `lakebase_ann` index for semantic matches and reciprocal rank fusion (RRF) to merge both rankings. My job was to make the calls and check that the results made sense. These are the two indexes it ended up creating for neon.com:

```sql
CREATE INDEX search_chunks_tsv_bm25 ON search_chunks USING lakebase_bm25 (tsv);
CREATE INDEX search_chunks_embedding_ann ON search_chunks USING lakebase_ann (embedding vector_cosine_ops);
```

Everything we learned along the way went back into the skill and we keep iterating on it. The skill now knows Lakebase Search in detail: the extensions, the index types, the query syntax and how to build hybrid search. So you can trust your agent to make the right search decisions, because they're encoded in the `neon-postgres` skill.

## Designing for search-as-you-type

Docs search has one hard requirement: it has to feel instant. The search box sends a request on every keystroke, so both search paths have to stay under 32 ms at p50 and 150 ms at p95, measured as server time.

Semantic search matters just as much. Many docs queries are questions like "How do Neon branches work?" and the right page doesn't always share their keywords. The full hybrid pipeline finds those pages: an embedding call, `lakebase_ann` and `lakebase_bm25` results merged with RRF, then an LLM rerank. But with two model calls, a request takes seconds.

So we split the work:

- **Cached hybrid results:** for common queries, we run the full hybrid pipeline offline and store the ranked lists in a `site_search_cache` table. Lookups match on the normalized query and its content words, so "what's neon" and "tell me about neon" read the same row.
- **BM25 for everything else:** a query the cache hasn't seen goes straight to the `lakebase_bm25` index, with no model call in the request path.

Today, cache hits take 1.9 ms at p50 and 2.8 ms at p95 on the server. BM25 misses take 8.6 ms and 11.5 ms.

Of course, that's a trade-off: a long-tail query gets keyword ranking without the semantic half. For a search box that updates on every keystroke, I'll take the speed.

## Evaluating relevance and latency

The search service ships with evals and every change to the ranking, the index or the cache has to pass them:

- **Relevance:** 171 golden queries, including the 100 most common queries typed into neon.com search, each paired with the page it should return. We track MRR@5 (how high the expected page ranks) and recall@5 (how often it lands in the top five) against a pinned baseline. A run fails if an expected page drops out of the top five, a cache hit turns into a BM25 miss or MRR@5 falls by more than 0.02.
- **Ranking:** a frozen public benchmark ([NFCorpus](https://huggingface.co/datasets/CohereLabs/beir-embed-english-v3/tree/main/nfcorpus), 323 queries with graded relevance labels) fails any change to the retrieval SQL that lowers nDCG@5.
- **Latency:** after every deploy, a timing eval reads the Function's `Server-Timing` header and fails if the cache or BM25 path goes over budget.

The biggest ranking change ran on a Neon branch of the production database first, so the evals saw real indexes without touching live search. Here's how relevance moved across the baselines we pinned in the week before launch:

![Line chart of search relevance on 171 golden queries across five eval baselines. Recall@5 went from 77.8% at the October 13 baseline to 76.6% after stripping page boilerplate, 78.4% after dropping footers and adding breadcrumbs, 94.7% after category ranking and more content and stayed at 94.7% after exact query rewrites on October 18. MRR@5 went from 0.613 to 0.615, 0.627, 0.760 and 0.764.](https://cdn.neonapi.io/public/images/pages/blog/neon-docs-search-lakebase-search/relevance.png)

The dip is real. Stripping navigation text and frontmatter from the index cost two expected pages and the gate flagged both. We accepted the trade because it cleaned up 97 top-five results that showed boilerplate, frontmatter or stray markdown. The jump came from weighting pages by category and title matches, plus indexing the PostgreSQL tutorial and FAQs. Together, they took recall@5 from 78% to 95%.

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
