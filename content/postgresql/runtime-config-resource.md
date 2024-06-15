[#id](#RUNTIME-CONFIG-RESOURCE)

## 20.4. Resource Consumption [#](#RUNTIME-CONFIG-RESOURCE)

- [20.4.1. Memory](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-MEMORY)
- [20.4.2. Disk](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-DISK)
- [20.4.3. Kernel Resource Usage](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-KERNEL)
- [20.4.4. Cost-based Vacuum Delay](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-VACUUM-COST)
- [20.4.5. Background Writer](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-BACKGROUND-WRITER)
- [20.4.6. Asynchronous Behavior](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-ASYNC-BEHAVIOR)

[#id](#RUNTIME-CONFIG-RESOURCE-MEMORY)

### 20.4.1. Memory [#](#RUNTIME-CONFIG-RESOURCE-MEMORY)

- `shared_buffers` (`integer`) [#](#GUC-SHARED-BUFFERS)

  Sets the amount of memory the database server uses for shared memory buffers. The default is typically 128 megabytes (`128MB`), but might be less if your kernel settings will not support it (as determined during initdb). This setting must be at least 128 kilobytes. However, settings significantly higher than the minimum are usually needed for good performance. If this value is specified without units, it is taken as blocks, that is `BLCKSZ` bytes, typically 8kB. (Non-default values of `BLCKSZ` change the minimum value.) This parameter can only be set at server start.

  If you have a dedicated database server with 1GB or more of RAM, a reasonable starting value for `shared_buffers` is 25% of the memory in your system. There are some workloads where even larger settings for `shared_buffers` are effective, but because PostgreSQL also relies on the operating system cache, it is unlikely that an allocation of more than 40% of RAM to `shared_buffers` will work better than a smaller amount. Larger settings for `shared_buffers` usually require a corresponding increase in `max_wal_size`, in order to spread out the process of writing large quantities of new or changed data over a longer period of time.

  On systems with less than 1GB of RAM, a smaller percentage of RAM is appropriate, so as to leave adequate space for the operating system.

- `huge_pages` (`enum`) [#](#GUC-HUGE-PAGES)

  Controls whether huge pages are requested for the main shared memory area. Valid values are `try` (the default), `on`, and `off`. With `huge_pages` set to `try`, the server will try to request huge pages, but fall back to the default if that fails. With `on`, failure to request huge pages will prevent the server from starting up. With `off`, huge pages will not be requested.

  At present, this setting is supported only on Linux and Windows. The setting is ignored on other systems when set to `try`. On Linux, it is only supported when `shared_memory_type` is set to `mmap` (the default).

  The use of huge pages results in smaller page tables and less CPU time spent on memory management, increasing performance. For more details about using huge pages on Linux, see [Section 19.4.5](kernel-resources#LINUX-HUGE-PAGES).

  Huge pages are known as large pages on Windows. To use them, you need to assign the user right “Lock pages in memory” to the Windows user account that runs PostgreSQL. You can use Windows Group Policy tool (gpedit.msc) to assign the user right “Lock pages in memory”. To start the database server on the command prompt as a standalone process, not as a Windows service, the command prompt must be run as an administrator or User Access Control (UAC) must be disabled. When the UAC is enabled, the normal command prompt revokes the user right “Lock pages in memory” when started.

  Note that this setting only affects the main shared memory area. Operating systems such as Linux, FreeBSD, and Illumos can also use huge pages (also known as “super” pages or “large” pages) automatically for normal memory allocation, without an explicit request from PostgreSQL. On Linux, this is called “transparent huge pages” (THP). That feature has been known to cause performance degradation with PostgreSQL for some users on some Linux versions, so its use is currently discouraged (unlike explicit use of `huge_pages`).

- `huge_page_size` (`integer`) [#](#GUC-HUGE-PAGE-SIZE)

  Controls the size of huge pages, when they are enabled with [huge_pages](runtime-config-resource#GUC-HUGE-PAGES). The default is zero (`0`). When set to `0`, the default huge page size on the system will be used. This parameter can only be set at server start.

  Some commonly available page sizes on modern 64 bit server architectures include: `2MB` and `1GB` (Intel and AMD), `16MB` and `16GB` (IBM POWER), and `64kB`, `2MB`, `32MB` and `1GB` (ARM). For more information about usage and support, see [Section 19.4.5](kernel-resources#LINUX-HUGE-PAGES).

  Non-default settings are currently supported only on Linux.

- `temp_buffers` (`integer`) [#](#GUC-TEMP-BUFFERS)

  Sets the maximum amount of memory used for temporary buffers within each database session. These are session-local buffers used only for access to temporary tables. If this value is specified without units, it is taken as blocks, that is `BLCKSZ` bytes, typically 8kB. The default is eight megabytes (`8MB`). (If `BLCKSZ` is not 8kB, the default value scales proportionally to it.) This setting can be changed within individual sessions, but only before the first use of temporary tables within the session; subsequent attempts to change the value will have no effect on that session.

  A session will allocate temporary buffers as needed up to the limit given by `temp_buffers`. The cost of setting a large value in sessions that do not actually need many temporary buffers is only a buffer descriptor, or about 64 bytes, per increment in `temp_buffers`. However if a buffer is actually used an additional 8192 bytes will be consumed for it (or in general, `BLCKSZ` bytes).

- `max_prepared_transactions` (`integer`) [#](#GUC-MAX-PREPARED-TRANSACTIONS)

  Sets the maximum number of transactions that can be in the “prepared” state simultaneously (see [PREPARE TRANSACTION](sql-prepare-transaction)). Setting this parameter to zero (which is the default) disables the prepared-transaction feature. This parameter can only be set at server start.

  If you are not planning to use prepared transactions, this parameter should be set to zero to prevent accidental creation of prepared transactions. If you are using prepared transactions, you will probably want `max_prepared_transactions` to be at least as large as [max_connections](runtime-config-connection#GUC-MAX-CONNECTIONS), so that every session can have a prepared transaction pending.

  When running a standby server, you must set this parameter to the same or higher value than on the primary server. Otherwise, queries will not be allowed in the standby server.

- `work_mem` (`integer`) [#](#GUC-WORK-MEM)

  Sets the base maximum amount of memory to be used by a query operation (such as a sort or hash table) before writing to temporary disk files. If this value is specified without units, it is taken as kilobytes. The default value is four megabytes (`4MB`). Note that for a complex query, several sort or hash operations might be running in parallel; each operation will generally be allowed to use as much memory as this value specifies before it starts to write data into temporary files. Also, several running sessions could be doing such operations concurrently. Therefore, the total memory used could be many times the value of `work_mem`; it is necessary to keep this fact in mind when choosing the value. Sort operations are used for `ORDER BY`, `DISTINCT`, and merge joins. Hash tables are used in hash joins, hash-based aggregation, memoize nodes and hash-based processing of `IN` subqueries.

  Hash-based operations are generally more sensitive to memory availability than equivalent sort-based operations. The memory available for hash tables is computed by multiplying `work_mem` by `hash_mem_multiplier`. This makes it possible for hash-based operations to use an amount of memory that exceeds the usual `work_mem` base amount.

- `hash_mem_multiplier` (`floating point`) [#](#GUC-HASH-MEM-MULTIPLIER)

  Used to compute the maximum amount of memory that hash-based operations can use. The final limit is determined by multiplying `work_mem` by `hash_mem_multiplier`. The default value is 2.0, which makes hash-based operations use twice the usual `work_mem` base amount.

  Consider increasing `hash_mem_multiplier` in environments where spilling by query operations is a regular occurrence, especially when simply increasing `work_mem` results in memory pressure (memory pressure typically takes the form of intermittent out of memory errors). The default setting of 2.0 is often effective with mixed workloads. Higher settings in the range of 2.0 - 8.0 or more may be effective in environments where `work_mem` has already been increased to 40MB or more.

- `maintenance_work_mem` (`integer`) [#](#GUC-MAINTENANCE-WORK-MEM)

  Specifies the maximum amount of memory to be used by maintenance operations, such as `VACUUM`, `CREATE INDEX`, and `ALTER TABLE ADD FOREIGN KEY`. If this value is specified without units, it is taken as kilobytes. It defaults to 64 megabytes (`64MB`). Since only one of these operations can be executed at a time by a database session, and an installation normally doesn't have many of them running concurrently, it's safe to set this value significantly larger than `work_mem`. Larger settings might improve performance for vacuuming and for restoring database dumps.

  Note that when autovacuum runs, up to [autovacuum_max_workers](runtime-config-autovacuum#GUC-AUTOVACUUM-MAX-WORKERS) times this memory may be allocated, so be careful not to set the default value too high. It may be useful to control for this by separately setting [autovacuum_work_mem](runtime-config-resource#GUC-AUTOVACUUM-WORK-MEM).

  Note that for the collection of dead tuple identifiers, `VACUUM` is only able to utilize up to a maximum of `1GB` of memory.

- `autovacuum_work_mem` (`integer`) [#](#GUC-AUTOVACUUM-WORK-MEM)

  Specifies the maximum amount of memory to be used by each autovacuum worker process. If this value is specified without units, it is taken as kilobytes. It defaults to -1, indicating that the value of [maintenance_work_mem](runtime-config-resource#GUC-MAINTENANCE-WORK-MEM) should be used instead. The setting has no effect on the behavior of `VACUUM` when run in other contexts. This parameter can only be set in the `postgresql.conf` file or on the server command line.

  For the collection of dead tuple identifiers, autovacuum is only able to utilize up to a maximum of `1GB` of memory, so setting `autovacuum_work_mem` to a value higher than that has no effect on the number of dead tuples that autovacuum can collect while scanning a table.

- `vacuum_buffer_usage_limit` (`integer`) [#](#GUC-VACUUM-BUFFER-USAGE-LIMIT)

  Specifies the size of the [\*\*](glossary#GLOSSARY-BUFFER-ACCESS-STRATEGY)_[Buffer Access Strategy](glossary#GLOSSARY-BUFFER-ACCESS-STRATEGY)_ used by the `VACUUM` and `ANALYZE` commands. A setting of `0` will allow the operation to use any number of `shared_buffers`. Otherwise valid sizes range from `128 kB` to `16 GB`. If the specified size would exceed 1/8 the size of `shared_buffers`, the size is silently capped to that value. The default value is `256 kB`. If this value is specified without units, it is taken as kilobytes. This parameter can be set at any time. It can be overridden for [VACUUM](sql-vacuum) and [ANALYZE](sql-analyze) when passing the `BUFFER_USAGE_LIMIT` option. Higher settings can allow `VACUUM` and `ANALYZE` to run more quickly, but having too large a setting may cause too many other useful pages to be evicted from shared buffers.

- `logical_decoding_work_mem` (`integer`) [#](#GUC-LOGICAL-DECODING-WORK-MEM)

  Specifies the maximum amount of memory to be used by logical decoding, before some of the decoded changes are written to local disk. This limits the amount of memory used by logical streaming replication connections. It defaults to 64 megabytes (`64MB`). Since each replication connection only uses a single buffer of this size, and an installation normally doesn't have many such connections concurrently (as limited by `max_wal_senders`), it's safe to set this value significantly higher than `work_mem`, reducing the amount of decoded changes written to disk.

- `max_stack_depth` (`integer`) [#](#GUC-MAX-STACK-DEPTH)

  Specifies the maximum safe depth of the server's execution stack. The ideal setting for this parameter is the actual stack size limit enforced by the kernel (as set by `ulimit -s` or local equivalent), less a safety margin of a megabyte or so. The safety margin is needed because the stack depth is not checked in every routine in the server, but only in key potentially-recursive routines. If this value is specified without units, it is taken as kilobytes. The default setting is two megabytes (`2MB`), which is conservatively small and unlikely to risk crashes. However, it might be too small to allow execution of complex functions. Only superusers and users with the appropriate `SET` privilege can change this setting.

  Setting `max_stack_depth` higher than the actual kernel limit will mean that a runaway recursive function can crash an individual backend process. On platforms where PostgreSQL can determine the kernel limit, the server will not allow this variable to be set to an unsafe value. However, not all platforms provide the information, so caution is recommended in selecting a value.

- `shared_memory_type` (`enum`) [#](#GUC-SHARED-MEMORY-TYPE)

  Specifies the shared memory implementation that the server should use for the main shared memory region that holds PostgreSQL's shared buffers and other shared data. Possible values are `mmap` (for anonymous shared memory allocated using `mmap`), `sysv` (for System V shared memory allocated via `shmget`) and `windows` (for Windows shared memory). Not all values are supported on all platforms; the first supported option is the default for that platform. The use of the `sysv` option, which is not the default on any platform, is generally discouraged because it typically requires non-default kernel settings to allow for large allocations (see [Section 19.4.1](kernel-resources#SYSVIPC)).

- `dynamic_shared_memory_type` (`enum`) [#](#GUC-DYNAMIC-SHARED-MEMORY-TYPE)

  Specifies the dynamic shared memory implementation that the server should use. Possible values are `posix` (for POSIX shared memory allocated using `shm_open`), `sysv` (for System V shared memory allocated via `shmget`), `windows` (for Windows shared memory), and `mmap` (to simulate shared memory using memory-mapped files stored in the data directory). Not all values are supported on all platforms; the first supported option is usually the default for that platform. The use of the `mmap` option, which is not the default on any platform, is generally discouraged because the operating system may write modified pages back to disk repeatedly, increasing system I/O load; however, it may be useful for debugging, when the `pg_dynshmem` directory is stored on a RAM disk, or when other shared memory facilities are not available.

- `min_dynamic_shared_memory` (`integer`) [#](#GUC-MIN-DYNAMIC-SHARED-MEMORY)

  Specifies the amount of memory that should be allocated at server startup for use by parallel queries. When this memory region is insufficient or exhausted by concurrent queries, new parallel queries try to allocate extra shared memory temporarily from the operating system using the method configured with `dynamic_shared_memory_type`, which may be slower due to memory management overheads. Memory that is allocated at startup with `min_dynamic_shared_memory` is affected by the `huge_pages` setting on operating systems where that is supported, and may be more likely to benefit from larger pages on operating systems where that is managed automatically. The default value is `0` (none). This parameter can only be set at server start.

[#id](#RUNTIME-CONFIG-RESOURCE-DISK)

### 20.4.2. Disk [#](#RUNTIME-CONFIG-RESOURCE-DISK)

- `temp_file_limit` (`integer`) [#](#GUC-TEMP-FILE-LIMIT)

  Specifies the maximum amount of disk space that a process can use for temporary files, such as sort and hash temporary files, or the storage file for a held cursor. A transaction attempting to exceed this limit will be canceled. If this value is specified without units, it is taken as kilobytes. `-1` (the default) means no limit. Only superusers and users with the appropriate `SET` privilege can change this setting.

  This setting constrains the total space used at any instant by all temporary files used by a given PostgreSQL process. It should be noted that disk space used for explicit temporary tables, as opposed to temporary files used behind-the-scenes in query execution, does _not_ count against this limit.

[#id](#RUNTIME-CONFIG-RESOURCE-KERNEL)

### 20.4.3. Kernel Resource Usage [#](#RUNTIME-CONFIG-RESOURCE-KERNEL)

- `max_files_per_process` (`integer`) [#](#GUC-MAX-FILES-PER-PROCESS)

  Sets the maximum number of simultaneously open files allowed to each server subprocess. The default is one thousand files. If the kernel is enforcing a safe per-process limit, you don't need to worry about this setting. But on some platforms (notably, most BSD systems), the kernel will allow individual processes to open many more files than the system can actually support if many processes all try to open that many files. If you find yourself seeing “Too many open files” failures, try reducing this setting. This parameter can only be set at server start.

[#id](#RUNTIME-CONFIG-RESOURCE-VACUUM-COST)

### 20.4.4. Cost-based Vacuum Delay [#](#RUNTIME-CONFIG-RESOURCE-VACUUM-COST)

During the execution of [VACUUM](sql-vacuum) and [ANALYZE](sql-analyze) commands, the system maintains an internal counter that keeps track of the estimated cost of the various I/O operations that are performed. When the accumulated cost reaches a limit (specified by `vacuum_cost_limit`), the process performing the operation will sleep for a short period of time, as specified by `vacuum_cost_delay`. Then it will reset the counter and continue execution.

The intent of this feature is to allow administrators to reduce the I/O impact of these commands on concurrent database activity. There are many situations where it is not important that maintenance commands like `VACUUM` and `ANALYZE` finish quickly; however, it is usually very important that these commands do not significantly interfere with the ability of the system to perform other database operations. Cost-based vacuum delay provides a way for administrators to achieve this.

This feature is disabled by default for manually issued `VACUUM` commands. To enable it, set the `vacuum_cost_delay` variable to a nonzero value.

- `vacuum_cost_delay` (`floating point`) [#](#GUC-VACUUM-COST-DELAY)

  The amount of time that the process will sleep when the cost limit has been exceeded. If this value is specified without units, it is taken as milliseconds. The default value is zero, which disables the cost-based vacuum delay feature. Positive values enable cost-based vacuuming.

  When using cost-based vacuuming, appropriate values for `vacuum_cost_delay` are usually quite small, perhaps less than 1 millisecond. While `vacuum_cost_delay` can be set to fractional-millisecond values, such delays may not be measured accurately on older platforms. On such platforms, increasing `VACUUM`'s throttled resource consumption above what you get at 1ms will require changing the other vacuum cost parameters. You should, nonetheless, keep `vacuum_cost_delay` as small as your platform will consistently measure; large delays are not helpful.

- `vacuum_cost_page_hit` (`integer`) [#](#GUC-VACUUM-COST-PAGE-HIT)

  The estimated cost for vacuuming a buffer found in the shared buffer cache. It represents the cost to lock the buffer pool, lookup the shared hash table and scan the content of the page. The default value is one.

- `vacuum_cost_page_miss` (`integer`) [#](#GUC-VACUUM-COST-PAGE-MISS)

  The estimated cost for vacuuming a buffer that has to be read from disk. This represents the effort to lock the buffer pool, lookup the shared hash table, read the desired block in from the disk and scan its content. The default value is 2.

- `vacuum_cost_page_dirty` (`integer`) [#](#GUC-VACUUM-COST-PAGE-DIRTY)

  The estimated cost charged when vacuum modifies a block that was previously clean. It represents the extra I/O required to flush the dirty block out to disk again. The default value is 20.

- `vacuum_cost_limit` (`integer`) [#](#GUC-VACUUM-COST-LIMIT)

  The accumulated cost that will cause the vacuuming process to sleep. The default value is 200.

### Note

There are certain operations that hold critical locks and should therefore complete as quickly as possible. Cost-based vacuum delays do not occur during such operations. Therefore it is possible that the cost accumulates far higher than the specified limit. To avoid uselessly long delays in such cases, the actual delay is calculated as `vacuum_cost_delay` \* `accumulated_balance` / `vacuum_cost_limit` with a maximum of `vacuum_cost_delay` \* 4.

[#id](#RUNTIME-CONFIG-RESOURCE-BACKGROUND-WRITER)

### 20.4.5. Background Writer [#](#RUNTIME-CONFIG-RESOURCE-BACKGROUND-WRITER)

There is a separate server process called the _background writer_, whose function is to issue writes of “dirty” (new or modified) shared buffers. When the number of clean shared buffers appears to be insufficient, the background writer writes some dirty buffers to the file system and marks them as clean. This reduces the likelihood that server processes handling user queries will be unable to find clean buffers and have to write dirty buffers themselves. However, the background writer does cause a net overall increase in I/O load, because while a repeatedly-dirtied page might otherwise be written only once per checkpoint interval, the background writer might write it several times as it is dirtied in the same interval. The parameters discussed in this subsection can be used to tune the behavior for local needs.

- `bgwriter_delay` (`integer`) [#](#GUC-BGWRITER-DELAY)

  Specifies the delay between activity rounds for the background writer. In each round the writer issues writes for some number of dirty buffers (controllable by the following parameters). It then sleeps for the length of `bgwriter_delay`, and repeats. When there are no dirty buffers in the buffer pool, though, it goes into a longer sleep regardless of `bgwriter_delay`. If this value is specified without units, it is taken as milliseconds. The default value is 200 milliseconds (`200ms`). Note that on many systems, the effective resolution of sleep delays is 10 milliseconds; setting `bgwriter_delay` to a value that is not a multiple of 10 might have the same results as setting it to the next higher multiple of 10. This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `bgwriter_lru_maxpages` (`integer`) [#](#GUC-BGWRITER-LRU-MAXPAGES)

  In each round, no more than this many buffers will be written by the background writer. Setting this to zero disables background writing. (Note that checkpoints, which are managed by a separate, dedicated auxiliary process, are unaffected.) The default value is 100 buffers. This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `bgwriter_lru_multiplier` (`floating point`) [#](#GUC-BGWRITER-LRU-MULTIPLIER)

  The number of dirty buffers written in each round is based on the number of new buffers that have been needed by server processes during recent rounds. The average recent need is multiplied by `bgwriter_lru_multiplier` to arrive at an estimate of the number of buffers that will be needed during the next round. Dirty buffers are written until there are that many clean, reusable buffers available. (However, no more than `bgwriter_lru_maxpages` buffers will be written per round.) Thus, a setting of 1.0 represents a “just in time” policy of writing exactly the number of buffers predicted to be needed. Larger values provide some cushion against spikes in demand, while smaller values intentionally leave writes to be done by server processes. The default is 2.0. This parameter can only be set in the `postgresql.conf` file or on the server command line.

- `bgwriter_flush_after` (`integer`) [#](#GUC-BGWRITER-FLUSH-AFTER)

  Whenever more than this amount of data has been written by the background writer, attempt to force the OS to issue these writes to the underlying storage. Doing so will limit the amount of dirty data in the kernel's page cache, reducing the likelihood of stalls when an `fsync` is issued at the end of a checkpoint, or when the OS writes data back in larger batches in the background. Often that will result in greatly reduced transaction latency, but there also are some cases, especially with workloads that are bigger than [shared_buffers](runtime-config-resource#GUC-SHARED-BUFFERS), but smaller than the OS's page cache, where performance might degrade. This setting may have no effect on some platforms. If this value is specified without units, it is taken as blocks, that is `BLCKSZ` bytes, typically 8kB. The valid range is between `0`, which disables forced writeback, and `2MB`. The default is `512kB` on Linux, `0` elsewhere. (If `BLCKSZ` is not 8kB, the default and maximum values scale proportionally to it.) This parameter can only be set in the `postgresql.conf` file or on the server command line.

Smaller values of `bgwriter_lru_maxpages` and `bgwriter_lru_multiplier` reduce the extra I/O load caused by the background writer, but make it more likely that server processes will have to issue writes for themselves, delaying interactive queries.

[#id](#RUNTIME-CONFIG-RESOURCE-ASYNC-BEHAVIOR)

### 20.4.6. Asynchronous Behavior [#](#RUNTIME-CONFIG-RESOURCE-ASYNC-BEHAVIOR)

- `backend_flush_after` (`integer`) [#](#GUC-BACKEND-FLUSH-AFTER)

  Whenever more than this amount of data has been written by a single backend, attempt to force the OS to issue these writes to the underlying storage. Doing so will limit the amount of dirty data in the kernel's page cache, reducing the likelihood of stalls when an `fsync` is issued at the end of a checkpoint, or when the OS writes data back in larger batches in the background. Often that will result in greatly reduced transaction latency, but there also are some cases, especially with workloads that are bigger than [shared_buffers](runtime-config-resource#GUC-SHARED-BUFFERS), but smaller than the OS's page cache, where performance might degrade. This setting may have no effect on some platforms. If this value is specified without units, it is taken as blocks, that is `BLCKSZ` bytes, typically 8kB. The valid range is between `0`, which disables forced writeback, and `2MB`. The default is `0`, i.e., no forced writeback. (If `BLCKSZ` is not 8kB, the maximum value scales proportionally to it.)

- `effective_io_concurrency` (`integer`) [#](#GUC-EFFECTIVE-IO-CONCURRENCY)

  Sets the number of concurrent disk I/O operations that PostgreSQL expects can be executed simultaneously. Raising this value will increase the number of I/O operations that any individual PostgreSQL session attempts to initiate in parallel. The allowed range is 1 to 1000, or zero to disable issuance of asynchronous I/O requests. Currently, this setting only affects bitmap heap scans.

  For magnetic drives, a good starting point for this setting is the number of separate drives comprising a RAID 0 stripe or RAID 1 mirror being used for the database. (For RAID 5 the parity drive should not be counted.) However, if the database is often busy with multiple queries issued in concurrent sessions, lower values may be sufficient to keep the disk array busy. A value higher than needed to keep the disks busy will only result in extra CPU overhead. SSDs and other memory-based storage can often process many concurrent requests, so the best value might be in the hundreds.

  Asynchronous I/O depends on an effective `posix_fadvise` function, which some operating systems lack. If the function is not present then setting this parameter to anything but zero will result in an error. On some operating systems (e.g., Solaris), the function is present but does not actually do anything.

  The default is 1 on supported systems, otherwise 0. This value can be overridden for tables in a particular tablespace by setting the tablespace parameter of the same name (see [ALTER TABLESPACE](sql-altertablespace)).

- `maintenance_io_concurrency` (`integer`) [#](#GUC-MAINTENANCE-IO-CONCURRENCY)

  Similar to `effective_io_concurrency`, but used for maintenance work that is done on behalf of many client sessions.

  The default is 10 on supported systems, otherwise 0. This value can be overridden for tables in a particular tablespace by setting the tablespace parameter of the same name (see [ALTER TABLESPACE](sql-altertablespace)).

- `max_worker_processes` (`integer`) [#](#GUC-MAX-WORKER-PROCESSES)

  Sets the maximum number of background processes that the system can support. This parameter can only be set at server start. The default is 8.

  When running a standby server, you must set this parameter to the same or higher value than on the primary server. Otherwise, queries will not be allowed in the standby server.

  When changing this value, consider also adjusting [max_parallel_workers](runtime-config-resource#GUC-MAX-PARALLEL-WORKERS), [max_parallel_maintenance_workers](runtime-config-resource#GUC-MAX-PARALLEL-MAINTENANCE-WORKERS), and [max_parallel_workers_per_gather](runtime-config-resource#GUC-MAX-PARALLEL-WORKERS-PER-GATHER).

- `max_parallel_workers_per_gather` (`integer`) [#](#GUC-MAX-PARALLEL-WORKERS-PER-GATHER)

  Sets the maximum number of workers that can be started by a single `Gather` or `Gather Merge` node. Parallel workers are taken from the pool of processes established by [max_worker_processes](runtime-config-resource#GUC-MAX-WORKER-PROCESSES), limited by [max_parallel_workers](runtime-config-resource#GUC-MAX-PARALLEL-WORKERS). Note that the requested number of workers may not actually be available at run time. If this occurs, the plan will run with fewer workers than expected, which may be inefficient. The default value is 2. Setting this value to 0 disables parallel query execution.

  Note that parallel queries may consume very substantially more resources than non-parallel queries, because each worker process is a completely separate process which has roughly the same impact on the system as an additional user session. This should be taken into account when choosing a value for this setting, as well as when configuring other settings that control resource utilization, such as [work_mem](runtime-config-resource#GUC-WORK-MEM). Resource limits such as `work_mem` are applied individually to each worker, which means the total utilization may be much higher across all processes than it would normally be for any single process. For example, a parallel query using 4 workers may use up to 5 times as much CPU time, memory, I/O bandwidth, and so forth as a query which uses no workers at all.

  For more information on parallel query, see [Chapter 15](parallel-query).

- `max_parallel_maintenance_workers` (`integer`) [#](#GUC-MAX-PARALLEL-MAINTENANCE-WORKERS)

  Sets the maximum number of parallel workers that can be started by a single utility command. Currently, the parallel utility commands that support the use of parallel workers are `CREATE INDEX` only when building a B-tree index, and `VACUUM` without `FULL` option. Parallel workers are taken from the pool of processes established by [max_worker_processes](runtime-config-resource#GUC-MAX-WORKER-PROCESSES), limited by [max_parallel_workers](runtime-config-resource#GUC-MAX-PARALLEL-WORKERS). Note that the requested number of workers may not actually be available at run time. If this occurs, the utility operation will run with fewer workers than expected. The default value is 2. Setting this value to 0 disables the use of parallel workers by utility commands.

  Note that parallel utility commands should not consume substantially more memory than equivalent non-parallel operations. This strategy differs from that of parallel query, where resource limits generally apply per worker process. Parallel utility commands treat the resource limit `maintenance_work_mem` as a limit to be applied to the entire utility command, regardless of the number of parallel worker processes. However, parallel utility commands may still consume substantially more CPU resources and I/O bandwidth.

- `max_parallel_workers` (`integer`) [#](#GUC-MAX-PARALLEL-WORKERS)

  Sets the maximum number of workers that the system can support for parallel operations. The default value is 8. When increasing or decreasing this value, consider also adjusting [max_parallel_maintenance_workers](runtime-config-resource#GUC-MAX-PARALLEL-MAINTENANCE-WORKERS) and [max_parallel_workers_per_gather](runtime-config-resource#GUC-MAX-PARALLEL-WORKERS-PER-GATHER). Also, note that a setting for this value which is higher than [max_worker_processes](runtime-config-resource#GUC-MAX-WORKER-PROCESSES) will have no effect, since parallel workers are taken from the pool of worker processes established by that setting.

- `parallel_leader_participation` (`boolean`) [#](#GUC-PARALLEL-LEADER-PARTICIPATION)

  Allows the leader process to execute the query plan under `Gather` and `Gather Merge` nodes instead of waiting for worker processes. The default is `on`. Setting this value to `off` reduces the likelihood that workers will become blocked because the leader is not reading tuples fast enough, but requires the leader process to wait for worker processes to start up before the first tuples can be produced. The degree to which the leader can help or hinder performance depends on the plan type, number of workers and query duration.

- `old_snapshot_threshold` (`integer`) [#](#GUC-OLD-SNAPSHOT-THRESHOLD)

  Sets the minimum amount of time that a query snapshot can be used without risk of a “snapshot too old” error occurring when using the snapshot. Data that has been dead for longer than this threshold is allowed to be vacuumed away. This can help prevent bloat in the face of snapshots which remain in use for a long time. To prevent incorrect results due to cleanup of data which would otherwise be visible to the snapshot, an error is generated when the snapshot is older than this threshold and the snapshot is used to read a page which has been modified since the snapshot was built.

  If this value is specified without units, it is taken as minutes. A value of `-1` (the default) disables this feature, effectively setting the snapshot age limit to infinity. This parameter can only be set at server start.

  Useful values for production work probably range from a small number of hours to a few days. Small values (such as `0` or `1min`) are only allowed because they may sometimes be useful for testing. While a setting as high as `60d` is allowed, please note that in many workloads extreme bloat or transaction ID wraparound may occur in much shorter time frames.

  When this feature is enabled, freed space at the end of a relation cannot be released to the operating system, since that could remove information needed to detect the “snapshot too old” condition. All space allocated to a relation remains associated with that relation for reuse only within that relation unless explicitly freed (for example, with `VACUUM FULL`).

  This setting does not attempt to guarantee that an error will be generated under any particular circumstances. In fact, if the correct results can be generated from (for example) a cursor which has materialized a result set, no error will be generated even if the underlying rows in the referenced table have been vacuumed away. Some tables cannot safely be vacuumed early, and so will not be affected by this setting, such as system catalogs. For such tables this setting will neither reduce bloat nor create a possibility of a “snapshot too old” error on scanning.
