

|                            37.4. `administrable_role_​authorizations`                            |                                                                    |                                    |                                                       |                                                                    |
| :----------------------------------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------: |
| [Prev](infoschema-information-schema-catalog-name.html "37.3. information_schema_catalog_name")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-applicable-roles.html "37.5. applicable_roles") |

***

## 37.4. `administrable_role_​authorizations` [#](#INFOSCHEMA-ADMINISTRABLE-ROLE-AUTHORIZATIONS)

The view `administrable_role_authorizations` identifies all roles that the current user has the admin option for.

**Table 37.2. `administrable_role_authorizations` Columns**

| Column TypeDescription                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `grantee` `sql_identifier`Name of the role to which this role membership was granted (can be the current user, or a different role in case of nested role memberships) |
| `role_name` `sql_identifier`Name of a role                                                                                                                             |
| `is_grantable` `yes_or_no`Always `YES`                                                                                                                                 |

***

|                                                                                                  |                                                                    |                                                                    |
| :----------------------------------------------------------------------------------------------- | :----------------------------------------------------------------: | -----------------------------------------------------------------: |
| [Prev](infoschema-information-schema-catalog-name.html "37.3. information_schema_catalog_name")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-applicable-roles.html "37.5. applicable_roles") |
| 37.3. `information_schema_catalog_name`                                                          |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                           37.5. `applicable_roles` |
