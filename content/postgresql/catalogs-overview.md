## 53.1. Overview [#](#CATALOGS-OVERVIEW)

[Table 53.1](catalogs-overview.html#CATALOG-TABLE "Table 53.1. System Catalogs") lists the system catalogs. More detailed documentation of each catalog follows below.

Most system catalogs are copied from the template database during database creation and are thereafter database-specific. A few catalogs are physically shared across all databases in a cluster; these are noted in the descriptions of the individual catalogs.

**Table 53.1. System Catalogs**

| Catalog Name                                                                                          | Purpose                                                                                 |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`pg_aggregate`](catalog-pg-aggregate.html "53.2. pg_aggregate")                                      | aggregate functions                                                                     |
| [`pg_am`](catalog-pg-am.html "53.3. pg_am")                                                           | relation access methods                                                                 |
| [`pg_amop`](catalog-pg-amop.html "53.4. pg_amop")                                                     | access method operators                                                                 |
| [`pg_amproc`](catalog-pg-amproc.html "53.5. pg_amproc")                                               | access method support functions                                                         |
| [`pg_attrdef`](catalog-pg-attrdef.html "53.6. pg_attrdef")                                            | column default values                                                                   |
| [`pg_attribute`](catalog-pg-attribute.html "53.7. pg_attribute")                                      | table columns (“attributes”)                                                            |
| [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid")                                               | authorization identifiers (roles)                                                       |
| [`pg_auth_members`](catalog-pg-auth-members.html "53.9. pg_auth_members")                             | authorization identifier membership relationships                                       |
| [`pg_cast`](catalog-pg-cast.html "53.10. pg_cast")                                                    | casts (data type conversions)                                                           |
| [`pg_class`](catalog-pg-class.html "53.11. pg_class")                                                 | tables, indexes, sequences, views (“relations”)                                         |
| [`pg_collation`](catalog-pg-collation.html "53.12. pg_collation")                                     | collations (locale information)                                                         |
| [`pg_constraint`](catalog-pg-constraint.html "53.13. pg_constraint")                                  | check constraints, unique constraints, primary key constraints, foreign key constraints |
| [`pg_conversion`](catalog-pg-conversion.html "53.14. pg_conversion")                                  | encoding conversion information                                                         |
| [`pg_database`](catalog-pg-database.html "53.15. pg_database")                                        | databases within this database cluster                                                  |
| [`pg_db_role_setting`](catalog-pg-db-role-setting.html "53.16. pg_db_role_setting")                   | per-role and per-database settings                                                      |
| [`pg_default_acl`](catalog-pg-default-acl.html "53.17. pg_default_acl")                               | default privileges for object types                                                     |
| [`pg_depend`](catalog-pg-depend.html "53.18. pg_depend")                                              | dependencies between database objects                                                   |
| [`pg_description`](catalog-pg-description.html "53.19. pg_description")                               | descriptions or comments on database objects                                            |
| [`pg_enum`](catalog-pg-enum.html "53.20. pg_enum")                                                    | enum label and value definitions                                                        |
| [`pg_event_trigger`](catalog-pg-event-trigger.html "53.21. pg_event_trigger")                         | event triggers                                                                          |
| [`pg_extension`](catalog-pg-extension.html "53.22. pg_extension")                                     | installed extensions                                                                    |
| [`pg_foreign_data_wrapper`](catalog-pg-foreign-data-wrapper.html "53.23. pg_foreign_data_wrapper")    | foreign-data wrapper definitions                                                        |
| [`pg_foreign_server`](catalog-pg-foreign-server.html "53.24. pg_foreign_server")                      | foreign server definitions                                                              |
| [`pg_foreign_table`](catalog-pg-foreign-table.html "53.25. pg_foreign_table")                         | additional foreign table information                                                    |
| [`pg_index`](catalog-pg-index.html "53.26. pg_index")                                                 | additional index information                                                            |
| [`pg_inherits`](catalog-pg-inherits.html "53.27. pg_inherits")                                        | table inheritance hierarchy                                                             |
| [`pg_init_privs`](catalog-pg-init-privs.html "53.28. pg_init_privs")                                  | object initial privileges                                                               |
| [`pg_language`](catalog-pg-language.html "53.29. pg_language")                                        | languages for writing functions                                                         |
| [`pg_largeobject`](catalog-pg-largeobject.html "53.30. pg_largeobject")                               | data pages for large objects                                                            |
| [`pg_largeobject_metadata`](catalog-pg-largeobject-metadata.html "53.31. pg_largeobject_metadata")    | metadata for large objects                                                              |
| [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace")                                     | schemas                                                                                 |
| [`pg_opclass`](catalog-pg-opclass.html "53.33. pg_opclass")                                           | access method operator classes                                                          |
| [`pg_operator`](catalog-pg-operator.html "53.34. pg_operator")                                        | operators                                                                               |
| [`pg_opfamily`](catalog-pg-opfamily.html "53.35. pg_opfamily")                                        | access method operator families                                                         |
| [`pg_parameter_acl`](catalog-pg-parameter-acl.html "53.36. pg_parameter_acl")                         | configuration parameters for which privileges have been granted                         |
| [`pg_partitioned_table`](catalog-pg-partitioned-table.html "53.37. pg_partitioned_table")             | information about partition key of tables                                               |
| [`pg_policy`](catalog-pg-policy.html "53.38. pg_policy")                                              | row-security policies                                                                   |
| [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc")                                                    | functions and procedures                                                                |
| [`pg_publication`](catalog-pg-publication.html "53.40. pg_publication")                               | publications for logical replication                                                    |
| [`pg_publication_namespace`](catalog-pg-publication-namespace.html "53.41. pg_publication_namespace") | schema to publication mapping                                                           |
| [`pg_publication_rel`](catalog-pg-publication-rel.html "53.42. pg_publication_rel")                   | relation to publication mapping                                                         |
| [`pg_range`](catalog-pg-range.html "53.43. pg_range")                                                 | information about range types                                                           |
| [`pg_replication_origin`](catalog-pg-replication-origin.html "53.44. pg_replication_origin")          | registered replication origins                                                          |
| [`pg_rewrite`](catalog-pg-rewrite.html "53.45. pg_rewrite")                                           | query rewrite rules                                                                     |
| [`pg_seclabel`](catalog-pg-seclabel.html "53.46. pg_seclabel")                                        | security labels on database objects                                                     |
| [`pg_sequence`](catalog-pg-sequence.html "53.47. pg_sequence")                                        | information about sequences                                                             |
| [`pg_shdepend`](catalog-pg-shdepend.html "53.48. pg_shdepend")                                        | dependencies on shared objects                                                          |
| [`pg_shdescription`](catalog-pg-shdescription.html "53.49. pg_shdescription")                         | comments on shared objects                                                              |
| [`pg_shseclabel`](catalog-pg-shseclabel.html "53.50. pg_shseclabel")                                  | security labels on shared database objects                                              |
| [`pg_statistic`](catalog-pg-statistic.html "53.51. pg_statistic")                                     | planner statistics                                                                      |
| [`pg_statistic_ext`](catalog-pg-statistic-ext.html "53.52. pg_statistic_ext")                         | extended planner statistics (definition)                                                |
| [`pg_statistic_ext_data`](catalog-pg-statistic-ext-data.html "53.53. pg_statistic_ext_data")          | extended planner statistics (built statistics)                                          |
| [`pg_subscription`](catalog-pg-subscription.html "53.54. pg_subscription")                            | logical replication subscriptions                                                       |
| [`pg_subscription_rel`](catalog-pg-subscription-rel.html "53.55. pg_subscription_rel")                | relation state for subscriptions                                                        |
| [`pg_tablespace`](catalog-pg-tablespace.html "53.56. pg_tablespace")                                  | tablespaces within this database cluster                                                |
| [`pg_transform`](catalog-pg-transform.html "53.57. pg_transform")                                     | transforms (data type to procedural language conversions)                               |
| [`pg_trigger`](catalog-pg-trigger.html "53.58. pg_trigger")                                           | triggers                                                                                |
| [`pg_ts_config`](catalog-pg-ts-config.html "53.59. pg_ts_config")                                     | text search configurations                                                              |
| [`pg_ts_config_map`](catalog-pg-ts-config-map.html "53.60. pg_ts_config_map")                         | text search configurations' token mappings                                              |
| [`pg_ts_dict`](catalog-pg-ts-dict.html "53.61. pg_ts_dict")                                           | text search dictionaries                                                                |
| [`pg_ts_parser`](catalog-pg-ts-parser.html "53.62. pg_ts_parser")                                     | text search parsers                                                                     |
| [`pg_ts_template`](catalog-pg-ts-template.html "53.63. pg_ts_template")                               | text search templates                                                                   |
| [`pg_type`](catalog-pg-type.html "53.64. pg_type")                                                    | data types                                                                              |
| [`pg_user_mapping`](catalog-pg-user-mapping.html "53.65. pg_user_mapping")                            | mappings of users to foreign servers                                                    |