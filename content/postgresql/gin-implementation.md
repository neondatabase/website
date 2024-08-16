[#id](#GIN-IMPLEMENTATION)

## 70.4. Implementation [#](#GIN-IMPLEMENTATION)

- [70.4.1. GIN Fast Update Technique](gin-implementation#GIN-FAST-UPDATE)
- [70.4.2. Partial Match Algorithm](gin-implementation#GIN-PARTIAL-MATCH)

Internally, a GIN index contains a B-tree index constructed over keys, where each key is an element of one or more indexed items (a member of an array, for example) and where each tuple in a leaf page contains either a pointer to a B-tree of heap pointers (a “posting tree”), or a simple list of heap pointers (a “posting list”) when the list is small enough to fit into a single index tuple along with the key value. [Figure 70.1](gin-implementation#GIN-INTERNALS-FIGURE) illustrates these components of a GIN index.

As of PostgreSQL 9.1, null key values can be included in the index. Also, placeholder nulls are included in the index for indexed items that are null or contain no keys according to `extractValue`. This allows searches that should find empty items to do so.

Multicolumn GIN indexes are implemented by building a single B-tree over composite values (column number, key value). The key values for different columns can be of different types.

[#id](#GIN-INTERNALS-FIGURE)

**Figure 70.1. GIN Internals**
![GIN Internals](/docs/postgres/gin.svg)

[#id](#GIN-FAST-UPDATE)

### 70.4.1. GIN Fast Update Technique [#](#GIN-FAST-UPDATE)

Updating a GIN index tends to be slow because of the intrinsic nature of inverted indexes: inserting or updating one heap row can cause many inserts into the index (one for each key extracted from the indexed item). GIN is capable of postponing much of this work by inserting new tuples into a temporary, unsorted list of pending entries. When the table is vacuumed or autoanalyzed, or when `gin_clean_pending_list` function is called, or if the pending list becomes larger than [gin_pending_list_limit](runtime-config-client#GUC-GIN-PENDING-LIST-LIMIT), the entries are moved to the main GIN data structure using the same bulk insert techniques used during initial index creation. This greatly improves GIN index update speed, even counting the additional vacuum overhead. Moreover the overhead work can be done by a background process instead of in foreground query processing.

The main disadvantage of this approach is that searches must scan the list of pending entries in addition to searching the regular index, and so a large list of pending entries will slow searches significantly. Another disadvantage is that, while most updates are fast, an update that causes the pending list to become “too large” will incur an immediate cleanup cycle and thus be much slower than other updates. Proper use of autovacuum can minimize both of these problems.

If consistent response time is more important than update speed, use of pending entries can be disabled by turning off the `fastupdate` storage parameter for a GIN index. See [CREATE INDEX](sql-createindex) for details.

[#id](#GIN-PARTIAL-MATCH)

### 70.4.2. Partial Match Algorithm [#](#GIN-PARTIAL-MATCH)

GIN can support “partial match” queries, in which the query does not determine an exact match for one or more keys, but the possible matches fall within a reasonably narrow range of key values (within the key sorting order determined by the `compare` support method). The `extractQuery` method, instead of returning a key value to be matched exactly, returns a key value that is the lower bound of the range to be searched, and sets the `pmatch` flag true. The key range is then scanned using the `comparePartial` method. `comparePartial` must return zero for a matching index key, less than zero for a non-match that is still within the range to be searched, or greater than zero if the index key is past the range that could match.
