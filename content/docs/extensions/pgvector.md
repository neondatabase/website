---
title: The pgvector extension
subtitle: Use the pgvector for vector similarity search in Postgres
enableTableOfContents: true
updatedOn: '2023-11-14T12:31:38.456Z'
---

The `pgvector` extension enables you to store vector embeddings and perform vector similarity search in Postgres. It is particularly useful for applications involving natural language processing, such as those built on top of OpenAI's GPT models. This topic describes how to enable the `pgvector` extension in Neon and how to create, store, and query vectors.

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

## Resources

`pgvector` source code: [https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)

<NeedHelp/>
