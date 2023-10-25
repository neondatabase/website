

|                            53.38. `pg_policy`                            |                                                   |                             |                                                       |                                                |
| :----------------------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | ---------------------------------------------: |
| [Prev](catalog-pg-partitioned-table.html "53.37. pg_partitioned_table")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-proc.html "53.39. pg_proc") |

***

## 53.38. `pg_policy` [#](#CATALOG-PG-POLICY)

The catalog `pg_policy` stores row-level security policies for tables. A policy includes the kind of command that it applies to (possibly all commands), the roles that it applies to, the expression to be added as a security-barrier qualification to queries that include the table, and the expression to be added as a `WITH CHECK` option for queries that attempt to add new records to the table.

**Table 53.38. `pg_policy` Columns**

| Column TypeDescription                                                                                                                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                                                                                                      |
| `polname` `name`The name of the policy                                                                                                                                                                                                                         |
| `polrelid` `oid` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)The table to which the policy applies                                                                                                                                 |
| `polcmd` `char`The command type to which the policy is applied: `r` for [SELECT](sql-select.html "SELECT"), `a` for [INSERT](sql-insert.html "INSERT"), `w` for [UPDATE](sql-update.html "UPDATE"), `d` for [DELETE](sql-delete.html "DELETE"), or `*` for all |
| `polpermissive` `bool`Is the policy permissive or restrictive?                                                                                                                                                                                                 |
| `polroles` `oid[]` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)The roles to which the policy is applied; zero means `PUBLIC` (and normally appears alone in the array)                                                           |
| `polqual` `pg_node_tree`The expression tree to be added to the security barrier qualifications for queries that use the table                                                                                                                                  |
| `polwithcheck` `pg_node_tree`The expression tree to be added to the WITH CHECK qualifications for queries that attempt to add rows to the table                                                                                                                |

\

### Note

Policies stored in `pg_policy` are applied only when [`pg_class`](catalog-pg-class.html "53.11. pg_class").`relrowsecurity` is set for their table.

***

|                                                                          |                                                       |                                                |
| :----------------------------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------: |
| [Prev](catalog-pg-partitioned-table.html "53.37. pg_partitioned_table")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-proc.html "53.39. pg_proc") |
| 53.37. `pg_partitioned_table`                                            | [Home](index.html "PostgreSQL 17devel Documentation") |                               53.39. `pg_proc` |
