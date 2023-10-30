## 53.45. `pg_rewrite` [#](#CATALOG-PG-REWRITE)

The catalog `pg_rewrite` stores rewrite rules for tables and views.

**Table 53.45. `pg_rewrite` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                                                                                                                             |
| `rulename` `name`Rule name                                                                                                                                                                                                                                                            |
| `ev_class` `oid` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)The table this rule is for                                                                                                                                                                   |
| `ev_type` `char`Event type that the rule is for: 1 = [SELECT](sql-select.html "SELECT"), 2 = [UPDATE](sql-update.html "UPDATE"), 3 = [INSERT](sql-insert.html "INSERT"), 4 = [DELETE](sql-delete.html "DELETE")                                                                       |
| `ev_enabled` `char`Controls in which [session\_replication\_role](runtime-config-client.html#GUC-SESSION-REPLICATION-ROLE) modes the rule fires. `O` = rule fires in “origin” and “local” modes, `D` = rule is disabled, `R` = rule fires in “replica” mode, `A` = rule fires always. |
| `is_instead` `bool`True if the rule is an `INSTEAD` rule                                                                                                                                                                                                                              |
| `ev_qual` `pg_node_tree`Expression tree (in the form of a `nodeToString()` representation) for the rule's qualifying condition                                                                                                                                                        |
| `ev_action` `pg_node_tree`Query tree (in the form of a `nodeToString()` representation) for the rule's action                                                                                                                                                                         |

\

### Note

`pg_class.relhasrules` must be true if a table has any rules in this catalog.