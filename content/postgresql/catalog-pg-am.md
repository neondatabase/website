[#id](#CATALOG-PG-AM)

## 53.3. `pg_am` [#](#CATALOG-PG-AM)

The catalog `pg_am` stores information about relation access methods. There is one row for each access method supported by the system. Currently, only tables and indexes have access methods. The requirements for table and index access methods are discussed in detail in [Chapter 63](tableam) and [Chapter 64](indexam) respectively.

[#id](#id-1.10.4.5.4)

**Table 53.3. `pg_am` Columns**

| Column TypeDescription                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                            |
| `amname` `name`Name of the access method                                                                                                                             |
| `amhandler` `regproc` (references [`pg_proc`](catalog-pg-proc).`oid`)OID of a handler function that is responsible for supplying information about the access method |
| `amtype` `char``t` = table (including materialized views), `i` = index.                                                                                              |

### Note

Before PostgreSQL 9.6, `pg_am` contained many additional columns representing properties of index access methods. That data is now only directly visible at the C code level. However, `pg_index_column_has_property()` and related functions have been added to allow SQL queries to inspect index access method properties; see [Table 9.72](functions-info#FUNCTIONS-INFO-CATALOG-TABLE).
