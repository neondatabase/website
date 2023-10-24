<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                         37.21. `domain_constraints`                         |                                                                    |                                    |                                                       |                                                                     |
| :-------------------------------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](infoschema-data-type-privileges.html "37.20. data_type_privileges")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-domain-udt-usage.html "37.22. domain_udt_usage") |

***

## 37.21. `domain_constraints` [#](#INFOSCHEMA-DOMAIN-CONSTRAINTS)

The view `domain_constraints` contains all constraints belonging to domains defined in the current database. Only those domains are shown that the current user has access to (by way of being the owner or having some privilege).

**Table 37.19. `domain_constraints` Columns**

| Column TypeDescription                                                                                               |
| -------------------------------------------------------------------------------------------------------------------- |
| `constraint_catalog` `sql_identifier`Name of the database that contains the constraint (always the current database) |
| `constraint_schema` `sql_identifier`Name of the schema that contains the constraint                                  |
| `constraint_name` `sql_identifier`Name of the constraint                                                             |
| `domain_catalog` `sql_identifier`Name of the database that contains the domain (always the current database)         |
| `domain_schema` `sql_identifier`Name of the schema that contains the domain                                          |
| `domain_name` `sql_identifier`Name of the domain                                                                     |
| `is_deferrable` `yes_or_no``YES` if the constraint is deferrable, `NO` if not                                        |
| `initially_deferred` `yes_or_no``YES` if the constraint is deferrable and initially deferred, `NO` if not            |

***

|                                                                             |                                                                    |                                                                     |
| :-------------------------------------------------------------------------- | :----------------------------------------------------------------: | ------------------------------------------------------------------: |
| [Prev](infoschema-data-type-privileges.html "37.20. data_type_privileges")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-domain-udt-usage.html "37.22. domain_udt_usage") |
| 37.20. `data_type_privileges`                                               |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                           37.22. `domain_udt_usage` |
