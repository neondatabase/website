[#id](#PROGRESS-REPORTING)

## 28.4. Progress Reporting [#](#PROGRESS-REPORTING)

- [28.4.1. ANALYZE Progress Reporting](progress-reporting#ANALYZE-PROGRESS-REPORTING)
- [28.4.2. CLUSTER Progress Reporting](progress-reporting#CLUSTER-PROGRESS-REPORTING)
- [28.4.3. COPY Progress Reporting](progress-reporting#COPY-PROGRESS-REPORTING)
- [28.4.4. CREATE INDEX Progress Reporting](progress-reporting#CREATE-INDEX-PROGRESS-REPORTING)
- [28.4.5. VACUUM Progress Reporting](progress-reporting#VACUUM-PROGRESS-REPORTING)
- [28.4.6. Base Backup Progress Reporting](progress-reporting#BASEBACKUP-PROGRESS-REPORTING)

PostgreSQL has the ability to report the progress of certain commands during command execution. Currently, the only commands which support progress reporting are `ANALYZE`, `CLUSTER`, `CREATE INDEX`, `VACUUM`, `COPY`, and [BASE_BACKUP](protocol-replication#PROTOCOL-REPLICATION-BASE-BACKUP) (i.e., replication command that [pg_basebackup](app-pgbasebackup) issues to take a base backup). This may be expanded in the future.

[#id](#ANALYZE-PROGRESS-REPORTING)

### 28.4.1. ANALYZE Progress Reporting [#](#ANALYZE-PROGRESS-REPORTING)

Whenever `ANALYZE` is running, the `pg_stat_progress_analyze` view will contain a row for each backend that is currently running that command. The tables below describe the information that will be reported and provide information about how to interpret it.

[#id](#PG-STAT-PROGRESS-ANALYZE-VIEW)

**Table 28.37. `pg_stat_progress_analyze` View**

| Column TypeDescription                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pid` `integer`Process ID of backend.                                                                                                                          |
| `datid` `oid`OID of the database to which this backend is connected.                                                                                           |
| `datname` `name`Name of the database to which this backend is connected.                                                                                       |
| `relid` `oid`OID of the table being analyzed.                                                                                                                  |
| `phase` `text`Current processing phase. See [Table 28.38](progress-reporting#ANALYZE-PHASES).                                                                  |
| `sample_blks_total` `bigint`Total number of heap blocks that will be sampled.                                                                                  |
| `sample_blks_scanned` `bigint`Number of heap blocks scanned.                                                                                                   |
| `ext_stats_total` `bigint`Number of extended statistics.                                                                                                       |
| `ext_stats_computed` `bigint`Number of extended statistics computed. This counter only advances when the phase is `computing extended statistics`.             |
| `child_tables_total` `bigint`Number of child tables.                                                                                                           |
| `child_tables_done` `bigint`Number of child tables scanned. This counter only advances when the phase is `acquiring inherited sample rows`.                    |
| `current_child_table_relid` `oid`OID of the child table currently being scanned. This field is only valid when the phase is `acquiring inherited sample rows`. |

[#id](#ANALYZE-PHASES)

**Table 28.38. ANALYZE Phases**

| Phase                             | Description                                                                                                                                                                                               |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initializing`                    | The command is preparing to begin scanning the heap. This phase is expected to be very brief.                                                                                                             |
| `acquiring sample rows`           | The command is currently scanning the table given by `relid` to obtain sample rows.                                                                                                                       |
| `acquiring inherited sample rows` | The command is currently scanning child tables to obtain sample rows. Columns `child_tables_total`, `child_tables_done`, and `current_child_table_relid` contain the progress information for this phase. |
| `computing statistics`            | The command is computing statistics from the sample rows obtained during the table scan.                                                                                                                  |
| `computing extended statistics`   | The command is computing extended statistics from the sample rows obtained during the table scan.                                                                                                         |
| `finalizing analyze`              | The command is updating `pg_class`. When this phase is completed, `ANALYZE` will end.                                                                                                                     |

### Note

Note that when `ANALYZE` is run on a partitioned table, all of its partitions are also recursively analyzed. In that case, `ANALYZE` progress is reported first for the parent table, whereby its inheritance statistics are collected, followed by that for each partition.

[#id](#CLUSTER-PROGRESS-REPORTING)

### 28.4.2. CLUSTER Progress Reporting [#](#CLUSTER-PROGRESS-REPORTING)

Whenever `CLUSTER` or `VACUUM FULL` is running, the `pg_stat_progress_cluster` view will contain a row for each backend that is currently running either command. The tables below describe the information that will be reported and provide information about how to interpret it.

[#id](#PG-STAT-PROGRESS-CLUSTER-VIEW)

**Table 28.39. `pg_stat_progress_cluster` View**

| Column TypeDescription                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pid` `integer`Process ID of backend.                                                                                                                                       |
| `datid` `oid`OID of the database to which this backend is connected.                                                                                                        |
| `datname` `name`Name of the database to which this backend is connected.                                                                                                    |
| `relid` `oid`OID of the table being clustered.                                                                                                                              |
| `command` `text`The command that is running. Either `CLUSTER` or `VACUUM FULL`.                                                                                             |
| `phase` `text`Current processing phase. See [Table 28.40](progress-reporting#CLUSTER-PHASES).                                                                               |
| `cluster_index_relid` `oid`If the table is being scanned using an index, this is the OID of the index being used; otherwise, it is zero.                                    |
| `heap_tuples_scanned` `bigint`Number of heap tuples scanned. This counter only advances when the phase is `seq scanning heap`, `index scanning heap` or `writing new heap`. |
| `heap_tuples_written` `bigint`Number of heap tuples written. This counter only advances when the phase is `seq scanning heap`, `index scanning heap` or `writing new heap`. |
| `heap_blks_total` `bigint`Total number of heap blocks in the table. This number is reported as of the beginning of `seq scanning heap`.                                     |
| `heap_blks_scanned` `bigint`Number of heap blocks scanned. This counter only advances when the phase is `seq scanning heap`.                                                |
| `index_rebuild_count` `bigint`Number of indexes rebuilt. This counter only advances when the phase is `rebuilding index`.                                                   |

[#id](#CLUSTER-PHASES)

**Table 28.40. CLUSTER and VACUUM FULL Phases**

| Phase                      | Description                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `initializing`             | The command is preparing to begin scanning the heap. This phase is expected to be very brief.               |
| `seq scanning heap`        | The command is currently scanning the table using a sequential scan.                                        |
| `index scanning heap`      | `CLUSTER` is currently scanning the table using an index scan.                                              |
| `sorting tuples`           | `CLUSTER` is currently sorting tuples.                                                                      |
| `writing new heap`         | `CLUSTER` is currently writing the new heap.                                                                |
| `swapping relation files`  | The command is currently swapping newly-built files into place.                                             |
| `rebuilding index`         | The command is currently rebuilding an index.                                                               |
| `performing final cleanup` | The command is performing final cleanup. When this phase is completed, `CLUSTER` or `VACUUM FULL` will end. |

[#id](#COPY-PROGRESS-REPORTING)

### 28.4.3. COPY Progress Reporting [#](#COPY-PROGRESS-REPORTING)

Whenever `COPY` is running, the `pg_stat_progress_copy` view will contain one row for each backend that is currently running a `COPY` command. The table below describes the information that will be reported and provides information about how to interpret it.

[#id](#PG-STAT-PROGRESS-COPY-VIEW)

**Table 28.41. `pg_stat_progress_copy` View**

| Column TypeDescription                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pid` `integer`Process ID of backend.                                                                                                                                                                                                        |
| `datid` `oid`OID of the database to which this backend is connected.                                                                                                                                                                         |
| `datname` `name`Name of the database to which this backend is connected.                                                                                                                                                                     |
| `relid` `oid`OID of the table on which the `COPY` command is executed. It is set to `0` if copying from a `SELECT` query.                                                                                                                    |
| `command` `text`The command that is running: `COPY FROM`, or `COPY TO`.                                                                                                                                                                      |
| `type` `text`The io type that the data is read from or written to: `FILE`, `PROGRAM`, `PIPE` (for `COPY FROM STDIN` and `COPY TO STDOUT`), or `CALLBACK` (used for example during the initial table synchronization in logical replication). |
| `bytes_processed` `bigint`Number of bytes already processed by `COPY` command.                                                                                                                                                               |
| `bytes_total` `bigint`Size of source file for `COPY FROM` command in bytes. It is set to `0` if not available.                                                                                                                               |
| `tuples_processed` `bigint`Number of tuples already processed by `COPY` command.                                                                                                                                                             |
| `tuples_excluded` `bigint`Number of tuples not processed because they were excluded by the `WHERE` clause of the `COPY` command.                                                                                                             |

[#id](#CREATE-INDEX-PROGRESS-REPORTING)

### 28.4.4. CREATE INDEX Progress Reporting [#](#CREATE-INDEX-PROGRESS-REPORTING)

Whenever `CREATE INDEX` or `REINDEX` is running, the `pg_stat_progress_create_index` view will contain one row for each backend that is currently creating indexes. The tables below describe the information that will be reported and provide information about how to interpret it.

[#id](#PG-STAT-PROGRESS-CREATE-INDEX-VIEW)

**Table 28.42. `pg_stat_progress_create_index` View**

| Column TypeDescription                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pid` `integer`Process ID of the backend creating indexes.                                                                                                                                                           |
| `datid` `oid`OID of the database to which this backend is connected.                                                                                                                                                 |
| `datname` `name`Name of the database to which this backend is connected.                                                                                                                                             |
| `relid` `oid`OID of the table on which the index is being created.                                                                                                                                                   |
| `index_relid` `oid`OID of the index being created or reindexed. During a non-concurrent `CREATE INDEX`, this is 0.                                                                                                   |
| `command` `text`Specific command type: `CREATE INDEX`, `CREATE INDEX CONCURRENTLY`, `REINDEX`, or `REINDEX CONCURRENTLY`.                                                                                            |
| `phase` `text`Current processing phase of index creation. See [Table 28.43](progress-reporting#CREATE-INDEX-PHASES).                                                                                                 |
| `lockers_total` `bigint`Total number of lockers to wait for, when applicable.                                                                                                                                        |
| `lockers_done` `bigint`Number of lockers already waited for.                                                                                                                                                         |
| `current_locker_pid` `bigint`Process ID of the locker currently being waited for.                                                                                                                                    |
| `blocks_total` `bigint`Total number of blocks to be processed in the current phase.                                                                                                                                  |
| `blocks_done` `bigint`Number of blocks already processed in the current phase.                                                                                                                                       |
| `tuples_total` `bigint`Total number of tuples to be processed in the current phase.                                                                                                                                  |
| `tuples_done` `bigint`Number of tuples already processed in the current phase.                                                                                                                                       |
| `partitions_total` `bigint`Total number of partitions on which the index is to be created or attached, including both direct and indirect partitions. `0` during a `REINDEX`, or when the index is not partitioned.  |
| `partitions_done` `bigint`Number of partitions on which the index has already been created or attached, including both direct and indirect partitions. `0` during a `REINDEX`, or when the index is not partitioned. |

[#id](#CREATE-INDEX-PHASES)

**Table 28.43. CREATE INDEX Phases**

| Phase                                     | Description                                                                                                                                                                                                                                                                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `initializing`                            | `CREATE INDEX` or `REINDEX` is preparing to create the index. This phase is expected to be very brief.                                                                                                                                                                                                                                     |
| `waiting for writers before build`        | `CREATE INDEX CONCURRENTLY` or `REINDEX CONCURRENTLY` is waiting for transactions with write locks that can potentially see the table to finish. This phase is skipped when not in concurrent mode. Columns `lockers_total`, `lockers_done` and `current_locker_pid` contain the progress information for this phase.                      |
| `building index`                          | The index is being built by the access method-specific code. In this phase, access methods that support progress reporting fill in their own progress data, and the subphase is indicated in this column. Typically, `blocks_total` and `blocks_done` will contain progress data, as well as potentially `tuples_total` and `tuples_done`. |
| `waiting for writers before validation`   | `CREATE INDEX CONCURRENTLY` or `REINDEX CONCURRENTLY` is waiting for transactions with write locks that can potentially write into the table to finish. This phase is skipped when not in concurrent mode. Columns `lockers_total`, `lockers_done` and `current_locker_pid` contain the progress information for this phase.               |
| `index validation: scanning index`        | `CREATE INDEX CONCURRENTLY` is scanning the index searching for tuples that need to be validated. This phase is skipped when not in concurrent mode. Columns `blocks_total` (set to the total size of the index) and `blocks_done` contain the progress information for this phase.                                                        |
| `index validation: sorting tuples`        | `CREATE INDEX CONCURRENTLY` is sorting the output of the index scanning phase.                                                                                                                                                                                                                                                             |
| `index validation: scanning table`        | `CREATE INDEX CONCURRENTLY` is scanning the table to validate the index tuples collected in the previous two phases. This phase is skipped when not in concurrent mode. Columns `blocks_total` (set to the total size of the table) and `blocks_done` contain the progress information for this phase.                                     |
| `waiting for old snapshots`               | `CREATE INDEX CONCURRENTLY` or `REINDEX CONCURRENTLY` is waiting for transactions that can potentially see the table to release their snapshots. This phase is skipped when not in concurrent mode. Columns `lockers_total`, `lockers_done` and `current_locker_pid` contain the progress information for this phase.                      |
| `waiting for readers before marking dead` | `REINDEX CONCURRENTLY` is waiting for transactions with read locks on the table to finish, before marking the old index dead. This phase is skipped when not in concurrent mode. Columns `lockers_total`, `lockers_done` and `current_locker_pid` contain the progress information for this phase.                                         |
| `waiting for readers before dropping`     | `REINDEX CONCURRENTLY` is waiting for transactions with read locks on the table to finish, before dropping the old index. This phase is skipped when not in concurrent mode. Columns `lockers_total`, `lockers_done` and `current_locker_pid` contain the progress information for this phase.                                             |

[#id](#VACUUM-PROGRESS-REPORTING)

### 28.4.5. VACUUM Progress Reporting [#](#VACUUM-PROGRESS-REPORTING)

Whenever `VACUUM` is running, the `pg_stat_progress_vacuum` view will contain one row for each backend (including autovacuum worker processes) that is currently vacuuming. The tables below describe the information that will be reported and provide information about how to interpret it. Progress for `VACUUM FULL` commands is reported via `pg_stat_progress_cluster` because both `VACUUM FULL` and `CLUSTER` rewrite the table, while regular `VACUUM` only modifies it in place. See [Section 28.4.2](progress-reporting#CLUSTER-PROGRESS-REPORTING).

[#id](#PG-STAT-PROGRESS-VACUUM-VIEW)

**Table 28.44. `pg_stat_progress_vacuum` View**

| Column TypeDescription                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pid` `integer`Process ID of backend.                                                                                                                                                                                                                                                                                                                                                      |
| `datid` `oid`OID of the database to which this backend is connected.                                                                                                                                                                                                                                                                                                                       |
| `datname` `name`Name of the database to which this backend is connected.                                                                                                                                                                                                                                                                                                                   |
| `relid` `oid`OID of the table being vacuumed.                                                                                                                                                                                                                                                                                                                                              |
| `phase` `text`Current processing phase of vacuum. See [Table 28.45](progress-reporting#VACUUM-PHASES).                                                                                                                                                                                                                                                                                     |
| `heap_blks_total` `bigint`Total number of heap blocks in the table. This number is reported as of the beginning of the scan; blocks added later will not be (and need not be) visited by this `VACUUM`.                                                                                                                                                                                    |
| `heap_blks_scanned` `bigint`Number of heap blocks scanned. Because the [visibility map](storage-vm) is used to optimize scans, some blocks will be skipped without inspection; skipped blocks are included in this total, so that this number will eventually become equal to `heap_blks_total` when the vacuum is complete. This counter only advances when the phase is `scanning heap`. |
| `heap_blks_vacuumed` `bigint`Number of heap blocks vacuumed. Unless the table has no indexes, this counter only advances when the phase is `vacuuming heap`. Blocks that contain no dead tuples are skipped, so the counter may sometimes skip forward in large increments.                                                                                                                |
| `index_vacuum_count` `bigint`Number of completed index vacuum cycles.                                                                                                                                                                                                                                                                                                                      |
| `max_dead_tuples` `bigint`Number of dead tuples that we can store before needing to perform an index vacuum cycle, based on [maintenance_work_mem](runtime-config-resource#GUC-MAINTENANCE-WORK-MEM).                                                                                                                                                                                      |
| `num_dead_tuples` `bigint`Number of dead tuples collected since the last index vacuum cycle.                                                                                                                                                                                                                                                                                               |

[#id](#VACUUM-PHASES)

**Table 28.45. VACUUM Phases**

| Phase                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `initializing`             | `VACUUM` is preparing to begin scanning the heap. This phase is expected to be very brief.                                                                                                                                                                                                                                                                                                                                                                   |
| `scanning heap`            | `VACUUM` is currently scanning the heap. It will prune and defragment each page if required, and possibly perform freezing activity. The `heap_blks_scanned` column can be used to monitor the progress of the scan.                                                                                                                                                                                                                                         |
| `vacuuming indexes`        | `VACUUM` is currently vacuuming the indexes. If a table has any indexes, this will happen at least once per vacuum, after the heap has been completely scanned. It may happen multiple times per vacuum if [maintenance_work_mem](runtime-config-resource#GUC-MAINTENANCE-WORK-MEM) (or, in the case of autovacuum, [autovacuum_work_mem](runtime-config-resource#GUC-AUTOVACUUM-WORK-MEM) if set) is insufficient to store the number of dead tuples found. |
| `vacuuming heap`           | `VACUUM` is currently vacuuming the heap. Vacuuming the heap is distinct from scanning the heap, and occurs after each instance of vacuuming indexes. If `heap_blks_scanned` is less than `heap_blks_total`, the system will return to scanning the heap after this phase is completed; otherwise, it will begin cleaning up indexes after this phase is completed.                                                                                          |
| `cleaning up indexes`      | `VACUUM` is currently cleaning up indexes. This occurs after the heap has been completely scanned and all vacuuming of the indexes and the heap has been completed.                                                                                                                                                                                                                                                                                          |
| `truncating heap`          | `VACUUM` is currently truncating the heap so as to return empty pages at the end of the relation to the operating system. This occurs after cleaning up indexes.                                                                                                                                                                                                                                                                                             |
| `performing final cleanup` | `VACUUM` is performing final cleanup. During this phase, `VACUUM` will vacuum the free space map, update statistics in `pg_class`, and report statistics to the cumulative statistics system. When this phase is completed, `VACUUM` will end.                                                                                                                                                                                                               |

[#id](#BASEBACKUP-PROGRESS-REPORTING)

### 28.4.6. Base Backup Progress Reporting [#](#BASEBACKUP-PROGRESS-REPORTING)

Whenever an application like pg_basebackup is taking a base backup, the `pg_stat_progress_basebackup` view will contain a row for each WAL sender process that is currently running the `BASE_BACKUP` replication command and streaming the backup. The tables below describe the information that will be reported and provide information about how to interpret it.

[#id](#PG-STAT-PROGRESS-BASEBACKUP-VIEW)

**Table 28.46. `pg_stat_progress_basebackup` View**

| Column TypeDescription                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pid` `integer`Process ID of a WAL sender process.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `phase` `text`Current processing phase. See [Table 28.47](progress-reporting#BASEBACKUP-PHASES).                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `backup_total` `bigint`Total amount of data that will be streamed. This is estimated and reported as of the beginning of `streaming database files` phase. Note that this is only an approximation since the database may change during `streaming database files` phase and WAL log may be included in the backup later. This is always the same value as `backup_streamed` once the amount of data streamed exceeds the estimated total size. If the estimation is disabled in pg_basebackup (i.e., `--no-estimate-size` option is specified), this is `NULL`. |
| `backup_streamed` `bigint`Amount of data streamed. This counter only advances when the phase is `streaming database files` or `transferring wal files`.                                                                                                                                                                                                                                                                                                                                                                                                          |
| `tablespaces_total` `bigint`Total number of tablespaces that will be streamed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `tablespaces_streamed` `bigint`Number of tablespaces streamed. This counter only advances when the phase is `streaming database files`.                                                                                                                                                                                                                                                                                                                                                                                                                          |

[#id](#BASEBACKUP-PHASES)

**Table 28.47. Base Backup Phases**

| Phase                                 | Description                                                                                                                                                                                                                                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initializing`                        | The WAL sender process is preparing to begin the backup. This phase is expected to be very brief.                                                                                                                                                                                                                         |
| `waiting for checkpoint to finish`    | The WAL sender process is currently performing `pg_backup_start` to prepare to take a base backup, and waiting for the start-of-backup checkpoint to finish.                                                                                                                                                              |
| `estimating backup size`              | The WAL sender process is currently estimating the total amount of database files that will be streamed as a base backup.                                                                                                                                                                                                 |
| `streaming database files`            | The WAL sender process is currently streaming database files as a base backup.                                                                                                                                                                                                                                            |
| `waiting for wal archiving to finish` | The WAL sender process is currently performing `pg_backup_stop` to finish the backup, and waiting for all the WAL files required for the base backup to be successfully archived. If either `--wal-method=none` or `--wal-method=stream` is specified in pg_basebackup, the backup will end when this phase is completed. |
| `transferring wal files`              | The WAL sender process is currently transferring all WAL logs generated during the backup. This phase occurs after `waiting for wal archiving to finish` phase if `--wal-method=fetch` is specified in pg_basebackup. The backup will end when this phase is completed.                                                   |
