<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 53.30. `pg_largeobject`                |                                                   |                             |                                                       |                                                                                |
| :----------------------------------------------------: | :------------------------------------------------ | :-------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------------------: |
| [Prev](catalog-pg-language.html "53.29. pg_language")  | [Up](catalogs.html "Chapter 53. System Catalogs") | Chapter 53. System Catalogs | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](catalog-pg-largeobject-metadata.html "53.31. pg_largeobject_metadata") |

***

## 53.30. `pg_largeobject` [#](#CATALOG-PG-LARGEOBJECT)

[]()

The catalog `pg_largeobject` holds the data making up “large objects”. A large object is identified by an OID assigned when it is created. Each large object is broken into segments or “pages” small enough to be conveniently stored as rows in `pg_largeobject`. The amount of data per page is defined to be `LOBLKSIZE` (which is currently `BLCKSZ/4`, or typically 2 kB).

Prior to PostgreSQL 9.0, there was no permission structure associated with large objects. As a result, `pg_largeobject` was publicly readable and could be used to obtain the OIDs (and contents) of all large objects in the system. This is no longer the case; use [`pg_largeobject_metadata`](catalog-pg-largeobject-metadata.html "53.31. pg_largeobject_metadata") to obtain a list of large object OIDs.

**Table 53.30. `pg_largeobject` Columns**

| Column TypeDescription                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loid` `oid` (references [`pg_largeobject_metadata`](catalog-pg-largeobject-metadata.html "53.31. pg_largeobject_metadata").`oid`)Identifier of the large object that includes this page |
| `pageno` `int4`Page number of this page within its large object (counting from zero)                                                                                                     |
| `data` `bytea`Actual data stored in the large object. This will never be more than `LOBLKSIZE` bytes and might be less.                                                                  |

\


Each row of `pg_largeobject` holds data for one page of a large object, beginning at byte offset (`pageno * LOBLKSIZE`) within the object. The implementation allows sparse storage: pages might be missing, and might be shorter than `LOBLKSIZE` bytes even if they are not the last page of the object. Missing regions within a large object read as zeroes.

***

|                                                        |                                                       |                                                                                |
| :----------------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------------------------------------: |
| [Prev](catalog-pg-language.html "53.29. pg_language")  |   [Up](catalogs.html "Chapter 53. System Catalogs")   |  [Next](catalog-pg-largeobject-metadata.html "53.31. pg_largeobject_metadata") |
| 53.29. `pg_language`                                   | [Home](index.html "PostgreSQL 17devel Documentation") |                                               53.31. `pg_largeobject_metadata` |
