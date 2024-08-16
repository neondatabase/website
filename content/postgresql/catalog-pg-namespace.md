[#id](#CATALOG-PG-NAMESPACE)

## 53.32. `pg_namespace` [#](#CATALOG-PG-NAMESPACE)

The catalog `pg_namespace` stores namespaces. A namespace is the structure underlying SQL schemas: each namespace can have a separate collection of relations, types, etc. without name conflicts.

[#id](#id-1.10.4.34.4)

**Table 53.32. `pg_namespace` Columns**

| Column TypeDescription                                                                     |
| ------------------------------------------------------------------------------------------ |
| `oid` `oid`Row identifier                                                                  |
| `nspname` `name`Name of the namespace                                                      |
| `nspowner` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)Owner of the namespace |
| `nspacl` `aclitem[]`Access privileges; see [Section 5.7](ddl-priv) for details             |
