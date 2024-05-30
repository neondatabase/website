[#id](#INFOSCHEMA-ENABLED-ROLES)

## 37.25. `enabled_roles` [#](#INFOSCHEMA-ENABLED-ROLES)

The view `enabled_roles` identifies the currently “enabled roles”. The enabled roles are recursively defined as the current user together with all roles that have been granted to the enabled roles with automatic inheritance. In other words, these are all roles that the current user has direct or indirect, automatically inheriting membership in.

For permission checking, the set of “applicable roles” is applied, which can be broader than the set of enabled roles. So generally, it is better to use the view `applicable_roles` instead of this one; See [Section 37.5](infoschema-applicable-roles) for details on `applicable_roles` view.

[#id](#id-1.7.6.29.4)

**Table 37.23. `enabled_roles` Columns**

| Column TypeDescription                     |
| ------------------------------------------ |
| `role_name` `sql_identifier`Name of a role |
