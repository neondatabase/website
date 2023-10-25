<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 54.14. `pg_policies`                |                                             |                          |                                                       |                                                                           |
| :-------------------------------------------------: | :------------------------------------------ | :----------------------: | ----------------------------------------------------: | ------------------------------------------------------------------------: |
| [Prev](view-pg-matviews.html "54.13. pg_matviews")  | [Up](views.html "Chapter 54. System Views") | Chapter 54. System Views | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](view-pg-prepared-statements.html "54.15. pg_prepared_statements") |

***

## 54.14. `pg_policies` [#](#VIEW-PG-POLICIES)



The view `pg_policies` provides access to useful information about each row-level security policy in the database.

**Table 54.14. `pg_policies` Columns**

| Column TypeDescription                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`nspname`)Name of schema containing table policy is on |
| `tablename` `name` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`relname`)Name of table policy is on                                |
| `policyname` `name` (references [`pg_policy`](catalog-pg-policy.html "53.38. pg_policy").`polname`)Name of policy                                        |
| `permissive` `text`Is the policy permissive or restrictive?                                                                                              |
| `roles` `name[]`The roles to which this policy applies                                                                                                   |
| `cmd` `text`The command type to which the policy is applied                                                                                              |
| `qual` `text`The expression added to the security barrier qualifications for queries that this policy applies to                                         |
| `with_check` `text`The expression added to the WITH CHECK qualifications for queries that attempt to add rows to this table                              |

***

|                                                     |                                                       |                                                                           |
| :-------------------------------------------------- | :---------------------------------------------------: | ------------------------------------------------------------------------: |
| [Prev](view-pg-matviews.html "54.13. pg_matviews")  |      [Up](views.html "Chapter 54. System Views")      |  [Next](view-pg-prepared-statements.html "54.15. pg_prepared_statements") |
| 54.13. `pg_matviews`                                | [Home](index.html "PostgreSQL 17devel Documentation") |                                           54.15. `pg_prepared_statements` |
