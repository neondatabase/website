[#id](#INFOSCHEMA-SCHEMATA)

## 37.46. `schemata` [#](#INFOSCHEMA-SCHEMATA)

The view `schemata` contains all schemas in the current database that the current user has access to (by way of being the owner or having some privilege).

[#id](#id-1.7.6.50.3)

**Table 37.44. `schemata` Columns**

| Column TypeDescription                                                                                            |
| ----------------------------------------------------------------------------------------------------------------- |
| `catalog_name` `sql_identifier`Name of the database that the schema is contained in (always the current database) |
| `schema_name` `sql_identifier`Name of the schema                                                                  |
| `schema_owner` `sql_identifier`Name of the owner of the schema                                                    |
| `default_character_set_catalog` `sql_identifier`Applies to a feature not available in PostgreSQL                  |
| `default_character_set_schema` `sql_identifier`Applies to a feature not available in PostgreSQL                   |
| `default_character_set_name` `sql_identifier`Applies to a feature not available in PostgreSQL                     |
| `sql_path` `character_data`Applies to a feature not available in PostgreSQL                                       |
