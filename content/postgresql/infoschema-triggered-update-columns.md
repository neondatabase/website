

|            37.56. `triggered_update_columns`            |                                                                    |                                    |                                                       |                                                     |
| :-----------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | --------------------------------------------------: |
| [Prev](infoschema-transforms.html "37.55. transforms")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-triggers.html "37.57. triggers") |

***

## 37.56. `triggered_update_columns` [#](#INFOSCHEMA-TRIGGERED-UPDATE-COLUMNS)

For triggers in the current database that specify a column list (like `UPDATE OF column1, column2`), the view `triggered_update_columns` identifies these columns. Triggers that do not specify a column list are not included in this view. Only those columns are shown that the current user owns or has some privilege other than `SELECT` on.

**Table 37.54. `triggered_update_columns` Columns**

| Column TypeDescription                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `trigger_catalog` `sql_identifier`Name of the database that contains the trigger (always the current database)                                   |
| `trigger_schema` `sql_identifier`Name of the schema that contains the trigger                                                                    |
| `trigger_name` `sql_identifier`Name of the trigger                                                                                               |
| `event_object_catalog` `sql_identifier`Name of the database that contains the table that the trigger is defined on (always the current database) |
| `event_object_schema` `sql_identifier`Name of the schema that contains the table that the trigger is defined on                                  |
| `event_object_table` `sql_identifier`Name of the table that the trigger is defined on                                                            |
| `event_object_column` `sql_identifier`Name of the column that the trigger is defined on                                                          |

***

|                                                         |                                                                    |                                                     |
| :------------------------------------------------------ | :----------------------------------------------------------------: | --------------------------------------------------: |
| [Prev](infoschema-transforms.html "37.55. transforms")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-triggers.html "37.57. triggers") |
| 37.55. `transforms`                                     |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                   37.57. `triggers` |
