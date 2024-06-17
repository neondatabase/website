[#id](#VIEW-PG-MATVIEWS)

## 54.13. `pg_matviews` [#](#VIEW-PG-MATVIEWS)

The view `pg_matviews` provides access to useful information about each materialized view in the database.

[#id](#id-1.10.5.17.5)

**Table 54.13. `pg_matviews` Columns**

| Column TypeDescription                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace).`nspname`)Name of schema containing materialized view                                      |
| `matviewname` `name` (references [`pg_class`](catalog-pg-class).`relname`)Name of materialized view                                                               |
| `matviewowner` `name` (references [`pg_authid`](catalog-pg-authid).`rolname`)Name of materialized view's owner                                                    |
| `tablespace` `name` (references [`pg_tablespace`](catalog-pg-tablespace).`spcname`)Name of tablespace containing materialized view (null if default for database) |
| `hasindexes` `bool`True if materialized view has (or recently had) any indexes                                                                                    |
| `ispopulated` `bool`True if materialized view is currently populated                                                                                              |
| `definition` `text`Materialized view definition (a reconstructed [SELECT](sql-select) query)                                                                      |
