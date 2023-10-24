<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|       Chapter 37. The Information Schema      |                                                           |                            |                                                       |                                                    |
| :-------------------------------------------: | :-------------------------------------------------------- | :------------------------: | ----------------------------------------------------: | -------------------------------------------------: |
| [Prev](ecpg-develop.html "36.17. Internals")  | [Up](client-interfaces.html "Part IV. Client Interfaces") | Part IV. Client Interfaces | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-schema.html "37.1. The Schema") |

***

## Chapter 37. The Information Schema

**Table of Contents**

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

[]()

The information schema consists of a set of views that contain information about the objects defined in the current database. The information schema is defined in the SQL standard and can therefore be expected to be portable and remain stable — unlike the system catalogs, which are specific to PostgreSQL and are modeled after implementation concerns. The information schema views do not, however, contain information about PostgreSQL-specific features; to inquire about those you need to query the system catalogs or other PostgreSQL-specific views.

### Note

When querying the database for constraint information, it is possible for a standard-compliant query that expects to return one row to return several. This is because the SQL standard requires constraint names to be unique within a schema, but PostgreSQL does not enforce this restriction. PostgreSQL automatically-generated constraint names avoid duplicates in the same schema, but users can specify such duplicate names.

This problem can appear when querying information schema views such as `check_constraint_routine_usage`, `check_constraints`, `domain_constraints`, and `referential_constraints`. Some other views have similar issues but contain the table name to help distinguish duplicate rows, e.g., `constraint_column_usage`, `constraint_table_usage`, `table_constraints`.

***

|                                               |                                                           |                                                    |
| :-------------------------------------------- | :-------------------------------------------------------: | -------------------------------------------------: |
| [Prev](ecpg-develop.html "36.17. Internals")  | [Up](client-interfaces.html "Part IV. Client Interfaces") |  [Next](infoschema-schema.html "37.1. The Schema") |
| 36.17. Internals                              |   [Home](index.html "PostgreSQL 17devel Documentation")   |                                   37.1. The Schema |
