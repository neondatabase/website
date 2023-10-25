

|                                        37.12. `column_column_usage`                                       |                                                                    |                                    |                                                       |                                                                           |
| :-------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ------------------------------------------------------------------------: |
| [Prev](infoschema-collation-character-set-applicab.html "37.11. collation_character_set_​applicability")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-column-domain-usage.html "37.13. column_domain_usage") |

***

## 37.12. `column_column_usage` [#](#INFOSCHEMA-COLUMN-COLUMN-USAGE)

The view `column_column_usage` identifies all generated columns that depend on another base column in the same table. Only tables owned by a currently enabled role are included.

**Table 37.10. `column_column_usage` Columns**

| Column TypeDescription                                                                                  |
| ------------------------------------------------------------------------------------------------------- |
| `table_catalog` `sql_identifier`Name of the database containing the table (always the current database) |
| `table_schema` `sql_identifier`Name of the schema containing the table                                  |
| `table_name` `sql_identifier`Name of the table                                                          |
| `column_name` `sql_identifier`Name of the base column that a generated column depends on                |
| `dependent_column` `sql_identifier`Name of the generated column                                         |

***

|                                                                                                           |                                                                    |                                                                           |
| :-------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------: | ------------------------------------------------------------------------: |
| [Prev](infoschema-collation-character-set-applicab.html "37.11. collation_character_set_​applicability")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-column-domain-usage.html "37.13. column_domain_usage") |
| 37.11. `collation_character_set_​applicability`                                                           |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                              37.13. `column_domain_usage` |
