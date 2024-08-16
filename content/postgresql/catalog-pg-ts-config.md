[#id](#CATALOG-PG-TS-CONFIG)

## 53.59. `pg_ts_config` [#](#CATALOG-PG-TS-CONFIG)

The `pg_ts_config` catalog contains entries representing text search configurations. A configuration specifies a particular text search parser and a list of dictionaries to use for each of the parser's output token types. The parser is shown in the `pg_ts_config` entry, but the token-to-dictionary mapping is defined by subsidiary entries in [`pg_ts_config_map`](catalog-pg-ts-config-map).

PostgreSQL's text search features are described at length in [Chapter 12](textsearch).

[#id](#id-1.10.4.61.5)

**Table 53.59. `pg_ts_config` Columns**

| Column TypeDescription                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                               |
| `cfgname` `name`Text search configuration name                                                                                          |
| `cfgnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace).`oid`)The OID of the namespace that contains this configuration |
| `cfgowner` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)Owner of the configuration                                          |
| `cfgparser` `oid` (references [`pg_ts_parser`](catalog-pg-ts-parser).`oid`)The OID of the text search parser for this configuration     |
