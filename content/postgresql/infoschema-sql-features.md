[#id](#INFOSCHEMA-SQL-FEATURES)

## 37.48. `sql_features` [#](#INFOSCHEMA-SQL-FEATURES)

The table `sql_features` contains information about which formal features defined in the SQL standard are supported by PostgreSQL. This is the same information that is presented in [Appendix D](features). There you can also find some additional background information.

[#id](#id-1.7.6.52.3)

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
