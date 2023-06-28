---
title: The hnsw extension
subtitle: Use Hierarchical Navigable Small World (HNSW) vector similarity search in PostgreSQL 
enableTableOfContents: true
isDraft: true
---

The `hnsw` extension enables the use of the [Hierarchical Navigable Small World (HNSW)](https://arxiv.org/abs/1603.09320) algorithm for vector similarity search in PostgreSQL.

HNSW is a graph-based approach to indexing multi-dimensional data. It constructs a hierarchy of graph, where each layer is a subset of the previous one. During a search, it navigates through the graph to quickly find the nearest neighbor. An HNSW graph is known for their superior performance in terms of speed and recall.

![HNSW graph](/docs/extensions/hnsw_graph.webp)

Neon's `hnsw` extension is based on the [ivf-hnsw](https://github.com/dbaranchuk/ivf-hnsw.git) implementation of the HSNW algorithm, presented in the article [Revisiting the Inverted Indices for Billion-Scale Approximate Nearest Neighbors](https://openaccess.thecvf.com/content_ECCV_2018/html/Dmitry_Baranchuk_Revisiting_the_Inverted_ECCV_2018_paper.html).

<Admonition type="note">
The `pg_vector` extension, also supported by Neon, is another option for vector similarity search. For information on which index to choose, refer to [Comparing the hnsw extension to pg_vector](#comparing-the-hnsw-extension-to-pg_vector).
</Admonition>

## How HNSW search works

The search process begins at the topmost layer of the HNSW graph. From the starting node, the algorithm navigates to the nearest neighbor in the same layer. This step is repeated until it can no longer find neighbors that are more similar to the query vector.

The algorithm then moves down to the next layer in the graph and repeats the process of navigating to the "nearest neighbor". The process of navigating to the nearest neighbor and moving down a layer is repeated until the algorithm reaches the bottom layer of the graph.

In the bottom layer, the algorithm continues navigating to the nearest neighbor until it can't find any nodes that are more similar to the query vector. The current node is then returned as the most similar node to the query vector.

The key idea behind HNSW is that by starting the search at the top layer and moving down, the algorithm can quickly navigate to the area of the graph that contains the node that is most similar to the query vector. This makes the search process much faster than if it had to search through every node in the graph.

The "similarity" between nodes depends on the specific application.

## Using the hnsw extension

This section describes how to use the `hnsw` extension in Neon using a simple example that demonstrates the required statements, syntax, and options.

### Enable the extension

You can enable the `hnsw` extension in Neon by running the following `CREATE EXTENSION` statement in the Neon [SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to Neon.

```sql
CREATE EXTENSION hnsw;
```

### Create a table for vector data

To create a table for storing vectors, issue a create table statement similar to the following:

```sql
CREATE TABLE vectors(id INTEGER, vec REAL[]);
```

This statement generates a table named `vectors` with a `vec` column for storing vector data. (Your table and vector column names may differ.)

### Insert data

Execute an `INSERT` statement similar to the following to store your vector data.

```sql
INSERT INTO vectors(id, vec) 
VALUES 
(1, '{1.1, 2.2, 3.3}'),
(2, '{4.4, 5.5, 6.6}'),
(3, '{7.7, 8.8, 9.9}');
```

For demonstration purposes, the example above stores vectors with 3 dimensions. By comparison, OpenAI's `text-embedding-ada-002` model supports 1536 dimensions for each piece of text. For more information, see [Embeddings](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings), in the OpenAI documentation.

### Create the HNSW index

Use a `CREATE INDEX` statement similar to the following to create an `hnsw` index on your vector colum.

```sql
CREATE INDEX ON vectors USING hnsw(vec) WITH (maxelements=3, dims=3, m=3);
```

The following HNSW index option are used in the `CREATE INDEX` statement:

- `maxelements`: Defines the maximum number of indexed elements. This is a required parameter. The example above has a value f `3`. A real-world example might have a much large value, such as `1000000`.
  An "element" refers to a data point (a vector) in the dataset, each represented as a node in the graph constructed by the HNSW algorithm.  
- `dims`: Defines the number of dimensions in your vector data (if not defined in the column type definition). This is a required parameter. If you were storing data generated using OpenAI's `text-embedding-ada-002` model, which supports 1536 dimensions, you would define a value of 1536, for example.
- `m`: Defines the maximum number of links (also referred to as edges) created for every new element during the construction of the graph.

The following additional index options are supported:

- `efConstruction`: Defines the number of neighbors considered during index construction. The default value is `32`.
- `efsearch`: Defines the number of neighbors that are considered during index search. The default value is `32`.

For information about how you can configure these option to influence the HNSW algorithm, refer to [Tuning the HNSW algorithm](#tuning-the-hnsw-algorithm).

## Query the indexed data

To query the `vectors` table for nearest neighbors, you can use a query similar to this example:

```sql
SELECT id FROM vectors ORDER BY vec <-> array[1.1, 2.2, 3.3] LIMIT 2;
```

where:

- `SELECT id FROM vectors` selects the `id` field from all records in the `vectors` table.
- `<->`: This is the PostgreSQL "distance between" operator. It calculates the Euclidean distance between the vector in each row of the dataset and the query vector.
- `ORDER BY ...` sorts the selected records in ascending order based on the calculated distances. In other words, records with values closer to `[1.1, 2.2, 3.3]` will be returned first.
- `LIMIT 2` limits the result set to the first two records after sorting.

In summary, the query retrieves the IDs of the two records from the `vectors` table whose value is closest to `[1.1, 2.2, 3.3]` according to Euclidean distance."

## Tuning the HNSW algorithm

The following options allow you to tune the HNSW algorithm for speed and accuracy, according to your requirements.

- `m`: Defines the maximum number of bi-directional links (also referred to as "edges") created for each node during graph construction. A higher value increases accuracy (recall) but also increases the size of the index in memory and index construction time.
- `efSearch`: Defines the size of the dynamic list used during search. This setting influences the trade-off between query accuracy (recall) and speed. A higher `efSearch` value increases accuracy at the cost of speed.
- `efConstruction`: Defines the size of the dynamic list used during graph construction. This setting influences the trade-off between index quality and construction speed. A higher value  improves index quality at the cost of construction time. A high `efConstruction` value creates a higher quality graph and offers more accurate search results, but it means index construction takes longer. (e.g., `efsearch=16`)

For example, if you need to prioritize speed over accuracy, you would lower values for `m` and `efSearch`. On the other hand, if you need to prioritize accuracy over speed, you might choose higher values. A high value produces more accurate search results but at the cost of increased search time. This value should be equal or larger than k (the number of nearest neighbors you want your search to return). (e.g., `efsearch=64`)

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
| Accuracy          | Can achieve high accuracy but at the cost of examining more clusters and hence longer search times. | Generally achieves higher accuracy for the same memory footprint compared to IVFFlat. |
| Memory Usage      | It uses relatively less memory since it only stores the centroids of clusters and the lists of vectors within these clusters. | Generally uses more memory because it maintains a graph structure with multiple layers. |
| Index Construction Speed | Index building process is relatively fast. The data points are assigned to the nearest centroid, and inverted lists are constructed. | Index construction involves building multiple layers of graphs, which can be computationally intensive, especially if you choose high values for the parameter ef_construction. |
| Distance Metrics  | Typically used for L2 distances, but pgvector supports inner product and cosine distance as well. | Only uses L2 distance metrics at the moment. |

Ultimately, your choice between the `pg_vector` with an IVFFlat or HNSW depends on your use case and requirements:

- Memory Constraints (pgvector): If you are working under strict memory constraints, you may opt for the IVFFlat index as it typically consumes less memory than HNSW. However, be mindful that this might come at the cost of search speed and accuracy.
- Search Speed (HNSW): If your primary concern is the speed at which you can retrieve nearest neighbors, especially in high-dimensional spaces, the HNSW extension is likely the better choice due to its graph-based approach.
- Accuracy and Recall (HNSW): If achieving high accuracy and recall is critical for your application, HNSW may be the better option. Its graph-based approach generally yields higher recall levels compared to IVFFlat.
- Distance Metrics (pgvector): Both `pgvector` and `hnsw` support L2 distance metric (`<->`). Additionally, `pgvector` supports inner product (`<#>`) and cosine distance (`<=>`).

## hnsw extension GitHub repository

The GitHub repository for Neon's `hnsw` extension can be found [here](https://github.com/knizhnik/hnsw).
