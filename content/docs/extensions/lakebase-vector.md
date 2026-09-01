---
title: The lakebase_vector extension
subtitle: Fast approximate nearest-neighbor vector search for Lakebase Postgres
summary: >-
  The lakebase_vector extension adds the lakebase_ann index type to Lakebase Postgres
  for fast approximate nearest-neighbor vector search. It requires no migration
  from pgvector — the same vector types, distance operators, and query syntax
  work unchanged. Use this page to enable the extension, create a lakebase_ann
  index, configure build_mode, tune search with the lakebase_ann.probes,
  lakebase_ann.epsilon, and lakebase_ann.prefilter GUCs, and reference all
  operator classes and index options.
enableTableOfContents: true
updatedOn: '2026-08-31T11:23:58.798Z'
---

The `lakebase_vector` extension adds the `lakebase_ann` index type to Postgres for approximate nearest-neighbor (ANN) vector search. It is a drop-in companion to `pgvector`: the same `vector` types, distance operators, and query syntax work unchanged; only the index type changes.

See [Lakebase Search](/docs/ai/lakebase-search) for the architecture and the companion `lakebase_text` extension.

## Why lakebase_vector?

`lakebase_ann` uses IVF (Inverted File) partitioning combined with RaBitQ quantization, an architecture built to scale beyond what HNSW can reach. HNSW indexes must fit entirely in memory and traverse the graph with random I/O at query time, which limits how far they can scale. IVF partitions the vector space into lists and searches only the most relevant ones at query time, enabling sequential I/O rather than random pointer-chasing. RaBitQ compresses vectors 4–8x, reducing the index size and enabling index builds 50–100x faster than HNSW. Together, this scales to **over 1 billion vectors on a single index** while keeping cold starts fast and query performance stable.

There is no migration involved. `lakebase_vector` inherits all `pgvector` data types and operators. You can create a `lakebase_ann` index on your existing `pgvector` columns without changing your schema or application code.

## Enable the lakebase_vector extension

Install the extension in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor):

```sql
CREATE EXTENSION IF NOT EXISTS lakebase_vector CASCADE;
```

`lakebase_vector` requires Postgres 16 or later. The `CASCADE` option automatically installs `pgvector` if it is not already installed, since `lakebase_vector` depends on it.

