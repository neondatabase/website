[#id](#INFOSCHEMA-COLLATIONS)

## 37.10. `collations` [#](#INFOSCHEMA-COLLATIONS)

The view `collations` contains the collations available in the current database.

[#id](#id-1.7.6.14.3)

**Table 37.8. `collations` Columns**

| Column TypeDescription                                                                                          |
| --------------------------------------------------------------------------------------------------------------- |
| `collation_catalog` `sql_identifier`Name of the database containing the collation (always the current database) |
| `collation_schema` `sql_identifier`Name of the schema containing the collation                                  |
| `collation_name` `sql_identifier`Name of the default collation                                                  |
| `pad_attribute` `character_data`Always `NO PAD` (The alternative `PAD SPACE` is not supported by PostgreSQL.)   |
