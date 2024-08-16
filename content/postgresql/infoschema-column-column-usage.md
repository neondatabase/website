[#id](#INFOSCHEMA-COLUMN-COLUMN-USAGE)

## 37.12. `column_column_usage` [#](#INFOSCHEMA-COLUMN-COLUMN-USAGE)

The view `column_column_usage` identifies all generated columns that depend on another base column in the same table. Only tables owned by a currently enabled role are included.

[#id](#id-1.7.6.16.3)

**Table 37.10. `column_column_usage` Columns**

| Column TypeDescription                                                                                  |
| ------------------------------------------------------------------------------------------------------- |
| `table_catalog` `sql_identifier`Name of the database containing the table (always the current database) |
| `table_schema` `sql_identifier`Name of the schema containing the table                                  |
| `table_name` `sql_identifier`Name of the table                                                          |
| `column_name` `sql_identifier`Name of the base column that a generated column depends on                |
| `dependent_column` `sql_identifier`Name of the generated column                                         |
