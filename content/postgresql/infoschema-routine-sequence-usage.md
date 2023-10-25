<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                        37.43. `routine_sequence_usage`                        |                                                                    |                                    |                                                       |                                                                           |
| :---------------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ------------------------------------------------------------------------: |
| [Prev](infoschema-routine-routine-usage.html "37.42. routine_routine_usage")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-routine-table-usage.html "37.44. routine_table_usage") |

***

## 37.43. `routine_sequence_usage` [#](#INFOSCHEMA-ROUTINE-SEQUENCE-USAGE)

The view `routine_sequence_usage` is meant to identify all sequences that are used by a function or procedure, either in the body or in parameter default expressions. Currently, only sequences used in parameter default expressions are tracked. A sequence is only included if that sequence is owned by a currently enabled role.

**Table 37.41. `routine_sequence_usage` Columns**

| Column TypeDescription                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `specific_catalog` `sql_identifier`Name of the database containing the function (always the current database)                                              |
| `specific_schema` `sql_identifier`Name of the schema containing the function                                                                               |
| `specific_name` `sql_identifier`The “specific name” of the function. See [Section 37.45](infoschema-routines.html "37.45. routines") for more information. |
| `routine_catalog` `sql_identifier`Name of the database containing the function (always the current database)                                               |
| `routine_schema` `sql_identifier`Name of the schema containing the function                                                                                |
| `routine_name` `sql_identifier`Name of the function (might be duplicated in case of overloading)                                                           |
| `schema_catalog` `sql_identifier`Name of the database that contains the sequence that is used by the function (always the current database)                |
| `sequence_schema` `sql_identifier`Name of the schema that contains the sequence that is used by the function                                               |
| `sequence_name` `sql_identifier`Name of the sequence that is used by the function                                                                          |

***

|                                                                               |                                                                    |                                                                           |
| :---------------------------------------------------------------------------- | :----------------------------------------------------------------: | ------------------------------------------------------------------------: |
| [Prev](infoschema-routine-routine-usage.html "37.42. routine_routine_usage")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-routine-table-usage.html "37.44. routine_table_usage") |
| 37.42. `routine_routine_usage`                                                |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                              37.44. `routine_table_usage` |
