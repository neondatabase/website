[#id](#INFOSCHEMA-ROLE-UDT-GRANTS)

## 37.38. `role_udt_grants` [#](#INFOSCHEMA-ROLE-UDT-GRANTS)

The view `role_udt_grants` is intended to identify `USAGE` privileges granted on user-defined types where the grantor or grantee is a currently enabled role. Further information can be found under `udt_privileges`. The only effective difference between this view and `udt_privileges` is that this view omits objects that have been made accessible to the current user by way of a grant to `PUBLIC`. Since data types do not have real privileges in PostgreSQL, but only an implicit grant to `PUBLIC`, this view is empty.

[#id](#id-1.7.6.42.3)

**Table 37.36. `role_udt_grants` Columns**

| Column TypeDescription                                                                               |
| ---------------------------------------------------------------------------------------------------- |
| `grantor` `sql_identifier`The name of the role that granted the privilege                            |
| `grantee` `sql_identifier`The name of the role that the privilege was granted to                     |
| `udt_catalog` `sql_identifier`Name of the database containing the type (always the current database) |
| `udt_schema` `sql_identifier`Name of the schema containing the type                                  |
| `udt_name` `sql_identifier`Name of the type                                                          |
| `privilege_type` `character_data`Always `TYPE USAGE`                                                 |
| `is_grantable` `yes_or_no``YES` if the privilege is grantable, `NO` if not                           |
