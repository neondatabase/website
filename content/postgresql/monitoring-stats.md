[#id](#MONITORING-STATS)

## 28.2. The Cumulative Statistics System [#](#MONITORING-STATS)

- [28.2.1. Statistics Collection Configuration](monitoring-stats#MONITORING-STATS-SETUP)
- [28.2.2. Viewing Statistics](monitoring-stats#MONITORING-STATS-VIEWS)
- [28.2.3. `pg_stat_activity`](monitoring-stats#MONITORING-PG-STAT-ACTIVITY-VIEW)
- [28.2.4. `pg_stat_replication`](monitoring-stats#MONITORING-PG-STAT-REPLICATION-VIEW)
- [28.2.5. `pg_stat_replication_slots`](monitoring-stats#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW)
- [28.2.6. `pg_stat_wal_receiver`](monitoring-stats#MONITORING-PG-STAT-WAL-RECEIVER-VIEW)
- [28.2.7. `pg_stat_recovery_prefetch`](monitoring-stats#MONITORING-PG-STAT-RECOVERY-PREFETCH)
- [28.2.8. `pg_stat_subscription`](monitoring-stats#MONITORING-PG-STAT-SUBSCRIPTION)
- [28.2.9. `pg_stat_subscription_stats`](monitoring-stats#MONITORING-PG-STAT-SUBSCRIPTION-STATS)
- [28.2.10. `pg_stat_ssl`](monitoring-stats#MONITORING-PG-STAT-SSL-VIEW)
- [28.2.11. `pg_stat_gssapi`](monitoring-stats#MONITORING-PG-STAT-GSSAPI-VIEW)
- [28.2.12. `pg_stat_archiver`](monitoring-stats#MONITORING-PG-STAT-ARCHIVER-VIEW)
- [28.2.13. `pg_stat_io`](monitoring-stats#MONITORING-PG-STAT-IO-VIEW)
- [28.2.14. `pg_stat_bgwriter`](monitoring-stats#MONITORING-PG-STAT-BGWRITER-VIEW)
- [28.2.15. `pg_stat_wal`](monitoring-stats#MONITORING-PG-STAT-WAL-VIEW)
- [28.2.16. `pg_stat_database`](monitoring-stats#MONITORING-PG-STAT-DATABASE-VIEW)
- [28.2.17. `pg_stat_database_conflicts`](monitoring-stats#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW)
- [28.2.18. `pg_stat_all_tables`](monitoring-stats#MONITORING-PG-STAT-ALL-TABLES-VIEW)
- [28.2.19. `pg_stat_all_indexes`](monitoring-stats#MONITORING-PG-STAT-ALL-INDEXES-VIEW)
- [28.2.20. `pg_statio_all_tables`](monitoring-stats#MONITORING-PG-STATIO-ALL-TABLES-VIEW)
- [28.2.21. `pg_statio_all_indexes`](monitoring-stats#MONITORING-PG-STATIO-ALL-INDEXES-VIEW)
- [28.2.22. `pg_statio_all_sequences`](monitoring-stats#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW)
- [28.2.23. `pg_stat_user_functions`](monitoring-stats#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW)
- [28.2.24. `pg_stat_slru`](monitoring-stats#MONITORING-PG-STAT-SLRU-VIEW)
- [28.2.25. Statistics Functions](monitoring-stats#MONITORING-STATS-FUNCTIONS)

PostgreSQL's _cumulative statistics system_ supports collection and reporting of information about server activity. Presently, accesses to tables and indexes in both disk-block and individual-row terms are counted. The total number of rows in each table, and information about vacuum and analyze actions for each table are also counted. If enabled, calls to user-defined functions and the total time spent in each one are counted as well.

PostgreSQL also supports reporting dynamic information about exactly what is going on in the system right now, such as the exact command currently being executed by other server processes, and which other connections exist in the system. This facility is independent of the cumulative statistics system.

[#id](#MONITORING-STATS-SETUP)

### 28.2.1. Statistics Collection Configuration [#](#MONITORING-STATS-SETUP)

Since collection of statistics adds some overhead to query execution, the system can be configured to collect or not collect information. This is controlled by configuration parameters that are normally set in `postgresql.conf`. (See [Chapter 20](runtime-config) for details about setting configuration parameters.)

The parameter [track_activities](runtime-config-statistics#GUC-TRACK-ACTIVITIES) enables monitoring of the current command being executed by any server process.

The parameter [track_counts](runtime-config-statistics#GUC-TRACK-COUNTS) controls whether cumulative statistics are collected about table and index accesses.

The parameter [track_functions](runtime-config-statistics#GUC-TRACK-FUNCTIONS) enables tracking of usage of user-defined functions.

The parameter [track_io_timing](runtime-config-statistics#GUC-TRACK-IO-TIMING) enables monitoring of block read and write times.

The parameter [track_wal_io_timing](runtime-config-statistics#GUC-TRACK-WAL-IO-TIMING) enables monitoring of WAL write times.

Normally these parameters are set in `postgresql.conf` so that they apply to all server processes, but it is possible to turn them on or off in individual sessions using the [SET](sql-set) command. (To prevent ordinary users from hiding their activity from the administrator, only superusers are allowed to change these parameters with `SET`.)

Cumulative statistics are collected in shared memory. Every PostgreSQL process collects statistics locally, then updates the shared data at appropriate intervals. When a server, including a physical replica, shuts down cleanly, a permanent copy of the statistics data is stored in the `pg_stat` subdirectory, so that statistics can be retained across server restarts. In contrast, when starting from an unclean shutdown (e.g., after an immediate shutdown, a server crash, starting from a base backup, and point-in-time recovery), all statistics counters are reset.

[#id](#MONITORING-STATS-VIEWS)

### 28.2.2. Viewing Statistics [#](#MONITORING-STATS-VIEWS)

Several predefined views, listed in [Table 28.1](monitoring-stats#MONITORING-STATS-DYNAMIC-VIEWS-TABLE), are available to show the current state of the system. There are also several other views, listed in [Table 28.2](monitoring-stats#MONITORING-STATS-VIEWS-TABLE), available to show the accumulated statistics. Alternatively, one can build custom views using the underlying cumulative statistics functions, as discussed in [Section 28.2.25](monitoring-stats#MONITORING-STATS-FUNCTIONS).

When using the cumulative statistics views and functions to monitor collected data, it is important to realize that the information does not update instantaneously. Each individual server process flushes out accumulated statistics to shared memory just before going idle, but not more frequently than once per `PGSTAT_MIN_INTERVAL` milliseconds (1 second unless altered while building the server); so a query or transaction still in progress does not affect the displayed totals and the displayed information lags behind actual activity. However, current-query information collected by `track_activities` is always up-to-date.

Another important point is that when a server process is asked to display any of the accumulated statistics, accessed values are cached until the end of its current transaction in the default configuration. So the statistics will show static information as long as you continue the current transaction. Similarly, information about the current queries of all sessions is collected when any such information is first requested within a transaction, and the same information will be displayed throughout the transaction. This is a feature, not a bug, because it allows you to perform several queries on the statistics and correlate the results without worrying that the numbers are changing underneath you. When analyzing statistics interactively, or with expensive queries, the time delta between accesses to individual statistics can lead to significant skew in the cached statistics. To minimize skew, `stats_fetch_consistency` can be set to `snapshot`, at the price of increased memory usage for caching not-needed statistics data. Conversely, if it's known that statistics are only accessed once, caching accessed statistics is unnecessary and can be avoided by setting `stats_fetch_consistency` to `none`. You can invoke `pg_stat_clear_snapshot`() to discard the current transaction's statistics snapshot or cached values (if any). The next use of statistical information will (when in snapshot mode) cause a new snapshot to be built or (when in cache mode) accessed statistics to be cached.

A transaction can also see its own statistics (not yet flushed out to the shared memory statistics) in the views `pg_stat_xact_all_tables`, `pg_stat_xact_sys_tables`, `pg_stat_xact_user_tables`, and `pg_stat_xact_user_functions`. These numbers do not act as stated above; instead they update continuously throughout the transaction.

Some of the information in the dynamic statistics views shown in [Table 28.1](monitoring-stats#MONITORING-STATS-DYNAMIC-VIEWS-TABLE) is security restricted. Ordinary users can only see all the information about their own sessions (sessions belonging to a role that they are a member of). In rows about other sessions, many columns will be null. Note, however, that the existence of a session and its general properties such as its sessions user and database are visible to all users. Superusers and roles with privileges of built-in role `pg_read_all_stats` (see also [Section 22.5](predefined-roles)) can see all the information about all sessions.

[#id](#MONITORING-STATS-DYNAMIC-VIEWS-TABLE)

**Table 28.1. Dynamic Statistics Views**

| View Name                       | Description                                                                                                                                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pg_stat_activity`              | One row per server process, showing information related to the current activity of that process, such as state and current query. See [`pg_stat_activity`](monitoring-stats#MONITORING-PG-STAT-ACTIVITY-VIEW) for details.     |
| `pg_stat_replication`           | One row per WAL sender process, showing statistics about replication to that sender's connected standby server. See [`pg_stat_replication`](monitoring-stats#MONITORING-PG-STAT-REPLICATION-VIEW) for details.                 |
| `pg_stat_wal_receiver`          | Only one row, showing statistics about the WAL receiver from that receiver's connected server. See [`pg_stat_wal_receiver`](monitoring-stats#MONITORING-PG-STAT-WAL-RECEIVER-VIEW) for details.                                |
| `pg_stat_recovery_prefetch`     | Only one row, showing statistics about blocks prefetched during recovery. See [`pg_stat_recovery_prefetch`](monitoring-stats#MONITORING-PG-STAT-RECOVERY-PREFETCH) for details.                                                |
| `pg_stat_subscription`          | At least one row per subscription, showing information about the subscription workers. See [`pg_stat_subscription`](monitoring-stats#MONITORING-PG-STAT-SUBSCRIPTION) for details.                                             |
| `pg_stat_ssl`                   | One row per connection (regular and replication), showing information about SSL used on this connection. See [`pg_stat_ssl`](monitoring-stats#MONITORING-PG-STAT-SSL-VIEW) for details.                                        |
| `pg_stat_gssapi`                | One row per connection (regular and replication), showing information about GSSAPI authentication and encryption used on this connection. See [`pg_stat_gssapi`](monitoring-stats#MONITORING-PG-STAT-GSSAPI-VIEW) for details. |
| `pg_stat_progress_analyze`      | One row for each backend (including autovacuum worker processes) running `ANALYZE`, showing current progress. See [Section 28.4.1](progress-reporting#ANALYZE-PROGRESS-REPORTING).                                             |
| `pg_stat_progress_create_index` | One row for each backend running `CREATE INDEX` or `REINDEX`, showing current progress. See [Section 28.4.4](progress-reporting#CREATE-INDEX-PROGRESS-REPORTING).                                                              |
| `pg_stat_progress_vacuum`       | One row for each backend (including autovacuum worker processes) running `VACUUM`, showing current progress. See [Section 28.4.5](progress-reporting#VACUUM-PROGRESS-REPORTING).                                               |
| `pg_stat_progress_cluster`      | One row for each backend running `CLUSTER` or `VACUUM FULL`, showing current progress. See [Section 28.4.2](progress-reporting#CLUSTER-PROGRESS-REPORTING).                                                                    |
| `pg_stat_progress_basebackup`   | One row for each WAL sender process streaming a base backup, showing current progress. See [Section 28.4.6](progress-reporting#BASEBACKUP-PROGRESS-REPORTING).                                                                 |
| `pg_stat_progress_copy`         | One row for each backend running `COPY`, showing current progress. See [Section 28.4.3](progress-reporting#COPY-PROGRESS-REPORTING).                                                                                           |

[#id](#MONITORING-STATS-VIEWS-TABLE)

**Table 28.2. Collected Statistics Views**

| View Name                     | Description                                                                                                                                                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pg_stat_archiver`            | One row only, showing statistics about the WAL archiver process's activity. See [`pg_stat_archiver`](monitoring-stats#MONITORING-PG-STAT-ARCHIVER-VIEW) for details.                                                                                                                 |
| `pg_stat_bgwriter`            | One row only, showing statistics about the background writer process's activity. See [`pg_stat_bgwriter`](monitoring-stats#MONITORING-PG-STAT-BGWRITER-VIEW) for details.                                                                                                            |
| `pg_stat_database`            | One row per database, showing database-wide statistics. See [`pg_stat_database`](monitoring-stats#MONITORING-PG-STAT-DATABASE-VIEW) for details.                                                                                                                                     |
| `pg_stat_database_conflicts`  | One row per database, showing database-wide statistics about query cancels due to conflict with recovery on standby servers. See [`pg_stat_database_conflicts`](monitoring-stats#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW) for details.                                            |
| `pg_stat_io`                  | One row for each combination of backend type, context, and target object containing cluster-wide I/O statistics. See [`pg_stat_io`](monitoring-stats#MONITORING-PG-STAT-IO-VIEW) for details.                                                                                        |
| `pg_stat_replication_slots`   | One row per replication slot, showing statistics about the replication slot's usage. See [`pg_stat_replication_slots`](monitoring-stats#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW) for details.                                                                                      |
| `pg_stat_slru`                | One row per SLRU, showing statistics of operations. See [`pg_stat_slru`](monitoring-stats#MONITORING-PG-STAT-SLRU-VIEW) for details.                                                                                                                                                 |
| `pg_stat_subscription_stats`  | One row per subscription, showing statistics about errors. See [`pg_stat_subscription_stats`](monitoring-stats#MONITORING-PG-STAT-SUBSCRIPTION-STATS) for details.                                                                                                                   |
| `pg_stat_wal`                 | One row only, showing statistics about WAL activity. See [`pg_stat_wal`](monitoring-stats#MONITORING-PG-STAT-WAL-VIEW) for details.                                                                                                                                                  |
| `pg_stat_all_tables`          | One row for each table in the current database, showing statistics about accesses to that specific table. See [`pg_stat_all_tables`](monitoring-stats#MONITORING-PG-STAT-ALL-TABLES-VIEW) for details.                                                                               |
| `pg_stat_sys_tables`          | Same as `pg_stat_all_tables`, except that only system tables are shown.                                                                                                                                                                                                              |
| `pg_stat_user_tables`         | Same as `pg_stat_all_tables`, except that only user tables are shown.                                                                                                                                                                                                                |
| `pg_stat_xact_all_tables`     | Similar to `pg_stat_all_tables`, but counts actions taken so far within the current transaction (which are _not_ yet included in `pg_stat_all_tables` and related views). The columns for numbers of live and dead rows and vacuum and analyze actions are not present in this view. |
| `pg_stat_xact_sys_tables`     | Same as `pg_stat_xact_all_tables`, except that only system tables are shown.                                                                                                                                                                                                         |
| `pg_stat_xact_user_tables`    | Same as `pg_stat_xact_all_tables`, except that only user tables are shown.                                                                                                                                                                                                           |
| `pg_stat_all_indexes`         | One row for each index in the current database, showing statistics about accesses to that specific index. See [`pg_stat_all_indexes`](monitoring-stats#MONITORING-PG-STAT-ALL-INDEXES-VIEW) for details.                                                                             |
| `pg_stat_sys_indexes`         | Same as `pg_stat_all_indexes`, except that only indexes on system tables are shown.                                                                                                                                                                                                  |
| `pg_stat_user_indexes`        | Same as `pg_stat_all_indexes`, except that only indexes on user tables are shown.                                                                                                                                                                                                    |
| `pg_stat_user_functions`      | One row for each tracked function, showing statistics about executions of that function. See [`pg_stat_user_functions`](monitoring-stats#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW) for details.                                                                                        |
| `pg_stat_xact_user_functions` | Similar to `pg_stat_user_functions`, but counts only calls during the current transaction (which are _not_ yet included in `pg_stat_user_functions`).                                                                                                                                |
| `pg_statio_all_tables`        | One row for each table in the current database, showing statistics about I/O on that specific table. See [`pg_statio_all_tables`](monitoring-stats#MONITORING-PG-STATIO-ALL-TABLES-VIEW) for details.                                                                                |
| `pg_statio_sys_tables`        | Same as `pg_statio_all_tables`, except that only system tables are shown.                                                                                                                                                                                                            |
| `pg_statio_user_tables`       | Same as `pg_statio_all_tables`, except that only user tables are shown.                                                                                                                                                                                                              |
| `pg_statio_all_indexes`       | One row for each index in the current database, showing statistics about I/O on that specific index. See [`pg_statio_all_indexes`](monitoring-stats#MONITORING-PG-STATIO-ALL-INDEXES-VIEW) for details.                                                                              |
| `pg_statio_sys_indexes`       | Same as `pg_statio_all_indexes`, except that only indexes on system tables are shown.                                                                                                                                                                                                |
| `pg_statio_user_indexes`      | Same as `pg_statio_all_indexes`, except that only indexes on user tables are shown.                                                                                                                                                                                                  |
| `pg_statio_all_sequences`     | One row for each sequence in the current database, showing statistics about I/O on that specific sequence. See [`pg_statio_all_sequences`](monitoring-stats#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW) for details.                                                                    |
| `pg_statio_sys_sequences`     | Same as `pg_statio_all_sequences`, except that only system sequences are shown. (Presently, no system sequences are defined, so this view is always empty.)                                                                                                                          |
| `pg_statio_user_sequences`    | Same as `pg_statio_all_sequences`, except that only user sequences are shown.                                                                                                                                                                                                        |

The per-index statistics are particularly useful to determine which indexes are being used and how effective they are.

The `pg_stat_io` and `pg_statio_` set of views are useful for determining the effectiveness of the buffer cache. They can be used to calculate a cache hit ratio. Note that while PostgreSQL's I/O statistics capture most instances in which the kernel was invoked in order to perform I/O, they do not differentiate between data which had to be fetched from disk and that which already resided in the kernel page cache. Users are advised to use the PostgreSQL statistics views in combination with operating system utilities for a more complete picture of their database's I/O performance.

[#id](#MONITORING-PG-STAT-ACTIVITY-VIEW)

### 28.2.3. `pg_stat_activity` [#](#MONITORING-PG-STAT-ACTIVITY-VIEW)

The `pg_stat_activity` view will have one row per server process, showing information related to the current activity of that process.

[#id](#PG-STAT-ACTIVITY-VIEW)

**Table 28.3. `pg_stat_activity` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_activity View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">datid</code> <code class="type">oid</code>
        </div>
        <div>OID of the database this backend is connected to</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">datname</code> <code class="type">name</code>
        </div>
        <div>Name of the database this backend is connected to</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">pid</code> <code class="type">integer</code>
        </div>
        <div>Process ID of this backend</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">leader_pid</code> <code class="type">integer</code>
        </div>
        <div>
          Process ID of the parallel group leader if this process is a parallel query worker, or
          process ID of the leader apply worker if this process is a parallel apply worker.
          <code class="literal">NULL</code> indicates that this process is a parallel group leader
          or leader apply worker, or does not participate in any parallel operation.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">usesysid</code> <code class="type">oid</code>
        </div>
        <div>OID of the user logged into this backend</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">usename</code> <code class="type">name</code>
        </div>
        <div>Name of the user logged into this backend</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">application_name</code> <code class="type">text</code>
        </div>
        <div>Name of the application that is connected to this backend</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">client_addr</code> <code class="type">inet</code>
        </div>
        <div>
          IP address of the client connected to this backend. If this field is null, it indicates
          either that the client is connected via a Unix socket on the server machine or that this
          is an internal process such as autovacuum.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">client_hostname</code> <code class="type">text</code>
        </div>
        <div>
          Host name of the connected client, as reported by a reverse DNS lookup of
          <code class="structfield">client_addr</code>. This field will only be non-null for IP
          connections, and only when
          <a class="xref" href="runtime-config-logging.html#GUC-LOG-HOSTNAME">log_hostname</a> is
          enabled.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">client_port</code> <code class="type">integer</code>
        </div>
        <div>
          TCP port number that the client is using for communication with this backend, or
          <code class="literal">-1</code> if a Unix socket is used. If this field is null, it
          indicates that this is an internal server process.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">backend_start</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>
          Time when this process was started. For client backends, this is the time the client
          connected to the server.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">xact_start</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>
          Time when this process' current transaction was started, or null if no transaction is
          active. If the current query is the first of its transaction, this column is equal to the
          <code class="structfield">query_start</code> column.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">query_start</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>
          Time when the currently active query was started, or if
          <code class="structfield">state</code> is not <code class="literal">active</code>, when
          the last query was started
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">state_change</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Time when the <code class="structfield">state</code> was last changed</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">wait_event_type</code> <code class="type">text</code>
        </div>
        <div>
          The type of event for which the backend is waiting, if any; otherwise NULL. See
          <a
            class="xref"
            href="monitoring-stats.html#WAIT-EVENT-TABLE"
            title="Table&nbsp;28.4.&nbsp;Wait Event Types">Table&nbsp;28.4</a>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">wait_event</code> <code class="type">text</code>
        </div>
        <div>
          Wait event name if backend is currently waiting, otherwise NULL. See
          <a
            class="xref"
            href="monitoring-stats.html#WAIT-EVENT-ACTIVITY-TABLE"
            title="Table&nbsp;28.5.&nbsp;Wait Events of Type Activity">Table&nbsp;28.5</a>
          through
          <a
            class="xref"
            href="monitoring-stats.html#WAIT-EVENT-TIMEOUT-TABLE"
            title="Table&nbsp;28.13.&nbsp;Wait Events of Type Timeout">Table&nbsp;28.13</a>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">state</code> <code class="type">text</code>
        </div>
        <div>Current overall state of this backend. Possible values are:</div>
        <div class="itemizedlist">
          <ul class="itemizedlist">
            <li class="listitem">
              <div><code class="literal">active</code>: The backend is executing a query.</div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">idle</code>: The backend is waiting for a new client command.
              </div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">idle in transaction</code>: The backend is in a transaction,
                but is not currently executing a query.
              </div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">idle in transaction (aborted)</code>: This state is similar to
                <code class="literal">idle in transaction</code>, except one of the statements in
                the transaction caused an error.
              </div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">fastpath function call</code>: The backend is executing a
                fast-path function.
              </div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">disabled</code>: This state is reported if
                <a class="xref" href="runtime-config-statistics.html#GUC-TRACK-ACTIVITIES">track_activities</a>
                is disabled in this backend.
              </div>
            </li>
          </ul>
        </div>
        <div></div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">backend_xid</code> <code class="type">xid</code>
        </div>
        <div>
          Top-level transaction identifier of this backend, if any; see
          <a class="xref" href="transaction-id.html" title="74.1.&nbsp;Transactions and Identifiers">Section&nbsp;74.1</a>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">backend_xmin</code> <code class="type">xid</code>
        </div>
        <div>The current backend's <code class="literal">xmin</code> horizon.</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">query_id</code> <code class="type">bigint</code>
        </div>
        <div>
          Identifier of this backend's most recent query. If
          <code class="structfield">state</code> is <code class="literal">active</code> this field
          shows the identifier of the currently executing query. In all other states, it shows the
          identifier of last query that was executed. Query identifiers are not computed by default
          so this field will be null unless
          <a class="xref" href="runtime-config-statistics.html#GUC-COMPUTE-QUERY-ID">compute_query_id</a>
          parameter is enabled or a third-party module that computes query identifiers is
          configured.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">query</code> <code class="type">text</code>
        </div>
        <div>
          Text of this backend's most recent query. If
          <code class="structfield">state</code> is <code class="literal">active</code> this field
          shows the currently executing query. In all other states, it shows the last query that was
          executed. By default the query text is truncated at 1024 bytes; this value can be changed
          via the parameter
          <a class="xref" href="runtime-config-statistics.html#GUC-TRACK-ACTIVITY-QUERY-SIZE">track_activity_query_size</a>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">backend_type</code> <code class="type">text</code>
        </div>
        <div>
          Type of current backend. Possible types are
          <code class="literal">autovacuum launcher</code>,
          <code class="literal">autovacuum worker</code>,
          <code class="literal">logical replication launcher</code>,
          <code class="literal">logical replication worker</code>,
          <code class="literal">parallel worker</code>,
          <code class="literal">background writer</code>,
          <code class="literal">client backend</code>, <code class="literal">checkpointer</code>,
          <code class="literal">archiver</code>, <code class="literal">standalone backend</code>,
          <code class="literal">startup</code>, <code class="literal">walreceiver</code>,
          <code class="literal">walsender</code> and <code class="literal">walwriter</code>. In
          addition, background workers registered by extensions may have additional types.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

### Note

The `wait_event` and `state` columns are independent. If a backend is in the `active` state, it may or may not be `waiting` on some event. If the state is `active` and `wait_event` is non-null, it means that a query is being executed, but is being blocked somewhere in the system.

[#id](#WAIT-EVENT-TABLE)

**Table 28.4. Wait Event Types**

| Wait Event Type | Description                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Activity`      | The server process is idle. This event type indicates a process waiting for activity in its main processing loop. `wait_event` will identify the specific wait point; see [Table 28.5](monitoring-stats#WAIT-EVENT-ACTIVITY-TABLE).                                                                                                                                                                                 |
| `BufferPin`     | The server process is waiting for exclusive access to a data buffer. Buffer pin waits can be protracted if another process holds an open cursor that last read data from the buffer in question. See [Table 28.6](monitoring-stats#WAIT-EVENT-BUFFERPIN-TABLE).                                                                                                                                                     |
| `Client`        | The server process is waiting for activity on a socket connected to a user application. Thus, the server expects something to happen that is independent of its internal processes. `wait_event` will identify the specific wait point; see [Table 28.7](monitoring-stats#WAIT-EVENT-CLIENT-TABLE).                                                                                                                 |
| `Extension`     | The server process is waiting for some condition defined by an extension module. See [Table 28.8](monitoring-stats#WAIT-EVENT-EXTENSION-TABLE).                                                                                                                                                                                                                                                                     |
| `IO`            | The server process is waiting for an I/O operation to complete. `wait_event` will identify the specific wait point; see [Table 28.9](monitoring-stats#WAIT-EVENT-IO-TABLE).                                                                                                                                                                                                                                         |
| `IPC`           | The server process is waiting for some interaction with another server process. `wait_event` will identify the specific wait point; see [Table 28.10](monitoring-stats#WAIT-EVENT-IPC-TABLE).                                                                                                                                                                                                                       |
| `Lock`          | The server process is waiting for a heavyweight lock. Heavyweight locks, also known as lock manager locks or simply locks, primarily protect SQL-visible objects such as tables. However, they are also used to ensure mutual exclusion for certain internal operations such as relation extension. `wait_event` will identify the type of lock awaited; see [Table 28.11](monitoring-stats#WAIT-EVENT-LOCK-TABLE). |
| `LWLock`        | The server process is waiting for a lightweight lock. Most such locks protect a particular data structure in shared memory. `wait_event` will contain a name identifying the purpose of the lightweight lock. (Some locks have specific names; others are part of a group of locks each with a similar purpose.) See [Table 28.12](monitoring-stats#WAIT-EVENT-LWLOCK-TABLE).                                       |
| `Timeout`       | The server process is waiting for a timeout to expire. `wait_event` will identify the specific wait point; see [Table 28.13](monitoring-stats#WAIT-EVENT-TIMEOUT-TABLE).                                                                                                                                                                                                                                            |

[#id](#WAIT-EVENT-ACTIVITY-TABLE)

**Table 28.5. Wait Events of Type `Activity`**

| `Activity` Wait Event      | Description                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `ArchiverMain`             | Waiting in main loop of archiver process.                                             |
| `AutoVacuumMain`           | Waiting in main loop of autovacuum launcher process.                                  |
| `BgWriterHibernate`        | Waiting in background writer process, hibernating.                                    |
| `BgWriterMain`             | Waiting in main loop of background writer process.                                    |
| `CheckpointerMain`         | Waiting in main loop of checkpointer process.                                         |
| `LogicalApplyMain`         | Waiting in main loop of logical replication apply process.                            |
| `LogicalLauncherMain`      | Waiting in main loop of logical replication launcher process.                         |
| `LogicalParallelApplyMain` | Waiting in main loop of logical replication parallel apply process.                   |
| `RecoveryWalStream`        | Waiting in main loop of startup process for WAL to arrive, during streaming recovery. |
| `SysLoggerMain`            | Waiting in main loop of syslogger process.                                            |
| `WalReceiverMain`          | Waiting in main loop of WAL receiver process.                                         |
| `WalSenderMain`            | Waiting in main loop of WAL sender process.                                           |
| `WalWriterMain`            | Waiting in main loop of WAL writer process.                                           |

[#id](#WAIT-EVENT-BUFFERPIN-TABLE)

**Table 28.6. Wait Events of Type `BufferPin`**

| `BufferPin` Wait Event | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `BufferPin`            | Waiting to acquire an exclusive pin on a buffer. |

[#id](#WAIT-EVENT-CLIENT-TABLE)

**Table 28.7. Wait Events of Type `Client`**

| `Client` Wait Event       | Description                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `ClientRead`              | Waiting to read data from the client.                                                     |
| `ClientWrite`             | Waiting to write data to the client.                                                      |
| `GSSOpenServer`           | Waiting to read data from the client while establishing a GSSAPI session.                 |
| `LibPQWalReceiverConnect` | Waiting in WAL receiver to establish connection to remote server.                         |
| `LibPQWalReceiverReceive` | Waiting in WAL receiver to receive data from remote server.                               |
| `SSLOpenServer`           | Waiting for SSL while attempting connection.                                              |
| `WalSenderWaitForWAL`     | Waiting for WAL to be flushed in WAL sender process.                                      |
| `WalSenderWriteData`      | Waiting for any activity when processing replies from WAL receiver in WAL sender process. |

[#id](#WAIT-EVENT-EXTENSION-TABLE)

**Table 28.8. Wait Events of Type `Extension`**

| `Extension` Wait Event | Description              |
| ---------------------- | ------------------------ |
| `Extension`            | Waiting in an extension. |

[#id](#WAIT-EVENT-IO-TABLE)

**Table 28.9. Wait Events of Type `IO`**

| `IO` Wait Event                | Description                                                                                        |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `BaseBackupRead`               | Waiting for base backup to read from a file.                                                       |
| `BaseBackupSync`               | Waiting for data written by a base backup to reach durable storage.                                |
| `BaseBackupWrite`              | Waiting for base backup to write to a file.                                                        |
| `BufFileRead`                  | Waiting for a read from a buffered file.                                                           |
| `BufFileTruncate`              | Waiting for a buffered file to be truncated.                                                       |
| `BufFileWrite`                 | Waiting for a write to a buffered file.                                                            |
| `ControlFileRead`              | Waiting for a read from the `pg_control` file.                                                     |
| `ControlFileSync`              | Waiting for the `pg_control` file to reach durable storage.                                        |
| `ControlFileSyncUpdate`        | Waiting for an update to the `pg_control` file to reach durable storage.                           |
| `ControlFileWrite`             | Waiting for a write to the `pg_control` file.                                                      |
| `ControlFileWriteUpdate`       | Waiting for a write to update the `pg_control` file.                                               |
| `CopyFileRead`                 | Waiting for a read during a file copy operation.                                                   |
| `CopyFileWrite`                | Waiting for a write during a file copy operation.                                                  |
| `DSMAllocate`                  | Waiting for a dynamic shared memory segment to be allocated.                                       |
| `DSMFillZeroWrite`             | Waiting to fill a dynamic shared memory backing file with zeroes.                                  |
| `DataFileExtend`               | Waiting for a relation data file to be extended.                                                   |
| `DataFileFlush`                | Waiting for a relation data file to reach durable storage.                                         |
| `DataFileImmediateSync`        | Waiting for an immediate synchronization of a relation data file to durable storage.               |
| `DataFilePrefetch`             | Waiting for an asynchronous prefetch from a relation data file.                                    |
| `DataFileRead`                 | Waiting for a read from a relation data file.                                                      |
| `DataFileSync`                 | Waiting for changes to a relation data file to reach durable storage.                              |
| `DataFileTruncate`             | Waiting for a relation data file to be truncated.                                                  |
| `DataFileWrite`                | Waiting for a write to a relation data file.                                                       |
| `LockFileAddToDataDirRead`     | Waiting for a read while adding a line to the data directory lock file.                            |
| `LockFileAddToDataDirSync`     | Waiting for data to reach durable storage while adding a line to the data directory lock file.     |
| `LockFileAddToDataDirWrite`    | Waiting for a write while adding a line to the data directory lock file.                           |
| `LockFileCreateRead`           | Waiting to read while creating the data directory lock file.                                       |
| `LockFileCreateSync`           | Waiting for data to reach durable storage while creating the data directory lock file.             |
| `LockFileCreateWrite`          | Waiting for a write while creating the data directory lock file.                                   |
| `LockFileReCheckDataDirRead`   | Waiting for a read during recheck of the data directory lock file.                                 |
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
| `SLRUFlushSync`                | Waiting for SLRU data to reach durable storage during a checkpoint or database shutdown.           |
| `SLRURead`                     | Waiting for a read of an SLRU page.                                                                |
| `SLRUSync`                     | Waiting for SLRU data to reach durable storage following a page write.                             |
| `SLRUWrite`                    | Waiting for a write of an SLRU page.                                                               |
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
| `WALBootstrapSync`             | Waiting for WAL to reach durable storage during bootstrapping.                                     |
| `WALBootstrapWrite`            | Waiting for a write of a WAL page during bootstrapping.                                            |
| `WALCopyRead`                  | Waiting for a read when creating a new WAL segment by copying an existing one.                     |
| `WALCopySync`                  | Waiting for a new WAL segment created by copying an existing one to reach durable storage.         |
| `WALCopyWrite`                 | Waiting for a write when creating a new WAL segment by copying an existing one.                    |
| `WALInitSync`                  | Waiting for a newly initialized WAL file to reach durable storage.                                 |
| `WALInitWrite`                 | Waiting for a write while initializing a new WAL file.                                             |
| `WALRead`                      | Waiting for a read from a WAL file.                                                                |
| `WALSenderTimelineHistoryRead` | Waiting for a read from a timeline history file during a walsender timeline command.               |
| `WALSync`                      | Waiting for a WAL file to reach durable storage.                                                   |
| `WALSyncMethodAssign`          | Waiting for data to reach durable storage while assigning a new WAL sync method.                   |
| `WALWrite`                     | Waiting for a write to a WAL file.                                                                 |

[#id](#WAIT-EVENT-IPC-TABLE)

**Table 28.10. Wait Events of Type `IPC`**

| `IPC` Wait Event                  | Description                                                                                        |
| --------------------------------- | -------------------------------------------------------------------------------------------------- |
| `AppendReady`                     | Waiting for subplan nodes of an `Append` plan node to be ready.                                    |
| `ArchiveCleanupCommand`           | Waiting for [archive_cleanup_command](runtime-config-wal#GUC-ARCHIVE-CLEANUP-COMMAND) to complete. |
| `ArchiveCommand`                  | Waiting for [archive_command](runtime-config-wal#GUC-ARCHIVE-COMMAND) to complete.                 |
| `BackendTermination`              | Waiting for the termination of another backend.                                                    |
| `BackupWaitWalArchive`            | Waiting for WAL files required for a backup to be successfully archived.                           |
| `BgWorkerShutdown`                | Waiting for background worker to shut down.                                                        |
| `BgWorkerStartup`                 | Waiting for background worker to start up.                                                         |
| `BtreePage`                       | Waiting for the page number needed to continue a parallel B-tree scan to become available.         |
| `BufferIO`                        | Waiting for buffer I/O to complete.                                                                |
| `CheckpointDone`                  | Waiting for a checkpoint to complete.                                                              |
| `CheckpointStart`                 | Waiting for a checkpoint to start.                                                                 |
| `ExecuteGather`                   | Waiting for activity from a child process while executing a `Gather` plan node.                    |
| `HashBatchAllocate`               | Waiting for an elected Parallel Hash participant to allocate a hash table.                         |
| `HashBatchElect`                  | Waiting to elect a Parallel Hash participant to allocate a hash table.                             |
| `HashBatchLoad`                   | Waiting for other Parallel Hash participants to finish loading a hash table.                       |
| `HashBuildAllocate`               | Waiting for an elected Parallel Hash participant to allocate the initial hash table.               |
| `HashBuildElect`                  | Waiting to elect a Parallel Hash participant to allocate the initial hash table.                   |
| `HashBuildHashInner`              | Waiting for other Parallel Hash participants to finish hashing the inner relation.                 |
| `HashBuildHashOuter`              | Waiting for other Parallel Hash participants to finish partitioning the outer relation.            |
| `HashGrowBatchesDecide`           | Waiting to elect a Parallel Hash participant to decide on future batch growth.                     |
| `HashGrowBatchesElect`            | Waiting to elect a Parallel Hash participant to allocate more batches.                             |
| `HashGrowBatchesFinish`           | Waiting for an elected Parallel Hash participant to decide on future batch growth.                 |
| `HashGrowBatchesReallocate`       | Waiting for an elected Parallel Hash participant to allocate more batches.                         |
| `HashGrowBatchesRepartition`      | Waiting for other Parallel Hash participants to finish repartitioning.                             |
| `HashGrowBucketsElect`            | Waiting to elect a Parallel Hash participant to allocate more buckets.                             |
| `HashGrowBucketsReallocate`       | Waiting for an elected Parallel Hash participant to finish allocating more buckets.                |
| `HashGrowBucketsReinsert`         | Waiting for other Parallel Hash participants to finish inserting tuples into new buckets.          |
| `LogicalApplySendData`            | Waiting for a logical replication leader apply process to send data to a parallel apply process.   |
| `LogicalParallelApplyStateChange` | Waiting for a logical replication parallel apply process to change state.                          |
| `LogicalSyncData`                 | Waiting for a logical replication remote server to send data for initial table synchronization.    |
| `LogicalSyncStateChange`          | Waiting for a logical replication remote server to change state.                                   |
| `MessageQueueInternal`            | Waiting for another process to be attached to a shared message queue.                              |
| `MessageQueuePutMessage`          | Waiting to write a protocol message to a shared message queue.                                     |
| `MessageQueueReceive`             | Waiting to receive bytes from a shared message queue.                                              |
| `MessageQueueSend`                | Waiting to send bytes to a shared message queue.                                                   |
| `ParallelBitmapScan`              | Waiting for parallel bitmap scan to become initialized.                                            |
| `ParallelCreateIndexScan`         | Waiting for parallel `CREATE INDEX` workers to finish heap scan.                                   |
| `ParallelFinish`                  | Waiting for parallel workers to finish computing.                                                  |
| `ProcArrayGroupUpdate`            | Waiting for the group leader to clear the transaction ID at end of a parallel operation.           |
| `ProcSignalBarrier`               | Waiting for a barrier event to be processed by all backends.                                       |
| `Promote`                         | Waiting for standby promotion.                                                                     |
| `RecoveryConflictSnapshot`        | Waiting for recovery conflict resolution for a vacuum cleanup.                                     |
| `RecoveryConflictTablespace`      | Waiting for recovery conflict resolution for dropping a tablespace.                                |
| `RecoveryEndCommand`              | Waiting for [recovery_end_command](runtime-config-wal#GUC-RECOVERY-END-COMMAND) to complete.       |
| `RecoveryPause`                   | Waiting for recovery to be resumed.                                                                |
| `ReplicationOriginDrop`           | Waiting for a replication origin to become inactive so it can be dropped.                          |
| `ReplicationSlotDrop`             | Waiting for a replication slot to become inactive so it can be dropped.                            |
| `RestoreCommand`                  | Waiting for [restore_command](runtime-config-wal#GUC-RESTORE-COMMAND) to complete.                 |
| `SafeSnapshot`                    | Waiting to obtain a valid snapshot for a `READ ONLY DEFERRABLE` transaction.                       |
| `SyncRep`                         | Waiting for confirmation from a remote server during synchronous replication.                      |
| `WalReceiverExit`                 | Waiting for the WAL receiver to exit.                                                              |
| `WalReceiverWaitStart`            | Waiting for startup process to send initial data for streaming replication.                        |
| `XactGroupUpdate`                 | Waiting for the group leader to update transaction status at end of a parallel operation.          |

[#id](#WAIT-EVENT-LOCK-TABLE)

**Table 28.11. Wait Events of Type `Lock`**

| `Lock` Wait Event  | Description                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `advisory`         | Waiting to acquire an advisory user lock.                                                            |
| `applytransaction` | Waiting to acquire a lock on a remote transaction being applied by a logical replication subscriber. |
| `extend`           | Waiting to extend a relation.                                                                        |
| `frozenid`         | Waiting to update `pg_database`.`datfrozenxid` and `pg_database`.`datminmxid`.                       |
| `object`           | Waiting to acquire a lock on a non-relation database object.                                         |
| `page`             | Waiting to acquire a lock on a page of a relation.                                                   |
| `relation`         | Waiting to acquire a lock on a relation.                                                             |
| `spectoken`        | Waiting to acquire a speculative insertion lock.                                                     |
| `transactionid`    | Waiting for a transaction to finish.                                                                 |
| `tuple`            | Waiting to acquire a lock on a tuple.                                                                |
| `userlock`         | Waiting to acquire a user lock.                                                                      |
| `virtualxid`       | Waiting to acquire a virtual transaction ID lock; see [Section 74.1](transaction-id).                |

[#id](#WAIT-EVENT-LWLOCK-TABLE)

**Table 28.12. Wait Events of Type `LWLock`**

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
| `OldSnapshotTimeMap`         | Waiting to read or update old snapshot control information.                                                                   |
| `ParallelAppend`             | Waiting to choose the next subplan during Parallel Append plan execution.                                                     |
| `ParallelHashJoin`           | Waiting to synchronize workers during Parallel Hash Join plan execution.                                                      |
| `ParallelQueryDSA`           | Waiting for parallel query dynamic shared memory allocation.                                                                  |
| `PerSessionDSA`              | Waiting for parallel query dynamic shared memory allocation.                                                                  |
| `PerSessionRecordType`       | Waiting to access a parallel query's information about composite types.                                                       |
| `PerSessionRecordTypmod`     | Waiting to access a parallel query's information about type modifiers that identify anonymous record types.                   |
| `PerXactPredicateList`       | Waiting to access the list of predicate locks held by the current serializable transaction during a parallel query.           |
| `PgStatsData`                | Waiting for shared memory stats data access                                                                                   |
| `PgStatsDSA`                 | Waiting for stats dynamic shared memory allocator access                                                                      |
| `PgStatsHash`                | Waiting for stats shared memory hash table access                                                                             |
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
| `WALBufMapping`              | Waiting to replace a page in WAL buffers.                                                                                     |
| `WALInsert`                  | Waiting to insert WAL data into a memory buffer.                                                                              |
| `WALWrite`                   | Waiting for WAL buffers to be written to disk.                                                                                |
| `WrapLimitsVacuum`           | Waiting to update limits on transaction id and multixact consumption.                                                         |
| `XactBuffer`                 | Waiting for I/O on a transaction status SLRU buffer.                                                                          |
| `XactSLRU`                   | Waiting to access the transaction status SLRU cache.                                                                          |
| `XactTruncation`             | Waiting to execute `pg_xact_status` or update the oldest transaction ID available to it.                                      |
| `XidGen`                     | Waiting to allocate a new transaction ID.                                                                                     |

### Note

Extensions can add `LWLock` types to the list shown in [Table 28.12](monitoring-stats#WAIT-EVENT-LWLOCK-TABLE). In some cases, the name assigned by an extension will not be available in all server processes; so an `LWLock` wait event might be reported as just “`extension`” rather than the extension-assigned name.

[#id](#WAIT-EVENT-TIMEOUT-TABLE)

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

Here is an example of how wait events can be viewed:

```

SELECT pid, wait_event_type, wait_event FROM pg_stat_activity WHERE wait_event is NOT NULL;
 pid  | wait_event_type | wait_event
------+-----------------+------------
 2540 | Lock            | relation
 6644 | LWLock          | ProcArray
(2 rows)

```

[#id](#MONITORING-PG-STAT-REPLICATION-VIEW)

### 28.2.4. `pg_stat_replication` [#](#MONITORING-PG-STAT-REPLICATION-VIEW)

The `pg_stat_replication` view will contain one row per WAL sender process, showing statistics about replication to that sender's connected standby server. Only directly connected standbys are listed; no information is available about downstream standby servers.

[#id](#PG-STAT-REPLICATION-VIEW)

**Table 28.14. `pg_stat_replication` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_replication View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">pid</code> <code class="type">integer</code>
        </div>
        <div>Process ID of a WAL sender process</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">usesysid</code> <code class="type">oid</code>
        </div>
        <div>OID of the user logged into this WAL sender process</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">usename</code> <code class="type">name</code>
        </div>
        <div>Name of the user logged into this WAL sender process</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">application_name</code> <code class="type">text</code>
        </div>
        <div>Name of the application that is connected to this WAL sender</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">client_addr</code> <code class="type">inet</code>
        </div>
        <div>
          IP address of the client connected to this WAL sender. If this field is null, it indicates
          that the client is connected via a Unix socket on the server machine.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">client_hostname</code> <code class="type">text</code>
        </div>
        <div>
          Host name of the connected client, as reported by a reverse DNS lookup of
          <code class="structfield">client_addr</code>. This field will only be non-null for IP
          connections, and only when
          <a class="xref" href="runtime-config-logging.html#GUC-LOG-HOSTNAME">log_hostname</a> is
          enabled.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">client_port</code> <code class="type">integer</code>
        </div>
        <div>
          TCP port number that the client is using for communication with this WAL sender, or
          <code class="literal">-1</code> if a Unix socket is used
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">backend_start</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>
          Time when this process was started, i.e., when the client connected to this WAL sender
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">backend_xmin</code> <code class="type">xid</code>
        </div>
        <div>
          This standby's <code class="literal">xmin</code> horizon reported by
          <a class="xref" href="runtime-config-replication.html#GUC-HOT-STANDBY-FEEDBACK">hot_standby_feedback</a>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">state</code> <code class="type">text</code>
        </div>
        <div>Current WAL sender state. Possible values are:</div>
        <div class="itemizedlist">
          <ul class="itemizedlist">
            <li class="listitem">
              <div><code class="literal">startup</code>: This WAL sender is starting up.</div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">catchup</code>: This WAL sender's connected standby is
                catching up with the primary.
              </div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">streaming</code>: This WAL sender is streaming changes after
                its connected standby server has caught up with the primary.
              </div>
            </li>
            <li class="listitem">
              <div><code class="literal">backup</code>: This WAL sender is sending a backup.</div>
            </li>
            <li class="listitem">
              <div><code class="literal">stopping</code>: This WAL sender is stopping.</div>
            </li>
          </ul>
        </div>
        <div></div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">sent_lsn</code> <code class="type">pg_lsn</code>
        </div>
        <div>Last write-ahead log location sent on this connection</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">write_lsn</code> <code class="type">pg_lsn</code>
        </div>
        <div>Last write-ahead log location written to disk by this standby server</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">flush_lsn</code> <code class="type">pg_lsn</code>
        </div>
        <div>Last write-ahead log location flushed to disk by this standby server</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">replay_lsn</code> <code class="type">pg_lsn</code>
        </div>
        <div>Last write-ahead log location replayed into the database on this standby server</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">write_lag</code> <code class="type">interval</code>
        </div>
        <div>
          Time elapsed between flushing recent WAL locally and receiving notification that this
          standby server has written it (but not yet flushed it or applied it). This can be used to
          gauge the delay that
          <code class="literal">synchronous_commit</code> level
          <code class="literal">remote_write</code> incurred while committing if this server was
          configured as a synchronous standby.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">flush_lag</code> <code class="type">interval</code>
        </div>
        <div>
          Time elapsed between flushing recent WAL locally and receiving notification that this
          standby server has written and flushed it (but not yet applied it). This can be used to
          gauge the delay that
          <code class="literal">synchronous_commit</code> level
          <code class="literal">on</code> incurred while committing if this server was configured as
          a synchronous standby.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">replay_lag</code> <code class="type">interval</code>
        </div>
        <div>
          Time elapsed between flushing recent WAL locally and receiving notification that this
          standby server has written, flushed and applied it. This can be used to gauge the delay
          that
          <code class="literal">synchronous_commit</code> level
          <code class="literal">remote_apply</code> incurred while committing if this server was
          configured as a synchronous standby.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">sync_priority</code> <code class="type">integer</code>
        </div>
        <div>
          Priority of this standby server for being chosen as the synchronous standby in a
          priority-based synchronous replication. This has no effect in a quorum-based synchronous
          replication.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">sync_state</code> <code class="type">text</code>
        </div>
        <div>Synchronous state of this standby server. Possible values are:</div>
        <div class="itemizedlist">
          <ul class="itemizedlist">
            <li class="listitem">
              <div><code class="literal">async</code>: This standby server is asynchronous.</div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">potential</code>: This standby server is now asynchronous, but
                can potentially become synchronous if one of current synchronous ones fails.
              </div>
            </li>
            <li class="listitem">
              <div><code class="literal">sync</code>: This standby server is synchronous.</div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">quorum</code>: This standby server is considered as a
                candidate for quorum standbys.
              </div>
            </li>
          </ul>
        </div>
        <div></div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">reply_time</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Send time of last reply message received from standby server</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

The lag times reported in the `pg_stat_replication` view are measurements of the time taken for recent WAL to be written, flushed and replayed and for the sender to know about it. These times represent the commit delay that was (or would have been) introduced by each synchronous commit level, if the remote server was configured as a synchronous standby. For an asynchronous standby, the `replay_lag` column approximates the delay before recent transactions became visible to queries. If the standby server has entirely caught up with the sending server and there is no more WAL activity, the most recently measured lag times will continue to be displayed for a short time and then show NULL.

Lag times work automatically for physical replication. Logical decoding plugins may optionally emit tracking messages; if they do not, the tracking mechanism will simply display NULL lag.

### Note

The reported lag times are not predictions of how long it will take for the standby to catch up with the sending server assuming the current rate of replay. Such a system would show similar times while new WAL is being generated, but would differ when the sender becomes idle. In particular, when the standby has caught up completely, `pg_stat_replication` shows the time taken to write, flush and replay the most recent reported WAL location rather than zero as some users might expect. This is consistent with the goal of measuring synchronous commit and transaction visibility delays for recent write transactions. To reduce confusion for users expecting a different model of lag, the lag columns revert to NULL after a short time on a fully replayed idle system. Monitoring systems should choose whether to represent this as missing data, zero or continue to display the last known value.

[#id](#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW)

### 28.2.5. `pg_stat_replication_slots` [#](#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW)

The `pg_stat_replication_slots` view will contain one row per logical replication slot, showing statistics about its usage.

[#id](#PG-STAT-REPLICATION-SLOTS-VIEW)

**Table 28.15. `pg_stat_replication_slots` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_replication_slots View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">slot_name</code> <code class="type">text</code>
        </div>
        <div>A unique, cluster-wide identifier for the replication slot</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">spill_txns</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of transactions spilled to disk once the memory used by logical decoding to decode
          changes from WAL has exceeded
          <code class="literal">logical_decoding_work_mem</code>. The counter gets incremented for
          both top-level transactions and subtransactions.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">spill_count</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of times transactions were spilled to disk while decoding changes from WAL for this
          slot. This counter is incremented each time a transaction is spilled, and the same
          transaction may be spilled multiple times.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">spill_bytes</code> <code class="type">bigint</code>
        </div>
        <div>
          Amount of decoded transaction data spilled to disk while performing decoding of changes
          from WAL for this slot. This and other spill counters can be used to gauge the I/O which
          occurred during logical decoding and allow tuning
          <code class="literal">logical_decoding_work_mem</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">stream_txns</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of in-progress transactions streamed to the decoding output plugin after the memory
          used by logical decoding to decode changes from WAL for this slot has exceeded
          <code class="literal">logical_decoding_work_mem</code>. Streaming only works with
          top-level transactions (subtransactions can't be streamed independently), so the counter
          is not incremented for subtransactions.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">stream_count</code><code class="type">bigint</code>
        </div>
        <div>
          Number of times in-progress transactions were streamed to the decoding output plugin while
          decoding changes from WAL for this slot. This counter is incremented each time a
          transaction is streamed, and the same transaction may be streamed multiple times.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">stream_bytes</code><code class="type">bigint</code>
        </div>
        <div>
          Amount of transaction data decoded for streaming in-progress transactions to the decoding
          output plugin while decoding changes from WAL for this slot. This and other streaming
          counters for this slot can be used to tune
          <code class="literal">logical_decoding_work_mem</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">total_txns</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of decoded transactions sent to the decoding output plugin for this slot. This
          counts top-level transactions only, and is not incremented for subtransactions. Note that
          this includes the transactions that are streamed and/or spilled.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">total_bytes</code><code class="type">bigint</code>
        </div>
        <div>
          Amount of transaction data decoded for sending transactions to the decoding output plugin
          while decoding changes from WAL for this slot. Note that this includes data that is
          streamed and/or spilled.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">stats_reset</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Time at which these statistics were last reset</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STAT-WAL-RECEIVER-VIEW)

### 28.2.6. `pg_stat_wal_receiver` [#](#MONITORING-PG-STAT-WAL-RECEIVER-VIEW)

The `pg_stat_wal_receiver` view will contain only one row, showing statistics about the WAL receiver from that receiver's connected server.

[#id](#PG-STAT-WAL-RECEIVER-VIEW)

**Table 28.16. `pg_stat_wal_receiver` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_wal_receiver View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">pid</code> <code class="type">integer</code>
        </div>
        <div>Process ID of the WAL receiver process</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">status</code> <code class="type">text</code>
        </div>
        <div>Activity status of the WAL receiver process</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">receive_start_lsn</code> <code class="type">pg_lsn</code>
        </div>
        <div>First write-ahead log location used when WAL receiver is started</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">receive_start_tli</code> <code class="type">integer</code>
        </div>
        <div>First timeline number used when WAL receiver is started</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">written_lsn</code> <code class="type">pg_lsn</code>
        </div>
        <div>
          Last write-ahead log location already received and written to disk, but not flushed. This
          should not be used for data integrity checks.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">flushed_lsn</code> <code class="type">pg_lsn</code>
        </div>
        <div>
          Last write-ahead log location already received and flushed to disk, the initial value of
          this field being the first log location used when WAL receiver is started
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">received_tli</code> <code class="type">integer</code>
        </div>
        <div>
          Timeline number of last write-ahead log location received and flushed to disk, the initial
          value of this field being the timeline number of the first log location used when WAL
          receiver is started
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_msg_send_time</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Send time of last message received from origin WAL sender</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_msg_receipt_time</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Receipt time of last message received from origin WAL sender</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">latest_end_lsn</code> <code class="type">pg_lsn</code>
        </div>
        <div>Last write-ahead log location reported to origin WAL sender</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">latest_end_time</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Time of last write-ahead log location reported to origin WAL sender</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">slot_name</code> <code class="type">text</code>
        </div>
        <div>Replication slot name used by this WAL receiver</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">sender_host</code> <code class="type">text</code>
        </div>
        <div>
          Host of the <span class="productname">PostgreSQL</span> instance this WAL receiver is
          connected to. This can be a host name, an IP address, or a directory path if the
          connection is via Unix socket. (The path case can be distinguished because it will always
          be an absolute path, beginning with <code class="literal">/</code>.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">sender_port</code> <code class="type">integer</code>
        </div>
        <div>
          Port number of the <span class="productname">PostgreSQL</span> instance this WAL receiver
          is connected to.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">conninfo</code> <code class="type">text</code>
        </div>
        <div>
          Connection string used by this WAL receiver, with security-sensitive fields obfuscated.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STAT-RECOVERY-PREFETCH)

### 28.2.7. `pg_stat_recovery_prefetch` [#](#MONITORING-PG-STAT-RECOVERY-PREFETCH)

The `pg_stat_recovery_prefetch` view will contain only one row. The columns `wal_distance`, `block_distance` and `io_depth` show current values, and the other columns show cumulative counters that can be reset with the `pg_stat_reset_shared` function.

[#id](#PG-STAT-RECOVERY-PREFETCH-VIEW)

**Table 28.17. `pg_stat_recovery_prefetch` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_recovery_prefetch View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">stats_reset</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Time at which these statistics were last reset</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">prefetch</code> <code class="type">bigint</code>
        </div>
        <div>Number of blocks prefetched because they were not in the buffer pool</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">hit</code> <code class="type">bigint</code>
        </div>
        <div>Number of blocks not prefetched because they were already in the buffer pool</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">skip_init</code> <code class="type">bigint</code>
        </div>
        <div>Number of blocks not prefetched because they would be zero-initialized</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">skip_new</code> <code class="type">bigint</code>
        </div>
        <div>Number of blocks not prefetched because they didn't exist yet</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">skip_fpw</code> <code class="type">bigint</code>
        </div>
        <div>Number of blocks not prefetched because a full page image was included in the WAL</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">skip_rep</code> <code class="type">bigint</code>
        </div>
        <div>Number of blocks not prefetched because they were already recently prefetched</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">wal_distance</code> <code class="type">int</code>
        </div>
        <div>How many bytes ahead the prefetcher is looking</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">block_distance</code> <code class="type">int</code>
        </div>
        <div>How many blocks ahead the prefetcher is looking</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">io_depth</code> <code class="type">int</code>
        </div>
        <div>How many prefetches have been initiated but are not yet known to have completed</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STAT-SUBSCRIPTION)

### 28.2.8. `pg_stat_subscription` [#](#MONITORING-PG-STAT-SUBSCRIPTION)

[#id](#PG-STAT-SUBSCRIPTION)

**Table 28.18. `pg_stat_subscription` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_subscription View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">subid</code> <code class="type">oid</code>
        </div>
        <div>OID of the subscription</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">subname</code> <code class="type">name</code>
        </div>
        <div>Name of the subscription</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">worker_type</code> <code class="type">text</code>
        </div>
        <div>
          Type of the subscription worker process. Possible types are
          <code class="literal">apply</code>, <code class="literal">parallel apply</code>, and
          <code class="literal">table synchronization</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">pid</code> <code class="type">integer</code>
        </div>
        <div>Process ID of the subscription worker process</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">leader_pid</code> <code class="type">integer</code>
        </div>
        <div>
          Process ID of the leader apply worker if this process is a parallel apply worker; NULL if
          this process is a leader apply worker or a table synchronization worker
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">relid</code> <code class="type">oid</code>
        </div>
        <div>
          OID of the relation that the worker is synchronizing; NULL for the leader apply worker and
          parallel apply workers
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">received_lsn</code> <code class="type">pg_lsn</code>
        </div>
        <div>
          Last write-ahead log location received, the initial value of this field being 0; NULL for
          parallel apply workers
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_msg_send_time</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>
          Send time of last message received from origin WAL sender; NULL for parallel apply workers
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_msg_receipt_time</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>
          Receipt time of last message received from origin WAL sender; NULL for parallel apply
          workers
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">latest_end_lsn</code> <code class="type">pg_lsn</code>
        </div>
        <div>
          Last write-ahead log location reported to origin WAL sender; NULL for parallel apply
          workers
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">latest_end_time</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>
          Time of last write-ahead log location reported to origin WAL sender; NULL for parallel
          apply workers
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STAT-SUBSCRIPTION-STATS)

### 28.2.9. `pg_stat_subscription_stats` [#](#MONITORING-PG-STAT-SUBSCRIPTION-STATS)

The `pg_stat_subscription_stats` view will contain one row per subscription.

[#id](#PG-STAT-SUBSCRIPTION-STATS)

**Table 28.19. `pg_stat_subscription_stats` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_subscription_stats View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">subid</code> <code class="type">oid</code>
        </div>
        <div>OID of the subscription</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">subname</code> <code class="type">name</code>
        </div>
        <div>Name of the subscription</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">apply_error_count</code> <code class="type">bigint</code>
        </div>
        <div>Number of times an error occurred while applying changes</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">sync_error_count</code> <code class="type">bigint</code>
        </div>
        <div>Number of times an error occurred during the initial table synchronization</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">stats_reset</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Time at which these statistics were last reset</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STAT-SSL-VIEW)

### 28.2.10. `pg_stat_ssl` [#](#MONITORING-PG-STAT-SSL-VIEW)

The `pg_stat_ssl` view will contain one row per backend or WAL sender process, showing statistics about SSL usage on this connection. It can be joined to `pg_stat_activity` or `pg_stat_replication` on the `pid` column to get more details about the connection.

[#id](#PG-STAT-SSL-VIEW)

**Table 28.20. `pg_stat_ssl` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_ssl View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">pid</code> <code class="type">integer</code>
        </div>
        <div>Process ID of a backend or WAL sender process</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">ssl</code> <code class="type">boolean</code>
        </div>
        <div>True if SSL is used on this connection</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">version</code> <code class="type">text</code>
        </div>
        <div>Version of SSL in use, or NULL if SSL is not in use on this connection</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">cipher</code> <code class="type">text</code>
        </div>
        <div>Name of SSL cipher in use, or NULL if SSL is not in use on this connection</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">bits</code> <code class="type">integer</code>
        </div>
        <div>
          Number of bits in the encryption algorithm used, or NULL if SSL is not used on this
          connection
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">client_dn</code> <code class="type">text</code>
        </div>
        <div>
          Distinguished Name (DN) field from the client certificate used, or NULL if no client
          certificate was supplied or if SSL is not in use on this connection. This field is
          truncated if the DN field is longer than <code class="symbol">NAMEDATALEN</code> (64
          characters in a standard build).
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">client_serial</code> <code class="type">numeric</code>
        </div>
        <div>
          Serial number of the client certificate, or NULL if no client certificate was supplied or
          if SSL is not in use on this connection. The combination of certificate serial number and
          certificate issuer uniquely identifies a certificate (unless the issuer erroneously reuses
          serial numbers).
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">issuer_dn</code> <code class="type">text</code>
        </div>
        <div>
          DN of the issuer of the client certificate, or NULL if no client certificate was supplied
          or if SSL is not in use on this connection. This field is truncated like
          <code class="structfield">client_dn</code>.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STAT-GSSAPI-VIEW)

### 28.2.11. `pg_stat_gssapi` [#](#MONITORING-PG-STAT-GSSAPI-VIEW)

The `pg_stat_gssapi` view will contain one row per backend, showing information about GSSAPI usage on this connection. It can be joined to `pg_stat_activity` or `pg_stat_replication` on the `pid` column to get more details about the connection.

[#id](#PG-STAT-GSSAPI-VIEW)

**Table 28.21. `pg_stat_gssapi` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_gssapi View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">pid</code> <code class="type">integer</code>
        </div>
        <div>Process ID of a backend</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">gss_authenticated</code> <code class="type">boolean</code>
        </div>
        <div>True if GSSAPI authentication was used for this connection</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">principal</code> <code class="type">text</code>
        </div>
        <div>
          Principal used to authenticate this connection, or NULL if GSSAPI was not used to
          authenticate this connection. This field is truncated if the principal is longer than
          <code class="symbol">NAMEDATALEN</code> (64 characters in a standard build).
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">encrypted</code> <code class="type">boolean</code>
        </div>
        <div>True if GSSAPI encryption is in use on this connection</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">credentials_delegated</code> <code class="type">boolean</code>
        </div>
        <div>True if GSSAPI credentials were delegated on this connection.</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STAT-ARCHIVER-VIEW)

### 28.2.12. `pg_stat_archiver` [#](#MONITORING-PG-STAT-ARCHIVER-VIEW)

The `pg_stat_archiver` view will always have a single row, containing data about the archiver process of the cluster.

[#id](#PG-STAT-ARCHIVER-VIEW)

**Table 28.22. `pg_stat_archiver` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_archiver View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">archived_count</code> <code class="type">bigint</code>
        </div>
        <div>Number of WAL files that have been successfully archived</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_archived_wal</code> <code class="type">text</code>
        </div>
        <div>Name of the WAL file most recently successfully archived</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_archived_time</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Time of the most recent successful archive operation</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">failed_count</code> <code class="type">bigint</code>
        </div>
        <div>Number of failed attempts for archiving WAL files</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_failed_wal</code> <code class="type">text</code>
        </div>
        <div>Name of the WAL file of the most recent failed archival operation</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_failed_time</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Time of the most recent failed archival operation</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">stats_reset</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Time at which these statistics were last reset</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

Normally, WAL files are archived in order, oldest to newest, but that is not guaranteed, and does not hold under special circumstances like when promoting a standby or after crash recovery. Therefore it is not safe to assume that all files older than `last_archived_wal` have also been successfully archived.

[#id](#MONITORING-PG-STAT-IO-VIEW)

### 28.2.13. `pg_stat_io` [#](#MONITORING-PG-STAT-IO-VIEW)

The `pg_stat_io` view will contain one row for each combination of backend type, target I/O object, and I/O context, showing cluster-wide I/O statistics. Combinations which do not make sense are omitted.

Currently, I/O on relations (e.g. tables, indexes) is tracked. However, relation I/O which bypasses shared buffers (e.g. when moving a table from one tablespace to another) is currently not tracked.

[#id](#PG-STAT-IO-VIEW)

**Table 28.23. `pg_stat_io` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_io View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">backend_type</code> <code class="type">text</code>
        </div>
        <div>
          Type of backend (e.g. background worker, autovacuum worker). See
          <a class="link" href="monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW" title="28.2.3.&nbsp;pg_stat_activity">pg_stat_activity</a>
          for more information on <code class="varname">backend_type</code>s. Some
          <code class="varname">backend_type</code>s do not accumulate I/O operation statistics and
          will not be included in the view.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">object</code> <code class="type">text</code>
        </div>
        <div>Target object of an I/O operation. Possible values are:</div>
        <div class="itemizedlist">
          <ul class="itemizedlist" >
            <li class="listitem">
              <div><code class="literal">relation</code>: Permanent relations.</div>
            </li>
            <li class="listitem">
              <div><code class="literal">temp relation</code>: Temporary relations.</div>
            </li>
          </ul>
        </div>
        <div></div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">context</code> <code class="type">text</code>
        </div>
        <div>The context of an I/O operation. Possible values are:</div>
        <div class="itemizedlist">
          <ul class="itemizedlist" >
            <li class="listitem">
              <div>
                <code class="literal">normal</code>: The default or standard
                <code class="varname">context</code> for a type of I/O operation. For example, by
                default, relation data is read into and written out from shared buffers. Thus, reads
                and writes of relation data to and from shared buffers are tracked in
                <code class="varname">context</code> <code class="literal">normal</code>.
              </div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">vacuum</code>: I/O operations performed outside of shared
                buffers while vacuuming and analyzing permanent relations. Temporary table vacuums
                use the same local buffer pool as other temporary table IO operations and are
                tracked in <code class="varname">context</code> <code class="literal">normal</code>.
              </div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">bulkread</code>: Certain large read I/O operations done
                outside of shared buffers, for example, a sequential scan of a large table.
              </div>
            </li>
            <li class="listitem">
              <div>
                <code class="literal">bulkwrite</code>: Certain large write I/O operations done
                outside of shared buffers, such as <code class="command">COPY</code>.
              </div>
            </li>
          </ul>
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">reads</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of read operations, each of the size specified in
          <code class="varname">op_bytes</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">read_time</code> <code class="type">double precision</code>
        </div>
        <div>
          Time spent in read operations in milliseconds (if
          <a class="xref" href="runtime-config-statistics.html#GUC-TRACK-IO-TIMING">track_io_timing</a>
          is enabled, otherwise zero)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">writes</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of write operations, each of the size specified in
          <code class="varname">op_bytes</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">write_time</code> <code class="type">double precision</code>
        </div>
        <div>
          Time spent in write operations in milliseconds (if
          <a class="xref" href="runtime-config-statistics.html#GUC-TRACK-IO-TIMING">track_io_timing</a>
          is enabled, otherwise zero)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">writebacks</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of units of size <code class="varname">op_bytes</code> which the process requested
          the kernel write out to permanent storage.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">writeback_time</code> <code class="type">double precision</code>
        </div>
        <div>
          Time spent in writeback operations in milliseconds (if
          <a class="xref" href="runtime-config-statistics.html#GUC-TRACK-IO-TIMING">track_io_timing</a>
          is enabled, otherwise zero). This includes the time spent queueing write-out requests and,
          potentially, the time spent to write out the dirty data.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">extends</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of relation extend operations, each of the size specified in
          <code class="varname">op_bytes</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">extend_time</code> <code class="type">double precision</code>
        </div>
        <div>
          Time spent in extend operations in milliseconds (if
          <a class="xref" href="runtime-config-statistics.html#GUC-TRACK-IO-TIMING">track_io_timing</a>
          is enabled, otherwise zero)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">op_bytes</code> <code class="type">bigint</code>
        </div>
        <div>The number of bytes per unit of I/O read, written, or extended.</div>
        <div>
          Relation data reads, writes, and extends are done in
          <code class="varname">block_size</code> units, derived from the build-time parameter
          <code class="symbol">BLCKSZ</code>, which is <code class="literal">8192</code> by default.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">hits</code> <code class="type">bigint</code>
        </div>
        <div>The number of times a desired block was found in a shared buffer.</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">evictions</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of times a block has been written out from a shared or local buffer in order to
          make it available for another use.
        </div>
        <div>
          In <code class="varname">context</code> <code class="literal">normal</code>, this counts
          the number of times a block was evicted from a buffer and replaced with another block. In
          <code class="varname">context</code>s <code class="literal">bulkwrite</code>,
          <code class="literal">bulkread</code>, and <code class="literal">vacuum</code>, this
          counts the number of times a block was evicted from shared buffers in order to add the
          shared buffer to a separate, size-limited ring buffer for use in a bulk I/O operation.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">reuses</code> <code class="type">bigint</code>
        </div>
        <div>
          The number of times an existing buffer in a size-limited ring buffer outside of shared
          buffers was reused as part of an I/O operation in the
          <code class="literal">bulkread</code>, <code class="literal">bulkwrite</code>, or
          <code class="literal">vacuum</code> <code class="varname">context</code>s.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">fsyncs</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of <code class="literal">fsync</code> calls. These are only tracked in
          <code class="varname">context</code> <code class="literal">normal</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">fsync_time</code> <code class="type">double precision</code>
        </div>
        <div>
          Time spent in fsync operations in milliseconds (if
          <a class="xref" href="runtime-config-statistics.html#GUC-TRACK-IO-TIMING">track_io_timing</a>
          is enabled, otherwise zero)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">stats_reset</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Time at which these statistics were last reset.</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

Some backend types never perform I/O operations on some I/O objects and/or in some I/O contexts. These rows are omitted from the view. For example, the checkpointer does not checkpoint temporary tables, so there will be no rows for `backend_type` `checkpointer` and `object` `temp relation`.

In addition, some I/O operations will never be performed either by certain backend types or on certain I/O objects and/or in certain I/O contexts. These cells will be NULL. For example, temporary tables are not `fsync`ed, so `fsyncs` will be NULL for `object` `temp relation`. Also, the background writer does not perform reads, so `reads` will be NULL in rows for `backend_type` `background writer`.

`pg_stat_io` can be used to inform database tuning. For example:

- A high `evictions` count can indicate that shared buffers should be increased.

- Client backends rely on the checkpointer to ensure data is persisted to permanent storage. Large numbers of `fsyncs` by `client backend`s could indicate a misconfiguration of shared buffers or of the checkpointer. More information on configuring the checkpointer can be found in [Section 30.5](wal-configuration).

- Normally, client backends should be able to rely on auxiliary processes like the checkpointer and the background writer to write out dirty data as much as possible. Large numbers of writes by client backends could indicate a misconfiguration of shared buffers or of the checkpointer. More information on configuring the checkpointer can be found in [Section 30.5](wal-configuration).

### Note

Columns tracking I/O time will only be non-zero when [track_io_timing](runtime-config-statistics#GUC-TRACK-IO-TIMING) is enabled. The user should be careful when referencing these columns in combination with their corresponding IO operations in case `track_io_timing` was not enabled for the entire time since the last stats reset.

[#id](#MONITORING-PG-STAT-BGWRITER-VIEW)

### 28.2.14. `pg_stat_bgwriter` [#](#MONITORING-PG-STAT-BGWRITER-VIEW)

The `pg_stat_bgwriter` view will always have a single row, containing global data for the cluster.

[#id](#PG-STAT-BGWRITER-VIEW)

**Table 28.24. `pg_stat_bgwriter` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_bgwriter View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">checkpoints_timed</code> <code class="type">bigint</code>
        </div>
        <div>Number of scheduled checkpoints that have been performed</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">checkpoints_req</code> <code class="type">bigint</code>
        </div>
        <div>Number of requested checkpoints that have been performed</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">checkpoint_write_time</code>
          <code class="type">double precision</code>
        </div>
        <div>
          Total amount of time that has been spent in the portion of checkpoint processing where
          files are written to disk, in milliseconds
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">checkpoint_sync_time</code>
          <code class="type">double precision</code>
        </div>
        <div>
          Total amount of time that has been spent in the portion of checkpoint processing where
          files are synchronized to disk, in milliseconds
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">buffers_checkpoint</code> <code class="type">bigint</code>
        </div>
        <div>Number of buffers written during checkpoints</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">buffers_clean</code> <code class="type">bigint</code>
        </div>
        <div>Number of buffers written by the background writer</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">maxwritten_clean</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of times the background writer stopped a cleaning scan because it had written too
          many buffers
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">buffers_backend</code> <code class="type">bigint</code>
        </div>
        <div>Number of buffers written directly by a backend</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">buffers_backend_fsync</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of times a backend had to execute its own
          <code class="function">fsync</code> call (normally the background writer handles those
          even when the backend does its own write)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">buffers_alloc</code> <code class="type">bigint</code>
        </div>
        <div>Number of buffers allocated</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">stats_reset</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Time at which these statistics were last reset</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STAT-WAL-VIEW)

### 28.2.15. `pg_stat_wal` [#](#MONITORING-PG-STAT-WAL-VIEW)

The `pg_stat_wal` view will always have a single row, containing data about WAL activity of the cluster.

[#id](#PG-STAT-WAL-VIEW)

**Table 28.25. `pg_stat_wal` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_wal View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">wal_records</code> <code class="type">bigint</code>
        </div>
        <div>Total number of WAL records generated</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">wal_fpi</code> <code class="type">bigint</code>
        </div>
        <div>Total number of WAL full page images generated</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">wal_bytes</code> <code class="type">numeric</code>
        </div>
        <div>Total amount of WAL generated in bytes</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">wal_buffers_full</code> <code class="type">bigint</code>
        </div>
        <div>Number of times WAL data was written to disk because WAL buffers became full</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">wal_write</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of times WAL buffers were written out to disk via
          <code class="function">XLogWrite</code> request. See
          <a class="xref" href="wal-configuration.html" title="30.5.&nbsp;WAL Configuration">Section&nbsp;30.5</a>
          for more information about the internal WAL function
          <code class="function">XLogWrite</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">wal_sync</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of times WAL files were synced to disk via
          <code class="function">issue_xlog_fsync</code> request (if
          <a class="xref" href="runtime-config-wal.html#GUC-FSYNC">fsync</a> is
          <code class="literal">on</code> and
          <a class="xref" href="runtime-config-wal.html#GUC-WAL-SYNC-METHOD">wal_sync_method</a> is
          either <code class="literal">fdatasync</code>, <code class="literal">fsync</code> or
          <code class="literal">fsync_writethrough</code>, otherwise zero). See
          <a class="xref" href="wal-configuration.html" title="30.5.&nbsp;WAL Configuration">Section&nbsp;30.5</a>
          for more information about the internal WAL function
          <code class="function">issue_xlog_fsync</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">wal_write_time</code> <code class="type">double precision</code>
        </div>
        <div>
          Total amount of time spent writing WAL buffers to disk via
          <code class="function">XLogWrite</code> request, in milliseconds (if
          <a class="xref" href="runtime-config-statistics.html#GUC-TRACK-WAL-IO-TIMING">track_wal_io_timing</a>
          is enabled, otherwise zero). This includes the sync time when
          <code class="varname">wal_sync_method</code> is either
          <code class="literal">open_datasync</code> or <code class="literal">open_sync</code>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">wal_sync_time</code> <code class="type">double precision</code>
        </div>
        <div>
          Total amount of time spent syncing WAL files to disk via
          <code class="function">issue_xlog_fsync</code> request, in milliseconds (if
          <code class="varname">track_wal_io_timing</code> is enabled,
          <code class="varname">fsync</code> is <code class="literal">on</code>, and
          <code class="varname">wal_sync_method</code> is either
          <code class="literal">fdatasync</code>, <code class="literal">fsync</code> or
          <code class="literal">fsync_writethrough</code>, otherwise zero).
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">stats_reset</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Time at which these statistics were last reset</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STAT-DATABASE-VIEW)

### 28.2.16. `pg_stat_database` [#](#MONITORING-PG-STAT-DATABASE-VIEW)

The `pg_stat_database` view will contain one row for each database in the cluster, plus one for shared objects, showing database-wide statistics.

[#id](#PG-STAT-DATABASE-VIEW)

**Table 28.26. `pg_stat_database` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_database View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">datid</code> <code class="type">oid</code>
        </div>
        <div>OID of this database, or 0 for objects belonging to a shared relation</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">datname</code> <code class="type">name</code>
        </div>
        <div>Name of this database, or <code class="literal">NULL</code> for shared objects.</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">numbackends</code> <code class="type">integer</code>
        </div>
        <div>
          Number of backends currently connected to this database, or
          <code class="literal">NULL</code> for shared objects. This is the only column in this view
          that returns a value reflecting current state; all other columns return the accumulated
          values since the last reset.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">xact_commit</code> <code class="type">bigint</code>
        </div>
        <div>Number of transactions in this database that have been committed</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">xact_rollback</code> <code class="type">bigint</code>
        </div>
        <div>Number of transactions in this database that have been rolled back</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">blks_read</code> <code class="type">bigint</code>
        </div>
        <div>Number of disk blocks read in this database</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">blks_hit</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of times disk blocks were found already in the buffer cache, so that a read was not
          necessary (this only includes hits in the PostgreSQL buffer cache, not the operating
          system's file system cache)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">tup_returned</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of live rows fetched by sequential scans and index entries returned by index scans
          in this database
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">tup_fetched</code> <code class="type">bigint</code>
        </div>
        <div>Number of live rows fetched by index scans in this database</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">tup_inserted</code> <code class="type">bigint</code>
        </div>
        <div>Number of rows inserted by queries in this database</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">tup_updated</code> <code class="type">bigint</code>
        </div>
        <div>Number of rows updated by queries in this database</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">tup_deleted</code> <code class="type">bigint</code>
        </div>
        <div>Number of rows deleted by queries in this database</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">conflicts</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of queries canceled due to conflicts with recovery in this database. (Conflicts
          occur only on standby servers; see
          <a
            class="link"
            href="monitoring-stats.html#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW"
            title="28.2.17.&nbsp;pg_stat_database_conflicts">pg_stat_database_conflicts</a>
          for details.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">temp_files</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of temporary files created by queries in this database. All temporary files are
          counted, regardless of why the temporary file was created (e.g., sorting or hashing), and
          regardless of the
          <a class="xref" href="runtime-config-logging.html#GUC-LOG-TEMP-FILES">log_temp_files</a>
          setting.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">temp_bytes</code> <code class="type">bigint</code>
        </div>
        <div>
          Total amount of data written to temporary files by queries in this database. All temporary
          files are counted, regardless of why the temporary file was created, and regardless of the
          <a class="xref" href="runtime-config-logging.html#GUC-LOG-TEMP-FILES">log_temp_files</a>
          setting.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">deadlocks</code> <code class="type">bigint</code>
        </div>
        <div>Number of deadlocks detected in this database</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">checksum_failures</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of data page checksum failures detected in this database (or on a shared object),
          or NULL if data checksums are not enabled.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">checksum_last_failure</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>
          Time at which the last data page checksum failure was detected in this database (or on a
          shared object), or NULL if data checksums are not enabled.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">blk_read_time</code> <code class="type">double precision</code>
        </div>
        <div>
          Time spent reading data file blocks by backends in this database, in milliseconds (if
          <a class="xref" href="runtime-config-statistics.html#GUC-TRACK-IO-TIMING">track_io_timing</a>
          is enabled, otherwise zero)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">blk_write_time</code> <code class="type">double precision</code>
        </div>
        <div>
          Time spent writing data file blocks by backends in this database, in milliseconds (if
          <a class="xref" href="runtime-config-statistics.html#GUC-TRACK-IO-TIMING">track_io_timing</a>
          is enabled, otherwise zero)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">session_time</code> <code class="type">double precision</code>
        </div>
        <div>
          Time spent by database sessions in this database, in milliseconds (note that statistics
          are only updated when the state of a session changes, so if sessions have been idle for a
          long time, this idle time won't be included)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">active_time</code> <code class="type">double precision</code>
        </div>
        <div>
          Time spent executing SQL statements in this database, in milliseconds (this corresponds to
          the states <code class="literal">active</code> and
          <code class="literal">fastpath function call</code> in
          <a
            class="link"
            href="monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW"
            title="28.2.3.&nbsp;pg_stat_activity">pg_stat_activity</a>)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">idle_in_transaction_time</code>
          <code class="type">double precision</code>
        </div>
        <div>
          Time spent idling while in a transaction in this database, in milliseconds (this
          corresponds to the states <code class="literal">idle in transaction</code> and
          <code class="literal">idle in transaction (aborted)</code> in
          <a
            class="link"
            href="monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW"
            title="28.2.3.&nbsp;pg_stat_activity">pg_stat_activity</a>)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">sessions</code> <code class="type">bigint</code>
        </div>
        <div>Total number of sessions established to this database</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">sessions_abandoned</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of database sessions to this database that were terminated because connection to
          the client was lost
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">sessions_fatal</code> <code class="type">bigint</code>
        </div>
        <div>Number of database sessions to this database that were terminated by fatal errors</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">sessions_killed</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of database sessions to this database that were terminated by operator intervention
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">stats_reset</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Time at which these statistics were last reset</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW)

### 28.2.17. `pg_stat_database_conflicts` [#](#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW)

The `pg_stat_database_conflicts` view will contain one row per database, showing database-wide statistics about query cancels occurring due to conflicts with recovery on standby servers. This view will only contain information on standby servers, since conflicts do not occur on primary servers.

[#id](#PG-STAT-DATABASE-CONFLICTS-VIEW)

**Table 28.27. `pg_stat_database_conflicts` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_database_conflicts View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">datid</code> <code class="type">oid</code>
        </div>
        <div>OID of a database</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">datname</code> <code class="type">name</code>
        </div>
        <div>Name of this database</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">confl_tablespace</code> <code class="type">bigint</code>
        </div>
        <div>Number of queries in this database that have been canceled due to dropped tablespaces</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">confl_lock</code> <code class="type">bigint</code>
        </div>
        <div>Number of queries in this database that have been canceled due to lock timeouts</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">confl_snapshot</code> <code class="type">bigint</code>
        </div>
        <div>Number of queries in this database that have been canceled due to old snapshots</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">confl_bufferpin</code> <code class="type">bigint</code>
        </div>
        <div>Number of queries in this database that have been canceled due to pinned buffers</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">confl_deadlock</code> <code class="type">bigint</code>
        </div>
        <div>Number of queries in this database that have been canceled due to deadlocks</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">confl_active_logicalslot</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of uses of logical slots in this database that have been canceled due to old
          snapshots or too low a
          <a class="xref" href="runtime-config-wal.html#GUC-WAL-LEVEL">wal_level</a>
          on the primary
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STAT-ALL-TABLES-VIEW)

### 28.2.18. `pg_stat_all_tables` [#](#MONITORING-PG-STAT-ALL-TABLES-VIEW)

The `pg_stat_all_tables` view will contain one row for each table in the current database (including TOAST tables), showing statistics about accesses to that specific table. The `pg_stat_user_tables` and `pg_stat_sys_tables` views contain the same information, but filtered to only show user and system tables respectively.

[#id](#PG-STAT-ALL-TABLES-VIEW)

**Table 28.28. `pg_stat_all_tables` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_all_tables View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">relid</code> <code class="type">oid</code>
        </div>
        <div>OID of a table</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">schemaname</code> <code class="type">name</code>
        </div>
        <div>Name of the schema that this table is in</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">relname</code> <code class="type">name</code>
        </div>
        <div>Name of this table</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">seq_scan</code> <code class="type">bigint</code>
        </div>
        <div>Number of sequential scans initiated on this table</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_seq_scan</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>
          The time of the last sequential scan on this table, based on the most recent transaction
          stop time
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">seq_tup_read</code> <code class="type">bigint</code>
        </div>
        <div>Number of live rows fetched by sequential scans</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">idx_scan</code> <code class="type">bigint</code>
        </div>
        <div>Number of index scans initiated on this table</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_idx_scan</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>
          The time of the last index scan on this table, based on the most recent transaction stop
          time
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">idx_tup_fetch</code> <code class="type">bigint</code>
        </div>
        <div>Number of live rows fetched by index scans</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">n_tup_ins</code> <code class="type">bigint</code>
        </div>
        <div>Total number of rows inserted</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">n_tup_upd</code> <code class="type">bigint</code>
        </div>
        <div>
          Total number of rows updated. (This includes row updates counted in
          <code class="structfield">n_tup_hot_upd</code> and
          <code class="structfield">n_tup_newpage_upd</code>, and remaining non-<acronym
            class="acronym">HOT</acronym>
          updates.)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">n_tup_del</code> <code class="type">bigint</code>
        </div>
        <div>Total number of rows deleted</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">n_tup_hot_upd</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of rows
          <a class="link" href="storage-hot.html" title="73.7.&nbsp;Heap-Only Tuples (HOT)">HOT updated</a>. These are updates where no successor versions are required in indexes.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">n_tup_newpage_upd</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of rows updated where the successor version goes onto a
          <span class="emphasis"><em>new</em></span> heap page, leaving behind an original version
          with a
          <a
            class="link"
            href="storage-page-layout.html#STORAGE-TUPLE-LAYOUT"
            title="73.6.1.&nbsp;Table Row Layout"><code class="structfield">t_ctid</code> field</a>
          that points to a different heap page. These are always non-<acronym class="acronym">HOT</acronym>
          updates.
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">n_live_tup</code> <code class="type">bigint</code>
        </div>
        <div>Estimated number of live rows</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">n_dead_tup</code> <code class="type">bigint</code>
        </div>
        <div>Estimated number of dead rows</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">n_mod_since_analyze</code> <code class="type">bigint</code>
        </div>
        <div>Estimated number of rows modified since this table was last analyzed</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">n_ins_since_vacuum</code> <code class="type">bigint</code>
        </div>
        <div>Estimated number of rows inserted since this table was last vacuumed</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_vacuum</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>
          Last time at which this table was manually vacuumed (not counting
          <code class="command">VACUUM FULL</code>)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_autovacuum</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Last time at which this table was vacuumed by the autovacuum daemon</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_analyze</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Last time at which this table was manually analyzed</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_autoanalyze</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Last time at which this table was analyzed by the autovacuum daemon</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">vacuum_count</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of times this table has been manually vacuumed (not counting
          <code class="command">VACUUM FULL</code>)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">autovacuum_count</code> <code class="type">bigint</code>
        </div>
        <div>Number of times this table has been vacuumed by the autovacuum daemon</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">analyze_count</code> <code class="type">bigint</code>
        </div>
        <div>Number of times this table has been manually analyzed</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">autoanalyze_count</code> <code class="type">bigint</code>
        </div>
        <div>Number of times this table has been analyzed by the autovacuum daemon</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STAT-ALL-INDEXES-VIEW)

### 28.2.19. `pg_stat_all_indexes` [#](#MONITORING-PG-STAT-ALL-INDEXES-VIEW)

The `pg_stat_all_indexes` view will contain one row for each index in the current database, showing statistics about accesses to that specific index. The `pg_stat_user_indexes` and `pg_stat_sys_indexes` views contain the same information, but filtered to only show user and system indexes respectively.

[#id](#PG-STAT-ALL-INDEXES-VIEW)

**Table 28.29. `pg_stat_all_indexes` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_all_indexes View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">relid</code> <code class="type">oid</code>
        </div>
        <div>OID of the table for this index</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">indexrelid</code> <code class="type">oid</code>
        </div>
        <div>OID of this index</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">schemaname</code> <code class="type">name</code>
        </div>
        <div>Name of the schema this index is in</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">relname</code> <code class="type">name</code>
        </div>
        <div>Name of the table for this index</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">indexrelname</code> <code class="type">name</code>
        </div>
        <div>Name of this index</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">idx_scan</code> <code class="type">bigint</code>
        </div>
        <div>Number of index scans initiated on this index</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">last_idx_scan</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>
          The time of the last scan on this index, based on the most recent transaction stop time
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">idx_tup_read</code> <code class="type">bigint</code>
        </div>
        <div>Number of index entries returned by scans on this index</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">idx_tup_fetch</code> <code class="type">bigint</code>
        </div>
        <div>Number of live table rows fetched by simple index scans using this index</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

Indexes can be used by simple index scans, “bitmap” index scans, and the optimizer. In a bitmap scan the output of several indexes can be combined via AND or OR rules, so it is difficult to associate individual heap row fetches with specific indexes when a bitmap scan is used. Therefore, a bitmap scan increments the `pg_stat_all_indexes`.`idx_tup_read` count(s) for the index(es) it uses, and it increments the `pg_stat_all_tables`.`idx_tup_fetch` count for the table, but it does not affect `pg_stat_all_indexes`.`idx_tup_fetch`. The optimizer also accesses indexes to check for supplied constants whose values are outside the recorded range of the optimizer statistics because the optimizer statistics might be stale.

### Note

The `idx_tup_read` and `idx_tup_fetch` counts can be different even without any use of bitmap scans, because `idx_tup_read` counts index entries retrieved from the index while `idx_tup_fetch` counts live rows fetched from the table. The latter will be less if any dead or not-yet-committed rows are fetched using the index, or if any heap fetches are avoided by means of an index-only scan.

[#id](#MONITORING-PG-STATIO-ALL-TABLES-VIEW)

### 28.2.20. `pg_statio_all_tables` [#](#MONITORING-PG-STATIO-ALL-TABLES-VIEW)

The `pg_statio_all_tables` view will contain one row for each table in the current database (including TOAST tables), showing statistics about I/O on that specific table. The `pg_statio_user_tables` and `pg_statio_sys_tables` views contain the same information, but filtered to only show user and system tables respectively.

[#id](#PG-STATIO-ALL-TABLES-VIEW)

**Table 28.30. `pg_statio_all_tables` View**

<figure class="table-wrapper">
<table class="table" summary="pg_statio_all_tables View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">relid</code> <code class="type">oid</code>
        </div>
        <div>OID of a table</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">schemaname</code> <code class="type">name</code>
        </div>
        <div>Name of the schema that this table is in</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">relname</code> <code class="type">name</code>
        </div>
        <div>Name of this table</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">heap_blks_read</code> <code class="type">bigint</code>
        </div>
        <div>Number of disk blocks read from this table</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">heap_blks_hit</code> <code class="type">bigint</code>
        </div>
        <div>Number of buffer hits in this table</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">idx_blks_read</code> <code class="type">bigint</code>
        </div>
        <div>Number of disk blocks read from all indexes on this table</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">idx_blks_hit</code> <code class="type">bigint</code>
        </div>
        <div>Number of buffer hits in all indexes on this table</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">toast_blks_read</code> <code class="type">bigint</code>
        </div>
        <div>Number of disk blocks read from this table's TOAST table (if any)</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">toast_blks_hit</code> <code class="type">bigint</code>
        </div>
        <div>Number of buffer hits in this table's TOAST table (if any)</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">tidx_blks_read</code> <code class="type">bigint</code>
        </div>
        <div>Number of disk blocks read from this table's TOAST table indexes (if any)</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">tidx_blks_hit</code> <code class="type">bigint</code>
        </div>
        <div>Number of buffer hits in this table's TOAST table indexes (if any)</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STATIO-ALL-INDEXES-VIEW)

### 28.2.21. `pg_statio_all_indexes` [#](#MONITORING-PG-STATIO-ALL-INDEXES-VIEW)

The `pg_statio_all_indexes` view will contain one row for each index in the current database, showing statistics about I/O on that specific index. The `pg_statio_user_indexes` and `pg_statio_sys_indexes` views contain the same information, but filtered to only show user and system indexes respectively.

[#id](#PG-STATIO-ALL-INDEXES-VIEW)

**Table 28.31. `pg_statio_all_indexes` View**

<figure class="table-wrapper">
<table class="table" summary="pg_statio_all_indexes View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">relid</code> <code class="type">oid</code>
        </div>
        <div>OID of the table for this index</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">indexrelid</code> <code class="type">oid</code>
        </div>
        <div>OID of this index</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">schemaname</code> <code class="type">name</code>
        </div>
        <div>Name of the schema this index is in</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">relname</code> <code class="type">name</code>
        </div>
        <div>Name of the table for this index</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">indexrelname</code> <code class="type">name</code>
        </div>
        <div>Name of this index</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">idx_blks_read</code> <code class="type">bigint</code>
        </div>
        <div>Number of disk blocks read from this index</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">idx_blks_hit</code> <code class="type">bigint</code>
        </div>
        <div>Number of buffer hits in this index</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW)

### 28.2.22. `pg_statio_all_sequences` [#](#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW)

The `pg_statio_all_sequences` view will contain one row for each sequence in the current database, showing statistics about I/O on that specific sequence.

[#id](#PG-STATIO-ALL-SEQUENCES-VIEW)

**Table 28.32. `pg_statio_all_sequences` View**

<figure class="table-wrapper">
<table class="table" summary="pg_statio_all_sequences View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">relid</code> <code class="type">oid</code>
        </div>
        <div>OID of a sequence</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">schemaname</code> <code class="type">name</code>
        </div>
        <div>Name of the schema this sequence is in</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">relname</code> <code class="type">name</code>
        </div>
        <div>Name of this sequence</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">blks_read</code> <code class="type">bigint</code>
        </div>
        <div>Number of disk blocks read from this sequence</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">blks_hit</code> <code class="type">bigint</code>
        </div>
        <div>Number of buffer hits in this sequence</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW)

### 28.2.23. `pg_stat_user_functions` [#](#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW)

The `pg_stat_user_functions` view will contain one row for each tracked function, showing statistics about executions of that function. The [track_functions](runtime-config-statistics#GUC-TRACK-FUNCTIONS) parameter controls exactly which functions are tracked.

[#id](#PG-STAT-USER-FUNCTIONS-VIEW)

**Table 28.33. `pg_stat_user_functions` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_user_functions View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">funcid</code> <code class="type">oid</code>
        </div>
        <div>OID of a function</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">schemaname</code> <code class="type">name</code>
        </div>
        <div>Name of the schema this function is in</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">funcname</code> <code class="type">name</code>
        </div>
        <div>Name of this function</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">calls</code> <code class="type">bigint</code>
        </div>
        <div>Number of times this function has been called</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">total_time</code> <code class="type">double precision</code>
        </div>
        <div>
          Total time spent in this function and all other functions called by it, in milliseconds
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">self_time</code> <code class="type">double precision</code>
        </div>
        <div>
          Total time spent in this function itself, not including other functions called by it, in
          milliseconds
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-PG-STAT-SLRU-VIEW)

### 28.2.24. `pg_stat_slru` [#](#MONITORING-PG-STAT-SLRU-VIEW)

PostgreSQL accesses certain on-disk information via _SLRU_ (simple least-recently-used) caches. The `pg_stat_slru` view will contain one row for each tracked SLRU cache, showing statistics about access to cached pages.

[#id](#PG-STAT-SLRU-VIEW)

**Table 28.34. `pg_stat_slru` View**

<figure class="table-wrapper">
<table class="table" summary="pg_stat_slru View" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="catalog_table_entry">
        <div class="column_definition">Column Type</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">name</code> <code class="type">text</code>
        </div>
        <div>Name of the SLRU</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">blks_zeroed</code> <code class="type">bigint</code>
        </div>
        <div>Number of blocks zeroed during initializations</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">blks_hit</code> <code class="type">bigint</code>
        </div>
        <div>
          Number of times disk blocks were found already in the SLRU, so that a read was not
          necessary (this only includes hits in the SLRU, not the operating system's file system
          cache)
        </div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">blks_read</code> <code class="type">bigint</code>
        </div>
        <div>Number of disk blocks read for this SLRU</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">blks_written</code> <code class="type">bigint</code>
        </div>
        <div>Number of disk blocks written for this SLRU</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">blks_exists</code> <code class="type">bigint</code>
        </div>
        <div>Number of blocks checked for existence for this SLRU</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">flushes</code> <code class="type">bigint</code>
        </div>
        <div>Number of flushes of dirty data for this SLRU</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">truncates</code> <code class="type">bigint</code>
        </div>
        <div>Number of truncates for this SLRU</div>
      </td>
    </tr>
    <tr>
      <td class="catalog_table_entry">
        <div class="column_definition">
          <code class="structfield">stats_reset</code>
          <code class="type">timestamp with time zone</code>
        </div>
        <div>Time at which these statistics were last reset</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

[#id](#MONITORING-STATS-FUNCTIONS)

### 28.2.25. Statistics Functions [#](#MONITORING-STATS-FUNCTIONS)

Other ways of looking at the statistics can be set up by writing queries that use the same underlying statistics access functions used by the standard views shown above. For details such as the functions' names, consult the definitions of the standard views. (For example, in psql you could issue `\d+ pg_stat_activity`.) The access functions for per-database statistics take a database OID as an argument to identify which database to report on. The per-table and per-index functions take a table or index OID. The functions for per-function statistics take a function OID. Note that only tables, indexes, and functions in the current database can be seen with these functions.

Additional functions related to the cumulative statistics system are listed in [Table 28.35](monitoring-stats#MONITORING-STATS-FUNCS-TABLE).

[#id](#MONITORING-STATS-FUNCS-TABLE)

**Table 28.35. Additional Statistics Functions**

<figure class="table-wrapper">
<table class="table" summary="Additional Statistics Functions" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Function</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <code class="function">pg_backend_pid</code> () → <code class="returnvalue">integer</code>
        </div>
        <div>Returns the process ID of the server process attached to the current session.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.4.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_activity</code> ( <code class="type">integer</code> ) →
          <code class="returnvalue">setof record</code>
        </div>
        <div>
          Returns a record of information about the backend with the specified process ID, or one
          record for each active backend in the system if <code class="literal">NULL</code> is
          specified. The fields returned are a subset of those in the
          <code class="structname">pg_stat_activity</code> view.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.4.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_snapshot_timestamp</code> () →
          <code class="returnvalue">timestamp with time zone</code>
        </div>
        <div>
          Returns the timestamp of the current statistics snapshot, or NULL if no statistics
          snapshot has been taken. A snapshot is taken the first time cumulative statistics are
          accessed in a transaction if
          <code class="varname">stats_fetch_consistency</code> is set to
          <code class="literal">snapshot</code>
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.4.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_xact_blocks_fetched</code> (
          <code class="type">oid</code> ) → <code class="returnvalue">bigint</code>
        </div>
        <div>
          Returns the number of block read requests for table or index, in the current transaction.
          This number minus
          <code class="function">pg_stat_get_xact_blocks_hit</code> gives the number of kernel
          <code class="function">read()</code> calls; the number of actual physical reads is usually
          lower due to kernel-level buffering.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.4.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_xact_blocks_hit</code> (
          <code class="type">oid</code> ) → <code class="returnvalue">bigint</code>
        </div>
        <div>
          Returns the number of block read requests for table or index, in the current transaction,
          found in cache (not triggering kernel
          <code class="function">read()</code> calls).
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.4.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_clear_snapshot</code> () →
          <code class="returnvalue">void</code>
        </div>
        <div>Discards the current statistics snapshot or cached information.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.4.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_reset</code> () → <code class="returnvalue">void</code>
        </div>
        <div>Resets all statistics counters for the current database to zero.</div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.4.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_reset_shared</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div>
          Resets some cluster-wide statistics counters to zero, depending on the argument. The
          argument can be <code class="literal">bgwriter</code> to reset all the counters shown in
          the <code class="structname">pg_stat_bgwriter</code> view,
          <code class="literal">archiver</code> to reset all the counters shown in the
          <code class="structname">pg_stat_archiver</code> view, <code class="literal">io</code> to
          reset all the counters shown in the <code class="structname">pg_stat_io</code> view,
          <code class="literal">wal</code> to reset all the counters shown in the
          <code class="structname">pg_stat_wal</code> view or
          <code class="literal">recovery_prefetch</code> to reset all the counters shown in the
          <code class="structname">pg_stat_recovery_prefetch</code> view.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.4.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_reset_single_table_counters</code> (
          <code class="type">oid</code> ) → <code class="returnvalue">void</code>
        </div>
        <div>
          Resets statistics for a single table or index in the current database or shared across all
          databases in the cluster to zero.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.4.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_reset_single_function_counters</code> (
          <code class="type">oid</code> ) → <code class="returnvalue">void</code>
        </div>
        <div>Resets statistics for a single function in the current database to zero.</div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.4.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_reset_slru</code> ( <code class="type">text</code> ) →
          <code class="returnvalue">void</code>
        </div>
        <div>
          Resets statistics to zero for a single SLRU cache, or for all SLRUs in the cluster. If the
          argument is NULL, all counters shown in the
          <code class="structname">pg_stat_slru</code> view for all SLRU caches are reset. The
          argument can be one of <code class="literal">CommitTs</code>,
          <code class="literal">MultiXactMember</code>,
          <code class="literal">MultiXactOffset</code>, <code class="literal">Notify</code>,
          <code class="literal">Serial</code>, <code class="literal">Subtrans</code>, or
          <code class="literal">Xact</code>
          to reset the counters for only that entry. If the argument is
          <code class="literal">other</code> (or indeed, any unrecognized name), then the counters
          for all other SLRU caches, such as extension-defined caches, are reset.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.4.2.2.12.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_reset_replication_slot</code> (
          <code class="type">text</code> ) → <code class="returnvalue">void</code>
        </div>
        <div>
          Resets statistics of the replication slot defined by the argument. If the argument is
          <code class="literal">NULL</code>, resets statistics for all the replication slots.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.4.2.2.13.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_reset_subscription_stats</code> (
          <code class="type">oid</code> ) → <code class="returnvalue">void</code>
        </div>
        <div>
          Resets statistics for a single subscription shown in the
          <code class="structname">pg_stat_subscription_stats</code> view to zero. If the argument
          is <code class="literal">NULL</code>, reset statistics for all subscriptions.
        </div>
        <div>
          This function is restricted to superusers by default, but other users can be granted
          EXECUTE to run the function.
        </div>
      </td>
    </tr>
  </tbody>
</table>
</figure>

### Warning

Using `pg_stat_reset()` also resets counters that autovacuum uses to determine when to trigger a vacuum or an analyze. Resetting these counters can cause autovacuum to not perform necessary work, which can cause problems such as table bloat or out-dated table statistics. A database-wide `ANALYZE` is recommended after the statistics have been reset.

`pg_stat_get_activity`, the underlying function of the `pg_stat_activity` view, returns a set of records containing all the available information about each backend process. Sometimes it may be more convenient to obtain just a subset of this information. In such cases, another set of per-backend statistics access functions can be used; these are shown in [Table 28.36](monitoring-stats#MONITORING-STATS-BACKEND-FUNCS-TABLE). These access functions use the session's backend ID number, which is a small positive integer that is distinct from the backend ID of any concurrent session, although a session's ID can be recycled as soon as it exits. The backend ID is used, among other things, to identify the session's temporary schema if it has one. The function `pg_stat_get_backend_idset` provides a convenient way to list all the active backends' ID numbers for invoking these functions. For example, to show the PIDs and current queries of all backends:

```

SELECT pg_stat_get_backend_pid(backendid) AS pid,
       pg_stat_get_backend_activity(backendid) AS query
FROM pg_stat_get_backend_idset() AS backendid;

```

[#id](#MONITORING-STATS-BACKEND-FUNCS-TABLE)

**Table 28.36. Per-Backend Statistics Functions**

<figure class="table-wrapper">
<table class="table" summary="Per-Backend Statistics Functions" border="1">
  <colgroup>
    <col />
  </colgroup>
  <thead>
    <tr>
      <th class="func_table_entry">
        <div class="func_signature">Function</div>
        <div>Description</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.7.2.2.1.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_backend_activity</code> (
          <code class="type">integer</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>Returns the text of this backend's most recent query.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.7.2.2.2.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_backend_activity_start</code> (
          <code class="type">integer</code> ) →
          <code class="returnvalue">timestamp with time zone</code>
        </div>
        <div>Returns the time when the backend's most recent query was started.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.7.2.2.3.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_backend_client_addr</code> (
          <code class="type">integer</code> ) → <code class="returnvalue">inet</code>
        </div>
        <div>Returns the IP address of the client connected to this backend.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.7.2.2.4.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_backend_client_port</code> (
          <code class="type">integer</code> ) → <code class="returnvalue">integer</code>
        </div>
        <div>Returns the TCP port number that the client is using for communication.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.7.2.2.5.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_backend_dbid</code> (
          <code class="type">integer</code> ) → <code class="returnvalue">oid</code>
        </div>
        <div>Returns the OID of the database this backend is connected to.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.7.2.2.6.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_backend_idset</code> () →
          <code class="returnvalue">setof integer</code>
        </div>
        <div>Returns the set of currently active backend ID numbers.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.7.2.2.7.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_backend_pid</code> (
          <code class="type">integer</code> ) → <code class="returnvalue">integer</code>
        </div>
        <div>Returns the process ID of this backend.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.7.2.2.8.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_backend_start</code> (
          <code class="type">integer</code> ) →
          <code class="returnvalue">timestamp with time zone</code>
        </div>
        <div>Returns the time when this process was started.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.7.2.2.9.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_backend_subxact</code> (
          <code class="type">integer</code> ) → <code class="returnvalue">record</code>
        </div>
        <div>
          Returns a record of information about the subtransactions of the backend with the
          specified ID. The fields returned are <em class="parameter"><code>subxact_count</code></em>, which is the number of subtransactions in the backend's subtransaction cache, and
          <em class="parameter"><code>subxact_overflow</code></em>, which indicates whether the backend's subtransaction cache is overflowed or not.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.7.2.2.10.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_backend_userid</code> (
          <code class="type">integer</code> ) → <code class="returnvalue">oid</code>
        </div>
        <div>Returns the OID of the user logged into this backend.</div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.7.2.2.11.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_backend_wait_event</code> (
          <code class="type">integer</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the wait event name if this backend is currently waiting, otherwise NULL. See
          <a
            class="xref"
            href="monitoring-stats.html#WAIT-EVENT-ACTIVITY-TABLE"
            title="Table&nbsp;28.5.&nbsp;Wait Events of Type Activity">Table&nbsp;28.5</a>
          through
          <a
            class="xref"
            href="monitoring-stats.html#WAIT-EVENT-TIMEOUT-TABLE"
            title="Table&nbsp;28.13.&nbsp;Wait Events of Type Timeout">Table&nbsp;28.13</a>.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.7.2.2.12.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_backend_wait_event_type</code> (
          <code class="type">integer</code> ) → <code class="returnvalue">text</code>
        </div>
        <div>
          Returns the wait event type name if this backend is currently waiting, otherwise NULL. See
          <a
            class="xref"
            href="monitoring-stats.html#WAIT-EVENT-TABLE"
            title="Table&nbsp;28.4.&nbsp;Wait Event Types">Table&nbsp;28.4</a>
          for details.
        </div>
      </td>
    </tr>
    <tr>
      <td class="func_table_entry">
        <div class="func_signature">
          <a id="id-1.6.15.7.29.7.2.2.13.1.1.1" class="indexterm"></a>
          <code class="function">pg_stat_get_backend_xact_start</code> (
          <code class="type">integer</code> ) →
          <code class="returnvalue">timestamp with time zone</code>
        </div>
        <div>Returns the time when the backend's current transaction was started.</div>
      </td>
    </tr>
  </tbody>
</table>
</figure>
