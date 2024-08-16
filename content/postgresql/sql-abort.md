[#id](#SQL-ABORT)

## ABORT

ABORT — abort the current transaction

## Synopsis

```
ABORT [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
```

[#id](#id-1.9.3.3.5)

## Description

`ABORT` rolls back the current transaction and causes all the updates made by the transaction to be discarded. This command is identical in behavior to the standard SQL command [`ROLLBACK`](sql-rollback), and is present only for historical reasons.

[#id](#id-1.9.3.3.6)

## Parameters

- `WORK``TRANSACTION`

  Optional key words. They have no effect.

- `AND CHAIN`

  If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [`SET TRANSACTION`](sql-set-transaction)) as the just finished one. Otherwise, no new transaction is started.

[#id](#id-1.9.3.3.7)

## Notes

Use [`COMMIT`](sql-commit) to successfully terminate a transaction.

Issuing `ABORT` outside of a transaction block emits a warning and otherwise has no effect.

[#id](#id-1.9.3.3.8)

## Examples

To abort all changes:

```
ABORT;
```

[#id](#id-1.9.3.3.9)

## Compatibility

This command is a PostgreSQL extension present for historical reasons. `ROLLBACK` is the equivalent standard SQL command.

[#id](#id-1.9.3.3.10)

## See Also

[BEGIN](sql-begin), [COMMIT](sql-commit), [ROLLBACK](sql-rollback)
