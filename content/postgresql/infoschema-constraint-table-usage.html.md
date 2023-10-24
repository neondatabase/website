<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                          37.19. `constraint_table_usage`                          |                                                                    |                                    |                                                       |                                                                             |
| :-------------------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------------------: |
| [Prev](infoschema-constraint-column-usage.html "37.18. constraint_column_usage")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-data-type-privileges.html "37.20. data_type_privileges") |

***

## 37.19. `constraint_table_usage` [#](#INFOSCHEMA-CONSTRAINT-TABLE-USAGE)

The view `constraint_table_usage` identifies all tables in the current database that are used by some constraint and are owned by a currently enabled role. (This is different from the view `table_constraints`, which identifies all table constraints along with the table they are defined on.) For a foreign key constraint, this view identifies the table that the foreign key references. For a unique or primary key constraint, this view simply identifies the table the constraint belongs to. Check constraints and not-null constraints are not included in this view.

**Table 37.17. `constraint_table_usage` Columns**

| Column TypeDescription                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------ |
| `table_catalog` `sql_identifier`Name of the database that contains the table that is used by some constraint (always the current database) |
| `table_schema` `sql_identifier`Name of the schema that contains the table that is used by some constraint                                  |
| `table_name` `sql_identifier`Name of the table that is used by some constraint                                                             |
| `constraint_catalog` `sql_identifier`Name of the database that contains the constraint (always the current database)                       |
| `constraint_schema` `sql_identifier`Name of the schema that contains the constraint                                                        |
| `constraint_name` `sql_identifier`Name of the constraint                                                                                   |

***

|                                                                                   |                                                                    |                                                                             |
| :-------------------------------------------------------------------------------- | :----------------------------------------------------------------: | --------------------------------------------------------------------------: |
| [Prev](infoschema-constraint-column-usage.html "37.18. constraint_column_usage")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-data-type-privileges.html "37.20. data_type_privileges") |
| 37.18. `constraint_column_usage`                                                  |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                               37.20. `data_type_privileges` |
