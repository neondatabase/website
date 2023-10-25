

|                 37.48. `sql_features`                 |                                                                    |                                    |                                                       |                                                                                   |
| :---------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------------------------: |
| [Prev](infoschema-sequences.html "37.47. sequences")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-sql-implementation-info.html "37.49. sql_implementation_info") |

***

## 37.48. `sql_features` [#](#INFOSCHEMA-SQL-FEATURES)

The table `sql_features` contains information about which formal features defined in the SQL standard are supported by PostgreSQL. This is the same information that is presented in [Appendix D](features.html "Appendix D. SQL Conformance"). There you can also find some additional background information.

**Table 37.46. `sql_features` Columns**

| Column TypeDescription                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------- |
| `feature_id` `character_data`Identifier string of the feature                                                                               |
| `feature_name` `character_data`Descriptive name of the feature                                                                              |
| `sub_feature_id` `character_data`Identifier string of the subfeature, or a zero-length string if not a subfeature                           |
| `sub_feature_name` `character_data`Descriptive name of the subfeature, or a zero-length string if not a subfeature                          |
| `is_supported` `yes_or_no``YES` if the feature is fully supported by the current version of PostgreSQL, `NO` if not                         |
| `is_verified_by` `character_data`Always null, since the PostgreSQL development group does not perform formal testing of feature conformance |
| `comments` `character_data`Possibly a comment about the supported status of the feature                                                     |

***

|                                                       |                                                                    |                                                                                   |
| :---------------------------------------------------- | :----------------------------------------------------------------: | --------------------------------------------------------------------------------: |
| [Prev](infoschema-sequences.html "37.47. sequences")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-sql-implementation-info.html "37.49. sql_implementation_info") |
| 37.47. `sequences`                                    |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                                  37.49. `sql_implementation_info` |
