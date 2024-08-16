[#id](#CATALOG-PG-FOREIGN-DATA-WRAPPER)

## 53.23. `pg_foreign_data_wrapper` [#](#CATALOG-PG-FOREIGN-DATA-WRAPPER)

The catalog `pg_foreign_data_wrapper` stores foreign-data wrapper definitions. A foreign-data wrapper is the mechanism by which external data, residing on foreign servers, is accessed.

[#id](#id-1.10.4.25.4)

**Table 53.23. `pg_foreign_data_wrapper` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                                                                                                                                                                     |
| `fdwname` `name`Name of the foreign-data wrapper                                                                                                                                                                                                                                                                              |
| `fdwowner` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)Owner of the foreign-data wrapper                                                                                                                                                                                                                         |
| `fdwhandler` `oid` (references [`pg_proc`](catalog-pg-proc).`oid`)References a handler function that is responsible for supplying execution routines for the foreign-data wrapper. Zero if no handler is provided                                                                                                             |
| `fdwvalidator` `oid` (references [`pg_proc`](catalog-pg-proc).`oid`)References a validator function that is responsible for checking the validity of the options given to the foreign-data wrapper, as well as options for foreign servers and user mappings using the foreign-data wrapper. Zero if no validator is provided |
| `fdwacl` `aclitem[]`Access privileges; see [Section 5.7](ddl-priv) for details                                                                                                                                                                                                                                                |
| `fdwoptions` `text[]`Foreign-data wrapper specific options, as “keyword=value” strings                                                                                                                                                                                                                                        |
