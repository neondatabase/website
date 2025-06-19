---
title: The pgrowlocks extension
subtitle: Display row-level locking information for a specific table in Postgres
enableTableOfContents: true
updatedOn: '2025-05-27T19:40:34.755Z'
tag: new
---

The `pgrowlocks` extension provides a function to inspect active row-level locks for a specified table within your Postgres database. This is invaluable for diagnosing lock contention issues, understanding which specific rows are currently locked, and identifying the transactions or processes holding these locks. By offering a detailed, real-time view of row locks, `pgrowlocks` helps developers and database administrators troubleshoot performance bottlenecks related to concurrent data access.

<CTA />

## Enable the `pgrowlocks` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS pgrowlocks;
```

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.

## The `pgrowlocks()` function

`pgrowlocks` offers a single primary function to inspect row locks.

### Analyzing row locks with `pgrowlocks()`

The `pgrowlocks(relation text)` function provides detailed information about currently held row-level locks on a specified table.

```sql
SELECT * FROM pgrowlocks('your_table_name');
```

Key columns in the output include:

- `locked_row` (`tid`): The Tuple ID (physical location) of the locked row.
- `locker` (`xid`): The Transaction ID (or Multixact ID if `multi` is true) of the transaction holding the lock
- `multi` (`boolean`): True if `locker` is a Multixact ID (indicating multiple transactions might be involved, e.g., for shared locks).
- `xids` (`xid[]`): An array of Transaction IDs that are holding locks on this specific row. This is particularly informative when `multi` is true.
- `modes` (`text[]`): An array listing the lock modes held by the corresponding `xids` on the row. Common modes include `For Key Share`, `For Share`, `For No Key Update`, `For Update`, and `Update`.
- `pids` (`integer[]`): An array of Process IDs (PIDs) of the backend database sessions holding the locks. This helps identify the specific connections.

**Example: Observing active row locks**

Let's set up a scenario to demonstrate `pgrowlocks`. First, create a simple `accounts` table:

```sql
CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    owner_name TEXT,
    balance NUMERIC(10, 2)
);

INSERT INTO accounts (owner_name, balance) VALUES
('Alice', 1000.00),
('Bob', 500.00),
('Charlie', 750.00);
```

Now, to create some row locks, you would typically use multiple database sessions.

**Scenario setup (to be performed in separate `psql` sessions or database connections):**

1.  **In Session 1:** Start a transaction and update Alice's account (e.g., her balance), but do not commit. This will place an exclusive lock on Alice's row.

    ```sql
    -- In Session 1
    BEGIN;
    UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
    -- Do not COMMIT or ROLLBACK yet
    ```

2.  **In Session 2:** Start a transaction and select Bob's account with `FOR UPDATE`. This will place an exclusive lock on Bob's row.
    ```sql
    -- In Session 2
    BEGIN;
    SELECT * FROM accounts WHERE account_id = 2 FOR UPDATE;
    -- Do not COMMIT or ROLLBACK yet
    ```

Now, **in a third session**, query `pgrowlocks` for the `accounts` table:

```sql
-- In Session 3
SELECT * FROM pgrowlocks('accounts');
```

Example output (the `locker` XIDs and `pids` will vary in your environment, and lock modes can differ based on the exact operations):

```text
 locked_row  | locker | multi | xids  |       modes       |  pids
------------+--------+-------+-------+-------------------+--------
 (0,1)      |    767 | f     | {767} | {"No Key Update"} | {1076}
 (0,2)      |    768 | f     | {768} | {"For Update"}    | {429}
(2 rows)
```

**Interpretation of the output:**

- Row `(0,1)` is locked by transaction `767` (from Session 1), associated with process ID `1076`. The `modes` column shows `{"No Key Update"}`. This lock mode is often used by `UPDATE` statements when the update does **not** modify any columns that are part of a primary key or unique constraint. In our example, updating only the `balance` column would result in this lock mode. It's an exclusive lock preventing other modifications but is slightly less restrictive than `For Update` in some internal aspects.
- Row `(0,2)` (Bob's account) is locked by transaction `768` (from Session 2), associated with process ID `429`. The `modes` column shows `{"For Update"}`. This lock mode is typically acquired by `SELECT ... FOR UPDATE` statements or by `UPDATE`/`DELETE` statements when key columns are involved or stronger locking is required.
- `multi` is `f` (false) in both cases, indicating these are straightforward locks by single transactions.

This output clearly shows which specific rows are locked, by which transactions, the precise mode of the lock, and the process IDs of the sessions holding the locks.

<Admonition type="note" title="Data Transience">
The information from `pgrowlocks` is a real-time snapshot. It reflects the locks present at the exact moment of execution and does not store historical data.
</Admonition>

## Practical usage examples

### Viewing the content of locked rows

`pgrowlocks` shows which rows are locked (`locked_row` TID) but not their data. To see the actual data of the locked rows, you can join the `pgrowlocks` output with the table itself using the system column `ctid`.

```sql
SELECT
    a.*, -- Select all columns from your table
    p.locker AS locking_transaction_id,
    p.modes AS lock_modes,
    p.pids AS locking_process_ids
