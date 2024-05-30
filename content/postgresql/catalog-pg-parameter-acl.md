[#id](#CATALOG-PG-PARAMETER-ACL)

## 53.36. `pg_parameter_acl` [#](#CATALOG-PG-PARAMETER-ACL)

The catalog `pg_parameter_acl` records configuration parameters for which privileges have been granted to one or more roles. No entry is made for parameters that have default privileges.

Unlike most system catalogs, `pg_parameter_acl` is shared across all databases of a cluster: there is only one copy of `pg_parameter_acl` per cluster, not one per database.

[#id](#id-1.10.4.38.5)

**Table 53.36. `pg_parameter_acl` Columns**

| Column TypeDescription                                                                 |
| -------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                              |
| `parname` `text`The name of a configuration parameter for which privileges are granted |
| `paracl` `aclitem[]`Access privileges; see [Section 5.7](ddl-priv) for details         |
