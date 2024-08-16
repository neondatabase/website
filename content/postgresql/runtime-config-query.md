[#id](#RUNTIME-CONFIG-QUERY)

## 20.7. Query Planning [#](#RUNTIME-CONFIG-QUERY)

- [20.7.1. Planner Method Configuration](runtime-config-query#RUNTIME-CONFIG-QUERY-ENABLE)
- [20.7.2. Planner Cost Constants](runtime-config-query#RUNTIME-CONFIG-QUERY-CONSTANTS)
- [20.7.3. Genetic Query Optimizer](runtime-config-query#RUNTIME-CONFIG-QUERY-GEQO)
- [20.7.4. Other Planner Options](runtime-config-query#RUNTIME-CONFIG-QUERY-OTHER)

[#id](#RUNTIME-CONFIG-QUERY-ENABLE)

### 20.7.1. Planner Method Configuration [#](#RUNTIME-CONFIG-QUERY-ENABLE)

These configuration parameters provide a crude method of influencing the query plans chosen by the query optimizer. If the default plan chosen by the optimizer for a particular query is not optimal, a _temporary_ solution is to use one of these configuration parameters to force the optimizer to choose a different plan. Better ways to improve the quality of the plans chosen by the optimizer include adjusting the planner cost constants (see [Section 20.7.2](runtime-config-query#RUNTIME-CONFIG-QUERY-CONSTANTS)), running [`ANALYZE`](sql-analyze) manually, increasing the value of the [default_statistics_target](runtime-config-query#GUC-DEFAULT-STATISTICS-TARGET) configuration parameter, and increasing the amount of statistics collected for specific columns using `ALTER TABLE SET STATISTICS`.

- `enable_async_append` (`boolean`) [#](#GUC-ENABLE-ASYNC-APPEND)

  Enables or disables the query planner's use of async-aware append plan types. The default is `on`.

- `enable_bitmapscan` (`boolean`) [#](#GUC-ENABLE-BITMAPSCAN)

  Enables or disables the query planner's use of bitmap-scan plan types. The default is `on`.

- `enable_gathermerge` (`boolean`) [#](#GUC-ENABLE-GATHERMERGE)

  Enables or disables the query planner's use of gather merge plan types. The default is `on`.

- `enable_hashagg` (`boolean`) [#](#GUC-ENABLE-HASHAGG)

  Enables or disables the query planner's use of hashed aggregation plan types. The default is `on`.

- `enable_hashjoin` (`boolean`) [#](#GUC-ENABLE-HASHJOIN)

  Enables or disables the query planner's use of hash-join plan types. The default is `on`.

- `enable_incremental_sort` (`boolean`) [#](#GUC-ENABLE-INCREMENTAL-SORT)

  Enables or disables the query planner's use of incremental sort steps. The default is `on`.

- `enable_indexscan` (`boolean`) [#](#GUC-ENABLE-INDEXSCAN)

  Enables or disables the query planner's use of index-scan plan types. The default is `on`.

- `enable_indexonlyscan` (`boolean`) [#](#GUC-ENABLE-INDEXONLYSCAN)

  Enables or disables the query planner's use of index-only-scan plan types (see [Section 11.9](indexes-index-only-scans)). The default is `on`.

- `enable_material` (`boolean`) [#](#GUC-ENABLE-MATERIAL)

  Enables or disables the query planner's use of materialization. It is impossible to suppress materialization entirely, but turning this variable off prevents the planner from inserting materialize nodes except in cases where it is required for correctness. The default is `on`.

- `enable_memoize` (`boolean`) [#](#GUC-ENABLE-MEMOIZE)

  Enables or disables the query planner's use of memoize plans for caching results from parameterized scans inside nested-loop joins. This plan type allows scans to the underlying plans to be skipped when the results for the current parameters are already in the cache. Less commonly looked up results may be evicted from the cache when more space is required for new entries. The default is `on`.

- `enable_mergejoin` (`boolean`) [#](#GUC-ENABLE-MERGEJOIN)

  Enables or disables the query planner's use of merge-join plan types. The default is `on`.

- `enable_nestloop` (`boolean`) [#](#GUC-ENABLE-NESTLOOP)

  Enables or disables the query planner's use of nested-loop join plans. It is impossible to suppress nested-loop joins entirely, but turning this variable off discourages the planner from using one if there are other methods available. The default is `on`.

- `enable_parallel_append` (`boolean`) [#](#GUC-ENABLE-PARALLEL-APPEND)

  Enables or disables the query planner's use of parallel-aware append plan types. The default is `on`.

- `enable_parallel_hash` (`boolean`) [#](#GUC-ENABLE-PARALLEL-HASH)

  Enables or disables the query planner's use of hash-join plan types with parallel hash. Has no effect if hash-join plans are not also enabled. The default is `on`.

- `enable_partition_pruning` (`boolean`) [#](#GUC-ENABLE-PARTITION-PRUNING)

  Enables or disables the query planner's ability to eliminate a partitioned table's partitions from query plans. This also controls the planner's ability to generate query plans which allow the query executor to remove (ignore) partitions during query execution. The default is `on`. See [Section 5.11.4](ddl-partitioning#DDL-PARTITION-PRUNING) for details.

- `enable_partitionwise_join` (`boolean`) [#](#GUC-ENABLE-PARTITIONWISE-JOIN)

  Enables or disables the query planner's use of partitionwise join, which allows a join between partitioned tables to be performed by joining the matching partitions. Partitionwise join currently applies only when the join conditions include all the partition keys, which must be of the same data type and have one-to-one matching sets of child partitions. Because partitionwise join planning can use significantly more CPU time and memory during planning, the default is `off`.

- `enable_partitionwise_aggregate` (`boolean`) [#](#GUC-ENABLE-PARTITIONWISE-AGGREGATE)

  Enables or disables the query planner's use of partitionwise grouping or aggregation, which allows grouping or aggregation on a partitioned tables performed separately for each partition. If the `GROUP BY` clause does not include the partition keys, only partial aggregation can be performed on a per-partition basis, and finalization must be performed later. Because partitionwise grouping or aggregation can use significantly more CPU time and memory during planning, the default is `off`.

- `enable_presorted_aggregate` (`boolean`) [#](#GUC-ENABLE-PRESORTED-AGGREGATE)

  Controls if the query planner will produce a plan which will provide rows which are presorted in the order required for the query's `ORDER BY` / `DISTINCT` aggregate functions. When disabled, the query planner will produce a plan which will always require the executor to perform a sort before performing aggregation of each aggregate function containing an `ORDER BY` or `DISTINCT` clause. When enabled, the planner will try to produce a more efficient plan which provides input to the aggregate functions which is presorted in the order they require for aggregation. The default value is `on`.

- `enable_seqscan` (`boolean`) [#](#GUC-ENABLE-SEQSCAN)

  Enables or disables the query planner's use of sequential scan plan types. It is impossible to suppress sequential scans entirely, but turning this variable off discourages the planner from using one if there are other methods available. The default is `on`.

- `enable_sort` (`boolean`) [#](#GUC-ENABLE-SORT)

  Enables or disables the query planner's use of explicit sort steps. It is impossible to suppress explicit sorts entirely, but turning this variable off discourages the planner from using one if there are other methods available. The default is `on`.

- `enable_tidscan` (`boolean`) [#](#GUC-ENABLE-TIDSCAN)

  Enables or disables the query planner's use of TID scan plan types. The default is `on`.

[#id](#RUNTIME-CONFIG-QUERY-CONSTANTS)

### 20.7.2. Planner Cost Constants [#](#RUNTIME-CONFIG-QUERY-CONSTANTS)

The _cost_ variables described in this section are measured on an arbitrary scale. Only their relative values matter, hence scaling them all up or down by the same factor will result in no change in the planner's choices. By default, these cost variables are based on the cost of sequential page fetches; that is, `seq_page_cost` is conventionally set to `1.0` and the other cost variables are set with reference to that. But you can use a different scale if you prefer, such as actual execution times in milliseconds on a particular machine.

### Note

Unfortunately, there is no well-defined method for determining ideal values for the cost variables. They are best treated as averages over the entire mix of queries that a particular installation will receive. This means that changing them on the basis of just a few experiments is very risky.

- `seq_page_cost` (`floating point`) [#](#GUC-SEQ-PAGE-COST)

  Sets the planner's estimate of the cost of a disk page fetch that is part of a series of sequential fetches. The default is 1.0. This value can be overridden for tables and indexes in a particular tablespace by setting the tablespace parameter of the same name (see [ALTER TABLESPACE](sql-altertablespace)).

- `random_page_cost` (`floating point`) [#](#GUC-RANDOM-PAGE-COST)

  Sets the planner's estimate of the cost of a non-sequentially-fetched disk page. The default is 4.0. This value can be overridden for tables and indexes in a particular tablespace by setting the tablespace parameter of the same name (see [ALTER TABLESPACE](sql-altertablespace)).

  Reducing this value relative to `seq_page_cost` will cause the system to prefer index scans; raising it will make index scans look relatively more expensive. You can raise or lower both values together to change the importance of disk I/O costs relative to CPU costs, which are described by the following parameters.

  Random access to mechanical disk storage is normally much more expensive than four times sequential access. However, a lower default is used (4.0) because the majority of random accesses to disk, such as indexed reads, are assumed to be in cache. The default value can be thought of as modeling random access as 40 times slower than sequential, while expecting 90% of random reads to be cached.

  If you believe a 90% cache rate is an incorrect assumption for your workload, you can increase random_page_cost to better reflect the true cost of random storage reads. Correspondingly, if your data is likely to be completely in cache, such as when the database is smaller than the total server memory, decreasing random_page_cost can be appropriate. Storage that has a low random read cost relative to sequential, e.g., solid-state drives, might also be better modeled with a lower value for random_page_cost, e.g., `1.1`.

  ### Tip

  Although the system will let you set `random_page_cost` to less than `seq_page_cost`, it is not physically sensible to do so. However, setting them equal makes sense if the database is entirely cached in RAM, since in that case there is no penalty for touching pages out of sequence. Also, in a heavily-cached database you should lower both values relative to the CPU parameters, since the cost of fetching a page already in RAM is much smaller than it would normally be.

- `cpu_tuple_cost` (`floating point`) [#](#GUC-CPU-TUPLE-COST)

  Sets the planner's estimate of the cost of processing each row during a query. The default is 0.01.

- `cpu_index_tuple_cost` (`floating point`) [#](#GUC-CPU-INDEX-TUPLE-COST)

  Sets the planner's estimate of the cost of processing each index entry during an index scan. The default is 0.005.

- `cpu_operator_cost` (`floating point`) [#](#GUC-CPU-OPERATOR-COST)

  Sets the planner's estimate of the cost of processing each operator or function executed during a query. The default is 0.0025.

- `parallel_setup_cost` (`floating point`) [#](#GUC-PARALLEL-SETUP-COST)

  Sets the planner's estimate of the cost of launching parallel worker processes. The default is 1000.

- `parallel_tuple_cost` (`floating point`) [#](#GUC-PARALLEL-TUPLE-COST)

  Sets the planner's estimate of the cost of transferring one tuple from a parallel worker process to another process. The default is 0.1.

- `min_parallel_table_scan_size` (`integer`) [#](#GUC-MIN-PARALLEL-TABLE-SCAN-SIZE)

  Sets the minimum amount of table data that must be scanned in order for a parallel scan to be considered. For a parallel sequential scan, the amount of table data scanned is always equal to the size of the table, but when indexes are used the amount of table data scanned will normally be less. If this value is specified without units, it is taken as blocks, that is `BLCKSZ` bytes, typically 8kB. The default is 8 megabytes (`8MB`).

- `min_parallel_index_scan_size` (`integer`) [#](#GUC-MIN-PARALLEL-INDEX-SCAN-SIZE)

  Sets the minimum amount of index data that must be scanned in order for a parallel scan to be considered. Note that a parallel index scan typically won't touch the entire index; it is the number of pages which the planner believes will actually be touched by the scan which is relevant. This parameter is also used to decide whether a particular index can participate in a parallel vacuum. See [VACUUM](sql-vacuum). If this value is specified without units, it is taken as blocks, that is `BLCKSZ` bytes, typically 8kB. The default is 512 kilobytes (`512kB`).

- `effective_cache_size` (`integer`) [#](#GUC-EFFECTIVE-CACHE-SIZE)

  Sets the planner's assumption about the effective size of the disk cache that is available to a single query. This is factored into estimates of the cost of using an index; a higher value makes it more likely index scans will be used, a lower value makes it more likely sequential scans will be used. When setting this parameter you should consider both PostgreSQL's shared buffers and the portion of the kernel's disk cache that will be used for PostgreSQL data files, though some data might exist in both places. Also, take into account the expected number of concurrent queries on different tables, since they will have to share the available space. This parameter has no effect on the size of shared memory allocated by PostgreSQL, nor does it reserve kernel disk cache; it is used only for estimation purposes. The system also does not assume data remains in the disk cache between queries. If this value is specified without units, it is taken as blocks, that is `BLCKSZ` bytes, typically 8kB. The default is 4 gigabytes (`4GB`). (If `BLCKSZ` is not 8kB, the default value scales proportionally to it.)

- `jit_above_cost` (`floating point`) [#](#GUC-JIT-ABOVE-COST)

  Sets the query cost above which JIT compilation is activated, if enabled (see [Chapter 32](jit)). Performing JIT costs planning time but can accelerate query execution. Setting this to `-1` disables JIT compilation. The default is `100000`.

- `jit_inline_above_cost` (`floating point`) [#](#GUC-JIT-INLINE-ABOVE-COST)

  Sets the query cost above which JIT compilation attempts to inline functions and operators. Inlining adds planning time, but can improve execution speed. It is not meaningful to set this to less than `jit_above_cost`. Setting this to `-1` disables inlining. The default is `500000`.

- `jit_optimize_above_cost` (`floating point`) [#](#GUC-JIT-OPTIMIZE-ABOVE-COST)

  Sets the query cost above which JIT compilation applies expensive optimizations. Such optimization adds planning time, but can improve execution speed. It is not meaningful to set this to less than `jit_above_cost`, and it is unlikely to be beneficial to set it to more than `jit_inline_above_cost`. Setting this to `-1` disables expensive optimizations. The default is `500000`.

[#id](#RUNTIME-CONFIG-QUERY-GEQO)

### 20.7.3. Genetic Query Optimizer [#](#RUNTIME-CONFIG-QUERY-GEQO)

The genetic query optimizer (GEQO) is an algorithm that does query planning using heuristic searching. This reduces planning time for complex queries (those joining many relations), at the cost of producing plans that are sometimes inferior to those found by the normal exhaustive-search algorithm. For more information see [Chapter 62](geqo).

- `geqo` (`boolean`) [#](#GUC-GEQO)

  Enables or disables genetic query optimization. This is on by default. It is usually best not to turn it off in production; the `geqo_threshold` variable provides more granular control of GEQO.

- `geqo_threshold` (`integer`) [#](#GUC-GEQO-THRESHOLD)

  Use genetic query optimization to plan queries with at least this many `FROM` items involved. (Note that a `FULL OUTER JOIN` construct counts as only one `FROM` item.) The default is 12. For simpler queries it is usually best to use the regular, exhaustive-search planner, but for queries with many tables the exhaustive search takes too long, often longer than the penalty of executing a suboptimal plan. Thus, a threshold on the size of the query is a convenient way to manage use of GEQO.

- `geqo_effort` (`integer`) [#](#GUC-GEQO-EFFORT)

  Controls the trade-off between planning time and query plan quality in GEQO. This variable must be an integer in the range from 1 to 10. The default value is five. Larger values increase the time spent doing query planning, but also increase the likelihood that an efficient query plan will be chosen.

  `geqo_effort` doesn't actually do anything directly; it is only used to compute the default values for the other variables that influence GEQO behavior (described below). If you prefer, you can set the other parameters by hand instead.

- `geqo_pool_size` (`integer`) [#](#GUC-GEQO-POOL-SIZE)

  Controls the pool size used by GEQO, that is the number of individuals in the genetic population. It must be at least two, and useful values are typically 100 to 1000. If it is set to zero (the default setting) then a suitable value is chosen based on `geqo_effort` and the number of tables in the query.

- `geqo_generations` (`integer`) [#](#GUC-GEQO-GENERATIONS)

  Controls the number of generations used by GEQO, that is the number of iterations of the algorithm. It must be at least one, and useful values are in the same range as the pool size. If it is set to zero (the default setting) then a suitable value is chosen based on `geqo_pool_size`.

- `geqo_selection_bias` (`floating point`) [#](#GUC-GEQO-SELECTION-BIAS)

  Controls the selection bias used by GEQO. The selection bias is the selective pressure within the population. Values can be from 1.50 to 2.00; the latter is the default.

- `geqo_seed` (`floating point`) [#](#GUC-GEQO-SEED)

  Controls the initial value of the random number generator used by GEQO to select random paths through the join order search space. The value can range from zero (the default) to one. Varying the value changes the set of join paths explored, and may result in a better or worse best path being found.

[#id](#RUNTIME-CONFIG-QUERY-OTHER)

### 20.7.4. Other Planner Options [#](#RUNTIME-CONFIG-QUERY-OTHER)

- `default_statistics_target` (`integer`) [#](#GUC-DEFAULT-STATISTICS-TARGET)

  Sets the default statistics target for table columns without a column-specific target set via `ALTER TABLE SET STATISTICS`. Larger values increase the time needed to do `ANALYZE`, but might improve the quality of the planner's estimates. The default is 100. For more information on the use of statistics by the PostgreSQL query planner, refer to [Section 14.2](planner-stats).

- `constraint_exclusion` (`enum`) [#](#GUC-CONSTRAINT-EXCLUSION)

  Controls the query planner's use of table constraints to optimize queries. The allowed values of `constraint_exclusion` are `on` (examine constraints for all tables), `off` (never examine constraints), and `partition` (examine constraints only for inheritance child tables and `UNION ALL` subqueries). `partition` is the default setting. It is often used with traditional inheritance trees to improve performance.

  When this parameter allows it for a particular table, the planner compares query conditions with the table's `CHECK` constraints, and omits scanning tables for which the conditions contradict the constraints. For example:

  ```
  CREATE TABLE parent(key integer, ...);
  CREATE TABLE child1000(check (key between 1000 and 1999)) INHERITS(parent);
  CREATE TABLE child2000(check (key between 2000 and 2999)) INHERITS(parent);
  ...
  SELECT * FROM parent WHERE key = 2400;
  ```

  With constraint exclusion enabled, this `SELECT` will not scan `child1000` at all, improving performance.

  Currently, constraint exclusion is enabled by default only for cases that are often used to implement table partitioning via inheritance trees. Turning it on for all tables imposes extra planning overhead that is quite noticeable on simple queries, and most often will yield no benefit for simple queries. If you have no tables that are partitioned using traditional inheritance, you might prefer to turn it off entirely. (Note that the equivalent feature for partitioned tables is controlled by a separate parameter, [enable_partition_pruning](runtime-config-query#GUC-ENABLE-PARTITION-PRUNING).)

  Refer to [Section 5.11.5](ddl-partitioning#DDL-PARTITIONING-CONSTRAINT-EXCLUSION) for more information on using constraint exclusion to implement partitioning.

- `cursor_tuple_fraction` (`floating point`) [#](#GUC-CURSOR-TUPLE-FRACTION)

  Sets the planner's estimate of the fraction of a cursor's rows that will be retrieved. The default is 0.1. Smaller values of this setting bias the planner towards using “fast start” plans for cursors, which will retrieve the first few rows quickly while perhaps taking a long time to fetch all rows. Larger values put more emphasis on the total estimated time. At the maximum setting of 1.0, cursors are planned exactly like regular queries, considering only the total estimated time and not how soon the first rows might be delivered.

- `from_collapse_limit` (`integer`) [#](#GUC-FROM-COLLAPSE-LIMIT)

  The planner will merge sub-queries into upper queries if the resulting `FROM` list would have no more than this many items. Smaller values reduce planning time but might yield inferior query plans. The default is eight. For more information see [Section 14.3](explicit-joins).

  Setting this value to [geqo_threshold](runtime-config-query#GUC-GEQO-THRESHOLD) or more may trigger use of the GEQO planner, resulting in non-optimal plans. See [Section 20.7.3](runtime-config-query#RUNTIME-CONFIG-QUERY-GEQO).

- `jit` (`boolean`) [#](#GUC-JIT)

  Determines whether JIT compilation may be used by PostgreSQL, if available (see [Chapter 32](jit)). The default is `on`.

- `join_collapse_limit` (`integer`) [#](#GUC-JOIN-COLLAPSE-LIMIT)

  The planner will rewrite explicit `JOIN` constructs (except `FULL JOIN`s) into lists of `FROM` items whenever a list of no more than this many items would result. Smaller values reduce planning time but might yield inferior query plans.

  By default, this variable is set the same as `from_collapse_limit`, which is appropriate for most uses. Setting it to 1 prevents any reordering of explicit `JOIN`s. Thus, the explicit join order specified in the query will be the actual order in which the relations are joined. Because the query planner does not always choose the optimal join order, advanced users can elect to temporarily set this variable to 1, and then specify the join order they desire explicitly. For more information see [Section 14.3](explicit-joins).

  Setting this value to [geqo_threshold](runtime-config-query#GUC-GEQO-THRESHOLD) or more may trigger use of the GEQO planner, resulting in non-optimal plans. See [Section 20.7.3](runtime-config-query#RUNTIME-CONFIG-QUERY-GEQO).

- `plan_cache_mode` (`enum`) [#](#GUC-PLAN-CACHE-MODE)

  Prepared statements (either explicitly prepared or implicitly generated, for example by PL/pgSQL) can be executed using custom or generic plans. Custom plans are made afresh for each execution using its specific set of parameter values, while generic plans do not rely on the parameter values and can be re-used across executions. Thus, use of a generic plan saves planning time, but if the ideal plan depends strongly on the parameter values then a generic plan may be inefficient. The choice between these options is normally made automatically, but it can be overridden with `plan_cache_mode`. The allowed values are `auto` (the default), `force_custom_plan` and `force_generic_plan`. This setting is considered when a cached plan is to be executed, not when it is prepared. For more information see [PREPARE](sql-prepare).

- `recursive_worktable_factor` (`floating point`) [#](#GUC-RECURSIVE-WORKTABLE-FACTOR)

  Sets the planner's estimate of the average size of the working table of a [recursive query](queries-with#QUERIES-WITH-RECURSIVE), as a multiple of the estimated size of the initial non-recursive term of the query. This helps the planner choose the most appropriate method for joining the working table to the query's other tables. The default value is `10.0`. A smaller value such as `1.0` can be helpful when the recursion has low “fan-out” from one step to the next, as for example in shortest-path queries. Graph analytics queries may benefit from larger-than-default values.
