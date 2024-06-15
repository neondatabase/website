[#id](#INFOSCHEMA-ROLE-COLUMN-GRANTS)

## 37.35. `role_column_grants` [#](#INFOSCHEMA-ROLE-COLUMN-GRANTS)

The view `role_column_grants` identifies all privileges granted on columns where the grantor or grantee is a currently enabled role. Further information can be found under `column_privileges`. The only effective difference between this view and `column_privileges` is that this view omits columns that have been made accessible to the current user by way of a grant to `PUBLIC`.

[#id](#id-1.7.6.39.3)

**Table 37.33. `role_column_grants` Columns**

| Column TypeDescription                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------- |
| `grantor` `sql_identifier`Name of the role that granted the privilege                                                               |
| `grantee` `sql_identifier`Name of the role that the privilege was granted to                                                        |
| `table_catalog` `sql_identifier`Name of the database that contains the table that contains the column (always the current database) |
| `table_schema` `sql_identifier`Name of the schema that contains the table that contains the column                                  |
| `table_name` `sql_identifier`Name of the table that contains the column                                                             |
| `column_name` `sql_identifier`Name of the column                                                                                    |
| `privilege_type` `character_data`Type of the privilege: `SELECT`, `INSERT`, `UPDATE`, or `REFERENCES`                               |
| `is_grantable` `yes_or_no``YES` if the privilege is grantable, `NO` if not                                                          |
