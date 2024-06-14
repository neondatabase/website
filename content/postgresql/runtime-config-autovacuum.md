[#id](#RUNTIME-CONFIG-AUTOVACUUM)

## 20.10. Automatic Vacuuming [#](#RUNTIME-CONFIG-AUTOVACUUM)

These settings control the behavior of the _autovacuum_ feature. Refer to [Section 25.1.6](routine-vacuuming#AUTOVACUUM) for more information. Note that many of these settings can be overridden on a per-table basis; see [Storage Parameters](sql-createtable#SQL-CREATETABLE-STORAGE-PARAMETERS).

- `autovacuum` (`boolean`) [#](#GUC-AUTOVACUUM)

  Controls whether the server should run the autovacuum launcher daemon. This is on by default; however, [track_counts](runtime-config-statistics#GUC-TRACK-COUNTS) must also be enabled for autovacuum to work. This parameter can only be set in the `postgresql.conf` file or on the server command line; however, autovacuuming can be disabled for individual tables by changing table storage parameters.

  Note that even when this parameter is disabled, the system will launch autovacuum processes if necessary to prevent transaction ID wraparound. See [Section 25.1.5](routine-vacuuming#VACUUM-FOR-WRAPAROUND) for more information.

- `autovacuum_max_workers` (`integer`) [#](#GUC-AUTOVACUUM-MAX-WORKERS)

  Specifies the maximum number of autovacuum processes (other than the autovacuum launcher) that may be running at any one time. The default is three. This parameter can only be set at server start.

- `autovacuum_naptime` (`integer`) [#](#GUC-AUTOVACUUM-NAPTIME)

  Specifies the minimum delay between autovacuum runs on any given database. In each round the daemon examines the database and issues `VACUUM` and `ANALYZE` commands as needed for tables in that database. If this value is specified without units, it is taken as seconds. The default is one minute (`1min`). This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `autovacuum_vacuum_threshold` (`integer`) [#](#GUC-AUTOVACUUM-VACUUM-THRESHOLD)

  Specifies the minimum number of updated or deleted tuples needed to trigger a `VACUUM` in any one table. The default is 50 tuples. This parameter can only be set in the `postgresql.conf` file or on the server command line; but the setting can be overridden for individual tables by changing table storage parameters.

- `autovacuum_vacuum_insert_threshold` (`integer`) [#](#GUC-AUTOVACUUM-VACUUM-INSERT-THRESHOLD)

  Specifies the number of inserted tuples needed to trigger a `VACUUM` in any one table. The default is 1000 tuples. If -1 is specified, autovacuum will not trigger a `VACUUM` operation on any tables based on the number of inserts. This parameter can only be set in the `postgresql.conf` file or on the server command line; but the setting can be overridden for individual tables by changing table storage parameters.

- `autovacuum_analyze_threshold` (`integer`) [#](#GUC-AUTOVACUUM-ANALYZE-THRESHOLD)

  Specifies the minimum number of inserted, updated or deleted tuples needed to trigger an `ANALYZE` in any one table. The default is 50 tuples. This parameter can only be set in the `postgresql.conf` file or on the server command line; but the setting can be overridden for individual tables by changing table storage parameters.

- `autovacuum_vacuum_scale_factor` (`floating point`) [#](#GUC-AUTOVACUUM-VACUUM-SCALE-FACTOR)

  Specifies a fraction of the table size to add to `autovacuum_vacuum_threshold` when deciding whether to trigger a `VACUUM`. The default is 0.2 (20% of table size). This parameter can only be set in the `postgresql.conf` file or on the server command line; but the setting can be overridden for individual tables by changing table storage parameters.

- `autovacuum_vacuum_insert_scale_factor` (`floating point`) [#](#GUC-AUTOVACUUM-VACUUM-INSERT-SCALE-FACTOR)

  Specifies a fraction of the table size to add to `autovacuum_vacuum_insert_threshold` when deciding whether to trigger a `VACUUM`. The default is 0.2 (20% of table size). This parameter can only be set in the `postgresql.conf` file or on the server command line; but the setting can be overridden for individual tables by changing table storage parameters.

- `autovacuum_analyze_scale_factor` (`floating point`) [#](#GUC-AUTOVACUUM-ANALYZE-SCALE-FACTOR)

  Specifies a fraction of the table size to add to `autovacuum_analyze_threshold` when deciding whether to trigger an `ANALYZE`. The default is 0.1 (10% of table size). This parameter can only be set in the `postgresql.conf` file or on the server command line; but the setting can be overridden for individual tables by changing table storage parameters.

- `autovacuum_freeze_max_age` (`integer`) [#](#GUC-AUTOVACUUM-FREEZE-MAX-AGE)

  Specifies the maximum age (in transactions) that a table's `pg_class`.`relfrozenxid` field can attain before a `VACUUM` operation is forced to prevent transaction ID wraparound within the table. Note that the system will launch autovacuum processes to prevent wraparound even when autovacuum is otherwise disabled.

  Vacuum also allows removal of old files from the `pg_xact` subdirectory, which is why the default is a relatively low 200 million transactions. This parameter can only be set at server start, but the setting can be reduced for individual tables by changing table storage parameters. For more information see [Section 25.1.5](routine-vacuuming#VACUUM-FOR-WRAPAROUND).

- `autovacuum_multixact_freeze_max_age` (`integer`) [#](#GUC-AUTOVACUUM-MULTIXACT-FREEZE-MAX-AGE)

  Specifies the maximum age (in multixacts) that a table's `pg_class`.`relminmxid` field can attain before a `VACUUM` operation is forced to prevent multixact ID wraparound within the table. Note that the system will launch autovacuum processes to prevent wraparound even when autovacuum is otherwise disabled.

  Vacuuming multixacts also allows removal of old files from the `pg_multixact/members` and `pg_multixact/offsets` subdirectories, which is why the default is a relatively low 400 million multixacts. This parameter can only be set at server start, but the setting can be reduced for individual tables by changing table storage parameters. For more information see [Section 25.1.5.1](routine-vacuuming#VACUUM-FOR-MULTIXACT-WRAPAROUND).

- `autovacuum_vacuum_cost_delay` (`floating point`) [#](#GUC-AUTOVACUUM-VACUUM-COST-DELAY)

  Specifies the cost delay value that will be used in automatic `VACUUM` operations. If -1 is specified, the regular [vacuum_cost_delay](runtime-config-resource#GUC-VACUUM-COST-DELAY) value will be used. If this value is specified without units, it is taken as milliseconds. The default value is 2 milliseconds. This parameter can only be set in the `postgresql.conf` file or on the server command line; but the setting can be overridden for individual tables by changing table storage parameters.

- `autovacuum_vacuum_cost_limit` (`integer`) [#](#GUC-AUTOVACUUM-VACUUM-COST-LIMIT)

  Specifies the cost limit value that will be used in automatic `VACUUM` operations. If -1 is specified (which is the default), the regular [vacuum_cost_limit](runtime-config-resource#GUC-VACUUM-COST-LIMIT) value will be used. Note that the value is distributed proportionally among the running autovacuum workers, if there is more than one, so that the sum of the limits for each worker does not exceed the value of this variable. This parameter can only be set in the `postgresql.conf` file or on the server command line; but the setting can be overridden for individual tables by changing table storage parameters.
