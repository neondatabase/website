---
title: The lakebase_vector extension
subtitle: Fast approximate nearest-neighbor vector search for Neon Postgres
summary: >-
  The lakebase_vector extension adds the lakebase_ann index type to Neon Postgres
  for fast approximate nearest-neighbor vector search. It requires no migration
  from pgvector — the same vector types, distance operators, and query syntax
  work unchanged. Use this page to enable the extension, create a lakebase_ann
  index, tune build parameters (lists, residual_quantization, build.pin), configure
  search with the lakebase_ann.probes GUC, and reference all operator classes and
  index options.
enableTableOfContents: true
updatedOn: '2026-06-09T20:13:02.957Z'
---

<EarlyAccessProps feature_name="lakebase_vector" />

The `lakebase_vector` extension adds the `lakebase_ann` index type to Postgres for approximate nearest-neighbor (ANN) vector search. It is a drop-in companion to `pgvector`: the same `vector` types, distance operators, and query syntax work unchanged; only the index type changes.

Lakebase Search is in private preview. To request access or learn about its architecture advantages, see [Lakebase Search](/docs/ai/lakebase-search).

## Why lakebase_vector?

`lakebase_ann` uses IVF (Inverted File) partitioning combined with RaBitQ quantization, an architecture built to scale beyond what HNSW can reach. HNSW indexes must fit entirely in memory and traverse the graph with random I/O at query time, which limits how far they can scale. IVF partitions the vector space into lists and searches only the most relevant ones at query time, enabling sequential I/O rather than random pointer-chasing. RaBitQ compresses vectors 4–8x, reducing the index size and enabling index builds 50–100x faster than HNSW. Together, this scales to **over 1 billion vectors on a single index** while keeping cold starts fast and query performance stable.

There is no migration involved. `lakebase_vector` inherits all `pgvector` data types and operators. You can create a `lakebase_ann` index on your existing `pgvector` columns without changing your schema or application code.

## Enable the lakebase_vector extension

Run the following statement in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor):

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;
```

`lakebase_vector` requires Postgres 16 or later. The `CASCADE` option automatically installs `pgvector` if it is not already installed, since `lakebase_vector` depends on it.

## Quick start

Create a table with a `vector` column and insert some data:

```sql
CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3));

INSERT INTO items (embedding)
SELECT ARRAY[random(), random(), random()]::real[]
FROM generate_series(1, 1000);
```

Create a `lakebase_ann` index on the embedding column:

```sql
CREATE INDEX ON items USING lakebase_ann (embedding vector_l2_ops);
```

Query using the standard `pgvector` syntax:

```sql
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```

## Index tuning

For tables with fewer than 100,000 rows, no tuning is required.

As your dataset grows, configure the `build.internal.lists` option to partition the vector space into an appropriate number of lists. Pass options as a [TOML](https://toml.io/) string:

```sql
CREATE INDEX ON items USING lakebase_ann (embedding vector_l2_ops) WITH (options = $$
build.internal.lists = [1000]
$$);
```

Use the `lakebase_ann.probes` GUC to control how many lists are searched at query time. More probes improves recall at the cost of speed. This GUC only applies when the index has `build.internal.lists` configured; no probes setting is needed for the default (no-lists) configuration.

```sql
SET lakebase_ann.probes TO '10';
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 10;
```

Use the following guidelines when choosing `lists` based on your row count:

| Rows                   | Recommended lists | Example   |
| :--------------------- | :---------------- | :-------- |
| Fewer than 100,000     | Not needed        | `[]`      |
| 100,000 – 2,000,000    | N / 500           | `[2000]`  |
| 2,000,000 – 50,000,000 | 4√N – 8√N         | `[10000]` |
| 50,000,000+            | 8√N – 16√N        | `[80000]` |

### Cosine similarity with residual quantization

For most datasets using cosine similarity, enabling `residual_quantization` and `spherical_centroids` improves both queries per second and recall:

```sql
CREATE INDEX ON items USING lakebase_ann (embedding vector_cosine_ops) WITH (options = $$
residual_quantization = true
build.internal.spherical_centroids = true
build.internal.lists = [1000]
$$);
```

### Faster index builds

To speed up index builds on large tables, set `build.pin = 2` to use more shared memory during the build process:

```sql
CREATE INDEX ON items USING lakebase_ann (embedding vector_l2_ops) WITH (options = $$
residual_quantization = true
build.internal.spherical_centroids = true
build.internal.lists = [1000]
build.pin = 2
$$);
```

### Concurrent index updates

For large, frequently changing datasets, use `CREATE INDEX CONCURRENTLY` to build or rebuild an index without blocking reads and writes. You can then update the index options and rebuild with `REINDEX INDEX CONCURRENTLY`:

```sql
CREATE INDEX CONCURRENTLY items_embedding_ann ON items
USING lakebase_ann (embedding vector_l2_ops) WITH (options = $$
residual_quantization = true
build.internal.spherical_centroids = true
build.internal.lists = [1024]
build.pin = 2
$$);