`lakebase_vector` relies on a preloaded library that Neon enables by default. If you've customized your project's [preloaded libraries](/docs/extensions/pg-extensions#extensions-with-preloaded-libraries), make sure `lakebase_vector` is in the list.

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

- `standard` (default): balances recall and index build time. Use for most workloads.
- `quality`: improves recall but takes longer to build.

```sql
CREATE INDEX ON items USING lakebase_ann (embedding vector_l2_ops)
WITH (build_mode = 'quality');
```

By default, `lakebase_ann` chooses the number of lists based on the number of vectors in the table. You can set `lists` to control the partition layout:

```sql
CREATE INDEX ON items USING lakebase_ann (embedding vector_l2_ops)
WITH (lists = '16');
```

Before tuning search, call `lakebase_ann_index_info(index_name)` to get the index's `lists`, `default_probes`, and `default_epsilon` values.

<Admonition type="note">
The `probes` GUC applies only once the index has built IVF lists, which happens above a corpus-size threshold. On a small dataset, `lakebase_ann` uses exact (flat) search instead, and `lakebase_ann_index_info` returns empty `lists` and `default_probes`. In this case, leave `probes` set to `'auto'`. The `epsilon` GUC still controls full-precision reranking during flat search. When `lists` isn't empty, the shape of `probes` must match the shape of `lists`: set one value for a one-level index or two comma-separated values for a two-level index. A mismatched value causes an error.
</Admonition>

Use the `lakebase_ann.probes` GUC to control how many IVF partitions are searched at query time. Higher values improve recall at the cost of speed. The default is `'auto'`. Test different values to meet your recall target.

```sql
-- For a one-level index
SET lakebase_ann.probes TO '10';
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 10;
```

`lakebase_ann.epsilon` controls the re-ranking margin. The default value of `'auto'` works well for most workloads.

### Prefilter

By default, Postgres applies non-vector filter conditions after the ANN index returns candidate rows. Enable `lakebase_ann.prefilter` to evaluate those conditions before full-precision distance reranking:

```sql
SET lakebase_ann.prefilter TO on;

SELECT * FROM items
WHERE id % 100 = 0
ORDER BY embedding <-> '[3,1,2]'
LIMIT 10;
```

Prefiltering works best when the filter is cheap to evaluate and removes most rows. Leave it off for filters that match many rows or require expensive calculations, since evaluating the filter inside the index can add overhead.

When you set these GUCs from application code, the `SET` and the query must run on the same session. With a connection pool or the [Neon serverless driver](/docs/serverless/serverless-driver), where each statement can use a different connection, issue both in a single transaction so the `SET` applies to the query.

### Concurrent index updates

For large, frequently changing datasets, use `CREATE INDEX CONCURRENTLY` to build or rebuild an index without blocking reads and writes:

```sql
CREATE INDEX CONCURRENTLY items_embedding_ann ON items
  USING lakebase_ann (embedding vector_l2_ops);

REINDEX INDEX CONCURRENTLY items_embedding_ann;
```

## Reference

### Operator classes

`lakebase_ann` supports the following operator classes. Each class provides two operators:

- A **pgvector distance operator** (`<->`, `<#>`, `<=>`) that returns a distance and is used in `ORDER BY` for nearest-neighbor search.
- A **`lakebase_vector` range operator** (`<<->>`, `<<#>>`, `<<=>>`) that takes a `sphere_*` value on its right side and returns a `boolean`: true when the vector falls within the sphere's radius. Use it in a `WHERE` clause to filter by similarity. Build the sphere with the `sphere(vector, radius)` function.

| Operator class       | Distance operator (`ORDER BY`) | Range operator (`WHERE`)         |
| :------------------- | :----------------------------- | :------------------------------- |
| `vector_l2_ops`      | `<->(vector, vector)`          | `<<->>(vector, sphere_vector)`   |
| `vector_ip_ops`      | `<#>(vector, vector)`          | `<<#>>(vector, sphere_vector)`   |
| `vector_cosine_ops`  | `<=>(vector, vector)`          | `<<=>>(vector, sphere_vector)`   |
| `halfvec_l2_ops`     | `<->(halfvec, halfvec)`        | `<<->>(halfvec, sphere_halfvec)` |
| `halfvec_ip_ops`     | `<#>(halfvec, halfvec)`        | `<<#>>(halfvec, sphere_halfvec)` |
| `halfvec_cosine_ops` | `<=>(halfvec, halfvec)`        | `<<=>>(halfvec, sphere_halfvec)` |
| `rabitq8_l2_ops`     | `<->(rabitq8, rabitq8)`        | `<<->>(rabitq8, sphere_rabitq8)` |
| `rabitq8_ip_ops`     | `<#>(rabitq8, rabitq8)`        | `<<#>>(rabitq8, sphere_rabitq8)` |
| `rabitq8_cosine_ops` | `<=>(rabitq8, rabitq8)`        | `<<=>>(rabitq8, sphere_rabitq8)` |
| `rabitq4_l2_ops`     | `<->(rabitq4, rabitq4)`        | `<<->>(rabitq4, sphere_rabitq4)` |
| `rabitq4_ip_ops`     | `<#>(rabitq4, rabitq4)`        | `<<#>>(rabitq4, sphere_rabitq4)` |
| `rabitq4_cosine_ops` | `<=>(rabitq4, rabitq4)`        | `<<=>>(rabitq4, sphere_rabitq4)` |

To filter by similarity, wrap the query vector in `sphere(vector, radius)` and use the range operator in a `WHERE` clause. Rank the matches with the corresponding distance operator:

```sql
-- Rows within cosine radius 0.5 of the query vector, closest first
SELECT * FROM items
WHERE embedding <<=>> sphere('[3,1,2]'::vector, 0.5)
ORDER BY embedding <=> '[3,1,2]'
LIMIT 5;
```

The range operator returns a `boolean`, so it belongs in `WHERE`, not `ORDER BY`. Use the distance operator (`<=>` here) to order results.

The `rabitq8` and `rabitq4` types are quantization types defined by `lakebase_vector`. They offer reduced memory footprint at the cost of some precision.

Pick the operator class that matches how your embeddings were trained, and use the same metric for the index and your queries:

- **Cosine** (`vector_cosine_ops`, `<=>`) suits most text embeddings and is the common default.
- **L2 / Euclidean** (`vector_l2_ops`, `<->`) fits cases where absolute distance matters and vectors aren't normalized.
- **Inner product** (`vector_ip_ops`, `<#>`) is for vectors pre-normalized to unit length; for unit vectors it matches cosine and is typically faster.

The `halfvec`, `rabitq8`, and `rabitq4` families provide the same three metrics with smaller, quantized storage.

### Index options

| Option       | Type   | Default      | Description                                                                                                       |
| :----------- | :----- | :----------- | :---------------------------------------------------------------------------------------------------------------- |
| `build_mode` | string | `'standard'` | Controls the accuracy/speed tradeoff. Use `'quality'` for better recall at the cost of a longer index build.      |
| `lists`      | string | `'auto'`     | Sets the IVF partition layout. With `auto`, the extension chooses a value based on the number of vectors indexed. |

### Search parameters

| GUC                      | Type    | Default  | Description                                                                                                                     |
| :----------------------- | :------ | :------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `lakebase_ann.probes`    | string  | `'auto'` | Number of IVF partitions to scan at each level. Higher values improve recall at the cost of query speed.                        |
| `lakebase_ann.epsilon`   | string  | `'auto'` | Controls how many candidates are reranked using full-precision distances. Higher values rerank more candidates and take longer. |
| `lakebase_ann.prefilter` | boolean | `off`    | Evaluates non-vector filters before full-precision distance reranking. Best for cheap filters that remove most candidate rows.  |

<NeedHelp />
