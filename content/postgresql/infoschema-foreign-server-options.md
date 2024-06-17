[#id](#INFOSCHEMA-FOREIGN-SERVER-OPTIONS)

## 37.28. `foreign_server_options` [#](#INFOSCHEMA-FOREIGN-SERVER-OPTIONS)

The view `foreign_server_options` contains all the options defined for foreign servers in the current database. Only those foreign servers are shown that the current user has access to (by way of being the owner or having some privilege).

[#id](#id-1.7.6.32.3)

**Table 37.26. `foreign_server_options` Columns**

| Column TypeDescription                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------- |
| `foreign_server_catalog` `sql_identifier`Name of the database that the foreign server is defined in (always the current database) |
| `foreign_server_name` `sql_identifier`Name of the foreign server                                                                  |
| `option_name` `sql_identifier`Name of an option                                                                                   |
| `option_value` `character_data`Value of the option                                                                                |
