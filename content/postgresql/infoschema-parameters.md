[#id](#INFOSCHEMA-PARAMETERS)

## 37.33. `parameters` [#](#INFOSCHEMA-PARAMETERS)

The view `parameters` contains information about the parameters (arguments) of all functions in the current database. Only those functions are shown that the current user has access to (by way of being the owner or having some privilege).

[#id](#id-1.7.6.37.3)

**Table 37.31. `parameters` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `specific_catalog` `sql_identifier`Name of the database containing the function (always the current database)                                                                                                                                                                                                                                                |
| `specific_schema` `sql_identifier`Name of the schema containing the function                                                                                                                                                                                                                                                                                 |
| `specific_name` `sql_identifier`The “specific name” of the function. See [Section 37.45](infoschema-routines) for more information.                                                                                                                                                                                                                          |
| `ordinal_position` `cardinal_number`Ordinal position of the parameter in the argument list of the function (count starts at 1)                                                                                                                                                                                                                               |
| `parameter_mode` `character_data``IN` for input parameter, `OUT` for output parameter, and `INOUT` for input/output parameter.                                                                                                                                                                                                                               |
| `is_result` `yes_or_no`Applies to a feature not available in PostgreSQL                                                                                                                                                                                                                                                                                      |
| `as_locator` `yes_or_no`Applies to a feature not available in PostgreSQL                                                                                                                                                                                                                                                                                     |
| `parameter_name` `sql_identifier`Name of the parameter, or null if the parameter has no name                                                                                                                                                                                                                                                                 |
| `data_type` `character_data`Data type of the parameter, if it is a built-in type, or `ARRAY` if it is some array (in that case, see the view `element_types`), else `USER-DEFINED` (in that case, the type is identified in `udt_name` and associated columns).                                                                                              |
| `character_maximum_length` `cardinal_number`Always null, since this information is not applied to parameter data types in PostgreSQL                                                                                                                                                                                                                         |
| `character_octet_length` `cardinal_number`Always null, since this information is not applied to parameter data types in PostgreSQL                                                                                                                                                                                                                           |
| `character_set_catalog` `sql_identifier`Applies to a feature not available in PostgreSQL                                                                                                                                                                                                                                                                     |
| `character_set_schema` `sql_identifier`Applies to a feature not available in PostgreSQL                                                                                                                                                                                                                                                                      |
| `character_set_name` `sql_identifier`Applies to a feature not available in PostgreSQL                                                                                                                                                                                                                                                                        |
| `collation_catalog` `sql_identifier`Always null, since this information is not applied to parameter data types in PostgreSQL                                                                                                                                                                                                                                 |
| `collation_schema` `sql_identifier`Always null, since this information is not applied to parameter data types in PostgreSQL                                                                                                                                                                                                                                  |
| `collation_name` `sql_identifier`Always null, since this information is not applied to parameter data types in PostgreSQL                                                                                                                                                                                                                                    |
| `numeric_precision` `cardinal_number`Always null, since this information is not applied to parameter data types in PostgreSQL                                                                                                                                                                                                                                |
| `numeric_precision_radix` `cardinal_number`Always null, since this information is not applied to parameter data types in PostgreSQL                                                                                                                                                                                                                          |
| `numeric_scale` `cardinal_number`Always null, since this information is not applied to parameter data types in PostgreSQL                                                                                                                                                                                                                                    |
| `datetime_precision` `cardinal_number`Always null, since this information is not applied to parameter data types in PostgreSQL                                                                                                                                                                                                                               |
| `interval_type` `character_data`Always null, since this information is not applied to parameter data types in PostgreSQL                                                                                                                                                                                                                                     |
| `interval_precision` `cardinal_number`Always null, since this information is not applied to parameter data types in PostgreSQL                                                                                                                                                                                                                               |
| `udt_catalog` `sql_identifier`Name of the database that the data type of the parameter is defined in (always the current database)                                                                                                                                                                                                                           |
| `udt_schema` `sql_identifier`Name of the schema that the data type of the parameter is defined in                                                                                                                                                                                                                                                            |
| `udt_name` `sql_identifier`Name of the data type of the parameter                                                                                                                                                                                                                                                                                            |
| `scope_catalog` `sql_identifier`Applies to a feature not available in PostgreSQL                                                                                                                                                                                                                                                                             |
| `scope_schema` `sql_identifier`Applies to a feature not available in PostgreSQL                                                                                                                                                                                                                                                                              |
| `scope_name` `sql_identifier`Applies to a feature not available in PostgreSQL                                                                                                                                                                                                                                                                                |
| `maximum_cardinality` `cardinal_number`Always null, because arrays always have unlimited maximum cardinality in PostgreSQL                                                                                                                                                                                                                                   |
| `dtd_identifier` `sql_identifier`An identifier of the data type descriptor of the parameter, unique among the data type descriptors pertaining to the function. This is mainly useful for joining with other instances of such identifiers. (The specific format of the identifier is not defined and not guaranteed to remain the same in future versions.) |
| `parameter_default` `character_data`The default expression of the parameter, or null if none or if the function is not owned by a currently enabled role.                                                                                                                                                                                                    |