<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                     37.25. `enabled_roles`                    |                                                                    |                                    |                                                       |                                                                                             |
| :-----------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ------------------------------------------------------------------------------------------: |
| [Prev](infoschema-element-types.html "37.24. element_types")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-foreign-data-wrapper-options.html "37.26. foreign_data_wrapper_options") |

***

## 37.25. `enabled_roles` [#](#INFOSCHEMA-ENABLED-ROLES)

The view `enabled_roles` identifies the currently “enabled roles”. The enabled roles are recursively defined as the current user together with all roles that have been granted to the enabled roles with automatic inheritance. In other words, these are all roles that the current user has direct or indirect, automatically inheriting membership in.[]()[]()

For permission checking, the set of “applicable roles” is applied, which can be broader than the set of enabled roles. So generally, it is better to use the view `applicable_roles` instead of this one; See [Section 37.5](infoschema-applicable-roles.html "37.5. applicable_roles") for details on `applicable_roles` view.

**Table 37.23. `enabled_roles` Columns**

| Column TypeDescription                     |
| ------------------------------------------ |
| `role_name` `sql_identifier`Name of a role |

***

|                                                               |                                                                    |                                                                                             |
| :------------------------------------------------------------ | :----------------------------------------------------------------: | ------------------------------------------------------------------------------------------: |
| [Prev](infoschema-element-types.html "37.24. element_types")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-foreign-data-wrapper-options.html "37.26. foreign_data_wrapper_options") |
| 37.24. `element_types`                                        |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                                       37.26. `foreign_data_wrapper_options` |
