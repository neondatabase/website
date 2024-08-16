[#id](#INFOSCHEMA-DATA-TYPE-PRIVILEGES)

## 37.20. `data_type_privileges` [#](#INFOSCHEMA-DATA-TYPE-PRIVILEGES)

The view `data_type_privileges` identifies all data type descriptors that the current user has access to, by way of being the owner of the described object or having some privilege for it. A data type descriptor is generated whenever a data type is used in the definition of a table column, a domain, or a function (as parameter or return type) and stores some information about how the data type is used in that instance (for example, the declared maximum length, if applicable). Each data type descriptor is assigned an arbitrary identifier that is unique among the data type descriptor identifiers assigned for one object (table, domain, function). This view is probably not useful for applications, but it is used to define some other views in the information schema.

[#id](#id-1.7.6.24.3)

**Table 37.18. `data_type_privileges` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `object_catalog` `sql_identifier`Name of the database that contains the described object (always the current database)                                                                                                                                                                                             |
| `object_schema` `sql_identifier`Name of the schema that contains the described object                                                                                                                                                                                                                              |
| `object_name` `sql_identifier`Name of the described object                                                                                                                                                                                                                                                         |
| `object_type` `character_data`The type of the described object: one of `TABLE` (the data type descriptor pertains to a column of that table), `DOMAIN` (the data type descriptors pertains to that domain), `ROUTINE` (the data type descriptor pertains to a parameter or the return data type of that function). |
| `dtd_identifier` `sql_identifier`The identifier of the data type descriptor, which is unique among the data type descriptors for that same object.                                                                                                                                                                 |
