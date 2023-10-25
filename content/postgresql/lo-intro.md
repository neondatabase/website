

|                   35.1. Introduction                   |                                                     |                           |                                                       |                                                                 |
| :----------------------------------------------------: | :-------------------------------------------------- | :-----------------------: | ----------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](largeobjects.html "Chapter 35. Large Objects")  | [Up](largeobjects.html "Chapter 35. Large Objects") | Chapter 35. Large Objects | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](lo-implementation.html "35.2. Implementation Features") |

***

## 35.1. Introduction [#](#LO-INTRO)

All large objects are stored in a single system table named [`pg_largeobject`](catalog-pg-largeobject.html "53.30. pg_largeobject"). Each large object also has an entry in the system table [`pg_largeobject_metadata`](catalog-pg-largeobject-metadata.html "53.31. pg_largeobject_metadata"). Large objects can be created, modified, and deleted using a read/write API that is similar to standard operations on files.

PostgreSQL also supports a storage system called [“TOAST”](storage-toast.html "73.2. TOAST"), which automatically stores values larger than a single database page into a secondary storage area per table. This makes the large object facility partially obsolete. One remaining advantage of the large object facility is that it allows values up to 4 TB in size, whereas TOASTed fields can be at most 1 GB. Also, reading and updating portions of a large object can be done efficiently, while most operations on a TOASTed field will read or write the whole value as a unit.

***

|                                                        |                                                       |                                                                 |
| :----------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](largeobjects.html "Chapter 35. Large Objects")  |  [Up](largeobjects.html "Chapter 35. Large Objects")  |  [Next](lo-implementation.html "35.2. Implementation Features") |
| Chapter 35. Large Objects                              | [Home](index.html "PostgreSQL 17devel Documentation") |                                   35.2. Implementation Features |
