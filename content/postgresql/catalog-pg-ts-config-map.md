[#id](#CATALOG-PG-TS-CONFIG-MAP)

## 53.60. `pg_ts_config_map` [#](#CATALOG-PG-TS-CONFIG-MAP)

The `pg_ts_config_map` catalog contains entries showing which text search dictionaries should be consulted, and in what order, for each output token type of each text search configuration's parser.

PostgreSQL's text search features are described at length in [Chapter 12](textsearch).

[#id](#id-1.10.4.62.5)

**Table 53.60. `pg_ts_config_map` Columns**

| Column TypeDescription                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mapcfg` `oid` (references [`pg_ts_config`](catalog-pg-ts-config).`oid`)The OID of the [`pg_ts_config`](catalog-pg-ts-config) entry owning this map entry |
| `maptokentype` `int4`A token type emitted by the configuration's parser                                                                                   |
| `mapseqno` `int4`Order in which to consult this entry (lower `mapseqno`s first)                                                                           |
| `mapdict` `oid` (references [`pg_ts_dict`](catalog-pg-ts-dict).`oid`)The OID of the text search dictionary to consult                                     |