-- Update options and rebuild without downtime
ALTER INDEX items_embedding_ann SET (options = $$
residual_quantization = true
build.internal.spherical_centroids = true
build.internal.lists = [4096]
build.pin = 2
$$);

REINDEX INDEX CONCURRENTLY items_embedding_ann;
```

## Reference

### Operator classes

`lakebase_ann` supports the following operator classes. The `<->`, `<#>`, and `<=>` operators are defined by `pgvector`. The `<<->>`, `<<#>>`, and `<<=>>` operators are defined by `lakebase_vector` for similarity filtering.

| Operator class       | Operator 1              | Operator 2                |
| :------------------- | :---------------------- | :------------------------ |
| `vector_l2_ops`      | `<->(vector, vector)`   | `<<->>(vector, vector)`   |
| `vector_ip_ops`      | `<#>(vector, vector)`   | `<<#>>(vector, vector)`   |
| `vector_cosine_ops`  | `<=>(vector, vector)`   | `<<=>>(vector, vector)`   |
| `halfvec_l2_ops`     | `<->(halfvec, halfvec)` | `<<->>(halfvec, halfvec)` |
| `halfvec_ip_ops`     | `<#>(halfvec, halfvec)` | `<<#>>(halfvec, halfvec)` |
| `halfvec_cosine_ops` | `<=>(halfvec, halfvec)` | `<<=>>(halfvec, halfvec)` |
| `rabitq8_l2_ops`     | `<->(rabitq8, rabitq8)` | `<<->>(rabitq8, rabitq8)` |
| `rabitq8_ip_ops`     | `<#>(rabitq8, rabitq8)` | `<<#>>(rabitq8, rabitq8)` |
| `rabitq8_cosine_ops` | `<=>(rabitq8, rabitq8)` | `<<=>>(rabitq8, rabitq8)` |
| `rabitq4_l2_ops`     | `<->(rabitq4, rabitq4)` | `<<->>(rabitq4, rabitq4)` |
| `rabitq4_ip_ops`     | `<#>(rabitq4, rabitq4)` | `<<#>>(rabitq4, rabitq4)` |
| `rabitq4_cosine_ops` | `<=>(rabitq4, rabitq4)` | `<<=>>(rabitq4, rabitq4)` |

The `rabitq8` and `rabitq4` types are quantization types defined by `lakebase_vector`. They offer reduced memory footprint at the cost of some precision.

### Index options

Options are passed as a TOML string to the `WITH (options = $$ ... $$)` clause.

| Option                               | Type               | Default | Description                                                                                                                                                  |
| :----------------------------------- | :----------------- | :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build.internal.lists`               | array              | `[]`    | Number of partitions for the vector space. Set based on dataset size. See [Index tuning](#index-tuning).                                                     |
| `residual_quantization`              | boolean            | `false` | Enables residual quantization to improve recall. Recommended for cosine similarity workloads. Not supported with `rabitq8` or `rabitq4` operator classes.    |
| `build.internal.spherical_centroids` | boolean            | `false` | Enables spherical centroids. Recommended alongside `residual_quantization` for cosine similarity.                                                            |
| `build.pin`                          | integer or boolean | `-1`    | Controls shared memory usage during index builds. `-1` disables pinning (default). Set to `2` to use more shared memory and speed up builds on large tables. |
| `degree_of_parallelism`              | integer            | `32`    | Hint for the number of concurrent processes accessing the index. Increase only if you have more than 32 CPU threads and want to use more for index builds.   |

### Search parameters

| GUC                        | Type    | Default | Description                                                                                                                                                                    |
| :------------------------- | :------ | :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lakebase_ann.probes`      | integer | not set | Number of lists to search at query time. Must be set explicitly when using an index with `build.internal.lists` configured. Higher values improve recall at the cost of speed. |
| `lakebase_ann.enable_scan` | boolean | `on`    | Enables or disables `lakebase_ann` index scans. Set to `off` for testing to force a sequential scan.                                                                           |

<NeedHelp />
