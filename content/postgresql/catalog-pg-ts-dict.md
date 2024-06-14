[#id](#CATALOG-PG-TS-DICT)

## 53.61. `pg_ts_dict` [#](#CATALOG-PG-TS-DICT)

The `pg_ts_dict` catalog contains entries defining text search dictionaries. A dictionary depends on a text search template, which specifies all the implementation functions needed; the dictionary itself provides values for the user-settable parameters supported by the template. This division of labor allows dictionaries to be created by unprivileged users. The parameters are specified by a text string `dictinitoption`, whose format and meaning vary depending on the template.

PostgreSQL's text search features are described at length in [Chapter 12](textsearch).

[#id](#id-1.10.4.63.5)

**Table 53.61. `pg_ts_dict` Columns**

| Column TypeDescription                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                 |
| `dictname` `name`Text search dictionary name                                                                                              |
| `dictnamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace).`oid`)The OID of the namespace that contains this dictionary     |
| `dictowner` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)Owner of the dictionary                                              |
| `dicttemplate` `oid` (references [`pg_ts_template`](catalog-pg-ts-template).`oid`)The OID of the text search template for this dictionary |
| `dictinitoption` `text`Initialization option string for the template                                                                      |
