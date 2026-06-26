---
title: 'Migrate from pg_search to lakebase_text'
subtitle: 'Move BM25 full-text search from the deprecated pg_search extension to the lakebase_text extension'
enableTableOfContents: true
---

<Admonition type="warning" title="pg_search is deprecated">
`pg_search` (ParadeDB) is deprecated on Neon: new installs are blocked, and existing installs will be removed in **September 2026**. [`lakebase_text`](/docs/extensions/lakebase-text) is its replacement for BM25 search.
</Admonition>

This guide migrates your BM25 full-text search from `pg_search` to `lakebase_text`. You map your existing indexes and queries to their `lakebase_text` equivalents, verify the results, then remove `pg_search`. `lakebase_text` runs BM25 search through a `lakebase_bm25` index built on standard Postgres `tsvector` types.

## What changes

`pg_search` and `lakebase_text` both do BM25 search, but they model it differently:

|                  | `pg_search` (ParadeDB)                                                                     | `lakebase_text`                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Index            | `USING bm25 (col1, col2) WITH (key_field='id')`: indexes raw columns, tokenizes internally | `USING lakebase_bm25 (body_tsv)`: indexes a `tsvector` column you build with `to_tsvector` |
| Query operator   | `col @@@ 'query'` (filters and ranks at once)                                              | `@@ to_tsquery('query')` to filter, `<@> to_bm25query(…, 'index_name')` to rank            |
| Ranking          | `paradedb.score(id)` with `ORDER BY score DESC` (higher = better)                          | `<@>` returns a negative score with `ORDER BY score ASC` (lower = better)                  |
| Multiple columns | one index over several columns                                                             | combine the columns into one `tsvector`                                                    |
| Tokenization     | internal (ICU, Lindera, language stemmers)                                                 | Postgres text-search configurations (`'english'`, and others)                              |

The core shift: `pg_search` indexes your columns directly, while `lakebase_text` indexes a `tsvector` that you build (usually a generated column). You tokenize with `to_tsvector` and query with `to_bm25query` and the `<@>` operator.

<Steps>

## Enable lakebase_text

Before you migrate, `lakebase_text` needs to be enabled on your project. Check what's loaded:

```sql
SHOW shared_preload_libraries;
```

If `lakebase_text` is in the list, create the extension and you're ready:

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_text;
```

If it isn't, enabling it is a one-time setup: add `lakebase_text` to your project's preloaded libraries with the Neon API, restart the compute, then create the extension. The [Get started with Lakebase Search](/docs/ai/lakebase-search-get-started) guide has the full steps; for this migration you only need `lakebase_text`, not `lakebase_vector`. Leave `pg_search` enabled while you migrate.

## Migrate the index

The examples below use a `mock_items(description, category)` table as a stand-in for your existing table. Substitute your own table and column names.

With `pg_search`, you create a BM25 index over your columns and designate a `key_field`:

```sql
-- pg_search
CREATE INDEX mock_items_search ON mock_items
  USING bm25 (id, description, category) WITH (key_field = 'id');
```

With `lakebase_text`, you build a `tsvector` from the same columns and index that. A `GENERATED ALWAYS` column keeps it in sync as rows change:

```sql
-- lakebase_text
ALTER TABLE mock_items ADD COLUMN search_tsv tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(description, '') || ' ' || coalesce(category, ''))) STORED;

CREATE INDEX mock_items_bm25 ON mock_items USING lakebase_bm25 (search_tsv);
```

To search a single column instead of several, point `to_tsvector` at just that column. BM25 scores depend on corpus statistics gathered at build time, so create the index after your data is loaded, and run `VACUUM` after large bulk loads to keep scores accurate.

## Migrate your queries

`pg_search` queries a column with the `@@@` operator and ranks with `paradedb.score()`, highest first:

```sql
-- pg_search
SELECT id, description, paradedb.score(id) AS score
FROM mock_items
WHERE description @@@ 'keyboard'
ORDER BY score DESC;
```

```
 id |         description          |   score
----+------------------------------+-----------
  2 | Blue metal keyboard          | 0.8236319
  3 | Wireless ergonomic keyboard  | 0.8236319
```

`lakebase_text` splits the two jobs `@@@` did at once: filter the matching rows with the standard `@@` operator, and rank them with `<@>` and `to_bm25query` (which takes the index name). Scores are negative, so order ascending to put the best matches first:

```sql
-- lakebase_text
SELECT id, description,
  search_tsv <@> to_bm25query(to_tsvector('english', 'keyboard'), 'mock_items_bm25') AS score
FROM mock_items
WHERE search_tsv @@ to_tsquery('english', 'keyboard')
ORDER BY score
LIMIT 10;
```

```
 id |         description          |        score
----+------------------------------+---------------------
  2 | Blue metal keyboard          | -0.8374048792080783
  3 | Wireless ergonomic keyboard  | -0.8374048792080783
```

Three things to carry across every query. First, **filter with `@@`**: `<@>` only scores, it doesn't filter, so without the `@@ to_tsquery(...)` clause every row comes back (non-matches at score 0). Second, pass the **index name** to `to_bm25query` (BM25 scoring reads corpus statistics from the index). Third, **reverse the sort**: `pg_search` uses `ORDER BY score DESC`, while `lakebase_text` uses `ORDER BY score` (ascending), because a lower, more negative score means a better match.

For multi-word or user-supplied input, use `websearch_to_tsquery('english', 'your query')` in place of `to_tsquery` in both the filter and the rank. `to_tsquery` expects pre-formatted query syntax and errors on plain phrases with spaces.

## Check for feature gaps

Before you drop `pg_search`, confirm the features you rely on carry over. A few don't map one-to-one:

- **Fuzzy / typo matching** (`paradedb.match(..., distance => 1)`): no direct equivalent. Use [`pg_trgm`](/docs/extensions/pg_trgm) for similarity and typo-tolerant matching.
- **Highlighting** (`paradedb.snippet()`): use Postgres [`ts_headline()`](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-HEADLINE).
- **JSON query objects and advanced tokenizers** (ICU, Lindera): not supported. Use `tsquery` operators (`&`, `|`, `<->`) and Postgres text-search configurations.

## Remove pg_search

Once your queries run on `lakebase_text` and return the results you expect, drop `pg_search` ahead of the September 2026 removal:

```sql
DROP EXTENSION pg_search CASCADE;
```

`CASCADE` also drops the `bm25` indexes that depend on the extension. Confirm the extension is gone:

```sql
SELECT extname FROM pg_extension WHERE extname = 'pg_search';   -- returns no rows
```

Then restart the compute to finalize the change. In the [Neon Console](https://console.neon.tech), open the compute's **⋯** menu and select **Restart compute** (available while the compute is active; a suspended compute picks up the change on its next wake), or call the [Restart compute endpoint](https://api-docs.neon.tech/reference/restartprojectendpoint) API.

`pg_search` stays in `shared_preload_libraries` (still preloaded at startup), but with the extension dropped it's inert. Neon removes it from the preload list when `pg_search` reaches end-of-life in September 2026.

</Steps>

## Resources

- [The lakebase_text extension](/docs/extensions/lakebase-text)
- [The pg_search extension](/docs/extensions/pg_search) (deprecated)
- [Lakebase Search](/docs/ai/lakebase-search)
