<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                        53.61. `pg_ts_dict`                       |                                                   |                             |                                                       |                                                          |
| :--------------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | -------------------------------------------------------: |
| [Prev](catalog-pg-ts-config-map.html "53.60. pg_ts_config_map")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-ts-parser.html "53.62. pg_ts_parser") |

***

## 53.61. `pg_ts_dict` [#](#CATALOG-PG-TS-DICT)

The `pg_ts_dict` catalog contains entries defining text search dictionaries. A dictionary depends on a text search template, which specifies all the implementation functions needed; the dictionary itself provides values for the user-settable parameters supported by the template. This division of labor allows dictionaries to be created by unprivileged users. The parameters are specified by a text string `dictinitoption`, whose format and meaning vary depending on the template.

PostgreSQL's text search features are described at length in [Chapter 12](textsearch.html "Chapter 12. Full Text Search").

**Table 53.61. `pg_ts_dict` Columns**

| Column TypeDescription                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                              |
| `dictname` `name`Text search dictionary name                                                                                                                           |
| `dictnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`oid`)The OID of the namespace that contains this dictionary       |
| `dictowner` `oid` (references [`pg_authid`](catalog-pg-authid.html "53.8. pg_authid").`oid`)Owner of the dictionary                                                    |
| `dicttemplate` `oid` (references [`pg_ts_template`](catalog-pg-ts-template.html "53.63. pg_ts_template").`oid`)The OID of the text search template for this dictionary |
| `dictinitoption` `text`Initialization option string for the template                                                                                                   |

***

|                                                                  |                                                       |                                                          |
| :--------------------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------------: |
| [Prev](catalog-pg-ts-config-map.html "53.60. pg_ts_config_map")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-ts-parser.html "53.62. pg_ts_parser") |
| 53.60. `pg_ts_config_map`                                        | [Home](index.html "PostgreSQL 17devel Documentation") |                                    53.62. `pg_ts_parser` |
