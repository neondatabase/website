[#id](#GIST-EXAMPLES)

## 68.5. Examples [#](#GIST-EXAMPLES)

The PostgreSQL source distribution includes several examples of index methods implemented using GiST. The core system currently provides text search support (indexing for `tsvector` and `tsquery`) as well as R-Tree equivalent functionality for some of the built-in geometric data types (see `src/backend/access/gist/gistproc.c`). The following `contrib` modules also contain GiST operator classes:

- `btree_gist`

  B-tree equivalent functionality for several data types

- `cube`

  Indexing for multidimensional cubes

- `hstore`

  Module for storing (key, value) pairs

- `intarray`

  RD-Tree for one-dimensional array of int4 values

- `ltree`

  Indexing for tree-like structures

- `pg_trgm`

  Text similarity using trigram matching

- `seg`

  Indexing for “float ranges”
