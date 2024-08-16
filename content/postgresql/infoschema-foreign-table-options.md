[#id](#INFOSCHEMA-FOREIGN-TABLE-OPTIONS)

## 37.30. `foreign_table_options` [#](#INFOSCHEMA-FOREIGN-TABLE-OPTIONS)

The view `foreign_table_options` contains all the options defined for foreign tables in the current database. Only those foreign tables are shown that the current user has access to (by way of being the owner or having some privilege).

[#id](#id-1.7.6.34.3)

**Table 37.28. `foreign_table_options` Columns**

| Column TypeDescription                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------- |
| `foreign_table_catalog` `sql_identifier`Name of the database that contains the foreign table (always the current database) |
| `foreign_table_schema` `sql_identifier`Name of the schema that contains the foreign table                                  |
| `foreign_table_name` `sql_identifier`Name of the foreign table                                                             |
| `option_name` `sql_identifier`Name of an option                                                                            |
| `option_value` `character_data`Value of the option                                                                         |
