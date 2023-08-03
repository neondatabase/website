---
title: The pg_embedding extension
subtitle: Use Neon's pg_embedding extension with Hierarchical Navigable Small World (HNSW) for graph-based vector similarity search in PostgreSQL 
enableTableOfContents: true
---

The `pg_embedding` extension enables the use of the Hierarchical Navigable Small World (HNSW) algorithm for vector similarity search in PostgreSQL.

<Admonition type="important">
The `pg_embedding` extension was updated on August 3, 2023 to add support for on-disk index creation and additional distance metrics. If you installed `pg_embedding` before this date and want to update to the new version, please see [Upgrade to pg_embedding with on-disk indexes](#upgrade-to-pg_embedding-for-on-disk-indexes) for instructions.
</Admonition>

This extension is based on [ivf-hnsw](https://github.com/dbaranchuk/ivf-hnsw) implementation of HNSW
the code for the current state-of-the-art billion-scale nearest neighbor search system<sup>[[1]](#references)</sup>.

<Admonition type="note">
Neon also supports `pgvector` for vector similarity search. For information on which index to choose, refer to [Comparing pgvector and pg_embedding](#comparing-pgvector-and-pgembedding).
</Admonition>

## Using the pg_embedding extension

This section describes how to use the `pg_embedding` extension in Neon with simple examples that demonstrates the required statements, syntax, and options.

### Usage summary

The statements in this summary are described in further detail in the sections that follow.

```sql
CREATE EXTENSION embedding;
CREATE TABLE documents(id integer PRIMARY KEY, embedding real[]);
INSERT INTO documents(id, embedding) VALUES (1, '{0,1,2}'), (2, '{1,2,3}'),  (3, '{1,1,1}');
SELECT id FROM documents ORDER BY embedding <-> ARRAY[3,3,3] LIMIT 1;
```

### Enable the extension

To enable the `pg_embedding` extension, run the following `CREATE EXTENSION` statement in the Neon [SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor):

```sql
CREATE EXTENSION embedding;
```

### Create a table for your vector data

To store your vector data, create a table similar to the following:

```sql
CREATE TABLE documents(id INTEGER, embedding real[]);
```

This statement generates a table named `documents` with a `real[]` type column for storing vector data. Your table and vector column names may differ.

### Insert data

To insert vector data, use an `INSERT` statement similar to the following:

<CodeBlock shouldWrap>

```sql
INSERT INTO documents(id, embedding) VALUES (1, '{0,1,2}'), (2, '{1,2,3}'),  (3, '{1,1,1}');
```

</CodeBlock>

## Similarity search

The `pg_embedding` extension supports Euclidean (L2), Cosine, and Manhattan distance metrics.

Euclidean (L2) distance:

```sql
SELECT id FROM documents ORDER BY embedding <-> array[3,3,3] LIMIT 1;
```

Cosine distance:

```sql
SELECT id FROM documents ORDER BY embedding <=> array[3,3,3] LIMIT 1;
```

Manhattan distance:

```sql
SELECT id FROM documents ORDER BY embedding <~> array[3,3,3] LIMIT 1;
```

where:

- `SELECT id FROM documents` selects the `id` field from all records in the `documents` table.
- `ORDER BY` sorts the selected records in ascending order based on the calculated distances. In other words, records with values closer to the `[1.1, 2.2, 3.3]` query vector according to the distance metric will be returned first.
- `<->`, `<=>`, and `<~>` operators define the distance metric, which calculates the distance between the query vector and each row of the dataset.
- `LIMIT 1` limits the result set to one record after sorting. You can adjust this value as required.

In summary, the query retrieves the ID of the record from the `documents` table whose value is closest to the `[3,3,3]` query vector according to the specified distance metric.

### Create an HNSW index

To optimize search behavior, you can add an HNSW index. To create the HNSW index on your vector column, use a `CREATE INDEX` statement as shown in the following examples. The `pg_embedding` extension supports indexes for use with Euclidean, Cosine, and Manhattan distance metrics. You must ensure that your search query syntax matches the index that you define. You will notice in the query examples below that each distance metric has a specific operator (`<->`, `<=>`, and `<~>`).

Euclidean (L2) distance index:

```sql
CREATE INDEX ON documents USING hnsw(embedding) WITH (dims=3, m=3);
SET enable_seqscan = off;
SELECT id FROM documents ORDER BY embedding <-> array[3,3,3] LIMIT 1;
```

Cosine distance index:

```sql
CREATE INDEX ON documents USING hnsw(embedding ann_cos_ops) WITH (dims=3, m=3);
SET enable_seqscan = off;
SELECT id FROM documents ORDER BY embedding <=> array[3,3,3] LIMIT 1;
```

Manhattan distance index:

```sql
CREATE INDEX ON documents USING hnsw(embedding ann_manhattan_ops) WITH (dims=3, m=3);
SET enable_seqscan = off;
SELECT id FROM documents ORDER BY embedding <~> array[3,3,3] LIMIT 1;
```

### Tuning the HNSW algorithm

The following options allow you to tune the HNSW algorithm when creating an index:

- `dims`: Defines the number of dimensions in your vector data.  This is a required parameter.
- `m`: Defines the maximum number of links or "edges" created for each node during graph construction. A higher value increases accuracy (recall) but also increases the size of the index in memory and index construction time.
- `efConstruction`: Influences the trade-off between index quality and construction speed. A high `efConstruction` value creates a higher quality graph, enabling more accurate search results, but a higher value also means that index construction takes longer.
- `efSearch`: Influences the trade-off between query accuracy (recall) and speed. A higher `efSearch` value increases accuracy at the cost of speed. This value should be equal to or larger than `k`, which is the number of nearest neighbors you want your search to return (defined by the `LIMIT` clause in your `SELECT` query).

In summary, to prioritize search speed over accuracy, use lower values for `m` and `efSearch`. Conversely, to prioritize accuracy over search speed, use a higher value for `m` and `efSearch`. A higher `efConstruction` value enables more accurate search results at the cost of index build time, which is also affected by the size of your dataset.

<Admonition type="info">
For an idea of how to configure index option values, consider the benchmark performed by Neon using the _GIST-960 Euclidean dataset_, which provides a training set of 1 million vectors of 960 dimensions. The benchmark was run with this series of index option values:

- `dims`: 960
- `m`: 32, 64, and 128.
- `efConstruction`: 64, 128, and 256
- `efSearch`: 32, 64, 128, 256, and 512

For a million rows of data, we recommend an `m` setting between 48 and 64, and as mentioned [above](#tuning-the-hnsw-algorithm), `efSearch` should be equal to or larger than the number of nearest neighbors you want your search to return.

To learn more about the benchmark, see [Introducing pg_embedding extension for vector search in Postgres and LangChain](https://neon.tech/blog/pg-embedding-extension-for-vector-search). Try experimenting with different settings to find the ones that work best for your particular application.
</Admonition>

## How HNSW search works

HNSW is a graph-based approach to indexing multi-dimensional data. It constructs a multi-layered graph, where each layer is a subset of the previous one. During a search, the algorithm navigates through the graph from the top layer to the bottom to quickly find the nearest neighbor. An HNSW graph is known for its superior performance in terms of speed and accuracy.

![HNSW graph](/docs/extensions/hnsw_graph.png)

The search process begins at the topmost layer of the HNSW graph. From the starting node, the algorithm navigates to the nearest neighbor in the same layer. The algorithm repeats this step until it can no longer find neighbors more similar to the query vector.

Using the found node as an entry point, the algorithm moves down to the next layer in the graph and repeats the process of navigating to the nearest neighbor. The process of navigating to the nearest neighbor and moving down a layer is repeated until the algorithm reaches the bottom layer.

In the bottom layer, the algorithm continues navigating to the nearest neighbor until it cannot find any nodes that are more similar to the query vector. The current node is then returned as the most similar node to the query vector.

The key idea behind HNSW is that by starting the search at the top layer and moving down through each layer, the algorithm can quickly navigate to the area of the graph that contains the node that is most similar to the query vector. This makes the search process much faster than if it had to search through every node in the graph.

## Comparing pgvector and pg_embedding

When determining which index to use, `pgvector` with an IVFFlat index or `pg_embedding` with an HNSW, it is helpful to compare the two indexes based on specific criteria, such as:

- Search speed
- Accuracy
- Memory usage
- Index construction speed
- Distance metrics

|                   | `pgvector` with IVFFlat    | `pg_embedding` with HNSW     |
|-------------------|------------|----------|
| Search Speed      | Fast, but search speed depends on the number of clusters examined. More clusters mean higher accuracy but slower search times. | Typically faster than IVFFlat, especially in high-dimensional spaces, thanks to its graph-based nature. |
| Accuracy          | Can achieve high accuracy but at the cost of examining more clusters and  longer search times. | Generally achieves higher accuracy for the same memory footprint compared to IVFFlat. |
| Memory Usage      | Uses less memory since it only stores the centroids of clusters and the lists of vectors within these clusters. | Require more memory than IVFFlat because they build a graph structure with multiple layers. |
| Index Construction Speed | Index building process is relatively fast. The data points are assigned to the nearest centroid, and inverted lists are constructed. | Index construction involves building multiple layers of graphs, which can be computationally intensive, especially for a high `ef_construction` value. |
| Distance Metrics  | Typically used for L2 distances, but `pgvector` also supports inner product and cosine distance. | Supports L2, Cosine, and Manhattan distance metrics. |

Ultimately, the choice between the `pgvector` with IVFFlat or `pg_embedding` with HNSW depends on your use case and requirements. Here are a few additional points to consider when making your choice:

- **Memory constraints**: If you are working under strict memory constraints, you may opt for the IVFFlat index, as it typically consumes less memory than an HNSW index. However, be mindful that this might come at the cost of search speed and accuracy.
- **Search speed**: If your primary concern is the speed at which you can retrieve nearest neighbors, especially in high-dimensional spaces, an HNSW index is likely the better choice due to its graph-based approach.
- **Accuracy and recall**: If achieving high accuracy and recall is critical for your application, an HNSW index may be the better option. Its graph-based approach generally yields better recall compared to IVFFlat.
- **Distance metrics**: `pgvector` supports the L2 (`<->`), inner product (`<#>`), and cosine (`<=>`). The `pg_embedding` extension supports L2 (`<->`), cosine (`<=>`), and Manhattan (`<~>`).

## Migrate from pgvector to pg_embedding

Before you begin, it is important to understand that the `pgvector` extension stores vector embeddings in a `VECTOR` column type, whereas the `pg_embedding` extension stores vector embeddings as an array of `real[]` numbers, as demonstrated in the following `CREATE TABLE` statements:

`pg_vector`:

```sql
CREATE TABLE items (id BIGSERIAL PRIMARY KEY, embedding VECTOR(3));
```

`pg_embedding`:

```sql
CREATE TABLE documents(id BIGSERIAL PRIMARY KEY, embedding real[]);
```

The first step in the migration process is to install the `pg_embedding` extension:

```sql
CREATE EXTENSION embedding;
```

Once the `pg_embedding` extension is installed, you can use the same vector embedding table used with `pgvector`. This is possible because the `VECTOR` type used by `pgvector` is compatible with the `real[]` type used by `pg_embedding`. The only requirement is that you modify vector search queries to interpret the `VECTOR` data as an array of real numbers (`real[]`). For example, take this `pgvector` query:

```sql
SELECT id, embedding FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 1;
```

To make the query work with `pg_embedding`, you must cast the `embedding` column to `real[]` (`embedding::real[]`) and define the search vector as an array: `ARRAY[3,1,2]`:

```sql
SELECT id, embedding::real[] FROM items ORDER BY embedding::real[] <-> ARRAY[3,1,2] LIMIT 1;
```

Alternatively, if you want to avoid typecasting, you can alter your table to change the embedding column type from `VECTOR` to `real[]`. This operation may be time and resource intensive, depending on the size of your dataset, so please proceed with caution, as it could affect application availability.

Given a table defined for `pgvector`, such as this one:

```sql
CREATE TABLE items (id BIGSERIAL PRIMARY KEY, embedding VECTOR(3));
```

You can alter the table as follows to change the column type:

```sql
ALTER TABLE items
ALTER COLUMN embedding
TYPE real[]
USING (embedding::real[]);
```

You can also change the column type by adding a new `real[]` type column to your table, copying the data from the `VECTOR` column to the new column, dropping the old `VECTOR` column, and renaming the new column:

```sql
ALTER TABLE items ADD COLUMN embedding_real real[]; // Add column
UPDATE items SET embedding_real = embedding::real[]; // Copy data
ALTER TABLE items DROP COLUMN embedding; // Drop the old column
ALTER TABLE items RENAME COLUMN embedding_real TO embedding; // Rename the new column
```

If you choose to change the column type from `VECTOR` to `real[]` instead of typecasting, you still have to [create an HNSW index](#create-an-hnsw-index) (if you are indexing your data) and update your application queries to use the required [pg_embedding query syntax](#similarity-search) for the defined index.

## Upgrade to pg_embedding for on-disk indexes

The `pg_embedding` extension version in Neon was updated on August 3, 2023 to add support for on-disk HNSW indexes and additional distance metrics. If you installed `pg_embedding` before this date, you can upgrade to the new version (0.3.5 and higher) following the instructions below.

The previous `pg_embedding` version (0.1.0 and earlier) creates HNSW indexes in memory, which means that indexes are recreated on the first index access after a compute restart. Also, this version only supports Euclidean (2) distance. The new `pg_embedding` version adds support for Cosine and Manhattan distance metrics.

Upgrading to the new version of `pg_embedding` requires dropping the existing `pg_embedding` extension and installing the new version. If your compute has not restarted recently, you may be required to restart it to make the new extension version available for installation.

To upgrade:

1. Drop the existing extension (0.1.0 or earlier):

    ```sql
    DROP EXTENSION embedding CASCADE;
    ```

2. Ensure that the new version of the extension is available for installation. The **default_version** should be 0.3.5 or higher.

    ```sql
    SELECT * FROM pg_available_extension WHERE name = 'embedding';
    ```

    If the **default_version** is not 0.3.5 or higher, restart your compute instance. Pro users can do so by temporarily setting your **Auto-suspend** setting to a low value like 2 seconds, allowing the compute to restart, and then setting **Auto-suspend** back to its normal value. For instructions, refer to the _Auto-suspend_ configuration details in [Edit a compute endpoint](/docs/manage/endpoints#edit-a-compute-endpoint).

3. Install the new version of the extension.

    ```sql
    CREATE EXTENSION embedding;
    ```

6. Verify that the **installed_version** of the extension is now 0.3.5 or higher.

    ```sql
    SELECT * FROM pg_available_extension WHERE name = 'embedding';
    ```

## pg_embedding extension GitHub repository

The GitHub repository for the Neon `pg_embedding` extension can be found [here](https://github.com/neondatabase/pg_embedding).

## Further reading

To further your understanding of HNSW, the following resources are recommended:

- [Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs, Yu. A. Malkov, D. A. Yashunin](https://arxiv.org/ftp/arxiv/papers/1603/1603.09320.pdf)
- [Similarity Search, Part 4: Hierarchical Navigable Small World (HNSW)](https://towardsdatascience.com/similarity-search-part-4-hierarchical-navigable-small-world-hnsw-2aad4fe87d37)
- [IVFPQ + HNSW for Billion-scale Similarity Search](https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e)

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
