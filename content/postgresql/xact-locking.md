

|                   74.2. Transactions and Locking                  |                                                              |                                    |                                                       |                                                |
| :---------------------------------------------------------------: | :----------------------------------------------------------- | :--------------------------------: | ----------------------------------------------------: | ---------------------------------------------: |
| [Prev](transaction-id.html "74.1. Transactions and Identifiers")  | [Up](transactions.html "Chapter 74. Transaction Processing") | Chapter 74. Transaction Processing | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](subxacts.html "74.3. Subtransactions") |

***

## 74.2. Transactions and Locking [#](#XACT-LOCKING)

The transaction IDs of currently executing transactions are shown in [`pg_locks`](view-pg-locks.html "54.12. pg_locks") in columns `virtualxid` and `transactionid`. Read-only transactions will have `virtualxid`s but NULL `transactionid`s, while both columns will be set in read-write transactions.

Some lock types wait on `virtualxid`, while other types wait on `transactionid`. Row-level read and write locks are recorded directly in the locked rows and can be inspected using the [pgrowlocks](pgrowlocks.html "F.30. pgrowlocks — show a table's row locking information") extension. Row-level read locks might also require the assignment of multixact IDs (`mxid`; see [Section 25.1.5.1](routine-vacuuming.html#VACUUM-FOR-MULTIXACT-WRAPAROUND "25.1.5.1. Multixacts and Wraparound")).

***

|                                                                   |                                                              |                                                |
| :---------------------------------------------------------------- | :----------------------------------------------------------: | ---------------------------------------------: |
| [Prev](transaction-id.html "74.1. Transactions and Identifiers")  | [Up](transactions.html "Chapter 74. Transaction Processing") |  [Next](subxacts.html "74.3. Subtransactions") |
| 74.1. Transactions and Identifiers                                |     [Home](index.html "PostgreSQL 17devel Documentation")    |                          74.3. Subtransactions |
