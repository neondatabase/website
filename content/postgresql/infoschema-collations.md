

|                          37.10. `collations`                         |                                                                    |                                    |                                                       |                                                                                                           |
| :------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------------------------------------------------: |
| [Prev](infoschema-check-constraints.html "37.9. check_constraints")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-collation-character-set-applicab.html "37.11. collation_character_set_​applicability") |

***

## 37.10. `collations` [#](#INFOSCHEMA-COLLATIONS)

The view `collations` contains the collations available in the current database.

**Table 37.8. `collations` Columns**

| Column TypeDescription                                                                                          |
| --------------------------------------------------------------------------------------------------------------- |
| `collation_catalog` `sql_identifier`Name of the database containing the collation (always the current database) |
| `collation_schema` `sql_identifier`Name of the schema containing the collation                                  |
| `collation_name` `sql_identifier`Name of the default collation                                                  |
| `pad_attribute` `character_data`Always `NO PAD` (The alternative `PAD SPACE` is not supported by PostgreSQL.)   |

***

|                                                                      |                                                                    |                                                                                                           |
| :------------------------------------------------------------------- | :----------------------------------------------------------------: | --------------------------------------------------------------------------------------------------------: |
| [Prev](infoschema-check-constraints.html "37.9. check_constraints")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-collation-character-set-applicab.html "37.11. collation_character_set_​applicability") |
| 37.9. `check_constraints`                                            |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                                           37.11. `collation_character_set_​applicability` |
