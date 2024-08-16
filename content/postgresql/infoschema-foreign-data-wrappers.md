[#id](#INFOSCHEMA-FOREIGN-DATA-WRAPPERS)

## 37.27. `foreign_data_wrappers` [#](#INFOSCHEMA-FOREIGN-DATA-WRAPPERS)

The view `foreign_data_wrappers` contains all foreign-data wrappers defined in the current database. Only those foreign-data wrappers are shown that the current user has access to (by way of being the owner or having some privilege).

[#id](#id-1.7.6.31.3)

**Table 37.25. `foreign_data_wrappers` Columns**

| Column TypeDescription                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------- |
| `foreign_data_wrapper_catalog` `sql_identifier`Name of the database that contains the foreign-data wrapper (always the current database) |
| `foreign_data_wrapper_name` `sql_identifier`Name of the foreign-data wrapper                                                             |
| `authorization_identifier` `sql_identifier`Name of the owner of the foreign server                                                       |
| `library_name` `character_data`File name of the library that implementing this foreign-data wrapper                                      |
| `foreign_data_wrapper_language` `character_data`Language used to implement this foreign-data wrapper                                     |
