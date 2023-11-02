## 53.32. `pg_namespace` [#](#CATALOG-PG-NAMESPACE)

The catalog `pg_namespace` stores namespaces. A namespace is the structure underlying SQL schemas: each namespace can have a separate collection of relations, types, etc. without name conflicts.

**Table 53.32. `pg_namespace` Columns**

| Column TypeDescription                                                                                            |
| ----------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                         |
| `nspname` `name`Name of the namespace                                                                             |
| `nspowner` `oid` (references [`pg_authid`](catalog-pg-authid "53.8. pg_authid").`oid`)Owner of the namespace |
| `nspacl` `aclitem[]`Access privileges; see [Section 5.7](ddl-priv "5.7. Privileges") for details             |