

|                           53.43. `pg_range`                          |                                                   |                             |                                                       |                                                                            |
| :------------------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | -------------------------------------------------------------------------: |
| [Prev](catalog-pg-publication-rel.html "53.42. pg_publication_rel")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-replication-origin.html "53.44. pg_replication_origin") |

***

## 53.43. `pg_range` [#](#CATALOG-PG-RANGE)

The catalog `pg_range` stores information about range types. This is in addition to the types' entries in [`pg_type`](catalog-pg-type.html "53.64. pg_type").

**Table 53.43. `pg_range` Columns**

| Column TypeDescription                                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rngtypid` `oid` (references [`pg_type`](catalog-pg-type.html "53.64. pg_type").`oid`)OID of the range type                                                                                                |
| `rngsubtype` `oid` (references [`pg_type`](catalog-pg-type.html "53.64. pg_type").`oid`)OID of the element type (subtype) of this range type                                                               |
| `rngmultitypid` `oid` (references [`pg_type`](catalog-pg-type.html "53.64. pg_type").`oid`)OID of the multirange type for this range type                                                                  |
| `rngcollation` `oid` (references [`pg_collation`](catalog-pg-collation.html "53.12. pg_collation").`oid`)OID of the collation used for range comparisons, or zero if none                                  |
| `rngsubopc` `oid` (references [`pg_opclass`](catalog-pg-opclass.html "53.33. pg_opclass").`oid`)OID of the subtype's operator class used for range comparisons                                             |
| `rngcanonical` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)OID of the function to convert a range value into canonical form, or zero if none                            |
| `rngsubdiff` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)OID of the function to return the difference between two element values as `double precision`, or zero if none |

\

`rngsubopc` (plus `rngcollation`, if the element type is collatable) determines the sort ordering used by the range type. `rngcanonical` is used when the element type is discrete. `rngsubdiff` is optional but should be supplied to improve performance of GiST indexes on the range type.

***

|                                                                      |                                                       |                                                                            |
| :------------------------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------------------------------: |
| [Prev](catalog-pg-publication-rel.html "53.42. pg_publication_rel")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-replication-origin.html "53.44. pg_replication_origin") |
| 53.42. `pg_publication_rel`                                          | [Home](index.html "PostgreSQL 17devel Documentation") |                                             53.44. `pg_replication_origin` |
