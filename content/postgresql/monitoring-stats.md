

|          28.2. The Cumulative Statistics System         |                                                                  |                                          |                                                       |                                                      |
| :-----------------------------------------------------: | :--------------------------------------------------------------- | :--------------------------------------: | ----------------------------------------------------: | ---------------------------------------------------: |
| [Prev](monitoring-ps.html "28.1. Standard Unix Tools")  | [Up](monitoring.html "Chapter 28. Monitoring Database Activity") | Chapter 28. Monitoring Database Activity | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](monitoring-locks.html "28.3. Viewing Locks") |

***

## 28.2. The Cumulative Statistics System [#](#MONITORING-STATS)

  * *   [28.2.1. Statistics Collection Configuration](monitoring-stats.html#MONITORING-STATS-SETUP)
  * [28.2.2. Viewing Statistics](monitoring-stats.html#MONITORING-STATS-VIEWS)
  * [28.2.3. `pg_stat_activity`](monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW)
  * [28.2.4. `pg_stat_replication`](monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW)
  * [28.2.5. `pg_stat_replication_slots`](monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW)
  * [28.2.6. `pg_stat_wal_receiver`](monitoring-stats.html#MONITORING-PG-STAT-WAL-RECEIVER-VIEW)
  * [28.2.7. `pg_stat_recovery_prefetch`](monitoring-stats.html#MONITORING-PG-STAT-RECOVERY-PREFETCH)
  * [28.2.8. `pg_stat_subscription`](monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION)
  * [28.2.9. `pg_stat_subscription_stats`](monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION-STATS)
  * [28.2.10. `pg_stat_ssl`](monitoring-stats.html#MONITORING-PG-STAT-SSL-VIEW)
  * [28.2.11. `pg_stat_gssapi`](monitoring-stats.html#MONITORING-PG-STAT-GSSAPI-VIEW)
  * [28.2.12. `pg_stat_archiver`](monitoring-stats.html#MONITORING-PG-STAT-ARCHIVER-VIEW)
  * [28.2.13. `pg_stat_io`](monitoring-stats.html#MONITORING-PG-STAT-IO-VIEW)
  * [28.2.14. `pg_stat_bgwriter`](monitoring-stats.html#MONITORING-PG-STAT-BGWRITER-VIEW)
  * [28.2.15. `pg_stat_wal`](monitoring-stats.html#MONITORING-PG-STAT-WAL-VIEW)
  * [28.2.16. `pg_stat_database`](monitoring-stats.html#MONITORING-PG-STAT-DATABASE-VIEW)
  * [28.2.17. `pg_stat_database_conflicts`](monitoring-stats.html#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW)
  * [28.2.18. `pg_stat_all_tables`](monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)
  * [28.2.19. `pg_stat_all_indexes`](monitoring-stats.html#MONITORING-PG-STAT-ALL-INDEXES-VIEW)
  * [28.2.20. `pg_statio_all_tables`](monitoring-stats.html#MONITORING-PG-STATIO-ALL-TABLES-VIEW)
  * [28.2.21. `pg_statio_all_indexes`](monitoring-stats.html#MONITORING-PG-STATIO-ALL-INDEXES-VIEW)
  * [28.2.22. `pg_statio_all_sequences`](monitoring-stats.html#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW)
  * [28.2.23. `pg_stat_user_functions`](monitoring-stats.html#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW)
  * [28.2.24. `pg_stat_slru`](monitoring-stats.html#MONITORING-PG-STAT-SLRU-VIEW)
  * [28.2.25. Statistics Functions](monitoring-stats.html#MONITORING-STATS-FUNCTIONS)

PostgreSQL's *cumulative statistics system* supports collection and reporting of information about server activity. Presently, accesses to tables and indexes in both disk-block and individual-row terms are counted. The total number of rows in each table, and information about vacuum and analyze actions for each table are also counted. If enabled, calls to user-defined functions and the total time spent in each one are counted as well.

PostgreSQL also supports reporting dynamic information about exactly what is going on in the system right now, such as the exact command currently being executed by other server processes, and which other connections exist in the system. This facility is independent of the cumulative statistics system.

### 28.2.1. Statistics Collection Configuration [#](#MONITORING-STATS-SETUP)

Since collection of statistics adds some overhead to query execution, the system can be configured to collect or not collect information. This is controlled by configuration parameters that are normally set in `postgresql.conf`. (See [Chapter 20](runtime-config.html "Chapter 20. Server Configuration") for details about setting configuration parameters.)

The parameter [track\_activities](runtime-config-statistics.html#GUC-TRACK-ACTIVITIES) enables monitoring of the current command being executed by any server process.

The parameter [track\_counts](runtime-config-statistics.html#GUC-TRACK-COUNTS) controls whether cumulative statistics are collected about table and index accesses.

The parameter [track\_functions](runtime-config-statistics.html#GUC-TRACK-FUNCTIONS) enables tracking of usage of user-defined functions.

The parameter [track\_io\_timing](runtime-config-statistics.html#GUC-TRACK-IO-TIMING) enables monitoring of block read and write times.

The parameter [track\_wal\_io\_timing](runtime-config-statistics.html#GUC-TRACK-WAL-IO-TIMING) enables monitoring of WAL write times.

Normally these parameters are set in `postgresql.conf` so that they apply to all server processes, but it is possible to turn them on or off in individual sessions using the [SET](sql-set.html "SET") command. (To prevent ordinary users from hiding their activity from the administrator, only superusers are allowed to change these parameters with `SET`.)

Cumulative statistics are collected in shared memory. Every PostgreSQL process collects statistics locally, then updates the shared data at appropriate intervals. When a server, including a physical replica, shuts down cleanly, a permanent copy of the statistics data is stored in the `pg_stat` subdirectory, so that statistics can be retained across server restarts. In contrast, when starting from an unclean shutdown (e.g., after an immediate shutdown, a server crash, starting from a base backup, and point-in-time recovery), all statistics counters are reset.

### 28.2.2. Viewing Statistics [#](#MONITORING-STATS-VIEWS)

Several predefined views, listed in [Table 28.1](monitoring-stats.html#MONITORING-STATS-DYNAMIC-VIEWS-TABLE "Table 28.1. Dynamic Statistics Views"), are available to show the current state of the system. There are also several other views, listed in [Table 28.2](monitoring-stats.html#MONITORING-STATS-VIEWS-TABLE "Table 28.2. Collected Statistics Views"), available to show the accumulated statistics. Alternatively, one can build custom views using the underlying cumulative statistics functions, as discussed in [Section 28.2.25](monitoring-stats.html#MONITORING-STATS-FUNCTIONS "28.2.25. Statistics Functions").

When using the cumulative statistics views and functions to monitor collected data, it is important to realize that the information does not update instantaneously. Each individual server process flushes out accumulated statistics to shared memory just before going idle, but not more frequently than once per `PGSTAT_MIN_INTERVAL` milliseconds (1 second unless altered while building the server); so a query or transaction still in progress does not affect the displayed totals and the displayed information lags behind actual activity. However, current-query information collected by `track_activities` is always up-to-date.

Another important point is that when a server process is asked to display any of the accumulated statistics, accessed values are cached until the end of its current transaction in the default configuration. So the statistics will show static information as long as you continue the current transaction. Similarly, information about the current queries of all sessions is collected when any such information is first requested within a transaction, and the same information will be displayed throughout the transaction. This is a feature, not a bug, because it allows you to perform several queries on the statistics and correlate the results without worrying that the numbers are changing underneath you. When analyzing statistics interactively, or with expensive queries, the time delta between accesses to individual statistics can lead to significant skew in the cached statistics. To minimize skew, `stats_fetch_consistency` can be set to `snapshot`, at the price of increased memory usage for caching not-needed statistics data. Conversely, if it's known that statistics are only accessed once, caching accessed statistics is unnecessary and can be avoided by setting `stats_fetch_consistency` to `none`. You can invoke `pg_stat_clear_snapshot`() to discard the current transaction's statistics snapshot or cached values (if any). The next use of statistical information will (when in snapshot mode) cause a new snapshot to be built or (when in cache mode) accessed statistics to be cached.

A transaction can also see its own statistics (not yet flushed out to the shared memory statistics) in the views `pg_stat_xact_all_tables`, `pg_stat_xact_sys_tables`, `pg_stat_xact_user_tables`, and `pg_stat_xact_user_functions`. These numbers do not act as stated above; instead they update continuously throughout the transaction.

Some of the information in the dynamic statistics views shown in [Table 28.1](monitoring-stats.html#MONITORING-STATS-DYNAMIC-VIEWS-TABLE "Table 28.1. Dynamic Statistics Views") is security restricted. Ordinary users can only see all the information about their own sessions (sessions belonging to a role that they are a member of). In rows about other sessions, many columns will be null. Note, however, that the existence of a session and its general properties such as its sessions user and database are visible to all users. Superusers and roles with privileges of built-in role `pg_read_all_stats` (see also [Section 22.5](predefined-roles.html "22.5. Predefined Roles")) can see all the information about all sessions.

**Table 28.1. Dynamic Statistics Views**

| View Name                           | Description                                                                                                                                                                                                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pg_stat_activity`              | One row per server process, showing information related to the current activity of that process, such as state and current query. See [`pg_stat_activity`](monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW "28.2.3. pg_stat_activity") for details.    |
| `pg_stat_replication`           | One row per WAL sender process, showing statistics about replication to that sender's connected standby server. See [`pg_stat_replication`](monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW "28.2.4. pg_stat_replication") for details.             |
| `pg_stat_wal_receiver`          | Only one row, showing statistics about the WAL receiver from that receiver's connected server. See [`pg_stat_wal_receiver`](monitoring-stats.html#MONITORING-PG-STAT-WAL-RECEIVER-VIEW "28.2.6. pg_stat_wal_receiver") for details.                           |
| `pg_stat_recovery_prefetch`     | Only one row, showing statistics about blocks prefetched during recovery. See [`pg_stat_recovery_prefetch`](monitoring-stats.html#MONITORING-PG-STAT-RECOVERY-PREFETCH "28.2.7. pg_stat_recovery_prefetch") for details.                                      |
| `pg_stat_subscription`          | At least one row per subscription, showing information about the subscription workers. See [`pg_stat_subscription`](monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION "28.2.8. pg_stat_subscription") for details.                                        |
| `pg_stat_ssl`                   | One row per connection (regular and replication), showing information about SSL used on this connection. See [`pg_stat_ssl`](monitoring-stats.html#MONITORING-PG-STAT-SSL-VIEW "28.2.10. pg_stat_ssl") for details.                                           |
| `pg_stat_gssapi`                | One row per connection (regular and replication), showing information about GSSAPI authentication and encryption used on this connection. See [`pg_stat_gssapi`](monitoring-stats.html#MONITORING-PG-STAT-GSSAPI-VIEW "28.2.11. pg_stat_gssapi") for details. |
| `pg_stat_progress_analyze`      | One row for each backend (including autovacuum worker processes) running `ANALYZE`, showing current progress. See [Section 28.4.1](progress-reporting.html#ANALYZE-PROGRESS-REPORTING "28.4.1. ANALYZE Progress Reporting").                                  |
| `pg_stat_progress_create_index` | One row for each backend running `CREATE INDEX` or `REINDEX`, showing current progress. See [Section 28.4.4](progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING "28.4.4. CREATE INDEX Progress Reporting").                                              |
| `pg_stat_progress_vacuum`       | One row for each backend (including autovacuum worker processes) running `VACUUM`, showing current progress. See [Section 28.4.5](progress-reporting.html#VACUUM-PROGRESS-REPORTING "28.4.5. VACUUM Progress Reporting").                                     |
| `pg_stat_progress_cluster`      | One row for each backend running `CLUSTER` or `VACUUM FULL`, showing current progress. See [Section 28.4.2](progress-reporting.html#CLUSTER-PROGRESS-REPORTING "28.4.2. CLUSTER Progress Reporting").                                                         |
| `pg_stat_progress_basebackup`   | One row for each WAL sender process streaming a base backup, showing current progress. See [Section 28.4.6](progress-reporting.html#BASEBACKUP-PROGRESS-REPORTING "28.4.6. Base Backup Progress Reporting").                                                  |
| `pg_stat_progress_copy`         | One row for each backend running `COPY`, showing current progress. See [Section 28.4.3](progress-reporting.html#COPY-PROGRESS-REPORTING "28.4.3. COPY Progress Reporting").                                                                                   |

\

**Table 28.2. Collected Statistics Views**

| View Name                         | Description                                                                                                                                                                                                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pg_stat_archiver`            | One row only, showing statistics about the WAL archiver process's activity. See [`pg_stat_archiver`](monitoring-stats.html#MONITORING-PG-STAT-ARCHIVER-VIEW "28.2.12. pg_stat_archiver") for details.                                                                                |
| `pg_stat_bgwriter`            | One row only, showing statistics about the background writer process's activity. See [`pg_stat_bgwriter`](monitoring-stats.html#MONITORING-PG-STAT-BGWRITER-VIEW "28.2.14. pg_stat_bgwriter") for details.                                                                           |
| `pg_stat_database`            | One row per database, showing database-wide statistics. See [`pg_stat_database`](monitoring-stats.html#MONITORING-PG-STAT-DATABASE-VIEW "28.2.16. pg_stat_database") for details.                                                                                                    |
| `pg_stat_database_conflicts`  | One row per database, showing database-wide statistics about query cancels due to conflict with recovery on standby servers. See [`pg_stat_database_conflicts`](monitoring-stats.html#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW "28.2.17. pg_stat_database_conflicts") for details. |
| `pg_stat_io`                  | One row for each combination of backend type, context, and target object containing cluster-wide I/O statistics. See [`pg_stat_io`](monitoring-stats.html#MONITORING-PG-STAT-IO-VIEW "28.2.13. pg_stat_io") for details.                                                             |
| `pg_stat_replication_slots`   | One row per replication slot, showing statistics about the replication slot's usage. See [`pg_stat_replication_slots`](monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW "28.2.5. pg_stat_replication_slots") for details.                                             |
| `pg_stat_slru`                | One row per SLRU, showing statistics of operations. See [`pg_stat_slru`](monitoring-stats.html#MONITORING-PG-STAT-SLRU-VIEW "28.2.24. pg_stat_slru") for details.                                                                                                                    |
| `pg_stat_subscription_stats`  | One row per subscription, showing statistics about errors. See [`pg_stat_subscription_stats`](monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION-STATS "28.2.9. pg_stat_subscription_stats") for details.                                                                         |
| `pg_stat_wal`                 | One row only, showing statistics about WAL activity. See [`pg_stat_wal`](monitoring-stats.html#MONITORING-PG-STAT-WAL-VIEW "28.2.15. pg_stat_wal") for details.                                                                                                                      |
| `pg_stat_all_tables`          | One row for each table in the current database, showing statistics about accesses to that specific table. See [`pg_stat_all_tables`](monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW "28.2.18. pg_stat_all_tables") for details.                                            |
| `pg_stat_sys_tables`          | Same as `pg_stat_all_tables`, except that only system tables are shown.                                                                                                                                                                                                              |
| `pg_stat_user_tables`         | Same as `pg_stat_all_tables`, except that only user tables are shown.                                                                                                                                                                                                                |
| `pg_stat_xact_all_tables`     | Similar to `pg_stat_all_tables`, but counts actions taken so far within the current transaction (which are *not* yet included in `pg_stat_all_tables` and related views). The columns for numbers of live and dead rows and vacuum and analyze actions are not present in this view. |
| `pg_stat_xact_sys_tables`     | Same as `pg_stat_xact_all_tables`, except that only system tables are shown.                                                                                                                                                                                                         |
| `pg_stat_xact_user_tables`    | Same as `pg_stat_xact_all_tables`, except that only user tables are shown.                                                                                                                                                                                                           |
| `pg_stat_all_indexes`         | One row for each index in the current database, showing statistics about accesses to that specific index. See [`pg_stat_all_indexes`](monitoring-stats.html#MONITORING-PG-STAT-ALL-INDEXES-VIEW "28.2.19. pg_stat_all_indexes") for details.                                         |
| `pg_stat_sys_indexes`         | Same as `pg_stat_all_indexes`, except that only indexes on system tables are shown.                                                                                                                                                                                                  |
| `pg_stat_user_indexes`        | Same as `pg_stat_all_indexes`, except that only indexes on user tables are shown.                                                                                                                                                                                                    |
| `pg_stat_user_functions`      | One row for each tracked function, showing statistics about executions of that function. See [`pg_stat_user_functions`](monitoring-stats.html#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW "28.2.23. pg_stat_user_functions") for details.                                                 |
| `pg_stat_xact_user_functions` | Similar to `pg_stat_user_functions`, but counts only calls during the current transaction (which are *not* yet included in `pg_stat_user_functions`).                                                                                                                                |
| `pg_statio_all_tables`        | One row for each table in the current database, showing statistics about I/O on that specific table. See [`pg_statio_all_tables`](monitoring-stats.html#MONITORING-PG-STATIO-ALL-TABLES-VIEW "28.2.20. pg_statio_all_tables") for details.                                           |
| `pg_statio_sys_tables`        | Same as `pg_statio_all_tables`, except that only system tables are shown.                                                                                                                                                                                                            |
| `pg_statio_user_tables`       | Same as `pg_statio_all_tables`, except that only user tables are shown.                                                                                                                                                                                                              |
| `pg_statio_all_indexes`       | One row for each index in the current database, showing statistics about I/O on that specific index. See [`pg_statio_all_indexes`](monitoring-stats.html#MONITORING-PG-STATIO-ALL-INDEXES-VIEW "28.2.21. pg_statio_all_indexes") for details.                                        |
| `pg_statio_sys_indexes`       | Same as `pg_statio_all_indexes`, except that only indexes on system tables are shown.                                                                                                                                                                                                |
| `pg_statio_user_indexes`      | Same as `pg_statio_all_indexes`, except that only indexes on user tables are shown.                                                                                                                                                                                                  |
| `pg_statio_all_sequences`     | One row for each sequence in the current database, showing statistics about I/O on that specific sequence. See [`pg_statio_all_sequences`](monitoring-stats.html#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW "28.2.22. pg_statio_all_sequences") for details.                            |
| `pg_statio_sys_sequences`     | Same as `pg_statio_all_sequences`, except that only system sequences are shown. (Presently, no system sequences are defined, so this view is always empty.)                                                                                                                          |
| `pg_statio_user_sequences`    | Same as `pg_statio_all_sequences`, except that only user sequences are shown.                                                                                                                                                                                                        |

\

The per-index statistics are particularly useful to determine which indexes are being used and how effective they are.

The `pg_stat_io` and `pg_statio_` set of views are useful for determining the effectiveness of the buffer cache. They can be used to calculate a cache hit ratio. Note that while PostgreSQL's I/O statistics capture most instances in which the kernel was invoked in order to perform I/O, they do not differentiate between data which had to be fetched from disk and that which already resided in the kernel page cache. Users are advised to use the PostgreSQL statistics views in combination with operating system utilities for a more complete picture of their database's I/O performance.

### 28.2.3. `pg_stat_activity` [#](#MONITORING-PG-STAT-ACTIVITY-VIEW)

The `pg_stat_activity` view will have one row per server process, showing information related to the current activity of that process.

**Table 28.3. `pg_stat_activity` View**

| Column TypeDescription                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `datid` `oid`OID of the database this backend is connected to                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `datname` `name`Name of the database this backend is connected to                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `pid` `integer`Process ID of this backend                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `leader_pid` `integer`Process ID of the parallel group leader if this process is a parallel query worker, or process ID of the leader apply worker if this process is a parallel apply worker. `NULL` indicates that this process is a parallel group leader or leader apply worker, or does not participate in any parallel operation.                                                                                                                                                                                                                                                                                                                                      |
| `usesysid` `oid`OID of the user logged into this backend                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `usename` `name`Name of the user logged into this backend                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `application_name` `text`Name of the application that is connected to this backend                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `client_addr` `inet`IP address of the client connected to this backend. If this field is null, it indicates either that the client is connected via a Unix socket on the server machine or that this is an internal process such as autovacuum.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `client_hostname` `text`Host name of the connected client, as reported by a reverse DNS lookup of `client_addr`. This field will only be non-null for IP connections, and only when [log\_hostname](runtime-config-logging.html#GUC-LOG-HOSTNAME) is enabled.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `client_port` `integer`TCP port number that the client is using for communication with this backend, or `-1` if a Unix socket is used. If this field is null, it indicates that this is an internal server process.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `backend_start` `timestamp with time zone`Time when this process was started. For client backends, this is the time the client connected to the server.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `xact_start` `timestamp with time zone`Time when this process' current transaction was started, or null if no transaction is active. If the current query is the first of its transaction, this column is equal to the `query_start` column.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `query_start` `timestamp with time zone`Time when the currently active query was started, or if `state` is not `active`, when the last query was started                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `state_change` `timestamp with time zone`Time when the `state` was last changed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `wait_event_type` `text`The type of event for which the backend is waiting, if any; otherwise NULL. See [Table 28.4](monitoring-stats.html#WAIT-EVENT-TABLE "Table 28.4. Wait Event Types").                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `wait_event` `text`Wait event name if backend is currently waiting, otherwise NULL. See [Table 28.5](monitoring-stats.html#WAIT-EVENT-ACTIVITY-TABLE "Table 28.5. Wait Events of Type Activity") through [Table 28.13](monitoring-stats.html#WAIT-EVENT-TIMEOUT-TABLE "Table 28.13. Wait Events of Type Timeout").                                                                                                                                                                                                                                                                                                                                                           |
| `state` `text`Current overall state of this backend. Possible values are:*   `active`: The backend is executing a query.

* `idle`: The backend is waiting for a new client command.
* `idle in transaction`: The backend is in a transaction, but is not currently executing a query.
* `idle in transaction (aborted)`: This state is similar to `idle in transaction`, except one of the statements in the transaction caused an error.
* `fastpath function call`: The backend is executing a fast-path function.
* `disabled`: This state is reported if [track\_activities](runtime-config-statistics.html#GUC-TRACK-ACTIVITIES) is disabled in this backend. |
| `backend_xid` `xid`Top-level transaction identifier of this backend, if any; see [Section 74.1](transaction-id.html "74.1. Transactions and Identifiers").                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `backend_xmin` `xid`The current backend's `xmin` horizon.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `query_id` `bigint`Identifier of this backend's most recent query. If `state` is `active` this field shows the identifier of the currently executing query. In all other states, it shows the identifier of last query that was executed. Query identifiers are not computed by default so this field will be null unless [compute\_query\_id](runtime-config-statistics.html#GUC-COMPUTE-QUERY-ID) parameter is enabled or a third-party module that computes query identifiers is configured.                                                                                                                                                                              |
| `query` `text`Text of this backend's most recent query. If `state` is `active` this field shows the currently executing query. In all other states, it shows the last query that was executed. By default the query text is truncated at 1024 bytes; this value can be changed via the parameter [track\_activity\_query\_size](runtime-config-statistics.html#GUC-TRACK-ACTIVITY-QUERY-SIZE).                                                                                                                                                                                                                                                                               |
| `backend_type` `text`Type of current backend. Possible types are `autovacuum launcher`, `autovacuum worker`, `logical replication launcher`, `logical replication worker`, `parallel worker`, `background writer`, `client backend`, `checkpointer`, `archiver`, `standalone backend`, `startup`, `walreceiver`, `walsender` and `walwriter`. In addition, background workers registered by extensions may have additional types.                                                                                                                                                                                                                                            |

\

### Note

The `wait_event` and `state` columns are independent. If a backend is in the `active` state, it may or may not be `waiting` on some event. If the state is `active` and `wait_event` is non-null, it means that a query is being executed, but is being blocked somewhere in the system.

**Table 28.4. Wait Event Types**

| Wait Event Type | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Activity`      | The server process is idle. This event type indicates a process waiting for activity in its main processing loop. `wait_event` will identify the specific wait point; see [Table 28.5](monitoring-stats.html#WAIT-EVENT-ACTIVITY-TABLE "Table 28.5. Wait Events of Type Activity").                                                                                                                                                                              |
| `BufferPin`     | The server process is waiting for exclusive access to a data buffer. Buffer pin waits can be protracted if another process holds an open cursor that last read data from the buffer in question. See [Table 28.6](monitoring-stats.html#WAIT-EVENT-BUFFERPIN-TABLE "Table 28.6. Wait Events of Type Bufferpin").                                                                                                                                                 |
| `Client`        | The server process is waiting for activity on a socket connected to a user application. Thus, the server expects something to happen that is independent of its internal processes. `wait_event` will identify the specific wait point; see [Table 28.7](monitoring-stats.html#WAIT-EVENT-CLIENT-TABLE "Table 28.7. Wait Events of Type Client").                                                                                                                |
| `Extension`     | The server process is waiting for some condition defined by an extension module. See [Table 28.8](monitoring-stats.html#WAIT-EVENT-EXTENSION-TABLE "Table 28.8. Wait Events of Type Extension").                                                                                                                                                                                                                                                                 |
| `IO`            | The server process is waiting for an I/O operation to complete. `wait_event` will identify the specific wait point; see [Table 28.9](monitoring-stats.html#WAIT-EVENT-IO-TABLE "Table 28.9. Wait Events of Type Io").                                                                                                                                                                                                                                            |
| `IPC`           | The server process is waiting for some interaction with another server process. `wait_event` will identify the specific wait point; see [Table 28.10](monitoring-stats.html#WAIT-EVENT-IPC-TABLE "Table 28.10. Wait Events of Type Ipc").                                                                                                                                                                                                                        |
| `Lock`          | The server process is waiting for a heavyweight lock. Heavyweight locks, also known as lock manager locks or simply locks, primarily protect SQL-visible objects such as tables. However, they are also used to ensure mutual exclusion for certain internal operations such as relation extension. `wait_event` will identify the type of lock awaited; see [Table 28.11](monitoring-stats.html#WAIT-EVENT-LOCK-TABLE "Table 28.11. Wait Events of Type Lock"). |
| `LWLock`        | The server process is waiting for a lightweight lock. Most such locks protect a particular data structure in shared memory. `wait_event` will contain a name identifying the purpose of the lightweight lock. (Some locks have specific names; others are part of a group of locks each with a similar purpose.) See [Table 28.12](monitoring-stats.html#WAIT-EVENT-LWLOCK-TABLE "Table 28.12. Wait Events of Type Lwlock").                                     |
| `Timeout`       | The server process is waiting for a timeout to expire. `wait_event` will identify the specific wait point; see [Table 28.13](monitoring-stats.html#WAIT-EVENT-TIMEOUT-TABLE "Table 28.13. Wait Events of Type Timeout").                                                                                                                                                                                                                                         |

\

**Table 28.5. Wait Events of Type `Activity`**

| `Activity` Wait Event      | Description                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `ArchiverMain`             | Waiting in main loop of archiver process.                                             |
| `AutovacuumMain`           | Waiting in main loop of autovacuum launcher process.                                  |
| `BgwriterHibernate`        | Waiting in background writer process, hibernating.                                    |
| `BgwriterMain`             | Waiting in main loop of background writer process.                                    |
| `CheckpointerMain`         | Waiting in main loop of checkpointer process.                                         |
| `LogicalApplyMain`         | Waiting in main loop of logical replication apply process.                            |
| `LogicalLauncherMain`      | Waiting in main loop of logical replication launcher process.                         |
| `LogicalParallelApplyMain` | Waiting in main loop of logical replication parallel apply process.                   |
| `RecoveryWalStream`        | Waiting in main loop of startup process for WAL to arrive, during streaming recovery. |
| `SysloggerMain`            | Waiting in main loop of syslogger process.                                            |
| `WalReceiverMain`          | Waiting in main loop of WAL receiver process.                                         |
| `WalSenderMain`            | Waiting in main loop of WAL sender process.                                           |
| `WalWriterMain`            | Waiting in main loop of WAL writer process.                                           |

\

**Table 28.6. Wait Events of Type `Bufferpin`**

| `BufferPin` Wait Event | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `BufferPin`            | Waiting to acquire an exclusive pin on a buffer. |

\

**Table 28.7. Wait Events of Type `Client`**

| `Client` Wait Event       | Description                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `ClientRead`              | Waiting to read data from the client.                                                     |
| `ClientWrite`             | Waiting to write data to the client.                                                      |
| `GssOpenServer`           | Waiting to read data from the client while establishing a GSSAPI session.                 |
| `LibpqwalreceiverConnect` | Waiting in WAL receiver to establish connection to remote server.                         |
| `LibpqwalreceiverReceive` | Waiting in WAL receiver to receive data from remote server.                               |
| `SslOpenServer`           | Waiting for SSL while attempting connection.                                              |
| `WalSenderWaitForWal`     | Waiting for WAL to be flushed in WAL sender process.                                      |
| `WalSenderWriteData`      | Waiting for any activity when processing replies from WAL receiver in WAL sender process. |

\

**Table 28.8. Wait Events of Type `Extension`**

| `Extension` Wait Event | Description              |
| ---------------------- | ------------------------ |
| `Extension`            | Waiting in an extension. |

\

**Table 28.9. Wait Events of Type `Io`**

| `IO` Wait Event                | Description                                                                                        |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `BasebackupRead`               | Waiting for base backup to read from a file.                                                       |
| `BasebackupSync`               | Waiting for data written by a base backup to reach durable storage.                                |
| `BasebackupWrite`              | Waiting for base backup to write to a file.                                                        |
| `BuffileRead`                  | Waiting for a read from a buffered file.                                                           |
| `BuffileTruncate`              | Waiting for a buffered file to be truncated.                                                       |
| `BuffileWrite`                 | Waiting for a write to a buffered file.                                                            |
| `ControlFileRead`              | Waiting for a read from the `pg_control` file.                                                     |
| `ControlFileSync`              | Waiting for the `pg_control` file to reach durable storage.                                        |
| `ControlFileSyncUpdate`        | Waiting for an update to the `pg_control` file to reach durable storage.                           |
| `ControlFileWrite`             | Waiting for a write to the `pg_control` file.                                                      |
| `ControlFileWriteUpdate`       | Waiting for a write to update the `pg_control` file.                                               |
| `CopyFileRead`                 | Waiting for a read during a file copy operation.                                                   |
| `CopyFileWrite`                | Waiting for a write during a file copy operation.                                                  |
| `DataFileExtend`               | Waiting for a relation data file to be extended.                                                   |
| `DataFileFlush`                | Waiting for a relation data file to reach durable storage.                                         |
| `DataFileImmediateSync`        | Waiting for an immediate synchronization of a relation data file to durable storage.               |
| `DataFilePrefetch`             | Waiting for an asynchronous prefetch from a relation data file.                                    |
| `DataFileRead`                 | Waiting for a read from a relation data file.                                                      |
| `DataFileSync`                 | Waiting for changes to a relation data file to reach durable storage.                              |
| `DataFileTruncate`             | Waiting for a relation data file to be truncated.                                                  |
| `DataFileWrite`                | Waiting for a write to a relation data file.                                                       |
| `DsmAllocate`                  | Waiting for a dynamic shared memory segment to be allocated.                                       |
| `DsmFillZeroWrite`             | Waiting to fill a dynamic shared memory backing file with zeroes.                                  |
| `LockFileAddtodatadirRead`     | Waiting for a read while adding a line to the data directory lock file.                            |
| `LockFileAddtodatadirSync`     | Waiting for data to reach durable storage while adding a line to the data directory lock file.     |
| `LockFileAddtodatadirWrite`    | Waiting for a write while adding a line to the data directory lock file.                           |
| `LockFileCreateRead`           | Waiting to read while creating the data directory lock file.                                       |
| `LockFileCreateSync`           | Waiting for data to reach durable storage while creating the data directory lock file.             |
| `LockFileCreateWrite`          | Waiting for a write while creating the data directory lock file.                                   |
| `LockFileRecheckdatadirRead`   | Waiting for a read during recheck of the data directory lock file.                                 |
| `LogicalRewriteCheckpointSync` | Waiting for logical rewrite mappings to reach durable storage during a checkpoint.                 |
| `LogicalRewriteMappingSync`    | Waiting for mapping data to reach durable storage during a logical rewrite.                        |
| `LogicalRewriteMappingWrite`   | Waiting for a write of mapping data during a logical rewrite.                                      |
| `LogicalRewriteSync`           | Waiting for logical rewrite mappings to reach durable storage.                                     |
| `LogicalRewriteTruncate`       | Waiting for truncate of mapping data during a logical rewrite.                                     |
| `LogicalRewriteWrite`          | Waiting for a write of logical rewrite mappings.                                                   |
| `RelationMapRead`              | Waiting for a read of the relation map file.                                                       |
| `RelationMapReplace`           | Waiting for durable replacement of a relation map file.                                            |
| `RelationMapWrite`             | Waiting for a write to the relation map file.                                                      |
| `ReorderBufferRead`            | Waiting for a read during reorder buffer management.                                               |
| `ReorderBufferWrite`           | Waiting for a write during reorder buffer management.                                              |
| `ReorderLogicalMappingRead`    | Waiting for a read of a logical mapping during reorder buffer management.                          |
| `ReplicationSlotRead`          | Waiting for a read from a replication slot control file.                                           |
| `ReplicationSlotRestoreSync`   | Waiting for a replication slot control file to reach durable storage while restoring it to memory. |
| `ReplicationSlotSync`          | Waiting for a replication slot control file to reach durable storage.                              |
| `ReplicationSlotWrite`         | Waiting for a write to a replication slot control file.                                            |
| `SlruFlushSync`                | Waiting for SLRU data to reach durable storage during a checkpoint or database shutdown.           |
| `SlruRead`                     | Waiting for a read of an SLRU page.                                                                |
| `SlruSync`                     | Waiting for SLRU data to reach durable storage following a page write.                             |
| `SlruWrite`                    | Waiting for a write of an SLRU page.                                                               |
| `SnapbuildRead`                | Waiting for a read of a serialized historical catalog snapshot.                                    |
| `SnapbuildSync`                | Waiting for a serialized historical catalog snapshot to reach durable storage.                     |
| `SnapbuildWrite`               | Waiting for a write of a serialized historical catalog snapshot.                                   |
| `TimelineHistoryFileSync`      | Waiting for a timeline history file received via streaming replication to reach durable storage.   |
| `TimelineHistoryFileWrite`     | Waiting for a write of a timeline history file received via streaming replication.                 |
| `TimelineHistoryRead`          | Waiting for a read of a timeline history file.                                                     |
| `TimelineHistorySync`          | Waiting for a newly created timeline history file to reach durable storage.                        |
| `TimelineHistoryWrite`         | Waiting for a write of a newly created timeline history file.                                      |
| `TwophaseFileRead`             | Waiting for a read of a two phase state file.                                                      |
| `TwophaseFileSync`             | Waiting for a two phase state file to reach durable storage.                                       |
| `TwophaseFileWrite`            | Waiting for a write of a two phase state file.                                                     |
| `VersionFileWrite`             | Waiting for the version file to be written while creating a database.                              |
| `WalsenderTimelineHistoryRead` | Waiting for a read from a timeline history file during a walsender timeline command.               |
| `WalBootstrapSync`             | Waiting for WAL to reach durable storage during bootstrapping.                                     |
| `WalBootstrapWrite`            | Waiting for a write of a WAL page during bootstrapping.                                            |
| `WalCopyRead`                  | Waiting for a read when creating a new WAL segment by copying an existing one.                     |
| `WalCopySync`                  | Waiting for a new WAL segment created by copying an existing one to reach durable storage.         |
| `WalCopyWrite`                 | Waiting for a write when creating a new WAL segment by copying an existing one.                    |
| `WalInitSync`                  | Waiting for a newly initialized WAL file to reach durable storage.                                 |
| `WalInitWrite`                 | Waiting for a write while initializing a new WAL file.                                             |
| `WalRead`                      | Waiting for a read from a WAL file.                                                                |
| `WalSync`                      | Waiting for a WAL file to reach durable storage.                                                   |
| `WalSyncMethodAssign`          | Waiting for data to reach durable storage while assigning a new WAL sync method.                   |
| `WalWrite`                     | Waiting for a write to a WAL file.                                                                 |

\

**Table 28.10. Wait Events of Type `Ipc`**

| `IPC` Wait Event                  | Description                                                                                               |
| --------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `AppendReady`                     | Waiting for subplan nodes of an `Append` plan node to be ready.                                           |
| `ArchiveCleanupCommand`           | Waiting for [archive\_cleanup\_command](runtime-config-wal.html#GUC-ARCHIVE-CLEANUP-COMMAND) to complete. |
| `ArchiveCommand`                  | Waiting for [archive\_command](runtime-config-wal.html#GUC-ARCHIVE-COMMAND) to complete.                  |
| `BackendTermination`              | Waiting for the termination of another backend.                                                           |
| `BackupWaitWalArchive`            | Waiting for WAL files required for a backup to be successfully archived.                                  |
| `BgworkerShutdown`                | Waiting for background worker to shut down.                                                               |
| `BgworkerStartup`                 | Waiting for background worker to start up.                                                                |
| `BtreePage`                       | Waiting for the page number needed to continue a parallel B-tree scan to become available.                |
| `BufferIo`                        | Waiting for buffer I/O to complete.                                                                       |
| `CheckpointDelayComplete`         | Waiting for a backend that blocks a checkpoint from completing.                                           |
| `CheckpointDelayStart`            | Waiting for a backend that blocks a checkpoint from starting.                                             |
| `CheckpointDone`                  | Waiting for a checkpoint to complete.                                                                     |
| `CheckpointStart`                 | Waiting for a checkpoint to start.                                                                        |
| `ExecuteGather`                   | Waiting for activity from a child process while executing a `Gather` plan node.                           |
| `HashBatchAllocate`               | Waiting for an elected Parallel Hash participant to allocate a hash table.                                |
| `HashBatchElect`                  | Waiting to elect a Parallel Hash participant to allocate a hash table.                                    |
| `HashBatchLoad`                   | Waiting for other Parallel Hash participants to finish loading a hash table.                              |
| `HashBuildAllocate`               | Waiting for an elected Parallel Hash participant to allocate the initial hash table.                      |
| `HashBuildElect`                  | Waiting to elect a Parallel Hash participant to allocate the initial hash table.                          |
| `HashBuildHashInner`              | Waiting for other Parallel Hash participants to finish hashing the inner relation.                        |
| `HashBuildHashOuter`              | Waiting for other Parallel Hash participants to finish partitioning the outer relation.                   |
| `HashGrowBatchesDecide`           | Waiting to elect a Parallel Hash participant to decide on future batch growth.                            |
| `HashGrowBatchesElect`            | Waiting to elect a Parallel Hash participant to allocate more batches.                                    |
| `HashGrowBatchesFinish`           | Waiting for an elected Parallel Hash participant to decide on future batch growth.                        |
| `HashGrowBatchesReallocate`       | Waiting for an elected Parallel Hash participant to allocate more batches.                                |
| `HashGrowBatchesRepartition`      | Waiting for other Parallel Hash participants to finish repartitioning.                                    |
| `HashGrowBucketsElect`            | Waiting to elect a Parallel Hash participant to allocate more buckets.                                    |
| `HashGrowBucketsReallocate`       | Waiting for an elected Parallel Hash participant to finish allocating more buckets.                       |
| `HashGrowBucketsReinsert`         | Waiting for other Parallel Hash participants to finish inserting tuples into new buckets.                 |
| `LogicalApplySendData`            | Waiting for a logical replication leader apply process to send data to a parallel apply process.          |
| `LogicalParallelApplyStateChange` | Waiting for a logical replication parallel apply process to change state.                                 |
| `LogicalSyncData`                 | Waiting for a logical replication remote server to send data for initial table synchronization.           |
| `LogicalSyncStateChange`          | Waiting for a logical replication remote server to change state.                                          |
| `MessageQueueInternal`            | Waiting for another process to be attached to a shared message queue.                                     |
| `MessageQueuePutMessage`          | Waiting to write a protocol message to a shared message queue.                                            |
| `MessageQueueReceive`             | Waiting to receive bytes from a shared message queue.                                                     |
| `MessageQueueSend`                | Waiting to send bytes to a shared message queue.                                                          |
| `ParallelBitmapScan`              | Waiting for parallel bitmap scan to become initialized.                                                   |
| `ParallelCreateIndexScan`         | Waiting for parallel `CREATE INDEX` workers to finish heap scan.                                          |
| `ParallelFinish`                  | Waiting for parallel workers to finish computing.                                                         |
| `ProcarrayGroupUpdate`            | Waiting for the group leader to clear the transaction ID at end of a parallel operation.                  |
| `ProcSignalBarrier`               | Waiting for a barrier event to be processed by all backends.                                              |
| `Promote`                         | Waiting for standby promotion.                                                                            |
| `RecoveryConflictSnapshot`        | Waiting for recovery conflict resolution for a vacuum cleanup.                                            |
| `RecoveryConflictTablespace`      | Waiting for recovery conflict resolution for dropping a tablespace.                                       |
| `RecoveryEndCommand`              | Waiting for [recovery\_end\_command](runtime-config-wal.html#GUC-RECOVERY-END-COMMAND) to complete.       |
| `RecoveryPause`                   | Waiting for recovery to be resumed.                                                                       |
| `ReplicationOriginDrop`           | Waiting for a replication origin to become inactive so it can be dropped.                                 |
| `ReplicationSlotDrop`             | Waiting for a replication slot to become inactive so it can be dropped.                                   |
| `RestoreCommand`                  | Waiting for [restore\_command](runtime-config-wal.html#GUC-RESTORE-COMMAND) to complete.                  |
| `SafeSnapshot`                    | Waiting to obtain a valid snapshot for a `READ ONLY DEFERRABLE` transaction.                              |
| `SyncRep`                         | Waiting for confirmation from a remote server during synchronous replication.                             |
| `WalReceiverExit`                 | Waiting for the WAL receiver to exit.                                                                     |
| `WalReceiverWaitStart`            | Waiting for startup process to send initial data for streaming replication.                               |
| `XactGroupUpdate`                 | Waiting for the group leader to update transaction status at end of a parallel operation.                 |

\

**Table 28.11. Wait Events of Type `Lock`**

| `Lock` Wait Event  | Description                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `advisory`         | Waiting to acquire an advisory user lock.                                                                                       |
| `applytransaction` | Waiting to acquire a lock on a remote transaction being applied by a logical replication subscriber.                            |
| `extend`           | Waiting to extend a relation.                                                                                                   |
| `frozenid`         | Waiting to update `pg_database`.`datfrozenxid` and `pg_database`.`datminmxid`.                                                  |
| `object`           | Waiting to acquire a lock on a non-relation database object.                                                                    |
| `page`             | Waiting to acquire a lock on a page of a relation.                                                                              |
| `relation`         | Waiting to acquire a lock on a relation.                                                                                        |
| `spectoken`        | Waiting to acquire a speculative insertion lock.                                                                                |
| `transactionid`    | Waiting for a transaction to finish.                                                                                            |
| `tuple`            | Waiting to acquire a lock on a tuple.                                                                                           |
| `userlock`         | Waiting to acquire a user lock.                                                                                                 |
| `virtualxid`       | Waiting to acquire a virtual transaction ID lock; see [Section 74.1](transaction-id.html "74.1. Transactions and Identifiers"). |

\

**Table 28.12. Wait Events of Type `Lwlock`**

| `LWLock` Wait Event          | Description                                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `AddinShmemInit`             | Waiting to manage an extension's space allocation in shared memory.                                                           |
| `AutoFile`                   | Waiting to update the `postgresql.auto.conf` file.                                                                            |
| `Autovacuum`                 | Waiting to read or update the current state of autovacuum workers.                                                            |
| `AutovacuumSchedule`         | Waiting to ensure that a table selected for autovacuum still needs vacuuming.                                                 |
| `BackgroundWorker`           | Waiting to read or update background worker state.                                                                            |
| `BtreeVacuum`                | Waiting to read or update vacuum-related information for a B-tree index.                                                      |
| `BufferContent`              | Waiting to access a data page in memory.                                                                                      |
| `BufferMapping`              | Waiting to associate a data block with a buffer in the buffer pool.                                                           |
| `CheckpointerComm`           | Waiting to manage fsync requests.                                                                                             |
| `CommitTs`                   | Waiting to read or update the last value set for a transaction commit timestamp.                                              |
| `CommitTsBuffer`             | Waiting for I/O on a commit timestamp SLRU buffer.                                                                            |
| `CommitTsSLRU`               | Waiting to access the commit timestamp SLRU cache.                                                                            |
| `ControlFile`                | Waiting to read or update the `pg_control` file or create a new WAL file.                                                     |
| `DynamicSharedMemoryControl` | Waiting to read or update dynamic shared memory allocation information.                                                       |
| `LockFastPath`               | Waiting to read or update a process' fast-path lock information.                                                              |
| `LockManager`                | Waiting to read or update information about “heavyweight” locks.                                                              |
| `LogicalRepLauncherDSA`      | Waiting to access logical replication launcher's dynamic shared memory allocator.                                             |
| `LogicalRepLauncherHash`     | Waiting to access logical replication launcher's shared hash table.                                                           |
| `LogicalRepWorker`           | Waiting to read or update the state of logical replication workers.                                                           |
| `MultiXactGen`               | Waiting to read or update shared multixact state.                                                                             |
| `MultiXactMemberBuffer`      | Waiting for I/O on a multixact member SLRU buffer.                                                                            |
| `MultiXactMemberSLRU`        | Waiting to access the multixact member SLRU cache.                                                                            |
| `MultiXactOffsetBuffer`      | Waiting for I/O on a multixact offset SLRU buffer.                                                                            |
| `MultiXactOffsetSLRU`        | Waiting to access the multixact offset SLRU cache.                                                                            |
| `MultiXactTruncation`        | Waiting to read or truncate multixact information.                                                                            |
| `NotifyBuffer`               | Waiting for I/O on a `NOTIFY` message SLRU buffer.                                                                            |
| `NotifyQueue`                | Waiting to read or update `NOTIFY` messages.                                                                                  |
| `NotifyQueueTail`            | Waiting to update limit on `NOTIFY` message storage.                                                                          |
| `NotifySLRU`                 | Waiting to access the `NOTIFY` message SLRU cache.                                                                            |
| `OidGen`                     | Waiting to allocate a new OID.                                                                                                |
| `ParallelAppend`             | Waiting to choose the next subplan during Parallel Append plan execution.                                                     |
| `ParallelHashJoin`           | Waiting to synchronize workers during Parallel Hash Join plan execution.                                                      |
| `ParallelQueryDSA`           | Waiting for parallel query dynamic shared memory allocation.                                                                  |
| `PerSessionDSA`              | Waiting for parallel query dynamic shared memory allocation.                                                                  |
| `PerSessionRecordType`       | Waiting to access a parallel query's information about composite types.                                                       |
| `PerSessionRecordTypmod`     | Waiting to access a parallel query's information about type modifiers that identify anonymous record types.                   |
| `PerXactPredicateList`       | Waiting to access the list of predicate locks held by the current serializable transaction during a parallel query.           |
| `PgStatsData`                | Waiting for shared memory stats data access.                                                                                  |
| `PgStatsDSA`                 | Waiting for stats dynamic shared memory allocator access.                                                                     |
| `PgStatsHash`                | Waiting for stats shared memory hash table access.                                                                            |
| `PredicateLockManager`       | Waiting to access predicate lock information used by serializable transactions.                                               |
| `ProcArray`                  | Waiting to access the shared per-process data structures (typically, to get a snapshot or report a session's transaction ID). |
| `RelationMapping`            | Waiting to read or update a `pg_filenode.map` file (used to track the filenode assignments of certain system catalogs).       |
| `RelCacheInit`               | Waiting to read or update a `pg_internal.init` relation cache initialization file.                                            |
| `ReplicationOrigin`          | Waiting to create, drop or use a replication origin.                                                                          |
| `ReplicationOriginState`     | Waiting to read or update the progress of one replication origin.                                                             |
| `ReplicationSlotAllocation`  | Waiting to allocate or free a replication slot.                                                                               |
| `ReplicationSlotControl`     | Waiting to read or update replication slot state.                                                                             |
| `ReplicationSlotIO`          | Waiting for I/O on a replication slot.                                                                                        |
| `SerialBuffer`               | Waiting for I/O on a serializable transaction conflict SLRU buffer.                                                           |
| `SerializableFinishedList`   | Waiting to access the list of finished serializable transactions.                                                             |
| `SerializablePredicateList`  | Waiting to access the list of predicate locks held by serializable transactions.                                              |
| `SerializableXactHash`       | Waiting to read or update information about serializable transactions.                                                        |
| `SerialSLRU`                 | Waiting to access the serializable transaction conflict SLRU cache.                                                           |
| `SharedTidBitmap`            | Waiting to access a shared TID bitmap during a parallel bitmap index scan.                                                    |
| `SharedTupleStore`           | Waiting to access a shared tuple store during parallel query.                                                                 |
| `ShmemIndex`                 | Waiting to find or allocate space in shared memory.                                                                           |
| `SInvalRead`                 | Waiting to retrieve messages from the shared catalog invalidation queue.                                                      |
| `SInvalWrite`                | Waiting to add a message to the shared catalog invalidation queue.                                                            |
| `SubtransBuffer`             | Waiting for I/O on a sub-transaction SLRU buffer.                                                                             |
| `SubtransSLRU`               | Waiting to access the sub-transaction SLRU cache.                                                                             |
| `SyncRep`                    | Waiting to read or update information about the state of synchronous replication.                                             |
| `SyncScan`                   | Waiting to select the starting location of a synchronized table scan.                                                         |
| `TablespaceCreate`           | Waiting to create or drop a tablespace.                                                                                       |
| `TwoPhaseState`              | Waiting to read or update the state of prepared transactions.                                                                 |
| `WaitEventExtension`         | Waiting to read or update custom wait events information for extensions.                                                      |
| `WALBufMapping`              | Waiting to replace a page in WAL buffers.                                                                                     |
| `WALInsert`                  | Waiting to insert WAL data into a memory buffer.                                                                              |
| `WALWrite`                   | Waiting for WAL buffers to be written to disk.                                                                                |
| `WrapLimitsVacuum`           | Waiting to update limits on transaction id and multixact consumption.                                                         |
| `XactBuffer`                 | Waiting for I/O on a transaction status SLRU buffer.                                                                          |
| `XactSLRU`                   | Waiting to access the transaction status SLRU cache.                                                                          |
| `XactTruncation`             | Waiting to execute `pg_xact_status` or update the oldest transaction ID available to it.                                      |
| `XidGen`                     | Waiting to allocate a new transaction ID.                                                                                     |

\

**Table 28.13. Wait Events of Type `Timeout`**

| `Timeout` Wait Event            | Description                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `BaseBackupThrottle`            | Waiting during base backup when throttling activity.                                                   |
| `CheckpointWriteDelay`          | Waiting between writes while performing a checkpoint.                                                  |
| `PgSleep`                       | Waiting due to a call to `pg_sleep` or a sibling function.                                             |
| `RecoveryApplyDelay`            | Waiting to apply WAL during recovery because of a delay setting.                                       |
| `RecoveryRetrieveRetryInterval` | Waiting during recovery when WAL data is not available from any source (`pg_wal`, archive or stream).  |
| `RegisterSyncRequest`           | Waiting while sending synchronization requests to the checkpointer, because the request queue is full. |
| `SpinDelay`                     | Waiting while acquiring a contended spinlock.                                                          |
| `VacuumDelay`                   | Waiting in a cost-based vacuum delay point.                                                            |
| `VacuumTruncate`                | Waiting to acquire an exclusive lock to truncate off any empty pages at the end of a table vacuumed.   |

\

Here are examples of how wait events can be viewed:

```

SELECT pid, wait_event_type, wait_event FROM pg_stat_activity WHERE wait_event is NOT NULL;
 pid  | wait_event_type | wait_event
------+-----------------+------------
 2540 | Lock            | relation
 6644 | LWLock          | ProcArray
(2 rows)
```

```

SELECT a.pid, a.wait_event, w.description
  FROM pg_stat_activity a JOIN
       pg_wait_events w ON (a.wait_event_type = w.type AND
                            a.wait_event = w.name)
  WHERE a.wait_event is NOT NULL and a.state = 'active';
-[ RECORD 1 ]------------------------------------------------------​------------
pid         | 686674
wait_event  | WALInitSync
description | Waiting for a newly initialized WAL file to reach durable storage
```

### Note

Extensions can add `Extension` and `LWLock` events to the lists shown in [Table 28.8](monitoring-stats.html#WAIT-EVENT-EXTENSION-TABLE "Table 28.8. Wait Events of Type Extension") and [Table 28.12](monitoring-stats.html#WAIT-EVENT-LWLOCK-TABLE "Table 28.12. Wait Events of Type Lwlock"). In some cases, the name of an `LWLock` assigned by an extension will not be available in all server processes. It might be reported as just “`extension`” rather than the extension-assigned name.

### 28.2.4. `pg_stat_replication` [#](#MONITORING-PG-STAT-REPLICATION-VIEW)

The `pg_stat_replication` view will contain one row per WAL sender process, showing statistics about replication to that sender's connected standby server. Only directly connected standbys are listed; no information is available about downstream standby servers.

**Table 28.14. `pg_stat_replication` View**

| Column TypeDescription                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pid` `integer`Process ID of a WAL sender process                                                                                                                                                                                                                                                                                                                                                                       |
| `usesysid` `oid`OID of the user logged into this WAL sender process                                                                                                                                                                                                                                                                                                                                                     |
| `usename` `name`Name of the user logged into this WAL sender process                                                                                                                                                                                                                                                                                                                                                    |
| `application_name` `text`Name of the application that is connected to this WAL sender                                                                                                                                                                                                                                                                                                                                   |
| `client_addr` `inet`IP address of the client connected to this WAL sender. If this field is null, it indicates that the client is connected via a Unix socket on the server machine.                                                                                                                                                                                                                                    |
| `client_hostname` `text`Host name of the connected client, as reported by a reverse DNS lookup of `client_addr`. This field will only be non-null for IP connections, and only when [log\_hostname](runtime-config-logging.html#GUC-LOG-HOSTNAME) is enabled.                                                                                                                                                           |
| `client_port` `integer`TCP port number that the client is using for communication with this WAL sender, or `-1` if a Unix socket is used                                                                                                                                                                                                                                                                                |
| `backend_start` `timestamp with time zone`Time when this process was started, i.e., when the client connected to this WAL sender                                                                                                                                                                                                                                                                                        |
| `backend_xmin` `xid`This standby's `xmin` horizon reported by [hot\_standby\_feedback](runtime-config-replication.html#GUC-HOT-STANDBY-FEEDBACK).                                                                                                                                                                                                                                                                       |
| `state` `text`Current WAL sender state. Possible values are:*   `startup`: This WAL sender is starting up.

* `catchup`: This WAL sender's connected standby is catching up with the primary.
* `streaming`: This WAL sender is streaming changes after its connected standby server has caught up with the primary.
* `backup`: This WAL sender is sending a backup.
* `stopping`: This WAL sender is stopping. |
| `sent_lsn` `pg_lsn`Last write-ahead log location sent on this connection                                                                                                                                                                                                                                                                                                                                                |
| `write_lsn` `pg_lsn`Last write-ahead log location written to disk by this standby server                                                                                                                                                                                                                                                                                                                                |
| `flush_lsn` `pg_lsn`Last write-ahead log location flushed to disk by this standby server                                                                                                                                                                                                                                                                                                                                |
| `replay_lsn` `pg_lsn`Last write-ahead log location replayed into the database on this standby server                                                                                                                                                                                                                                                                                                                    |
| `write_lag` `interval`Time elapsed between flushing recent WAL locally and receiving notification that this standby server has written it (but not yet flushed it or applied it). This can be used to gauge the delay that `synchronous_commit` level `remote_write` incurred while committing if this server was configured as a synchronous standby.                                                                  |
| `flush_lag` `interval`Time elapsed between flushing recent WAL locally and receiving notification that this standby server has written and flushed it (but not yet applied it). This can be used to gauge the delay that `synchronous_commit` level `on` incurred while committing if this server was configured as a synchronous standby.                                                                              |
| `replay_lag` `interval`Time elapsed between flushing recent WAL locally and receiving notification that this standby server has written, flushed and applied it. This can be used to gauge the delay that `synchronous_commit` level `remote_apply` incurred while committing if this server was configured as a synchronous standby.                                                                                   |
| `sync_priority` `integer`Priority of this standby server for being chosen as the synchronous standby in a priority-based synchronous replication. This has no effect in a quorum-based synchronous replication.                                                                                                                                                                                                         |
| `sync_state` `text`Synchronous state of this standby server. Possible values are:*   `async`: This standby server is asynchronous.
* `potential`: This standby server is now asynchronous, but can potentially become synchronous if one of current synchronous ones fails.
* `sync`: This standby server is synchronous.
* `quorum`: This standby server is considered as a candidate for quorum standbys.       |
| `reply_time` `timestamp with time zone`Send time of last reply message received from standby server                                                                                                                                                                                                                                                                                                                     |

\

The lag times reported in the `pg_stat_replication` view are measurements of the time taken for recent WAL to be written, flushed and replayed and for the sender to know about it. These times represent the commit delay that was (or would have been) introduced by each synchronous commit level, if the remote server was configured as a synchronous standby. For an asynchronous standby, the `replay_lag` column approximates the delay before recent transactions became visible to queries. If the standby server has entirely caught up with the sending server and there is no more WAL activity, the most recently measured lag times will continue to be displayed for a short time and then show NULL.

Lag times work automatically for physical replication. Logical decoding plugins may optionally emit tracking messages; if they do not, the tracking mechanism will simply display NULL lag.

### Note

The reported lag times are not predictions of how long it will take for the standby to catch up with the sending server assuming the current rate of replay. Such a system would show similar times while new WAL is being generated, but would differ when the sender becomes idle. In particular, when the standby has caught up completely, `pg_stat_replication` shows the time taken to write, flush and replay the most recent reported WAL location rather than zero as some users might expect. This is consistent with the goal of measuring synchronous commit and transaction visibility delays for recent write transactions. To reduce confusion for users expecting a different model of lag, the lag columns revert to NULL after a short time on a fully replayed idle system. Monitoring systems should choose whether to represent this as missing data, zero or continue to display the last known value.

### 28.2.5. `pg_stat_replication_slots` [#](#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW)

The `pg_stat_replication_slots` view will contain one row per logical replication slot, showing statistics about its usage.

**Table 28.15. `pg_stat_replication_slots` View**

| Column TypeDescription                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slot_name` `text`A unique, cluster-wide identifier for the replication slot                                                                                                                                                                                                                                                                                                            |
| `spill_txns` `bigint`Number of transactions spilled to disk once the memory used by logical decoding to decode changes from WAL has exceeded `logical_decoding_work_mem`. The counter gets incremented for both top-level transactions and subtransactions.                                                                                                                             |
| `spill_count` `bigint`Number of times transactions were spilled to disk while decoding changes from WAL for this slot. This counter is incremented each time a transaction is spilled, and the same transaction may be spilled multiple times.                                                                                                                                          |
| `spill_bytes` `bigint`Amount of decoded transaction data spilled to disk while performing decoding of changes from WAL for this slot. This and other spill counters can be used to gauge the I/O which occurred during logical decoding and allow tuning `logical_decoding_work_mem`.                                                                                                   |
| `stream_txns` `bigint`Number of in-progress transactions streamed to the decoding output plugin after the memory used by logical decoding to decode changes from WAL for this slot has exceeded `logical_decoding_work_mem`. Streaming only works with top-level transactions (subtransactions can't be streamed independently), so the counter is not incremented for subtransactions. |
| `stream_count``bigint`Number of times in-progress transactions were streamed to the decoding output plugin while decoding changes from WAL for this slot. This counter is incremented each time a transaction is streamed, and the same transaction may be streamed multiple times.                                                                                                     |
| `stream_bytes``bigint`Amount of transaction data decoded for streaming in-progress transactions to the decoding output plugin while decoding changes from WAL for this slot. This and other streaming counters for this slot can be used to tune `logical_decoding_work_mem`.                                                                                                           |
| `total_txns` `bigint`Number of decoded transactions sent to the decoding output plugin for this slot. This counts top-level transactions only, and is not incremented for subtransactions. Note that this includes the transactions that are streamed and/or spilled.                                                                                                                   |
| `total_bytes``bigint`Amount of transaction data decoded for sending transactions to the decoding output plugin while decoding changes from WAL for this slot. Note that this includes data that is streamed and/or spilled.                                                                                                                                                             |
| `stats_reset` `timestamp with time zone`Time at which these statistics were last reset                                                                                                                                                                                                                                                                                                  |

### 28.2.6. `pg_stat_wal_receiver` [#](#MONITORING-PG-STAT-WAL-RECEIVER-VIEW)

The `pg_stat_wal_receiver` view will contain only one row, showing statistics about the WAL receiver from that receiver's connected server.

**Table 28.16. `pg_stat_wal_receiver` View**

| Column TypeDescription                                                                                                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pid` `integer`Process ID of the WAL receiver process                                                                                                                                                                                                                                         |
| `status` `text`Activity status of the WAL receiver process                                                                                                                                                                                                                                    |
| `receive_start_lsn` `pg_lsn`First write-ahead log location used when WAL receiver is started                                                                                                                                                                                                  |
| `receive_start_tli` `integer`First timeline number used when WAL receiver is started                                                                                                                                                                                                          |
| `written_lsn` `pg_lsn`Last write-ahead log location already received and written to disk, but not flushed. This should not be used for data integrity checks.                                                                                                                                 |
| `flushed_lsn` `pg_lsn`Last write-ahead log location already received and flushed to disk, the initial value of this field being the first log location used when WAL receiver is started                                                                                                      |
| `received_tli` `integer`Timeline number of last write-ahead log location received and flushed to disk, the initial value of this field being the timeline number of the first log location used when WAL receiver is started                                                                  |
| `last_msg_send_time` `timestamp with time zone`Send time of last message received from origin WAL sender                                                                                                                                                                                      |
| `last_msg_receipt_time` `timestamp with time zone`Receipt time of last message received from origin WAL sender                                                                                                                                                                                |
| `latest_end_lsn` `pg_lsn`Last write-ahead log location reported to origin WAL sender                                                                                                                                                                                                          |
| `latest_end_time` `timestamp with time zone`Time of last write-ahead log location reported to origin WAL sender                                                                                                                                                                               |
| `slot_name` `text`Replication slot name used by this WAL receiver                                                                                                                                                                                                                             |
| `sender_host` `text`Host of the PostgreSQL instance this WAL receiver is connected to. This can be a host name, an IP address, or a directory path if the connection is via Unix socket. (The path case can be distinguished because it will always be an absolute path, beginning with `/`.) |
| `sender_port` `integer`Port number of the PostgreSQL instance this WAL receiver is connected to.                                                                                                                                                                                              |
| `conninfo` `text`Connection string used by this WAL receiver, with security-sensitive fields obfuscated.                                                                                                                                                                                      |

### 28.2.7. `pg_stat_recovery_prefetch` [#](#MONITORING-PG-STAT-RECOVERY-PREFETCH)

The `pg_stat_recovery_prefetch` view will contain only one row. The columns `wal_distance`, `block_distance` and `io_depth` show current values, and the other columns show cumulative counters that can be reset with the `pg_stat_reset_shared` function.

**Table 28.17. `pg_stat_recovery_prefetch` View**

| Column TypeDescription                                                                               |
| ---------------------------------------------------------------------------------------------------- |
| `stats_reset` `timestamp with time zone`Time at which these statistics were last reset               |
| `prefetch` `bigint`Number of blocks prefetched because they were not in the buffer pool              |
| `hit` `bigint`Number of blocks not prefetched because they were already in the buffer pool           |
| `skip_init` `bigint`Number of blocks not prefetched because they would be zero-initialized           |
| `skip_new` `bigint`Number of blocks not prefetched because they didn't exist yet                     |
| `skip_fpw` `bigint`Number of blocks not prefetched because a full page image was included in the WAL |
| `skip_rep` `bigint`Number of blocks not prefetched because they were already recently prefetched     |
| `wal_distance` `int`How many bytes ahead the prefetcher is looking                                   |
| `block_distance` `int`How many blocks ahead the prefetcher is looking                                |
| `io_depth` `int`How many prefetches have been initiated but are not yet known to have completed      |

### 28.2.8. `pg_stat_subscription` [#](#MONITORING-PG-STAT-SUBSCRIPTION)

**Table 28.18. `pg_stat_subscription` View**

| Column TypeDescription                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `subid` `oid`OID of the subscription                                                                                                                                                    |
| `subname` `name`Name of the subscription                                                                                                                                                |
| `worker_type` `text`Type of the subscription worker process. Possible types are `apply`, `parallel apply`, and `table synchronization`.                                                 |
| `pid` `integer`Process ID of the subscription worker process                                                                                                                            |
| `leader_pid` `integer`Process ID of the leader apply worker if this process is a parallel apply worker; NULL if this process is a leader apply worker or a table synchronization worker |
| `relid` `oid`OID of the relation that the worker is synchronizing; NULL for the leader apply worker and parallel apply workers                                                          |
| `received_lsn` `pg_lsn`Last write-ahead log location received, the initial value of this field being 0; NULL for parallel apply workers                                                 |
| `last_msg_send_time` `timestamp with time zone`Send time of last message received from origin WAL sender; NULL for parallel apply workers                                               |
| `last_msg_receipt_time` `timestamp with time zone`Receipt time of last message received from origin WAL sender; NULL for parallel apply workers                                         |
| `latest_end_lsn` `pg_lsn`Last write-ahead log location reported to origin WAL sender; NULL for parallel apply workers                                                                   |
| `latest_end_time` `timestamp with time zone`Time of last write-ahead log location reported to origin WAL sender; NULL for parallel apply workers                                        |

### 28.2.9. `pg_stat_subscription_stats` [#](#MONITORING-PG-STAT-SUBSCRIPTION-STATS)

The `pg_stat_subscription_stats` view will contain one row per subscription.

**Table 28.19. `pg_stat_subscription_stats` View**

| Column TypeDescription                                                                                |
| ----------------------------------------------------------------------------------------------------- |
| `subid` `oid`OID of the subscription                                                                  |
| `subname` `name`Name of the subscription                                                              |
| `apply_error_count` `bigint`Number of times an error occurred while applying changes                  |
| `sync_error_count` `bigint`Number of times an error occurred during the initial table synchronization |
| `stats_reset` `timestamp with time zone`Time at which these statistics were last reset                |

### 28.2.10. `pg_stat_ssl` [#](#MONITORING-PG-STAT-SSL-VIEW)

The `pg_stat_ssl` view will contain one row per backend or WAL sender process, showing statistics about SSL usage on this connection. It can be joined to `pg_stat_activity` or `pg_stat_replication` on the `pid` column to get more details about the connection.

**Table 28.20. `pg_stat_ssl` View**

| Column TypeDescription                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pid` `integer`Process ID of a backend or WAL sender process                                                                                                                                                                                                                                                             |
| `ssl` `boolean`True if SSL is used on this connection                                                                                                                                                                                                                                                                    |
| `version` `text`Version of SSL in use, or NULL if SSL is not in use on this connection                                                                                                                                                                                                                                   |
| `cipher` `text`Name of SSL cipher in use, or NULL if SSL is not in use on this connection                                                                                                                                                                                                                                |
| `bits` `integer`Number of bits in the encryption algorithm used, or NULL if SSL is not used on this connection                                                                                                                                                                                                           |
| `client_dn` `text`Distinguished Name (DN) field from the client certificate used, or NULL if no client certificate was supplied or if SSL is not in use on this connection. This field is truncated if the DN field is longer than `NAMEDATALEN` (64 characters in a standard build).                                    |
| `client_serial` `numeric`Serial number of the client certificate, or NULL if no client certificate was supplied or if SSL is not in use on this connection. The combination of certificate serial number and certificate issuer uniquely identifies a certificate (unless the issuer erroneously reuses serial numbers). |
| `issuer_dn` `text`DN of the issuer of the client certificate, or NULL if no client certificate was supplied or if SSL is not in use on this connection. This field is truncated like `client_dn`.                                                                                                                        |

### 28.2.11. `pg_stat_gssapi` [#](#MONITORING-PG-STAT-GSSAPI-VIEW)

The `pg_stat_gssapi` view will contain one row per backend, showing information about GSSAPI usage on this connection. It can be joined to `pg_stat_activity` or `pg_stat_replication` on the `pid` column to get more details about the connection.

**Table 28.21. `pg_stat_gssapi` View**

| Column TypeDescription                                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pid` `integer`Process ID of a backend                                                                                                                                                                                                       |
| `gss_authenticated` `boolean`True if GSSAPI authentication was used for this connection                                                                                                                                                      |
| `principal` `text`Principal used to authenticate this connection, or NULL if GSSAPI was not used to authenticate this connection. This field is truncated if the principal is longer than `NAMEDATALEN` (64 characters in a standard build). |
| `encrypted` `boolean`True if GSSAPI encryption is in use on this connection                                                                                                                                                                  |
| `credentials_delegated` `boolean`True if GSSAPI credentials were delegated on this connection.                                                                                                                                               |

### 28.2.12. `pg_stat_archiver` [#](#MONITORING-PG-STAT-ARCHIVER-VIEW)

The `pg_stat_archiver` view will always have a single row, containing data about the archiver process of the cluster.

**Table 28.22. `pg_stat_archiver` View**

| Column TypeDescription                                                                              |
| --------------------------------------------------------------------------------------------------- |
| `archived_count` `bigint`Number of WAL files that have been successfully archived                   |
| `last_archived_wal` `text`Name of the WAL file most recently successfully archived                  |
| `last_archived_time` `timestamp with time zone`Time of the most recent successful archive operation |
| `failed_count` `bigint`Number of failed attempts for archiving WAL files                            |
| `last_failed_wal` `text`Name of the WAL file of the most recent failed archival operation           |
| `last_failed_time` `timestamp with time zone`Time of the most recent failed archival operation      |
| `stats_reset` `timestamp with time zone`Time at which these statistics were last reset              |

\

Normally, WAL files are archived in order, oldest to newest, but that is not guaranteed, and does not hold under special circumstances like when promoting a standby or after crash recovery. Therefore it is not safe to assume that all files older than `last_archived_wal` have also been successfully archived.

### 28.2.13. `pg_stat_io` [#](#MONITORING-PG-STAT-IO-VIEW)

The `pg_stat_io` view will contain one row for each combination of backend type, target I/O object, and I/O context, showing cluster-wide I/O statistics. Combinations which do not make sense are omitted.

Currently, I/O on relations (e.g. tables, indexes) is tracked. However, relation I/O which bypasses shared buffers (e.g. when moving a table from one tablespace to another) is currently not tracked.

**Table 28.23. `pg_stat_io` View**

| Column TypeDescription                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `backend_type` `text`Type of backend (e.g. background worker, autovacuum worker). See [`pg_stat_activity`](monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW "28.2.3. pg_stat_activity") for more information on `backend_type`s. Some `backend_type`s do not accumulate I/O operation statistics and will not be included in the view.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `object` `text`Target object of an I/O operation. Possible values are:*   `relation`: Permanent relations.

* `temp relation`: Temporary relations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `context` `text`The context of an I/O operation. Possible values are:*   `normal`: The default or standard `context` for a type of I/O operation. For example, by default, relation data is read into and written out from shared buffers. Thus, reads and writes of relation data to and from shared buffers are tracked in `context` `normal`.
* `vacuum`: I/O operations performed outside of shared buffers while vacuuming and analyzing permanent relations. Temporary table vacuums use the same local buffer pool as other temporary table IO operations and are tracked in `context` `normal`.
* `bulkread`: Certain large read I/O operations done outside of shared buffers, for example, a sequential scan of a large table.
* `bulkwrite`: Certain large write I/O operations done outside of shared buffers, such as `COPY`. |
| `reads` `bigint`Number of read operations, each of the size specified in `op_bytes`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `read_time` `double precision`Time spent in read operations in milliseconds (if [track\_io\_timing](runtime-config-statistics.html#GUC-TRACK-IO-TIMING) is enabled, otherwise zero)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `writes` `bigint`Number of write operations, each of the size specified in `op_bytes`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `write_time` `double precision`Time spent in write operations in milliseconds (if [track\_io\_timing](runtime-config-statistics.html#GUC-TRACK-IO-TIMING) is enabled, otherwise zero)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `writebacks` `bigint`Number of units of size `op_bytes` which the process requested the kernel write out to permanent storage.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `writeback_time` `double precision`Time spent in writeback operations in milliseconds (if [track\_io\_timing](runtime-config-statistics.html#GUC-TRACK-IO-TIMING) is enabled, otherwise zero). This includes the time spent queueing write-out requests and, potentially, the time spent to write out the dirty data.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `extends` `bigint`Number of relation extend operations, each of the size specified in `op_bytes`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `extend_time` `double precision`Time spent in extend operations in milliseconds (if [track\_io\_timing](runtime-config-statistics.html#GUC-TRACK-IO-TIMING) is enabled, otherwise zero)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `op_bytes` `bigint`The number of bytes per unit of I/O read, written, or extended.Relation data reads, writes, and extends are done in `block_size` units, derived from the build-time parameter `BLCKSZ`, which is `8192` by default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `hits` `bigint`The number of times a desired block was found in a shared buffer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `evictions` `bigint`Number of times a block has been written out from a shared or local buffer in order to make it available for another use.In `context` `normal`, this counts the number of times a block was evicted from a buffer and replaced with another block. In `context`s `bulkwrite`, `bulkread`, and `vacuum`, this counts the number of times a block was evicted from shared buffers in order to add the shared buffer to a separate, size-limited ring buffer for use in a bulk I/O operation.                                                                                                                                                                                                                                                                                                                                   |
| `reuses` `bigint`The number of times an existing buffer in a size-limited ring buffer outside of shared buffers was reused as part of an I/O operation in the `bulkread`, `bulkwrite`, or `vacuum` `context`s.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `fsyncs` `bigint`Number of `fsync` calls. These are only tracked in `context` `normal`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `fsync_time` `double precision`Time spent in fsync operations in milliseconds (if [track\_io\_timing](runtime-config-statistics.html#GUC-TRACK-IO-TIMING) is enabled, otherwise zero)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `stats_reset` `timestamp with time zone`Time at which these statistics were last reset.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

\

Some backend types never perform I/O operations on some I/O objects and/or in some I/O contexts. These rows are omitted from the view. For example, the checkpointer does not checkpoint temporary tables, so there will be no rows for `backend_type` `checkpointer` and `object` `temp relation`.

In addition, some I/O operations will never be performed either by certain backend types or on certain I/O objects and/or in certain I/O contexts. These cells will be NULL. For example, temporary tables are not `fsync`ed, so `fsyncs` will be NULL for `object` `temp relation`. Also, the background writer does not perform reads, so `reads` will be NULL in rows for `backend_type` `background writer`.

`pg_stat_io` can be used to inform database tuning. For example:

* A high `evictions` count can indicate that shared buffers should be increased.
* Client backends rely on the checkpointer to ensure data is persisted to permanent storage. Large numbers of `fsyncs` by `client backend`s could indicate a misconfiguration of shared buffers or of the checkpointer. More information on configuring the checkpointer can be found in [Section 30.5](wal-configuration.html "30.5. WAL Configuration").
* Normally, client backends should be able to rely on auxiliary processes like the checkpointer and the background writer to write out dirty data as much as possible. Large numbers of writes by client backends could indicate a misconfiguration of shared buffers or of the checkpointer. More information on configuring the checkpointer can be found in [Section 30.5](wal-configuration.html "30.5. WAL Configuration").

### Note

Columns tracking I/O time will only be non-zero when [track\_io\_timing](runtime-config-statistics.html#GUC-TRACK-IO-TIMING) is enabled. The user should be careful when referencing these columns in combination with their corresponding IO operations in case `track_io_timing` was not enabled for the entire time since the last stats reset.

### 28.2.14. `pg_stat_bgwriter` [#](#MONITORING-PG-STAT-BGWRITER-VIEW)

The `pg_stat_bgwriter` view will always have a single row, containing global data for the cluster.

**Table 28.24. `pg_stat_bgwriter` View**

| Column TypeDescription                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `checkpoints_timed` `bigint`Number of scheduled checkpoints that have been performed                                                                                                  |
| `checkpoints_req` `bigint`Number of requested checkpoints that have been performed                                                                                                    |
| `checkpoint_write_time` `double precision`Total amount of time that has been spent in the portion of checkpoint processing where files are written to disk, in milliseconds           |
| `checkpoint_sync_time` `double precision`Total amount of time that has been spent in the portion of checkpoint processing where files are synchronized to disk, in milliseconds       |
| `buffers_checkpoint` `bigint`Number of buffers written during checkpoints                                                                                                             |
| `buffers_clean` `bigint`Number of buffers written by the background writer                                                                                                            |
| `maxwritten_clean` `bigint`Number of times the background writer stopped a cleaning scan because it had written too many buffers                                                      |
| `buffers_backend` `bigint`Number of buffers written directly by a backend                                                                                                             |
| `buffers_backend_fsync` `bigint`Number of times a backend had to execute its own `fsync` call (normally the background writer handles those even when the backend does its own write) |
| `buffers_alloc` `bigint`Number of buffers allocated                                                                                                                                   |
| `stats_reset` `timestamp with time zone`Time at which these statistics were last reset                                                                                                |

### 28.2.15. `pg_stat_wal` [#](#MONITORING-PG-STAT-WAL-VIEW)

The `pg_stat_wal` view will always have a single row, containing data about WAL activity of the cluster.

**Table 28.25. `pg_stat_wal` View**

| Column TypeDescription                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `wal_records` `bigint`Total number of WAL records generated                                                                                                                                                                                                                                                                                                                                                                                        |
| `wal_fpi` `bigint`Total number of WAL full page images generated                                                                                                                                                                                                                                                                                                                                                                                   |
| `wal_bytes` `numeric`Total amount of WAL generated in bytes                                                                                                                                                                                                                                                                                                                                                                                        |
| `wal_buffers_full` `bigint`Number of times WAL data was written to disk because WAL buffers became full                                                                                                                                                                                                                                                                                                                                            |
| `wal_write` `bigint`Number of times WAL buffers were written out to disk via `XLogWrite` request. See [Section 30.5](wal-configuration.html "30.5. WAL Configuration") for more information about the internal WAL function `XLogWrite`.                                                                                                                                                                                                           |
| `wal_sync` `bigint`Number of times WAL files were synced to disk via `issue_xlog_fsync` request (if [fsync](runtime-config-wal.html#GUC-FSYNC) is `on` and [wal\_sync\_method](runtime-config-wal.html#GUC-WAL-SYNC-METHOD) is either `fdatasync`, `fsync` or `fsync_writethrough`, otherwise zero). See [Section 30.5](wal-configuration.html "30.5. WAL Configuration") for more information about the internal WAL function `issue_xlog_fsync`. |
| `wal_write_time` `double precision`Total amount of time spent writing WAL buffers to disk via `XLogWrite` request, in milliseconds (if [track\_wal\_io\_timing](runtime-config-statistics.html#GUC-TRACK-WAL-IO-TIMING) is enabled, otherwise zero). This includes the sync time when `wal_sync_method` is either `open_datasync` or `open_sync`.                                                                                                  |
| `wal_sync_time` `double precision`Total amount of time spent syncing WAL files to disk via `issue_xlog_fsync` request, in milliseconds (if `track_wal_io_timing` is enabled, `fsync` is `on`, and `wal_sync_method` is either `fdatasync`, `fsync` or `fsync_writethrough`, otherwise zero).                                                                                                                                                       |
| `stats_reset` `timestamp with time zone`Time at which these statistics were last reset                                                                                                                                                                                                                                                                                                                                                             |

### 28.2.16. `pg_stat_database` [#](#MONITORING-PG-STAT-DATABASE-VIEW)

The `pg_stat_database` view will contain one row for each database in the cluster, plus one for shared objects, showing database-wide statistics.

**Table 28.26. `pg_stat_database` View**

| Column TypeDescription                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `datid` `oid`OID of this database, or 0 for objects belonging to a shared relation                                                                                                                                                                                                                                            |
| `datname` `name`Name of this database, or `NULL` for shared objects.                                                                                                                                                                                                                                                          |
| `numbackends` `integer`Number of backends currently connected to this database, or `NULL` for shared objects. This is the only column in this view that returns a value reflecting current state; all other columns return the accumulated values since the last reset.                                                       |
| `xact_commit` `bigint`Number of transactions in this database that have been committed                                                                                                                                                                                                                                        |
| `xact_rollback` `bigint`Number of transactions in this database that have been rolled back                                                                                                                                                                                                                                    |
| `blks_read` `bigint`Number of disk blocks read in this database                                                                                                                                                                                                                                                               |
| `blks_hit` `bigint`Number of times disk blocks were found already in the buffer cache, so that a read was not necessary (this only includes hits in the PostgreSQL buffer cache, not the operating system's file system cache)                                                                                                |
| `tup_returned` `bigint`Number of live rows fetched by sequential scans and index entries returned by index scans in this database                                                                                                                                                                                             |
| `tup_fetched` `bigint`Number of live rows fetched by index scans in this database                                                                                                                                                                                                                                             |
| `tup_inserted` `bigint`Number of rows inserted by queries in this database                                                                                                                                                                                                                                                    |
| `tup_updated` `bigint`Number of rows updated by queries in this database                                                                                                                                                                                                                                                      |
| `tup_deleted` `bigint`Number of rows deleted by queries in this database                                                                                                                                                                                                                                                      |
| `conflicts` `bigint`Number of queries canceled due to conflicts with recovery in this database. (Conflicts occur only on standby servers; see [`pg_stat_database_conflicts`](monitoring-stats.html#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW "28.2.17. pg_stat_database_conflicts") for details.)                            |
| `temp_files` `bigint`Number of temporary files created by queries in this database. All temporary files are counted, regardless of why the temporary file was created (e.g., sorting or hashing), and regardless of the [log\_temp\_files](runtime-config-logging.html#GUC-LOG-TEMP-FILES) setting.                           |
| `temp_bytes` `bigint`Total amount of data written to temporary files by queries in this database. All temporary files are counted, regardless of why the temporary file was created, and regardless of the [log\_temp\_files](runtime-config-logging.html#GUC-LOG-TEMP-FILES) setting.                                        |
| `deadlocks` `bigint`Number of deadlocks detected in this database                                                                                                                                                                                                                                                             |
| `checksum_failures` `bigint`Number of data page checksum failures detected in this database (or on a shared object), or NULL if data checksums are not enabled.                                                                                                                                                               |
| `checksum_last_failure` `timestamp with time zone`Time at which the last data page checksum failure was detected in this database (or on a shared object), or NULL if data checksums are not enabled.                                                                                                                         |
| `blk_read_time` `double precision`Time spent reading data file blocks by backends in this database, in milliseconds (if [track\_io\_timing](runtime-config-statistics.html#GUC-TRACK-IO-TIMING) is enabled, otherwise zero)                                                                                                   |
| `blk_write_time` `double precision`Time spent writing data file blocks by backends in this database, in milliseconds (if [track\_io\_timing](runtime-config-statistics.html#GUC-TRACK-IO-TIMING) is enabled, otherwise zero)                                                                                                  |
| `session_time` `double precision`Time spent by database sessions in this database, in milliseconds (note that statistics are only updated when the state of a session changes, so if sessions have been idle for a long time, this idle time won't be included)                                                               |
| `active_time` `double precision`Time spent executing SQL statements in this database, in milliseconds (this corresponds to the states `active` and `fastpath function call` in [`pg_stat_activity`](monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW "28.2.3. pg_stat_activity"))                                       |
| `idle_in_transaction_time` `double precision`Time spent idling while in a transaction in this database, in milliseconds (this corresponds to the states `idle in transaction` and `idle in transaction (aborted)` in [`pg_stat_activity`](monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW "28.2.3. pg_stat_activity")) |
| `sessions` `bigint`Total number of sessions established to this database                                                                                                                                                                                                                                                      |
| `sessions_abandoned` `bigint`Number of database sessions to this database that were terminated because connection to the client was lost                                                                                                                                                                                      |
| `sessions_fatal` `bigint`Number of database sessions to this database that were terminated by fatal errors                                                                                                                                                                                                                    |
| `sessions_killed` `bigint`Number of database sessions to this database that were terminated by operator intervention                                                                                                                                                                                                          |
| `stats_reset` `timestamp with time zone`Time at which these statistics were last reset                                                                                                                                                                                                                                        |

### 28.2.17. `pg_stat_database_conflicts` [#](#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW)

The `pg_stat_database_conflicts` view will contain one row per database, showing database-wide statistics about query cancels occurring due to conflicts with recovery on standby servers. This view will only contain information on standby servers, since conflicts do not occur on primary servers.

**Table 28.27. `pg_stat_database_conflicts` View**

| Column TypeDescription                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `datid` `oid`OID of a database                                                                                                                                                                                   |
| `datname` `name`Name of this database                                                                                                                                                                            |
| `confl_tablespace` `bigint`Number of queries in this database that have been canceled due to dropped tablespaces                                                                                                 |
| `confl_lock` `bigint`Number of queries in this database that have been canceled due to lock timeouts                                                                                                             |
| `confl_snapshot` `bigint`Number of queries in this database that have been canceled due to old snapshots                                                                                                         |
| `confl_bufferpin` `bigint`Number of queries in this database that have been canceled due to pinned buffers                                                                                                       |
| `confl_deadlock` `bigint`Number of queries in this database that have been canceled due to deadlocks                                                                                                             |
| `confl_active_logicalslot` `bigint`Number of uses of logical slots in this database that have been canceled due to old snapshots or too low a [wal\_level](runtime-config-wal.html#GUC-WAL-LEVEL) on the primary |

### 28.2.18. `pg_stat_all_tables` [#](#MONITORING-PG-STAT-ALL-TABLES-VIEW)

The `pg_stat_all_tables` view will contain one row for each table in the current database (including TOAST tables), showing statistics about accesses to that specific table. The `pg_stat_user_tables` and `pg_stat_sys_tables` views contain the same information, but filtered to only show user and system tables respectively.

**Table 28.28. `pg_stat_all_tables` View**

| Column TypeDescription                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `relid` `oid`OID of a table                                                                                                                                                                                                                                                                                              |
| `schemaname` `name`Name of the schema that this table is in                                                                                                                                                                                                                                                              |
| `relname` `name`Name of this table                                                                                                                                                                                                                                                                                       |
| `seq_scan` `bigint`Number of sequential scans initiated on this table                                                                                                                                                                                                                                                    |
| `last_seq_scan` `timestamp with time zone`The time of the last sequential scan on this table, based on the most recent transaction stop time                                                                                                                                                                             |
| `seq_tup_read` `bigint`Number of live rows fetched by sequential scans                                                                                                                                                                                                                                                   |
| `idx_scan` `bigint`Number of index scans initiated on this table                                                                                                                                                                                                                                                         |
| `last_idx_scan` `timestamp with time zone`The time of the last index scan on this table, based on the most recent transaction stop time                                                                                                                                                                                  |
| `idx_tup_fetch` `bigint`Number of live rows fetched by index scans                                                                                                                                                                                                                                                       |
| `n_tup_ins` `bigint`Total number of rows inserted                                                                                                                                                                                                                                                                        |
| `n_tup_upd` `bigint`Total number of rows updated. (This includes row updates counted in `n_tup_hot_upd` and `n_tup_newpage_upd`, and remaining non-HOT updates.)                                                                                                                                                         |
| `n_tup_del` `bigint`Total number of rows deleted                                                                                                                                                                                                                                                                         |
| `n_tup_hot_upd` `bigint`Number of rows [HOT updated](storage-hot.html "73.7. Heap-Only Tuples (HOT)"). These are updates where no successor versions are required in indexes.                                                                                                                                            |
| `n_tup_newpage_upd` `bigint`Number of rows updated where the successor version goes onto a *new* heap page, leaving behind an original version with a [`t_ctid` field](storage-page-layout.html#STORAGE-TUPLE-LAYOUT "73.6.1. Table Row Layout") that points to a different heap page. These are always non-HOT updates. |
| `n_live_tup` `bigint`Estimated number of live rows                                                                                                                                                                                                                                                                       |
| `n_dead_tup` `bigint`Estimated number of dead rows                                                                                                                                                                                                                                                                       |
| `n_mod_since_analyze` `bigint`Estimated number of rows modified since this table was last analyzed                                                                                                                                                                                                                       |
| `n_ins_since_vacuum` `bigint`Estimated number of rows inserted since this table was last vacuumed                                                                                                                                                                                                                        |
| `last_vacuum` `timestamp with time zone`Last time at which this table was manually vacuumed (not counting `VACUUM FULL`)                                                                                                                                                                                                 |
| `last_autovacuum` `timestamp with time zone`Last time at which this table was vacuumed by the autovacuum daemon                                                                                                                                                                                                          |
| `last_analyze` `timestamp with time zone`Last time at which this table was manually analyzed                                                                                                                                                                                                                             |
| `last_autoanalyze` `timestamp with time zone`Last time at which this table was analyzed by the autovacuum daemon                                                                                                                                                                                                         |
| `vacuum_count` `bigint`Number of times this table has been manually vacuumed (not counting `VACUUM FULL`)                                                                                                                                                                                                                |
| `autovacuum_count` `bigint`Number of times this table has been vacuumed by the autovacuum daemon                                                                                                                                                                                                                         |
| `analyze_count` `bigint`Number of times this table has been manually analyzed                                                                                                                                                                                                                                            |
| `autoanalyze_count` `bigint`Number of times this table has been analyzed by the autovacuum daemon                                                                                                                                                                                                                        |

### 28.2.19. `pg_stat_all_indexes` [#](#MONITORING-PG-STAT-ALL-INDEXES-VIEW)

The `pg_stat_all_indexes` view will contain one row for each index in the current database, showing statistics about accesses to that specific index. The `pg_stat_user_indexes` and `pg_stat_sys_indexes` views contain the same information, but filtered to only show user and system indexes respectively.

**Table 28.29. `pg_stat_all_indexes` View**

| Column TypeDescription                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------- |
| `relid` `oid`OID of the table for this index                                                                                      |
| `indexrelid` `oid`OID of this index                                                                                               |
| `schemaname` `name`Name of the schema this index is in                                                                            |
| `relname` `name`Name of the table for this index                                                                                  |
| `indexrelname` `name`Name of this index                                                                                           |
| `idx_scan` `bigint`Number of index scans initiated on this index                                                                  |
| `last_idx_scan` `timestamp with time zone`The time of the last scan on this index, based on the most recent transaction stop time |
| `idx_tup_read` `bigint`Number of index entries returned by scans on this index                                                    |
| `idx_tup_fetch` `bigint`Number of live table rows fetched by simple index scans using this index                                  |

\

Indexes can be used by simple index scans, “bitmap” index scans, and the optimizer. In a bitmap scan the output of several indexes can be combined via AND or OR rules, so it is difficult to associate individual heap row fetches with specific indexes when a bitmap scan is used. Therefore, a bitmap scan increments the `pg_stat_all_indexes`.`idx_tup_read` count(s) for the index(es) it uses, and it increments the `pg_stat_all_tables`.`idx_tup_fetch` count for the table, but it does not affect `pg_stat_all_indexes`.`idx_tup_fetch`. The optimizer also accesses indexes to check for supplied constants whose values are outside the recorded range of the optimizer statistics because the optimizer statistics might be stale.

### Note

The `idx_tup_read` and `idx_tup_fetch` counts can be different even without any use of bitmap scans, because `idx_tup_read` counts index entries retrieved from the index while `idx_tup_fetch` counts live rows fetched from the table. The latter will be less if any dead or not-yet-committed rows are fetched using the index, or if any heap fetches are avoided by means of an index-only scan.

### 28.2.20. `pg_statio_all_tables` [#](#MONITORING-PG-STATIO-ALL-TABLES-VIEW)

The `pg_statio_all_tables` view will contain one row for each table in the current database (including TOAST tables), showing statistics about I/O on that specific table. The `pg_statio_user_tables` and `pg_statio_sys_tables` views contain the same information, but filtered to only show user and system tables respectively.

**Table 28.30. `pg_statio_all_tables` View**

| Column TypeDescription                                                                             |
| -------------------------------------------------------------------------------------------------- |
| `relid` `oid`OID of a table                                                                        |
| `schemaname` `name`Name of the schema that this table is in                                        |
| `relname` `name`Name of this table                                                                 |
| `heap_blks_read` `bigint`Number of disk blocks read from this table                                |
| `heap_blks_hit` `bigint`Number of buffer hits in this table                                        |
| `idx_blks_read` `bigint`Number of disk blocks read from all indexes on this table                  |
| `idx_blks_hit` `bigint`Number of buffer hits in all indexes on this table                          |
| `toast_blks_read` `bigint`Number of disk blocks read from this table's TOAST table (if any)        |
| `toast_blks_hit` `bigint`Number of buffer hits in this table's TOAST table (if any)                |
| `tidx_blks_read` `bigint`Number of disk blocks read from this table's TOAST table indexes (if any) |
| `tidx_blks_hit` `bigint`Number of buffer hits in this table's TOAST table indexes (if any)         |

### 28.2.21. `pg_statio_all_indexes` [#](#MONITORING-PG-STATIO-ALL-INDEXES-VIEW)

The `pg_statio_all_indexes` view will contain one row for each index in the current database, showing statistics about I/O on that specific index. The `pg_statio_user_indexes` and `pg_statio_sys_indexes` views contain the same information, but filtered to only show user and system indexes respectively.

**Table 28.31. `pg_statio_all_indexes` View**

| Column TypeDescription                                             |
| ------------------------------------------------------------------ |
| `relid` `oid`OID of the table for this index                       |
| `indexrelid` `oid`OID of this index                                |
| `schemaname` `name`Name of the schema this index is in             |
| `relname` `name`Name of the table for this index                   |
| `indexrelname` `name`Name of this index                            |
| `idx_blks_read` `bigint`Number of disk blocks read from this index |
| `idx_blks_hit` `bigint`Number of buffer hits in this index         |

### 28.2.22. `pg_statio_all_sequences` [#](#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW)

The `pg_statio_all_sequences` view will contain one row for each sequence in the current database, showing statistics about I/O on that specific sequence.

**Table 28.32. `pg_statio_all_sequences` View**

| Column TypeDescription                                            |
| ----------------------------------------------------------------- |
| `relid` `oid`OID of a sequence                                    |
| `schemaname` `name`Name of the schema this sequence is in         |
| `relname` `name`Name of this sequence                             |
| `blks_read` `bigint`Number of disk blocks read from this sequence |
| `blks_hit` `bigint`Number of buffer hits in this sequence         |

### 28.2.23. `pg_stat_user_functions` [#](#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW)

The `pg_stat_user_functions` view will contain one row for each tracked function, showing statistics about executions of that function. The [track\_functions](runtime-config-statistics.html#GUC-TRACK-FUNCTIONS) parameter controls exactly which functions are tracked.

**Table 28.33. `pg_stat_user_functions` View**

| Column TypeDescription                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------- |
| `funcid` `oid`OID of a function                                                                                                     |
| `schemaname` `name`Name of the schema this function is in                                                                           |
| `funcname` `name`Name of this function                                                                                              |
| `calls` `bigint`Number of times this function has been called                                                                       |
| `total_time` `double precision`Total time spent in this function and all other functions called by it, in milliseconds              |
| `self_time` `double precision`Total time spent in this function itself, not including other functions called by it, in milliseconds |

### 28.2.24. `pg_stat_slru` [#](#MONITORING-PG-STAT-SLRU-VIEW)

PostgreSQL accesses certain on-disk information via *SLRU* (simple least-recently-used) caches. The `pg_stat_slru` view will contain one row for each tracked SLRU cache, showing statistics about access to cached pages.

**Table 28.34. `pg_stat_slru` View**

| Column TypeDescription                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` `text`Name of the SLRU                                                                                                                                                                       |
| `blks_zeroed` `bigint`Number of blocks zeroed during initializations                                                                                                                                |
| `blks_hit` `bigint`Number of times disk blocks were found already in the SLRU, so that a read was not necessary (this only includes hits in the SLRU, not the operating system's file system cache) |
| `blks_read` `bigint`Number of disk blocks read for this SLRU                                                                                                                                        |
| `blks_written` `bigint`Number of disk blocks written for this SLRU                                                                                                                                  |
| `blks_exists` `bigint`Number of blocks checked for existence for this SLRU                                                                                                                          |
| `flushes` `bigint`Number of flushes of dirty data for this SLRU                                                                                                                                     |
| `truncates` `bigint`Number of truncates for this SLRU                                                                                                                                               |
| `stats_reset` `timestamp with time zone`Time at which these statistics were last reset                                                                                                              |

### 28.2.25. Statistics Functions [#](#MONITORING-STATS-FUNCTIONS)

Other ways of looking at the statistics can be set up by writing queries that use the same underlying statistics access functions used by the standard views shown above. For details such as the functions' names, consult the definitions of the standard views. (For example, in psql you could issue `\d+ pg_stat_activity`.) The access functions for per-database statistics take a database OID as an argument to identify which database to report on. The per-table and per-index functions take a table or index OID. The functions for per-function statistics take a function OID. Note that only tables, indexes, and functions in the current database can be seen with these functions.

Additional functions related to the cumulative statistics system are listed in [Table 28.35](monitoring-stats.html#MONITORING-STATS-FUNCS-TABLE "Table 28.35. Additional Statistics Functions").

**Table 28.35. Additional Statistics Functions**

| FunctionDescription                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pg_backend_pid` () → `integer`Returns the process ID of the server process attached to the current session.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `pg_stat_get_activity` ( `integer` ) → `setof record`Returns a record of information about the backend with the specified process ID, or one record for each active backend in the system if `NULL` is specified. The fields returned are a subset of those in the `pg_stat_activity` view.                                                                                                                                                                                                                                                                                                                                                                                   |
| `pg_stat_get_snapshot_timestamp` () → `timestamp with time zone`Returns the timestamp of the current statistics snapshot, or NULL if no statistics snapshot has been taken. A snapshot is taken the first time cumulative statistics are accessed in a transaction if `stats_fetch_consistency` is set to `snapshot`                                                                                                                                                                                                                                                                                                                                                          |
| `pg_stat_get_xact_blocks_fetched` ( `oid` ) → `bigint`Returns the number of block read requests for table or index, in the current transaction. This number minus `pg_stat_get_xact_blocks_hit` gives the number of kernel `read()` calls; the number of actual physical reads is usually lower due to kernel-level buffering.                                                                                                                                                                                                                                                                                                                                                |
| `pg_stat_get_xact_blocks_hit` ( `oid` ) → `bigint`Returns the number of block read requests for table or index, in the current transaction, found in cache (not triggering kernel `read()` calls).                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `pg_stat_clear_snapshot` () → `void`Discards the current statistics snapshot or cached information.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `pg_stat_reset` () → `void`Resets all statistics counters for the current database to zero.This function is restricted to superusers by default, but other users can be granted EXECUTE to run the function.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `pg_stat_reset_shared` ( `text` ) → `void`Resets some cluster-wide statistics counters to zero, depending on the argument. The argument can be `bgwriter` to reset all the counters shown in the `pg_stat_bgwriter` view, `archiver` to reset all the counters shown in the `pg_stat_archiver` view, `io` to reset all the counters shown in the `pg_stat_io` view, `wal` to reset all the counters shown in the `pg_stat_wal` view or `recovery_prefetch` to reset all the counters shown in the `pg_stat_recovery_prefetch` view\.This function is restricted to superusers by default, but other users can be granted EXECUTE to run the function.                         |
| `pg_stat_reset_single_table_counters` ( `oid` ) → `void`Resets statistics for a single table or index in the current database or shared across all databases in the cluster to zero.This function is restricted to superusers by default, but other users can be granted EXECUTE to run the function.                                                                                                                                                                                                                                                                                                                                                                         |
| `pg_stat_reset_single_function_counters` ( `oid` ) → `void`Resets statistics for a single function in the current database to zero.This function is restricted to superusers by default, but other users can be granted EXECUTE to run the function.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `pg_stat_reset_slru` ( `text` ) → `void`Resets statistics to zero for a single SLRU cache, or for all SLRUs in the cluster. If the argument is NULL, all counters shown in the `pg_stat_slru` view for all SLRU caches are reset. The argument can be one of `CommitTs`, `MultiXactMember`, `MultiXactOffset`, `Notify`, `Serial`, `Subtrans`, or `Xact` to reset the counters for only that entry. If the argument is `other` (or indeed, any unrecognized name), then the counters for all other SLRU caches, such as extension-defined caches, are reset.This function is restricted to superusers by default, but other users can be granted EXECUTE to run the function. |
| `pg_stat_reset_replication_slot` ( `text` ) → `void`Resets statistics of the replication slot defined by the argument. If the argument is `NULL`, resets statistics for all the replication slots.This function is restricted to superusers by default, but other users can be granted EXECUTE to run the function.                                                                                                                                                                                                                                                                                                                                                           |
| `pg_stat_reset_subscription_stats` ( `oid` ) → `void`Resets statistics for a single subscription shown in the `pg_stat_subscription_stats` view to zero. If the argument is `NULL`, reset statistics for all subscriptions.This function is restricted to superusers by default, but other users can be granted EXECUTE to run the function.                                                                                                                                                                                                                                                                                                                                  |

\

### Warning

Using `pg_stat_reset()` also resets counters that autovacuum uses to determine when to trigger a vacuum or an analyze. Resetting these counters can cause autovacuum to not perform necessary work, which can cause problems such as table bloat or out-dated table statistics. A database-wide `ANALYZE` is recommended after the statistics have been reset.

`pg_stat_get_activity`, the underlying function of the `pg_stat_activity` view, returns a set of records containing all the available information about each backend process. Sometimes it may be more convenient to obtain just a subset of this information. In such cases, another set of per-backend statistics access functions can be used; these are shown in [Table 28.36](monitoring-stats.html#MONITORING-STATS-BACKEND-FUNCS-TABLE "Table 28.36. Per-Backend Statistics Functions"). These access functions use the session's backend ID number, which is a small positive integer that is distinct from the backend ID of any concurrent session, although a session's ID can be recycled as soon as it exits. The backend ID is used, among other things, to identify the session's temporary schema if it has one. The function `pg_stat_get_backend_idset` provides a convenient way to list all the active backends' ID numbers for invoking these functions. For example, to show the PIDs and current queries of all backends:

```

SELECT pg_stat_get_backend_pid(backendid) AS pid,
       pg_stat_get_backend_activity(backendid) AS query
FROM pg_stat_get_backend_idset() AS backendid;
```

**Table 28.36. Per-Backend Statistics Functions**

| FunctionDescription                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pg_stat_get_backend_activity` ( `integer` ) → `text`Returns the text of this backend's most recent query.                                                                                                                                                                                                                                                                                |
| `pg_stat_get_backend_activity_start` ( `integer` ) → `timestamp with time zone`Returns the time when the backend's most recent query was started.                                                                                                                                                                                                                                         |
| `pg_stat_get_backend_client_addr` ( `integer` ) → `inet`Returns the IP address of the client connected to this backend.                                                                                                                                                                                                                                                                   |
| `pg_stat_get_backend_client_port` ( `integer` ) → `integer`Returns the TCP port number that the client is using for communication.                                                                                                                                                                                                                                                        |
| `pg_stat_get_backend_dbid` ( `integer` ) → `oid`Returns the OID of the database this backend is connected to.                                                                                                                                                                                                                                                                             |
| `pg_stat_get_backend_idset` () → `setof integer`Returns the set of currently active backend ID numbers.                                                                                                                                                                                                                                                                                   |
| `pg_stat_get_backend_pid` ( `integer` ) → `integer`Returns the process ID of this backend.                                                                                                                                                                                                                                                                                                |
| `pg_stat_get_backend_start` ( `integer` ) → `timestamp with time zone`Returns the time when this process was started.                                                                                                                                                                                                                                                                     |
| `pg_stat_get_backend_subxact` ( `integer` ) → `record`Returns a record of information about the subtransactions of the backend with the specified ID. The fields returned are *`subxact_count`*, which is the number of subtransactions in the backend's subtransaction cache, and *`subxact_overflow`*, which indicates whether the backend's subtransaction cache is overflowed or not. |
| `pg_stat_get_backend_userid` ( `integer` ) → `oid`Returns the OID of the user logged into this backend.                                                                                                                                                                                                                                                                                   |
| `pg_stat_get_backend_wait_event` ( `integer` ) → `text`Returns the wait event name if this backend is currently waiting, otherwise NULL. See [Table 28.5](monitoring-stats.html#WAIT-EVENT-ACTIVITY-TABLE "Table 28.5. Wait Events of Type Activity") through [Table 28.13](monitoring-stats.html#WAIT-EVENT-TIMEOUT-TABLE "Table 28.13. Wait Events of Type Timeout").                   |
| `pg_stat_get_backend_wait_event_type` ( `integer` ) → `text`Returns the wait event type name if this backend is currently waiting, otherwise NULL. See [Table 28.4](monitoring-stats.html#WAIT-EVENT-TABLE "Table 28.4. Wait Event Types") for details.                                                                                                                                   |
| `pg_stat_get_backend_xact_start` ( `integer` ) → `timestamp with time zone`Returns the time when the backend's current transaction was started.                                                                                                                                                                                                                                           |

***

|                                                         |                                                                  |                                                      |
| :------------------------------------------------------ | :--------------------------------------------------------------: | ---------------------------------------------------: |
| [Prev](monitoring-ps.html "28.1. Standard Unix Tools")  | [Up](monitoring.html "Chapter 28. Monitoring Database Activity") |  [Next](monitoring-locks.html "28.3. Viewing Locks") |
| 28.1. Standard Unix Tools                               |       [Home](index.html "PostgreSQL 17devel Documentation")      |                                  28.3. Viewing Locks |
