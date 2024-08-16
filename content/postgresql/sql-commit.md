[#id](#SQL-COMMIT)

## COMMIT

COMMIT — commit the current transaction

## Synopsis

```
COMMIT [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
```

[#id](#id-1.9.3.53.5)

## Description

`COMMIT` commits the current transaction. All changes made by the transaction become visible to others and are guaranteed to be durable if a crash occurs.

[#id](#id-1.9.3.53.6)

## Parameters

- `WORK``TRANSACTION` [#](#SQL-COMMIT-TRANSACTION)

  Optional key words. They have no effect.

- `AND CHAIN` [#](#SQL-COMMIT-CHAIN)

  If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [SET TRANSACTION](sql-set-transaction)) as the just finished one. Otherwise, no new transaction is started.

[#id](#id-1.9.3.53.7)

## Notes

Use [ROLLBACK](sql-rollback) to abort a transaction.

Issuing `COMMIT` when not inside a transaction does no harm, but it will provoke a warning message. `COMMIT AND CHAIN` when not inside a transaction is an error.

[#id](#id-1.9.3.53.8)

## Examples

To commit the current transaction and make all changes permanent:

```
COMMIT;
```

[#id](#id-1.9.3.53.9)

## Compatibility

The command `COMMIT` conforms to the SQL standard. The form `COMMIT TRANSACTION` is a PostgreSQL extension.

[#id](#id-1.9.3.53.10)

## See Also

[BEGIN](sql-begin), [ROLLBACK](sql-rollback)
