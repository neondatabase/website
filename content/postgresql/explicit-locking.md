[#id](#EXPLICIT-LOCKING)

## 13.3. Explicit Locking [#](#EXPLICIT-LOCKING)

- [13.3.1. Table-Level Locks](explicit-locking#LOCKING-TABLES)
- [13.3.2. Row-Level Locks](explicit-locking#LOCKING-ROWS)
- [13.3.3. Page-Level Locks](explicit-locking#LOCKING-PAGES)
- [13.3.4. Deadlocks](explicit-locking#LOCKING-DEADLOCKS)
- [13.3.5. Advisory Locks](explicit-locking#ADVISORY-LOCKS)

PostgreSQL provides various lock modes to control concurrent access to data in tables. These modes can be used for application-controlled locking in situations where MVCC does not give the desired behavior. Also, most PostgreSQL commands automatically acquire locks of appropriate modes to ensure that referenced tables are not dropped or modified in incompatible ways while the command executes. (For example, `TRUNCATE` cannot safely be executed concurrently with other operations on the same table, so it obtains an `ACCESS EXCLUSIVE` lock on the table to enforce that.)

To examine a list of the currently outstanding locks in a database server, use the [`pg_locks`](view-pg-locks) system view. For more information on monitoring the status of the lock manager subsystem, refer to [Chapter 28](monitoring).

[#id](#LOCKING-TABLES)

### 13.3.1. Table-Level Locks [#](#LOCKING-TABLES)

The list below shows the available lock modes and the contexts in which they are used automatically by PostgreSQL. You can also acquire any of these locks explicitly with the command [LOCK](sql-lock). Remember that all of these lock modes are table-level locks, even if the name contains the word “row”; the names of the lock modes are historical. To some extent the names reflect the typical usage of each lock mode — but the semantics are all the same. The only real difference between one lock mode and another is the set of lock modes with which each conflicts (see [Table 13.2](explicit-locking#TABLE-LOCK-COMPATIBILITY)). Two transactions cannot hold locks of conflicting modes on the same table at the same time. (However, a transaction never conflicts with itself. For example, it might acquire `ACCESS EXCLUSIVE` lock and later acquire `ACCESS SHARE` lock on the same table.) Non-conflicting lock modes can be held concurrently by many transactions. Notice in particular that some lock modes are self-conflicting (for example, an `ACCESS EXCLUSIVE` lock cannot be held by more than one transaction at a time) while others are not self-conflicting (for example, an `ACCESS SHARE` lock can be held by multiple transactions).

**Table-Level Lock Modes**

- `ACCESS SHARE` (`AccessShareLock`)

  Conflicts with the `ACCESS EXCLUSIVE` lock mode only.

  The `SELECT` command acquires a lock of this mode on referenced tables. In general, any query that only _reads_ a table and does not modify it will acquire this lock mode.

- `ROW SHARE` (`RowShareLock`)

  Conflicts with the `EXCLUSIVE` and `ACCESS EXCLUSIVE` lock modes.

  The `SELECT` command acquires a lock of this mode on all tables on which one of the `FOR UPDATE`, `FOR NO KEY UPDATE`, `FOR SHARE`, or `FOR KEY SHARE` options is specified (in addition to `ACCESS SHARE` locks on any other tables that are referenced without any explicit `FOR ...` locking option).

- `ROW EXCLUSIVE` (`RowExclusiveLock`)

  Conflicts with the `SHARE`, `SHARE ROW EXCLUSIVE`, `EXCLUSIVE`, and `ACCESS EXCLUSIVE` lock modes.

  The commands `UPDATE`, `DELETE`, `INSERT`, and `MERGE` acquire this lock mode on the target table (in addition to `ACCESS SHARE` locks on any other referenced tables). In general, this lock mode will be acquired by any command that _modifies data_ in a table.

- `SHARE UPDATE EXCLUSIVE` (`ShareUpdateExclusiveLock`)

  Conflicts with the `SHARE UPDATE EXCLUSIVE`, `SHARE`, `SHARE ROW EXCLUSIVE`, `EXCLUSIVE`, and `ACCESS EXCLUSIVE` lock modes. This mode protects a table against concurrent schema changes and `VACUUM` runs.

  Acquired by `VACUUM` (without `FULL`), `ANALYZE`, `CREATE INDEX CONCURRENTLY`, `CREATE STATISTICS`, `COMMENT ON`, `REINDEX CONCURRENTLY`, and certain [`ALTER INDEX`](sql-alterindex) and [`ALTER TABLE`](sql-altertable) variants (for full details see the documentation of these commands).

- `SHARE` (`ShareLock`)

  Conflicts with the `ROW EXCLUSIVE`, `SHARE UPDATE EXCLUSIVE`, `SHARE ROW EXCLUSIVE`, `EXCLUSIVE`, and `ACCESS EXCLUSIVE` lock modes. This mode protects a table against concurrent data changes.

  Acquired by `CREATE INDEX` (without `CONCURRENTLY`).

- `SHARE ROW EXCLUSIVE` (`ShareRowExclusiveLock`)

  Conflicts with the `ROW EXCLUSIVE`, `SHARE UPDATE EXCLUSIVE`, `SHARE`, `SHARE ROW EXCLUSIVE`, `EXCLUSIVE`, and `ACCESS EXCLUSIVE` lock modes. This mode protects a table against concurrent data changes, and is self-exclusive so that only one session can hold it at a time.

  Acquired by `CREATE TRIGGER` and some forms of [`ALTER TABLE`](sql-altertable).

- `EXCLUSIVE` (`ExclusiveLock`)

  Conflicts with the `ROW SHARE`, `ROW EXCLUSIVE`, `SHARE UPDATE EXCLUSIVE`, `SHARE`, `SHARE ROW EXCLUSIVE`, `EXCLUSIVE`, and `ACCESS EXCLUSIVE` lock modes. This mode allows only concurrent `ACCESS SHARE` locks, i.e., only reads from the table can proceed in parallel with a transaction holding this lock mode.

  Acquired by `REFRESH MATERIALIZED VIEW CONCURRENTLY`.

- `ACCESS EXCLUSIVE` (`AccessExclusiveLock`)

  Conflicts with locks of all modes (`ACCESS SHARE`, `ROW SHARE`, `ROW EXCLUSIVE`, `SHARE UPDATE EXCLUSIVE`, `SHARE`, `SHARE ROW EXCLUSIVE`, `EXCLUSIVE`, and `ACCESS EXCLUSIVE`). This mode guarantees that the holder is the only transaction accessing the table in any way.

  Acquired by the `DROP TABLE`, `TRUNCATE`, `REINDEX`, `CLUSTER`, `VACUUM FULL`, and `REFRESH MATERIALIZED VIEW` (without `CONCURRENTLY`) commands. Many forms of `ALTER INDEX` and `ALTER TABLE` also acquire a lock at this level. This is also the default lock mode for `LOCK TABLE` statements that do not specify a mode explicitly.

### Tip

Only an `ACCESS EXCLUSIVE` lock blocks a `SELECT` (without `FOR UPDATE/SHARE`) statement.

Once acquired, a lock is normally held until the end of the transaction. But if a lock is acquired after establishing a savepoint, the lock is released immediately if the savepoint is rolled back to. This is consistent with the principle that `ROLLBACK` cancels all effects of the commands since the savepoint. The same holds for locks acquired within a PL/pgSQL exception block: an error escape from the block releases locks acquired within it.

[#id](#TABLE-LOCK-COMPATIBILITY)

**Table 13.2. Conflicting Lock Modes**

| Requested Lock Mode  | Existing Lock Mode |             |                      |         |                   |         |                |     |
| -------------------- | ------------------ | ----------- | -------------------- | ------- | ----------------- | ------- | -------------- | --- |
| `ACCESS SHARE`       | `ROW SHARE`        | `ROW EXCL.` | `SHARE UPDATE EXCL.` | `SHARE` | `SHARE ROW EXCL.` | `EXCL.` | `ACCESS EXCL.` |     |
| `ACCESS SHARE`       |                    |             |                      |         |                   |         |                | X   |
| `ROW SHARE`          |                    |             |                      |         |                   |         | X              | X   |
| `ROW EXCL.`          |                    |             |                      |         | X                 | X       | X              | X   |
| `SHARE UPDATE EXCL.` |                    |             |                      | X       | X                 | X       | X              | X   |
| `SHARE`              |                    |             | X                    | X       |                   | X       | X              | X   |
| `SHARE ROW EXCL.`    |                    |             | X                    | X       | X                 | X       | X              | X   |
| `EXCL.`              |                    | X           | X                    | X       | X                 | X       | X              | X   |
| `ACCESS EXCL.`       | X                  | X           | X                    | X       | X                 | X       | X              | X   |

[#id](#LOCKING-ROWS)

### 13.3.2. Row-Level Locks [#](#LOCKING-ROWS)

In addition to table-level locks, there are row-level locks, which are listed as below with the contexts in which they are used automatically by PostgreSQL. See [Table 13.3](explicit-locking#ROW-LOCK-COMPATIBILITY) for a complete table of row-level lock conflicts. Note that a transaction can hold conflicting locks on the same row, even in different subtransactions; but other than that, two transactions can never hold conflicting locks on the same row. Row-level locks do not affect data querying; they block only _writers and lockers_ to the same row. Row-level locks are released at transaction end or during savepoint rollback, just like table-level locks.

**Row-Level Lock Modes**

- `FOR UPDATE`

  `FOR UPDATE` causes the rows retrieved by the `SELECT` statement to be locked as though for update. This prevents them from being locked, modified or deleted by other transactions until the current transaction ends. That is, other transactions that attempt `UPDATE`, `DELETE`, `SELECT FOR UPDATE`, `SELECT FOR NO KEY UPDATE`, `SELECT FOR SHARE` or `SELECT FOR KEY SHARE` of these rows will be blocked until the current transaction ends; conversely, `SELECT FOR UPDATE` will wait for a concurrent transaction that has run any of those commands on the same row, and will then lock and return the updated row (or no row, if the row was deleted). Within a `REPEATABLE READ` or `SERIALIZABLE` transaction, however, an error will be thrown if a row to be locked has changed since the transaction started. For further discussion see [Section 13.4](applevel-consistency).

  The `FOR UPDATE` lock mode is also acquired by any `DELETE` on a row, and also by an `UPDATE` that modifies the values of certain columns. Currently, the set of columns considered for the `UPDATE` case are those that have a unique index on them that can be used in a foreign key (so partial indexes and expressional indexes are not considered), but this may change in the future.

- `FOR NO KEY UPDATE`

  Behaves similarly to `FOR UPDATE`, except that the lock acquired is weaker: this lock will not block `SELECT FOR KEY SHARE` commands that attempt to acquire a lock on the same rows. This lock mode is also acquired by any `UPDATE` that does not acquire a `FOR UPDATE` lock.

- `FOR SHARE`

  Behaves similarly to `FOR NO KEY UPDATE`, except that it acquires a shared lock rather than exclusive lock on each retrieved row. A shared lock blocks other transactions from performing `UPDATE`, `DELETE`, `SELECT FOR UPDATE` or `SELECT FOR NO KEY UPDATE` on these rows, but it does not prevent them from performing `SELECT FOR SHARE` or `SELECT FOR KEY SHARE`.

- `FOR KEY SHARE`

  Behaves similarly to `FOR SHARE`, except that the lock is weaker: `SELECT FOR UPDATE` is blocked, but not `SELECT FOR NO KEY UPDATE`. A key-shared lock blocks other transactions from performing `DELETE` or any `UPDATE` that changes the key values, but not other `UPDATE`, and neither does it prevent `SELECT FOR NO KEY UPDATE`, `SELECT FOR SHARE`, or `SELECT FOR KEY SHARE`.

PostgreSQL doesn't remember any information about modified rows in memory, so there is no limit on the number of rows locked at one time. However, locking a row might cause a disk write, e.g., `SELECT FOR UPDATE` modifies selected rows to mark them locked, and so will result in disk writes.

[#id](#ROW-LOCK-COMPATIBILITY)

**Table 13.3. Conflicting Row-Level Locks**

| Requested Lock Mode | Current Lock Mode |                   |            |     |
| ------------------- | ----------------- | ----------------- | ---------- | --- |
| FOR KEY SHARE       | FOR SHARE         | FOR NO KEY UPDATE | FOR UPDATE |     |
| FOR KEY SHARE       |                   |                   |            | X   |
| FOR SHARE           |                   |                   | X          | X   |
| FOR NO KEY UPDATE   |                   | X                 | X          | X   |
| FOR UPDATE          | X                 | X                 | X          | X   |

[#id](#LOCKING-PAGES)

### 13.3.3. Page-Level Locks [#](#LOCKING-PAGES)

In addition to table and row locks, page-level share/exclusive locks are used to control read/write access to table pages in the shared buffer pool. These locks are released immediately after a row is fetched or updated. Application developers normally need not be concerned with page-level locks, but they are mentioned here for completeness.

[#id](#LOCKING-DEADLOCKS)

### 13.3.4. Deadlocks [#](#LOCKING-DEADLOCKS)

The use of explicit locking can increase the likelihood of _deadlocks_, wherein two (or more) transactions each hold locks that the other wants. For example, if transaction 1 acquires an exclusive lock on table A and then tries to acquire an exclusive lock on table B, while transaction 2 has already exclusive-locked table B and now wants an exclusive lock on table A, then neither one can proceed. PostgreSQL automatically detects deadlock situations and resolves them by aborting one of the transactions involved, allowing the other(s) to complete. (Exactly which transaction will be aborted is difficult to predict and should not be relied upon.)

Note that deadlocks can also occur as the result of row-level locks (and thus, they can occur even if explicit locking is not used). Consider the case in which two concurrent transactions modify a table. The first transaction executes:

```

UPDATE accounts SET balance = balance + 100.00 WHERE acctnum = 11111;
```

This acquires a row-level lock on the row with the specified account number. Then, the second transaction executes:

```

UPDATE accounts SET balance = balance + 100.00 WHERE acctnum = 22222;
UPDATE accounts SET balance = balance - 100.00 WHERE acctnum = 11111;
```

The first `UPDATE` statement successfully acquires a row-level lock on the specified row, so it succeeds in updating that row. However, the second `UPDATE` statement finds that the row it is attempting to update has already been locked, so it waits for the transaction that acquired the lock to complete. Transaction two is now waiting on transaction one to complete before it continues execution. Now, transaction one executes:

```

UPDATE accounts SET balance = balance - 100.00 WHERE acctnum = 22222;
```

Transaction one attempts to acquire a row-level lock on the specified row, but it cannot: transaction two already holds such a lock. So it waits for transaction two to complete. Thus, transaction one is blocked on transaction two, and transaction two is blocked on transaction one: a deadlock condition. PostgreSQL will detect this situation and abort one of the transactions.

The best defense against deadlocks is generally to avoid them by being certain that all applications using a database acquire locks on multiple objects in a consistent order. In the example above, if both transactions had updated the rows in the same order, no deadlock would have occurred. One should also ensure that the first lock acquired on an object in a transaction is the most restrictive mode that will be needed for that object. If it is not feasible to verify this in advance, then deadlocks can be handled on-the-fly by retrying transactions that abort due to deadlocks.

So long as no deadlock situation is detected, a transaction seeking either a table-level or row-level lock will wait indefinitely for conflicting locks to be released. This means it is a bad idea for applications to hold transactions open for long periods of time (e.g., while waiting for user input).

[#id](#ADVISORY-LOCKS)

### 13.3.5. Advisory Locks [#](#ADVISORY-LOCKS)

PostgreSQL provides a means for creating locks that have application-defined meanings. These are called _advisory locks_, because the system does not enforce their use — it is up to the application to use them correctly. Advisory locks can be useful for locking strategies that are an awkward fit for the MVCC model. For example, a common use of advisory locks is to emulate pessimistic locking strategies typical of so-called “flat file” data management systems. While a flag stored in a table could be used for the same purpose, advisory locks are faster, avoid table bloat, and are automatically cleaned up by the server at the end of the session.

There are two ways to acquire an advisory lock in PostgreSQL: at session level or at transaction level. Once acquired at session level, an advisory lock is held until explicitly released or the session ends. Unlike standard lock requests, session-level advisory lock requests do not honor transaction semantics: a lock acquired during a transaction that is later rolled back will still be held following the rollback, and likewise an unlock is effective even if the calling transaction fails later. A lock can be acquired multiple times by its owning process; for each completed lock request there must be a corresponding unlock request before the lock is actually released. Transaction-level lock requests, on the other hand, behave more like regular lock requests: they are automatically released at the end of the transaction, and there is no explicit unlock operation. This behavior is often more convenient than the session-level behavior for short-term usage of an advisory lock. Session-level and transaction-level lock requests for the same advisory lock identifier will block each other in the expected way. If a session already holds a given advisory lock, additional requests by it will always succeed, even if other sessions are awaiting the lock; this statement is true regardless of whether the existing lock hold and new request are at session level or transaction level.

Like all locks in PostgreSQL, a complete list of advisory locks currently held by any session can be found in the [`pg_locks`](view-pg-locks) system view.

Both advisory locks and regular locks are stored in a shared memory pool whose size is defined by the configuration variables [max_locks_per_transaction](runtime-config-locks#GUC-MAX-LOCKS-PER-TRANSACTION) and [max_connections](runtime-config-connection#GUC-MAX-CONNECTIONS). Care must be taken not to exhaust this memory or the server will be unable to grant any locks at all. This imposes an upper limit on the number of advisory locks grantable by the server, typically in the tens to hundreds of thousands depending on how the server is configured.

In certain cases using advisory locking methods, especially in queries involving explicit ordering and `LIMIT` clauses, care must be taken to control the locks acquired because of the order in which SQL expressions are evaluated. For example:

```

SELECT pg_advisory_lock(id) FROM foo WHERE id = 12345; -- ok
SELECT pg_advisory_lock(id) FROM foo WHERE id > 12345 LIMIT 100; -- danger!
SELECT pg_advisory_lock(q.id) FROM
(
  SELECT id FROM foo WHERE id > 12345 LIMIT 100
) q; -- ok
```

In the above queries, the second form is dangerous because the `LIMIT` is not guaranteed to be applied before the locking function is executed. This might cause some locks to be acquired that the application was not expecting, and hence would fail to release (until it ends the session). From the point of view of the application, such locks would be dangling, although still viewable in `pg_locks`.

The functions provided to manipulate advisory locks are described in [Section 9.27.10](functions-admin#FUNCTIONS-ADVISORY-LOCKS).
