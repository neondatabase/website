[#id](#SQL-COMMIT-PREPARED)

## COMMIT PREPARED

COMMIT PREPARED — commit a transaction that was earlier prepared for two-phase commit

## Synopsis

```
COMMIT PREPARED transaction_id
```

[#id](#id-1.9.3.54.5)

## Description

`COMMIT PREPARED` commits a transaction that is in prepared state.

[#id](#id-1.9.3.54.6)

## Parameters

- _`transaction_id`_

  The transaction identifier of the transaction that is to be committed.

[#id](#id-1.9.3.54.7)

## Notes

To commit a prepared transaction, you must be either the same user that executed the transaction originally, or a superuser. But you do not have to be in the same session that executed the transaction.

This command cannot be executed inside a transaction block. The prepared transaction is committed immediately.

All currently available prepared transactions are listed in the [`pg_prepared_xacts`](view-pg-prepared-xacts) system view.

[#id](#SQL-COMMIT-PREPARED-EXAMPLES)

## Examples

Commit the transaction identified by the transaction identifier `foobar`:

```
COMMIT PREPARED 'foobar';
```

[#id](#id-1.9.3.54.9)

## Compatibility

`COMMIT PREPARED` is a PostgreSQL extension. It is intended for use by external transaction management systems, some of which are covered by standards (such as X/Open XA), but the SQL side of those systems is not standardized.

[#id](#id-1.9.3.54.10)

## See Also

[PREPARE TRANSACTION](sql-prepare-transaction), [ROLLBACK PREPARED](sql-rollback-prepared)
