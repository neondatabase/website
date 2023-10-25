

|                            37.62. `user_mappings`                           |                                                                    |                                    |                                                       |                                                                       |
| :-------------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](infoschema-user-mapping-options.html "37.61. user_mapping_options")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-view-column-usage.html "37.63. view_column_usage") |

***

## 37.62. `user_mappings` [#](#INFOSCHEMA-USER-MAPPINGS)

The view `user_mappings` contains all user mappings defined in the current database. Only those user mappings are shown where the current user has access to the corresponding foreign server (by way of being the owner or having some privilege).

**Table 37.60. `user_mappings` Columns**

| Column TypeDescription                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `authorization_identifier` `sql_identifier`Name of the user being mapped, or `PUBLIC` if the mapping is public                                         |
| `foreign_server_catalog` `sql_identifier`Name of the database that the foreign server used by this mapping is defined in (always the current database) |
| `foreign_server_name` `sql_identifier`Name of the foreign server used by this mapping                                                                  |

***

|                                                                             |                                                                    |                                                                       |
| :-------------------------------------------------------------------------- | :----------------------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](infoschema-user-mapping-options.html "37.61. user_mapping_options")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-view-column-usage.html "37.63. view_column_usage") |
| 37.61. `user_mapping_options`                                               |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                            37.63. `view_column_usage` |
