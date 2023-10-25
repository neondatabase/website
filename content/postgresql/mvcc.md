<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|              Chapter 13. Concurrency Control              |                                            |                           |                                                       |                                               |
| :-------------------------------------------------------: | :----------------------------------------- | :-----------------------: | ----------------------------------------------------: | --------------------------------------------: |
| [Prev](textsearch-limitations.html "12.11. Limitations")  | [Up](sql.html "Part II. The SQL Language") | Part II. The SQL Language | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](mvcc-intro.html "13.1. Introduction") |

***

## Chapter 13. Concurrency Control

**Table of Contents**

*   *   [13.1. Introduction](mvcc-intro.html)
    *   [13.2. Transaction Isolation](transaction-iso.html)

    <!---->

    *   *   [13.2.1. Read Committed Isolation Level](transaction-iso.html#XACT-READ-COMMITTED)
        *   [13.2.2. Repeatable Read Isolation Level](transaction-iso.html#XACT-REPEATABLE-READ)
        *   [13.2.3. Serializable Isolation Level](transaction-iso.html#XACT-SERIALIZABLE)

*   [13.3. Explicit Locking](explicit-locking.html)

    *   *   [13.3.1. Table-Level Locks](explicit-locking.html#LOCKING-TABLES)
        *   [13.3.2. Row-Level Locks](explicit-locking.html#LOCKING-ROWS)
        *   [13.3.3. Page-Level Locks](explicit-locking.html#LOCKING-PAGES)
        *   [13.3.4. Deadlocks](explicit-locking.html#LOCKING-DEADLOCKS)
        *   [13.3.5. Advisory Locks](explicit-locking.html#ADVISORY-LOCKS)

*   [13.4. Data Consistency Checks at the Application Level](applevel-consistency.html)

    *   *   [13.4.1. Enforcing Consistency with Serializable Transactions](applevel-consistency.html#SERIALIZABLE-CONSISTENCY)
        *   [13.4.2. Enforcing Consistency with Explicit Blocking Locks](applevel-consistency.html#NON-SERIALIZABLE-CONSISTENCY)

*   *   [13.5. Serialization Failure Handling](mvcc-serialization-failure-handling.html)
    *   [13.6. Caveats](mvcc-caveats.html)
    *   [13.7. Locking and Indexes](locking-indexes.html)



This chapter describes the behavior of the PostgreSQL database system when two or more sessions try to access the same data at the same time. The goals in that situation are to allow efficient access for all sessions while maintaining strict data integrity. Every developer of database applications should be familiar with the topics covered in this chapter.

***

|                                                           |                                                       |                                               |
| :-------------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------: |
| [Prev](textsearch-limitations.html "12.11. Limitations")  |       [Up](sql.html "Part II. The SQL Language")      |  [Next](mvcc-intro.html "13.1. Introduction") |
| 12.11. Limitations                                        | [Home](index.html "PostgreSQL 17devel Documentation") |                            13.1. Introduction |
