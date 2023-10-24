<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|          Part VII. Internals          |                                                     |                                  |                                                       |                                                                       |
| :-----------------------------------: | :-------------------------------------------------- | :------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](app-postgres.html "postgres")  | [Up](index.html "PostgreSQL 17devel Documentation") | PostgreSQL 17devel Documentation | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](overview.html "Chapter 52. Overview of PostgreSQL Internals") |

***

# Part VII. Internals

This part contains assorted information that might be of use to PostgreSQL developers.

**Table of Contents**

* [52. Overview of PostgreSQL Internals](overview.html)

  * *   [52.1. The Path of a Query](query-path.html)
  * [52.2. How Connections Are Established](connect-estab.html)
  * [52.3. The Parser Stage](parser-stage.html)
  * [52.4. The PostgreSQL Rule System](rule-system.html)
  * [52.5. Planner/Optimizer](planner-optimizer.html)
  * [52.6. Executor](executor.html)

* [53. System Catalogs](catalogs.html)

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

* [54. System Views](views.html)

  * *   [54.1. Overview](views-overview.html)
  * [54.2. `pg_available_extensions`](view-pg-available-extensions.html)
  * [54.3. `pg_available_extension_versions`](view-pg-available-extension-versions.html)
  * [54.4. `pg_backend_memory_contexts`](view-pg-backend-memory-contexts.html)
  * [54.5. `pg_config`](view-pg-config.html)
  * [54.6. `pg_cursors`](view-pg-cursors.html)
  * [54.7. `pg_file_settings`](view-pg-file-settings.html)
  * [54.8. `pg_group`](view-pg-group.html)
  * [54.9. `pg_hba_file_rules`](view-pg-hba-file-rules.html)
  * [54.10. `pg_ident_file_mappings`](view-pg-ident-file-mappings.html)
  * [54.11. `pg_indexes`](view-pg-indexes.html)
  * [54.12. `pg_locks`](view-pg-locks.html)
  * [54.13. `pg_matviews`](view-pg-matviews.html)
  * [54.14. `pg_policies`](view-pg-policies.html)
  * [54.15. `pg_prepared_statements`](view-pg-prepared-statements.html)
  * [54.16. `pg_prepared_xacts`](view-pg-prepared-xacts.html)
  * [54.17. `pg_publication_tables`](view-pg-publication-tables.html)
  * [54.18. `pg_replication_origin_status`](view-pg-replication-origin-status.html)
  * [54.19. `pg_replication_slots`](view-pg-replication-slots.html)
  * [54.20. `pg_roles`](view-pg-roles.html)
  * [54.21. `pg_rules`](view-pg-rules.html)
  * [54.22. `pg_seclabels`](view-pg-seclabels.html)
  * [54.23. `pg_sequences`](view-pg-sequences.html)
  * [54.24. `pg_settings`](view-pg-settings.html)
  * [54.25. `pg_shadow`](view-pg-shadow.html)
  * [54.26. `pg_shmem_allocations`](view-pg-shmem-allocations.html)
  * [54.27. `pg_stats`](view-pg-stats.html)
  * [54.28. `pg_stats_ext`](view-pg-stats-ext.html)
  * [54.29. `pg_stats_ext_exprs`](view-pg-stats-ext-exprs.html)
  * [54.30. `pg_tables`](view-pg-tables.html)
  * [54.31. `pg_timezone_abbrevs`](view-pg-timezone-abbrevs.html)
  * [54.32. `pg_timezone_names`](view-pg-timezone-names.html)
  * [54.33. `pg_user`](view-pg-user.html)
  * [54.34. `pg_user_mappings`](view-pg-user-mappings.html)
  * [54.35. `pg_views`](view-pg-views.html)
  * [54.36. `pg_wait_events`](view-pg-wait-events.html)

* [55. Frontend/Backend Protocol](protocol.html)

  * *   [55.1. Overview](protocol-overview.html)
  * [55.2. Message Flow](protocol-flow.html)
  * [55.3. SASL Authentication](sasl-authentication.html)
  * [55.4. Streaming Replication Protocol](protocol-replication.html)
  * [55.5. Logical Streaming Replication Protocol](protocol-logical-replication.html)
  * [55.6. Message Data Types](protocol-message-types.html)
  * [55.7. Message Formats](protocol-message-formats.html)
  * [55.8. Error and Notice Message Fields](protocol-error-fields.html)
  * [55.9. Logical Replication Message Formats](protocol-logicalrep-message-formats.html)
  * [55.10. Summary of Changes since Protocol 2.0](protocol-changes.html)

* [56. PostgreSQL Coding Conventions](source.html)

  * *   [56.1. Formatting](source-format.html)
  * [56.2. Reporting Errors Within the Server](error-message-reporting.html)
  * [56.3. Error Message Style Guide](error-style-guide.html)
  * [56.4. Miscellaneous Coding Conventions](source-conventions.html)

* [57. Native Language Support](nls.html)

  * *   [57.1. For the Translator](nls-translator.html)
  * [57.2. For the Programmer](nls-programmer.html)

      * *   [58. Writing a Procedural Language Handler](plhandler.html)
  * [59. Writing a Foreign Data Wrapper](fdwhandler.html)

    <!---->

      * *   [59.1. Foreign Data Wrapper Functions](fdw-functions.html)
    * [59.2. Foreign Data Wrapper Callback Routines](fdw-callbacks.html)
    * [59.3. Foreign Data Wrapper Helper Functions](fdw-helpers.html)
    * [59.4. Foreign Data Wrapper Query Planning](fdw-planning.html)
    * [59.5. Row Locking in Foreign Data Wrappers](fdw-row-locking.html)

* [60. Writing a Table Sampling Method](tablesample-method.html)

  * [60.1. Sampling Method Support Functions](tablesample-support-functions.html)

