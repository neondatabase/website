

|                  37.46. `schemata`                  |                                                                    |                                    |                                                       |                                                       |
| :-------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ----------------------------------------------------: |
| [Prev](infoschema-routines.html "37.45. routines")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-sequences.html "37.47. sequences") |

***

## 37.46. `schemata` [#](#INFOSCHEMA-SCHEMATA)

The view `schemata` contains all schemas in the current database that the current user has access to (by way of being the owner or having some privilege).

**Table 37.44. `schemata` Columns**

| Column TypeDescription                                                                                            |
| ----------------------------------------------------------------------------------------------------------------- |
| `catalog_name` `sql_identifier`Name of the database that the schema is contained in (always the current database) |
| `schema_name` `sql_identifier`Name of the schema                                                                  |
| `schema_owner` `sql_identifier`Name of the owner of the schema                                                    |
| `default_character_set_catalog` `sql_identifier`Applies to a feature not available in PostgreSQL                  |
| `default_character_set_schema` `sql_identifier`Applies to a feature not available in PostgreSQL                   |
| `default_character_set_name` `sql_identifier`Applies to a feature not available in PostgreSQL                     |
| `sql_path` `character_data`Applies to a feature not available in PostgreSQL                                       |

***

|                                                     |                                                                    |                                                       |
| :-------------------------------------------------- | :----------------------------------------------------------------: | ----------------------------------------------------: |
| [Prev](infoschema-routines.html "37.45. routines")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-sequences.html "37.47. sequences") |
| 37.45. `routines`                                   |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                    37.47. `sequences` |
