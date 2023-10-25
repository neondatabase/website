<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                   ABORT                   |                                        |              |                                                       |                                                    |
| :---------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -------------------------------------------------: |
| [Prev](sql-commands.html "SQL Commands")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-alteraggregate.html "ALTER AGGREGATE") |

***

[]()

## ABORT

ABORT — abort the current transaction

## Synopsis

```

ABORT [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
```

## Description

`ABORT` rolls back the current transaction and causes all the updates made by the transaction to be discarded. This command is identical in behavior to the standard SQL command [`ROLLBACK`](sql-rollback.html "ROLLBACK"), and is present only for historical reasons.

## Parameters

*   `WORK``TRANSACTION`

    Optional key words. They have no effect.

*   `AND CHAIN`

    If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [`SET TRANSACTION`](sql-set-transaction.html "SET TRANSACTION")) as the just finished one. Otherwise, no new transaction is started.

## Notes

Use [`COMMIT`](sql-commit.html "COMMIT") to successfully terminate a transaction.

Issuing `ABORT` outside of a transaction block emits a warning and otherwise has no effect.

## Examples

To abort all changes:

```

ABORT;
```

## Compatibility

This command is a PostgreSQL extension present for historical reasons. `ROLLBACK` is the equivalent standard SQL command.

## See Also

[BEGIN](sql-begin.html "BEGIN"), [COMMIT](sql-commit.html "COMMIT"), [ROLLBACK](sql-rollback.html "ROLLBACK")

***

|                                           |                                                       |                                                    |
| :---------------------------------------- | :---------------------------------------------------: | -------------------------------------------------: |
| [Prev](sql-commands.html "SQL Commands")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-alteraggregate.html "ALTER AGGREGATE") |
| SQL Commands                              | [Home](index.html "PostgreSQL 17devel Documentation") |                                    ALTER AGGREGATE |
