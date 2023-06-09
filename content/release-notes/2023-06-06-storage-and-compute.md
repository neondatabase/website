---
label: 'Storage'
---

### What's new

- Compute: Released a new `hnsw` PostgreSQL extension, which enables the use of [Hierarchical Navigable Small World (HNSW) graphs](https://arxiv.org/abs/1603.09320) for vector similarity search in PostgreSQL. HNSW graphs are a type of proximity graph known for their superior performance in terms of speed and recall.

The extension is based on the [ivf-hnsw](https://github.com/dbaranchuk/ivf-hnsw.git) implementation of HSNW, the code for the current state-of-the-art billion-scale nearest neighbor search system presented in [Revisiting the Inverted Indices for Billion-Scale Approximate Nearest Neighbors](https://openaccess.thecvf.com/content_ECCV_2018/html/Dmitry_Baranchuk_Revisiting_the_Inverted_ECCV_2018_paper.html).

  Example usage:

  ```sql
  CREATE EXTENSION hnsw;
  CREATE TABLE embeddings(id integer primary key, payload real[]);
  CREATE INDEX ON embeddings USING hnsw(payload) WITH (maxelements=1000000, dims=100, m=32);
  SELECT id FROM embeddings ORDER BY payload <-> array[1.0, 2.0,...] LIMIT 100;
  ```

  For additional usage information refer to [The hnsw extension](/docs/extensions/hnsw) topic, in the _Neon documentation_.

  The GitHub repository for the `hnsw` extension can be found [here](https://github.com/knizhnik/hnsw).
