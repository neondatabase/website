[#id](#SQL-END)

## END

END — commit the current transaction

## Synopsis

```
END [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
```

[#id](#id-1.9.3.146.5)

## Description

`END` commits the current transaction. All changes made by the transaction become visible to others and are guaranteed to be durable if a crash occurs. This command is a PostgreSQL extension that is equivalent to [`COMMIT`](sql-commit).

[#id](#id-1.9.3.146.6)

## Parameters

- `WORK``TRANSACTION`

  Optional key words. They have no effect.

- `AND CHAIN`

  If `AND CHAIN` is specified, a new transaction is immediately started with the same transaction characteristics (see [SET TRANSACTION](sql-set-transaction)) as the just finished one. Otherwise, no new transaction is started.

[#id](#id-1.9.3.146.7)

## Notes

Use [`ROLLBACK`](sql-rollback) to abort a transaction.

Issuing `END` when not inside a transaction does no harm, but it will provoke a warning message.

[#id](#id-1.9.3.146.8)

## Examples

To commit the current transaction and make all changes permanent:

```
END;
```

[#id](#id-1.9.3.146.9)

## Compatibility

`END` is a PostgreSQL extension that provides functionality equivalent to [`COMMIT`](sql-commit), which is specified in the SQL standard.

[#id](#id-1.9.3.146.10)

## See Also

[BEGIN](sql-begin), [COMMIT](sql-commit), [ROLLBACK](sql-rollback)
