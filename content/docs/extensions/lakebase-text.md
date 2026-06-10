---
title: The lakebase_text extension
subtitle: BM25 full-text search for Neon Postgres
summary: >-
  The lakebase_text extension adds the lakebase_bm25 index type to Neon Postgres
  for BM25 full-text search. It requires no migration from PostgreSQL's built-in
  full-text search — standard tsvector types and tsquery operators work unchanged.
  Use this page to enable the extension, create a lakebase_bm25 index, query
  with the <&> operator and to_bm25query function, configure the default_limit
  and prefilter GUCs, set fallback parameters at the index level, and reference
  all types, operators, functions, and index parameters.
enableTableOfContents: true
updatedOn: '2026-06-09T20:13:02.957Z'
---

<EarlyAccessProps feature_name="lakebase_text" />

The `lakebase_text` extension adds a `lakebase_bm25` index type to Postgres for [BM25](https://en.wikipedia.org/wiki/Okapi_BM25) full-text search. It is a native upgrade to PostgreSQL's built-in full-text search: standard `tsvector` types and query operators work unchanged; only the index type changes.

Lakebase Search is in private preview. To request access or learn about its architecture advantages, see [Lakebase Search](/docs/ai/lakebase-search).

## Why lakebase_text?

PostgreSQL's built-in full-text search uses GIN indexes with `tsvector`. GIN works well for boolean filtering, but it has two limitations for search relevance:

- **No BM25 ranking.** GIN uses `ts_rank`, a TF-IDF variant that scores documents by fetching `tsvector` values from the heap at query time. BM25 is more accurate, accounting for term frequency, document length, and corpus-wide statistics together.
- **No top-K pushdown.** GIN must score all matching documents even when you only need the top 10. For large tables, this means significant unnecessary work on every query.

`lakebase_bm25` adds a first-class BM25 index with Block-Max WAND top-K pushdown: the index returns only the K most relevant results directly, without scoring the entire match set. It fully preserves standard `tsvector` types and existing query operators. No application logic changes are required.

## Enable the lakebase_text extension

Run the following statement in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor):

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_text;
```

`lakebase_text` requires Postgres 16 or later. It has no extension dependencies; unlike `lakebase_vector`, it does not require `pgvector`.

## Quick start

Create a table with a `tsvector` column generated from a text column:

```sql
CREATE TABLE documents (
    id serial PRIMARY KEY,
    passage text,
    vector tsvector GENERATED ALWAYS AS (to_tsvector('english', passage)) STORED
);

INSERT INTO documents (passage) VALUES
('PostgreSQL is a powerful, open-source object-relational database system.'),
('Full-text search is a technique for searching in plain-text documents.'),
('BM25 is a ranking function used by search engines to estimate document relevance.'),
('PostgreSQL provides advanced features like full-text search and window functions.'),
('Effective ranking algorithms like BM25 improve information retrieval results.');
```

Create a `lakebase_bm25` index on the `tsvector` column:

```sql
CREATE INDEX documents_passage_bm25 ON documents USING lakebase_bm25 (vector bm25_ops);
```

<Admonition type="important" title="Create the index after inserting data">
`lakebase_bm25` computes corpus-wide statistics (document count, term frequencies, IDF values) at index build time, not incrementally. Create the index after your initial data load. If you insert a large number of new documents later, drop and recreate the index to keep BM25 scores accurate.
</Admonition>

Set how many results the index returns and run a BM25 search:

```sql
SET lakebase_bm25.default_limit TO 5;

SELECT
  id,
  vector <&> to_bm25query(to_tsvector('english', 'PostgreSQL'), 'documents_passage_bm25') AS score
FROM documents
ORDER BY score
LIMIT 5;
```

The `<&>` operator calculates the negative BM25 score of a document against a query. Ordering by score ascending returns the most relevant documents first (lower negative score = higher relevance).

`to_bm25query` constructs a `bm25query_tsvector` value by combining the query `tsvector` with the object identifier of the BM25 index. The index identifier is required because BM25 scoring depends on corpus-wide statistics stored in the index.

## Configure default_limit

The `lakebase_bm25.default_limit` GUC controls how many results the index returns before PostgreSQL applies any `LIMIT` clause from your query. The default is `1000`.

```sql
-- Return at most 10 results from the index
SET lakebase_bm25.default_limit TO 10;
```

Setting this value to match your query's `LIMIT` avoids unnecessary work when you only need a small top-K result set.

## Fallback parameters

You can store search parameters directly in an index as storage parameters, rather than setting them per session or transaction with GUCs. This is useful when you have multiple indexes, prefer not to set GUCs, or want to configure search behavior offline.

Set `default_limit` at index creation:

```sql
CREATE INDEX documents_passage_bm25 ON documents USING lakebase_bm25 (vector bm25_ops)
WITH (default_limit = 5);
```

Queries against this index use `default_limit = 5` without requiring a `SET` command:

```sql
SELECT
  id,
  vector <&> to_bm25query(to_tsvector('english', 'PostgreSQL'), 'documents_passage_bm25') AS score
