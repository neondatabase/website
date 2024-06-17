[#id](#AUTO-EXPLAIN)

## F.4. auto_explain — log execution plans of slow queries [#](#AUTO-EXPLAIN)

- [F.4.1. Configuration Parameters](auto-explain#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)
- [F.4.2. Example](auto-explain#AUTO-EXPLAIN-EXAMPLE)
- [F.4.3. Author](auto-explain#AUTO-EXPLAIN-AUTHOR)

The `auto_explain` module provides a means for logging execution plans of slow statements automatically, without having to run [EXPLAIN](sql-explain) by hand. This is especially helpful for tracking down un-optimized queries in large applications.

The module provides no SQL-accessible functions. To use it, simply load it into the server. You can load it into an individual session:

```

LOAD 'auto_explain';
```

(You must be superuser to do that.) More typical usage is to preload it into some or all sessions by including `auto_explain` in [session_preload_libraries](runtime-config-client#GUC-SESSION-PRELOAD-LIBRARIES) or [shared_preload_libraries](runtime-config-client#GUC-SHARED-PRELOAD-LIBRARIES) in `postgresql.conf`. Then you can track unexpectedly slow queries no matter when they happen. Of course there is a price in overhead for that.

[#id](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)

### F.4.1. Configuration Parameters [#](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS)

There are several configuration parameters that control the behavior of `auto_explain`. Note that the default behavior is to do nothing, so you must set at least `auto_explain.log_min_duration` if you want any results.

- `auto_explain.log_min_duration` (`integer`) [#](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS-LOG-MIN-DURATION)

  `auto_explain.log_min_duration` is the minimum statement execution time, in milliseconds, that will cause the statement's plan to be logged. Setting this to `0` logs all plans. `-1` (the default) disables logging of plans. For example, if you set it to `250ms` then all statements that run 250ms or longer will be logged. Only superusers can change this setting.

- `auto_explain.log_parameter_max_length` (`integer`) [#](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS-LOG-PARAMETER-MAX-LENGTH)

  `auto_explain.log_parameter_max_length` controls the logging of query parameter values. A value of `-1` (the default) logs the parameter values in full. `0` disables logging of parameter values. A value greater than zero truncates each parameter value to that many bytes. Only superusers can change this setting.

- `auto_explain.log_analyze` (`boolean`) [#](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS-LOG-ANALYZE)

  `auto_explain.log_analyze` causes `EXPLAIN ANALYZE` output, rather than just `EXPLAIN` output, to be printed when an execution plan is logged. This parameter is off by default. Only superusers can change this setting.

  ### Note

  When this parameter is on, per-plan-node timing occurs for all statements executed, whether or not they run long enough to actually get logged. This can have an extremely negative impact on performance. Turning off `auto_explain.log_timing` ameliorates the performance cost, at the price of obtaining less information.

- `auto_explain.log_buffers` (`boolean`) [#](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS-LOG-BUFFERS)

  `auto_explain.log_buffers` controls whether buffer usage statistics are printed when an execution plan is logged; it's equivalent to the `BUFFERS` option of `EXPLAIN`. This parameter has no effect unless `auto_explain.log_analyze` is enabled. This parameter is off by default. Only superusers can change this setting.

- `auto_explain.log_wal` (`boolean`) [#](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS-LOG-WAL)

  `auto_explain.log_wal` controls whether WAL usage statistics are printed when an execution plan is logged; it's equivalent to the `WAL` option of `EXPLAIN`. This parameter has no effect unless `auto_explain.log_analyze` is enabled. This parameter is off by default. Only superusers can change this setting.

- `auto_explain.log_timing` (`boolean`) [#](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS-LOG-TIMING)

  `auto_explain.log_timing` controls whether per-node timing information is printed when an execution plan is logged; it's equivalent to the `TIMING` option of `EXPLAIN`. The overhead of repeatedly reading the system clock can slow down queries significantly on some systems, so it may be useful to set this parameter to off when only actual row counts, and not exact times, are needed. This parameter has no effect unless `auto_explain.log_analyze` is enabled. This parameter is on by default. Only superusers can change this setting.

- `auto_explain.log_triggers` (`boolean`) [#](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS-LOG-TRIGGERS)

  `auto_explain.log_triggers` causes trigger execution statistics to be included when an execution plan is logged. This parameter has no effect unless `auto_explain.log_analyze` is enabled. This parameter is off by default. Only superusers can change this setting.

- `auto_explain.log_verbose` (`boolean`) [#](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS-LOG-VERBOSE)

  `auto_explain.log_verbose` controls whether verbose details are printed when an execution plan is logged; it's equivalent to the `VERBOSE` option of `EXPLAIN`. This parameter is off by default. Only superusers can change this setting.

- `auto_explain.log_settings` (`boolean`) [#](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS-LOG-SETTINGS)

  `auto_explain.log_settings` controls whether information about modified configuration options is printed when an execution plan is logged. Only options affecting query planning with value different from the built-in default value are included in the output. This parameter is off by default. Only superusers can change this setting.

- `auto_explain.log_format` (`enum`) [#](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS-LOG-FORMAT)

  `auto_explain.log_format` selects the `EXPLAIN` output format to be used. The allowed values are `text`, `xml`, `json`, and `yaml`. The default is text. Only superusers can change this setting.

- `auto_explain.log_level` (`enum`) [#](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS-LOG-LEVEL)

  `auto_explain.log_level` selects the log level at which auto_explain will log the query plan. Valid values are `DEBUG5`, `DEBUG4`, `DEBUG3`, `DEBUG2`, `DEBUG1`, `INFO`, `NOTICE`, `WARNING`, and `LOG`. The default is `LOG`. Only superusers can change this setting.

- `auto_explain.log_nested_statements` (`boolean`) [#](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS-LOG-NESTED-STATEMENTS)

  `auto_explain.log_nested_statements` causes nested statements (statements executed inside a function) to be considered for logging. When it is off, only top-level query plans are logged. This parameter is off by default. Only superusers can change this setting.

- `auto_explain.sample_rate` (`real`) [#](#AUTO-EXPLAIN-CONFIGURATION-PARAMETERS-SAMPLE-RATE)

  `auto_explain.sample_rate` causes auto_explain to only explain a fraction of the statements in each session. The default is 1, meaning explain all the queries. In case of nested statements, either all will be explained or none. Only superusers can change this setting.

In ordinary usage, these parameters are set in `postgresql.conf`, although superusers can alter them on-the-fly within their own sessions. Typical usage might be:

```

# postgresql.conf
session_preload_libraries = 'auto_explain'

auto_explain.log_min_duration = '3s'
```

[#id](#AUTO-EXPLAIN-EXAMPLE)

### F.4.2. Example [#](#AUTO-EXPLAIN-EXAMPLE)

```

postgres=# LOAD 'auto_explain';
postgres=# SET auto_explain.log_min_duration = 0;
postgres=# SET auto_explain.log_analyze = true;
postgres=# SELECT count(*)
           FROM pg_class, pg_index
           WHERE oid = indrelid AND indisunique;
```

This might produce log output such as:

```

LOG:  duration: 3.651 ms  plan:
  Query Text: SELECT count(*)
              FROM pg_class, pg_index
              WHERE oid = indrelid AND indisunique;
  Aggregate  (cost=16.79..16.80 rows=1 width=0) (actual time=3.626..3.627 rows=1 loops=1)
    ->  Hash Join  (cost=4.17..16.55 rows=92 width=0) (actual time=3.349..3.594 rows=92 loops=1)
          Hash Cond: (pg_class.oid = pg_index.indrelid)
          ->  Seq Scan on pg_class  (cost=0.00..9.55 rows=255 width=4) (actual time=0.016..0.140 rows=255 loops=1)
          ->  Hash  (cost=3.02..3.02 rows=92 width=4) (actual time=3.238..3.238 rows=92 loops=1)
                Buckets: 1024  Batches: 1  Memory Usage: 4kB
                ->  Seq Scan on pg_index  (cost=0.00..3.02 rows=92 width=4) (actual time=0.008..3.187 rows=92 loops=1)
                      Filter: indisunique
```

[#id](#AUTO-EXPLAIN-AUTHOR)

### F.4.3. Author [#](#AUTO-EXPLAIN-AUTHOR)

Takahiro Itagaki `<itagaki.takahiro@oss.ntt.co.jp>`
