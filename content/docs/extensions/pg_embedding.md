---
title: The pg_embedding extension
subtitle: Use Neon's pg_embedding extension with Hierarchical Navigable Small World (HNSW) for graph-based vector similarity search in Postgres 
enableTableOfContents: true
---

The `pg_embedding` extension enables the use of the Hierarchical Navigable Small World (HNSW) algorithm for vector similarity search in Postgres.

<Admonition type="note">
The `pg_embedding` extension was updated on August 3, 2023 to add support for on-disk index creation and additional distance metrics. If you installed `pg_embedding` before this date and want to upgrade to the new version, please see [Upgrade to pg_embedding with on-disk indexes](#upgrade-to-pg_embedding-for-on-disk-indexes) for instructions.
</Admonition>

This extension is based on [ivf-hnsw](https://github.com/dbaranchuk/ivf-hnsw) implementation of HNSW
the code for the current state-of-the-art billion-scale nearest neighbor search system<sup>[[1]](https://github.com/neondatabase/pg_embedding#references)</sup>.

Neon also supports `pgvector` for vector similarity search. See [The pgvector extension](/docs/extensions/pgvector).

## Using the pg_embedding extension

This section describes how to use the `pg_embedding` extension in Neon with simple examples demonstrating the required statements, syntax, and options.

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

The `pg_embedding` extension supports Euclidean (L2), cosine, and Manhattan distance metrics.

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

To optimize search behavior, you can add an HNSW index. To create the HNSW index on your vector column, use a `CREATE INDEX` statement as shown in the following examples. The `pg_embedding` extension supports indexes for use with Euclidean, cosine, and Manhattan distance metrics. You must ensure that your search query syntax matches the index that you define. You will notice in the query examples below that each distance metric has a specific operator (`<->`, `<=>`, or `<~>`).

Euclidean (L2) distance index:

<CodeBlock shouldWrap>

```sql
CREATE INDEX ON documents USING hnsw(embedding) WITH (dims=3, m=3, efconstruction=5, efsearch=5);

SELECT id FROM documents ORDER BY embedding <-> array[3,3,3] LIMIT 1;
```

</CodeBlock>

Cosine distance index:

<CodeBlock shouldWrap>

```sql
CREATE INDEX ON documents USING hnsw(embedding ann_cos_ops) WITH (dims=3, m=3, efconstruction=5, efsearch=5);

SELECT id FROM documents ORDER BY embedding <=> array[3,3,3] LIMIT 1;
```

</CodeBlock>

Manhattan distance index:

<CodeBlock shouldWrap>

```sql
CREATE INDEX ON documents USING hnsw(embedding ann_manhattan_ops) WITH (dims=3, m=3, efconstruction=5, efsearch=5);

SELECT id FROM documents ORDER BY embedding <~> array[3,3,3] LIMIT 1;
```

</CodeBlock>

### Tuning the HNSW algorithm

The following options allow you to tune the HNSW algorithm when creating an index:

- `dims`: Defines the number of dimensions in your vector data.  This is a required parameter.
- `m`: Defines the maximum number of links or "edges" created for each node during graph construction. A higher value increases accuracy (recall) but also increases the size of the index in memory and index construction time.
- `efconstruction`: Influences the trade-off between index quality and construction speed. A high `efconstruction` value creates a higher quality graph, enabling more accurate search results, but a higher value also means that index construction takes longer.
- `efsearch`: Influences the trade-off between query accuracy (recall) and speed. A higher `efsearch` value increases accuracy at the cost of speed. This value should be equal to or larger than `k`, which is the number of nearest neighbors you want your search to return (defined by the `LIMIT` clause in your `SELECT` query).

In summary, to prioritize search speed over accuracy, use lower values for `m` and `efsearch`. Conversely, to prioritize accuracy over search speed, use a higher value for `m` and `efsearch`. A higher `efconstruction` value enables more accurate search results at the cost of index build time, which is also affected by the size of your dataset.

<Admonition type="info">
For an idea of how to configure index option values, consider the benchmark performed by Neon using the _GIST-960 Euclidean dataset_, which provides a training set of 1 million vectors of 960 dimensions. The benchmark was run with this series of index option values:

- `dims`: 960
- `m`: 32, 64, and 128.
- `efconstruction`: 64, 128, and 256
- `efsearch`: 32, 64, 128, 256, and 512

For a million rows of data, we recommend an `m` setting between 48 and 64, and as mentioned [above](#tuning-the-hnsw-algorithm), `efsearch` should be equal to or larger than the number of nearest neighbors you want your search to return.

To learn more about the benchmark, see [Introducing pg_embedding extension for vector search in Postgres and LangChain](https://neon.tech/blog/pg-embedding-extension-for-vector-search). Try experimenting with different settings to find the ones that work best for your particular application.
</Admonition>

## How HNSW search works

HNSW is a graph-based approach to indexing multi-dimensional data. It constructs a multi-layered graph, where each layer is a subset of the previous one. During a search, the algorithm navigates through the graph from the top layer to the bottom to quickly find the nearest neighbor. An HNSW graph is known for its superior performance in terms of speed and accuracy.

![HNSW graph](/docs/extensions/hnsw_graph.png)

The search process begins at the topmost layer of the HNSW graph. From the starting node, the algorithm navigates to the nearest neighbor in the same layer. The algorithm repeats this step until it can no longer find neighbors more similar to the query vector.

Using the found node as an entry point, the algorithm moves down to the next layer in the graph and repeats the process of navigating to the nearest neighbor. The process of navigating to the nearest neighbor and moving down a layer is repeated until the algorithm reaches the bottom layer.

In the bottom layer, the algorithm continues navigating to the nearest neighbor until it cannot find any nodes that are more similar to the query vector. The current node is then returned as the most similar node to the query vector.

The key idea behind HNSW is that by starting the search at the top layer and moving down through each layer, the algorithm can quickly navigate to the area of the graph that contains the node that is most similar to the query vector. This makes the search process much faster than if it had to search through every node in the graph.

## Migrate from pgvector to pg_embedding

The following example demonstrates how to migrate from `pgvector` to `pg_embedding`. The procedure involves creating a new table with embedding columns defined as `real[]` instead of `VECTOR`, copying data from the old table to the new table, dropping the old table, removing the `pgvector` extension, adding the `pg_embedding` extension, renaming the new table, and creating any required indexes.

<Admonition type="note">
Currently, you cannot install both `pgvector` and `pg_embedding` in the same database. If you have the `pgvector` extension installed, trying to install `pg_embedding` returns this error: `ERROR: access method "hnsw" already exists (SQLSTATE 42710)`.
</Admonition>

The migration example is based on the following table and index defined for use with `pgvector`:

```sql
CREATE EXTENSION vector;
CREATE TABLE items (id BIGSERIAL PRIMARY KEY, embedding VECTOR(3));
INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
CREATE INDEX ON items USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
```

Migrating the `items` table to `pg_embedding` involves the steps outline below. The same steps can be applied generally.

1. Create a new table, but with the "embedding" column data type
  defined as a `real[]` array.

    ```sql
    CREATE TABLE new_items (id BIGSERIAL PRIMARY KEY, embedding real[]);
    ```

2. Transfer data from your existing table to the new table and convert
  embeddings to `real[]`.

    ```sql
    INSERT INTO new_items (id, embedding)
    SELECT id, embedding::real[]
    FROM items;
    ```

3. Drop the old table.

    ```sql
    DROP TABLE items;
    ```

4. Rename the new table to the name of the old table.

    ```sql
    ALTER TABLE new_items RENAME TO items;
    ```

5. Drop the `pgvector` extension.

    ```sql
    DROP EXTENSION vector CASCADE;
    ```

6. Add the `pg_embedding` extension.

    ```sql
    CREATE EXTENSION embedding;
    ```

6. Create indexes to replace any indexes you defined previously with `pgvector`.

    ```sql
    CREATE INDEX ON items USING hnsw(embedding) WITH (dims=3, m=3, efconstruction=5, efsearch=5);
    ```

## Upgrade to pg_embedding for on-disk indexes

The `pg_embedding` extension version in Neon was updated on August 3, 2023 to add support for on-disk HNSW indexes and additional distance metrics. If you installed `pg_embedding` before this date, you can upgrade to the new version (0.3.5 or higher) following the instructions below.

The previous `pg_embedding` version (0.1.0 and earlier) creates HNSW indexes in memory, which means that indexes are recreated on the first index access after a compute restart. Also, this version only supports Euclidean (2) distance. The new `pg_embedding` version adds support for cosine and Manhattan distance metrics.

Upgrading to the new version of `pg_embedding` requires dropping the existing `pg_embedding` extension and installing the new version. If your compute has not restarted recently, you may be required to restart it to make the new extension version available for installation.

To upgrade:

1. Drop the existing extension and indexes (version 0.1.0 or earlier):

    ```sql
    DROP EXTENSION embedding CASCADE;
    ```

2. Ensure that the new version of the extension is available for installation. The **default_version** should be 0.3.5 or higher.

    ```sql
    SELECT * FROM pg_available_extensions WHERE name = 'embedding';

    name      | default_version | installed_version |  comment   
    ----------+-----------------+-------------------+------------
    embedding | 0.3.5           |                   | hnsw index
    ```

    If the **default_version** is not 0.3.5 or higher, restart your compute instance. Pro users can do so by temporarily setting the **Auto-suspend** setting to a low value, like 2 seconds, allowing the compute to restart, and then setting **Auto-suspend** back to its normal value. For instructions, refer to the _Auto-suspend_ configuration details in [Edit a compute endpoint](/docs/manage/endpoints#edit-a-compute-endpoint).

3. Install the new version of the extension (version 0.3.5 or higher).

    ```sql
    CREATE EXTENSION embedding;
    ```

4. You should now be able to recreate your HNSW index, which will be created on disk. For example:

    <CodeBlock shouldWrap>

    ```sql
    CREATE INDEX ON documents USING hnsw(embedding) WITH (dims=3, m=3, efconstruction=5, efsearch=5);
    ```

    </CodeBlock>

## pg_embedding extension GitHub repository

The GitHub repository for the Neon `pg_embedding` extension can be found [here](https://github.com/neondatabase/pg_embedding).

## Further reading

To further your understanding of HNSW, the following resources are recommended:

- [Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs, Yu. A. Malkov, D. A. Yashunin](https://arxiv.org/ftp/arxiv/papers/1603/1603.09320.pdf)
- [Similarity Search, Part 4: Hierarchical Navigable Small World (HNSW)](https://towardsdatascience.com/similarity-search-part-4-hierarchical-navigable-small-world-hnsw-2aad4fe87d37)
- [IVFPQ + HNSW for Billion-scale Similarity Search](https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e)

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
