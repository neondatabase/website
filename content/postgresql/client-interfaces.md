<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                    Part IV. Client Interfaces                    |                                                     |                                  |                                                       |                                                     |
| :--------------------------------------------------------------: | :-------------------------------------------------- | :------------------------------: | ----------------------------------------------------: | --------------------------------------------------: |
| [Prev](regress-coverage.html "33.5. Test Coverage Examination")  | [Up](index.html "PostgreSQL 17devel Documentation") | PostgreSQL 17devel Documentation | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](libpq.html "Chapter 34. libpq — C Library") |

***

# Part IV. Client Interfaces

This part describes the client programming interfaces distributed with PostgreSQL. Each of these chapters can be read independently. Note that there are many other programming interfaces for client programs that are distributed separately and contain their own documentation ([Appendix H](external-projects.html "Appendix H. External Projects") lists some of the more popular ones). Readers of this part should be familiar with using SQL commands to manipulate and query the database (see [Part II](sql.html "Part II. The SQL Language")) and of course with the programming language that the interface uses.

**Table of Contents**

*   [34. libpq — C Library](libpq.html)

    *   *   [34.1. Database Connection Control Functions](libpq-connect.html)
        *   [34.2. Connection Status Functions](libpq-status.html)
        *   [34.3. Command Execution Functions](libpq-exec.html)
        *   [34.4. Asynchronous Command Processing](libpq-async.html)
        *   [34.5. Pipeline Mode](libpq-pipeline-mode.html)
        *   [34.6. Retrieving Query Results Row-by-Row](libpq-single-row-mode.html)
        *   [34.7. Canceling Queries in Progress](libpq-cancel.html)
        *   [34.8. The Fast-Path Interface](libpq-fastpath.html)
        *   [34.9. Asynchronous Notification](libpq-notify.html)
        *   [34.10. Functions Associated with the `COPY` Command](libpq-copy.html)
        *   [34.11. Control Functions](libpq-control.html)
        *   [34.12. Miscellaneous Functions](libpq-misc.html)
        *   [34.13. Notice Processing](libpq-notice-processing.html)
        *   [34.14. Event System](libpq-events.html)
        *   [34.15. Environment Variables](libpq-envars.html)
        *   [34.16. The Password File](libpq-pgpass.html)
        *   [34.17. The Connection Service File](libpq-pgservice.html)
        *   [34.18. LDAP Lookup of Connection Parameters](libpq-ldap.html)
        *   [34.19. SSL Support](libpq-ssl.html)
        *   [34.20. Behavior in Threaded Programs](libpq-threading.html)
        *   [34.21. Building libpq Programs](libpq-build.html)
        *   [34.22. Example Programs](libpq-example.html)

*   [35. Large Objects](largeobjects.html)

    *   *   [35.1. Introduction](lo-intro.html)
        *   [35.2. Implementation Features](lo-implementation.html)
        *   [35.3. Client Interfaces](lo-interfaces.html)
        *   [35.4. Server-Side Functions](lo-funcs.html)
        *   [35.5. Example Program](lo-examplesect.html)

*   [36. ECPG — Embedded SQL in C](ecpg.html)

    *   *   [36.1. The Concept](ecpg-concept.html)
        *   [36.2. Managing Database Connections](ecpg-connect.html)
        *   [36.3. Running SQL Commands](ecpg-commands.html)
        *   [36.4. Using Host Variables](ecpg-variables.html)
        *   [36.5. Dynamic SQL](ecpg-dynamic.html)
        *   [36.6. pgtypes Library](ecpg-pgtypes.html)
        *   [36.7. Using Descriptor Areas](ecpg-descriptors.html)
        *   [36.8. Error Handling](ecpg-errors.html)
        *   [36.9. Preprocessor Directives](ecpg-preproc.html)
        *   [36.10. Processing Embedded SQL Programs](ecpg-process.html)
        *   [36.11. Library Functions](ecpg-library.html)
        *   [36.12. Large Objects](ecpg-lo.html)
        *   [36.13. C++ Applications](ecpg-cpp.html)
        *   [36.14. Embedded SQL Commands](ecpg-sql-commands.html)
        *   [36.15. Informix Compatibility Mode](ecpg-informix-compat.html)
        *   [36.16. Oracle Compatibility Mode](ecpg-oracle-compat.html)
        *   [36.17. Internals](ecpg-develop.html)

