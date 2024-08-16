[#id](#VIEW-PG-TABLES)

## 54.30. `pg_tables` [#](#VIEW-PG-TABLES)

The view `pg_tables` provides access to useful information about each table in the database.

[#id](#id-1.10.5.34.4)

**Table 54.30. `pg_tables` Columns**

| Column TypeDescription                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace).`nspname`)Name of schema containing table                                      |
| `tablename` `name` (references [`pg_class`](catalog-pg-class).`relname`)Name of table                                                                 |
| `tableowner` `name` (references [`pg_authid`](catalog-pg-authid).`rolname`)Name of table's owner                                                      |
| `tablespace` `name` (references [`pg_tablespace`](catalog-pg-tablespace).`spcname`)Name of tablespace containing table (null if default for database) |
| `hasindexes` `bool` (references [`pg_class`](catalog-pg-class).`relhasindex`)True if table has (or recently had) any indexes                          |
| `hasrules` `bool` (references [`pg_class`](catalog-pg-class).`relhasrules`)True if table has (or once had) rules                                      |
| `hastriggers` `bool` (references [`pg_class`](catalog-pg-class).`relhastriggers`)True if table has (or once had) triggers                             |
| `rowsecurity` `bool` (references [`pg_class`](catalog-pg-class).`relrowsecurity`)True if row security is enabled on the table                         |
