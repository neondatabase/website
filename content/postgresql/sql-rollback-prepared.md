[#id](#SQL-ROLLBACK-PREPARED)

## ROLLBACK PREPARED

ROLLBACK PREPARED — cancel a transaction that was earlier prepared for two-phase commit

## Synopsis

```
ROLLBACK PREPARED transaction_id
```

[#id](#id-1.9.3.168.5)

## Description

`ROLLBACK PREPARED` rolls back a transaction that is in prepared state.

[#id](#id-1.9.3.168.6)

## Parameters

- _`transaction_id`_

  The transaction identifier of the transaction that is to be rolled back.

[#id](#id-1.9.3.168.7)

## Notes

To roll back a prepared transaction, you must be either the same user that executed the transaction originally, or a superuser. But you do not have to be in the same session that executed the transaction.

This command cannot be executed inside a transaction block. The prepared transaction is rolled back immediately.

All currently available prepared transactions are listed in the [`pg_prepared_xacts`](view-pg-prepared-xacts) system view.

[#id](#SQL-ROLLBACK-PREPARED-EXAMPLES)

## Examples

Roll back the transaction identified by the transaction identifier `foobar`:

```
ROLLBACK PREPARED 'foobar';
```

[#id](#id-1.9.3.168.9)

## Compatibility

`ROLLBACK PREPARED` is a PostgreSQL extension. It is intended for use by external transaction management systems, some of which are covered by standards (such as X/Open XA), but the SQL side of those systems is not standardized.

[#id](#id-1.9.3.168.10)

## See Also

[PREPARE TRANSACTION](sql-prepare-transaction), [COMMIT PREPARED](sql-commit-prepared)
