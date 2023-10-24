<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                         54.30. `pg_tables`                        |                                             |                          |                                                       |                                                                     |
| :---------------------------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](view-pg-stats-ext-exprs.html "54.29. pg_stats_ext_exprs")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-timezone-abbrevs.html "54.31. pg_timezone_abbrevs") |

***

## 54.30. `pg_tables` [#](#VIEW-PG-TABLES)

The view `pg_tables` provides access to useful information about each table in the database.

**Table 54.30. `pg_tables` Columns**

| Column TypeDescription                                                                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`nspname`)Name of schema containing table                                       |
| `tablename` `name` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`relname`)Name of table                                                                      |
| `tableowner` `name` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`rolname`)Name of table's owner                                                           |
| `tablespace` `name` (references [`pg_tablespace`](catalog-pg-tablespace.html "53.56. pg_tablespace").`spcname`)Name of tablespace containing table (null if default for database) |
| `hasindexes` `bool` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`relhasindex`)True if table has (or recently had) any indexes                               |
| `hasrules` `bool` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`relhasrules`)True if table has (or once had) rules                                           |
| `hastriggers` `bool` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`relhastriggers`)True if table has (or once had) triggers                                  |
| `rowsecurity` `bool` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`relrowsecurity`)True if row security is enabled on the table                              |

***

|                                                                   |                                                       |                                                                     |
| :---------------------------------------------------------------- | :---------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](view-pg-stats-ext-exprs.html "54.29. pg_stats_ext_exprs")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-timezone-abbrevs.html "54.31. pg_timezone_abbrevs") |
| 54.29. `pg_stats_ext_exprs`                                       | [Home](index.html "PostgreSQL 17devel Documentation") |                                        54.31. `pg_timezone_abbrevs` |
