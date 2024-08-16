[#id](#STORAGE-HOT)

## 73.7. Heap-Only Tuples (HOT) [#](#STORAGE-HOT)

To allow for high concurrency, PostgreSQL uses [multiversion concurrency control](mvcc-intro) (MVCC) to store rows. However, MVCC has some downsides for update queries. Specifically, updates require new versions of rows to be added to tables. This can also require new index entries for each updated row, and removal of old versions of rows and their index entries can be expensive.

To help reduce the overhead of updates, PostgreSQL has an optimization called heap-only tuples (HOT). This optimization is possible when:

- The update does not modify any columns referenced by the table's indexes, including expression and partial indexes.

- There is sufficient free space on the page containing the old row for the updated row.

In such cases, heap-only tuples provide two optimizations:

- New index entries are not needed to represent updated rows.

- Old versions of updated rows can be completely removed during normal operation, including `SELECT`s, instead of requiring periodic vacuum operations. (This is possible because indexes do not reference their [page item identifiers](storage-page-layout).)

In summary, heap-only tuple updates can only be created if columns used by indexes are not updated. You can increase the likelihood of sufficient page space for HOT updates by decreasing a table's [`fillfactor`](sql-createtable#RELOPTION-FILLFACTOR). If you don't, HOT updates will still happen because new rows will naturally migrate to new pages and existing pages with sufficient free space for new row versions. The system view [pg_stat_all_tables](monitoring-stats#MONITORING-PG-STAT-ALL-TABLES-VIEW) allows monitoring of the occurrence of HOT and non-HOT updates.