*   [37. The Information Schema](information-schema.html)

    *   *   [37.1. The Schema](infoschema-schema.html)
        *   [37.2. Data Types](infoschema-datatypes.html)
        *   [37.3. `information_schema_catalog_name`](infoschema-information-schema-catalog-name.html)
        *   [37.4. `administrable_role_​authorizations`](infoschema-administrable-role-authorizations.html)
        *   [37.5. `applicable_roles`](infoschema-applicable-roles.html)
        *   [37.6. `attributes`](infoschema-attributes.html)
        *   [37.7. `character_sets`](infoschema-character-sets.html)
        *   [37.8. `check_constraint_routine_usage`](infoschema-check-constraint-routine-usage.html)
        *   [37.9. `check_constraints`](infoschema-check-constraints.html)
        *   [37.10. `collations`](infoschema-collations.html)
        *   [37.11. `collation_character_set_​applicability`](infoschema-collation-character-set-applicab.html)
        *   [37.12. `column_column_usage`](infoschema-column-column-usage.html)
        *   [37.13. `column_domain_usage`](infoschema-column-domain-usage.html)
        *   [37.14. `column_options`](infoschema-column-options.html)
        *   [37.15. `column_privileges`](infoschema-column-privileges.html)
        *   [37.16. `column_udt_usage`](infoschema-column-udt-usage.html)
        *   [37.17. `columns`](infoschema-columns.html)
        *   [37.18. `constraint_column_usage`](infoschema-constraint-column-usage.html)
        *   [37.19. `constraint_table_usage`](infoschema-constraint-table-usage.html)
        *   [37.20. `data_type_privileges`](infoschema-data-type-privileges.html)
        *   [37.21. `domain_constraints`](infoschema-domain-constraints.html)
        *   [37.22. `domain_udt_usage`](infoschema-domain-udt-usage.html)
        *   [37.23. `domains`](infoschema-domains.html)
        *   [37.24. `element_types`](infoschema-element-types.html)
        *   [37.25. `enabled_roles`](infoschema-enabled-roles.html)
        *   [37.26. `foreign_data_wrapper_options`](infoschema-foreign-data-wrapper-options.html)
        *   [37.27. `foreign_data_wrappers`](infoschema-foreign-data-wrappers.html)
        *   [37.28. `foreign_server_options`](infoschema-foreign-server-options.html)
        *   [37.29. `foreign_servers`](infoschema-foreign-servers.html)
        *   [37.30. `foreign_table_options`](infoschema-foreign-table-options.html)
        *   [37.31. `foreign_tables`](infoschema-foreign-tables.html)
        *   [37.32. `key_column_usage`](infoschema-key-column-usage.html)
        *   [37.33. `parameters`](infoschema-parameters.html)
        *   [37.34. `referential_constraints`](infoschema-referential-constraints.html)
        *   [37.35. `role_column_grants`](infoschema-role-column-grants.html)
        *   [37.36. `role_routine_grants`](infoschema-role-routine-grants.html)
        *   [37.37. `role_table_grants`](infoschema-role-table-grants.html)
        *   [37.38. `role_udt_grants`](infoschema-role-udt-grants.html)
        *   [37.39. `role_usage_grants`](infoschema-role-usage-grants.html)
        *   [37.40. `routine_column_usage`](infoschema-routine-column-usage.html)
        *   [37.41. `routine_privileges`](infoschema-routine-privileges.html)
        *   [37.42. `routine_routine_usage`](infoschema-routine-routine-usage.html)
        *   [37.43. `routine_sequence_usage`](infoschema-routine-sequence-usage.html)
        *   [37.44. `routine_table_usage`](infoschema-routine-table-usage.html)
        *   [37.45. `routines`](infoschema-routines.html)
        *   [37.46. `schemata`](infoschema-schemata.html)
        *   [37.47. `sequences`](infoschema-sequences.html)
        *   [37.48. `sql_features`](infoschema-sql-features.html)
        *   [37.49. `sql_implementation_info`](infoschema-sql-implementation-info.html)
        *   [37.50. `sql_parts`](infoschema-sql-parts.html)
        *   [37.51. `sql_sizing`](infoschema-sql-sizing.html)
        *   [37.52. `table_constraints`](infoschema-table-constraints.html)
        *   [37.53. `table_privileges`](infoschema-table-privileges.html)
        *   [37.54. `tables`](infoschema-tables.html)
        *   [37.55. `transforms`](infoschema-transforms.html)
        *   [37.56. `triggered_update_columns`](infoschema-triggered-update-columns.html)
        *   [37.57. `triggers`](infoschema-triggers.html)
        *   [37.58. `udt_privileges`](infoschema-udt-privileges.html)
        *   [37.59. `usage_privileges`](infoschema-usage-privileges.html)
        *   [37.60. `user_defined_types`](infoschema-user-defined-types.html)
        *   [37.61. `user_mapping_options`](infoschema-user-mapping-options.html)
        *   [37.62. `user_mappings`](infoschema-user-mappings.html)
        *   [37.63. `view_column_usage`](infoschema-view-column-usage.html)
        *   [37.64. `view_routine_usage`](infoschema-view-routine-usage.html)
        *   [37.65. `view_table_usage`](infoschema-view-table-usage.html)
        *   [37.66. `views`](infoschema-views.html)

***

|                                                                  |                                                       |                                                     |
| :--------------------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------: |
| [Prev](regress-coverage.html "33.5. Test Coverage Examination")  |  [Up](index.html "PostgreSQL 17devel Documentation")  |  [Next](libpq.html "Chapter 34. libpq — C Library") |
| 33.5. Test Coverage Examination                                  | [Home](index.html "PostgreSQL 17devel Documentation") |                       Chapter 34. libpq — C Library |
