[#id](#CATALOG-PG-TS-PARSER)

## 53.62. `pg_ts_parser` [#](#CATALOG-PG-TS-PARSER)

The `pg_ts_parser` catalog contains entries defining text search parsers. A parser is responsible for splitting input text into lexemes and assigning a token type to each lexeme. Since a parser must be implemented by C-language-level functions, creation of new parsers is restricted to database superusers.

PostgreSQL's text search features are described at length in [Chapter 12](textsearch).

[#id](#id-1.10.4.64.5)

**Table 53.62. `pg_ts_parser` Columns**

| Column TypeDescription                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                        |
| `prsname` `name`Text search parser name                                                                                          |
| `prsnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace).`oid`)The OID of the namespace that contains this parser |
| `prsstart` `regproc` (references [`pg_proc`](catalog-pg-proc).`oid`)OID of the parser's startup function                         |
| `prstoken` `regproc` (references [`pg_proc`](catalog-pg-proc).`oid`)OID of the parser's next-token function                      |
| `prsend` `regproc` (references [`pg_proc`](catalog-pg-proc).`oid`)OID of the parser's shutdown function                          |
| `prsheadline` `regproc` (references [`pg_proc`](catalog-pg-proc).`oid`)OID of the parser's headline function (zero if none)      |
| `prslextype` `regproc` (references [`pg_proc`](catalog-pg-proc).`oid`)OID of the parser's lextype function                       |
