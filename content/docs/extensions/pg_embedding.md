---
title: The pg_embedding extension
subtitle: Use Neon's pg_embedding extension with Hierarchical Navigable Small World (HNSW) for faster vector similarity search in PostgreSQL 
enableTableOfContents: true
---

The `pg_embedding` extension enables the use of the Hierarchical Navigable Small World (HNSW) algorithm for vector similarity search in PostgreSQL.

Neon's `pg_embedding` extension is based on the [ivf-hnsw](https://github.com/dbaranchuk/ivf-hnsw.git) implementation of the HSNW algorithm, presented in the article [Revisiting the Inverted Indices for Billion-Scale Approximate Nearest Neighbors](https://openaccess.thecvf.com/content_ECCV_2018/html/Dmitry_Baranchuk_Revisiting_the_Inverted_ECCV_2018_paper.html).

<Admonition type="note">
Neon also supports `pgvector` for vector similarity search. For information on which index to choose, refer to [Comparing pgvector and pg_embedding](#comparing-pgvector-and-pgembedding).
</Admonition>

## Using the pg_embedding extension

This section describes using the `pg_embedding` extension in Neon with a simple example demonstrating the required statements, syntax, and options.

### Usage summary

The statements in this usage summary are described in further detail in the sections that follow.

```sql
CREATE EXTENSION embedding;
CREATE TABLE documents(id integer PRIMARY KEY, embedding real[]);
SELECT id FROM documents ORDER BY embedding <-> ARRAY[1.1, 2.2, 3.3] LIMIT 1;
```

### Enable the extension

To enable the `pg_embedding` extension, run the following `CREATE EXTENSION` statement in the Neon [SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor).

```sql
CREATE EXTENSION embedding;
```

### Create a table for your vector data

To store your vector data, create a table similar to the following:

```sql
CREATE TABLE documents(id INTEGER, embedding REAL[]);
```

This statement generates a table named `documents` with an `embedding` column for storing vector data. Your table and vector column names may differ.

### Insert data

To insert vector data, use an `INSERT` statement similar to the following:

```sql
INSERT INTO documents(id, embedding) 
VALUES (1, '{1.1, 2.2, 3.3}'),(2, '{4.4, 5.5, 6.6}');
```

## Query the nearest neighbors by L2 distance

To query the nearest neighbors by L2 distance, use a query similar to this:

```sql
SELECT id FROM documents ORDER BY embedding <-> array[1.1, 2.2, 3.3] LIMIT 1;
```

where:

- `SELECT id FROM documents` selects the `id` field from all records in the `documents` table.
- `<->`: This is a "distance between" operator. It calculates the Euclidean distance (L2) between the query vector and each row of the dataset.
- `ORDER BY` sorts the selected records in ascending order based on the calculated distances. In other words, records with values closer to the `[1.1, 2.2, 3.3]` query vector will be returned first.
- `LIMIT 1` limits the result set to one record after sorting.

In summary, the query retrieves the ID of the record from the `documents` table whose value is closest to the `[1.1, 2.2, 3.3]` query vector according to Euclidean distance.

### Create an HNSW index

To optimize search behavior, you can add an HNSW index. To create the HNSW index on your vector column, use a `CREATE INDEX` statement similar to the following:

```sql
CREATE INDEX ON documents USING hnsw(embedding) WITH (maxelements=1000, dims=3, m=8);
```

<Admonition type="note">
When creating and HNSW index, please be aware of the following:

- HNSW indexes are created in memory. If your compute suspends, expect the index to be rebuilt the next time it is accessed. By default, Neon suspends computes after 300 seconds (5 minutes) of inactivity. The [Neon Pro](/docs/introduction/pro-plan) plan enables configuring or disabling Neon's [Auto-suspension](/docs/manage/endpoints#auto-suspend-configuration) feature.
- The amount of compute memory available with the Neon Free Tier supports indexing up 50K rows (with metadata) and embeddings of up to 1536 dimensions. Indexing larger data sizes requires compute instances with more memory. The [Neon Pro plan](https://console.neon.tech/app/billing) offers compute sizes with up to 28 GB RAM.
- Neon's [Autoscaling](/docs/introduction/autoscaling) feature, available with the Pro plan, does not account for the memory used by an HNSW index. Autoscaling is therefore not recommended for use with HNSW indexes. Use a fixed sized compute instead. For more information, see [Compute size and Autoscaling configuration](/docs/manage/endpoints#compute-size-and-autoscaling-configuration).
</Admonition>

### HNSW index options

- `maxelements`: Defines the maximum number of elements indexed. This is a required parameter.
- `dims`: Defines the number of dimensions in your vector data.  This is a required parameter.
- `m`: Defines the maximum number of links (also referred to as "edges") created for each node during graph construction.
- `efConstruction`: Defines the number of nearest neighbors considered during index construction. The default value is `32`.
- `efsearch`: Defines the number of nearest neighbors considered during index search. The default value is `32`.

### Tuning the HNSW algorithm

The `m`, `efConstruction`, and `efSearch` options allow you to tune the HNSW algorithm when creating an index:

- `m`: This option defines the maximum number of links or "edges" created for each node during graph construction. A higher value increases accuracy (recall) but also increases the size of the index in memory and index construction time.
- `efConstruction`: This option influences the trade-off between index quality and construction speed. A high `efConstruction` value creates a higher quality graph, enabling more accurate search results, but a higher value also means that index construction takes longer.
- `efSearch`: This option influences the trade-off between query accuracy (recall) and speed. A higher `efSearch` value increases accuracy at the cost of speed. This value should be equal to or larger than `k`, which is the number of nearest neighbors you want your search to return.

In summary, to prioritize search speed over accuracy, use lower values for `m` and `efSearch`. Conversely, to prioritize accuracy over search speed, use a higher value for `m` and `efSearch`. A higher `efConstruction` value enables more accurate search results at the cost of index build time, which is also affected by the `maxelements` setting.

<Admonition type="info">
For an idea of how to configure index option values, consider the benchmark performed by Neon using the _GIST-960 Euclidean dataset_, which provides a training set of 1 million vectors of 960 dimensions. The benchmark was run with this series of index option values:

- `m`: 32, 64, and 128
- `efConstruction`: 64, 128, and 256
- `efSearch`: 32, 64, 128, 256, and 512

To learn more about the benchmark, see [Introducing pg_embedding extension for vector search in Postgres and LangChain](https://neon.tech/blog/pg-embedding-extension-for-vector-search). Try experimenting with different settings to find the ones that work best for your particular application.
</Admonition>

## How HNSW search works

HNSW is a graph-based approach to indexing multi-dimensional data. It constructs a multi-layered graph, where each layer is a subset of the previous one. During a search, the algorithm navigates through the graph from the top layer to the bottom to quickly find the nearest neighbor. An HNSW graph is known for its superior performance in terms of speed and accuracy.

![HNSW graph](/docs/extensions/hnsw_graph.png)

The search process begins at the topmost layer of the HNSW graph. From the starting node, the algorithm navigates to the nearest neighbor in the same layer. The algorithm repeats this step until it can no longer find neighbors more similar to the query vector.

Using the found node as an entry point, the algorithm moves down to the next layer in the graph and repeats the process of navigating to the nearest neighbor. The process of navigating to the nearest neighbor and moving down a layer is repeated until the algorithm reaches the bottom layer.

In the bottom layer, the algorithm continues navigating to the nearest neighbor until it can't find any nodes that are more similar to the query vector. The current node is then returned as the most similar node to the query vector.

The key idea behind HNSW is that by starting the search at the top layer and moving down through each layer, the algorithm can quickly navigate to the area of the graph that contains the node that is most similar to the query vector. This makes the search process much faster than if it had to search through every node in the graph.

## Comparing pgvector and pg_embedding

When determining which index to use, `pgvector` with an IVFFlat index or `pg_embedding` with an HNSW, it's helpful to compare the two indexes based on specific criteria, such as:

- Search speed
- Accuracy
- Memory usage
- Index construction speed
- Distance metrics

|                   | `pgvector` with IVFFlat    | `pg_embedding` with HNSW     |
|-------------------|------------|----------|
| Search Speed      | Fast, but search speed depends on the number of clusters examined. More clusters mean higher accuracy but slower search times. | Typically faster than IVFFlat, especially in high-dimensional spaces, thanks to its graph-based nature. |
| Accuracy          | Can achieve high accuracy but at the cost of examining more clusters and  longer search times. | Generally achieves higher accuracy for the same memory footprint compared to IVFFlat. |
| Memory Usage      | Uses less memory since it only stores the centroids of clusters and the lists of vectors within these clusters. | HNSW indexes are built in memory. They require more memory than IVFFlat because they build a graph structure with multiple layers. |
| Index Construction Speed | Index building process is relatively fast. The data points are assigned to the nearest centroid, and inverted lists are constructed. | Index construction involves building multiple layers of graphs, which can be computationally intensive, especially for a high `ef_construction` value. In Neon, if a compute suspends, an HNSW index is rebuilt on the next access. |
| Distance Metrics  | Typically used for L2 distances, but `pgvector` also supports inner product and cosine distance. | Currently supports L2 distance. |

Ultimately, the choice between the `pgvector` with IVFFlat or `pg_embedding` with HNSW depends on your use case and requirements. Here are a few additional points to consider when making your choice:

- **Memory constraints**: If you are working under strict memory constraints, you may opt for the IVFFlat index, as it typically consumes less memory than an HNSW index. However, be mindful that this might come at the cost of search speed and accuracy.
- **Search speed**: If your primary concern is the speed at which you can retrieve nearest neighbors, especially in high-dimensional spaces, an HNSW index is likely the better choice due to its graph-based approach.
- **Accuracy and recall**: If achieving high accuracy and recall is critical for your application, an HNSW index may be the better option. Its graph-based approach generally yields better recall compared to IVFFlat.
- **Distance metrics**: Both `pgvector` and `pg_embedding` support the L2 distance metric (`<->`). Additionally, `pgvector` supports inner product (`<#>`) and cosine distance (`<=>`).

## pg_embedding extension GitHub repository

The GitHub repository for Neon's `pg_embedding` extension can be found [here](https://github.com/neondatabase/pg_embedding).

## Further reading

To further your understanding of HNSW, the following resources are recommended:

- [Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs, Yu. A. Malkov, D. A. Yashunin](https://arxiv.org/ftp/arxiv/papers/1603/1603.09320.pdf)
- [Similarity Search, Part 4: Hierarchical Navigable Small World (HNSW)](https://towardsdatascience.com/similarity-search-part-4-hierarchical-navigable-small-world-hnsw-2aad4fe87d37)
- [IVFPQ + HNSW for Billion-scale Similarity Search](https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e)

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
