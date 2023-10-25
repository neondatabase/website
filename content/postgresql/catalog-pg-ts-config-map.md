<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 53.60. `pg_ts_config_map`                |                                                   |                             |                                                       |                                                      |
| :------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | ---------------------------------------------------: |
| [Prev](catalog-pg-ts-config.html "53.59. pg_ts_config")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-ts-dict.html "53.61. pg_ts_dict") |

***

## 53.60. `pg_ts_config_map` [#](#CATALOG-PG-TS-CONFIG-MAP)



The `pg_ts_config_map` catalog contains entries showing which text search dictionaries should be consulted, and in what order, for each output token type of each text search configuration's parser.

PostgreSQL's text search features are described at length in [Chapter 12](textsearch.html "Chapter 12. Full Text Search").

**Table 53.60. `pg_ts_config_map` Columns**

| Column TypeDescription                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mapcfg` `oid` (references [`pg_ts_config`](catalog-pg-ts-config.html "53.59. pg_ts_config").`oid`)The OID of the [`pg_ts_config`](catalog-pg-ts-config.html "53.59. pg_ts_config") entry owning this map entry |
| `maptokentype` `int4`A token type emitted by the configuration's parser                                                                                                                                         |
| `mapseqno` `int4`Order in which to consult this entry (lower `mapseqno`s first)                                                                                                                                 |
| `mapdict` `oid` (references [`pg_ts_dict`](catalog-pg-ts-dict.html "53.61. pg_ts_dict").`oid`)The OID of the text search dictionary to consult                                                                  |

***

|                                                          |                                                       |                                                      |
| :------------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------------: |
| [Prev](catalog-pg-ts-config.html "53.59. pg_ts_config")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-ts-dict.html "53.61. pg_ts_dict") |
| 53.59. `pg_ts_config`                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                                  53.61. `pg_ts_dict` |
