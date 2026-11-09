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
updatedOn: '2026-09-09T10:20:49.000Z'
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

### Upgrade the extension and indexes

A new Lakebase Search release can add features, fixes, and performance improvements. Although Lakebase Search is released as part of Neon updates, it does not upgrade everything automatically. In `lakebase_vector`, two things upgrade separately and carry version numbers that are unrelated to each other:

- **The extension version** is the version of the SQL objects that `CREATE EXTENSION lakebase_vector` creates, including its data types, functions, operators, and the `lakebase_ann` index access method. This version is reported by `SELECT installed_version FROM pg_available_extensions WHERE name = 'lakebase_vector'`. `ALTER EXTENSION lakebase_vector UPDATE` updates this version.
- **The index storage format** is the on-disk layout of a `lakebase_ann` index. The extension may introduce updated index storage formats in an update, unlocking more features and delivering better performance. All newly created indexes automatically use the latest storage format, while existing indexes can be upgraded to the new format using `REINDEX INDEX CONCURRENTLY` after a newer storage format is available.

Upgrading is not urgent. The extension is compatible with SQL objects and index storage formats from older versions, but staying current keeps you on the supported, best-performing path and avoids a larger migration later, so upgrade when convenient rather than deferring indefinitely.

<Admonition type="note">
The latest available extension version is reported by `SELECT default_version FROM pg_available_extensions WHERE name = 'lakebase_vector'`.
</Admonition>

The latest storage format version is `_2`. The following query finds all indexes that use an older storage format. You can then rebuild them to the latest storage format with `REINDEX INDEX` or `REINDEX INDEX CONCURRENTLY`:

```sql title="PostgreSQL"
SELECT oid::regclass AS index, lakebase_ann_index_info(oid::regclass)::json ->> 'version' AS storage_format_version
FROM pg_class
WHERE relam = (SELECT oid FROM pg_am WHERE amname = 'lakebase_ann') AND relkind = 'i';
```

<Admonition type="note">
`REINDEX INDEX CONCURRENTLY` allows reads and writes to continue, but it takes longer.
</Admonition>

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
CREATE INDEX items_embedding_idx ON items
  USING lakebase_ann (embedding vector_l2_ops);
```

Query using the standard `pgvector` syntax:

```sql
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```

## Index tuning

Set `build_mode` at index creation to control the accuracy/speed tradeoff:

- `standard` (default): balances recall and index build time. Use for most workloads.
- `quality`: improves recall but takes significantly longer to build. Use it only for tables with up to 50 million vectors.

```sql
CREATE INDEX ON items USING lakebase_ann (embedding vector_l2_ops)
WITH (build_mode = 'standard');
```

The `fast` build mode remains supported for backward compatibility.

By default, `lakebase_ann` chooses lists based on the statistics of the table and the configuration of the index. Set `lists` to control the partition layout explicitly:

```sql
CREATE INDEX ON items USING lakebase_ann (embedding vector_l2_ops)
WITH (lists = '1000');
```

Before tuning, call `lakebase_ann_index_info(index_name)` to get the index's `lists`, `default_probes`, and `default_epsilon` values.

Use `lakebase_ann.probes` at query time to control how many inverted file (IVF) partitions are searched. Higher values improve recall at the cost of latency. The default value `'auto'` provides a balanced tradeoff between them. For finer control, use `lakebase_ann_advise` to [get recommended probes values](#get-recommended-probes-values).

The shape of `probes` must match the shape of `lists`. Call `lakebase_ann_index_info` to find your `lists` array, then set one value for a one-level index or two comma-separated values for a two-level index:

| `lists` from index info | `probes` to set |
| :---------------------- | :-------------- |
| `[]` (empty)            | `''`            |
| `[222]`                 | `'22'`          |
| `[3333, 33333]`         | `'33, 333'`     |

<Admonition type="note">
On a small dataset, `lakebase_ann` uses exact (flat) search instead of IVF partitioning, and `lakebase_ann_index_info` returns empty `lists` and `default_probes`. In this case, leave `probes` set to `''`. When `lists` isn't empty, a `probes` value whose shape doesn't match `lists` causes an error.
</Admonition>

```sql
-- Check your index's lists array first
SELECT lakebase_ann_index_info('items_embedding_idx');

-- Then set probes to match the shape of lists.
-- One-level index (single-value lists): set one value.
SET lakebase_ann.probes TO '10';

-- Two-level index: set two ascending comma-separated values, for example '10, 20'.
-- Flat index (empty lists): leave probes set to ''.

SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 10;
```

`lakebase_ann.epsilon` controls how many candidates are reranked using full-precision distances. Higher values rerank more candidates and take longer. The default value of `'auto'` works well for most workloads. During flat search on a small dataset, `epsilon` still controls full-precision reranking.

### Get recommended probes values

`lakebase_ann_advise`, `lakebase_ann_tune`, `lakebase_ann_latency`, and `lakebase_ann_sample` require `lakebase_vector` 1.1.2 and above. To check your installed version and update the extension, see [Upgrade the extension and indexes](#upgrade-the-extension-and-indexes).

`lakebase_ann_advise` returns candidate `probes` values in increasing order of recall, from 0.5 to 0.9 in steps of 0.1 and 0.91 to 0.99 in steps of 0.01. Each row includes estimated recall and the query latency measured after warmup. Use real queries from your search workload as input. If they're unavailable, sample vectors from the indexed table with `lakebase_ann_sample`. The following examples show both options:

```sql
-- Option 1: real queries in a separate table
SELECT probes, recall, avg_ms, p50_ms, p95_ms
FROM lakebase_ann_advise(
  'items_embedding_idx'::regclass,
  ARRAY(
    SELECT embedding FROM queries
    WHERE embedding IS NOT NULL
    LIMIT 512
  )
);

-- Option 2: sampled from the indexed table
-- NULL::items specifies items as the table to sample from.
SELECT probes, recall, avg_ms, p50_ms, p95_ms
FROM lakebase_ann_advise(
  'items_embedding_idx'::regclass,
  ARRAY(
    SELECT embedding FROM lakebase_ann_sample(NULL::items, 512)
    WHERE embedding IS NOT NULL
  )
);
```

| Column                       | Description                                                                     |
| :--------------------------- | :------------------------------------------------------------------------------ |
| `probes`                     | A `lakebase_ann.probes` value.                                                  |
| `recall`                     | Estimated recall@10 for the sample queries.                                     |
| `avg_ms`, `p50_ms`, `p95_ms` | Average, median, and 95th percentile latency of a single query in milliseconds. |

Choose the fastest row that meets your recall target, then apply its `probes` value:

```sql
SET lakebase_ann.probes TO '10';
```

Recall and latency are estimated for top-10 queries with `lakebase_ann.epsilon` set to `1.9`, which can differ from your actual queries. Before you use a `probes` value in production, verify its recall and latency on your workload if possible.

If the index has empty `lists`, `lakebase_ann_advise` returns no rows because there is nothing to tune.

On large indexes, a `lakebase_ann_advise` call can take more than 20 minutes. More query vectors make the call slower. Start with 512 query vectors to balance recall accuracy and run time.

`lakebase_ann_advise` calls `lakebase_ann_tune` to get recommended `probes` values, then `lakebase_ann_latency` to measure their latency. You can also use either `lakebase_ann_tune` or `lakebase_ann_latency` on its own. See [Functions](#functions).

`lakebase_ann_advise` and `lakebase_ann_tune` require table-level `SELECT` on the indexed table, and return an error if [row-level security (RLS)](/docs/guides/row-level-security) applies to your role on that table. `lakebase_ann_sample` and `lakebase_ann_latency` apply RLS policies and only read rows that your role can see.

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

### Index build time

Larger `shared_buffers` can significantly reduce index build time. Neon enables this optimization only on [larger fixed-size computes](/docs/manage/computes#how-to-size-your-compute). Check the current value before optimizing an index build:

```sql title="PostgreSQL"
SHOW shared_buffers;
```

If `shared_buffers` is 1 GB or less, consider temporarily resizing to a larger fixed-size compute before starting the index build.

You can also speed up index creation by increasing the number of parallel workers.

The `max_parallel_maintenance_workers` configuration parameter sets the maximum number of parallel workers that can be started by a single utility command such as `CREATE INDEX`.

The `max_parallel_workers` configuration parameter sets the maximum number of workers that the compute can support for parallel operations. Values of `max_parallel_maintenance_workers` above this limit have no effect.

The `max_worker_processes` configuration parameter sets the maximum number of background processes that the compute can support. Neon [manages this setting](/docs/reference/compatibility#parameter-settings-that-differ-by-compute-size) based on compute size. Values of `max_parallel_workers` above this limit have no effect.

```sql title="PostgreSQL"
SHOW max_worker_processes;
-- Set both values to the desired parallelism minus one.
SET max_parallel_workers = 15;
SET max_parallel_maintenance_workers = 15;
```

### Concurrent index updates

`CREATE INDEX CONCURRENTLY` and `REINDEX INDEX CONCURRENTLY` allow reads and writes to continue while an index is built or rebuilt:

```sql title="PostgreSQL"
CREATE INDEX CONCURRENTLY items_embedding_idx_concurrent ON items
  USING lakebase_ann (embedding vector_l2_ops);

