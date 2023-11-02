## 54.1. Overview [#](#VIEWS-OVERVIEW)

[Table 54.1](views-overview#VIEW-TABLE "Table 54.1. System Views") lists the system views. More detailed documentation of each catalog follows below. Except where noted, all the views described here are read-only.

**Table 54.1. System Views**

| View Name                                                                                                              | Purpose                                                               |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [`pg_available_extensions`](view-pg-available-extensions "54.2. pg_available_extensions")                         | available extensions                                                  |
| [`pg_available_extension_versions`](view-pg-available-extension-versions "54.3. pg_available_extension_versions") | available versions of extensions                                      |
| [`pg_backend_memory_contexts`](view-pg-backend-memory-contexts "54.4. pg_backend_memory_contexts")                | backend memory contexts                                               |
| [`pg_config`](view-pg-config "54.5. pg_config")                                                                   | compile-time configuration parameters                                 |
| [`pg_cursors`](view-pg-cursors "54.6. pg_cursors")                                                                | open cursors                                                          |
| [`pg_file_settings`](view-pg-file-settings "54.7. pg_file_settings")                                              | summary of configuration file contents                                |
| [`pg_group`](view-pg-group "54.8. pg_group")                                                                      | groups of database users                                              |
| [`pg_hba_file_rules`](view-pg-hba-file-rules "54.9. pg_hba_file_rules")                                           | summary of client authentication configuration file contents          |
| [`pg_ident_file_mappings`](view-pg-ident-file-mappings "54.10. pg_ident_file_mappings")                           | summary of client user name mapping configuration file contents       |
| [`pg_indexes`](view-pg-indexes "54.11. pg_indexes")                                                               | indexes                                                               |
| [`pg_locks`](view-pg-locks "54.12. pg_locks")                                                                     | locks currently held or awaited                                       |
| [`pg_matviews`](view-pg-matviews "54.13. pg_matviews")                                                            | materialized views                                                    |
| [`pg_policies`](view-pg-policies "54.14. pg_policies")                                                            | policies                                                              |
| [`pg_prepared_statements`](view-pg-prepared-statements "54.15. pg_prepared_statements")                           | prepared statements                                                   |
| [`pg_prepared_xacts`](view-pg-prepared-xacts "54.16. pg_prepared_xacts")                                          | prepared transactions                                                 |
| [`pg_publication_tables`](view-pg-publication-tables "54.17. pg_publication_tables")                              | publications and information of their associated tables               |
| [`pg_replication_origin_status`](view-pg-replication-origin-status "54.18. pg_replication_origin_status")         | information about replication origins, including replication progress |
| [`pg_replication_slots`](view-pg-replication-slots "54.19. pg_replication_slots")                                 | replication slot information                                          |
| [`pg_roles`](view-pg-roles "54.20. pg_roles")                                                                     | database roles                                                        |
| [`pg_rules`](view-pg-rules "54.21. pg_rules")                                                                     | rules                                                                 |
| [`pg_seclabels`](view-pg-seclabels "54.22. pg_seclabels")                                                         | security labels                                                       |
| [`pg_sequences`](view-pg-sequences "54.23. pg_sequences")                                                         | sequences                                                             |
| [`pg_settings`](view-pg-settings "54.24. pg_settings")                                                            | parameter settings                                                    |
| [`pg_shadow`](view-pg-shadow "54.25. pg_shadow")                                                                  | database users                                                        |
| [`pg_shmem_allocations`](view-pg-shmem-allocations "54.26. pg_shmem_allocations")                                 | shared memory allocations                                             |
| [`pg_stats`](view-pg-stats "54.27. pg_stats")                                                                     | planner statistics                                                    |
| [`pg_stats_ext`](view-pg-stats-ext "54.28. pg_stats_ext")                                                         | extended planner statistics                                           |
| [`pg_stats_ext_exprs`](view-pg-stats-ext-exprs "54.29. pg_stats_ext_exprs")                                       | extended planner statistics for expressions                           |
| [`pg_tables`](view-pg-tables "54.30. pg_tables")                                                                  | tables                                                                |
| [`pg_timezone_abbrevs`](view-pg-timezone-abbrevs "54.31. pg_timezone_abbrevs")                                    | time zone abbreviations                                               |
| [`pg_timezone_names`](view-pg-timezone-names "54.32. pg_timezone_names")                                          | time zone names                                                       |
| [`pg_user`](view-pg-user "54.33. pg_user")                                                                        | database users                                                        |
| [`pg_user_mappings`](view-pg-user-mappings "54.34. pg_user_mappings")                                             | user mappings                                                         |
| [`pg_views`](view-pg-views "54.35. pg_views")                                                                     | views                                                                 |
| [`pg_wait_events`](view-pg-wait-events "54.36. pg_wait_events")                                                   | wait events                                                           |