FROM
    accounts AS a,
    pgrowlocks('accounts') AS p
WHERE
    p.locked_row = a.ctid;
```

**Example output:**

```text
 account_id  | owner_name | balance | locking_transaction_id |    lock_modes     | locking_process_ids
------------+------------+---------+------------------------+-------------------+---------------------
          1 | Alice      | 1000.00 |                   1027 | {"No Key Update"} | {405}
          2 | Bob        |  500.00 |                   1028 | {"For Update"}    | {419}
(2 rows)
```

<Admonition type="warning" title="Performance Impact">
This query can be very inefficient, especially on large tables, as `pgrowlocks` itself scans the table, and the join might add further overhead. Use it cautiously in production environments.
</Admonition>

### Identifying blocking sessions and queries

One of the most powerful uses of `pgrowlocks` is to help diagnose lock contention. By combining its output with `pg_stat_activity`, you can find out exactly which queries and users are involved in holding or waiting for row locks.

```sql
SELECT
    p.locked_row,
    p.locker AS locking_transaction_id,
    p.modes AS lock_modes,
    act.pid AS locker_pid,
    act.usename AS locker_user,
    act.query AS locker_query,
    act.state AS locker_state,
    act.wait_event_type AS locker_wait_type,
    act.wait_event AS locker_wait_event
FROM
    pgrowlocks('accounts') AS p
JOIN
    pg_stat_activity AS act ON act.pid = ANY(p.pids);
```

The query above shows the details of the session(s) directly holding the row locks identified by `pgrowlocks`. To find sessions _blocked_ by these row locks, you would typically query `pg_locks` where `granted = false` and correlate the `transactionid`, `relation`, and potentially tuple information.

**Example output:**

```text
 locked_row | locking_transaction_id |    lock_modes     | locker_pid | locker_user  |                           locker_query                            |    locker_state     | locker_wait_type | locker_wait_event
------------+------------------------+-------------------+------------+--------------+-------------------------------------------------------------------+---------------------+------------------+-------------------
 (0,1)      |                   1029 | {"No Key Update"} |       1601 | neondb_owner | UPDATE accounts SET balance = balance - 100 WHERE account_id = 1; | idle in transaction | Client           | ClientRead
 (0,2)      |                   1030 | {"For Update"}    |       1629 | neondb_owner | SELECT * FROM accounts WHERE account_id = 2 FOR UPDATE;           | idle in transaction | Client           | ClientRead
(2 rows)
```

This output provides a comprehensive view of the locking situation, including the user and query that are holding the locks. You can use this information to effectively communicate with your team or take action to resolve the contention.

> You can now `COMMIT` or `ROLLBACK` the transactions in Session 1 and Session 2 to release their locks.

## Important considerations and limitations

- **Lock acquisition**: `pgrowlocks` takes an `AccessShareLock` on the target table to read its rows.
- **Blocking**: If an `ACCESS EXCLUSIVE` lock is held on the table (e.g., by an `ALTER TABLE` operation), `pgrowlocks` will be blocked until that exclusive lock is released.
- **Performance**: `pgrowlocks` reads each row of the table to check for locks. This can be slow and resource-intensive on very large tables.

## Conclusion

The `pgrowlocks` extension is a vital tool to diagnose row-level locking contention. By providing a clear view of which rows are locked, by whom, and in what mode, it helps developers and DBAs to quickly identify and resolve performance issues caused by concurrent data access patterns. While it should be used judiciously on large tables due to its scanning nature, its insights are invaluable for troubleshooting complex locking scenarios.

## Resources

- [PostgreSQL `pgrowlocks` documentation](https://www.postgresql.org/docs/current/pgrowlocks.html)
- [Monitor active queries on Neon: powered by `pg_stat_activity`](/docs/introduction/monitor-active-queries)
- [MultiXacts in PostgreSQL: usage, side effects, and monitoring](https://aws.amazon.com/blogs/database/multixacts-in-postgresql-usage-side-effects-and-monitoring/)

<NeedHelp />
