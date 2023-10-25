

|                      37.61. `user_mapping_options`                      |                                                                    |                                    |                                                       |                                                               |
| :---------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ------------------------------------------------------------: |
| [Prev](infoschema-user-defined-types.html "37.60. user_defined_types")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-user-mappings.html "37.62. user_mappings") |

***

## 37.61. `user_mapping_options` [#](#INFOSCHEMA-USER-MAPPING-OPTIONS)

The view `user_mapping_options` contains all the options defined for user mappings in the current database. Only those user mappings are shown where the current user has access to the corresponding foreign server (by way of being the owner or having some privilege).

**Table 37.59. `user_mapping_options` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `authorization_identifier` `sql_identifier`Name of the user being mapped, or `PUBLIC` if the mapping is public                                                                                                                                                                                                                |
| `foreign_server_catalog` `sql_identifier`Name of the database that the foreign server used by this mapping is defined in (always the current database)                                                                                                                                                                        |
| `foreign_server_name` `sql_identifier`Name of the foreign server used by this mapping                                                                                                                                                                                                                                         |
| `option_name` `sql_identifier`Name of an option                                                                                                                                                                                                                                                                               |
| `option_value` `character_data`Value of the option. This column will show as null unless the current user is the user being mapped, or the mapping is for `PUBLIC` and the current user is the server owner, or the current user is a superuser. The intent is to protect password information stored as user mapping option. |

***

|                                                                         |                                                                    |                                                               |
| :---------------------------------------------------------------------- | :----------------------------------------------------------------: | ------------------------------------------------------------: |
| [Prev](infoschema-user-defined-types.html "37.60. user_defined_types")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-user-mappings.html "37.62. user_mappings") |
| 37.60. `user_defined_types`                                             |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                        37.62. `user_mappings` |
