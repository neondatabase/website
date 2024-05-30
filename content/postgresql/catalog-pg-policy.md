[#id](#CATALOG-PG-POLICY)

## 53.38. `pg_policy` [#](#CATALOG-PG-POLICY)

The catalog `pg_policy` stores row-level security policies for tables. A policy includes the kind of command that it applies to (possibly all commands), the roles that it applies to, the expression to be added as a security-barrier qualification to queries that include the table, and the expression to be added as a `WITH CHECK` option for queries that attempt to add new records to the table.

[#id](#id-1.10.4.40.4)

**Table 53.38. `pg_policy` Columns**

| Column TypeDescription                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `oid` `oid`Row identifier                                                                                                                                                                              |
| `polname` `name`The name of the policy                                                                                                                                                                 |
| `polrelid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)The table to which the policy applies                                                                                                |
| `polcmd` `char`The command type to which the policy is applied: `r` for [SELECT](sql-select), `a` for [INSERT](sql-insert), `w` for [UPDATE](sql-update), `d` for [DELETE](sql-delete), or `*` for all |
| `polpermissive` `bool`Is the policy permissive or restrictive?                                                                                                                                         |
| `polroles` `oid[]` (references [`pg_authid`](catalog-pg-authid).`oid`)The roles to which the policy is applied; zero means `PUBLIC` (and normally appears alone in the array)                          |
| `polqual` `pg_node_tree`The expression tree to be added to the security barrier qualifications for queries that use the table                                                                          |
| `polwithcheck` `pg_node_tree`The expression tree to be added to the WITH CHECK qualifications for queries that attempt to add rows to the table                                                        |

### Note

Policies stored in `pg_policy` are applied only when [`pg_class`](catalog-pg-class).`relrowsecurity` is set for their table.
