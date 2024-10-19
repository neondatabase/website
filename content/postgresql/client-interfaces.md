[#id](#CLIENT-INTERFACES)

# Part IV. Client Interfaces

[#id](#id-1.7.2)

This part describes the client programming interfaces distributed with PostgreSQL. Each of these chapters can be read independently. Note that there are many other programming interfaces for client programs that are distributed separately and contain their own documentation ([Appendix H](external-projects) lists some of the more popular ones). Readers of this part should be familiar with using SQL commands to manipulate and query the database (see [Part II](sql)) and of course with the programming language that the interface uses.

**Table of Contents**

- [34. libpq — C Library](libpq)

  - [34.1. Database Connection Control Functions](libpq-connect)
  - [34.2. Connection Status Functions](libpq-status)
  - [34.3. Command Execution Functions](libpq-exec)
  - [34.4. Asynchronous Command Processing](libpq-async)
  - [34.5. Pipeline Mode](libpq-pipeline-mode)
  - [34.6. Retrieving Query Results Row-by-Row](libpq-single-row-mode)
  - [34.7. Canceling Queries in Progress](libpq-cancel)
  - [34.8. The Fast-Path Interface](libpq-fastpath)
  - [34.9. Asynchronous Notification](libpq-notify)
  - [34.10. Functions Associated with the `COPY` Command](libpq-copy)
  - [34.11. Control Functions](libpq-control)
  - [34.12. Miscellaneous Functions](libpq-misc)
  - [34.13. Notice Processing](libpq-notice-processing)
  - [34.14. Event System](libpq-events)
  - [34.15. Environment Variables](libpq-envars)
  - [34.16. The Password File](libpq-pgpass)
  - [34.17. The Connection Service File](libpq-pgservice)
  - [34.18. LDAP Lookup of Connection Parameters](libpq-ldap)
  - [34.19. SSL Support](libpq-ssl)
  - [34.20. Behavior in Threaded Programs](libpq-threading)
  - [34.21. Building libpq Programs](libpq-build)
  - [34.22. Example Programs](libpq-example)

- [35. Large Objects](largeobjects)

  - [35.1. Introduction](lo-intro)
  - [35.2. Implementation Features](lo-implementation)
  - [35.3. Client Interfaces](lo-interfaces)
  - [35.4. Server-Side Functions](lo-funcs)
  - [35.5. Example Program](lo-examplesect)

- [36. ECPG — Embedded SQL in C](ecpg)

  - [36.1. The Concept](ecpg-concept)
  - [36.2. Managing Database Connections](ecpg-connect)
  - [36.3. Running SQL Commands](ecpg-commands)
  - [36.4. Using Host Variables](ecpg-variables)
  - [36.5. Dynamic SQL](ecpg-dynamic)
  - [36.6. pgtypes Library](ecpg-pgtypes)
  - [36.7. Using Descriptor Areas](ecpg-descriptors)
  - [36.8. Error Handling](ecpg-errors)
  - [36.9. Preprocessor Directives](ecpg-preproc)
  - [36.10. Processing Embedded SQL Programs](ecpg-process)
  - [36.11. Library Functions](ecpg-library)
  - [36.12. Large Objects](ecpg-lo)
  - [36.13. C++ Applications](ecpg-cpp)
  - [36.14. Embedded SQL Commands](ecpg-sql-commands)
  - [36.15. Informix Compatibility Mode](ecpg-informix-compat)
  - [36.16. Oracle Compatibility Mode](ecpg-oracle-compat)
  - [36.17. Internals](ecpg-develop)

- [37. The Information Schema](information-schema)

  - [37.1. The Schema](infoschema-schema)
  - [37.2. Data Types](infoschema-datatypes)
  - [37.3. `information_schema_catalog_name`](infoschema-information-schema-catalog-name)
  - [37.4. `administrable_role_​authorizations`](infoschema-administrable-role-authorizations)
  - [37.5. `applicable_roles`](infoschema-applicable-roles)
  - [37.6. `attributes`](infoschema-attributes)
  - [37.7. `character_sets`](infoschema-character-sets)
  - [37.8. `check_constraint_routine_usage`](infoschema-check-constraint-routine-usage)
  - [37.9. `check_constraints`](infoschema-check-constraints)
  - [37.10. `collations`](infoschema-collations)
  - [37.11. `collation_character_set_​applicability`](infoschema-collation-character-set-applicab)
  - [37.12. `column_column_usage`](infoschema-column-column-usage)
  - [37.13. `column_domain_usage`](infoschema-column-domain-usage)
  - [37.14. `column_options`](infoschema-column-options)
  - [37.15. `column_privileges`](infoschema-column-privileges)
  - [37.16. `column_udt_usage`](infoschema-column-udt-usage)
  - [37.17. `columns`](infoschema-columns)
  - [37.18. `constraint_column_usage`](infoschema-constraint-column-usage)
  - [37.19. `constraint_table_usage`](infoschema-constraint-table-usage)
  - [37.20. `data_type_privileges`](infoschema-data-type-privileges)
  - [37.21. `domain_constraints`](infoschema-domain-constraints)
  - [37.22. `domain_udt_usage`](infoschema-domain-udt-usage)
  - [37.23. `domains`](infoschema-domains)
  - [37.24. `element_types`](infoschema-element-types)
  - [37.25. `enabled_roles`](infoschema-enabled-roles)
  - [37.26. `foreign_data_wrapper_options`](infoschema-foreign-data-wrapper-options)
  - [37.27. `foreign_data_wrappers`](infoschema-foreign-data-wrappers)
  - [37.28. `foreign_server_options`](infoschema-foreign-server-options)
  - [37.29. `foreign_servers`](infoschema-foreign-servers)
  - [37.30. `foreign_table_options`](infoschema-foreign-table-options)
  - [37.31. `foreign_tables`](infoschema-foreign-tables)
  - [37.32. `key_column_usage`](infoschema-key-column-usage)
  - [37.33. `parameters`](infoschema-parameters)
  - [37.34. `referential_constraints`](infoschema-referential-constraints)
  - [37.35. `role_column_grants`](infoschema-role-column-grants)
  - [37.36. `role_routine_grants`](infoschema-role-routine-grants)
  - [37.37. `role_table_grants`](infoschema-role-table-grants)
  - [37.38. `role_udt_grants`](infoschema-role-udt-grants)
  - [37.39. `role_usage_grants`](infoschema-role-usage-grants)
  - [37.40. `routine_column_usage`](infoschema-routine-column-usage)
  - [37.41. `routine_privileges`](infoschema-routine-privileges)
  - [37.42. `routine_routine_usage`](infoschema-routine-routine-usage)
  - [37.43. `routine_sequence_usage`](infoschema-routine-sequence-usage)
  - [37.44. `routine_table_usage`](infoschema-routine-table-usage)
  - [37.45. `routines`](infoschema-routines)
  - [37.46. `schemata`](infoschema-schemata)
  - [37.47. `sequences`](infoschema-sequences)
  - [37.48. `sql_features`](infoschema-sql-features)
  - [37.49. `sql_implementation_info`](infoschema-sql-implementation-info)
  - [37.50. `sql_parts`](infoschema-sql-parts)
  - [37.51. `sql_sizing`](infoschema-sql-sizing)
  - [37.52. `table_constraints`](infoschema-table-constraints)
  - [37.53. `table_privileges`](infoschema-table-privileges)
  - [37.54. `tables`](infoschema-tables)
  - [37.55. `transforms`](infoschema-transforms)
  - [37.56. `triggered_update_columns`](infoschema-triggered-update-columns)
  - [37.57. `triggers`](infoschema-triggers)
  - [37.58. `udt_privileges`](infoschema-udt-privileges)
  - [37.59. `usage_privileges`](infoschema-usage-privileges)
  - [37.60. `user_defined_types`](infoschema-user-defined-types)
  - [37.61. `user_mapping_options`](infoschema-user-mapping-options)
  - [37.62. `user_mappings`](infoschema-user-mappings)
  - [37.63. `view_column_usage`](infoschema-view-column-usage)
  - [37.64. `view_routine_usage`](infoschema-view-routine-usage)
  - [37.65. `view_table_usage`](infoschema-view-table-usage)
  - [37.66. `views`](infoschema-views)