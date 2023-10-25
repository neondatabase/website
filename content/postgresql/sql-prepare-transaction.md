

|         PREPARE TRANSACTION         |                                        |              |                                                       |                                                   |
| :---------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ------------------------------------------------: |
| [Prev](sql-prepare.html "PREPARE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-reassign-owned.html "REASSIGN OWNED") |

***

## PREPARE TRANSACTION

PREPARE TRANSACTION — prepare the current transaction for two-phase commit

## Synopsis

```

PREPARE TRANSACTION transaction_id
```

## Description

`PREPARE TRANSACTION` prepares the current transaction for two-phase commit. After this command, the transaction is no longer associated with the current session; instead, its state is fully stored on disk, and there is a very high probability that it can be committed successfully, even if a database crash occurs before the commit is requested.

Once prepared, a transaction can later be committed or rolled back with [`COMMIT PREPARED`](sql-commit-prepared.html "COMMIT PREPARED") or [`ROLLBACK PREPARED`](sql-rollback-prepared.html "ROLLBACK PREPARED"), respectively. Those commands can be issued from any session, not only the one that executed the original transaction.

From the point of view of the issuing session, `PREPARE TRANSACTION` is not unlike a `ROLLBACK` command: after executing it, there is no active current transaction, and the effects of the prepared transaction are no longer visible. (The effects will become visible again if the transaction is committed.)

If the `PREPARE TRANSACTION` command fails for any reason, it becomes a `ROLLBACK`: the current transaction is canceled.

## Parameters

* *`transaction_id`*

    An arbitrary identifier that later identifies this transaction for `COMMIT PREPARED` or `ROLLBACK PREPARED`. The identifier must be written as a string literal, and must be less than 200 bytes long. It must not be the same as the identifier used for any currently prepared transaction.

## Notes

`PREPARE TRANSACTION` is not intended for use in applications or interactive sessions. Its purpose is to allow an external transaction manager to perform atomic global transactions across multiple databases or other transactional resources. Unless you're writing a transaction manager, you probably shouldn't be using `PREPARE TRANSACTION`.

This command must be used inside a transaction block. Use [`BEGIN`](sql-begin.html "BEGIN") to start one.

It is not currently allowed to `PREPARE` a transaction that has executed any operations involving temporary tables or the session's temporary namespace, created any cursors `WITH HOLD`, or executed `LISTEN`, `UNLISTEN`, or `NOTIFY`. Those features are too tightly tied to the current session to be useful in a transaction to be prepared.

If the transaction modified any run-time parameters with `SET` (without the `LOCAL` option), those effects persist after `PREPARE TRANSACTION`, and will not be affected by any later `COMMIT PREPARED` or `ROLLBACK PREPARED`. Thus, in this one respect `PREPARE TRANSACTION` acts more like `COMMIT` than `ROLLBACK`.

All currently available prepared transactions are listed in the [`pg_prepared_xacts`](view-pg-prepared-xacts.html "54.16. pg_prepared_xacts") system view.

### Caution

It is unwise to leave transactions in the prepared state for a long time. This will interfere with the ability of `VACUUM` to reclaim storage, and in extreme cases could cause the database to shut down to prevent transaction ID wraparound (see [Section 25.1.5](routine-vacuuming.html#VACUUM-FOR-WRAPAROUND "25.1.5. Preventing Transaction ID Wraparound Failures")). Keep in mind also that the transaction continues to hold whatever locks it held. The intended usage of the feature is that a prepared transaction will normally be committed or rolled back as soon as an external transaction manager has verified that other databases are also prepared to commit.

If you have not set up an external transaction manager to track prepared transactions and ensure they get closed out promptly, it is best to keep the prepared-transaction feature disabled by setting [max\_prepared\_transactions](runtime-config-resource.html#GUC-MAX-PREPARED-TRANSACTIONS) to zero. This will prevent accidental creation of prepared transactions that might then be forgotten and eventually cause problems.

## Examples

Prepare the current transaction for two-phase commit, using `foobar` as the transaction identifier:

```

PREPARE TRANSACTION 'foobar';
```

## Compatibility

`PREPARE TRANSACTION` is a PostgreSQL extension. It is intended for use by external transaction management systems, some of which are covered by standards (such as X/Open XA), but the SQL side of those systems is not standardized.

## See Also

[COMMIT PREPARED](sql-commit-prepared.html "COMMIT PREPARED"), [ROLLBACK PREPARED](sql-rollback-prepared.html "ROLLBACK PREPARED")

***

|                                     |                                                       |                                                   |
| :---------------------------------- | :---------------------------------------------------: | ------------------------------------------------: |
| [Prev](sql-prepare.html "PREPARE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-reassign-owned.html "REASSIGN OWNED") |
| PREPARE                             | [Home](index.html "PostgreSQL 17devel Documentation") |                                    REASSIGN OWNED |
