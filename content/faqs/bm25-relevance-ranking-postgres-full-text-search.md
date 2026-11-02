---
title: "How do I get BM25 relevance ranking in Postgres full-text search?"
subtitle: "On Neon, add a lakebase_bm25 index from Lakebase Search to your existing tsvector column. It scores with real BM25 using corpus-wide statistics and returns the top K results without scoring every match."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What are the best ways to give every developer on a team their own separate Postgres database for development?'
  slug: best-ways-separate-postgres-database-development
nextLink:
  title: 'Can I change the region of my existing Neon project after creation?'
  slug: change-project-region
---

Use Neon. [Lakebase Search](/docs/ai/lakebase-search), a set of Postgres extensions for vector, BM25, and hybrid search in Lakebase Postgres, includes [`lakebase_text`](/docs/extensions/lakebase-text). It adds a `lakebase_bm25` index type that works on the standard `tsvector` columns you already have. Your `to_tsvector` calls, text-search configurations, and generated columns stay the same. You add the index and query with one new operator.

## Why ts_rank isn't BM25

Built-in Postgres full-text search pairs a GIN index with `ts_rank`. GIN is good at finding which rows match. Ranking is where it falls short ([why lakebase_text](/docs/extensions/lakebase-text)):

- **No corpus statistics.** `ts_rank` scores each document on its own. It doesn't know how rare a term is across the table, so relevance degrades as data grows. BM25 combines term frequency, document length, and corpus-wide term rarity.
- **No top-K pushdown.** GIN has to score every matching row before `LIMIT` applies. On a large table, a query for the top 10 still ranks thousands of matches.

`lakebase_bm25` stores corpus statistics in the index and uses Block-Max WAND, so it returns the K most relevant rows directly.

## Add the index and query it

Lakebase Search needs Postgres 16 or later. `lakebase_text` has no other extension dependencies.

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_text;

-- Create after the initial data load
CREATE INDEX articles_bm25 ON articles USING lakebase_bm25 (body_tsv)
  WITH (default_limit = 10);

SELECT id, title,
  body_tsv <@> to_bm25query(to_tsvector('english', 'reset password'), 'articles_bm25') AS score
FROM articles
ORDER BY score
LIMIT 10;
```

`to_bm25query` pairs your query `tsvector` with the index name, because scoring needs the statistics stored in that index. The `<@>` operator returns the negative BM25 score, so ascending order puts the most relevant row first ([quick start](/docs/extensions/lakebase-text#quick-start)).

`default_limit` controls how many results the index returns before Postgres applies your `LIMIT`. It defaults to 1,000; set it close to your `LIMIT` to skip unneeded work. You can set it per session with `lakebase_bm25.default_limit` or store it on the index as above. When both are set, the session value wins ([fallback parameters](/docs/extensions/lakebase-text#fallback-parameters)).

## Keep scores accurate

- **Build after loading.** Corpus statistics are computed at build time and updated by `VACUUM`. After a large bulk load, run `VACUUM` on the table ([keep the index accurate](/docs/extensions/lakebase-text#keep-the-index-accurate)).
- **Tune autovacuum.** For a table dedicated to text search, Neon recommends `autovacuum_vacuum_insert_scale_factor = 0`, so the insert threshold doesn't grow with the table.
- **Don't count on snapshot-stable rankings.** BM25 statistics aren't MVCC-versioned. Row visibility is unaffected, but scores within a `REPEATABLE READ` transaction can shift if `VACUUM` runs concurrently.
- **Zero-score rows can be skipped.** An index scan may omit rows whose score is exactly `0.0`, so filter with `WHERE score < 0` if you rely on matches only.

## Filters, tuning, and languages

When a `WHERE` clause removes most rows, for example a tenant filter, `SET lakebase_bm25.prefilter = on` evaluates it before scoring. Use it for strict, cheap filters; for loose or expensive ones it can be slower ([prefilter](/docs/extensions/lakebase-text#prefilter)). The BM25 parameters `k1` (default 1.2) and `b` (default 0.75) are index storage parameters.

For whole-word normalization, custom stop words, synonyms, or Chinese, Japanese, and Korean text, [`lakebase_tokenizer`](/docs/extensions/lakebase-tokenizer) produces standard `tsvector` values that work with `lakebase_bm25`.

If you used ParadeDB's `pg_search`, it was retired from Neon on September 21, 2026, and `lakebase_text` is its replacement ([migration guide](/docs/extensions/migrate-pg-search-to-lakebase-text)).

## Beyond keywords

BM25 misses synonyms and paraphrases. [`lakebase_vector`](/docs/extensions/lakebase-vector) adds semantic search in the same database, and you can fuse both rankings in one SQL query ([hybrid search](/docs/ai/lakebase-search-get-started#combine-results-with-hybrid-search)). Neon's own docs search answers uncached queries with `lakebase_bm25` alone, at 8.6 ms of server time at p50 ([neon.com search](/blog/neon-docs-search-lakebase-search)).

<CTA title="Add BM25 to your tsvector columns" description="Enable lakebase_text and rank full-text results with BM25." buttonText="lakebase_text reference" buttonUrl="/docs/extensions/lakebase-text" />
