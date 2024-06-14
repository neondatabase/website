[#id](#XACT-LOCKING)

## 74.2. Transactions and Locking [#](#XACT-LOCKING)

The transaction IDs of currently executing transactions are shown in [`pg_locks`](view-pg-locks) in columns `virtualxid` and `transactionid`. Read-only transactions will have `virtualxid`s but NULL `transactionid`s, while both columns will be set in read-write transactions.

Some lock types wait on `virtualxid`, while other types wait on `transactionid`. Row-level read and write locks are recorded directly in the locked rows and can be inspected using the [pgrowlocks](pgrowlocks) extension. Row-level read locks might also require the assignment of multixact IDs (`mxid`; see [Section 25.1.5.1](routine-vacuuming#VACUUM-FOR-MULTIXACT-WRAPAROUND)).
