

|                        37.13. `column_domain_usage`                       |                                                                    |                                    |                                                       |                                                                 |
| :-----------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](infoschema-column-column-usage.html "37.12. column_column_usage")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-column-options.html "37.14. column_options") |

***

## 37.13. `column_domain_usage` [#](#INFOSCHEMA-COLUMN-DOMAIN-USAGE)

The view `column_domain_usage` identifies all columns (of a table or a view) that make use of some domain defined in the current database and owned by a currently enabled role.

**Table 37.11. `column_domain_usage` Columns**

| Column TypeDescription                                                                                    |
| --------------------------------------------------------------------------------------------------------- |
| `domain_catalog` `sql_identifier`Name of the database containing the domain (always the current database) |
| `domain_schema` `sql_identifier`Name of the schema containing the domain                                  |
| `domain_name` `sql_identifier`Name of the domain                                                          |
| `table_catalog` `sql_identifier`Name of the database containing the table (always the current database)   |
| `table_schema` `sql_identifier`Name of the schema containing the table                                    |
| `table_name` `sql_identifier`Name of the table                                                            |
| `column_name` `sql_identifier`Name of the column                                                          |

***

|                                                                           |                                                                    |                                                                 |
| :------------------------------------------------------------------------ | :----------------------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](infoschema-column-column-usage.html "37.12. column_column_usage")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-column-options.html "37.14. column_options") |
| 37.12. `column_column_usage`                                              |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                         37.14. `column_options` |
