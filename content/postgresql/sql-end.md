## END

END — commit the current transaction

## Synopsis

```

END [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
```

## Description

`END` commits the current transaction. All changes made by the transaction become visible to others and are guaranteed to be durable if a crash occurs. This command is a PostgreSQL extension that is equivalent to [`COMMIT`](sql-commit "COMMIT").

## Parameters

* `WORK``TRANSACTION`

    Optional key words. They have no effect.

* `AND CHAIN`

    If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [SET TRANSACTION](sql-set-transaction "SET TRANSACTION")) as the just finished one. Otherwise, no new transaction is started.

## Notes

Use [`ROLLBACK`](sql-rollback "ROLLBACK") to abort a transaction.

Issuing `END` when not inside a transaction does no harm, but it will provoke a warning message.

## Examples

To commit the current transaction and make all changes permanent:

```

END;
```

## Compatibility

`END` is a PostgreSQL extension that provides functionality equivalent to [`COMMIT`](sql-commit "COMMIT"), which is specified in the SQL standard.

## See Also

[BEGIN](sql-begin "BEGIN"), [COMMIT](sql-commit "COMMIT"), [ROLLBACK](sql-rollback "ROLLBACK")