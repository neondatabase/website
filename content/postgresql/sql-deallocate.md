[#id](#SQL-DEALLOCATE)

## DEALLOCATE

DEALLOCATE — deallocate a prepared statement

## Synopsis

```
DEALLOCATE [ PREPARE ] { name | ALL }
```

[#id](#id-1.9.3.98.6)

## Description

`DEALLOCATE` is used to deallocate a previously prepared SQL statement. If you do not explicitly deallocate a prepared statement, it is deallocated when the session ends.

For more information on prepared statements, see [PREPARE](sql-prepare).

[#id](#id-1.9.3.98.7)

## Parameters

- `PREPARE`

  This key word is ignored.

- _`name`_

  The name of the prepared statement to deallocate.

- `ALL`

  Deallocate all prepared statements.

[#id](#id-1.9.3.98.8)

## Compatibility

The SQL standard includes a `DEALLOCATE` statement, but it is only for use in embedded SQL.

[#id](#id-1.9.3.98.9)

## See Also

[EXECUTE](sql-execute), [PREPARE](sql-prepare)
