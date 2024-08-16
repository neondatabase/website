[#id](#VIEWS)

## Chapter 54. System Views

**Table of Contents**

- [54.1. Overview](views-overview)
- [54.2. `pg_available_extensions`](view-pg-available-extensions)
- [54.3. `pg_available_extension_versions`](view-pg-available-extension-versions)
- [54.4. `pg_backend_memory_contexts`](view-pg-backend-memory-contexts)
- [54.5. `pg_config`](view-pg-config)
- [54.6. `pg_cursors`](view-pg-cursors)
- [54.7. `pg_file_settings`](view-pg-file-settings)
- [54.8. `pg_group`](view-pg-group)
- [54.9. `pg_hba_file_rules`](view-pg-hba-file-rules)
- [54.10. `pg_ident_file_mappings`](view-pg-ident-file-mappings)
- [54.11. `pg_indexes`](view-pg-indexes)
- [54.12. `pg_locks`](view-pg-locks)
- [54.13. `pg_matviews`](view-pg-matviews)
- [54.14. `pg_policies`](view-pg-policies)
- [54.15. `pg_prepared_statements`](view-pg-prepared-statements)
- [54.16. `pg_prepared_xacts`](view-pg-prepared-xacts)
- [54.17. `pg_publication_tables`](view-pg-publication-tables)
- [54.18. `pg_replication_origin_status`](view-pg-replication-origin-status)
- [54.19. `pg_replication_slots`](view-pg-replication-slots)
- [54.20. `pg_roles`](view-pg-roles)
- [54.21. `pg_rules`](view-pg-rules)
- [54.22. `pg_seclabels`](view-pg-seclabels)
- [54.23. `pg_sequences`](view-pg-sequences)
- [54.24. `pg_settings`](view-pg-settings)
- [54.25. `pg_shadow`](view-pg-shadow)
- [54.26. `pg_shmem_allocations`](view-pg-shmem-allocations)
- [54.27. `pg_stats`](view-pg-stats)
- [54.28. `pg_stats_ext`](view-pg-stats-ext)
- [54.29. `pg_stats_ext_exprs`](view-pg-stats-ext-exprs)
- [54.30. `pg_tables`](view-pg-tables)
- [54.31. `pg_timezone_abbrevs`](view-pg-timezone-abbrevs)
- [54.32. `pg_timezone_names`](view-pg-timezone-names)
- [54.33. `pg_user`](view-pg-user)
- [54.34. `pg_user_mappings`](view-pg-user-mappings)
- [54.35. `pg_views`](view-pg-views)

In addition to the system catalogs, PostgreSQL provides a number of built-in views. Some system views provide convenient access to some commonly used queries on the system catalogs. Other views provide access to internal server state.

The information schema ([Chapter 37](information-schema)) provides an alternative set of views which overlap the functionality of the system views. Since the information schema is SQL-standard whereas the views described here are PostgreSQL-specific, it's usually better to use the information schema if it provides all the information you need.

[Table 54.1](views-overview#VIEW-TABLE) lists the system views described here. More detailed documentation of each view follows below. There are some additional views that provide access to accumulated statistics; they are described in [Table 28.2](monitoring-stats#MONITORING-STATS-VIEWS-TABLE).
