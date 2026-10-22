---
title: Neon docs search is now powered by Lakebase Search
description: 'The search on neon.com now runs on our own service, built fully with Neon primitives: Lakebase Search, Neon Functions, Neon AI Gateway and Lakebase Postgres'
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
  description: 'The search on neon.com now runs on our own service, built fully with Neon primitives: Lakebase Search, Neon Functions, Neon AI Gateway and Lakebase Postgres'
  keywords: []
  noindex: false
  ogTitle: 'Neon docs search is now powered by Lakebase Search - Neon'
  ogDescription: 'The search on neon.com now runs on our own service, built fully with Neon primitives: Lakebase Search, Neon Functions, Neon AI Gateway and Lakebase Postgres'
  image: 'https://cdn.neonapi.io/public/images/pages/blog/neon-docs-search-lakebase-search/cover.png'
---

We just released a new search for neon.com. Head to the [Neon docs](https://neon.com/docs), press Cmd+K and give it a try. The results now come from [Lakebase Search](https://neon.com/docs/ai/lakebase-search) running on Neon. The docs, API reference, PostgreSQL tutorial, guides, FAQs, changelog and blog all live in one index.

Until this week, that search box ran on a hosted search vendor. Once we shipped Lakebase Search though, it felt odd to tell everyone to keep their search in Postgres while ours lived somewhere else. So we decided to dogfood it and I got to build it.

In this post, I want to share how that went from the perspective of someone who builds apps for a living and doesn't think of himself as a search person.

## A quick refresher on Lakebase Search

Lakebase Search adds vector, keyword and hybrid search to Lakebase Postgres through Postgres extensions:

- `lakebase_vector` adds the `lakebase_ann` index for vector similarity search. It uses the same `vector` types and operators as `pgvector`.
- `lakebase_text` adds the `lakebase_bm25` index for BM25 keyword search on standard `tsvector` columns, with the top-K pushdown that GIN lacks.
- `lakebase_tokenizer` manages synonyms and stop words as SQL tables.

The indexes live in object storage, so they're available right after a cold start and show up on every new branch without a rebuild. The [launch post](https://neon.com/blog/lakebase-search-on-neon) covers how the indexes work, the [GA post](https://neon.com/blog/lakebase-search-retrieval-agents) covers retrieval for agents and [BM25 is only as good as your tokens](https://neon.com/blog/bm25-is-only-as-good-as-your-tokens) covers custom dictionaries.

## Building search as an application builder

I'm an application builder and Postgres internals have never been my area. When it comes to search, I don't usually feel like I have the background to make the deep decisions: which index types to use, how to rank results or how to merge keyword and semantic matches into one list. That's usually the point where a team hires a search specialist or pays a vendor.

I also didn't write the SQL. Nobody really writes SQL by hand anymore; agents do. So the real question was whether my agent could pick up Lakebase Search well enough to guide me through those decisions.

It could, mostly thanks to the `neon-postgres` [agent skill](https://neon.com/docs/ai/agent-skills). The skill now knows Lakebase Search in detail: the extensions, the index types, the query syntax and how to build hybrid search. My agent walked me through the options: a `lakebase_bm25` index for keyword matches, a `lakebase_ann` index for semantic matches and reciprocal rank fusion (RRF) to merge both rankings. My job was to make the calls and check that the results made sense.

These are the two indexes it ended up creating for neon.com:

```sql
CREATE INDEX search_chunks_tsv_bm25 ON search_chunks USING lakebase_bm25 (tsv);
CREATE INDEX search_chunks_embedding_ann ON search_chunks USING lakebase_ann (embedding vector_cosine_ops);
```

## How it works

The service runs entirely on Neon. neon.com already publishes every page as markdown, so ingestion mostly means reading those files. Each page gets split into chunks by heading, each chunk gets an embedding through [Neon AI Gateway](https://neon.com/docs/ai-gateway/overview) and the text, embedding and `tsvector` land in one Lakebase Postgres table.

A [Neon Function](https://neon.com/docs/compute/functions/overview) runs a [Hono](https://hono.dev/) API that the website's search route calls. Whenever a docs change merges in the [website repo](https://github.com/neondatabase/website), a GitHub Action sends the changed pages to the Function, which re-indexes them.

![Diagram of neon.com search. Indexing: a merge in the neondatabase/website GitHub repo triggers a GitHub Action that sends changed pages to a Neon Function running a Hono API, which fetches the pages as markdown, chunks them by heading, embeds each chunk through Neon AI Gateway and upserts them into Lakebase Postgres. Search: the neon.com search box calls the website's API route, which forwards the query to the Function's site-search endpoint, which reads cached hybrid results or falls back to BM25 in Lakebase Postgres.](https://cdn.neonapi.io/public/images/pages/blog/neon-docs-search-lakebase-search/how-it-works.png)

The most interesting decision came from the search box itself. Search-as-you-type sends a request on every keystroke and calling an embedding model on every keystroke is too slow. So we cache the semantic part. For common queries, we precompute the results offline with hybrid search plus an LLM rerank. Anything the cache hasn't seen falls back to BM25 alone. Either way, the Function answers in a few milliseconds.

Of course, that's a trade-off: a long-tail query gets keyword ranking without the semantic half. For a search box that updates on every keystroke, I'll take the speed.

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

Try the new search on [neon.com/docs](https://neon.com/docs) and let us know in [Discord](https://neon.com/discord) what it should find better.

Happy coding!
