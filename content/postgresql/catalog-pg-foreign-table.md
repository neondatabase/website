[#id](#CATALOG-PG-FOREIGN-TABLE)

## 53.25. `pg_foreign_table` [#](#CATALOG-PG-FOREIGN-TABLE)

The catalog `pg_foreign_table` contains auxiliary information about foreign tables. A foreign table is primarily represented by a [`pg_class`](catalog-pg-class) entry, just like a regular table. Its `pg_foreign_table` entry contains the information that is pertinent only to foreign tables and not any other kind of relation.

[#id](#id-1.10.4.27.4)

**Table 53.25. `pg_foreign_table` Columns**

| Column TypeDescription                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------- |
| `ftrelid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)The OID of the [`pg_class`](catalog-pg-class) entry for this foreign table |
| `ftserver` `oid` (references [`pg_foreign_server`](catalog-pg-foreign-server).`oid`)OID of the foreign server for this foreign table        |
| `ftoptions` `text[]`Foreign table options, as “keyword=value” strings                                                                       |
