

|                    37.32. `key_column_usage`                    |                                                                    |                                    |                                                       |                                                         |
| :-------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ------------------------------------------------------: |
| [Prev](infoschema-foreign-tables.html "37.31. foreign_tables")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-parameters.html "37.33. parameters") |

***

## 37.32. `key_column_usage` [#](#INFOSCHEMA-KEY-COLUMN-USAGE)

The view `key_column_usage` identifies all columns in the current database that are restricted by some unique, primary key, or foreign key constraint. Check constraints are not included in this view. Only those columns are shown that the current user has access to, by way of being the owner or having some privilege.

**Table 37.30. `key_column_usage` Columns**

| Column TypeDescription                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `constraint_catalog` `sql_identifier`Name of the database that contains the constraint (always the current database)                                                                      |
| `constraint_schema` `sql_identifier`Name of the schema that contains the constraint                                                                                                       |
| `constraint_name` `sql_identifier`Name of the constraint                                                                                                                                  |
| `table_catalog` `sql_identifier`Name of the database that contains the table that contains the column that is restricted by this constraint (always the current database)                 |
| `table_schema` `sql_identifier`Name of the schema that contains the table that contains the column that is restricted by this constraint                                                  |
| `table_name` `sql_identifier`Name of the table that contains the column that is restricted by this constraint                                                                             |
| `column_name` `sql_identifier`Name of the column that is restricted by this constraint                                                                                                    |
| `ordinal_position` `cardinal_number`Ordinal position of the column within the constraint key (count starts at 1)                                                                          |
| `position_in_unique_constraint` `cardinal_number`For a foreign-key constraint, ordinal position of the referenced column within its unique constraint (count starts at 1); otherwise null |

***

|                                                                 |                                                                    |                                                         |
| :-------------------------------------------------------------- | :----------------------------------------------------------------: | ------------------------------------------------------: |
| [Prev](infoschema-foreign-tables.html "37.31. foreign_tables")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-parameters.html "37.33. parameters") |
| 37.31. `foreign_tables`                                         |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                     37.33. `parameters` |
