<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                  53.63. `pg_ts_template`                 |                                                   |                             |                                                       |                                                |
| :------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | ---------------------------------------------: |
| [Prev](catalog-pg-ts-parser.html "53.62. pg_ts_parser")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-type.html "53.64. pg_type") |

***

## 53.63. `pg_ts_template` [#](#CATALOG-PG-TS-TEMPLATE)



The `pg_ts_template` catalog contains entries defining text search templates. A template is the implementation skeleton for a class of text search dictionaries. Since a template must be implemented by C-language-level functions, creation of new templates is restricted to database superusers.

PostgreSQL's text search features are described at length in [Chapter 12](textsearch.html "Chapter 12. Full Text Search").

**Table 53.63. `pg_ts_template` Columns**

| Column TypeDescription                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                      |
| `tmplname` `name`Text search template name                                                                                                                     |
| `tmplnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`oid`)The OID of the namespace that contains this template |
| `tmplinit` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)OID of the template's initialization function (zero if none)         |
| `tmpllexize` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)OID of the template's lexize function                              |

***

|                                                          |                                                       |                                                |
| :------------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------: |
| [Prev](catalog-pg-ts-parser.html "53.62. pg_ts_parser")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-type.html "53.64. pg_type") |
| 53.62. `pg_ts_parser`                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                               53.64. `pg_type` |
