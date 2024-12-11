---
title: The pgvector extension
subtitle: Enable Postgres as a vector store with the pgvector extension
enableTableOfContents: true
updatedOn: '2024-12-11T21:23:33.085Z'
---

The `pgvector` extension enables you to store vector embeddings and perform vector similarity search in Postgres. It is particularly useful for applications involving natural language processing, such as those built on top of OpenAI's GPT models.

`pgvector` supports:

- Exact and approximate nearest neighbor search
- Single-precision, half-precision, binary, and sparse vectors
- L2 distance, inner product, cosine distance, L1 distance, Hamming distance, and Jaccard distance
- Any language with a Postgres client
- ACID compliance, point-in-time recovery, JOINs, and all other Postgres features

This topic describes how to enable the `pgvector` extension in Neon and how to create, store, and query vectors.

<CTA />

## Enable the pgvector extension

You can enable the `pgvector` extension by running the following `CREATE EXTENSION` statement in the **Neon SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION vector;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## Create a table to store vectors

To create a table for storing vectors, you would use an SQL command similar to the following. Embeddings are stored in the `VECTOR` type column. You can adjust the number of dimensions as needed.

```sql
CREATE TABLE items (
  id BIGSERIAL PRIMARY KEY,
  embedding VECTOR(3)
);
```

