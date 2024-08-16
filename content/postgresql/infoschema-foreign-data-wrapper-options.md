[#id](#INFOSCHEMA-FOREIGN-DATA-WRAPPER-OPTIONS)

## 37.26. `foreign_data_wrapper_options` [#](#INFOSCHEMA-FOREIGN-DATA-WRAPPER-OPTIONS)

The view `foreign_data_wrapper_options` contains all the options defined for foreign-data wrappers in the current database. Only those foreign-data wrappers are shown that the current user has access to (by way of being the owner or having some privilege).

[#id](#id-1.7.6.30.3)

**Table 37.24. `foreign_data_wrapper_options` Columns**

| Column TypeDescription                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------- |
| `foreign_data_wrapper_catalog` `sql_identifier`Name of the database that the foreign-data wrapper is defined in (always the current database) |
| `foreign_data_wrapper_name` `sql_identifier`Name of the foreign-data wrapper                                                                  |
| `option_name` `sql_identifier`Name of an option                                                                                               |
| `option_value` `character_data`Value of the option                                                                                            |
