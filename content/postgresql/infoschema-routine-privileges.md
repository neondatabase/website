[#id](#INFOSCHEMA-ROUTINE-PRIVILEGES)

## 37.41. `routine_privileges` [#](#INFOSCHEMA-ROUTINE-PRIVILEGES)

The view `routine_privileges` identifies all privileges granted on functions to a currently enabled role or by a currently enabled role. There is one row for each combination of function, grantor, and grantee.

[#id](#id-1.7.6.45.3)

**Table 37.39. `routine_privileges` Columns**

| Column TypeDescription                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------- |
| `grantor` `sql_identifier`Name of the role that granted the privilege                                                               |
| `grantee` `sql_identifier`Name of the role that the privilege was granted to                                                        |
| `specific_catalog` `sql_identifier`Name of the database containing the function (always the current database)                       |
| `specific_schema` `sql_identifier`Name of the schema containing the function                                                        |
| `specific_name` `sql_identifier`The “specific name” of the function. See [Section 37.45](infoschema-routines) for more information. |
| `routine_catalog` `sql_identifier`Name of the database containing the function (always the current database)                        |
| `routine_schema` `sql_identifier`Name of the schema containing the function                                                         |
| `routine_name` `sql_identifier`Name of the function (might be duplicated in case of overloading)                                    |
| `privilege_type` `character_data`Always `EXECUTE` (the only privilege type for functions)                                           |
| `is_grantable` `yes_or_no``YES` if the privilege is grantable, `NO` if not                                                          |
