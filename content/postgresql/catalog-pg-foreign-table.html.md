<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                      53.25. `pg_foreign_table`                     |                                                   |                             |                                                       |                                                  |
| :----------------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | -----------------------------------------------: |
| [Prev](catalog-pg-foreign-server.html "53.24. pg_foreign_server")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-index.html "53.26. pg_index") |

***

## 53.25. `pg_foreign_table` [#](#CATALOG-PG-FOREIGN-TABLE)

The catalog `pg_foreign_table` contains auxiliary information about foreign tables. A foreign table is primarily represented by a [`pg_class`](catalog-pg-class.html "53.11. pg_class") entry, just like a regular table. Its `pg_foreign_table` entry contains the information that is pertinent only to foreign tables and not any other kind of relation.

**Table 53.25. `pg_foreign_table` Columns**

| Column TypeDescription                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ftrelid` `oid` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)The OID of the [`pg_class`](catalog-pg-class.html "53.11. pg_class") entry for this foreign table |
| `ftserver` `oid` (references [`pg_foreign_server`](catalog-pg-foreign-server.html "53.24. pg_foreign_server").`oid`)OID of the foreign server for this foreign table                      |
| `ftoptions` `text[]`Foreign table options, as “keyword=value” strings                                                                                                                     |

***

|                                                                    |                                                       |                                                  |
| :----------------------------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------: |
| [Prev](catalog-pg-foreign-server.html "53.24. pg_foreign_server")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-index.html "53.26. pg_index") |
| 53.24. `pg_foreign_server`                                         | [Home](index.html "PostgreSQL 17devel Documentation") |                                53.26. `pg_index` |
