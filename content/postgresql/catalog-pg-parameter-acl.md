<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                53.36. `pg_parameter_acl`               |                                                   |                             |                                                       |                                                                          |
| :----------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------------: |
| [Prev](catalog-pg-opfamily.html "53.35. pg_opfamily")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-partitioned-table.html "53.37. pg_partitioned_table") |

***

## 53.36. `pg_parameter_acl` [#](#CATALOG-PG-PARAMETER-ACL)

[]()

The catalog `pg_parameter_acl` records configuration parameters for which privileges have been granted to one or more roles. No entry is made for parameters that have default privileges.

Unlike most system catalogs, `pg_parameter_acl` is shared across all databases of a cluster: there is only one copy of `pg_parameter_acl` per cluster, not one per database.

**Table 53.36. `pg_parameter_acl` Columns**

| Column TypeDescription                                                                                |
| ----------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                             |
| `parname` `text`The name of a configuration parameter for which privileges are granted                |
| `paracl` `aclitem[]`Access privileges; see [Section 5.7](ddl-priv.html "5.7. Privileges") for details |

***

|                                                        |                                                       |                                                                          |
| :----------------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------------------------------: |
| [Prev](catalog-pg-opfamily.html "53.35. pg_opfamily")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-partitioned-table.html "53.37. pg_partitioned_table") |
| 53.35. `pg_opfamily`                                   | [Home](index.html "PostgreSQL 17devel Documentation") |                                            53.37. `pg_partitioned_table` |
