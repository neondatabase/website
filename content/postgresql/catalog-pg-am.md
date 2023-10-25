<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                      53.3. `pg_am`                      |                                                   |                             |                                                       |                                               |
| :-----------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | --------------------------------------------: |
| [Prev](catalog-pg-aggregate.html "53.2. pg_aggregate")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-amop.html "53.4. pg_amop") |

***

## 53.3. `pg_am` [#](#CATALOG-PG-AM)

The catalog `pg_am` stores information about relation access methods. There is one row for each access method supported by the system. Currently, only tables and indexes have access methods. The requirements for table and index access methods are discussed in detail in [Chapter 63](tableam.html "Chapter 63. Table Access Method Interface Definition") and [Chapter 64](indexam.html "Chapter 64. Index Access Method Interface Definition") respectively.

**Table 53.3. `pg_am` Columns**

| Column TypeDescription                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `oid` `oid`Row identifier                                                                                                                                                                  |
| `amname` `name`Name of the access method                                                                                                                                                   |
| `amhandler` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)OID of a handler function that is responsible for supplying information about the access method |
| `amtype` `char``t` = table (including materialized views), `i` = index.                                                                                                                    |

\

### Note

Before PostgreSQL 9.6, `pg_am` contained many additional columns representing properties of index access methods. That data is now only directly visible at the C code level. However, `pg_index_column_has_property()` and related functions have been added to allow SQL queries to inspect index access method properties; see [Table 9.72](functions-info.html#FUNCTIONS-INFO-CATALOG-TABLE "Table 9.72. System Catalog Information Functions").

***

|                                                         |                                                       |                                               |
| :------------------------------------------------------ | :---------------------------------------------------: | --------------------------------------------: |
| [Prev](catalog-pg-aggregate.html "53.2. pg_aggregate")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-amop.html "53.4. pg_amop") |
| 53.2. `pg_aggregate`                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                               53.4. `pg_amop` |
