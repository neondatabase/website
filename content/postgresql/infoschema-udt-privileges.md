

|               37.58. `udt_privileges`               |                                                                    |                                    |                                                       |                                                                     |
| :-------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](infoschema-triggers.html "37.57. triggers")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-usage-privileges.html "37.59. usage_privileges") |

***

## 37.58. `udt_privileges` [#](#INFOSCHEMA-UDT-PRIVILEGES)

The view `udt_privileges` identifies `USAGE` privileges granted on user-defined types to a currently enabled role or by a currently enabled role. There is one row for each combination of type, grantor, and grantee. This view shows only composite types (see under [Section 37.60](infoschema-user-defined-types.html "37.60. user_defined_types") for why); see [Section 37.59](infoschema-usage-privileges.html "37.59. usage_privileges") for domain privileges.

**Table 37.56. `udt_privileges` Columns**

| Column TypeDescription                                                                               |
| ---------------------------------------------------------------------------------------------------- |
| `grantor` `sql_identifier`Name of the role that granted the privilege                                |
| `grantee` `sql_identifier`Name of the role that the privilege was granted to                         |
| `udt_catalog` `sql_identifier`Name of the database containing the type (always the current database) |
| `udt_schema` `sql_identifier`Name of the schema containing the type                                  |
| `udt_name` `sql_identifier`Name of the type                                                          |
| `privilege_type` `character_data`Always `TYPE USAGE`                                                 |
| `is_grantable` `yes_or_no``YES` if the privilege is grantable, `NO` if not                           |

***

|                                                     |                                                                    |                                                                     |
| :-------------------------------------------------- | :----------------------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](infoschema-triggers.html "37.57. triggers")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-usage-privileges.html "37.59. usage_privileges") |
| 37.57. `triggers`                                   |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                           37.59. `usage_privileges` |
