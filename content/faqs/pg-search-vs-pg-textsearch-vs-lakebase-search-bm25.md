---
title: "pg_search vs pg_textsearch vs Lakebase Search: which BM25 extension should I use for Postgres?"
subtitle: "All three add real BM25 ranking to Postgres. The choice mostly comes down to where your database runs: lakebase_text on Neon, pg_textsearch on Tiger Cloud or self-managed Postgres 17 and 18, and ParadeDB's pg_search when you want a search-engine feature set and can host it."
createdAt: '2026-11-13T00:00:00.000Z'
updatedOn: '2026-11-13T22:54:32.784Z'
isDraft: false
previousLink:
  title: 'Is there an OpenRouter alternative without a markup or credit fee?'
  slug: openrouter-alternative-no-markup-credit-fee
nextLink:
  title: 'What do I do when my pgvector HNSW index no longer fits in memory?'
  slug: pgvector-hnsw-index-too-large-for-memory
---

All three extensions replace `ts_rank` with BM25, which scores matches using term frequency, document length, and how rare each term is across the whole table. They differ in how you index text, which Postgres versions they support, how they're licensed, and where you can run them. Where your database runs usually decides it, because none of the three is available everywhere.

## At a glance

|                   | Lakebase Search (`lakebase_text`) | `pg_textsearch`                 | `pg_search` (ParadeDB)                                                    |
| ----------------- | --------------------------------- | ------------------------------- | ------------------------------------------------------------------------- |
| Built by          | Databricks                        | Tiger Data (formerly Timescale) | ParadeDB                                                                  |
| Indexes           | Existing `tsvector` columns       | `text` columns and expressions  | Columns in a ParadeDB index, with its own tokenizers                      |
| Postgres versions | 16 and later                      | 17 and 18                       | 15 and later                                                              |
| License           | Included with Neon                | PostgreSQL License              | AGPL-3.0, with commercial licenses available                              |
| Managed hosting   | Neon, preloaded by default        | Tiger Cloud                     | ParadeDB Cloud and BYOC                                                   |
| Top-K pushdown    | Block-Max WAND                    | Block-Max WAND                  | Yes, see [Top K](https://www.paradedb.com/docs/reference/full-text/top-k) |
| Available on Neon | Yes                               | No                              | No, retired from Neon on September 21, 2026                               |

Sources: [Lakebase Search](/docs/ai/lakebase-search), [`lakebase_text`](/docs/extensions/lakebase-text), [pg_textsearch README](https://github.com/timescale/pg_textsearch), [Tiger Data hybrid search tutorial](https://www.tigerdata.com/docs/learn/tutorials/hybrid-search), [pg_textsearch license](https://github.com/timescale/pg_textsearch/blob/main/LICENSE), [ParadeDB README](https://github.com/paradedb/paradedb), [ParadeDB self-hosted install](https://www.paradedb.com/docs/operate/deploy/self-hosted/extension), [Neon extensions](/docs/extensions/pg-extensions).

## The same query in each

**Lakebase Search** adds a `lakebase_bm25` index to the `tsvector` column you may already have for full-text search. Your `to_tsvector` calls and text-search configurations stay the same ([quick start](/docs/extensions/lakebase-text#quick-start)):

```sql
CREATE INDEX articles_bm25 ON articles USING lakebase_bm25 (body_tsv);

SELECT id, title
FROM articles
ORDER BY body_tsv <@> to_bm25query(to_tsvector('english', 'reset password'), 'articles_bm25')
LIMIT 10;
```

**pg_textsearch** indexes a `text` column directly and takes a Postgres text-search configuration as an index option. It needs `pg_textsearch` in `shared_preload_libraries` ([README](https://github.com/timescale/pg_textsearch)):

```sql
CREATE INDEX articles_bm25 ON articles USING bm25 (body) WITH (text_config = 'english');

SELECT id, title
FROM articles
ORDER BY body <@> 'reset password'
LIMIT 10;
```

**pg_search** builds a ParadeDB index and queries it with its own operators, such as `|||` for match and `pdb.score()` for the BM25 score. It also needs `pg_search` in `shared_preload_libraries` ([BM25 scoring](https://www.paradedb.com/docs/reference/full-text/score)):

```sql
SELECT id, title, pdb.score(id)
FROM articles
WHERE body ||| 'reset password'
ORDER BY pdb.score(id) DESC
LIMIT 10;
```

In both `lakebase_text` and `pg_textsearch`, `<@>` returns a negative BM25 score, so ascending order puts the most relevant row first.

## Which one to pick

- **Your database is on Neon**: use `lakebase_text`. It's the only one of the three that Neon runs, and the library is preloaded, so `CREATE EXTENSION lakebase_text;` is the only setup ([enable the extension](/docs/extensions/lakebase-text#enable-the-lakebase_text-extension)). If you already search with `tsvector` and GIN, you keep your columns and queries and change the index.
- **You're on Tiger Cloud or run your own Postgres 17 or 18**: `pg_textsearch` has the shortest syntax and a permissive license. Self-hosting means installing the binary and restarting with the preload setting.
- **You want a search engine inside Postgres**: `pg_search` has the widest feature set: many tokenizers (n-grams, ICU, Jieba, Lindera, source code, and more), highlighting, facets and aggregations, columnar storage for filters, and vector search in the same index ([tokenizers](https://www.paradedb.com/docs/reference/tokenizers/overview)). Run it on ParadeDB Cloud, BYOC, Kubernetes, your own Postgres, or a PaaS such as Railway or Render ([deployment options](https://www.paradedb.com/docs/operate/deploy/overview)). Check whether AGPL-3.0 works for you before self-hosting the Community edition.

## Hybrid search

BM25 misses synonyms and paraphrases, so most apps pair it with vector search and merge the two rankings with Reciprocal Rank Fusion (RRF). On Neon, [`lakebase_vector`](/docs/extensions/lakebase-vector) keeps your `pgvector` types and operators, so a BM25 query and a vector query fuse in one SQL statement ([hybrid search](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search)). ParadeDB documents RRF across its own text and vector search ([hybrid search](https://www.paradedb.com/docs/reference/hybrid/overview)), and Tiger Data pairs `pg_textsearch` with `pgvectorscale` ([tutorial](https://www.tigerdata.com/docs/learn/tutorials/hybrid-search)).

If you're moving a `pg_search` workload to Neon, rebuild the search index with `lakebase_text` on a `tsvector` column. For a full walkthrough, see [How do I get BM25 relevance ranking in Postgres full-text search?](/faqs/bm25-relevance-ranking-postgres-full-text-search) and [What is the best way to do hybrid search (BM25 plus vector) in Postgres?](/faqs/best-way-hybrid-search-bm25-vector-postgres).

Vendor details verified on 2026-11-13 against the linked pages.

<CTA title="Add BM25 search on Neon" description="Enable lakebase_text and rank full-text results with BM25 on your existing tsvector columns." buttonText="Lakebase Search quickstart" buttonUrl="/docs/ai/lakebase-search-get-started" />
