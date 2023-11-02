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

This command begins a new transaction block. If the isolation level, read/write mode, or deferrable mode is specified, the new transaction has those characteristics, as if [`SET TRANSACTION`](sql-set-transaction "SET TRANSACTION") was executed. This is the same as the [`BEGIN`](sql-begin "BEGIN") command.

## Parameters

Refer to [SET TRANSACTION](sql-set-transaction "SET TRANSACTION") for information on the meaning of the parameters to this statement.

## Compatibility

In the standard, it is not necessary to issue `START TRANSACTION` to start a transaction block: any SQL command implicitly begins a block. PostgreSQL's behavior can be seen as implicitly issuing a `COMMIT` after each command that does not follow `START TRANSACTION` (or `BEGIN`), and it is therefore often called “autocommit”. Other relational database systems might offer an autocommit feature as a convenience.

The `DEFERRABLE` *`transaction_mode`* is a PostgreSQL language extension.

The SQL standard requires commas between successive *`transaction_modes`*, but for historical reasons PostgreSQL allows the commas to be omitted.

See also the compatibility section of [SET TRANSACTION](sql-set-transaction "SET TRANSACTION").

## See Also

[BEGIN](sql-begin "BEGIN"), [COMMIT](sql-commit "COMMIT"), [ROLLBACK](sql-rollback "ROLLBACK"), [SAVEPOINT](sql-savepoint "SAVEPOINT"), [SET TRANSACTION](sql-set-transaction "SET TRANSACTION")