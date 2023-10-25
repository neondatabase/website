<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|            53.65. `pg_user_mapping`            |                                                   |                             |                                                       |                                                |
| :--------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | ---------------------------------------------: |
| [Prev](catalog-pg-type.html "53.64. pg_type")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](views.html "Chapter 54. System Views") |

***

## 53.65. `pg_user_mapping` [#](#CATALOG-PG-USER-MAPPING)

The catalog `pg_user_mapping` stores the mappings from local user to remote. Access to this catalog is restricted from normal users, use the view [`pg_user_mappings`](view-pg-user-mappings.html "54.34. pg_user_mappings") instead.

**Table 53.66. `pg_user_mapping` Columns**

| Column TypeDescription                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                    |
| `umuser` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)OID of the local role being mapped, or zero if the user mapping is public           |
| `umserver` `oid` (references [`pg_foreign_server`](catalog-pg-foreign-server.html "53.24. pg_foreign_server").`oid`)The OID of the foreign server that contains this mapping |
| `umoptions` `text[]`User mapping specific options, as “keyword=value” strings                                                                                                |

***

|                                                |                                                       |                                                |
| :--------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------: |
| [Prev](catalog-pg-type.html "53.64. pg_type")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](views.html "Chapter 54. System Views") |
| 53.64. `pg_type`                               | [Home](index.html "PostgreSQL 17devel Documentation") |                       Chapter 54. System Views |
