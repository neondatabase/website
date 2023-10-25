

|                   END                  |                                        |              |                                                       |                                     |
| :------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ----------------------------------: |
| [Prev](sql-dropview.html "DROP VIEW")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-execute.html "EXECUTE") |

***

## END

END — commit the current transaction

## Synopsis

```

END [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
```

## Description

`END` commits the current transaction. All changes made by the transaction become visible to others and are guaranteed to be durable if a crash occurs. This command is a PostgreSQL extension that is equivalent to [`COMMIT`](sql-commit.html "COMMIT").

## Parameters

* `WORK``TRANSACTION`

    Optional key words. They have no effect.

* `AND CHAIN`

    If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [SET TRANSACTION](sql-set-transaction.html "SET TRANSACTION")) as the just finished one. Otherwise, no new transaction is started.

## Notes

Use [`ROLLBACK`](sql-rollback.html "ROLLBACK") to abort a transaction.

Issuing `END` when not inside a transaction does no harm, but it will provoke a warning message.

## Examples

To commit the current transaction and make all changes permanent:

```

END;
```

## Compatibility

`END` is a PostgreSQL extension that provides functionality equivalent to [`COMMIT`](sql-commit.html "COMMIT"), which is specified in the SQL standard.

## See Also

[BEGIN](sql-begin.html "BEGIN"), [COMMIT](sql-commit.html "COMMIT"), [ROLLBACK](sql-rollback.html "ROLLBACK")

***

|                                        |                                                       |                                     |
| :------------------------------------- | :---------------------------------------------------: | ----------------------------------: |
| [Prev](sql-dropview.html "DROP VIEW")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-execute.html "EXECUTE") |
| DROP VIEW                              | [Home](index.html "PostgreSQL 17devel Documentation") |                             EXECUTE |
