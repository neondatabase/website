<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|            Chapter 74. Transaction Processing            |                                            |                     |                                                       |                                                                   |
| :------------------------------------------------------: | :----------------------------------------- | :-----------------: | ----------------------------------------------------: | ----------------------------------------------------------------: |
| [Prev](storage-hot.html "73.7. Heap-Only Tuples (HOT)")  | [Up](internals.html "Part VII. Internals") | Part VII. Internals | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](transaction-id.html "74.1. Transactions and Identifiers") |

***

## Chapter 74. Transaction Processing

**Table of Contents**

*   *   [74.1. Transactions and Identifiers](transaction-id.html)
    *   [74.2. Transactions and Locking](xact-locking.html)
    *   [74.3. Subtransactions](subxacts.html)
    *   [74.4. Two-Phase Transactions](two-phase.html)

This chapter provides an overview of the internals of PostgreSQL's transaction management system. The word transaction is often abbreviated as *xact*.

***

|                                                          |                                                       |                                                                   |
| :------------------------------------------------------- | :---------------------------------------------------: | ----------------------------------------------------------------: |
| [Prev](storage-hot.html "73.7. Heap-Only Tuples (HOT)")  |       [Up](internals.html "Part VII. Internals")      |  [Next](transaction-id.html "74.1. Transactions and Identifiers") |
| 73.7. Heap-Only Tuples (HOT)                             | [Home](index.html "PostgreSQL 17devel Documentation") |                                74.1. Transactions and Identifiers |
