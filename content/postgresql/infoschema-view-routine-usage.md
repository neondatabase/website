## 37.64. `view_routine_usage` [#](#INFOSCHEMA-VIEW-ROUTINE-USAGE)

The view `view_routine_usage` identifies all routines (functions and procedures) that are used in the query expression of a view (the `SELECT` statement that defines the view). A routine is only included if that routine is owned by a currently enabled role.

**Table 37.62. `view_routine_usage` Columns**

| Column TypeDescription                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `table_catalog` `sql_identifier`Name of the database containing the view (always the current database)                                                     |
| `table_schema` `sql_identifier`Name of the schema containing the view                                                                                      |
| `table_name` `sql_identifier`Name of the view                                                                                                              |
| `specific_catalog` `sql_identifier`Name of the database containing the function (always the current database)                                              |
| `specific_schema` `sql_identifier`Name of the schema containing the function                                                                               |
| `specific_name` `sql_identifier`The “specific name” of the function. See [Section 37.45](infoschema-routines.html "37.45. routines") for more information. |