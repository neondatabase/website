<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|     37.11. `collation_character_set_​applicability`     |                                                                    |                                    |                                                       |                                                                           |
| :-----------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ------------------------------------------------------------------------: |
| [Prev](infoschema-collations.html "37.10. collations")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-column-column-usage.html "37.12. column_column_usage") |

***

## 37.11. `collation_character_set_​applicability` [#](#INFOSCHEMA-COLLATION-CHARACTER-SET-APPLICAB)

The view `collation_character_set_applicability` identifies which character set the available collations are applicable to. In PostgreSQL, there is only one character set per database (see explanation in [Section 37.7](infoschema-character-sets.html "37.7. character_sets")), so this view does not provide much useful information.

**Table 37.9. `collation_character_set_applicability` Columns**

| Column TypeDescription                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------ |
| `collation_catalog` `sql_identifier`Name of the database containing the collation (always the current database)                |
| `collation_schema` `sql_identifier`Name of the schema containing the collation                                                 |
| `collation_name` `sql_identifier`Name of the default collation                                                                 |
| `character_set_catalog` `sql_identifier`Character sets are currently not implemented as schema objects, so this column is null |
| `character_set_schema` `sql_identifier`Character sets are currently not implemented as schema objects, so this column is null  |
| `character_set_name` `sql_identifier`Name of the character set                                                                 |

***

|                                                         |                                                                    |                                                                           |
| :------------------------------------------------------ | :----------------------------------------------------------------: | ------------------------------------------------------------------------: |
| [Prev](infoschema-collations.html "37.10. collations")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-column-column-usage.html "37.12. column_column_usage") |
| 37.10. `collations`                                     |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                              37.12. `column_column_usage` |
