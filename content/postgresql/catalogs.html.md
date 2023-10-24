<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|       Chapter 53. System Catalogs       |                                            |                     |                                                       |                                                  |
| :-------------------------------------: | :----------------------------------------- | :-----------------: | ----------------------------------------------------: | -----------------------------------------------: |
| [Prev](executor.html "52.6. Executor")  | [Up](internals.html "Part VII. Internals") | Part VII. Internals | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalogs-overview.html "53.1. Overview") |

***

## Chapter 53. System Catalogs

**Table of Contents**

  * *   [53.1. Overview](catalogs-overview.html)
* [53.2. `pg_aggregate`](catalog-pg-aggregate.html)
* [53.3. `pg_am`](catalog-pg-am.html)
* [53.4. `pg_amop`](catalog-pg-amop.html)
* [53.5. `pg_amproc`](catalog-pg-amproc.html)
* [53.6. `pg_attrdef`](catalog-pg-attrdef.html)
* [53.7. `pg_attribute`](catalog-pg-attribute.html)
* [53.8. `pg_authid`](catalog-pg-authid.html)
* [53.9. `pg_auth_members`](catalog-pg-auth-members.html)
* [53.10. `pg_cast`](catalog-pg-cast.html)
* [53.11. `pg_class`](catalog-pg-class.html)
* [53.12. `pg_collation`](catalog-pg-collation.html)
* [53.13. `pg_constraint`](catalog-pg-constraint.html)
* [53.14. `pg_conversion`](catalog-pg-conversion.html)
* [53.15. `pg_database`](catalog-pg-database.html)
* [53.16. `pg_db_role_setting`](catalog-pg-db-role-setting.html)
* [53.17. `pg_default_acl`](catalog-pg-default-acl.html)
* [53.18. `pg_depend`](catalog-pg-depend.html)
* [53.19. `pg_description`](catalog-pg-description.html)
* [53.20. `pg_enum`](catalog-pg-enum.html)
* [53.21. `pg_event_trigger`](catalog-pg-event-trigger.html)
* [53.22. `pg_extension`](catalog-pg-extension.html)
* [53.23. `pg_foreign_data_wrapper`](catalog-pg-foreign-data-wrapper.html)
* [53.24. `pg_foreign_server`](catalog-pg-foreign-server.html)
* [53.25. `pg_foreign_table`](catalog-pg-foreign-table.html)
* [53.26. `pg_index`](catalog-pg-index.html)
* [53.27. `pg_inherits`](catalog-pg-inherits.html)
* [53.28. `pg_init_privs`](catalog-pg-init-privs.html)
* [53.29. `pg_language`](catalog-pg-language.html)
* [53.30. `pg_largeobject`](catalog-pg-largeobject.html)
* [53.31. `pg_largeobject_metadata`](catalog-pg-largeobject-metadata.html)
* [53.32. `pg_namespace`](catalog-pg-namespace.html)
* [53.33. `pg_opclass`](catalog-pg-opclass.html)
* [53.34. `pg_operator`](catalog-pg-operator.html)
* [53.35. `pg_opfamily`](catalog-pg-opfamily.html)
* [53.36. `pg_parameter_acl`](catalog-pg-parameter-acl.html)
* [53.37. `pg_partitioned_table`](catalog-pg-partitioned-table.html)
* [53.38. `pg_policy`](catalog-pg-policy.html)
* [53.39. `pg_proc`](catalog-pg-proc.html)
* [53.40. `pg_publication`](catalog-pg-publication.html)
* [53.41. `pg_publication_namespace`](catalog-pg-publication-namespace.html)
* [53.42. `pg_publication_rel`](catalog-pg-publication-rel.html)
* [53.43. `pg_range`](catalog-pg-range.html)
* [53.44. `pg_replication_origin`](catalog-pg-replication-origin.html)
* [53.45. `pg_rewrite`](catalog-pg-rewrite.html)
* [53.46. `pg_seclabel`](catalog-pg-seclabel.html)
* [53.47. `pg_sequence`](catalog-pg-sequence.html)
* [53.48. `pg_shdepend`](catalog-pg-shdepend.html)
* [53.49. `pg_shdescription`](catalog-pg-shdescription.html)
* [53.50. `pg_shseclabel`](catalog-pg-shseclabel.html)
* [53.51. `pg_statistic`](catalog-pg-statistic.html)
* [53.52. `pg_statistic_ext`](catalog-pg-statistic-ext.html)
* [53.53. `pg_statistic_ext_data`](catalog-pg-statistic-ext-data.html)
* [53.54. `pg_subscription`](catalog-pg-subscription.html)
* [53.55. `pg_subscription_rel`](catalog-pg-subscription-rel.html)
* [53.56. `pg_tablespace`](catalog-pg-tablespace.html)
* [53.57. `pg_transform`](catalog-pg-transform.html)
* [53.58. `pg_trigger`](catalog-pg-trigger.html)
* [53.59. `pg_ts_config`](catalog-pg-ts-config.html)
* [53.60. `pg_ts_config_map`](catalog-pg-ts-config-map.html)
* [53.61. `pg_ts_dict`](catalog-pg-ts-dict.html)
* [53.62. `pg_ts_parser`](catalog-pg-ts-parser.html)
* [53.63. `pg_ts_template`](catalog-pg-ts-template.html)
* [53.64. `pg_type`](catalog-pg-type.html)
* [53.65. `pg_user_mapping`](catalog-pg-user-mapping.html)

The system catalogs are the place where a relational database management system stores schema metadata, such as information about tables and columns, and internal bookkeeping information. PostgreSQL's system catalogs are regular tables. You can drop and recreate the tables, add columns, insert and update values, and severely mess up your system that way. Normally, one should not change the system catalogs by hand, there are normally SQL commands to do that. (For example, `CREATE DATABASE` inserts a row into the `pg_database` catalog — and actually creates the database on disk.) There are some exceptions for particularly esoteric operations, but many of those have been made available as SQL commands over time, and so the need for direct manipulation of the system catalogs is ever decreasing.

***

|                                         |                                                       |                                                  |
| :-------------------------------------- | :---------------------------------------------------: | -----------------------------------------------: |
| [Prev](executor.html "52.6. Executor")  |       [Up](internals.html "Part VII. Internals")      |  [Next](catalogs-overview.html "53.1. Overview") |
| 52.6. Executor                          | [Home](index.html "PostgreSQL 17devel Documentation") |                                   53.1. Overview |
