[#id](#INFOSCHEMA-CONSTRAINT-TABLE-USAGE)

## 37.19. `constraint_table_usage` [#](#INFOSCHEMA-CONSTRAINT-TABLE-USAGE)

The view `constraint_table_usage` identifies all tables in the current database that are used by some constraint and are owned by a currently enabled role. (This is different from the view `table_constraints`, which identifies all table constraints along with the table they are defined on.) For a foreign key constraint, this view identifies the table that the foreign key references. For a unique or primary key constraint, this view simply identifies the table the constraint belongs to. Check constraints and not-null constraints are not included in this view.

[#id](#id-1.7.6.23.3)

**Table 37.17. `constraint_table_usage` Columns**

| Column TypeDescription                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------ |
| `table_catalog` `sql_identifier`Name of the database that contains the table that is used by some constraint (always the current database) |
| `table_schema` `sql_identifier`Name of the schema that contains the table that is used by some constraint                                  |
| `table_name` `sql_identifier`Name of the table that is used by some constraint                                                             |
| `constraint_catalog` `sql_identifier`Name of the database that contains the constraint (always the current database)                       |
| `constraint_schema` `sql_identifier`Name of the schema that contains the constraint                                                        |
| `constraint_name` `sql_identifier`Name of the constraint                                                                                   |
