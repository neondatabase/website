---
title: The pgvector extension
subtitle: Use the pgvector for vector similarity search in Postgres
enableTableOfContents: true
updatedOn: '2024-01-23T19:40:04.086Z'
---

The `pgvector` extension enables you to store vector embeddings and perform vector similarity search in Postgres. It is particularly useful for applications involving natural language processing, such as those built on top of OpenAI's GPT models. This topic describes how to enable the `pgvector` extension in Neon and how to create, store, and query vectors.

<CTA />

## Enable the pgvector extension

You can enable the `pgvector` extension by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION vector;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## Create a table to store vectors

To create a table for storing vectors, use the following SQL command, adjusting the dimensions as needed.

```sql
CREATE TABLE items (
  id BIGSERIAL PRIMARY KEY,
  embedding VECTOR(3)
);
```

The command generates a table named `items` with an `embedding` column capable of storing vectors with 3 dimensions. OpenAI's `text-embedding-ada-002` model supports 1536 dimensions for each piece of text, which creates more accurate embeddings for natural language processing tasks. For more information about embeddings, see [Embeddings](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings), in the _OpenAI documentation_.

## Storing vectors and embeddings

After you have generated an embedding using a service like the OpenAI API, you can store the resulting vector in your database. Using a Postgres client library in your preferred programming language, you can execute an `INSERT` statement similar to the following to store embeddings:

```sql
INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
```

This command inserts two new rows into the items table with the provided embeddings.

## Querying vectors

To retrieve vectors and calculate similarity, use `SELECT` statements and the built-in vector operators. For instance, you can find the top 5 most similar items to a given embedding using the following query:

```sql
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```

This query computes the Euclidean distance (L2 distance) between the given vector and the vectors stored in the items table, sorts the results by the calculated distance, and returns the top 5 most similar items.

`pgvector` also supports inner product (`<#>`) and cosine distance (`<=>`).

For more information about querying vectors, refer to the [pgvector README](https://github.com/pgvector/pgvector).

## Indexing vectors

Using an index on the vector column can improve query performance with a minor cost in recall.

You can add an index for each distance function you want to use. For example, the following query adds an ivfflat index to the `embedding` column for the L2 distance function:

```sql
CREATE INDEX ON items USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
```

This query adds an HNSW index to the `embedding` column for the L2 distance function:

```sql
CREATE INDEX ON items USING hnsw (embedding vector_l2_ops);
```

For additional indexing guidance and examples, see [Indexing](https://github.com/pgvector/pgvector/tree/8bf360ed84bfdeba9caa19e9f193fd9ad8dd9e73#indexing), in the _pgvector README_.

<Admonition type="note">
If you encounter an error similar to the following while attempting to create an index, you can increase the `maintenance_work_mem` setting to the required amount of memory using a `SET` or `ALTER DATABASE` statement.

```text
ERROR: memory required is 202 MB, maintenance_work_mem is 67 MB
```

The default `maintenance_work_mem` setting depends on your [compute size](/docs/manage/endpoints#compute-size-and-autoscaling-configuration). The `SET` statement changes the value for the current session. `ALTER DATABASE` updates the session default.

```sql
SET maintenance_work_mem TO '205MB';
```

or

```sql
ALTER DATABASE <dbname> SET maintenance_work_mem TO '205MB';
```

Always consider your compute instance's memory resources when adjusting this parameter, as setting it too high could lead to out-of-memory situations or unexpected behavior.

</Admonition>

## Optimizing index build time

To optimize index build time, consider configuring the following session variables prior to building an index:

- [maintenance_work_mem](#maintenance_work_mem)
- [max_parallel_maintenance_workers](#max_parallel_maintenance_workers)

### maintenance_work_mem

In Postgres, the `maintenance_work_mem` setting determines the maximum memory allocation for tasks such as `CREATE INDEX`. The default `maintenance_work_mem` value in Neon is set according to your Neon [compute size](/docs/manage/endpoints#how-to-size-your-compute):

| Compute Units (CU) | vCPU | RAM   |  maintenance_work_mem    |
|--------------|------|-------|--------------------------|
| 0.25         | 0.25 | 1 GB  |   64 MB                  |
| 0.50         | 0.50 | 2 GB  |   64 MB                  |
| 1            | 1    | 4 GB  |   67 MB                  |
| 2            | 2    | 8 GB  |   134 MB                 |
| 3            | 3    | 12 GB |   201 MB                 |
| 4            | 4    | 16 GB |   268 MB                 |
| 5            | 5    | 20 GB |   335 MB                 |
| 6            | 6    | 24 GB |   402 MB                 |
| 7            | 7    | 28 GB |   470 MB                 |

To optimize `pgvector` index build time, you can increase the `maintenance_work_mem` setting for the current session with a command similar to the following:  

```sql
SET maintenance_work_mem='10 GB';
```

The recommended setting is your working set size (the size of your tuples for vector index creation). However, your `maintenance_work_mem` setting should not exceed 50 to 60 percent of your compute's available RAM (see the table above). For example, the `maintenance_work_mem='10 GB'` setting shown above has been successfully tested on a 7 CU compute, which has 28 GB of RAM, as 10 GiB is less than 50% of the RAM available for that compute size.

### max_parallel_maintenance_workers

The `max_parallel_maintenance_workers` sets the maximum number of parallel workers that can be started by a single utility command such as `CREATE INDEX`. By default, the `max_parallel_maintenance_workers` setting is `2`. For efficient parallel index creation, you can increase this setting. Parallel workers are taken from the pool of processes established by `max_worker_processes` (`10`), limited by `max_parallel_workers` (`8`). 

You can increase the `maintenance_work_mem` setting for the current session with a command similar to the following:  

```sql
SET max_parallel_maintenance_workers = 7
```

For example, if you have a 7 CU compute size, you could set `max_parallel_maintenance_workers` to 7, before index creation, to make use of all of the vCPUs available.

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
