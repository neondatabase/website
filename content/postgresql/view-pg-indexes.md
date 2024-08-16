[#id](#VIEW-PG-INDEXES)

## 54.11. `pg_indexes` [#](#VIEW-PG-INDEXES)

The view `pg_indexes` provides access to useful information about each index in the database.

[#id](#id-1.10.5.15.4)

**Table 54.11. `pg_indexes` Columns**

| Column TypeDescription                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace).`nspname`)Name of schema containing table and index                            |
| `tablename` `name` (references [`pg_class`](catalog-pg-class).`relname`)Name of table the index is for                                                |
| `indexname` `name` (references [`pg_class`](catalog-pg-class).`relname`)Name of index                                                                 |
| `tablespace` `name` (references [`pg_tablespace`](catalog-pg-tablespace).`spcname`)Name of tablespace containing index (null if default for database) |
| `indexdef` `text`Index definition (a reconstructed [CREATE INDEX](sql-createindex) command)                                                           |
