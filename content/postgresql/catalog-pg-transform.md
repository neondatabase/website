

|                    53.57. `pg_transform`                   |                                                   |                             |                                                       |                                                      |
| :--------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | ---------------------------------------------------: |
| [Prev](catalog-pg-tablespace.html "53.56. pg_tablespace")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-trigger.html "53.58. pg_trigger") |

***

## 53.57. `pg_transform` [#](#CATALOG-PG-TRANSFORM)

The catalog `pg_transform` stores information about transforms, which are a mechanism to adapt data types to procedural languages. See [CREATE TRANSFORM](sql-createtransform.html "CREATE TRANSFORM") for more information.

**Table 53.57. `pg_transform` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                                                                                                                         |
| `trftype` `oid` (references [`pg_type`](catalog-pg-type.html "53.64. pg_type").`oid`)OID of the data type this transform is for                                                                                                                                                   |
| `trflang` `oid` (references [`pg_language`](catalog-pg-language.html "53.29. pg_language").`oid`)OID of the language this transform is for                                                                                                                                        |
| `trffromsql` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)The OID of the function to use when converting the data type for input to the procedural language (e.g., function parameters). Zero is stored if the default behavior should be used. |
| `trftosql` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)The OID of the function to use when converting output from the procedural language (e.g., return values) to the data type. Zero is stored if the default behavior should be used.       |

***

|                                                            |                                                       |                                                      |
| :--------------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------------: |
| [Prev](catalog-pg-tablespace.html "53.56. pg_tablespace")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-trigger.html "53.58. pg_trigger") |
| 53.56. `pg_tablespace`                                     | [Home](index.html "PostgreSQL 17devel Documentation") |                                  53.58. `pg_trigger` |
