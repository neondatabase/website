<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                        37.65. `view_table_usage`                        |                                                                    |                                    |                                                       |                                               |
| :---------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | --------------------------------------------: |
| [Prev](infoschema-view-routine-usage.html "37.64. view_routine_usage")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-views.html "37.66. views") |

***

## 37.65. `view_table_usage` [#](#INFOSCHEMA-VIEW-TABLE-USAGE)

The view `view_table_usage` identifies all tables that are used in the query expression of a view (the `SELECT` statement that defines the view). A table is only included if that table is owned by a currently enabled role.

### Note

System tables are not included. This should be fixed sometime.

**Table 37.63. `view_table_usage` Columns**

| Column TypeDescription                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------- |
| `view_catalog` `sql_identifier`Name of the database that contains the view (always the current database)                            |
| `view_schema` `sql_identifier`Name of the schema that contains the view                                                             |
| `view_name` `sql_identifier`Name of the view                                                                                        |
| `table_catalog` `sql_identifier`Name of the database that contains the table that is used by the view (always the current database) |
| `table_schema` `sql_identifier`Name of the schema that contains the table that is used by the view                                  |
| `table_name` `sql_identifier`Name of the table that is used by the view                                                             |

***

|                                                                         |                                                                    |                                               |
| :---------------------------------------------------------------------- | :----------------------------------------------------------------: | --------------------------------------------: |
| [Prev](infoschema-view-routine-usage.html "37.64. view_routine_usage")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-views.html "37.66. views") |
| 37.64. `view_routine_usage`                                             |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                37.66. `views` |
