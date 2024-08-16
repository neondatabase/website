[#id](#INFOSCHEMA-FOREIGN-SERVERS)

## 37.29. `foreign_servers` [#](#INFOSCHEMA-FOREIGN-SERVERS)

The view `foreign_servers` contains all foreign servers defined in the current database. Only those foreign servers are shown that the current user has access to (by way of being the owner or having some privilege).

[#id](#id-1.7.6.33.3)

**Table 37.27. `foreign_servers` Columns**

| Column TypeDescription                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `foreign_server_catalog` `sql_identifier`Name of the database that the foreign server is defined in (always the current database)                                   |
| `foreign_server_name` `sql_identifier`Name of the foreign server                                                                                                    |
| `foreign_data_wrapper_catalog` `sql_identifier`Name of the database that contains the foreign-data wrapper used by the foreign server (always the current database) |
| `foreign_data_wrapper_name` `sql_identifier`Name of the foreign-data wrapper used by the foreign server                                                             |
| `foreign_server_type` `character_data`Foreign server type information, if specified upon creation                                                                   |
| `foreign_server_version` `character_data`Foreign server version information, if specified upon creation                                                             |
| `authorization_identifier` `sql_identifier`Name of the owner of the foreign server                                                                                  |
