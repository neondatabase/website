

|          37.18. `constraint_column_usage`         |                                                                    |                                    |                                                       |                                                                                 |
| :-----------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ------------------------------------------------------------------------------: |
| [Prev](infoschema-columns.html "37.17. columns")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-constraint-table-usage.html "37.19. constraint_table_usage") |

***

## 37.18. `constraint_column_usage` [#](#INFOSCHEMA-CONSTRAINT-COLUMN-USAGE)

The view `constraint_column_usage` identifies all columns in the current database that are used by some constraint. Only those columns are shown that are contained in a table owned by a currently enabled role. For a check constraint, this view identifies the columns that are used in the check expression. For a not-null constraint, this view identifies the column that the constraint is defined on. For a foreign key constraint, this view identifies the columns that the foreign key references. For a unique or primary key constraint, this view identifies the constrained columns.

**Table 37.16. `constraint_column_usage` Columns**

| Column TypeDescription                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `table_catalog` `sql_identifier`Name of the database that contains the table that contains the column that is used by some constraint (always the current database) |
| `table_schema` `sql_identifier`Name of the schema that contains the table that contains the column that is used by some constraint                                  |
| `table_name` `sql_identifier`Name of the table that contains the column that is used by some constraint                                                             |
| `column_name` `sql_identifier`Name of the column that is used by some constraint                                                                                    |
| `constraint_catalog` `sql_identifier`Name of the database that contains the constraint (always the current database)                                                |
| `constraint_schema` `sql_identifier`Name of the schema that contains the constraint                                                                                 |
| `constraint_name` `sql_identifier`Name of the constraint                                                                                                            |

***

|                                                   |                                                                    |                                                                                 |
| :------------------------------------------------ | :----------------------------------------------------------------: | ------------------------------------------------------------------------------: |
| [Prev](infoschema-columns.html "37.17. columns")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-constraint-table-usage.html "37.19. constraint_table_usage") |
| 37.17. `columns`                                  |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                                 37.19. `constraint_table_usage` |
