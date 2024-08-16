[#id](#CATALOG-PG-FOREIGN-SERVER)

## 53.24. `pg_foreign_server` [#](#CATALOG-PG-FOREIGN-SERVER)

The catalog `pg_foreign_server` stores foreign server definitions. A foreign server describes a source of external data, such as a remote server. Foreign servers are accessed via foreign-data wrappers.

[#id](#id-1.10.4.26.4)

**Table 53.24. `pg_foreign_server` Columns**

| Column TypeDescription                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                            |
| `srvname` `name`Name of the foreign server                                                                                                           |
| `srvowner` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)Owner of the foreign server                                                      |
| `srvfdw` `oid` (references [`pg_foreign_data_wrapper`](catalog-pg-foreign-data-wrapper).`oid`)OID of the foreign-data wrapper of this foreign server |
| `srvtype` `text`Type of the server (optional)                                                                                                        |
| `srvversion` `text`Version of the server (optional)                                                                                                  |
| `srvacl` `aclitem[]`Access privileges; see [Section 5.7](ddl-priv) for details                                                                       |
| `srvoptions` `text[]`Foreign server specific options, as “keyword=value” strings                                                                     |
