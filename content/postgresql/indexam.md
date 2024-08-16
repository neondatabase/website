[#id](#INDEXAM)

## Chapter 64. Index Access Method Interface Definition

**Table of Contents**

- [64.1. Basic API Structure for Indexes](index-api)
- [64.2. Index Access Method Functions](index-functions)
- [64.3. Index Scanning](index-scanning)
- [64.4. Index Locking Considerations](index-locking)
- [64.5. Index Uniqueness Checks](index-unique-checks)
- [64.6. Index Cost Estimation Functions](index-cost-estimation)

This chapter defines the interface between the core PostgreSQL system and _index access methods_, which manage individual index types. The core system knows nothing about indexes beyond what is specified here, so it is possible to develop entirely new index types by writing add-on code.

All indexes in PostgreSQL are what are known technically as _secondary indexes_; that is, the index is physically separate from the table file that it describes. Each index is stored as its own physical _relation_ and so is described by an entry in the `pg_class` catalog. The contents of an index are entirely under the control of its index access method. In practice, all index access methods divide indexes into standard-size pages so that they can use the regular storage manager and buffer manager to access the index contents. (All the existing index access methods furthermore use the standard page layout described in [Section 73.6](storage-page-layout), and most use the same format for index tuple headers; but these decisions are not forced on an access method.)

An index is effectively a mapping from some data key values to _tuple identifiers_, or TIDs, of row versions (tuples) in the index's parent table. A TID consists of a block number and an item number within that block (see [Section 73.6](storage-page-layout)). This is sufficient information to fetch a particular row version from the table. Indexes are not directly aware that under MVCC, there might be multiple extant versions of the same logical row; to an index, each tuple is an independent object that needs its own index entry. Thus, an update of a row always creates all-new index entries for the row, even if the key values did not change. ([HOT tuples](storage-hot) are an exception to this statement; but indexes do not deal with those, either.) Index entries for dead tuples are reclaimed (by vacuuming) when the dead tuples themselves are reclaimed.
