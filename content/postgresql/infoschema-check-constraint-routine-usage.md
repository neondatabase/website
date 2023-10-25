<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|             37.8. `check_constraint_routine_usage`             |                                                                    |                                    |                                                       |                                                                      |
| :------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | -------------------------------------------------------------------: |
| [Prev](infoschema-character-sets.html "37.7. character_sets")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-check-constraints.html "37.9. check_constraints") |

***

## 37.8. `check_constraint_routine_usage` [#](#INFOSCHEMA-CHECK-CONSTRAINT-ROUTINE-USAGE)

The view `check_constraint_routine_usage` identifies routines (functions and procedures) that are used by a check constraint. Only those routines are shown that are owned by a currently enabled role.

**Table 37.6. `check_constraint_routine_usage` Columns**

| Column TypeDescription                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `constraint_catalog` `sql_identifier`Name of the database containing the constraint (always the current database)                                          |
| `constraint_schema` `sql_identifier`Name of the schema containing the constraint                                                                           |
| `constraint_name` `sql_identifier`Name of the constraint                                                                                                   |
| `specific_catalog` `sql_identifier`Name of the database containing the function (always the current database)                                              |
| `specific_schema` `sql_identifier`Name of the schema containing the function                                                                               |
| `specific_name` `sql_identifier`The “specific name” of the function. See [Section 37.45](infoschema-routines.html "37.45. routines") for more information. |

***

|                                                                |                                                                    |                                                                      |
| :------------------------------------------------------------- | :----------------------------------------------------------------: | -------------------------------------------------------------------: |
| [Prev](infoschema-character-sets.html "37.7. character_sets")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-check-constraints.html "37.9. check_constraints") |
| 37.7. `character_sets`                                         |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                            37.9. `check_constraints` |
