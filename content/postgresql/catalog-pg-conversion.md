[#id](#CATALOG-PG-CONVERSION)

## 53.14. `pg_conversion` [#](#CATALOG-PG-CONVERSION)

The catalog `pg_conversion` describes encoding conversion functions. See [CREATE CONVERSION](sql-createconversion) for more information.

[#id](#id-1.10.4.16.4)

**Table 53.14. `pg_conversion` Columns**

| Column TypeDescription                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `oid` `oid`Row identifier                                                                                                                                    |
| `conname` `name`Conversion name (unique within a namespace)                                                                                                  |
| `connamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace).`oid`)The OID of the namespace that contains this conversion                         |
| `conowner` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)Owner of the conversion                                                                  |
| `conforencoding` `int4`Source encoding ID ([`pg_encoding_to_char()`](functions-info#PG-ENCODING-TO-CHAR) can translate this number to the encoding name)     |
| `contoencoding` `int4`Destination encoding ID ([`pg_encoding_to_char()`](functions-info#PG-ENCODING-TO-CHAR) can translate this number to the encoding name) |
| `conproc` `regproc` (references [`pg_proc`](catalog-pg-proc).`oid`)Conversion function                                                                       |
| `condefault` `bool`True if this is the default conversion                                                                                                    |
