[#id](#VIEW-PG-REPLICATION-ORIGIN-STATUS)

## 54.18. `pg_replication_origin_status` [#](#VIEW-PG-REPLICATION-ORIGIN-STATUS)

The `pg_replication_origin_status` view contains information about how far replay for a certain origin has progressed. For more on replication origins see [Chapter 50](replication-origins).

[#id](#id-1.10.5.22.4)

**Table 54.18. `pg_replication_origin_status` Columns**

| Column TypeDescription                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `local_id` `oid` (references [`pg_replication_origin`](catalog-pg-replication-origin).`roident`)internal node identifier                                                    |
| `external_id` `text` (references [`pg_replication_origin`](catalog-pg-replication-origin).`roname`)external node identifier                                                 |
| `remote_lsn` `pg_lsn`The origin node's LSN up to which data has been replicated.                                                                                            |
| `local_lsn` `pg_lsn`This node's LSN at which `remote_lsn` has been replicated. Used to flush commit records before persisting data to disk when using asynchronous commits. |
