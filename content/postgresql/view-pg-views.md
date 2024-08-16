[#id](#VIEW-PG-VIEWS)

## 54.35. `pg_views` [#](#VIEW-PG-VIEWS)

The view `pg_views` provides access to useful information about each view in the database.

[#id](#id-1.10.5.39.4)

**Table 54.35. `pg_views` Columns**

| Column TypeDescription                                                                                          |
| --------------------------------------------------------------------------------------------------------------- |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace).`nspname`)Name of schema containing view |
| `viewname` `name` (references [`pg_class`](catalog-pg-class).`relname`)Name of view                             |
| `viewowner` `name` (references [`pg_authid`](catalog-pg-authid).`rolname`)Name of view's owner                  |
| `definition` `text`View definition (a reconstructed [SELECT](sql-select) query)                                 |
