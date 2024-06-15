[#id](#VIEW-PG-LOCKS)

## 54.12. `pg_locks` [#](#VIEW-PG-LOCKS)

The view `pg_locks` provides access to information about the locks held by active processes within the database server. See [Chapter 13](mvcc) for more discussion of locking.

`pg_locks` contains one row per active lockable object, requested lock mode, and relevant process. Thus, the same lockable object might appear many times, if multiple processes are holding or waiting for locks on it. However, an object that currently has no locks on it will not appear at all.

There are several distinct types of lockable objects: whole relations (e.g., tables), individual pages of relations, individual tuples of relations, transaction IDs (both virtual and permanent IDs), and general database objects (identified by class OID and object OID, in the same way as in [`pg_description`](catalog-pg-description) or [`pg_depend`](catalog-pg-depend)). Also, the right to extend a relation is represented as a separate lockable object, as is the right to update `pg_database`.`datfrozenxid`. Also, “advisory” locks can be taken on numbers that have user-defined meanings.

[#id](#id-1.10.5.16.6)

**Table 54.12. `pg_locks` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `locktype` `text`Type of the lockable object: `relation`, `extend`, `frozenid`, `page`, `tuple`, `transactionid`, `virtualxid`, `spectoken`, `object`, `userlock`, `advisory`, or `applytransaction`. (See also [Table 28.11](monitoring-stats#WAIT-EVENT-LOCK-TABLE).) |
| `database` `oid` (references [`pg_database`](catalog-pg-database).`oid`)OID of the database in which the lock target exists, or zero if the target is a shared object, or null if the target is a transaction ID                                                        |
| `relation` `oid` (references [`pg_class`](catalog-pg-class).`oid`)OID of the relation targeted by the lock, or null if the target is not a relation or part of a relation                                                                                               |
| `page` `int4`Page number targeted by the lock within the relation, or null if the target is not a relation page or tuple                                                                                                                                                |
| `tuple` `int2`Tuple number targeted by the lock within the page, or null if the target is not a tuple                                                                                                                                                                   |
| `virtualxid` `text`Virtual ID of the transaction targeted by the lock, or null if the target is not a virtual transaction ID; see [Chapter 74](transactions)                                                                                                            |
| `transactionid` `xid`ID of the transaction targeted by the lock, or null if the target is not a transaction ID; [Chapter 74](transactions)                                                                                                                              |
| `classid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)OID of the system catalog containing the lock target, or null if the target is not a general database object                                                                                           |
| `objid` `oid` (references any OID column)OID of the lock target within its system catalog, or null if the target is not a general database object                                                                                                                       |
| `objsubid` `int2`Column number targeted by the lock (the `classid` and `objid` refer to the table itself), or zero if the target is some other general database object, or null if the target is not a general database object                                          |
| `virtualtransaction` `text`Virtual ID of the transaction that is holding or awaiting this lock                                                                                                                                                                          |
| `pid` `int4`Process ID of the server process holding or awaiting this lock, or null if the lock is held by a prepared transaction                                                                                                                                       |
| `mode` `text`Name of the lock mode held or desired by this process (see [Section 13.3.1](explicit-locking#LOCKING-TABLES) and [Section 13.2.3](transaction-iso#XACT-SERIALIZABLE))                                                                                      |
| `granted` `bool`True if lock is held, false if lock is awaited                                                                                                                                                                                                          |
| `fastpath` `bool`True if lock was taken via fast path, false if taken via main lock table                                                                                                                                                                               |
| `waitstart` `timestamptz`Time when the server process started waiting for this lock, or null if the lock is held. Note that this can be null for a very short period of time after the wait started even though `granted` is `false`.                                   |

`granted` is true in a row representing a lock held by the indicated process. False indicates that this process is currently waiting to acquire this lock, which implies that at least one other process is holding or waiting for a conflicting lock mode on the same lockable object. The waiting process will sleep until the other lock is released (or a deadlock situation is detected). A single process can be waiting to acquire at most one lock at a time.

Throughout running a transaction, a server process holds an exclusive lock on the transaction's virtual transaction ID. If a permanent ID is assigned to the transaction (which normally happens only if the transaction changes the state of the database), it also holds an exclusive lock on the transaction's permanent transaction ID until it ends. When a process finds it necessary to wait specifically for another transaction to end, it does so by attempting to acquire share lock on the other transaction's ID (either virtual or permanent ID depending on the situation). That will succeed only when the other transaction terminates and releases its locks.

Although tuples are a lockable type of object, information about row-level locks is stored on disk, not in memory, and therefore row-level locks normally do not appear in this view. If a process is waiting for a row-level lock, it will usually appear in the view as waiting for the permanent transaction ID of the current holder of that row lock.

A speculative insertion lock consists of a transaction ID and a speculative insertion token. The speculative insertion token is displayed in the `objid` column.

Advisory locks can be acquired on keys consisting of either a single `bigint` value or two integer values. A `bigint` key is displayed with its high-order half in the `classid` column, its low-order half in the `objid` column, and `objsubid` equal to 1. The original `bigint` value can be reassembled with the expression `(classid::bigint << 32) | objid::bigint`. Integer keys are displayed with the first key in the `classid` column, the second key in the `objid` column, and `objsubid` equal to 2. The actual meaning of the keys is up to the user. Advisory locks are local to each database, so the `database` column is meaningful for an advisory lock.

Apply transaction locks are used in parallel mode to apply the transaction in logical replication. The remote transaction id is displayed in the `transactionid` column. The `objsubid` displays the lock subtype which is 0 for the lock used to synchronize the set of changes, and 1 for the lock used to wait for the transaction to finish to ensure commit order.

`pg_locks` provides a global view of all locks in the database cluster, not only those relevant to the current database. Although its `relation` column can be joined against [`pg_class`](catalog-pg-class).`oid` to identify locked relations, this will only work correctly for relations in the current database (those for which the `database` column is either the current database's OID or zero).

The `pid` column can be joined to the `pid` column of the [`pg_stat_activity`](monitoring-stats#MONITORING-PG-STAT-ACTIVITY-VIEW) view to get more information on the session holding or awaiting each lock, for example

```
SELECT * FROM pg_locks pl LEFT JOIN pg_stat_activity psa
    ON pl.pid = psa.pid;
```

Also, if you are using prepared transactions, the `virtualtransaction` column can be joined to the `transaction` column of the [`pg_prepared_xacts`](view-pg-prepared-xacts) view to get more information on prepared transactions that hold locks. (A prepared transaction can never be waiting for a lock, but it continues to hold the locks it acquired while running.) For example:

```
SELECT * FROM pg_locks pl LEFT JOIN pg_prepared_xacts ppx
    ON pl.virtualtransaction = '-1/' || ppx.transaction;
```

While it is possible to obtain information about which processes block which other processes by joining `pg_locks` against itself, this is very difficult to get right in detail. Such a query would have to encode knowledge about which lock modes conflict with which others. Worse, the `pg_locks` view does not expose information about which processes are ahead of which others in lock wait queues, nor information about which processes are parallel workers running on behalf of which other client sessions. It is better to use the `pg_blocking_pids()` function (see [Table 9.67](functions-info#FUNCTIONS-INFO-SESSION-TABLE)) to identify which process(es) a waiting process is blocked behind.

The `pg_locks` view displays data from both the regular lock manager and the predicate lock manager, which are separate systems; in addition, the regular lock manager subdivides its locks into regular and _fast-path_ locks. This data is not guaranteed to be entirely consistent. When the view is queried, data on fast-path locks (with `fastpath` = `true`) is gathered from each backend one at a time, without freezing the state of the entire lock manager, so it is possible for locks to be taken or released while information is gathered. Note, however, that these locks are known not to conflict with any other lock currently in place. After all backends have been queried for fast-path locks, the remainder of the regular lock manager is locked as a unit, and a consistent snapshot of all remaining locks is collected as an atomic action. After unlocking the regular lock manager, the predicate lock manager is similarly locked and all predicate locks are collected as an atomic action. Thus, with the exception of fast-path locks, each lock manager will deliver a consistent set of results, but as we do not lock both lock managers simultaneously, it is possible for locks to be taken or released after we interrogate the regular lock manager and before we interrogate the predicate lock manager.

Locking the regular and/or predicate lock manager could have some impact on database performance if this view is very frequently accessed. The locks are held only for the minimum amount of time necessary to obtain data from the lock managers, but this does not completely eliminate the possibility of a performance impact.
