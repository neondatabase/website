---
title: The hnsw extension
subtitle: Use Hierarchical Navigable Small World (HNSW) vector similarity search in PostgreSQL 
enableTableOfContents: true
isDraft: true
---

The `hnsw` extension enables the use of the [Hierarchical Navigable Small World (HNSW)](https://arxiv.org/abs/1603.09320) algorithm for vector similarity search in PostgreSQL.

HNSW is a graph-based approach to indexing multi-dimensional data. It constructs a hierarchy of graphs, where each layer is a subset of the previous one. During a search, it navigates through the graphs to quickly find the nearest neighbors. HNSW graphs are known for their superior performance in terms of speed and recall.

![HNSW graph](/docs/extensions/hnsw_graph.webp)

Neon's `hnsw` extension is based on the [ivf-hnsw](https://github.com/dbaranchuk/ivf-hnsw.git) implementation of the HSNW algorithm, presented in the article [Revisiting the Inverted Indices for Billion-Scale Approximate Nearest Neighbors](https://openaccess.thecvf.com/content_ECCV_2018/html/Dmitry_Baranchuk_Revisiting_the_Inverted_ECCV_2018_paper.html).

<Admonition type="note">
The `pg_vector` extension, also supported by Neon, is another option for vector similarity search. For information on which index to choose, refer to the [Comparing the hnsw extension to pg_vector](#comparing-the-hnsw-extension-to-pg_vector) section.
</Admonition>

## How HNSW search works

The search process begins at the topmost layer of the HNSW graph. The starting point is usually a node that has been pre-selected as a good general starting point for searches.

From the starting node, the algorithm navigates to the nearest neighbor in the same layer that is closer to the query point. This step is repeated until there are no more neighbors that are closer to the query point.

Once the algorithm can't find any closer nodes in the current layer, it moves down to the next layer and repeats the process of navigating to the nearest neighbor.

The process of navigating to the nearest neighbor and moving down a layer is repeated until the algorithm reaches the bottom layer of the graph.

In the bottom layer, the algorithm continues navigating to the nearest neighbor until it can't find any nodes that are closer to the query point. The current node is then returned as the most similar node to the query point.

The key idea behind HNSW is that by starting the search at the top layer and moving down, the algorithm can quickly navigate to the area of the graph that contains the query point. This makes the search process much faster than if it had to search through every node in the graph.

The "distance" between nodes is determined by some measure of similarity, which depends on the specific application. For example, in a recommendation system, the distance might be based on how similar two users' preferences are.

## Using the hnsw extension

This section describes how to use the `hnsw` extension in Neon using a simplistic example to demonstrate the required statements, syntax, and options.

### Enable the extension

You can enable the `hnsw` extension in Neon by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION hnsw;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

### Create a table for vector data

To create a table for storing vectors, issue a create table statement similar to the following:

```sql
CREATE TABLE vectors(id INTEGER, vec REAL[]);
```

This statement generates a table named `vectors` with an `vec` column for storing vector data. Your table and vector column names may differ.

### Insert data

Execute an `INSERT` statement similar to the following to store your vector data. For demonstration purposes, the statement shown below stores vectors with 3 dimensions. By comparison, OpenAI's `text-embedding-ada-002` model supports 1536 dimensions for each piece of text. For more information, see [Embeddings](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings), in the OpenAI documentation.

```sql
INSERT INTO vectors(id, vec) 
VALUES 
(1, '{1.1, 2.2, 3.3}'),
(2, '{4.4, 5.5, 6.6}'),
(3, '{7.7, 8.8, 9.9}');
```

### Create the HNSW index

Use a `CREATE INDEX` statement similar to the following to add an `hnsw` index on your vector colum.

```sql
CREATE INDEX ON vectors USING hnsw(vec) WITH (maxelements=10, dims=3, m=3);
```

The following index parameters are used in the `CREATE INDEX` statement above:

- `maxelements`: Sets the maximum size of the index by defining the maximum number of indexed elements. This is a required parameter. The example above has a value f `10`. A real-world example might have a much large value, such as `1000000`.
  An "element" refers to a data point or a vector in the dataset, each represented as a node in the graph constructed by the HNSW algorithm.  
- `dims`: Defines the number of dimensions in your vector data (if not defined in the column type definition). This is a required parameter. If you were storing data generated using OpenAI's `text-embedding-ada-002` model, which supports 1536 dimensions, you would define a value of 1536, for example.
- `m`: Defines the maximum number of links (also referred to as edges) created for every new element during the construction of the graph.

The following additional index parameters are supported by the `hnsw` extension:

- `efConstruction`: Defines the number of neighbors considered during index construction. A high `efConstruction` value creates a higher quality graph and offers more accurate search results, but it also means the index building process takes longer. (e.g., `efsearch=16`)
- `efsearch`: Defines the number of neighbors that are considered during index search. A high value produces more accurate search results but at the cost of increased search time. This value should be equal or larger than k (the number of nearest neighbors you want your search to return). (e.g., `efsearch=64`)

## Query the indexed data

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

## Tuning the HNSW algorithm

The `m`, `efSearch`, and `efConstruction` are parameters control the behavior of the HNSW algorithm.

- `m`: This is the branching factor or the maximum number of connections for each node in the graph. It determines the number of bi-directional links created for each new element during the construction of the graph. A higher value of m will increase the recall but also the memory consumption and the construction time.
- `efSearch`: This is the size of the dynamic list used during the search phase. It influences the trade-off between the recall and speed of the query. A higher value of efSearch will increase the recall but also the query time.
- `efConstruction`: This is the size of the dynamic list used during the construction phase. It influences the trade-off between the index quality and the construction speed. A higher value of efConstruction will improve the quality of the index but also increase the construction time.

These parameters allow you to tune the HNSW algorithm according to your specific needs. For example, if you need to prioritize speed over accuracy, you might choose lower values for `m` and `efSearch`. On the other hand, if you need to prioritize accuracy over speed, you might choose higher values.

## Comparing the hnsw extension to pg_vector

When determining which index to use, `pg_vector` with an IVFFlat or HNSW, it's helpful to compare the two based on specific criteria:

- Search speed
- Accuracy
- Memory usage
- Index construction speed
- Distance metrics

|                   | IVFFlat    | HNSW     |
|-------------------|------------|----------|
| Search Speed      | Fast, but the search speed depends on the number of clusters examined. More clusters mean higher accuracy but slower search times. | Typically faster than IVFFlat, especially in high-dimensional spaces, thanks to its graph-based nature. |
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
