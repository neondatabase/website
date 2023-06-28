---
title: The hnsw extension
subtitle: Use Hierarchical Navigable Small World (HNSW) vector similarity search in PostgreSQL 
enableTableOfContents: true
isDraft: true
---

The `hnsw` extension (currently in _Beta_) enables the use of the [Hierarchical Navigable Small World (HNSW)](https://arxiv.org/abs/1603.09320) algorithm for vector similarity search in PostgreSQL.



HNSW is a graph-based approach to indexing multi-dimensional data. It constructs a multi-layered graph, where each layer is a subset of the previous one. During a search, the algorithm navigates through the graph from the top layer to the lowest layer to quickly find the nearest neighbor. An HNSW graph is known for its superior performance in terms of speed and accuracy.

![HNSW graph](/docs/extensions/hnsw_graph.webp)

Neon's `hnsw` extension is based on the [ivf-hnsw](https://github.com/dbaranchuk/ivf-hnsw.git) implementation of the HSNW algorithm, presented in the article [Revisiting the Inverted Indices for Billion-Scale Approximate Nearest Neighbors](https://openaccess.thecvf.com/content_ECCV_2018/html/Dmitry_Baranchuk_Revisiting_the_Inverted_ECCV_2018_paper.html).

<Admonition type="note">
The `pg_vector` extension, also supported by Neon, is another option for vector similarity search. For information on which index to choose, refer to [Comparing the hnsw extension to pg_vector](#comparing-the-hnsw-extension-to-pg_vector).
</Admonition>

## How HNSW search works

The search process begins at the topmost layer of the HNSW graph. From the starting node, the algorithm navigates to the nearest neighbor in the same layer. This step is repeated until it can no longer find neighbors that are more similar to the query vector.

Using the found node as an entry point, the algorithm then moves down to the next layer in the graph and repeats the process of navigating to the "nearest neighbor". The process of navigating to the nearest neighbor and moving down a layer is repeated until the algorithm reaches the bottom layer.

In the bottom layer, the algorithm continues navigating to the nearest neighbor until it can't find any nodes that are more similar to the query vector. The current node is then returned as the most similar node to the query vector.

The key idea behind HNSW is that by starting the search at the top layer and moving down through each layer, the algorithm can quickly navigate to the area of the graph that contains the node that is most similar to the query vector. This makes the search process much faster than if it had to search through every node in the graph.

## Using the hnsw extension

This section describes how to use the `hnsw` extension in Neon using a simple example demonstrating the required statements, syntax, and options.

### Enable the extension

You can enable the `hnsw` extension in Neon by running the following `CREATE EXTENSION` statement in the Neon [SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor).

```sql
CREATE EXTENSION hnsw;
```

### Create a table for vector data

Vectors can be stored in a table similar to the following:

```sql
CREATE TABLE vectors(id INTEGER, vec REAL[]);
```

This statement generates a table named `vectors` with a `vec` column for storing vector data. (Your table and vector column names may differ.)

### Insert data

To insert vector data, you would use an `INSERT` statement similar to the following.

```sql
INSERT INTO vectors(id, vec) 
VALUES 
(1, '{1.1, 2.2, 3.3}'),
(2, '{4.4, 5.5, 6.6}'),
(3, '{7.7, 8.8, 9.9}');
```

The example above stores vectors with 3 dimensions. In a real-world example, the number of dimensions would be much larger. For example, OpenAI's `text-embedding-ada-002` model supports 1536 dimensions for each piece of text. For more information, see [Embeddings](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings), in the _OpenAI documentation_.

### Create the HNSW index

Use a `CREATE INDEX` statement similar to the following to create an `hnsw` index on your vector colum:

```sql
CREATE INDEX ON vectors USING hnsw(vec) WITH (maxelements=3, dims=3, m=3);
```

The following HNSW index options are used in the statement above:

- `maxelements`: Defines the maximum number of elements indexed. This is a required parameter. The example has a value of `3`. A real-world example might have a much large value, such as `1000000`. An "element" refers to a data point (a vector) in the dataset, each represented as a node in the an HNSW graph. Typically, you would set this option to a value able to accommodate the number of rows in your in your dataset.
- `dims`: Defines the number of dimensions in your vector data.  This is a required parameter. A small value is used in the example above. If you are storing data generated using OpenAI's `text-embedding-ada-002` model, which supports 1536 dimensions, you would define a value of `1536`, for example.
- `m`: Defines the maximum number of bi-directional links (also referred to as "edges") created for each node during graph construction.

The following additional index options are supported:

- `efConstruction`: Defines the number of nearest neighbors considered during index construction. The default value is `32`.
- `efsearch`: Defines the number of nearest neighbors considered during index search. The default value is `32`.

For information about how you can configure these options to influence the HNSW algorithm, refer to [Tuning the HNSW algorithm](#tuning-the-hnsw-algorithm).

## Query the indexed data

To query the `vectors` table for nearest neighbors, you can use a query similar to this:

```sql
SELECT id FROM vectors ORDER BY vec <-> array[1.1, 2.2, 3.3] LIMIT 2;
```

where:

- `SELECT id FROM vectors` selects the `id` field from all records in the `vectors` table.
- `<->`: This is the PostgreSQL "distance between" operator. It calculates the Euclidean distance between the query vector and each row of the dataset.
- `ORDER BY` sorts the selected records in ascending order based on the calculated distances. In other words, records with values closer to the `[1.1, 2.2, 3.3]` query vector will be returned first.
- `LIMIT 2` limits the result set to the first two records after sorting.

In summary, the query retrieves the IDs of the two records from the `vectors` table whose value is closest to the `[1.1, 2.2, 3.3]` query vector according to Euclidean distance."

## Tuning the HNSW algorithm

The `m`, `efConstruction`, and `efSearch` options described above allow you to tune the HNSW algorithm when creating an index:

- `m`: Defines the maximum number of bi-directional links (also referred to as "edges") created for each node during graph construction. A higher value increases accuracy (recall) but also increases the size of the index in memory and index construction time.
- `efContsruction`: Defines the number of nearest neighbors considered during index construction. The default value is `32`. This setting influences the trade-off between index quality and construction speed. A high `efConstruction` value creates a higher quality graph, enabling more accurate search results, but a higher value also means that index construction takes longer.
- `efSearch`: Defines the number of nearest neighbors considered during index search. The default value is `32`.  This setting influences the trade-off between query accuracy (recall) and speed. A higher `efSearch` value increases accuracy at the cost of speed. This value should be equal or larger than k (the number of nearest neighbors you want your search to return).

If you want to prioritize for search speed over accuracy, you would use lower values for `m` and `efSearch`. Conversely, to prioritize accuracy over speed, you would use higher value for `m` and `efSearch`, and also use a higher `efContsruction` value to support more accurate search results.

<Admonition type="info">
A benchmark performed by Neon using the _GIST-960 Euclidean dataset_, which provides a training set of 1 million vectors of 960 dimensions, and a test set of 100, used the following index option values:

- `m`: 32, 64, 128
- `efConstruction`: 64, 128, 256
- `efSearch`: 32, 64, 128, 256, 512

For more information about the benchmark, see [Introducing the HNSW Index for vector search in Postgres](tbd).
</Admonition>

## Comparing the hnsw extension to pg_vector

When determining which index to use, `pg_vector` with an IVFFlat or HNSW, it's helpful to compare the two based on specific criteria:

- Search speed
- Accuracy
- Memory usage
- Index construction speed
- Distance metrics

|                   | `pgvector` with IVFFlat    | HNSW     |
|-------------------|------------|----------|
| Search Speed      | Fast but search speed depends on the number of clusters examined. More clusters mean higher accuracy but slower search times. | Typically faster than IVFFlat, especially in high-dimensional spaces, thanks to its graph-based nature. |
| Accuracy          | Can achieve high accuracy but at the cost of examining more clusters and  longer search times. | Generally achieves higher accuracy for the same memory footprint compared to IVFFlat. |
| Memory Usage      | Uses less memory since it only stores the centroids of clusters and the lists of vectors within these clusters. | Uses more memory because it maintains a graph structure with multiple layers. |
| Index Construction Speed | Index building process is relatively fast. The data points are assigned to the nearest centroid, and inverted lists are constructed. | Index construction involves building multiple layers of graphs, which can be computationally intensive, especially if you choose high values for the parameter ef_construction. |
| Distance Metrics  | Typically used for L2 distances, but pgvector also supports inner product and cosine distance. | Currently supports L2 distance metrics. |

Ultimately, the choice between the `pg_vector` with an IVFFlat or HNSW depends on your use case and requirements:

- Memory constraints: If you are working under strict memory constraints, you may opt for the IVFFlat index as it typically consumes less memory than HNSW. However, be mindful that this might come at the cost of search speed and accuracy.
- Search speed: If your primary concern is the speed at which you can retrieve nearest neighbors, especially in high-dimensional spaces, the HNSW extension is likely the better choice due to its graph-based approach.
- Accuracy and recall: If achieving high accuracy and recall is critical for your application, HNSW may be the better option. Its graph-based approach generally yields better recall compared to IVFFlat.
- Distance metrics: Both `pgvector` and `hnsw` support L2 distance metric (`<->`). Additionally, `pgvector` supports inner product (`<#>`) and cosine distance (`<=>`).

## hnsw extension GitHub repository

The GitHub repository for Neon's `hnsw` extension can be found [here](https://github.com/knizhnik/hnsw).
