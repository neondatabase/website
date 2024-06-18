[#id](#INFOSCHEMA-COLUMN-OPTIONS)

## 37.14. `column_options` [#](#INFOSCHEMA-COLUMN-OPTIONS)

The view `column_options` contains all the options defined for foreign table columns in the current database. Only those foreign table columns are shown that the current user has access to (by way of being the owner or having some privilege).

[#id](#id-1.7.6.18.3)

**Table 37.12. `column_options` Columns**

| Column TypeDescription                                                                                             |
| ------------------------------------------------------------------------------------------------------------------ |
| `table_catalog` `sql_identifier`Name of the database that contains the foreign table (always the current database) |
| `table_schema` `sql_identifier`Name of the schema that contains the foreign table                                  |
| `table_name` `sql_identifier`Name of the foreign table                                                             |
| `column_name` `sql_identifier`Name of the column                                                                   |
| `option_name` `sql_identifier`Name of an option                                                                    |
| `option_value` `character_data`Value of the option                                                                 |
