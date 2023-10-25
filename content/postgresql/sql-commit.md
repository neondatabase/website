<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                COMMIT               |                                        |              |                                                       |                                                     |
| :---------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | --------------------------------------------------: |
| [Prev](sql-comment.html "COMMENT")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-commit-prepared.html "COMMIT PREPARED") |

***

[]()

## COMMIT

COMMIT — commit the current transaction

## Synopsis

```

COMMIT [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
```

## Description

`COMMIT` commits the current transaction. All changes made by the transaction become visible to others and are guaranteed to be durable if a crash occurs.

## Parameters

[]()

*   `WORK``TRANSACTION` [#](#SQL-COMMIT-TRANSACTION)

    Optional key words. They have no effect.

*   `AND CHAIN` [#](#SQL-COMMIT-CHAIN)

    If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [SET TRANSACTION](sql-set-transaction.html "SET TRANSACTION")) as the just finished one. Otherwise, no new transaction is started.

## Notes

Use [ROLLBACK](sql-rollback.html "ROLLBACK") to abort a transaction.

Issuing `COMMIT` when not inside a transaction does no harm, but it will provoke a warning message. `COMMIT AND CHAIN` when not inside a transaction is an error.

## Examples

To commit the current transaction and make all changes permanent:

```

COMMIT;
```

## Compatibility

The command `COMMIT` conforms to the SQL standard. The form `COMMIT TRANSACTION` is a PostgreSQL extension.

## See Also

[BEGIN](sql-begin.html "BEGIN"), [ROLLBACK](sql-rollback.html "ROLLBACK")

***

|                                     |                                                       |                                                     |
| :---------------------------------- | :---------------------------------------------------: | --------------------------------------------------: |
| [Prev](sql-comment.html "COMMENT")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-commit-prepared.html "COMMIT PREPARED") |
| COMMENT                             | [Home](index.html "PostgreSQL 17devel Documentation") |                                     COMMIT PREPARED |
