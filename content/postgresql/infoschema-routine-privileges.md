

|                         37.41. `routine_privileges`                         |                                                                    |                                    |                                                       |                                                                               |
| :-------------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------------------: |
| [Prev](infoschema-routine-column-usage.html "37.40. routine_column_usage")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-routine-routine-usage.html "37.42. routine_routine_usage") |

***

## 37.41. `routine_privileges` [#](#INFOSCHEMA-ROUTINE-PRIVILEGES)

The view `routine_privileges` identifies all privileges granted on functions to a currently enabled role or by a currently enabled role. There is one row for each combination of function, grantor, and grantee.

**Table 37.39. `routine_privileges` Columns**

| Column TypeDescription                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `grantor` `sql_identifier`Name of the role that granted the privilege                                                                                      |
| `grantee` `sql_identifier`Name of the role that the privilege was granted to                                                                               |
| `specific_catalog` `sql_identifier`Name of the database containing the function (always the current database)                                              |
| `specific_schema` `sql_identifier`Name of the schema containing the function                                                                               |
| `specific_name` `sql_identifier`The “specific name” of the function. See [Section 37.45](infoschema-routines.html "37.45. routines") for more information. |
| `routine_catalog` `sql_identifier`Name of the database containing the function (always the current database)                                               |
| `routine_schema` `sql_identifier`Name of the schema containing the function                                                                                |
| `routine_name` `sql_identifier`Name of the function (might be duplicated in case of overloading)                                                           |
| `privilege_type` `character_data`Always `EXECUTE` (the only privilege type for functions)                                                                  |
| `is_grantable` `yes_or_no``YES` if the privilege is grantable, `NO` if not                                                                                 |

***

|                                                                             |                                                                    |                                                                               |
| :-------------------------------------------------------------------------- | :----------------------------------------------------------------: | ----------------------------------------------------------------------------: |
| [Prev](infoschema-routine-column-usage.html "37.40. routine_column_usage")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-routine-routine-usage.html "37.42. routine_routine_usage") |
| 37.40. `routine_column_usage`                                               |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                                37.42. `routine_routine_usage` |
