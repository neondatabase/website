## 53.14. `pg_conversion` [#](#CATALOG-PG-CONVERSION)

The catalog `pg_conversion` describes encoding conversion functions. See [CREATE CONVERSION](sql-createconversion.html "CREATE CONVERSION") for more information.

**Table 53.14. `pg_conversion` Columns**

| Column TypeDescription                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                         |
| `conname` `name`Conversion name (unique within a namespace)                                                                                                       |
| `connamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`oid`)The OID of the namespace that contains this conversion   |
| `conowner` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)Owner of the conversion                                                |
| `conforencoding` `int4`Source encoding ID ([`pg_encoding_to_char()`](functions-info.html#PG-ENCODING-TO-CHAR) can translate this number to the encoding name)     |
| `contoencoding` `int4`Destination encoding ID ([`pg_encoding_to_char()`](functions-info.html#PG-ENCODING-TO-CHAR) can translate this number to the encoding name) |
| `conproc` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)Conversion function                                                      |
| `condefault` `bool`True if this is the default conversion                                                                                                         |