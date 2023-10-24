<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                        37.28. `foreign_server_options`                        |                                                                    |                                    |                                                       |                                                                   |
| :---------------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------: |
| [Prev](infoschema-foreign-data-wrappers.html "37.27. foreign_data_wrappers")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-foreign-servers.html "37.29. foreign_servers") |

***

## 37.28. `foreign_server_options` [#](#INFOSCHEMA-FOREIGN-SERVER-OPTIONS)

The view `foreign_server_options` contains all the options defined for foreign servers in the current database. Only those foreign servers are shown that the current user has access to (by way of being the owner or having some privilege).

**Table 37.26. `foreign_server_options` Columns**

| Column TypeDescription                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------- |
| `foreign_server_catalog` `sql_identifier`Name of the database that the foreign server is defined in (always the current database) |
| `foreign_server_name` `sql_identifier`Name of the foreign server                                                                  |
| `option_name` `sql_identifier`Name of an option                                                                                   |
| `option_value` `character_data`Value of the option                                                                                |

***

|                                                                               |                                                                    |                                                                   |
| :---------------------------------------------------------------------------- | :----------------------------------------------------------------: | ----------------------------------------------------------------: |
| [Prev](infoschema-foreign-data-wrappers.html "37.27. foreign_data_wrappers")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-foreign-servers.html "37.29. foreign_servers") |
| 37.27. `foreign_data_wrappers`                                                |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                          37.29. `foreign_servers` |
