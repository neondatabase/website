[#id](#CATALOG-PG-TRANSFORM)

## 53.57. `pg_transform` [#](#CATALOG-PG-TRANSFORM)

The catalog `pg_transform` stores information about transforms, which are a mechanism to adapt data types to procedural languages. See [CREATE TRANSFORM](sql-createtransform) for more information.

[#id](#id-1.10.4.59.4)

**Table 53.57. `pg_transform` Columns**

| Column TypeDescription                                                                                                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                                                                                                   |
| `trftype` `oid` (references [`pg_type`](catalog-pg-type).`oid`)OID of the data type this transform is for                                                                                                                                                   |
| `trflang` `oid` (references [`pg_language`](catalog-pg-language).`oid`)OID of the language this transform is for                                                                                                                                            |
| `trffromsql` `regproc` (references [`pg_proc`](catalog-pg-proc).`oid`)The OID of the function to use when converting the data type for input to the procedural language (e.g., function parameters). Zero is stored if the default behavior should be used. |
| `trftosql` `regproc` (references [`pg_proc`](catalog-pg-proc).`oid`)The OID of the function to use when converting output from the procedural language (e.g., return values) to the data type. Zero is stored if the default behavior should be used.       |
