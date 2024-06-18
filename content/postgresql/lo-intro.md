[#id](#LO-INTRO)

## 35.1. Introduction [#](#LO-INTRO)

All large objects are stored in a single system table named [`pg_largeobject`](catalog-pg-largeobject). Each large object also has an entry in the system table [`pg_largeobject_metadata`](catalog-pg-largeobject-metadata). Large objects can be created, modified, and deleted using a read/write API that is similar to standard operations on files.

PostgreSQL also supports a storage system called [“TOAST”](storage-toast), which automatically stores values larger than a single database page into a secondary storage area per table. This makes the large object facility partially obsolete. One remaining advantage of the large object facility is that it allows values up to 4 TB in size, whereas TOASTed fields can be at most 1 GB. Also, reading and updating portions of a large object can be done efficiently, while most operations on a TOASTed field will read or write the whole value as a unit.
