[#id](#VIEW-PG-POLICIES)

## 54.14. `pg_policies` [#](#VIEW-PG-POLICIES)

The view `pg_policies` provides access to useful information about each row-level security policy in the database.

[#id](#id-1.10.5.18.4)

**Table 54.14. `pg_policies` Columns**

| Column TypeDescription                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------- |
| `schemaname` `name` (references [`pg_namespace`](catalog-pg-namespace).`nspname`)Name of schema containing table policy is on |
| `tablename` `name` (references [`pg_class`](catalog-pg-class).`relname`)Name of table policy is on                            |
| `policyname` `name` (references [`pg_policy`](catalog-pg-policy).`polname`)Name of policy                                     |
| `permissive` `text`Is the policy permissive or restrictive?                                                                   |
| `roles` `name[]`The roles to which this policy applies                                                                        |
| `cmd` `text`The command type to which the policy is applied                                                                   |
| `qual` `text`The expression added to the security barrier qualifications for queries that this policy applies to              |
| `with_check` `text`The expression added to the WITH CHECK qualifications for queries that attempt to add rows to this table   |
