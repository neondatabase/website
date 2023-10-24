<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|              14.5. Non-Durable Settings              |                                                            |                              |                                                       |                                                           |
| :--------------------------------------------------: | :--------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | --------------------------------------------------------: |
| [Prev](populate.html "14.4. Populating a Database")  | [Up](performance-tips.html "Chapter 14. Performance Tips") | Chapter 14. Performance Tips | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](parallel-query.html "Chapter 15. Parallel Query") |

***

## 14.5. Non-Durable Settings [#](#NON-DURABILITY)

[]()

Durability is a database feature that guarantees the recording of committed transactions even if the server crashes or loses power. However, durability adds significant database overhead, so if your site does not require such a guarantee, PostgreSQL can be configured to run much faster. The following are configuration changes you can make to improve performance in such cases. Except as noted below, durability is still guaranteed in case of a crash of the database software; only an abrupt operating system crash creates a risk of data loss or corruption when these settings are used.

*   Place the database cluster's data directory in a memory-backed file system (i.e., RAM disk). This eliminates all database disk I/O, but limits data storage to the amount of available memory (and perhaps swap).
*   Turn off [fsync](runtime-config-wal.html#GUC-FSYNC); there is no need to flush data to disk.
*   Turn off [synchronous\_commit](runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT); there might be no need to force WAL writes to disk on every commit. This setting does risk transaction loss (though not data corruption) in case of a crash of the *database*.
*   Turn off [full\_page\_writes](runtime-config-wal.html#GUC-FULL-PAGE-WRITES); there is no need to guard against partial page writes.
*   Increase [max\_wal\_size](runtime-config-wal.html#GUC-MAX-WAL-SIZE) and [checkpoint\_timeout](runtime-config-wal.html#GUC-CHECKPOINT-TIMEOUT); this reduces the frequency of checkpoints, but increases the storage requirements of `/pg_wal`.
*   Create [unlogged tables](sql-createtable.html#SQL-CREATETABLE-UNLOGGED) to avoid WAL writes, though it makes the tables non-crash-safe.

***

|                                                      |                                                            |                                                           |
| :--------------------------------------------------- | :--------------------------------------------------------: | --------------------------------------------------------: |
| [Prev](populate.html "14.4. Populating a Database")  | [Up](performance-tips.html "Chapter 14. Performance Tips") |  [Next](parallel-query.html "Chapter 15. Parallel Query") |
| 14.4. Populating a Database                          |    [Home](index.html "PostgreSQL 17devel Documentation")   |                                Chapter 15. Parallel Query |
