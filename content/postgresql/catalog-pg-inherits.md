<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|               53.27. `pg_inherits`               |                                                   |                             |                                                       |                                                            |
| :----------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | ---------------------------------------------------------: |
| [Prev](catalog-pg-index.html "53.26. pg_index")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-init-privs.html "53.28. pg_init_privs") |

***

## 53.27. `pg_inherits` [#](#CATALOG-PG-INHERITS)

[]()

The catalog `pg_inherits` records information about table and index inheritance hierarchies. There is one entry for each direct parent-child table or index relationship in the database. (Indirect inheritance can be determined by following chains of entries.)

**Table 53.27. `pg_inherits` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `inhrelid` `oid` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)The OID of the child table or index                                                                                                                                                                                       |
| `inhparent` `oid` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)The OID of the parent table or index                                                                                                                                                                                     |
| `inhseqno` `int4`If there is more than one direct parent for a child table (multiple inheritance), this number tells the order in which the inherited columns are to be arranged. The count starts at 1.Indexes cannot have multiple inheritance, since they can only inherit when using declarative partitioning. |
| `inhdetachpending` `bool``true` for a partition that is in the process of being detached; `false` otherwise.                                                                                                                                                                                                       |

***

|                                                  |                                                       |                                                            |
| :----------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------------------: |
| [Prev](catalog-pg-index.html "53.26. pg_index")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-init-privs.html "53.28. pg_init_privs") |
| 53.26. `pg_index`                                | [Home](index.html "PostgreSQL 17devel Documentation") |                                     53.28. `pg_init_privs` |
