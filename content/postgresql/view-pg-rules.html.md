<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|               54.21. `pg_rules`               |                                             |                          |                                                       |                                                       |
| :-------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | ----------------------------------------------------: |
| [Prev](view-pg-roles.html "54.20. pg_roles")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-seclabels.html "54.22. pg_seclabels") |

***

## 54.21. `pg_rules` [#](#VIEW-PG-RULES)

[]()

The view `pg_rules` provides access to useful information about query rewrite rules.

**Table 54.21. `pg_rules` Columns**

| Column TypeDescription                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`nspname`)Name of schema containing table |
| `tablename` `name` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`relname`)Name of table the rule is for                |
| `rulename` `name` (references [`pg_rewrite`](catalog-pg-rewrite.html "53.45. pg_rewrite").`rulename`)Name of rule                           |
| `definition` `text`Rule definition (a reconstructed creation command)                                                                       |

\


The `pg_rules` view excludes the `ON SELECT` rules of views and materialized views; those can be seen in [`pg_views`](view-pg-views.html "54.35. pg_views") and [`pg_matviews`](view-pg-matviews.html "54.13. pg_matviews").

***

|                                               |                                                       |                                                       |
| :-------------------------------------------- | :---------------------------------------------------: | ----------------------------------------------------: |
| [Prev](view-pg-roles.html "54.20. pg_roles")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-seclabels.html "54.22. pg_seclabels") |
| 54.20. `pg_roles`                             | [Home](index.html "PostgreSQL 17devel Documentation") |                                 54.22. `pg_seclabels` |
