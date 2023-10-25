

|                            37.31. `foreign_tables`                            |                                                                    |                                    |                                                       |                                                                     |
| :---------------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](infoschema-foreign-table-options.html "37.30. foreign_table_options")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-key-column-usage.html "37.32. key_column_usage") |

***

## 37.31. `foreign_tables` [#](#INFOSCHEMA-FOREIGN-TABLES)

The view `foreign_tables` contains all foreign tables defined in the current database. Only those foreign tables are shown that the current user has access to (by way of being the owner or having some privilege).

**Table 37.29. `foreign_tables` Columns**

| Column TypeDescription                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------- |
| `foreign_table_catalog` `sql_identifier`Name of the database that the foreign table is defined in (always the current database)   |
| `foreign_table_schema` `sql_identifier`Name of the schema that contains the foreign table                                         |
| `foreign_table_name` `sql_identifier`Name of the foreign table                                                                    |
| `foreign_server_catalog` `sql_identifier`Name of the database that the foreign server is defined in (always the current database) |
| `foreign_server_name` `sql_identifier`Name of the foreign server                                                                  |

***

|                                                                               |                                                                    |                                                                     |
| :---------------------------------------------------------------------------- | :----------------------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](infoschema-foreign-table-options.html "37.30. foreign_table_options")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-key-column-usage.html "37.32. key_column_usage") |
| 37.30. `foreign_table_options`                                                |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                           37.32. `key_column_usage` |
