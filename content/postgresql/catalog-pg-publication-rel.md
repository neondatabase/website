<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                            53.42. `pg_publication_rel`                           |                                                   |                             |                                                       |                                                  |
| :------------------------------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | -----------------------------------------------: |
| [Prev](catalog-pg-publication-namespace.html "53.41. pg_publication_namespace")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-range.html "53.43. pg_range") |

***

## 53.42. `pg_publication_rel` [#](#CATALOG-PG-PUBLICATION-REL)



The catalog `pg_publication_rel` contains the mapping between relations and publications in the database. This is a many-to-many mapping. See also [Section 54.17](view-pg-publication-tables.html "54.17. pg_publication_tables") for a more user-friendly view of this information.

**Table 53.42. `pg_publication_rel` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                                                                                                                                                                                                         |
| `prpubid` `oid` (references [`pg_publication`](catalog-pg-publication.html "53.40. pg_publication").`oid`)Reference to publication                                                                                                                                                                                                                                |
| `prrelid` `oid` (references [`pg_class`](catalog-pg-class.html "53.11. pg_class").`oid`)Reference to relation                                                                                                                                                                                                                                                     |
| `prqual` `pg_node_tree`Expression tree (in `nodeToString()` representation) for the relation's publication qualifying condition. Null if there is no publication qualifying condition.                                                                                                                                                                            |
| `prattrs` `int2vector` (references [`pg_attribute`](catalog-pg-attribute.html "53.7. pg_attribute").`attnum`)This is an array of values that indicates which table columns are part of the publication. For example, a value of `1 3` would mean that the first and the third table columns are published. A null value indicates that all columns are published. |

***

|                                                                                  |                                                       |                                                  |
| :------------------------------------------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------: |
| [Prev](catalog-pg-publication-namespace.html "53.41. pg_publication_namespace")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-range.html "53.43. pg_range") |
| 53.41. `pg_publication_namespace`                                                | [Home](index.html "PostgreSQL 17devel Documentation") |                                53.43. `pg_range` |
