[#id](#INFOSCHEMA-USER-MAPPINGS)

## 37.62. `user_mappings` [#](#INFOSCHEMA-USER-MAPPINGS)

The view `user_mappings` contains all user mappings defined in the current database. Only those user mappings are shown where the current user has access to the corresponding foreign server (by way of being the owner or having some privilege).

[#id](#id-1.7.6.66.3)

**Table 37.60. `user_mappings` Columns**

| Column TypeDescription                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `authorization_identifier` `sql_identifier`Name of the user being mapped, or `PUBLIC` if the mapping is public                                         |
| `foreign_server_catalog` `sql_identifier`Name of the database that the foreign server used by this mapping is defined in (always the current database) |
| `foreign_server_name` `sql_identifier`Name of the foreign server used by this mapping                                                                  |
