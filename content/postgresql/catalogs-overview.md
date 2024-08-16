[#id](#CATALOGS-OVERVIEW)

## 53.1. Overview [#](#CATALOGS-OVERVIEW)

[Table 53.1](catalogs-overview#CATALOG-TABLE) lists the system catalogs. More detailed documentation of each catalog follows below.

Most system catalogs are copied from the template database during database creation and are thereafter database-specific. A few catalogs are physically shared across all databases in a cluster; these are noted in the descriptions of the individual catalogs.

[#id](#CATALOG-TABLE)

**Table 53.1. System Catalogs**

| Catalog Name                                                   | Purpose                                                                                 |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`pg_aggregate`](catalog-pg-aggregate)                         | aggregate functions                                                                     |
| [`pg_am`](catalog-pg-am)                                       | relation access methods                                                                 |
| [`pg_amop`](catalog-pg-amop)                                   | access method operators                                                                 |
| [`pg_amproc`](catalog-pg-amproc)                               | access method support functions                                                         |
| [`pg_attrdef`](catalog-pg-attrdef)                             | column default values                                                                   |
| [`pg_attribute`](catalog-pg-attribute)                         | table columns (“attributes”)                                                            |
| [`pg_authid`](catalog-pg-authid)                               | authorization identifiers (roles)                                                       |
| [`pg_auth_members`](catalog-pg-auth-members)                   | authorization identifier membership relationships                                       |
| [`pg_cast`](catalog-pg-cast)                                   | casts (data type conversions)                                                           |
| [`pg_class`](catalog-pg-class)                                 | tables, indexes, sequences, views (“relations”)                                         |
| [`pg_collation`](catalog-pg-collation)                         | collations (locale information)                                                         |
| [`pg_constraint`](catalog-pg-constraint)                       | check constraints, unique constraints, primary key constraints, foreign key constraints |
| [`pg_conversion`](catalog-pg-conversion)                       | encoding conversion information                                                         |
| [`pg_database`](catalog-pg-database)                           | databases within this database cluster                                                  |
| [`pg_db_role_setting`](catalog-pg-db-role-setting)             | per-role and per-database settings                                                      |
| [`pg_default_acl`](catalog-pg-default-acl)                     | default privileges for object types                                                     |
| [`pg_depend`](catalog-pg-depend)                               | dependencies between database objects                                                   |
| [`pg_description`](catalog-pg-description)                     | descriptions or comments on database objects                                            |
| [`pg_enum`](catalog-pg-enum)                                   | enum label and value definitions                                                        |
| [`pg_event_trigger`](catalog-pg-event-trigger)                 | event triggers                                                                          |
| [`pg_extension`](catalog-pg-extension)                         | installed extensions                                                                    |
| [`pg_foreign_data_wrapper`](catalog-pg-foreign-data-wrapper)   | foreign-data wrapper definitions                                                        |
| [`pg_foreign_server`](catalog-pg-foreign-server)               | foreign server definitions                                                              |
| [`pg_foreign_table`](catalog-pg-foreign-table)                 | additional foreign table information                                                    |
| [`pg_index`](catalog-pg-index)                                 | additional index information                                                            |
| [`pg_inherits`](catalog-pg-inherits)                           | table inheritance hierarchy                                                             |
| [`pg_init_privs`](catalog-pg-init-privs)                       | object initial privileges                                                               |
| [`pg_language`](catalog-pg-language)                           | languages for writing functions                                                         |
| [`pg_largeobject`](catalog-pg-largeobject)                     | data pages for large objects                                                            |
| [`pg_largeobject_metadata`](catalog-pg-largeobject-metadata)   | metadata for large objects                                                              |
| [`pg_namespace`](catalog-pg-namespace)                         | schemas                                                                                 |
| [`pg_opclass`](catalog-pg-opclass)                             | access method operator classes                                                          |
| [`pg_operator`](catalog-pg-operator)                           | operators                                                                               |
| [`pg_opfamily`](catalog-pg-opfamily)                           | access method operator families                                                         |
| [`pg_parameter_acl`](catalog-pg-parameter-acl)                 | configuration parameters for which privileges have been granted                         |
| [`pg_partitioned_table`](catalog-pg-partitioned-table)         | information about partition key of tables                                               |
| [`pg_policy`](catalog-pg-policy)                               | row-security policies                                                                   |
| [`pg_proc`](catalog-pg-proc)                                   | functions and procedures                                                                |
| [`pg_publication`](catalog-pg-publication)                     | publications for logical replication                                                    |
| [`pg_publication_namespace`](catalog-pg-publication-namespace) | schema to publication mapping                                                           |
| [`pg_publication_rel`](catalog-pg-publication-rel)             | relation to publication mapping                                                         |
| [`pg_range`](catalog-pg-range)                                 | information about range types                                                           |
| [`pg_replication_origin`](catalog-pg-replication-origin)       | registered replication origins                                                          |
| [`pg_rewrite`](catalog-pg-rewrite)                             | query rewrite rules                                                                     |
| [`pg_seclabel`](catalog-pg-seclabel)                           | security labels on database objects                                                     |
| [`pg_sequence`](catalog-pg-sequence)                           | information about sequences                                                             |
| [`pg_shdepend`](catalog-pg-shdepend)                           | dependencies on shared objects                                                          |
| [`pg_shdescription`](catalog-pg-shdescription)                 | comments on shared objects                                                              |
| [`pg_shseclabel`](catalog-pg-shseclabel)                       | security labels on shared database objects                                              |
| [`pg_statistic`](catalog-pg-statistic)                         | planner statistics                                                                      |
| [`pg_statistic_ext`](catalog-pg-statistic-ext)                 | extended planner statistics (definition)                                                |
| [`pg_statistic_ext_data`](catalog-pg-statistic-ext-data)       | extended planner statistics (built statistics)                                          |
| [`pg_subscription`](catalog-pg-subscription)                   | logical replication subscriptions                                                       |
| [`pg_subscription_rel`](catalog-pg-subscription-rel)           | relation state for subscriptions                                                        |
| [`pg_tablespace`](catalog-pg-tablespace)                       | tablespaces within this database cluster                                                |
| [`pg_transform`](catalog-pg-transform)                         | transforms (data type to procedural language conversions)                               |
| [`pg_trigger`](catalog-pg-trigger)                             | triggers                                                                                |
| [`pg_ts_config`](catalog-pg-ts-config)                         | text search configurations                                                              |
| [`pg_ts_config_map`](catalog-pg-ts-config-map)                 | text search configurations' token mappings                                              |
| [`pg_ts_dict`](catalog-pg-ts-dict)                             | text search dictionaries                                                                |
| [`pg_ts_parser`](catalog-pg-ts-parser)                         | text search parsers                                                                     |
| [`pg_ts_template`](catalog-pg-ts-template)                     | text search templates                                                                   |
| [`pg_type`](catalog-pg-type)                                   | data types                                                                              |
| [`pg_user_mapping`](catalog-pg-user-mapping)                   | mappings of users to foreign servers                                                    |
