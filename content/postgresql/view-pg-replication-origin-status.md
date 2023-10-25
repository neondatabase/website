<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                  54.18. `pg_replication_origin_status`                  |                                             |                          |                                                       |                                                                       |
| :---------------------------------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](view-pg-publication-tables.html "54.17. pg_publication_tables")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-replication-slots.html "54.19. pg_replication_slots") |

***

## 54.18. `pg_replication_origin_status` [#](#VIEW-PG-REPLICATION-ORIGIN-STATUS)



The `pg_replication_origin_status` view contains information about how far replay for a certain origin has progressed. For more on replication origins see [Chapter 50](replication-origins.html "Chapter 50. Replication Progress Tracking").

**Table 54.18. `pg_replication_origin_status` Columns**

| Column TypeDescription                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `local_id` `oid` (references [`pg_replication_origin`](catalog-pg-replication-origin.html "53.44. pg_replication_origin").`roident`)internal node identifier                |
| `external_id` `text` (references [`pg_replication_origin`](catalog-pg-replication-origin.html "53.44. pg_replication_origin").`roname`)external node identifier             |
| `remote_lsn` `pg_lsn`The origin node's LSN up to which data has been replicated.                                                                                            |
| `local_lsn` `pg_lsn`This node's LSN at which `remote_lsn` has been replicated. Used to flush commit records before persisting data to disk when using asynchronous commits. |

***

|                                                                         |                                                       |                                                                       |
| :---------------------------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](view-pg-publication-tables.html "54.17. pg_publication_tables")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-replication-slots.html "54.19. pg_replication_slots") |
| 54.17. `pg_publication_tables`                                          | [Home](index.html "PostgreSQL 17devel Documentation") |                                         54.19. `pg_replication_slots` |
