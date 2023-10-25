

|                           53.24. `pg_foreign_server`                           |                                                   |                             |                                                       |                                                                  |
| :----------------------------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | ---------------------------------------------------------------: |
| [Prev](catalog-pg-foreign-data-wrapper.html "53.23. pg_foreign_data_wrapper")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-foreign-table.html "53.25. pg_foreign_table") |

***

## 53.24. `pg_foreign_server` [#](#CATALOG-PG-FOREIGN-SERVER)

The catalog `pg_foreign_server` stores foreign server definitions. A foreign server describes a source of external data, such as a remote server. Foreign servers are accessed via foreign-data wrappers.

**Table 53.24. `pg_foreign_server` Columns**

| Column TypeDescription                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `oid` `oid`Row identifier                                                                                                                                                                  |
| `srvname` `name`Name of the foreign server                                                                                                                                                 |
| `srvowner` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)Owner of the foreign server                                                                     |
| `srvfdw` `oid` (references [`pg_foreign_data_wrapper`](catalog-pg-foreign-data-wrapper.html "53.23. pg_foreign_data_wrapper").`oid`)OID of the foreign-data wrapper of this foreign server |
| `srvtype` `text`Type of the server (optional)                                                                                                                                              |
| `srvversion` `text`Version of the server (optional)                                                                                                                                        |
| `srvacl` `aclitem[]`Access privileges; see [Section 5.7](ddl-priv.html "5.7. Privileges") for details                                                                                      |
| `srvoptions` `text[]`Foreign server specific options, as “keyword=value” strings                                                                                                           |

***

|                                                                                |                                                       |                                                                  |
| :----------------------------------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------------------------: |
| [Prev](catalog-pg-foreign-data-wrapper.html "53.23. pg_foreign_data_wrapper")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-foreign-table.html "53.25. pg_foreign_table") |
| 53.23. `pg_foreign_data_wrapper`                                               | [Home](index.html "PostgreSQL 17devel Documentation") |                                        53.25. `pg_foreign_table` |
