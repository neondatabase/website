<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|             53.23. `pg_foreign_data_wrapper`             |                                                   |                             |                                                       |                                                                    |
| :------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------: |
| [Prev](catalog-pg-extension.html "53.22. pg_extension")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-foreign-server.html "53.24. pg_foreign_server") |

***

## 53.23. `pg_foreign_data_wrapper` [#](#CATALOG-PG-FOREIGN-DATA-WRAPPER)

The catalog `pg_foreign_data_wrapper` stores foreign-data wrapper definitions. A foreign-data wrapper is the mechanism by which external data, residing on foreign servers, is accessed.

**Table 53.23. `pg_foreign_data_wrapper` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                                                                                                                                                                                           |
| `fdwname` `name`Name of the foreign-data wrapper                                                                                                                                                                                                                                                                                                    |
| `fdwowner` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)Owner of the foreign-data wrapper                                                                                                                                                                                                                        |
| `fdwhandler` `oid` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)References a handler function that is responsible for supplying execution routines for the foreign-data wrapper. Zero if no handler is provided                                                                                                             |
| `fdwvalidator` `oid` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)References a validator function that is responsible for checking the validity of the options given to the foreign-data wrapper, as well as options for foreign servers and user mappings using the foreign-data wrapper. Zero if no validator is provided |
| `fdwacl` `aclitem[]`Access privileges; see [Section 5.7](ddl-priv.html "5.7. Privileges") for details                                                                                                                                                                                                                                               |
| `fdwoptions` `text[]`Foreign-data wrapper specific options, as “keyword=value” strings                                                                                                                                                                                                                                                              |

***

|                                                          |                                                       |                                                                    |
| :------------------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------------------------: |
| [Prev](catalog-pg-extension.html "53.22. pg_extension")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-foreign-server.html "53.24. pg_foreign_server") |
| 53.22. `pg_extension`                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                                         53.24. `pg_foreign_server` |
