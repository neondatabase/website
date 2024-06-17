[#id](#INFOSCHEMA-CHECK-CONSTRAINT-ROUTINE-USAGE)

## 37.8. `check_constraint_routine_usage` [#](#INFOSCHEMA-CHECK-CONSTRAINT-ROUTINE-USAGE)

The view `check_constraint_routine_usage` identifies routines (functions and procedures) that are used by a check constraint. Only those routines are shown that are owned by a currently enabled role.

[#id](#id-1.7.6.12.3)

**Table 37.6. `check_constraint_routine_usage` Columns**

| Column TypeDescription                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------- |
| `constraint_catalog` `sql_identifier`Name of the database containing the constraint (always the current database)                   |
| `constraint_schema` `sql_identifier`Name of the schema containing the constraint                                                    |
| `constraint_name` `sql_identifier`Name of the constraint                                                                            |
| `specific_catalog` `sql_identifier`Name of the database containing the function (always the current database)                       |
| `specific_schema` `sql_identifier`Name of the schema containing the function                                                        |
| `specific_name` `sql_identifier`The “specific name” of the function. See [Section 37.45](infoschema-routines) for more information. |
