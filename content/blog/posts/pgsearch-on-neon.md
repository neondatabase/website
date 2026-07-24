---
title: pg_search is Available on Neon
description: 'Get 1,000x faster full-text search in Postgres'
excerpt: >-
  We’ve teamed up with ParadeDB to bring pg_search to all Neon users, making
  full-text search in Postgres faster and more powerful. Get Elastic-level speed
  within Neon—perfect for search-heavy apps, analytics, and filtering large
  datasets. Try it on the Free Plan. Elasticsearch Pow...
date: '2025-03-18T14:18:47'
updatedOn: '2025-07-22T20:31:22'
category: company
categories:
  - company
authors:
  - bryan-clark
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/pgsearch-on-neon/cover.png'
  alt: null
isFeatured: true
seo:
  title: pg_search is Available on Neon - Neon
  description: >-
    We’ve teamed up with ParadeDB to bring pg_search to all Neon users, making
    full-text search in Postgres faster and more powerful.
  keywords: []
  noindex: false
  ogTitle: pg_search is Available on Neon - Neon
  ogDescription: >-
    We’ve teamed up with ParadeDB to bring pg_search to all Neon users, making
    full-text search in Postgres faster and more powerful.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/pgsearch-on-neon/social.jpg'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/pgsearch-on-neon/neon-pgsearch-2-1024x576-312eff05.png)

