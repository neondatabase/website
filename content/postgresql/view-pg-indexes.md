## 54.11. `pg_indexes` [#](#VIEW-PG-INDEXES)

The view `pg_indexes` provides access to useful information about each index in the database.

**Table 54.11. `pg_indexes` Columns**

| Column TypeDescription                                                                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`nspname`)Name of schema containing table and index                             |
| `tablename` `name` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`relname`)Name of table the index is for                                                     |
| `indexname` `name` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`relname`)Name of index                                                                      |
| `tablespace` `name` (references [`pg_tablespace`](catalog-pg-tablespace.html "53.56. pg_tablespace").`spcname`)Name of tablespace containing index (null if default for database) |
| `indexdef` `text`Index definition (a reconstructed [CREATE INDEX](sql-createindex.html "CREATE INDEX") command)                                                                   |