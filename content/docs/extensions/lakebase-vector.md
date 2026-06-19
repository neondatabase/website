---
title: The lakebase_vector extension
subtitle: Fast approximate nearest-neighbor vector search for Neon Postgres
summary: >-
  The lakebase_vector extension adds the lakebase_ann index type to Neon Postgres
  for fast approximate nearest-neighbor vector search. It requires no migration
  from pgvector — the same vector types, distance operators, and query syntax
  work unchanged. Use this page to enable the extension, create a lakebase_ann
  index, configure build_mode, tune search with the lakebase_ann.probes and
  lakebase_ann.epsilon GUCs, and reference all operator classes and index options.
enableTableOfContents: true
updatedOn: '2026-06-19T13:59:31.895Z'
---

<EarlyAccessProps feature_name="lakebase_vector" />

The `lakebase_vector` extension adds the `lakebase_ann` index type to Postgres for approximate nearest-neighbor (ANN) vector search. It is a drop-in companion to `pgvector`: the same `vector` types, distance operators, and query syntax work unchanged; only the index type changes.

Lakebase Search is in private preview. To request access or learn about its architecture advantages, see [Lakebase Search](/docs/ai/lakebase-search).

## Why lakebase_vector?

`lakebase_ann` uses IVF (Inverted File) partitioning combined with RaBitQ quantization, an architecture built to scale beyond what HNSW can reach. HNSW indexes must fit entirely in memory and traverse the graph with random I/O at query time, which limits how far they can scale. IVF partitions the vector space into lists and searches only the most relevant ones at query time, enabling sequential I/O rather than random pointer-chasing. RaBitQ compresses vectors 4–8x, reducing the index size and enabling index builds 50–100x faster than HNSW. Together, this scales to **over 1 billion vectors on a single index** while keeping cold starts fast and query performance stable.

There is no migration involved. `lakebase_vector` inherits all `pgvector` data types and operators. You can create a `lakebase_ann` index on your existing `pgvector` columns without changing your schema or application code.

## Enable the lakebase_vector extension

[Lakebase Search](/docs/ai/lakebase-search) must be enabled on your Neon project before you can install this extension. Once it's enabled, run the following statement in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor):

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

Set `build_mode` at index creation to control the accuracy/speed tradeoff:

- `standard` (default): optimizes for recall. Use for most workloads.
- `fast`: builds faster at lower recall. Use when build time matters more than search quality.

```sql
CREATE INDEX ON items USING lakebase_ann (embedding vector_l2_ops) WITH (build_mode = 'fast');
```

Before tuning search, call `lakebase_ann_index_info(index_name)` to get the index's `lists`, `default_probes`, and `default_epsilon` values.

Use the `lakebase_ann.probes` GUC to control how many IVF partitions are searched at query time. Higher values improve recall at the cost of speed.

```sql
SET lakebase_ann.probes TO '10';
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 10;
```

`lakebase_ann.epsilon` controls the re-ranking margin. The default value of `1.9` works well for most workloads.

```sql
SET lakebase_ann.epsilon TO '1.5';
```

### Concurrent index updates

For large, frequently changing datasets, use `CREATE INDEX CONCURRENTLY` to build or rebuild an index without blocking reads and writes:

```sql
CREATE INDEX CONCURRENTLY items_embedding_ann ON items
  USING lakebase_ann (embedding vector_l2_ops);

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

| Option       | Type   | Default      | Description                                                                                                                            |
| :----------- | :----- | :----------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| `build_mode` | string | `'standard'` | Controls the accuracy/speed tradeoff at index build time. `'standard'` optimizes for recall; `'fast'` builds faster with lower recall. |

### Search parameters

| GUC                    | Type    | Default | Description                                                                                              |
| :--------------------- | :------ | :------ | :------------------------------------------------------------------------------------------------------- |
| `lakebase_ann.probes`  | integer | not set | Number of IVF partitions to scan at query time. Higher values improve recall at the cost of query speed. |
| `lakebase_ann.epsilon` | float   | `1.9`   | Re-ranking margin. Valid range: `0.0` to `4.0`.                                                          |

<NeedHelp />
