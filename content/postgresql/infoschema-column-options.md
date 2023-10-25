

|                          37.14. `column_options`                          |                                                                    |                                    |                                                       |                                                                       |
| :-----------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](infoschema-column-domain-usage.html "37.13. column_domain_usage")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-column-privileges.html "37.15. column_privileges") |

***

## 37.14. `column_options` [#](#INFOSCHEMA-COLUMN-OPTIONS)

The view `column_options` contains all the options defined for foreign table columns in the current database. Only those foreign table columns are shown that the current user has access to (by way of being the owner or having some privilege).

**Table 37.12. `column_options` Columns**

| Column TypeDescription                                                                                             |
| ------------------------------------------------------------------------------------------------------------------ |
| `table_catalog` `sql_identifier`Name of the database that contains the foreign table (always the current database) |
| `table_schema` `sql_identifier`Name of the schema that contains the foreign table                                  |
| `table_name` `sql_identifier`Name of the foreign table                                                             |
| `column_name` `sql_identifier`Name of the column                                                                   |
| `option_name` `sql_identifier`Name of an option                                                                    |
| `option_value` `character_data`Value of the option                                                                 |

***

|                                                                           |                                                                    |                                                                       |
| :------------------------------------------------------------------------ | :----------------------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](infoschema-column-domain-usage.html "37.13. column_domain_usage")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-column-privileges.html "37.15. column_privileges") |
| 37.13. `column_domain_usage`                                              |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                            37.15. `column_privileges` |
