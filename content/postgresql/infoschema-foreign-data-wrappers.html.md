<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                                37.27. `foreign_data_wrappers`                               |                                                                    |                                    |                                                       |                                                                                 |
| :-----------------------------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ------------------------------------------------------------------------------: |
| [Prev](infoschema-foreign-data-wrapper-options.html "37.26. foreign_data_wrapper_options")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-foreign-server-options.html "37.28. foreign_server_options") |

***

## 37.27. `foreign_data_wrappers` [#](#INFOSCHEMA-FOREIGN-DATA-WRAPPERS)

The view `foreign_data_wrappers` contains all foreign-data wrappers defined in the current database. Only those foreign-data wrappers are shown that the current user has access to (by way of being the owner or having some privilege).

**Table 37.25. `foreign_data_wrappers` Columns**

| Column TypeDescription                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------- |
| `foreign_data_wrapper_catalog` `sql_identifier`Name of the database that contains the foreign-data wrapper (always the current database) |
| `foreign_data_wrapper_name` `sql_identifier`Name of the foreign-data wrapper                                                             |
| `authorization_identifier` `sql_identifier`Name of the owner of the foreign server                                                       |
| `library_name` `character_data`File name of the library that implementing this foreign-data wrapper                                      |
| `foreign_data_wrapper_language` `character_data`Language used to implement this foreign-data wrapper                                     |

***

|                                                                                             |                                                                    |                                                                                 |
| :------------------------------------------------------------------------------------------ | :----------------------------------------------------------------: | ------------------------------------------------------------------------------: |
| [Prev](infoschema-foreign-data-wrapper-options.html "37.26. foreign_data_wrapper_options")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-foreign-server-options.html "37.28. foreign_server_options") |
| 37.26. `foreign_data_wrapper_options`                                                       |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                                 37.28. `foreign_server_options` |
