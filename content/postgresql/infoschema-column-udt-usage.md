<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                       37.16. `column_udt_usage`                       |                                                                    |                                    |                                                       |                                                   |
| :-------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ------------------------------------------------: |
| [Prev](infoschema-column-privileges.html "37.15. column_privileges")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-columns.html "37.17. columns") |

***

## 37.16. `column_udt_usage` [#](#INFOSCHEMA-COLUMN-UDT-USAGE)

The view `column_udt_usage` identifies all columns that use data types owned by a currently enabled role. Note that in PostgreSQL, built-in data types behave like user-defined types, so they are included here as well. See also [Section 37.17](infoschema-columns.html "37.17. columns") for details.

**Table 37.14. `column_udt_usage` Columns**

| Column TypeDescription                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `udt_catalog` `sql_identifier`Name of the database that the column data type (the underlying type of the domain, if applicable) is defined in (always the current database) |
| `udt_schema` `sql_identifier`Name of the schema that the column data type (the underlying type of the domain, if applicable) is defined in                                  |
| `udt_name` `sql_identifier`Name of the column data type (the underlying type of the domain, if applicable)                                                                  |
| `table_catalog` `sql_identifier`Name of the database containing the table (always the current database)                                                                     |
| `table_schema` `sql_identifier`Name of the schema containing the table                                                                                                      |
| `table_name` `sql_identifier`Name of the table                                                                                                                              |
| `column_name` `sql_identifier`Name of the column                                                                                                                            |

***

|                                                                       |                                                                    |                                                   |
| :-------------------------------------------------------------------- | :----------------------------------------------------------------: | ------------------------------------------------: |
| [Prev](infoschema-column-privileges.html "37.15. column_privileges")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-columns.html "37.17. columns") |
| 37.15. `column_privileges`                                            |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                  37.17. `columns` |
