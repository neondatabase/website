[#id](#INFOSCHEMA-SQL-PARTS)

## 37.50. `sql_parts` [#](#INFOSCHEMA-SQL-PARTS)

The table `sql_parts` contains information about which of the several parts of the SQL standard are supported by PostgreSQL.

[#id](#id-1.7.6.54.3)

**Table 37.48. `sql_parts` Columns**

| Column TypeDescription                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------- |
| `feature_id` `character_data`An identifier string containing the number of the part                                                         |
| `feature_name` `character_data`Descriptive name of the part                                                                                 |
| `is_supported` `yes_or_no``YES` if the part is fully supported by the current version of PostgreSQL, `NO` if not                            |
| `is_verified_by` `character_data`Always null, since the PostgreSQL development group does not perform formal testing of feature conformance |
| `comments` `character_data`Possibly a comment about the supported status of the part                                                        |
