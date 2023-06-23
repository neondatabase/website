---
title: The hnsw extension
subtitle: Use Hierarchical Navigable Small World (HNSW) vector similarity search in PostgreSQL 
enableTableOfContents: true
isDraft: true
---

The `hnsw` extension enables the use of [Hierarchical Navigable Small World (HNSW) proximity graphs](https://arxiv.org/abs/1603.09320) for vector similarity search in PostgreSQL. HNSW is a graph-based approach to indexing high-dimensional data. It constructs a hierarchy of graphs, where each layer is a subset of the previous one. During a search, it navigates through the graphs to quickly find the nearest neighbors. HNSW graphs are known for their superior performance in terms of speed and recall.

Neon's `hnsw` extension is based on the [ivf-hnsw](https://github.com/dbaranchuk/ivf-hnsw.git) implementation of HSNW, the code for the current state-of-the-art billion-scale nearest neighbor search system presented in the article [Revisiting the Inverted Indices for Billion-Scale Approximate Nearest Neighbors](https://openaccess.thecvf.com/content_ECCV_2018/html/Dmitry_Baranchuk_Revisiting_the_Inverted_ECCV_2018_paper.html).

## Enable the hnsw extension

You can enable the `hnsw` extension by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION hnsw;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## Create a table for vector data

To create a table for storing vectors, issue a create table statement similar to the following:

```sql
CREATE TABLE vectors(id INTEGER, vec REAL[]);
```

This statement generates a table named `vectors` with an `vec` column for storing vector data. Your table and vector column names may differ.

## Insert data

Execute an `INSERT` statement similar to the following to store your vector data. For demonstration purposes, the statement shown below stores vectors with 3 dimensions. By comparison, OpenAI's `text-embedding-ada-002` model supports 1536 dimensions for each piece of text. For more information, see [Embeddings](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings), in the OpenAI documentation.

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
CREATE INDEX ON vectors USING hnsw(vec) WITH (maxelements=10, dims=3, m=3);
```

An `hsnw` index supports the following parameters:

- `maxelements`: Sets the maximum size of the index by defining the maximum number of indexed elements. This is a required parameter. The example above has a value f `10`. A real-world example might have a value of `1000000`.
- `dims`: Defines the number of dimensions in your vector data (if not defined in the column type definition). This is a required parameter. If you were storing data generated using OpenAI's `text-embedding-ada-002` model, which supports 1536 dimensions, you would define a value of 1536, for example.
- `m`: Defines the maximum number of bidirectional links (also referred to as edges) created for every new element during the construction of the graph.
- `efConstruction`: Defines the number of neighbors considered during index construction. A high `efConstruction` value creates a higher quality graph and offers more accurate search results, but it also means the index building process takes longer. (e.g., `efsearch=16`)
- `efsearch`: Defines the number of neighbors that are considered during index search. A high value produces more accurate search results but at the cost of increased search time. This value should be equal or larger than k (the number of nearest neighbors you want your search to return). (e.g., `efsearch=64`)

## Querying

To query the `vectors` table for nearest neighbors, you can use a query similar to this example:

```sql
SELECT id FROM vectors ORDER BY vec <-> array[1.1, 2.2, 3.3] LIMIT 2;
```

where:

- `SELECT id FROM vectors` selects the id field from all records in the `vectors` table.
- `<->`: This is the PostgreSQL "distance between" operator. It calculates the Euclidean distance between the vector `vec` in each row and the input array `[1.1, 2.2, 3.3]`.
- `ORDER BY ...` sorts the selected records in ascending order based on the calculated distances. In other words, records with vec values that are closer to `[1.1, 2.2, 3.3]` will be returned first.
- `LIMIT 2` limits the result set to the first two records after sorting.

In summary, the query retrieves the IDs of the two records in the vectors table whose value is closest to `[1.1, 2.2, 3.3]` according to Euclidean distance."

## hnsw Extension GitHub repository

The GitHub repository for the `hnsw` extension can be found [here](https://github.com/knizhnik/hnsw).