<Admonition type="note">
The `pgvector` extension supports some specialized types other than `VECTOR` for storing embeddings. See [HNSW vector types](#hnsw-vector-types), and [IVFFlat vector types](#ivfflat-vector-types).
</Admonition>

This command generates a table named `items` with an `embedding` column capable of storing vectors with 3 dimensions. OpenAI's `text-embedding-3-small` model supports 1536 dimensions by default for each piece of text, which creates more accurate embeddings for natural language processing tasks. However, using larger embeddings generally costs more and consumes more compute, memory, and storage than using smaller embeddings. To learn more about embeddings and the cost-performance tradeoff, see [Embeddings](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings), in the _OpenAI documentation_.

## Storing embeddings

After generating embeddings using a service like [OpenAI’s Embeddings API](https://platform.openai.com/docs/api-reference/embeddings), you can store them in your database. Using a Postgres client library in your preferred programming language, you can execute an `INSERT` statement similar to the following to store embeddings.

- Insert two new rows into the `items` table with the provided embeddings.

  ```sql
  INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
  ```

- Load vectors in bulk using the `COPY` command:

  ```sql
  COPY items (embedding) FROM STDIN WITH (FORMAT BINARY);
  ```

   <Admonition type="tip">
   For a Python script that loads embeddings in bulk, refer to this [Bulk loading with COPY](https://github.com/pgvector/pgvector-python/blob/master/examples/loading/example.py) example provided in the `pgvector` GitHub repository.
   </Admonition>

- Upsert vectors:

  ```sql
  INSERT INTO items (id, embedding) VALUES (1, '[1,2,3]'), (2, '[4,5,6]')
     ON CONFLICT (id) DO UPDATE SET embedding = EXCLUDED.embedding;
  ```

- Update vectors:

  ```sql
  UPDATE items SET embedding = '[1,2,3]' WHERE id = 1;
  ```

- Delete vectors:

  ```sql
  DELETE FROM items WHERE id = 1;
  ```

## Querying vectors

To retrieve vectors and calculate similarity, use `SELECT` statements and the distance function operators supported by `pgvector`.

- Get the nearest neighbor to a vector by L2 distance:

  ```sql
  SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
  ```

- Get the nearest neighbor to a row by L2 distance:

  ```sql
  SELECT * FROM items WHERE id != 1 ORDER BY embedding <-> (SELECT embedding FROM items WHERE id = 1) LIMIT 5;
  ```

- Get rows within a certain distance by L2 distance:

  ```sql
  SELECT * FROM items WHERE embedding <-> '[3,1,2]' < 5;
  ```

   <Admonition type="note">
   To use an index with a query, include `ORDER BY` and `LIMIT` clauses, as shown in the second query example above.
   </Admonition>

### Distance function operators

- `<->` - L2 distance
- `<#>` - (negative) inner product
- `<=>` - cosine distance
- `<+>` - L1 distance

<Admonition type="note">
The inner product operator (`<#>`) returns the negative inner product since Postgres only supports `ASC` order index scans on operators.
</Admonition>

### Distance queries

- Get the distances:

  ```sql
  SELECT embedding <-> '[3,1,2]' AS distance FROM items;
  ```

- For inner product, multiply by `-1` (since `<#>` returns the negative inner product):

  ```sql
  SELECT (embedding <#> '[3,1,2]') * -1 AS inner_product FROM items;
  ```

- For cosine similarity, use `1 -` cosine distance:

  ```sql
  SELECT 1 - (embedding <=> '[3,1,2]') AS cosine_similarity FROM items;
  ```

### Aggregate queries

- To average vectors:

  ```sql
  SELECT AVG(embedding) FROM items;
  ```

- To average groups of vectors:

  ```sql
  SELECT category_id, AVG(embedding) FROM items GROUP BY category_id;
  ```

## Indexing vectors

By default, `pgvector` performs exact nearest neighbor search, providing perfect recall. Adding an index on the vector column can improve query performance with a minor cost in recall. Unlike typical indexes, you will see different results for queries after adding an approximate index.

Supported index types include:

- [HNSW](#hnsw)
- [IVFFLAT](#ivfflat)

### HNSW

An HNSW index creates a multilayer graph. It has better query performance than an IVFFlat index (in terms of speed-recall tradeoff), but has slower build times and uses more memory. Also, an HNSW index can be created without any data in the table since there isn’t a training step like there is for an IVFFlat index.

#### HNSW vector types

HNSW indexes are supported with the following vector types:

- `vector` - up to 2,000 dimensions
- `halfvec` - up to 4,000 dimensions
- `bit` - up to 64,000 dimensions
- `sparsevec` - up to 1,000 non-zero elements

<Admonition type="note">
Notice how indexes are defined differently depending on the distance function being used. For example `vector_l2_ops` is specified for L2 distance, `vector_ip_ops` for inner product, and so on. Make sure you define your index according to the distance function you intend to use.
</Admonition>

- L2 distance:

  ```sql
  CREATE INDEX ON items USING hnsw (embedding vector_l2_ops);
  ```

- Inner product:

  ```sql
  CREATE INDEX ON items USING hnsw (embedding vector_ip_ops);
  ```

- Cosine distance:

  ```sql
  CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);
  ```

- L1 distance:

  ```sql
  CREATE INDEX ON items USING hnsw (embedding vector_l1_ops);
  ```

- Hamming distance:

  ```sql
  CREATE INDEX ON items USING hnsw (embedding bit_hamming_ops);
  ```

- Jaccard distance:

  ```sql
  CREATE INDEX ON items USING hnsw (embedding bit_jaccard_ops);
  ```

#### HNSW index build options

- `m` - the max number of connections per layer (16 by default)
- `ef_construction` - the size of the dynamic candidate list for constructing the graph (`64` by default)

This example demonstrates how to set the parameters:

```sql
CREATE INDEX ON items USING hnsw (embedding vector_l2_ops) WITH (m = 16, ef_construction = 64);
```

A higher value of `ef_construction` provides better recall at the cost of index build time and insert speed.

#### HNSW index query options

You can specify the size of the candidate list for search. The size is `40` by default.

```sql
SET hnsw.ef_search = 100;
```

A higher value provides better recall at the cost of speed.

This query shows how to use `SET LOCAL` inside a transaction to set `ef_search` for a single query:

```sql
BEGIN;
SET LOCAL hnsw.ef_search = 100;
SELECT ...
COMMIT;
```

#### HNSW index build time

To optimize index build time, consider configuring the `maintenance_work_mem` and `max_parallel_maintenance_workers` session variables before building an index:

<Admonition type="note">
Like other index types, it’s faster to create an index after loading your initial data.
</Admonition>

- `maintenance_work_mem`

  Indexes build significantly faster when the graph fits into Postgres `maintenance_work_mem`.

  A notice is shown when the graph no longer fits:

  ```text
  NOTICE:  hnsw graph no longer fits into maintenance_work_mem after 100000 tuples
  DETAIL:  Building will take significantly more time.
  HINT:  Increase maintenance_work_mem to speed up builds.
  ```

  In Postgres, the `maintenance_work_mem` setting determines the maximum memory allocation for tasks such as `CREATE INDEX`. The default `maintenance_work_mem` value in Neon is set according to your Neon [compute size](/docs/manage/endpoints#how-to-size-your-compute):

  | Compute Units (CU) | vCPU | RAM   | maintenance_work_mem |
  | ------------------ | ---- | ----- | -------------------- |
  | 0.25               | 0.25 | 1 GB  | 64 MB                |
  | 0.50               | 0.50 | 2 GB  | 64 MB                |
  | 1                  | 1    | 4 GB  | 67 MB                |
  | 2                  | 2    | 8 GB  | 134 MB               |
  | 3                  | 3    | 12 GB | 201 MB               |
  | 4                  | 4    | 16 GB | 268 MB               |
  | 5                  | 5    | 20 GB | 335 MB               |
  | 6                  | 6    | 24 GB | 402 MB               |
  | 7                  | 7    | 28 GB | 470 MB               |
  | 8                  | 8    | 32 GB | 537 MB               |

  To optimize `pgvector` index build time, you can increase the `maintenance_work_mem` setting for the current session with a command similar to the following:

  ```sql
  SET maintenance_work_mem='10 GB';
  ```

  The recommended setting is your working set size (the size of your tuples for vector index creation). However, your `maintenance_work_mem` setting should not exceed 50 to 60 percent of your compute's available RAM (see the table above). For example, the `maintenance_work_mem='10 GB'` setting shown above has been successfully tested on a 7 CU compute, which has 28 GB of RAM, as 10 GB is less than 50% of the RAM available for that compute size.

- `max_parallel_maintenance_workers`

  You can also speed up index creation by increasing the number of parallel workers. The default is `2`.

  The `max_parallel_maintenance_workers` sets the maximum number of parallel workers that can be started by a single utility command such as `CREATE INDEX`. By default, the `max_parallel_maintenance_workers` setting is `2`. For efficient parallel index creation, you can increase this setting. Parallel workers are taken from the pool of processes established by `max_worker_processes` (`10`), limited by `max_parallel_workers` (`8`).

  You can increase the `maintenance_work_mem` setting for the current session with a command similar to the following:

  ```sql
  SET max_parallel_maintenance_workers = 7
  ```

  For example, if you have a 7 CU compute size, you could set `max_parallel_maintenance_workers` to 7, before index creation, to make use of all of the vCPUs available.

  For a large number of workers, you may also need to increase the Postgres `max_parallel_workers`, which is `8` by default.

#### Check indexing progress

You can check indexing progress with the following query:

```sql shouldWrap
SELECT phase, round(100.0 * blocks_done / nullif(blocks_total, 0), 1) AS "%" FROM pg_stat_progress_create_index;
```

The phases for HNSW are:

1. initializing
2. loading tuples

For related information, see [CREATE INDEX Progress Reporting](https://www.postgresql.org/docs/current/progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING), in the _PostgreSQL documentation_.

### IVFFlat

An IVFFlat index divides vectors into lists and searches a subset of those lists that are closest to the query vector. It has faster build times and uses less memory than HNSW, but has lower query performance with respect to the speed-recall tradeoff.

Keys to achieving good recall include:

- Creating the index after the table has some data
- Choosing an appropriate number of lists. A good starting point is rows/1000 for up to 1M rows and `sqrt(rows)` for over 1M rows.
- Specifying an appropriate number of [probes](#hnsw-query-options) when querying. A higher number is better for recall, and a lower is better for speed. A good starting point is `sqrt(lists)`.

#### IVFFlat vector types

IVFFlat indexes are supported with the following vector types:

- `vector` - up to 2,000 dimensions
- `halfvec` - up to 4,000 dimensions (added in 0.7.0)
- `bit` - up to 64,000 dimensions (added in 0.7.0)

The following examples show how to add an index for each distance function:

<Admonition type="note">
Notice how indexes are defined differently depending on the distance function being used. For example `vector_l2_ops` is specified for L2 distance, `vector_cosine_ops` for cosine distance, and so on. 
</Admonition>

The following examples show how to add an index for each distance function:

- L2 distance

  ```sql
  CREATE INDEX ON items USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
  ```

   <Admonition type="note">
   Use `halfvec_l2_ops` for halfvec (and similar with the other distance functions).
   </Admonition>

- Inner product

  ```sql
  CREATE INDEX ON items USING ivfflat (embedding vector_ip_ops) WITH (lists = 100);
  ```

- Cosine distance

  ```sql
  CREATE INDEX ON items USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
  ```

- Hamming distance

  ```sql
  CREATE INDEX ON items USING ivfflat (embedding bit_hamming_ops) WITH (lists = 100);
  ```

#### IVFFlat query options

You can specify the number of probes, which is `1` by default.

```sql
SET ivfflat.probes = 10;
```

A higher value provides better recall at the cost of speed. You can set the value to the number of lists for exact nearest neighbor search, at which point the planner won’t use the index.

You can also use `SET LOCAL` inside a transaction to set the number of probes for a single query:

```sql
BEGIN;
SET LOCAL ivfflat.probes = 10;
SELECT ...
COMMIT;
```

#### IVFFlat index build time

To optimize index build time, consider configuring the `maintenance_work_mem` and `max_parallel_maintenance_workers` session variables before building an index:

<Admonition type="note">
Like other index types, it’s faster to create an index after loading your initial data.
</Admonition>

<Admonition type="note">
Like other index types, it’s faster to create an index after loading your initial data.
</Admonition>

- `maintenance_work_mem`

  In Postgres, the `maintenance_work_mem` setting determines the maximum memory allocation for tasks such as `CREATE INDEX`. The default `maintenance_work_mem` value in Neon is set according to your Neon [compute size](/docs/manage/endpoints#how-to-size-your-compute):

| Compute Units (CU) | vCPU | RAM    | maintenance_work_mem |
| :----------------- | :--- | :----- | :------------------- |
| 0.25               | 0.25 | 1 GB   | 64 MB                |
| 0.50               | 0.50 | 2 GB   | 64 MB                |
| 1                  | 1    | 4 GB   | 67 MB                |
| 2                  | 2    | 8 GB   | 134 MB               |
| 3                  | 3    | 12 GB  | 201 MB               |
| 4                  | 4    | 16 GB  | 268 MB               |
| 5                  | 5    | 20 GB  | 335 MB               |
| 6                  | 6    | 24 GB  | 402 MB               |
| 7                  | 7    | 28 GB  | 470 MB               |
| 8                  | 8    | 32 GB  | 537 MB               |
| 9                  | 9    | 36 GB  | 604 MB               |
| 10                 | 10   | 40 GB  | 671 MB               |
| 11                 | 11   | 44 GB  | 738 MB               |
| 12                 | 12   | 48 GB  | 805 MB               |
| 13                 | 13   | 52 GB  | 872 MB               |
| 14                 | 14   | 56 GB  | 939 MB               |
| 15                 | 15   | 60 GB  | 1007 MB              |
| 16                 | 16   | 64 GB  | 1074 MB              |
| 18                 | 18   | 72 GB  | 1208 MB              |
| 20                 | 20   | 80 GB  | 1342 MB              |
| 22                 | 22   | 88 GB  | 1476 MB              |
| 24                 | 24   | 96 GB  | 1610 MB              |
| 26                 | 26   | 104 GB | 1744 MB              |
| 28                 | 28   | 112 GB | 1878 MB              |
| 30                 | 30   | 120 GB | 2012 MB              |
| 32                 | 32   | 128 GB | 2146 MB              |
| 34                 | 34   | 136 GB | 2280 MB              |
| 36                 | 36   | 144 GB | 2414 MB              |
| 38                 | 38   | 152 GB | 2548 MB              |
| 40                 | 40   | 160 GB | 2682 MB              |
| 42                 | 42   | 168 GB | 2816 MB              |
| 44                 | 44   | 176 GB | 2950 MB              |
| 46                 | 46   | 184 GB | 3084 MB              |
| 48                 | 48   | 192 GB | 3218 MB              |
| 50                 | 50   | 200 GB | 3352 MB              |
| 52                 | 52   | 208 GB | 3486 MB              |
| 54                 | 54   | 216 GB | 3620 MB              |
| 56                 | 56   | 224 GB | 3754 MB              |

To optimize `pgvector` index build time, you can increase the `maintenance_work_mem` setting for the current session with a command similar to the following:

```sql
SET maintenance_work_mem='10 GB';
```

The recommended setting is your working set size (the size of your tuples for vector index creation). However, your `maintenance_work_mem` setting should not exceed 50 to 60 percent of your compute's available RAM (see the table above). For example, the `maintenance_work_mem='10 GB'` setting shown above has been successfully tested on a 7 CU compute, which has 28 GB of RAM, as 10 GB is less than 50% of the RAM available for that compute size.

- `max_parallel_maintenance_workers`

  You can also speed up index creation by increasing the number of parallel workers. The default is `2`.

  The `max_parallel_maintenance_workers` sets the maximum number of parallel workers that can be started by a single utility command such as `CREATE INDEX`. By default, the `max_parallel_maintenance_workers` setting is `2`. For efficient parallel index creation, you can increase this setting. Parallel workers are taken from the pool of processes established by `max_worker_processes` (`10`), limited by `max_parallel_workers` (`8`).

  You can increase the `maintenance_work_mem` setting for the current session with a command similar to the following:

  ```sql
  SET max_parallel_maintenance_workers = 7
  ```

  For example, if you have a 7 CU compute size, you could set `max_parallel_maintenance_workers` to 7, before index creation, to make use of all of the vCPUs available.

  For a large number of workers, you may also need to increase the Postgres `max_parallel_workers`, which is `8` by default.

#### Check indexing progress

You can check indexing progress with the following query:

```sql shouldWrap
SELECT phase, round(100.0 * blocks_done / nullif(blocks_total, 0), 1) AS "%" FROM pg_stat_progress_create_index;
```

The phases for HNSW are:

1. initializing
2. loading tuples

For related information, see [CREATE INDEX Progress Reporting](https://www.postgresql.org/docs/current/progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING), in the _PostgreSQL documentation_.

## Filtering

There are a few ways to index nearest neighbor queries with a `WHERE` clause:

```sql
SELECT * FROM items WHERE category_id = 123 ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```

Create an index on one or more of the `WHERE` columns for exact search"

```sql
CREATE INDEX ON items (category_id);
```

Create a [partial index](https://www.postgresql.org/docs/current/indexes-partial.html) on the vector column for approximate search:

```sql
CREATE INDEX ON items USING hnsw (embedding vector_l2_ops) WHERE (category_id = 123);
```

Use [partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html) for approximate search on many different values of the `WHERE` columns:

```sql
CREATE TABLE items (embedding vector(3), category_id int) PARTITION BY LIST(category_id);
```

## Half-precision vectors

Half-precision vectors enable the storage of vector embeddings using 16-bit floating-point numbers, or half-precision, which reduces both storage size and memory usage by nearly half compared 32-bit floats. This efficiency comes with minimal loss in precision, making half-precision vectors beneficial for applications dealing with large datasets or facing memory constraints.

When integrating OpenAI's embeddings, you can take advantage of half-precision vectors by storing embeddings in a compressed format. For instance, OpenAI’s high-dimensional embeddings can be effectively stored with half-precision vectors, achieving high levels of accuracy, such as a 98% rate. This approach optimizes memory usage while maintaining performance.

You can use the `halfvec` type to store half-precision vectors, as shown here:

```sql
CREATE TABLE items (id bigserial PRIMARY KEY, embedding halfvec(3));
```

## Binary vectors

Binary vector embeddings are a form of vector representation where each component is encoded as a binary digit, typically 0 or 1. For example, the word "cat" might be represented as `[0, 1, 0, 1, 1, 0, 0, 1, ...],` with each position in the vector being binary.

These embeddings are advantageous for their efficiency in both storage and computation. Because they use only one bit per dimension, binary embeddings require less memory compared to traditional embeddings that use floating-point numbers. This makes them useful when there is limited memory or when dealing with large datasets. Additionally, operations with binary values are generally quicker than those involving real numbers, leading to faster computations.

However, the trade-off with binary vector embeddings is a potential loss in accuracy. Unlike denser embeddings, which have real-valued entries and can represent subtleties in the data, binary embeddings simplify the representation. This can result in a loss of information and may not fully capture the intricacies of the data they represent.

Use the `bit` type to store binary vector embeddings:

```sql
CREATE TABLE items (id bigserial PRIMARY KEY, embedding bit(3));
INSERT INTO items (embedding) VALUES ('000'), ('111');
```

Get the nearest neighbors by Hamming distance (added in 0.7.0)

```sql
SELECT * FROM items ORDER BY embedding <~> '101' LIMIT 5;
```

Or (before 0.7.0)

```sql
SELECT * FROM items ORDER BY bit_count(embedding # '101') LIMIT 5;
```

Jaccard distance (`<%>`) is also supported with binary vector embeddings.

## Binary quantization

Binary quantization is a process that transforms dense or sparse embeddings into binary representations by thresholding vector dimensions to either 0 or 1.

Use expression indexing for binary quantization:

```sql
CREATE INDEX ON items USING hnsw ((binary_quantize(embedding)::bit(3)) bit_hamming_ops);
```

Get the nearest neighbors by Hamming distance:

```sql
SELECT * FROM items ORDER BY binary_quantize(embedding)::bit(3) <~> binary_quantize('[1,-2,3]') LIMIT 5;
```

Re-rank by the original vectors for better recall:

```sql
SELECT * FROM (
    SELECT * FROM items ORDER BY binary_quantize(embedding)::bit(3) <~> binary_quantize('[1,-2,3]') LIMIT 20
) ORDER BY embedding <=> '[1,-2,3]' LIMIT 5;
```

## Sparse vectors

Sparse vectors have a large number of dimensions, where only a small proportion are non-zero.

Use the `sparsevec` type to store sparse vectors:

```sql
CREATE TABLE items (id bigserial PRIMARY KEY, embedding sparsevec(5));
```

Insert vectors:

```sql
INSERT INTO items (embedding) VALUES ('{1:1,3:2,5:3}/5'), ('{1:4,3:5,5:6}/5');
```

The format is `{index1:value1,index2:value2}/dimensions` and indices start at 1 like SQL arrays.

Get the nearest neighbors by L2 distance:

```sql
SELECT * FROM items ORDER BY embedding <-> '{1:3,3:1,5:2}/5' LIMIT 5;
```

## Differences in behaviour between pgvector 0.5.1 and 0.7.0

Differences in behavior in the following corner cases were found during our testing of `pgvector` 0.7.0:

### Distance between a valid and NULL vector

The distance between a valid and `NULL` vector (`NULL::vector`) with `pgvector` 0.7.0 differs from `pgvector` 0.5.1 when using an HNSW or IVFFLAT index, as shown in the following examples:

**HNSW**

For the following script, comparing the `NULL::vector` to non-null vectors the resulting output changes:

```sql
SET enable_seqscan = off;

CREATE TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING hnsw (val vector_l2_ops);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <-> (SELECT NULL::vector);
```

`pgvector` 0.7.0 output:

```
   val
---------
 [1,1,1]
 [1,2,4]
 [1,2,3]
 [0,0,0]
```

`pgvector` 0.5.1 output:

```
   val
---------
 [0,0,0]
 [1,1,1]
 [1,2,3]
 [1,2,4]
```

**IVFFLAT**

For the following script, comparing the `NULL::vector` to non-null vectors the resulting output changes:

```sql
SET enable_seqscan = off;

CREATE TABLE t (val vector(3));
INSERT INTO t (val) VALUES ('[0,0,0]'), ('[1,2,3]'), ('[1,1,1]'), (NULL);
CREATE INDEX ON t USING ivfflat (val vector_l2_ops) WITH (lists = 1);

INSERT INTO t (val) VALUES ('[1,2,4]');

SELECT * FROM t ORDER BY val <-> (SELECT NULL::vector);
```

`pgvector` 0.7.0 output:

```sql
   val
---------
 [0,0,0]
 [1,2,3]
 [1,1,1]
 [1,2,4]
```

`pgvector` 0.5.1 output:

```sql
   val
---------
[0,0,0]
[1,1,1]
[1,2,3]
[1,2,4]
```

### Error messages improvement for invalid literals

If you use an invalid literal value for the `vector` data type, you will now see the following error message:

```sql
SELECT '[4e38,1]'::vector;
ERROR:  "4e38" is out of range for type vector
LINE 1: SELECT '[4e38,1]'::vector;
```

## Resources

`pgvector` source code: [https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)

<NeedHelp/>
