[#id](#INFOSCHEMA-ROUTINE-ROUTINE-USAGE)

## 37.42. `routine_routine_usage` [#](#INFOSCHEMA-ROUTINE-ROUTINE-USAGE)

The view `routine_routine_usage` is meant to identify all functions or procedures that are used by another (or the same) function or procedure, either in the body or in parameter default expressions. Currently, only functions used in parameter default expressions are tracked. An entry is included here only if the used function is owned by a currently enabled role. (There is no such restriction on the using function.)

Note that the entries for both functions in the view refer to the “specific” name of the routine, even though the column names are used in a way that is inconsistent with other information schema views about routines. This is per SQL standard, although it is arguably a misdesign. See [Section 37.45](infoschema-routines) for more information about specific names.

[#id](#id-1.7.6.46.4)

**Table 37.40. `routine_routine_usage` Columns**

| Column TypeDescription                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `specific_catalog` `sql_identifier`Name of the database containing the using function (always the current database)                                |
| `specific_schema` `sql_identifier`Name of the schema containing the using function                                                                 |
| `specific_name` `sql_identifier`The “specific name” of the using function.                                                                         |
| `routine_catalog` `sql_identifier`Name of the database that contains the function that is used by the first function (always the current database) |
| `routine_schema` `sql_identifier`Name of the schema that contains the function that is used by the first function                                  |
| `routine_name` `sql_identifier`The “specific name” of the function that is used by the first function.                                             |