FROM documents
ORDER BY score
LIMIT 5;
```

Update a storage parameter on an existing index:

```sql
ALTER INDEX documents_passage_bm25 SET (default_limit = 10);
```

GUCs take precedence over index storage parameters when both are set. To avoid hard-to-diagnose behavior, use only one method at a time.

## Prefilter

In a filtered query, PostgreSQL applies `WHERE` conditions after the index scan returns results. If your filter eliminates many rows, the index may return far more results than your `LIMIT` requires.

The `lakebase_bm25.prefilter` GUC enables the index to evaluate filter conditions before computing BM25 scores, pruning the search space early:

```sql
SET lakebase_bm25.default_limit TO 5;
SET lakebase_bm25.prefilter = on;

SELECT
  id,
  vector <&> to_bm25query(to_tsvector('english', 'PostgreSQL'), 'documents_passage_bm25') AS score
FROM documents
WHERE id % 1000 = 0
ORDER BY score
LIMIT 5;
```

Prefilter is recommended when the filter is **strict** (eliminates many rows) or **unpredictable** (eliminates an unknown number of rows), and **cheap to evaluate** (much cheaper than computing BM25 scores). Enabling it for a loose or expensive filter may be slower than the default.

## Reference

### Types

| Type                 | Description                                                                                                   |
| :------------------- | :------------------------------------------------------------------------------------------------------------ |
| `bm25query_tsvector` | Combines a query `tsvector` with the object identifier of a BM25 index. Passed as the right operand to `<&>`. |

### Operators

| Operator | Arguments                        | Result   | Description                                                                                                                               |
| :------- | :------------------------------- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `<&>`    | `tsvector`, `bm25query_tsvector` | `double` | Returns the negative BM25 score of a document against a query, in the context of the BM25 index. Order ascending for most-relevant-first. |

### Operator classes

| Operator class | Default | Operator                            |
| :------------- | :------ | :---------------------------------- |
| `bm25_ops`     | Yes     | `<&>(tsvector, bm25query_tsvector)` |

### Functions

| Function                                       | Returns              | Description                                                                                          |
| :--------------------------------------------- | :------------------- | :--------------------------------------------------------------------------------------------------- |
| `to_bm25query(query tsvector, index regclass)` | `bm25query_tsvector` | Constructs a `bm25query_tsvector` from a query `tsvector` and the object identifier of a BM25 index. |

### Index storage parameters

| Parameter       | Type    | Default | Domain        | Description                                                                      |
| :-------------- | :------ | :------ | :------------ | :------------------------------------------------------------------------------- |
| `k1`            | real    | `1.2`   | `[1.2, 2.0]`  | BM25 `k1` parameter. Controls term frequency saturation.                         |
| `b`             | real    | `0.75`  | `[0.0, 1.0]`  | BM25 `b` parameter. Controls document length normalization.                      |
| `default_limit` | integer | `1000`  | `[-1, 65535]` | Fallback value for `lakebase_bm25.default_limit`. GUCs take precedence when set. |
| `prefilter`     | boolean | `false` | —             | Fallback value for `lakebase_bm25.prefilter`. GUCs take precedence when set.     |

### Search parameters (GUCs)

| GUC                           | Type    | Default | Description                                                                                           |
| :---------------------------- | :------ | :------ | :---------------------------------------------------------------------------------------------------- |
| `lakebase_bm25.default_limit` | integer | `1000`  | Controls how many results the index returns. Set to match your query's `LIMIT` for best performance.  |
| `lakebase_bm25.prefilter`     | boolean | `false` | Enables filter evaluation before BM25 score computation. Recommended for strict, cheap filters.       |
| `lakebase_bm25.enable_scan`   | boolean | `on`    | Enables or disables `lakebase_bm25` index scans. Set to `off` for testing to force a sequential scan. |

<NeedHelp />
