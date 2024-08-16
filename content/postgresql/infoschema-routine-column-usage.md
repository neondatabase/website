[#id](#INFOSCHEMA-ROUTINE-COLUMN-USAGE)

## 37.40. `routine_column_usage` [#](#INFOSCHEMA-ROUTINE-COLUMN-USAGE)

The view `routine_column_usage` is meant to identify all columns that are used by a function or procedure. This information is currently not tracked by PostgreSQL.

[#id](#id-1.7.6.44.3)

**Table 37.38. `routine_column_usage` Columns**

| Column TypeDescription                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------- |
| `specific_catalog` `sql_identifier`Name of the database containing the function (always the current database)                           |
| `specific_schema` `sql_identifier`Name of the schema containing the function                                                            |
| `specific_name` `sql_identifier`The “specific name” of the function. See [Section 37.45](infoschema-routines) for more information.     |
| `routine_catalog` `sql_identifier`Name of the database containing the function (always the current database)                            |
| `routine_schema` `sql_identifier`Name of the schema containing the function                                                             |
| `routine_name` `sql_identifier`Name of the function (might be duplicated in case of overloading)                                        |
| `table_catalog` `sql_identifier`Name of the database that contains the table that is used by the function (always the current database) |
| `table_schema` `sql_identifier`Name of the schema that contains the table that is used by the function                                  |
| `table_name` `sql_identifier`Name of the table that is used by the function                                                             |
| `column_name` `sql_identifier`Name of the column that is used by the function                                                           |
