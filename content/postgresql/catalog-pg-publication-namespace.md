<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|               53.41. `pg_publication_namespace`              |                                                   |                             |                                                       |                                                                      |
| :----------------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | -------------------------------------------------------------------: |
| [Prev](catalog-pg-publication.html "53.40. pg_publication")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-publication-rel.html "53.42. pg_publication_rel") |

***

## 53.41. `pg_publication_namespace` [#](#CATALOG-PG-PUBLICATION-NAMESPACE)



The catalog `pg_publication_namespace` contains the mapping between schemas and publications in the database. This is a many-to-many mapping.

**Table 53.41. `pg_publication_namespace` Columns**

| Column TypeDescription                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                          |
| `pnpubid` `oid` (references [`pg_publication`](catalog-pg-publication.html "53.40. pg_publication").`oid`)Reference to publication |
| `pnnspid` `oid` (references [`pg_namespace`](catalog-pg-namespace.html "53.32. pg_namespace").`oid`)Reference to schema            |

***

|                                                              |                                                       |                                                                      |
| :----------------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------------------------: |
| [Prev](catalog-pg-publication.html "53.40. pg_publication")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-publication-rel.html "53.42. pg_publication_rel") |
| 53.40. `pg_publication`                                      | [Home](index.html "PostgreSQL 17devel Documentation") |                                          53.42. `pg_publication_rel` |