**We’ve teamed up with [ParadeDB](https://www.paradedb.com/) to bring pg_search to all Neon users, making full-text search in Postgres faster and more powerful. Get Elastic-level speed within Neon—perfect for search-heavy apps, analytics, and filtering large datasets.** [Try it on the Free Plan.](https://console.neon.tech/signup)

## Elasticsearch Powers, Inside Postgres

pg_search is a high-performance full-text search extension for Postgres. It fills Postgres’ gaps in speed, ranking quality, and advanced search capabilities, bringing Elasticsearch-grade features inside Postgres (and now, to Neon).

**So, what are those gaps?** Postgres has native full-text search (FTS) via tsvector and tsquery, but this is not best-in-class—for example:

- Postgres’ GIN index on tsvector is not optimized for ranking, making queries slower when sorting by relevance.
- The built-in ranking method (ts_rank) is not as effective as modern search algorithms like BM25, which pg_search supports.
- Native FTS requires exact matches (no fuzzy search). pg_search can handle approximate matches and typos.
- Faceted search (the ability to quickly count occurrences of values within search results) is either missing or inefficient in native Postgres. This is a critical feature for real-world search applications and a major reason developers stick with Elasticsearch.
- Other advanced features like prefix search, highlight snippets, and JSON-aware search are also limited or inefficient in native Postgres FTS.

This all translates into better performance. In a later section of this post, we include a 10-million-row benchmark comparing pg_search to a tuned Postgres GIN-based setup. **pg_search delivered consistently faster search queries: up to 1,000x faster.**

![Image](https://cdn.neonapi.io/public/images/pages/blog/pgsearch-on-neon/ad4nxeygh85w1z-rukb8fdzcejlwxnseam-goiqymopwfupdgzxavuumwk3o0rjdsxrfbjrhtgqjjp8fjblztnuyg45lvyh4voqftn0rdnwo1pq2ckywmngospf-hsnmqcpoywuexu-a6c3bdc0.jpg)

Before we dig into the benchmark, let’s take a closer look at pg_search.

## pg_search Capabilities

### 100% Postgres, written in Rust

pg_search is an extension written in Rust via the pgrx framework. There are no external dependencies or services required, everything operates within Postgres. You interact with it using standard SQL syntax, e.g. creating an index on text columns using the BM25 index method and querying with the @@@ operator for full-text search.

### Advanced relevance ranking

pg_search brings true search-engine ranking into Postgres by implementing the BM25 algorithm, the same relevance scoring used by Elasticsearch. This allows search results to be ranked based on term frequency and rarity, producing higher-quality results than plain Postgres. Developers can also leverage prefix search, typo tolerance, and highlighted matches, or perform faceted searches (bucketing results by attributes like category, severity, or date).

### Optimized indexing for speed

pg_search introduces a custom inverted index within Postgres (the BM25 index) to efficiently store tokens and document references. Powered by Tantivy, this index is significantly faster than the GIN tsvector approach, both in query execution and index creation.

Beyond raw speed, pg_search’s BM25 index is a covering index, meaning a single index can efficiently span multiple columns. This allows boolean filters, faceted aggregations, and full-text search predicates to be pushed down into a single index scan, rather than applying filters and aggregates after retrieval (as is required with GIN indexes). In practice, this eliminates a major performance bottleneck (especially for queries with large result sets) by avoiding costly layered filtering and aggregation.

### Real-time updates without ETL

This BM25 index is fully integrated with Postgres’ MVCC transaction system. It updates automatically as data is inserted, updated, or deleted. There’s no need for manual re-indexing, batch jobs, or external pipelines. New data is searchable immediately upon commit.

This real-time indexing is critical for live applications, ensuring zero-lag between data writes and searchability. Additionally, pg_search is MVCC-safe, meaning

- It supports concurrent readers and writers
- Search results are consistent with their transaction’s visibility rules
- The idea of “eventually consistent” has been replaced with “immediately consistent”

## Performance Benchmark: pg_search on Neon

Now, to the benchmark. We compared query performance on a Neon database with and without pg_search, optimizing the standard Postgres setup by adding GIN indexes where appropriate.

You can find the complete benchmarking suite here, in case you want to replicate the tests yourself: [https://github.com/paradedb/paradedb/tree/dev/benchmarks](https://github.com/paradedb/paradedb/tree/dev/benchmarks)

### Benchmark setup

#### Dataset

10 million rows of log-like data.

#### Schema

```sql
CREATE TABLE benchmark_logs (
    id SERIAL PRIMARY KEY,
    message TEXT,
    country VARCHAR(255),
    severity INTEGER,
    timestamp TIMESTAMP,
    metadata JSONB
);
```

#### Query types tested

_The complete queries are included in the Appendix table at the end of this post._

- COUNT queries – Retrieve the count of rows (e.g., text-search matches).
- Highlighting queries – Extract relevant text snippets from fields (e.g., `message` or `country`) that contain search terms.
- Bucket or group-by queries – Group results by fields like `country`, `severity`, or truncated timestamp.
- Top-N (ranked) queries – Return a subset of rows ordered by a ranking metric (e.g., text relevance) or another column (e.g., `severity`).
- Cardinality queries – Count the number of distinct values in a field under certain text-search filters.
- Filtered queries – Apply filters across numeric, text, timestamp, and JSON fields, combined with text search constraints.

#### Postgres settings

- `maintenance_work_mem` = 8GB
- `shared_buffers` = 909MB
- `max_parallel_workers` = 8
- `max_worker_processes` = 28
- `max_parallel_workers_per_gather` = 8

#### CPU/memory

Autoscaling enabled in Neon with a max. limit of 8 CU (8 vCPU, 32 GB RAM).

#### Indexing strategy

To ensure a fair comparison, we optimized the Postgres setup with multiple indexes, giving it the best possible shot at competing with pg_search’s covering BM25 index. Without these optimizations, Postgres would have been significantly slower, as filtering and ordering over numeric and timestamp columns without dedicated indexes would have introduced substantial overhead.

This is what we did:

- DB with pg_search: We created a single BM25 index
- DB without pg_search: We created all these indexes
  - GIN index on `message` (for full-text search)
  - GIN index on `country` (for text-based filtering)
  - B-tree indexes on `severity`, `timestamp`, and `metadata->>'value'` (to speed up filtering, ordering, and aggregations)

## Results

### Index creation

The pg_search index is larger than the GIN index on message, but it **builds faster**:

| Index type     | Build time (min) | Index size (MB) |
| -------------- | ---------------- | --------------- |
| Postgres GIN   | 2.60             | 176             |
| pg_search BM25 | 1.63             | 647             |

The BM25 index is indexing six columns at once, whereas the GIN index is limited to indexing only the text column. pg_search can efficiently handle queries that combine full-text search with filters on multiple fields (such as numeric, timestamp, and JSON attributes) without requiring additional indexes.

### Query performance

For the full-search queries tested, pg_search consistently outperformed the tuned Postgres instance, showing **over 1,000x faster performance** for some queries:

![Image](https://cdn.neonapi.io/public/images/pages/blog/pgsearch-on-neon/ad4nxedmd06rkjjgnummb8lk9wori5pw0pwwcv7o5g6h96yw5szy8pdx6vhozokbpxhuynmmwlhtas6vhai5uapgxgaoivqovidkn9p-nsky4-iaqmpqmy6o22wk2aytd2or77szek-be7d5966.png)

This is only a summary of the results. You can find the full results of the benchmark in the big Appendix table at the end of this post.

## How to unlock pg_search on Neon

**pg_search is available for all Neon databases in AWS regions**. If you’re in Azure and would like to use pg_search, [tell us.](https://neon.tech/contact-sales)

To install the extension, simply run:

```sql
CREATE EXTENSION IF NOT EXISTS pg_search;
```

[Check out our docs for all the details.](https://neon.tech/docs/extensions/pg_search) If you’re not yet a Neon user, [create a free account today](https://console.neon.tech/signup) and start playing around with pg_search.

---

## Appendix: Detailed Benchmark Results

This table includes the full benchmark results. It shows the average search time across the three runs for both pg_search and the native Postgres instance (`tuned_Postgres`), with all average times rounded to the nearest millisecond.

| **pg_search query**                                                                                                                                                                                                  | **Query response time (ms)** | **tuned_postgres query**                                                                                                                                                                                                                                                                                                               | **Query response time (ms)** |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `SELECT COUNT(*) FROM benchmark_logs WHERE message @@@ 'team'`                                                                                                                                                       | 770                          | `SELECT COUNT(*) FROM benchmark_logs WHERE to_tsvector('english', message) @@ to_tsquery('english', 'team')`                                                                                                                                                                                                                           | <br />22,214                 |
| `SELECT id, paradedb.snippet(message), paradedb.snippet(country) FROM benchmark_logs WHERE message @@@ 'research' AND country @@@ 'Canada' LIMIT 10`                                                                 | 34                           | <br />`SELECT id, ts_headline('english', message, to_tsquery('english', 'research')), ts_headline('english', country, to_tsquery('english', 'canada')) FROM benchmark_logs WHERE to_tsvector('english', message) @@ to_tsquery('english', 'research') AND to_tsvector('english', country) @@ to_tsquery('english', 'canada') LIMIT 10` | 758                          |
| `SELECT country, COUNT(*) FROM benchmark_logs WHERE message @@@ 'research' GROUP BY country ORDER BY country`                                                                                                        | 7386                         | <br />`SELECT country, COUNT(*) FROM benchmark_logs WHERE to_tsvector('english', message) @@ to_tsquery('english', 'research') GROUP BY country ORDER BY country`                                                                                                                                                                      | <br />21,757                 |
| `SELECT severity, COUNT(*) FROM benchmark_logs WHERE message @@@ 'research' GROUP BY severity ORDER BY severity`                                                                                                     | 927                          | <br />`SELECT severity, COUNT(*) FROM benchmark_logs WHERE to_tsvector('english', message) @@ to_tsquery('english', 'research') GROUP BY severity ORDER BY severity`                                                                                                                                                                   | <br />19,111                 |
| <br />`SELECT date_trunc('year', timestamp) as year, COUNT(*) FROM benchmark_logs WHERE message @@@ 'research' GROUP BY year ORDER BY year`                                                                          | 1,355                        | <br />`SELECT date_trunc('year', timestamp) as year, COUNT(*) FROM benchmark_logs WHERE to_tsvector('english', message) @@ to_tsquery('english', 'research') GROUP BY year ORDER BY year`                                                                                                                                              | <br />19,256                 |
| <br />`SELECT * FROM benchmark_logs WHERE id @@@ paradedb.term('metadata.label', 'critical system alert') AND message @@@ 'research' AND severity @@@ < 3 LIMIT 10`                                                 | 29                           | <br />`SELECT * FROM benchmark_logs WHERE metadata->>'label' = 'critical system alert' AND to_tsvector('english', message) @@ to_tsquery('english', 'research') AND severity < 3 LIMIT 10`                                                                                                                                             | 64                           |
| <br />`SELECT * FROM benchmark_logs WHERE id @@@ paradedb.term('metadata.label', 'critical system alert') AND id @@@ paradedb.range('metadata.value', int4range(10, NULL, '[)')) AND message @@@ 'research' LIMIT 10` | 34                           | <br />`SELECT * FROM benchmark_logs WHERE metadata->>'label' = 'critical system alert' AND (metadata->>'value')::int >= 10 AND to_tsvector('english', message) @@ to_tsquery('english', 'research') LIMIT 10`                                                                                                                          | 56                           |
| <br />`SELECT *, paradedb.score(id) FROM benchmark_logs WHERE message @@@ 'research' ORDER BY paradedb.score(id) LIMIT 10`                                                                                           | 81                           | <br />`SELECT *, ts_rank(to_tsvector('english', message), to_tsquery('english', 'research')) AS rank FROM benchmark_logs WHERE to_tsvector('english', message) @@ to_tsquery('english', 'research') ORDER BY rank DESC LIMIT 10`                                                                                                       | <br />38,797                 |
| <br />`SELECT * FROM benchmark_logs WHERE message @@@ 'research' AND country @@@ 'Canada' ORDER BY country LIMIT 10`                                                                                                 | 52                           | <br />`SELECT * FROM benchmark_logs WHERE to_tsvector('english', message) @@ to_tsquery('english', 'research') AND to_tsvector('english', country) @@ to_tsquery('english', 'Canada') ORDER BY country LIMIT 10`                                                                                                                       | <br />3,713                  |
| <br />`SELECT * FROM benchmark_logs WHERE message @@@ 'research' AND country @@@ 'Canada' ORDER BY timestamp LIMIT 10`                                                                                               | 61                           | <br />`SELECT * FROM benchmark_logs WHERE to_tsvector('english', message) @@ to_tsquery('english', 'research') AND to_tsvector('english', country) @@ to_tsquery('english', 'Canada') ORDER BY timestamp LIMIT 10`                                                                                                                     | 83                           |
| <br />`SELECT COUNT(DISTINCT severity) FROM benchmark_logs WHERE message @@@ 'research'`                                                                                                                             | 2005                         | <br />`SELECT COUNT(DISTINCT severity) FROM benchmark_logs WHERE to_tsvector('english', message) @@ to_tsquery('english', 'research')`                                                                                                                                                                                                 | <br />20,120                 |
| <br />`SELECT * FROM benchmark_logs WHERE message @@@ 'research' AND country @@@ 'Canada' AND severity < 3 LIMIT 10`                                                                                                 | 29                           | <br />`SELECT * FROM benchmark_logs WHERE to_tsvector('english', message) @@ to_tsquery('english', 'research') AND to_tsvector('english', country) @@ to_tsquery('english', 'Canada') AND severity < 3 LIMIT 10`                                                                                                                       | <br />31,890                 |
