[#id](#INFOSCHEMA-TABLES)

## 37.54. `tables` [#](#INFOSCHEMA-TABLES)

The view `tables` contains all tables and views defined in the current database. Only those tables and views are shown that the current user has access to (by way of being the owner or having some privilege).

[#id](#id-1.7.6.58.3)

**Table 37.52. `tables` Columns**

| Column TypeDescription                                                                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `table_catalog` `sql_identifier`Name of the database that contains the table (always the current database)                                                                                                     |
| `table_schema` `sql_identifier`Name of the schema that contains the table                                                                                                                                      |
| `table_name` `sql_identifier`Name of the table                                                                                                                                                                 |
| `table_type` `character_data`Type of the table: `BASE TABLE` for a persistent base table (the normal table type), `VIEW` for a view, `FOREIGN` for a foreign table, or `LOCAL TEMPORARY` for a temporary table |
| `self_referencing_column_name` `sql_identifier`Applies to a feature not available in PostgreSQL                                                                                                                |
| `reference_generation` `character_data`Applies to a feature not available in PostgreSQL                                                                                                                        |
| `user_defined_type_catalog` `sql_identifier`If the table is a typed table, the name of the database that contains the underlying data type (always the current database), else null.                           |
| `user_defined_type_schema` `sql_identifier`If the table is a typed table, the name of the schema that contains the underlying data type, else null.                                                            |
| `user_defined_type_name` `sql_identifier`If the table is a typed table, the name of the underlying data type, else null.                                                                                       |
| `is_insertable_into` `yes_or_no``YES` if the table is insertable into, `NO` if not (Base tables are always insertable into, views not necessarily.)                                                            |
| `is_typed` `yes_or_no``YES` if the table is a typed table, `NO` if not                                                                                                                                         |
| `commit_action` `character_data`Not yet implemented                                                                                                                                                            |
