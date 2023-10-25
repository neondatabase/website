<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|           ROLLBACK PREPARED           |                                        |              |                                                       |                                                       |
| :-----------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ----------------------------------------------------: |
| [Prev](sql-rollback.html "ROLLBACK")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-rollback-to.html "ROLLBACK TO SAVEPOINT") |

***

## ROLLBACK PREPARED

ROLLBACK PREPARED — cancel a transaction that was earlier prepared for two-phase commit

## Synopsis

```

ROLLBACK PREPARED transaction_id
```

## Description

`ROLLBACK PREPARED` rolls back a transaction that is in prepared state.

## Parameters

* *`transaction_id`*

    The transaction identifier of the transaction that is to be rolled back.

## Notes

To roll back a prepared transaction, you must be either the same user that executed the transaction originally, or a superuser. But you do not have to be in the same session that executed the transaction.

This command cannot be executed inside a transaction block. The prepared transaction is rolled back immediately.

All currently available prepared transactions are listed in the [`pg_prepared_xacts`](view-pg-prepared-xacts.html "54.16. pg_prepared_xacts") system view.

## Examples

Roll back the transaction identified by the transaction identifier `foobar`:

```

ROLLBACK PREPARED 'foobar';
```

## Compatibility

`ROLLBACK PREPARED` is a PostgreSQL extension. It is intended for use by external transaction management systems, some of which are covered by standards (such as X/Open XA), but the SQL side of those systems is not standardized.

## See Also

[PREPARE TRANSACTION](sql-prepare-transaction.html "PREPARE TRANSACTION"), [COMMIT PREPARED](sql-commit-prepared.html "COMMIT PREPARED")

***

|                                       |                                                       |                                                       |
| :------------------------------------ | :---------------------------------------------------: | ----------------------------------------------------: |
| [Prev](sql-rollback.html "ROLLBACK")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-rollback-to.html "ROLLBACK TO SAVEPOINT") |
| ROLLBACK                              | [Home](index.html "PostgreSQL 17devel Documentation") |                                 ROLLBACK TO SAVEPOINT |
