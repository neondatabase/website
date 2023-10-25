<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|       START TRANSACTION       |                                        |              |                                                       |                                       |
| :---------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ------------------------------------: |
| [Prev](sql-show.html "SHOW")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-truncate.html "TRUNCATE") |

***

## START TRANSACTION

START TRANSACTION — start a transaction block

## Synopsis

```

START TRANSACTION [ transaction_mode [, ...] ]

where transaction_mode is one of:

    ISOLATION LEVEL { SERIALIZABLE | REPEATABLE READ | READ COMMITTED | READ UNCOMMITTED }
    READ WRITE | READ ONLY
    [ NOT ] DEFERRABLE
```

## Description

This command begins a new transaction block. If the isolation level, read/write mode, or deferrable mode is specified, the new transaction has those characteristics, as if [`SET TRANSACTION`](sql-set-transaction.html "SET TRANSACTION") was executed. This is the same as the [`BEGIN`](sql-begin.html "BEGIN") command.

## Parameters

Refer to [SET TRANSACTION](sql-set-transaction.html "SET TRANSACTION") for information on the meaning of the parameters to this statement.

## Compatibility

In the standard, it is not necessary to issue `START TRANSACTION` to start a transaction block: any SQL command implicitly begins a block. PostgreSQL's behavior can be seen as implicitly issuing a `COMMIT` after each command that does not follow `START TRANSACTION` (or `BEGIN`), and it is therefore often called “autocommit”. Other relational database systems might offer an autocommit feature as a convenience.

The `DEFERRABLE` *`transaction_mode`* is a PostgreSQL language extension.

The SQL standard requires commas between successive *`transaction_modes`*, but for historical reasons PostgreSQL allows the commas to be omitted.

See also the compatibility section of [SET TRANSACTION](sql-set-transaction.html "SET TRANSACTION").

## See Also

[BEGIN](sql-begin.html "BEGIN"), [COMMIT](sql-commit.html "COMMIT"), [ROLLBACK](sql-rollback.html "ROLLBACK"), [SAVEPOINT](sql-savepoint.html "SAVEPOINT"), [SET TRANSACTION](sql-set-transaction.html "SET TRANSACTION")

***

|                               |                                                       |                                       |
| :---------------------------- | :---------------------------------------------------: | ------------------------------------: |
| [Prev](sql-show.html "SHOW")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-truncate.html "TRUNCATE") |
| SHOW                          | [Home](index.html "PostgreSQL 17devel Documentation") |                              TRUNCATE |
