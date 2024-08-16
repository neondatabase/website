[#id](#VIEW-PG-RULES)

## 54.21. `pg_rules` [#](#VIEW-PG-RULES)

The view `pg_rules` provides access to useful information about query rewrite rules.

[#id](#id-1.10.5.25.4)

**Table 54.21. `pg_rules` Columns**

| Column TypeDescription                                                                                           |
| ---------------------------------------------------------------------------------------------------------------- |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace).`nspname`)Name of schema containing table |
| `tablename` `name` (references [`pg_class`](catalog-pg-class).`relname`)Name of table the rule is for            |
| `rulename` `name` (references [`pg_rewrite`](catalog-pg-rewrite).`rulename`)Name of rule                         |
| `definition` `text`Rule definition (a reconstructed creation command)                                            |

The `pg_rules` view excludes the `ON SELECT` rules of views and materialized views; those can be seen in [`pg_views`](view-pg-views) and [`pg_matviews`](view-pg-matviews).
