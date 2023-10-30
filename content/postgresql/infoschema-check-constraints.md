## 37.9. `check_constraints` [#](#INFOSCHEMA-CHECK-CONSTRAINTS)

The view `check_constraints` contains all check constraints, either defined on a table or on a domain, that are owned by a currently enabled role. (The owner of the table or domain is the owner of the constraint.)

The SQL standard considers not-null constraints to be check constraints with a `CHECK (column_name IS NOT NULL)` expression. So not-null constraints are also included here and don't have a separate view.

**Table 37.7. `check_constraints` Columns**

| Column TypeDescription                                                                                            |
| ----------------------------------------------------------------------------------------------------------------- |
| `constraint_catalog` `sql_identifier`Name of the database containing the constraint (always the current database) |
| `constraint_schema` `sql_identifier`Name of the schema containing the constraint                                  |
| `constraint_name` `sql_identifier`Name of the constraint                                                          |
| `check_clause` `character_data`The check expression of the check constraint                                       |