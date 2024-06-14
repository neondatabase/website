[#id](#VIEWS-OVERVIEW)

## 54.1. Overview [#](#VIEWS-OVERVIEW)

[Table 54.1](views-overview#VIEW-TABLE) lists the system views. More detailed documentation of each catalog follows below. Except where noted, all the views described here are read-only.

[#id](#VIEW-TABLE)

**Table 54.1. System Views**

| View Name                                                                 | Purpose                                                               |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [`pg_available_extensions`](view-pg-available-extensions)                 | available extensions                                                  |
| [`pg_available_extension_versions`](view-pg-available-extension-versions) | available versions of extensions                                      |
| [`pg_backend_memory_contexts`](view-pg-backend-memory-contexts)           | backend memory contexts                                               |
| [`pg_config`](view-pg-config)                                             | compile-time configuration parameters                                 |
| [`pg_cursors`](view-pg-cursors)                                           | open cursors                                                          |
| [`pg_file_settings`](view-pg-file-settings)                               | summary of configuration file contents                                |
| [`pg_group`](view-pg-group)                                               | groups of database users                                              |
| [`pg_hba_file_rules`](view-pg-hba-file-rules)                             | summary of client authentication configuration file contents          |
| [`pg_ident_file_mappings`](view-pg-ident-file-mappings)                   | summary of client user name mapping configuration file contents       |
| [`pg_indexes`](view-pg-indexes)                                           | indexes                                                               |
| [`pg_locks`](view-pg-locks)                                               | locks currently held or awaited                                       |
| [`pg_matviews`](view-pg-matviews)                                         | materialized views                                                    |
| [`pg_policies`](view-pg-policies)                                         | policies                                                              |
| [`pg_prepared_statements`](view-pg-prepared-statements)                   | prepared statements                                                   |
| [`pg_prepared_xacts`](view-pg-prepared-xacts)                             | prepared transactions                                                 |
| [`pg_publication_tables`](view-pg-publication-tables)                     | publications and information of their associated tables               |
| [`pg_replication_origin_status`](view-pg-replication-origin-status)       | information about replication origins, including replication progress |
| [`pg_replication_slots`](view-pg-replication-slots)                       | replication slot information                                          |
| [`pg_roles`](view-pg-roles)                                               | database roles                                                        |
| [`pg_rules`](view-pg-rules)                                               | rules                                                                 |
| [`pg_seclabels`](view-pg-seclabels)                                       | security labels                                                       |
| [`pg_sequences`](view-pg-sequences)                                       | sequences                                                             |
| [`pg_settings`](view-pg-settings)                                         | parameter settings                                                    |
| [`pg_shadow`](view-pg-shadow)                                             | database users                                                        |
| [`pg_shmem_allocations`](view-pg-shmem-allocations)                       | shared memory allocations                                             |
| [`pg_stats`](view-pg-stats)                                               | planner statistics                                                    |
| [`pg_stats_ext`](view-pg-stats-ext)                                       | extended planner statistics                                           |
| [`pg_stats_ext_exprs`](view-pg-stats-ext-exprs)                           | extended planner statistics for expressions                           |
| [`pg_tables`](view-pg-tables)                                             | tables                                                                |
| [`pg_timezone_abbrevs`](view-pg-timezone-abbrevs)                         | time zone abbreviations                                               |
| [`pg_timezone_names`](view-pg-timezone-names)                             | time zone names                                                       |
| [`pg_user`](view-pg-user)                                                 | database users                                                        |
| [`pg_user_mappings`](view-pg-user-mappings)                               | user mappings                                                         |
| [`pg_views`](view-pg-views)                                               | views                                                                 |
