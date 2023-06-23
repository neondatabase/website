---
title: The hnsw extension
subtitle: Use Hierarchical Navigable Small World (HNSW) vector similarity search in PostgreSQL 
enableTableOfContents: true
isDraft: true
---

The `hnsw` extension enables the use of [Hierarchical Navigable Small World (HNSW) graphs](https://arxiv.org/abs/1603.09320) for vector similarity search in PostgreSQL. HNSW graphs are a type of proximity graph known for their superior performance in terms of speed and recall.

The extension is based on the [ivf-hnsw](https://github.com/dbaranchuk/ivf-hnsw.git) implementation of HSNW, the code for the current state-of-the-art billion-scale nearest neighbor search system presented in [Revisiting the Inverted Indices for Billion-Scale Approximate Nearest Neighbors](https://openaccess.thecvf.com/content_ECCV_2018/html/Dmitry_Baranchuk_Revisiting_the_Inverted_ECCV_2018_paper.html).

An HNSW index is held in memory (built on demand) and its maxial size is limited by the `maxelements` index parameter. Another required parameter is `dims`, the number of dimensions (if not specified in the column type definition). An optional parameter, `ef`, specifies the number of neighbors that are considered during index construction and search. This parameter corresponds to the `efConstruction` and `efSearch` parameters described in the article referenced above.

## Enable the hnsw extension

You can enable the `hnswl` extension by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION hnsw;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](../get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](../connect/query-with-psql-editor).

Example usage:

```sql
CREATE EXTENSION hnsw;
CREATE TABLE embeddings(id integer primary key, payload real[]);
CREATE INDEX ON embeddings USING hnsw(payload) WITH (maxelements=1000000, dims=100, m=32);
SELECT id FROM embeddings ORDER BY payload <-> array[1.0, 2.0,...] LIMIT 100;
```

The GitHub repository for the `hnsw` extension can be found [here](https://github.com/knizhnik/hnsw).