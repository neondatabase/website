## 37.3. `information_schema_catalog_name` [#](#INFOSCHEMA-INFORMATION-SCHEMA-CATALOG-NAME)

`information_schema_catalog_name` is a table that always contains one row and one column containing the name of the current database (current catalog, in SQL terminology).

**Table 37.1. `information_schema_catalog_name` Columns**

| Column TypeDescription                                                                    |
| ----------------------------------------------------------------------------------------- |
| `catalog_name` `sql_identifier`Name of the database that contains this information schema |