---
title: The hnsw extension
subtitle: Use Hierarchical Navigable Small World (HNSW) vector similarity search in PostgreSQL 
enableTableOfContents: true
isDraft: true
---

The `hnsw` extension enables the use of [Hierarchical Navigable Small World (HNSW) proximity graphs](https://arxiv.org/abs/1603.09320) for vector similarity search in PostgreSQL. HNSW is a graph-based approach to indexing high-dimensional data. It constructs a hierarchy of graphs, where each layer is a subset of the previous one. During a search, it navigates through the graphs to quickly find the nearest neighbors. HNSW graphs are known for their superior performance in terms of speed and recall.

Neon's `hnsw` extension is based on the [ivf-hnsw](https://github.com/dbaranchuk/ivf-hnsw.git) implementation of HSNW, the code for the current state-of-the-art billion-scale nearest neighbor search system presented in the article [Revisiting the Inverted Indices for Billion-Scale Approximate Nearest Neighbors](https://openaccess.thecvf.com/content_ECCV_2018/html/Dmitry_Baranchuk_Revisiting_the_Inverted_ECCV_2018_paper.html).

An HNSW index is held in memory (built on demand). Its maximum size is limited by the `maxelements` index parameter. Another required parameter is `dims`, the number of dimensions (if not specified in the column type definition). An optional parameter, `ef`, specifies the number of neighbors that are considered during index construction and search. This parameter corresponds to the `efConstruction` and `efSearch` parameters described in the article referenced above.

## Enable the hnsw extension

You can enable the `hnsw` extension by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION hnsw;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](../get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](../connect/query-with-psql-editor).

## Create a table for vector data

To create a table for storing vectors, issue a create table statement similar to the following:

```sql
CREATE TABLE vectors(id INTEGER, vec REAL[];
```

The command generates a table named `vectors` with an `vec` column for storing vectorized data. Your table and vector column name may differ.

## Insert data

Using a PostgreSQL client library in your preferred programming language, execute an `INSERT` statement similar to the following to store your vector data. For demonstration purposes, the command stores vectors with 3 dimensions. For the sake of comparison, OpenAI's `text-embedding-ada-002` model supports 1536 dimensions for each piece of text. For more information about embeddings, see [Embeddings](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings), in the OpenAI documentation.

```sql
INSERT INTO vectors(id, vec) 
VALUES 
(1, '{1.1, 2.2, 3.3}'),
(2, '{4.4, 5.5, 6.6}'),
(3, '{7.7, 8.8, 9.9}');
```

## Indexing vectors using hnsw

Use a `CREATE INDEX` statement similar to the following to add the index on your vector colum.

```sql
CREATE INDEX ON vectors USING hnsw(vec) WITH (maxelements=1000000, dims=3, m=32);
```

An `hsnw` index has the following parameters:

- `maxelements`: The maximum number of elements.
- `dims`: The number of dimensions a row of vectorized data.
- `m`: This parameter refers to the maximum number of bidirectional links created for every new element during the construction of the graph.
- `efConstruction`: This parameter is used during the index building phase. Higher `efConstruction` values lead to a higher quality graph and, consequently, more accurate search results. However, it also means the index building process take longer.
- `efsearch`: This parameter is used during the search phase. Like `efConstruction`, a larger `efSearch` value results in more accurate search results at the cost of increased search time. This value should be equal or larger than k (the number of nearest neighbors you want to return). (e.g., `efsearch=64`)

## Querying

```sql
SELECT id FROM vectors ORDER BY vec <-> array[1.0, 2.0,...] LIMIT 100;
```

## hnsw Extension GitHub repository

The GitHub repository for the `hnsw` extension can be found [here](https://github.com/knizhnik/hnsw).
