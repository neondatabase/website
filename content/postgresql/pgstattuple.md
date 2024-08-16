[#id](#PGSTATTUPLE)

## F.33. pgstattuple — obtain tuple-level statistics [#](#PGSTATTUPLE)

- [F.33.1. Functions](pgstattuple#PGSTATTUPLE-FUNCS)
- [F.33.2. Authors](pgstattuple#PGSTATTUPLE-AUTHORS)

The `pgstattuple` module provides various functions to obtain tuple-level statistics.

Because these functions return detailed page-level information, access is restricted by default. By default, only the role `pg_stat_scan_tables` has `EXECUTE` privilege. Superusers of course bypass this restriction. After the extension has been installed, users may issue `GRANT` commands to change the privileges on the functions to allow others to execute them. However, it might be preferable to add those users to the `pg_stat_scan_tables` role instead.

[#id](#PGSTATTUPLE-FUNCS)

### F.33.1. Functions [#](#PGSTATTUPLE-FUNCS)

- `pgstattuple(regclass) returns record`

  `pgstattuple` returns a relation's physical length, percentage of “dead” tuples, and other info. This may help users to determine whether vacuum is necessary or not. The argument is the target relation's name (optionally schema-qualified) or OID. For example:

  ```
  test=> SELECT * FROM pgstattuple('pg_catalog.pg_proc');
  -[ RECORD 1 ]------+-------
  table_len          | 458752
  tuple_count        | 1470
  tuple_len          | 438896
  tuple_percent      | 95.67
  dead_tuple_count   | 11
  dead_tuple_len     | 3157
  dead_tuple_percent | 0.69
  free_space         | 8932
  free_percent       | 1.95
  ```

  The output columns are described in [Table F.24](pgstattuple#PGSTATTUPLE-COLUMNS).

  [#id](#PGSTATTUPLE-COLUMNS)

  **Table F.24. `pgstattuple` Output Columns**

  | Column               | Type     | Description                          |
  | -------------------- | -------- | ------------------------------------ |
  | `table_len`          | `bigint` | Physical relation length in bytes    |
  | `tuple_count`        | `bigint` | Number of live tuples                |
  | `tuple_len`          | `bigint` | Total length of live tuples in bytes |
  | `tuple_percent`      | `float8` | Percentage of live tuples            |
  | `dead_tuple_count`   | `bigint` | Number of dead tuples                |
  | `dead_tuple_len`     | `bigint` | Total length of dead tuples in bytes |
  | `dead_tuple_percent` | `float8` | Percentage of dead tuples            |
  | `free_space`         | `bigint` | Total free space in bytes            |
  | `free_percent`       | `float8` | Percentage of free space             |

  \

  ### Note

  The `table_len` will always be greater than the sum of the `tuple_len`, `dead_tuple_len` and `free_space`. The difference is accounted for by fixed page overhead, the per-page table of pointers to tuples, and padding to ensure that tuples are correctly aligned.

  `pgstattuple` acquires only a read lock on the relation. So the results do not reflect an instantaneous snapshot; concurrent updates will affect them.

  `pgstattuple` judges a tuple is “dead” if `HeapTupleSatisfiesDirty` returns false.

- `pgstattuple(text) returns record`

  This is the same as `pgstattuple(regclass)`, except that the target relation is specified as TEXT. This function is kept because of backward-compatibility so far, and will be deprecated in some future release.

- `pgstatindex(regclass) returns record`

  `pgstatindex` returns a record showing information about a B-tree index. For example:

  ```
  test=> SELECT * FROM pgstatindex('pg_cast_oid_index');
  -[ RECORD 1 ]------+------
  version            | 2
  tree_level         | 0
  index_size         | 16384
  root_block_no      | 1
  internal_pages     | 0
  leaf_pages         | 1
  empty_pages        | 0
  deleted_pages      | 0
  avg_leaf_density   | 54.27
  leaf_fragmentation | 0
  ```

  The output columns are:

  | Column               | Type      | Description                              |
  | -------------------- | --------- | ---------------------------------------- |
  | `version`            | `integer` | B-tree version number                    |
  | `tree_level`         | `integer` | Tree level of the root page              |
  | `index_size`         | `bigint`  | Total index size in bytes                |
  | `root_block_no`      | `bigint`  | Location of root page (zero if none)     |
  | `internal_pages`     | `bigint`  | Number of “internal” (upper-level) pages |
  | `leaf_pages`         | `bigint`  | Number of leaf pages                     |
  | `empty_pages`        | `bigint`  | Number of empty pages                    |
  | `deleted_pages`      | `bigint`  | Number of deleted pages                  |
  | `avg_leaf_density`   | `float8`  | Average density of leaf pages            |
  | `leaf_fragmentation` | `float8`  | Leaf page fragmentation                  |

  The reported `index_size` will normally correspond to one more page than is accounted for by `internal_pages + leaf_pages + empty_pages + deleted_pages`, because it also includes the index's metapage.

  As with `pgstattuple`, the results are accumulated page-by-page, and should not be expected to represent an instantaneous snapshot of the whole index.

- `pgstatindex(text) returns record`

  This is the same as `pgstatindex(regclass)`, except that the target index is specified as TEXT. This function is kept because of backward-compatibility so far, and will be deprecated in some future release.

- `pgstatginindex(regclass) returns record`

  `pgstatginindex` returns a record showing information about a GIN index. For example:

  ```
  test=> SELECT * FROM pgstatginindex('test_gin_index');
  -[ RECORD 1 ]--+--
  version        | 1
  pending_pages  | 0
  pending_tuples | 0
  ```

  The output columns are:

  | Column           | Type      | Description                          |
  | ---------------- | --------- | ------------------------------------ |
  | `version`        | `integer` | GIN version number                   |
  | `pending_pages`  | `integer` | Number of pages in the pending list  |
  | `pending_tuples` | `bigint`  | Number of tuples in the pending list |

- `pgstathashindex(regclass) returns record`

  `pgstathashindex` returns a record showing information about a HASH index. For example:

  ```
  test=> select * from pgstathashindex('con_hash_index');
  -[ RECORD 1 ]--+-----------------
  version        | 4
  bucket_pages   | 33081
  overflow_pages | 0
  bitmap_pages   | 1
  unused_pages   | 32455
  live_items     | 10204006
  dead_items     | 0
  free_percent   | 61.8005949100872
  ```

  The output columns are:

  | Column           | Type      | Description              |
  | ---------------- | --------- | ------------------------ |
  | `version`        | `integer` | HASH version number      |
  | `bucket_pages`   | `bigint`  | Number of bucket pages   |
  | `overflow_pages` | `bigint`  | Number of overflow pages |
  | `bitmap_pages`   | `bigint`  | Number of bitmap pages   |
  | `unused_pages`   | `bigint`  | Number of unused pages   |
  | `live_items`     | `bigint`  | Number of live tuples    |
  | `dead_tuples`    | `bigint`  | Number of dead tuples    |
  | `free_percent`   | `float`   | Percentage of free space |

- `pg_relpages(regclass) returns bigint`

  `pg_relpages` returns the number of pages in the relation.

- `pg_relpages(text) returns bigint`

  This is the same as `pg_relpages(regclass)`, except that the target relation is specified as TEXT. This function is kept because of backward-compatibility so far, and will be deprecated in some future release.

- `pgstattuple_approx(regclass) returns record`

  `pgstattuple_approx` is a faster alternative to `pgstattuple` that returns approximate results. The argument is the target relation's name or OID. For example:

  ```
  test=> SELECT * FROM pgstattuple_approx('pg_catalog.pg_proc'::regclass);
  -[ RECORD 1 ]--------+-------
  table_len            | 573440
  scanned_percent      | 2
  approx_tuple_count   | 2740
  approx_tuple_len     | 561210
  approx_tuple_percent | 97.87
  dead_tuple_count     | 0
  dead_tuple_len       | 0
  dead_tuple_percent   | 0
  approx_free_space    | 11996
  approx_free_percent  | 2.09
  ```

  The output columns are described in [Table F.25](pgstattuple#PGSTATAPPROX-COLUMNS).

  Whereas `pgstattuple` always performs a full-table scan and returns an exact count of live and dead tuples (and their sizes) and free space, `pgstattuple_approx` tries to avoid the full-table scan and returns exact dead tuple statistics along with an approximation of the number and size of live tuples and free space.

  It does this by skipping pages that have only visible tuples according to the visibility map (if a page has the corresponding VM bit set, then it is assumed to contain no dead tuples). For such pages, it derives the free space value from the free space map, and assumes that the rest of the space on the page is taken up by live tuples.

  For pages that cannot be skipped, it scans each tuple, recording its presence and size in the appropriate counters, and adding up the free space on the page. At the end, it estimates the total number of live tuples based on the number of pages and tuples scanned (in the same way that VACUUM estimates pg_class.reltuples).

  [#id](#PGSTATAPPROX-COLUMNS)

  **Table F.25. `pgstattuple_approx` Output Columns**

  | Column                 | Type     | Description                                      |
  | ---------------------- | -------- | ------------------------------------------------ |
  | `table_len`            | `bigint` | Physical relation length in bytes (exact)        |
  | `scanned_percent`      | `float8` | Percentage of table scanned                      |
  | `approx_tuple_count`   | `bigint` | Number of live tuples (estimated)                |
  | `approx_tuple_len`     | `bigint` | Total length of live tuples in bytes (estimated) |
  | `approx_tuple_percent` | `float8` | Percentage of live tuples                        |
  | `dead_tuple_count`     | `bigint` | Number of dead tuples (exact)                    |
  | `dead_tuple_len`       | `bigint` | Total length of dead tuples in bytes (exact)     |
  | `dead_tuple_percent`   | `float8` | Percentage of dead tuples                        |
  | `approx_free_space`    | `bigint` | Total free space in bytes (estimated)            |
  | `approx_free_percent`  | `float8` | Percentage of free space                         |

  \

  In the above output, the free space figures may not match the `pgstattuple` output exactly, because the free space map gives us an exact figure, but is not guaranteed to be accurate to the byte.

[#id](#PGSTATTUPLE-AUTHORS)

### F.33.2. Authors [#](#PGSTATTUPLE-AUTHORS)

Tatsuo Ishii, Satoshi Nagayasu and Abhijit Menon-Sen
