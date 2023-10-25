

|                              53.32. `pg_namespace`                             |                                                   |                             |                                                       |                                                      |
| :----------------------------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | ---------------------------------------------------: |
| [Prev](catalog-pg-largeobject-metadata.html "53.31. pg_largeobject_metadata")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-opclass.html "53.33. pg_opclass") |

***

## 53.32. `pg_namespace` [#](#CATALOG-PG-NAMESPACE)

The catalog `pg_namespace` stores namespaces. A namespace is the structure underlying SQL schemas: each namespace can have a separate collection of relations, types, etc. without name conflicts.

**Table 53.32. `pg_namespace` Columns**

| Column TypeDescription                                                                                            |
| ----------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                         |
| `nspname` `name`Name of the namespace                                                                             |
| `nspowner` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)Owner of the namespace |
| `nspacl` `aclitem[]`Access privileges; see [Section 5.7](ddl-priv.html "5.7. Privileges") for details             |

***

|                                                                                |                                                       |                                                      |
| :----------------------------------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------------: |
| [Prev](catalog-pg-largeobject-metadata.html "53.31. pg_largeobject_metadata")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-opclass.html "53.33. pg_opclass") |
| 53.31. `pg_largeobject_metadata`                                               | [Home](index.html "PostgreSQL 17devel Documentation") |                                  53.33. `pg_opclass` |
