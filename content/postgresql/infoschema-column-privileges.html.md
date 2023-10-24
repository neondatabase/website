<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                    37.15. `column_privileges`                   |                                                                    |                                    |                                                       |                                                                     |
| :-------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](infoschema-column-options.html "37.14. column_options")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-column-udt-usage.html "37.16. column_udt_usage") |

***

## 37.15. `column_privileges` [#](#INFOSCHEMA-COLUMN-PRIVILEGES)

The view `column_privileges` identifies all privileges granted on columns to a currently enabled role or by a currently enabled role. There is one row for each combination of column, grantor, and grantee.

If a privilege has been granted on an entire table, it will show up in this view as a grant for each column, but only for the privilege types where column granularity is possible: `SELECT`, `INSERT`, `UPDATE`, `REFERENCES`.

**Table 37.13. `column_privileges` Columns**

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

***

|                                                                 |                                                                    |                                                                     |
| :-------------------------------------------------------------- | :----------------------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](infoschema-column-options.html "37.14. column_options")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-column-udt-usage.html "37.16. column_udt_usage") |
| 37.14. `column_options`                                         |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                           37.16. `column_udt_usage` |
