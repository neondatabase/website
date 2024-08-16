[#id](#SQL-ROLLBACK)

## ROLLBACK

ROLLBACK — abort the current transaction

## Synopsis

```
ROLLBACK [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
```

[#id](#id-1.9.3.167.5)

## Description

`ROLLBACK` rolls back the current transaction and causes all the updates made by the transaction to be discarded.

[#id](#id-1.9.3.167.6)

## Parameters

- `WORK``TRANSACTION` [#](#SQL-ROLLBACK-TRANSACTION)

  Optional key words. They have no effect.

- `AND CHAIN` [#](#SQL-ROLLBACK-CHAIN)

  If `AND CHAIN` is specified, a new (not aborted) transaction is immediately started with the same transaction characteristics (see [SET TRANSACTION](sql-set-transaction)) as the just finished one. Otherwise, no new transaction is started.

[#id](#id-1.9.3.167.7)

## Notes

Use [`COMMIT`](sql-commit) to successfully terminate a transaction.

Issuing `ROLLBACK` outside of a transaction block emits a warning and otherwise has no effect. `ROLLBACK AND CHAIN` outside of a transaction block is an error.

[#id](#id-1.9.3.167.8)

## Examples

To abort all changes:

```
ROLLBACK;
```

[#id](#id-1.9.3.167.9)

## Compatibility

The command `ROLLBACK` conforms to the SQL standard. The form `ROLLBACK TRANSACTION` is a PostgreSQL extension.

[#id](#id-1.9.3.167.10)

## See Also

[BEGIN](sql-begin), [COMMIT](sql-commit), [ROLLBACK TO SAVEPOINT](sql-rollback-to)
