

|                  73.7. Heap-Only Tuples (HOT)                  |                                                            |                                       |                                                       |                                                                 |
| :------------------------------------------------------------: | :--------------------------------------------------------- | :-----------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](storage-page-layout.html "73.6. Database Page Layout")  | [Up](storage.html "Chapter 73. Database Physical Storage") | Chapter 73. Database Physical Storage | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](transactions.html "Chapter 74. Transaction Processing") |

***

## 73.7. Heap-Only Tuples (HOT) [#](#STORAGE-HOT)

To allow for high concurrency, PostgreSQL uses [multiversion concurrency control](mvcc-intro.html "13.1. Introduction") (MVCC) to store rows. However, MVCC has some downsides for update queries. Specifically, updates require new versions of rows to be added to tables. This can also require new index entries for each updated row, and removal of old versions of rows and their index entries can be expensive.

To help reduce the overhead of updates, PostgreSQL has an optimization called heap-only tuples (HOT). This optimization is possible when:

* The update does not modify any columns referenced by the table's indexes, including expression and partial indexes.
* There is sufficient free space on the page containing the old row for the updated row.

In such cases, heap-only tuples provide two optimizations:

* New index entries are not needed to represent updated rows.
* Old versions of updated rows can be completely removed during normal operation, including `SELECT`s, instead of requiring periodic vacuum operations. (This is possible because indexes do not reference their [page item identifiers](storage-page-layout.html "73.6. Database Page Layout").)

In summary, heap-only tuple updates can only be created if columns used by indexes are not updated. You can increase the likelihood of sufficient page space for HOT updates by decreasing a table's [`fillfactor`](sql-createtable.html#RELOPTION-FILLFACTOR). If you don't, HOT updates will still happen because new rows will naturally migrate to new pages and existing pages with sufficient free space for new row versions. The system view [pg\_stat\_all\_tables](monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW "28.2.18. pg_stat_all_tables") allows monitoring of the occurrence of HOT and non-HOT updates.

***

|                                                                |                                                            |                                                                 |
| :------------------------------------------------------------- | :--------------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](storage-page-layout.html "73.6. Database Page Layout")  | [Up](storage.html "Chapter 73. Database Physical Storage") |  [Next](transactions.html "Chapter 74. Transaction Processing") |
| 73.6. Database Page Layout                                     |    [Home](index.html "PostgreSQL 17devel Documentation")   |                              Chapter 74. Transaction Processing |
