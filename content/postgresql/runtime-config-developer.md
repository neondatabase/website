[#id](#RUNTIME-CONFIG-DEVELOPER)

## 20.17. Developer Options [#](#RUNTIME-CONFIG-DEVELOPER)

The following parameters are intended for developer testing, and should never be used on a production database. However, some of them can be used to assist with the recovery of severely damaged databases. As such, they have been excluded from the sample `postgresql.conf` file. Note that many of these parameters require special source compilation flags to work at all.

- `allow_in_place_tablespaces` (`boolean`) [#](#GUC-ALLOW-IN-PLACE-TABLESPACES)

  Allows tablespaces to be created as directories inside `pg_tblspc`, when an empty location string is provided to the `CREATE TABLESPACE` command. This is intended to allow testing replication scenarios where primary and standby servers are running on the same machine. Such directories are likely to confuse backup tools that expect to find only symbolic links in that location. Only superusers and users with the appropriate `SET` privilege can change this setting.

- `allow_system_table_mods` (`boolean`) [#](#GUC-ALLOW-SYSTEM-TABLE-MODS)

  Allows modification of the structure of system tables as well as certain other risky actions on system tables. This is otherwise not allowed even for superusers. Ill-advised use of this setting can cause irretrievable data loss or seriously corrupt the database system. Only superusers and users with the appropriate `SET` privilege can change this setting.

- `backtrace_functions` (`string`) [#](#GUC-BACKTRACE-FUNCTIONS)

  This parameter contains a comma-separated list of C function names. If an error is raised and the name of the internal C function where the error happens matches a value in the list, then a backtrace is written to the server log together with the error message. This can be used to debug specific areas of the source code.

  Backtrace support is not available on all platforms, and the quality of the backtraces depends on compilation options.

  Only superusers and users with the appropriate `SET` privilege can change this setting.

- `debug_discard_caches` (`integer`) [#](#GUC-DEBUG-DISCARD-CACHES)

  When set to `1`, each system catalog cache entry is invalidated at the first possible opportunity, whether or not anything that would render it invalid really occurred. Caching of system catalogs is effectively disabled as a result, so the server will run extremely slowly. Higher values run the cache invalidation recursively, which is even slower and only useful for testing the caching logic itself. The default value of `0` selects normal catalog caching behavior.

  This parameter can be very helpful when trying to trigger hard-to-reproduce bugs involving concurrent catalog changes, but it is otherwise rarely needed. See the source code files `inval.c` and `pg_config_manual.h` for details.

  This parameter is supported when `DISCARD_CACHES_ENABLED` was defined at compile time (which happens automatically when using the configure option `--enable-cassert`). In production builds, its value will always be `0` and attempts to set it to another value will raise an error.

- `debug_io_direct` (`string`) [#](#GUC-DEBUG-IO-DIRECT)

  Ask the kernel to minimize caching effects for relation data and WAL files using `O_DIRECT` (most Unix-like systems), `F_NOCACHE` (macOS) or `FILE_FLAG_NO_BUFFERING` (Windows).

  May be set to an empty string (the default) to disable use of direct I/O, or a comma-separated list of operations that should use direct I/O. The valid options are `data` for main data files, `wal` for WAL files, and `wal_init` for WAL files when being initially allocated.

  Some operating systems and file systems do not support direct I/O, so non-default settings may be rejected at startup or cause errors.

  Currently this feature reduces performance, and is intended for developer testing only.

- `debug_parallel_query` (`enum`) [#](#GUC-DEBUG-PARALLEL-QUERY)

  Allows the use of parallel queries for testing purposes even in cases where no performance benefit is expected. The allowed values of `debug_parallel_query` are `off` (use parallel mode only when it is expected to improve performance), `on` (force parallel query for all queries for which it is thought to be safe), and `regress` (like `on`, but with additional behavior changes as explained below).

  More specifically, setting this value to `on` will add a `Gather` node to the top of any query plan for which this appears to be safe, so that the query runs inside of a parallel worker. Even when a parallel worker is not available or cannot be used, operations such as starting a subtransaction that would be prohibited in a parallel query context will be prohibited unless the planner believes that this will cause the query to fail. If failures or unexpected results occur when this option is set, some functions used by the query may need to be marked `PARALLEL UNSAFE` (or, possibly, `PARALLEL RESTRICTED`).

  Setting this value to `regress` has all of the same effects as setting it to `on` plus some additional effects that are intended to facilitate automated regression testing. Normally, messages from a parallel worker include a context line indicating that, but a setting of `regress` suppresses this line so that the output is the same as in non-parallel execution. Also, the `Gather` nodes added to plans by this setting are hidden in `EXPLAIN` output so that the output matches what would be obtained if this setting were turned `off`.

- `ignore_system_indexes` (`boolean`) [#](#GUC-IGNORE-SYSTEM-INDEXES)

  Ignore system indexes when reading system tables (but still update the indexes when modifying the tables). This is useful when recovering from damaged system indexes. This parameter cannot be changed after session start.

- `post_auth_delay` (`integer`) [#](#GUC-POST-AUTH-DELAY)

  The amount of time to delay when a new server process is started, after it conducts the authentication procedure. This is intended to give developers an opportunity to attach to the server process with a debugger. If this value is specified without units, it is taken as seconds. A value of zero (the default) disables the delay. This parameter cannot be changed after session start.

- `pre_auth_delay` (`integer`) [#](#GUC-PRE-AUTH-DELAY)

  The amount of time to delay just after a new server process is forked, before it conducts the authentication procedure. This is intended to give developers an opportunity to attach to the server process with a debugger to trace down misbehavior in authentication. If this value is specified without units, it is taken as seconds. A value of zero (the default) disables the delay. This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `trace_notify` (`boolean`) [#](#GUC-TRACE-NOTIFY)

  Generates a great amount of debugging output for the `LISTEN` and `NOTIFY` commands. [client_min_messages](runtime-config-client#GUC-CLIENT-MIN-MESSAGES) or [log_min_messages](runtime-config-logging#GUC-LOG-MIN-MESSAGES) must be `DEBUG1` or lower to send this output to the client or server logs, respectively.

- `trace_recovery_messages` (`enum`) [#](#GUC-TRACE-RECOVERY-MESSAGES)

  Enables logging of recovery-related debugging output that otherwise would not be logged. This parameter allows the user to override the normal setting of [log_min_messages](runtime-config-logging#GUC-LOG-MIN-MESSAGES), but only for specific messages. This is intended for use in debugging hot standby. Valid values are `DEBUG5`, `DEBUG4`, `DEBUG3`, `DEBUG2`, `DEBUG1`, and `LOG`. The default, `LOG`, does not affect logging decisions at all. The other values cause recovery-related debug messages of that priority or higher to be logged as though they had `LOG` priority; for common settings of `log_min_messages` this results in unconditionally sending them to the server log. This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `trace_sort` (`boolean`) [#](#GUC-TRACE-SORT)

  If on, emit information about resource usage during sort operations. This parameter is only available if the `TRACE_SORT` macro was defined when PostgreSQL was compiled. (However, `TRACE_SORT` is currently defined by default.)

- `trace_locks` (`boolean`) [#](#GUC-TRACE-LOCKS)

  If on, emit information about lock usage. Information dumped includes the type of lock operation, the type of lock and the unique identifier of the object being locked or unlocked. Also included are bit masks for the lock types already granted on this object as well as for the lock types awaited on this object. For each lock type a count of the number of granted locks and waiting locks is also dumped as well as the totals. An example of the log file output is shown here:

  ```
  LOG:  LockAcquire: new: lock(0xb7acd844) id(24688,24696,0,0,0,1)
        grantMask(0) req(0,0,0,0,0,0,0)=0 grant(0,0,0,0,0,0,0)=0
        wait(0) type(AccessShareLock)
  LOG:  GrantLock: lock(0xb7acd844) id(24688,24696,0,0,0,1)
        grantMask(2) req(1,0,0,0,0,0,0)=1 grant(1,0,0,0,0,0,0)=1
        wait(0) type(AccessShareLock)
  LOG:  UnGrantLock: updated: lock(0xb7acd844) id(24688,24696,0,0,0,1)
        grantMask(0) req(0,0,0,0,0,0,0)=0 grant(0,0,0,0,0,0,0)=0
        wait(0) type(AccessShareLock)
  LOG:  CleanUpLock: deleting: lock(0xb7acd844) id(24688,24696,0,0,0,1)
        grantMask(0) req(0,0,0,0,0,0,0)=0 grant(0,0,0,0,0,0,0)=0
        wait(0) type(INVALID)
  ```

  Details of the structure being dumped may be found in `src/include/storage/lock.h`.

  This parameter is only available if the `LOCK_DEBUG` macro was defined when PostgreSQL was compiled.

- `trace_lwlocks` (`boolean`) [#](#GUC-TRACE-LWLOCKS)

  If on, emit information about lightweight lock usage. Lightweight locks are intended primarily to provide mutual exclusion of access to shared-memory data structures.

  This parameter is only available if the `LOCK_DEBUG` macro was defined when PostgreSQL was compiled.

- `trace_userlocks` (`boolean`) [#](#GUC-TRACE-USERLOCKS)

  If on, emit information about user lock usage. Output is the same as for `trace_locks`, only for advisory locks.

  This parameter is only available if the `LOCK_DEBUG` macro was defined when PostgreSQL was compiled.

- `trace_lock_oidmin` (`integer`) [#](#GUC-TRACE-LOCK-OIDMIN)

  If set, do not trace locks for tables below this OID (used to avoid output on system tables).

  This parameter is only available if the `LOCK_DEBUG` macro was defined when PostgreSQL was compiled.

- `trace_lock_table` (`integer`) [#](#GUC-TRACE-LOCK-TABLE)

  Unconditionally trace locks on this table (OID).

  This parameter is only available if the `LOCK_DEBUG` macro was defined when PostgreSQL was compiled.

- `debug_deadlocks` (`boolean`) [#](#GUC-DEBUG-DEADLOCKS)

  If set, dumps information about all current locks when a deadlock timeout occurs.

  This parameter is only available if the `LOCK_DEBUG` macro was defined when PostgreSQL was compiled.

- `log_btree_build_stats` (`boolean`) [#](#GUC-LOG-BTREE-BUILD-STATS)

  If set, logs system resource usage statistics (memory and CPU) on various B-tree operations.

  This parameter is only available if the `BTREE_BUILD_STATS` macro was defined when PostgreSQL was compiled.

- `wal_consistency_checking` (`string`) [#](#GUC-WAL-CONSISTENCY-CHECKING)

  This parameter is intended to be used to check for bugs in the WAL redo routines. When enabled, full-page images of any buffers modified in conjunction with the WAL record are added to the record. If the record is subsequently replayed, the system will first apply each record and then test whether the buffers modified by the record match the stored images. In certain cases (such as hint bits), minor variations are acceptable, and will be ignored. Any unexpected differences will result in a fatal error, terminating recovery.

  The default value of this setting is the empty string, which disables the feature. It can be set to `all` to check all records, or to a comma-separated list of resource managers to check only records originating from those resource managers. Currently, the supported resource managers are `heap`, `heap2`, `btree`, `hash`, `gin`, `gist`, `sequence`, `spgist`, `brin`, and `generic`. Extensions may define additional resource managers. Only superusers and users with the appropriate `SET` privilege can change this setting.

- `wal_debug` (`boolean`) [#](#GUC-WAL-DEBUG)

  If on, emit WAL-related debugging output. This parameter is only available if the `WAL_DEBUG` macro was defined when PostgreSQL was compiled.

- `ignore_checksum_failure` (`boolean`) [#](#GUC-IGNORE-CHECKSUM-FAILURE)

  Only has effect if [data checksums](app-initdb#APP-INITDB-DATA-CHECKSUMS) are enabled.

  Detection of a checksum failure during a read normally causes PostgreSQL to report an error, aborting the current transaction. Setting `ignore_checksum_failure` to on causes the system to ignore the failure (but still report a warning), and continue processing. This behavior may _cause crashes, propagate or hide corruption, or other serious problems_. However, it may allow you to get past the error and retrieve undamaged tuples that might still be present in the table if the block header is still sane. If the header is corrupt an error will be reported even if this option is enabled. The default setting is `off`. Only superusers and users with the appropriate `SET` privilege can change this setting.

- `zero_damaged_pages` (`boolean`) [#](#GUC-ZERO-DAMAGED-PAGES)

  Detection of a damaged page header normally causes PostgreSQL to report an error, aborting the current transaction. Setting `zero_damaged_pages` to on causes the system to instead report a warning, zero out the damaged page in memory, and continue processing. This behavior _will destroy data_, namely all the rows on the damaged page. However, it does allow you to get past the error and retrieve rows from any undamaged pages that might be present in the table. It is useful for recovering data if corruption has occurred due to a hardware or software error. You should generally not set this on until you have given up hope of recovering data from the damaged pages of a table. Zeroed-out pages are not forced to disk so it is recommended to recreate the table or the index before turning this parameter off again. The default setting is `off`. Only superusers and users with the appropriate `SET` privilege can change this setting.

- `ignore_invalid_pages` (`boolean`) [#](#GUC-IGNORE-INVALID-PAGES)

  If set to `off` (the default), detection of WAL records having references to invalid pages during recovery causes PostgreSQL to raise a PANIC-level error, aborting the recovery. Setting `ignore_invalid_pages` to `on` causes the system to ignore invalid page references in WAL records (but still report a warning), and continue the recovery. This behavior may _cause crashes, data loss, propagate or hide corruption, or other serious problems_. However, it may allow you to get past the PANIC-level error, to finish the recovery, and to cause the server to start up. The parameter can only be set at server start. It only has effect during recovery or in standby mode.

- `jit_debugging_support` (`boolean`) [#](#GUC-JIT-DEBUGGING-SUPPORT)

  If LLVM has the required functionality, register generated functions with GDB. This makes debugging easier. The default setting is `off`. This parameter can only be set at server start.

- `jit_dump_bitcode` (`boolean`) [#](#GUC-JIT-DUMP-BITCODE)

  Writes the generated LLVM IR out to the file system, inside [data_directory](runtime-config-file-locations#GUC-DATA-DIRECTORY). This is only useful for working on the internals of the JIT implementation. The default setting is `off`. Only superusers and users with the appropriate `SET` privilege can change this setting.

- `jit_expressions` (`boolean`) [#](#GUC-JIT-EXPRESSIONS)

  Determines whether expressions are JIT compiled, when JIT compilation is activated (see [Section 32.2](jit-decision)). The default is `on`.

- `jit_profiling_support` (`boolean`) [#](#GUC-JIT-PROFILING-SUPPORT)

  If LLVM has the required functionality, emit the data needed to allow perf to profile functions generated by JIT. This writes out files to `~/.debug/jit/`; the user is responsible for performing cleanup when desired. The default setting is `off`. This parameter can only be set at server start.

- `jit_tuple_deforming` (`boolean`) [#](#GUC-JIT-TUPLE-DEFORMING)

  Determines whether tuple deforming is JIT compiled, when JIT compilation is activated (see [Section 32.2](jit-decision)). The default is `on`.

- `remove_temp_files_after_crash` (`boolean`) [#](#GUC-REMOVE-TEMP-FILES-AFTER-CRASH)

  When set to `on`, which is the default, PostgreSQL will automatically remove temporary files after a backend crash. If disabled, the files will be retained and may be used for debugging, for example. Repeated crashes may however result in accumulation of useless files. This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `send_abort_for_crash` (`boolean`) [#](#GUC-SEND-ABORT-FOR-CRASH)

  By default, after a backend crash the postmaster will stop remaining child processes by sending them SIGQUIT signals, which permits them to exit more-or-less gracefully. When this option is set to `on`, SIGABRT is sent instead. That normally results in production of a core dump file for each such child process. This can be handy for investigating the states of other processes after a crash. It can also consume lots of disk space in the event of repeated crashes, so do not enable this on systems you are not monitoring carefully. Beware that no support exists for cleaning up the core file(s) automatically. This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `send_abort_for_kill` (`boolean`) [#](#GUC-SEND-ABORT-FOR-KILL)

  By default, after attempting to stop a child process with SIGQUIT, the postmaster will wait five seconds and then send SIGKILL to force immediate termination. When this option is set to `on`, SIGABRT is sent instead of SIGKILL. That normally results in production of a core dump file for each such child process. This can be handy for investigating the states of “stuck” child processes. It can also consume lots of disk space in the event of repeated crashes, so do not enable this on systems you are not monitoring carefully. Beware that no support exists for cleaning up the core file(s) automatically. This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `debug_logical_replication_streaming` (`enum`) [#](#GUC-DEBUG-LOGICAL-REPLICATION-STREAMING)

  The allowed values are `buffered` and `immediate`. The default is `buffered`. This parameter is intended to be used to test logical decoding and replication of large transactions. The effect of `debug_logical_replication_streaming` is different for the publisher and subscriber:

  On the publisher side, `debug_logical_replication_streaming` allows streaming or serializing changes immediately in logical decoding. When set to `immediate`, stream each change if the [`streaming`](sql-createsubscription#SQL-CREATESUBSCRIPTION-WITH-STREAMING) option of [`CREATE SUBSCRIPTION`](sql-createsubscription) is enabled, otherwise, serialize each change. When set to `buffered`, the decoding will stream or serialize changes when `logical_decoding_work_mem` is reached.

  On the subscriber side, if the `streaming` option is set to `parallel`, `debug_logical_replication_streaming` can be used to direct the leader apply worker to send changes to the shared memory queue or to serialize all changes to the file. When set to `buffered`, the leader sends changes to parallel apply workers via a shared memory queue. When set to `immediate`, the leader serializes all changes to files and notifies the parallel apply workers to read and apply them at the end of the transaction.
