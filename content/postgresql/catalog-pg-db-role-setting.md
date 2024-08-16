[#id](#CATALOG-PG-DB-ROLE-SETTING)

## 53.16. `pg_db_role_setting` [#](#CATALOG-PG-DB-ROLE-SETTING)

The catalog `pg_db_role_setting` records the default values that have been set for run-time configuration variables, for each role and database combination.

Unlike most system catalogs, `pg_db_role_setting` is shared across all databases of a cluster: there is only one copy of `pg_db_role_setting` per cluster, not one per database.

[#id](#id-1.10.4.18.5)

**Table 53.16. `pg_db_role_setting` Columns**

| Column TypeDescription                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setdatabase` `oid` (references [`pg_database`](catalog-pg-database).`oid`)The OID of the database the setting is applicable to, or zero if not database-specific |
| `setrole` `oid` (references [`pg_authid`](catalog-pg-authid).`oid`)The OID of the role the setting is applicable to, or zero if not role-specific                 |
| `setconfig` `text[]`Defaults for run-time configuration variables                                                                                                 |
