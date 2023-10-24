<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                   37.30. `foreign_table_options`                  |                                                                    |                                    |                                                       |                                                                 |
| :---------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](infoschema-foreign-servers.html "37.29. foreign_servers")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-foreign-tables.html "37.31. foreign_tables") |

***

## 37.30. `foreign_table_options` [#](#INFOSCHEMA-FOREIGN-TABLE-OPTIONS)

The view `foreign_table_options` contains all the options defined for foreign tables in the current database. Only those foreign tables are shown that the current user has access to (by way of being the owner or having some privilege).

**Table 37.28. `foreign_table_options` Columns**

| Column TypeDescription                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------- |
| `foreign_table_catalog` `sql_identifier`Name of the database that contains the foreign table (always the current database) |
| `foreign_table_schema` `sql_identifier`Name of the schema that contains the foreign table                                  |
| `foreign_table_name` `sql_identifier`Name of the foreign table                                                             |
| `option_name` `sql_identifier`Name of an option                                                                            |
| `option_value` `character_data`Value of the option                                                                         |

***

|                                                                   |                                                                    |                                                                 |
| :---------------------------------------------------------------- | :----------------------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](infoschema-foreign-servers.html "37.29. foreign_servers")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-foreign-tables.html "37.31. foreign_tables") |
| 37.29. `foreign_servers`                                          |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                         37.31. `foreign_tables` |
