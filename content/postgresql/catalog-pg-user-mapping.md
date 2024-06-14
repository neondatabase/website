[#id](#CATALOG-PG-USER-MAPPING)

## 53.65. `pg_user_mapping` [#](#CATALOG-PG-USER-MAPPING)

The catalog `pg_user_mapping` stores the mappings from local user to remote. Access to this catalog is restricted from normal users, use the view [`pg_user_mappings`](view-pg-user-mappings) instead.

[#id](#id-1.10.4.67.4)

**Table 53.66. `pg_user_mapping` Columns**

| Column TypeDescription                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                    |
| `umuser` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)OID of the local role being mapped, or zero if the user mapping is public  |
| `umserver` `oid` (references [`pg_foreign_server`](catalog-pg-foreign-server).`oid`)The OID of the foreign server that contains this mapping |
| `umoptions` `text[]`User mapping specific options, as “keyword=value” strings                                                                |
