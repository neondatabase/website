[#id](#INFOSCHEMA-ADMINISTRABLE-ROLE-AUTHORIZATIONS)

## 37.4. `administrable_role_​authorizations` [#](#INFOSCHEMA-ADMINISTRABLE-ROLE-AUTHORIZATIONS)

The view `administrable_role_authorizations` identifies all roles that the current user has the admin option for.

[#id](#id-1.7.6.8.3)

**Table 37.2. `administrable_role_authorizations` Columns**

| Column TypeDescription                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `grantee` `sql_identifier`Name of the role to which this role membership was granted (can be the current user, or a different role in case of nested role memberships) |
| `role_name` `sql_identifier`Name of a role                                                                                                                             |
| `is_grantable` `yes_or_no`Always `YES`                                                                                                                                 |
