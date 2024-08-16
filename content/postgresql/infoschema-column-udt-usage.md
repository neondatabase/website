[#id](#INFOSCHEMA-COLUMN-UDT-USAGE)

## 37.16. `column_udt_usage` [#](#INFOSCHEMA-COLUMN-UDT-USAGE)

The view `column_udt_usage` identifies all columns that use data types owned by a currently enabled role. Note that in PostgreSQL, built-in data types behave like user-defined types, so they are included here as well. See also [Section 37.17](infoschema-columns) for details.

[#id](#id-1.7.6.20.3)

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
