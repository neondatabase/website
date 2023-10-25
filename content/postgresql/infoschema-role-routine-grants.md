<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                       37.36. `role_routine_grants`                      |                                                                    |                                    |                                                       |                                                                       |
| :---------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](infoschema-role-column-grants.html "37.35. role_column_grants")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-role-table-grants.html "37.37. role_table_grants") |

***

## 37.36. `role_routine_grants` [#](#INFOSCHEMA-ROLE-ROUTINE-GRANTS)

The view `role_routine_grants` identifies all privileges granted on functions where the grantor or grantee is a currently enabled role. Further information can be found under `routine_privileges`. The only effective difference between this view and `routine_privileges` is that this view omits functions that have been made accessible to the current user by way of a grant to `PUBLIC`.

**Table 37.34. `role_routine_grants` Columns**

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

|                                                                         |                                                                    |                                                                       |
| :---------------------------------------------------------------------- | :----------------------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](infoschema-role-column-grants.html "37.35. role_column_grants")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-role-table-grants.html "37.37. role_table_grants") |
| 37.35. `role_column_grants`                                             |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                            37.37. `role_table_grants` |
