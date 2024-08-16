[#id](#SQL-CLOSE)

## CLOSE

CLOSE — close a cursor

## Synopsis

```
CLOSE { name | ALL }
```

[#id](#id-1.9.3.50.6)

## Description

`CLOSE` frees the resources associated with an open cursor. After the cursor is closed, no subsequent operations are allowed on it. A cursor should be closed when it is no longer needed.

Every non-holdable open cursor is implicitly closed when a transaction is terminated by `COMMIT` or `ROLLBACK`. A holdable cursor is implicitly closed if the transaction that created it aborts via `ROLLBACK`. If the creating transaction successfully commits, the holdable cursor remains open until an explicit `CLOSE` is executed, or the client disconnects.

[#id](#id-1.9.3.50.7)

## Parameters

- _`name`_

  The name of an open cursor to close.

- `ALL`

  Close all open cursors.

[#id](#id-1.9.3.50.8)

## Notes

PostgreSQL does not have an explicit `OPEN` cursor statement; a cursor is considered open when it is declared. Use the [`DECLARE`](sql-declare) statement to declare a cursor.

You can see all available cursors by querying the [`pg_cursors`](view-pg-cursors) system view.

If a cursor is closed after a savepoint which is later rolled back, the `CLOSE` is not rolled back; that is, the cursor remains closed.

[#id](#id-1.9.3.50.9)

## Examples

Close the cursor `liahona`:

```
CLOSE liahona;
```

[#id](#id-1.9.3.50.10)

## Compatibility

`CLOSE` is fully conforming with the SQL standard. `CLOSE ALL` is a PostgreSQL extension.

[#id](#id-1.9.3.50.11)

## See Also

[DECLARE](sql-declare), [FETCH](sql-fetch), [MOVE](sql-move)