* [61. Writing a Custom Scan Provider](custom-scan.html)

  * *   [61.1. Creating Custom Scan Paths](custom-scan-path.html)
  * [61.2. Creating Custom Scan Plans](custom-scan-plan.html)
  * [61.3. Executing Custom Scans](custom-scan-execution.html)

* [62. Genetic Query Optimizer](geqo.html)

  * *   [62.1. Query Handling as a Complex Optimization Problem](geqo-intro.html)
  * [62.2. Genetic Algorithms](geqo-intro2.html)
  * [62.3. Genetic Query Optimization (GEQO) in PostgreSQL](geqo-pg-intro.html)
  * [62.4. Further Reading](geqo-biblio.html)

      * *   [63. Table Access Method Interface Definition](tableam.html)
  * [64. Index Access Method Interface Definition](indexam.html)

    <!---->

      * *   [64.1. Basic API Structure for Indexes](index-api.html)
    * [64.2. Index Access Method Functions](index-functions.html)
    * [64.3. Index Scanning](index-scanning.html)
    * [64.4. Index Locking Considerations](index-locking.html)
    * [64.5. Index Uniqueness Checks](index-unique-checks.html)
    * [64.6. Index Cost Estimation Functions](index-cost-estimation.html)

      * *   [65. Generic WAL Records](generic-wal.html)
  * [66. Custom WAL Resource Managers](custom-rmgr.html)
  * [67. B-Tree Indexes](btree.html)

    <!---->

      * *   [67.1. Introduction](btree-intro.html)
    * [67.2. Behavior of B-Tree Operator Classes](btree-behavior.html)
    * [67.3. B-Tree Support Functions](btree-support-funcs.html)
    * [67.4. Implementation](btree-implementation.html)

* [68. GiST Indexes](gist.html)

  * *   [68.1. Introduction](gist-intro.html)
  * [68.2. Built-in Operator Classes](gist-builtin-opclasses.html)
  * [68.3. Extensibility](gist-extensibility.html)
  * [68.4. Implementation](gist-implementation.html)
  * [68.5. Examples](gist-examples.html)

* [69. SP-GiST Indexes](spgist.html)

  * *   [69.1. Introduction](spgist-intro.html)
  * [69.2. Built-in Operator Classes](spgist-builtin-opclasses.html)
  * [69.3. Extensibility](spgist-extensibility.html)
  * [69.4. Implementation](spgist-implementation.html)
  * [69.5. Examples](spgist-examples.html)

* [70. GIN Indexes](gin.html)

  * *   [70.1. Introduction](gin-intro.html)
  * [70.2. Built-in Operator Classes](gin-builtin-opclasses.html)
  * [70.3. Extensibility](gin-extensibility.html)
  * [70.4. Implementation](gin-implementation.html)
  * [70.5. GIN Tips and Tricks](gin-tips.html)
  * [70.6. Limitations](gin-limit.html)
  * [70.7. Examples](gin-examples.html)

* [71. BRIN Indexes](brin.html)

  * *   [71.1. Introduction](brin-intro.html)
  * [71.2. Built-in Operator Classes](brin-builtin-opclasses.html)
  * [71.3. Extensibility](brin-extensibility.html)

* [72. Hash Indexes](hash-index.html)

  * *   [72.1. Overview](hash-intro.html)
  * [72.2. Implementation](hash-implementation.html)

* [73. Database Physical Storage](storage.html)

  * *   [73.1. Database File Layout](storage-file-layout.html)
  * [73.2. TOAST](storage-toast.html)
  * [73.3. Free Space Map](storage-fsm.html)
  * [73.4. Visibility Map](storage-vm.html)
  * [73.5. The Initialization Fork](storage-init.html)
  * [73.6. Database Page Layout](storage-page-layout.html)
  * [73.7. Heap-Only Tuples (HOT)](storage-hot.html)

* [74. Transaction Processing](transactions.html)

  * *   [74.1. Transactions and Identifiers](transaction-id.html)
  * [74.2. Transactions and Locking](xact-locking.html)
  * [74.3. Subtransactions](subxacts.html)
  * [74.4. Two-Phase Transactions](two-phase.html)

* [75. System Catalog Declarations and Initial Contents](bki.html)

  * *   [75.1. System Catalog Declaration Rules](system-catalog-declarations.html)
  * [75.2. System Catalog Initial Data](system-catalog-initial-data.html)
  * [75.3. BKI File Format](bki-format.html)
  * [75.4. BKI Commands](bki-commands.html)
  * [75.5. Structure of the Bootstrap BKI File](bki-structure.html)
  * [75.6. BKI Example](bki-example.html)

* [76. How the Planner Uses Statistics](planner-stats-details.html)

  * *   [76.1. Row Estimation Examples](row-estimation-examples.html)
  * [76.2. Multivariate Statistics Examples](multivariate-statistics-examples.html)
  * [76.3. Planner Statistics and Security](planner-stats-security.html)

* [77. Backup Manifest Format](backup-manifest-format.html)

  * *   [77.1. Backup Manifest Top-level Object](backup-manifest-toplevel.html)
  * [77.2. Backup Manifest File Object](backup-manifest-files.html)
  * [77.3. Backup Manifest WAL Range Object](backup-manifest-wal-ranges.html)

***

|                                       |                                                       |                                                                       |
| :------------------------------------ | :---------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](app-postgres.html "postgres")  |  [Up](index.html "PostgreSQL 17devel Documentation")  |  [Next](overview.html "Chapter 52. Overview of PostgreSQL Internals") |
| postgres                              | [Home](index.html "PostgreSQL 17devel Documentation") |                          Chapter 52. Overview of PostgreSQL Internals |
