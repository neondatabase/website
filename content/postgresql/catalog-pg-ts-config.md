## 53.59. `pg_ts_config` [#](#CATALOG-PG-TS-CONFIG)

The `pg_ts_config` catalog contains entries representing text search configurations. A configuration specifies a particular text search parser and a list of dictionaries to use for each of the parser's output token types. The parser is shown in the `pg_ts_config` entry, but the token-to-dictionary mapping is defined by subsidiary entries in [`pg_ts_config_map`](catalog-pg-ts-config-map.html "53.60. pg_ts_config_map").

PostgreSQL's text search features are described at length in [Chapter 12](textsearch.html "Chapter 12. Full Text Search").

**Table 53.59. `pg_ts_config` Columns**

| Column TypeDescription                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `oid` `oid`Row identifier                                                                                                                                          |
| `cfgname` `name`Text search configuration name                                                                                                                     |
| `cfgnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`oid`)The OID of the namespace that contains this configuration |
| `cfgowner` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)Owner of the configuration                                              |
| `cfgparser` `oid` (references [`pg_ts_parser`](catalog-pg-ts-parser.html "53.62. pg_ts_parser").`oid`)The OID of the text search parser for this configuration     |