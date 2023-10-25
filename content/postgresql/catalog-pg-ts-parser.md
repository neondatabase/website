<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 53.62. `pg_ts_parser`                |                                                   |                             |                                                       |                                                              |
| :--------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | -----------------------------------------------------------: |
| [Prev](catalog-pg-ts-dict.html "53.61. pg_ts_dict")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-ts-template.html "53.63. pg_ts_template") |

***

## 53.62. `pg_ts_parser` [#](#CATALOG-PG-TS-PARSER)



The `pg_ts_parser` catalog contains entries defining text search parsers. A parser is responsible for splitting input text into lexemes and assigning a token type to each lexeme. Since a parser must be implemented by C-language-level functions, creation of new parsers is restricted to database superusers.

PostgreSQL's text search features are described at length in [Chapter 12](textsearch.html "Chapter 12. Full Text Search").

**Table 53.62. `pg_ts_parser` Columns**

| Column TypeDescription                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                   |
| `prsname` `name`Text search parser name                                                                                                                     |
| `prsnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`oid`)The OID of the namespace that contains this parser |
| `prsstart` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)OID of the parser's startup function                              |
| `prstoken` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)OID of the parser's next-token function                           |
| `prsend` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)OID of the parser's shutdown function                               |
| `prsheadline` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)OID of the parser's headline function (zero if none)           |
| `prslextype` `regproc` (references [`pg_proc`](catalog-pg-proc.html "53.39. pg_proc").`oid`)OID of the parser's lextype function                            |

***

|                                                      |                                                       |                                                              |
| :--------------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------------------: |
| [Prev](catalog-pg-ts-dict.html "53.61. pg_ts_dict")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-ts-template.html "53.63. pg_ts_template") |
| 53.61. `pg_ts_dict`                                  | [Home](index.html "PostgreSQL 17devel Documentation") |                                      53.63. `pg_ts_template` |
