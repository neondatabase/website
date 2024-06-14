[#id](#INFOSCHEMA-TRANSFORMS)

## 37.55. `transforms` [#](#INFOSCHEMA-TRANSFORMS)

The view `transforms` contains information about the transforms defined in the current database. More precisely, it contains a row for each function contained in a transform (the “from SQL” or “to SQL” function).

[#id](#id-1.7.6.59.3)

**Table 37.53. `transforms` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `udt_catalog` `sql_identifier`Name of the database that contains the type the transform is for (always the current database)                                                                                                                                                       |
| `udt_schema` `sql_identifier`Name of the schema that contains the type the transform is for                                                                                                                                                                                        |
| `udt_name` `sql_identifier`Name of the type the transform is for                                                                                                                                                                                                                   |
| `specific_catalog` `sql_identifier`Name of the database containing the function (always the current database)                                                                                                                                                                      |
| `specific_schema` `sql_identifier`Name of the schema containing the function                                                                                                                                                                                                       |
| `specific_name` `sql_identifier`The “specific name” of the function. See [Section 37.45](infoschema-routines) for more information.                                                                                                                                                |
| `group_name` `sql_identifier`The SQL standard allows defining transforms in “groups”, and selecting a group at run time. PostgreSQL does not support this. Instead, transforms are specific to a language. As a compromise, this field contains the language the transform is for. |
| `transform_type` `character_data``FROM SQL` or `TO SQL`                                                                                                                                                                                                                            |
