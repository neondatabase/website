<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                                        37.5. `applicable_roles`                                       |                                                                    |                                    |                                                       |                                                        |
| :---------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | -----------------------------------------------------: |
| [Prev](infoschema-administrable-role-authorizations.html "37.4. administrable_role_​authorizations")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-attributes.html "37.6. attributes") |

***

## 37.5. `applicable_roles` [#](#INFOSCHEMA-APPLICABLE-ROLES)

The view `applicable_roles` identifies all roles whose privileges the current user can use. This means there is some chain of role grants from the current user to the role in question. The current user itself is also an applicable role. The set of applicable roles is generally used for permission checking.[]()[]()

**Table 37.3. `applicable_roles` Columns**

| Column TypeDescription                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `grantee` `sql_identifier`Name of the role to which this role membership was granted (can be the current user, or a different role in case of nested role memberships) |
| `role_name` `sql_identifier`Name of a role                                                                                                                             |
| `is_grantable` `yes_or_no``YES` if the grantee has the admin option on the role, `NO` if not                                                                           |

***

|                                                                                                       |                                                                    |                                                        |
| :---------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------: | -----------------------------------------------------: |
| [Prev](infoschema-administrable-role-authorizations.html "37.4. administrable_role_​authorizations")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-attributes.html "37.6. attributes") |
| 37.4. `administrable_role_​authorizations`                                                            |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                     37.6. `attributes` |
