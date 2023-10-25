<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|          13.7. Locking and Indexes         |                                                   |                                 |                                                       |                                                               |
| :----------------------------------------: | :------------------------------------------------ | :-----------------------------: | ----------------------------------------------------: | ------------------------------------------------------------: |
| [Prev](mvcc-caveats.html "13.6. Caveats")  | [Up](mvcc.html "Chapter 13. Concurrency Control") | Chapter 13. Concurrency Control | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](performance-tips.html "Chapter 14. Performance Tips") |

***

## 13.7. Locking and Indexes [#](#LOCKING-INDEXES)



Though PostgreSQL provides nonblocking read/write access to table data, nonblocking read/write access is not currently offered for every index access method implemented in PostgreSQL. The various index types are handled as follows:

*   B-tree, GiST and SP-GiST indexes

    Short-term share/exclusive page-level locks are used for read/write access. Locks are released immediately after each index row is fetched or inserted. These index types provide the highest concurrency without deadlock conditions.

*   Hash indexes

    Share/exclusive hash-bucket-level locks are used for read/write access. Locks are released after the whole bucket is processed. Bucket-level locks provide better concurrency than index-level ones, but deadlock is possible since the locks are held longer than one index operation.

*   GIN indexes

    Short-term share/exclusive page-level locks are used for read/write access. Locks are released immediately after each index row is fetched or inserted. But note that insertion of a GIN-indexed value usually produces several index key insertions per row, so GIN might do substantial work for a single value's insertion.

Currently, B-tree indexes offer the best performance for concurrent applications; since they also have more features than hash indexes, they are the recommended index type for concurrent applications that need to index scalar data. When dealing with non-scalar data, B-trees are not useful, and GiST, SP-GiST or GIN indexes should be used instead.

***

|                                            |                                                       |                                                               |
| :----------------------------------------- | :---------------------------------------------------: | ------------------------------------------------------------: |
| [Prev](mvcc-caveats.html "13.6. Caveats")  |   [Up](mvcc.html "Chapter 13. Concurrency Control")   |  [Next](performance-tips.html "Chapter 14. Performance Tips") |
| 13.6. Caveats                              | [Home](index.html "PostgreSQL 17devel Documentation") |                                  Chapter 14. Performance Tips |
