<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|        37.3. `information_schema_catalog_name`        |                                                                    |                                    |                                                       |                                                                                                       |
| :---------------------------------------------------: | :----------------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------------------------------------------: |
| [Prev](infoschema-datatypes.html "37.2. Data Types")  | [Up](information-schema.html "Chapter 37. The Information Schema") | Chapter 37. The Information Schema | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](infoschema-administrable-role-authorizations.html "37.4. administrable_role_​authorizations") |

***

## 37.3. `information_schema_catalog_name` [#](#INFOSCHEMA-INFORMATION-SCHEMA-CATALOG-NAME)

`information_schema_catalog_name` is a table that always contains one row and one column containing the name of the current database (current catalog, in SQL terminology).

**Table 37.1. `information_schema_catalog_name` Columns**

| Column TypeDescription                                                                    |
| ----------------------------------------------------------------------------------------- |
| `catalog_name` `sql_identifier`Name of the database that contains this information schema |

***

|                                                       |                                                                    |                                                                                                       |
| :---------------------------------------------------- | :----------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------: |
| [Prev](infoschema-datatypes.html "37.2. Data Types")  | [Up](information-schema.html "Chapter 37. The Information Schema") |  [Next](infoschema-administrable-role-authorizations.html "37.4. administrable_role_​authorizations") |
| 37.2. Data Types                                      |        [Home](index.html "PostgreSQL 17devel Documentation")       |                                                            37.4. `administrable_role_​authorizations` |