REINDEX INDEX CONCURRENTLY items_embedding_idx_concurrent;
```

## Prewarm an index

Use `lakebase_ann_prewarm` after a compute starts to load the frequently accessed parts of an index into memory. The `scope` argument accepts the following values:

- `search` (default): Prewarms the full hot portion used for search.
- `routing`: Prewarms only the routing structures. This option is faster and provides a better cost-performance tradeoff for large indexes.

```sql title="PostgreSQL"
-- Prewarm the full search scope
SELECT lakebase_ann_prewarm('items_embedding_idx');

-- Prewarm only routing structures
SELECT lakebase_ann_prewarm('items_embedding_idx', scope => 'routing');
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

### Functions

| Function                                                              | Returns                                                                  | Description                                                                                                                                                                                                                                                       |
| :-------------------------------------------------------------------- | :----------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lakebase_ann_prewarm(regclass, scope text DEFAULT 'search')`         | void                                                                     | Loads frequently accessed index data into memory. Valid `scope` values are `search` and `routing`.                                                                                                                                                                |
| `lakebase_ann_index_info(regclass)`                                   | text                                                                     | Returns index metadata as JSON text, including `version`, `lists`, `default_probes`, and `default_epsilon`.                                                                                                                                                       |
| `lakebase_ann_advise(regclass, vector[] \| halfvec[])`                | `TABLE(probes text, recall real, avg_ms real, p50_ms real, p95_ms real)` | Recommends `lakebase_ann.probes` values for the sample query vectors, with estimated recall@10 and measured latency. Requires table-level `SELECT` on the indexed table. Not supported when RLS applies to your role. Requires `lakebase_vector` 1.1.2 and above. |
| `lakebase_ann_tune(regclass, vector[] \| halfvec[])`                  | `TABLE(probes text, recall real)`                                        | Recommends `lakebase_ann.probes` values for the sample query vectors, with estimated recall@10. Requires table-level `SELECT` on the indexed table. Not supported when RLS applies to your role. Requires `lakebase_vector` 1.1.2 and above.                      |
| `lakebase_ann_latency(regclass, text[], vector[] \| halfvec[])`       | `TABLE(probes text, avg_ms real, p50_ms real, p95_ms real)`              | Measures the average, median, and 95th percentile query latency of the index for each `lakebase_ann.probes` value in the `text[]` array. Requires `lakebase_vector` 1.1.2 and above.                                                                              |
| `lakebase_ann_sample(NULL::<table>, sample_size integer DEFAULT 128)` | `SETOF` the table's row type                                             | Samples up to `sample_size` rows from the table specified by `NULL::<table>`. Requires `lakebase_vector` 1.1.2 and above.                                                                                                                                         |

### Index options

| Option       | Type   | Default      | Description                                                                                                                                                                                                                                                                                              |
| :----------- | :----- | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build_mode` | string | `'standard'` | Controls the accuracy/speed tradeoff. Use `'quality'` for better recall at the cost of a significantly longer index build. `'fast'` remains supported for backward compatibility.                                                                                                                        |
| `lists`      | string | `'auto'`     | Sets the IVF partition layout. With `'auto'`, the extension chooses a value based on the statistics of the table and the configuration of the index. Set a single integer such as `'1000'` for a one-level index, or two ascending comma-separated integers such as `'100, 1000'` for a two-level index. |

### Search parameters

| GUC                      | Type   | Default  | Description                                                                                                                                                                 |
| :----------------------- | :----- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lakebase_ann.probes`    | string | `'auto'` | Number of IVF partitions to scan at each level. Higher values improve recall at the cost of latency. The shape must match the `lists` array from `lakebase_ann_index_info`. |
| `lakebase_ann.epsilon`   | string | `'auto'` | Controls how many candidates are reranked using full-precision distances. Higher values rerank more candidates and take longer.                                             |
| `lakebase_ann.prefilter` | enum   | `off`    | Evaluates non-vector filters before full-precision distance reranking. Valid values are `on` and `off`. Best for cheap filters that remove most candidate rows.             |

<NeedHelp />
