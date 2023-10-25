<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                       54.35. `pg_views`                       |                                             |                          |                                                       |                                                           |
| :-----------------------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | --------------------------------------------------------: |
| [Prev](view-pg-user-mappings.html "54.34. pg_user_mappings")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-wait-events.html "54.36. pg_wait_events") |

***

## 54.35. `pg_views` [#](#VIEW-PG-VIEWS)



The view `pg_views` provides access to useful information about each view in the database.

**Table 54.35. `pg_views` Columns**

| Column TypeDescription                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------ |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`nspname`)Name of schema containing view |
| `viewname` `name` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`relname`)Name of view                                 |
| `viewowner` `name` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`rolname`)Name of view's owner                      |
| `definition` `text`View definition (a reconstructed [SELECT](sql-select.html "SELECT") query)                                              |

***

|                                                               |                                                       |                                                           |
| :------------------------------------------------------------ | :---------------------------------------------------: | --------------------------------------------------------: |
| [Prev](view-pg-user-mappings.html "54.34. pg_user_mappings")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-wait-events.html "54.36. pg_wait_events") |
| 54.34. `pg_user_mappings`                                     | [Home](index.html "PostgreSQL 17devel Documentation") |                                   54.36. `pg_wait_events` |
