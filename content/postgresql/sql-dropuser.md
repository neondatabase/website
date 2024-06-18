[#id](#SQL-DROPUSER)

## DROP USER

DROP USER — remove a database role

## Synopsis

```
DROP USER [ IF EXISTS ] name [, ...]
```

[#id](#id-1.9.3.143.5)

## Description

`DROP USER` is simply an alternate spelling of [`DROP ROLE`](sql-droprole).

[#id](#id-1.9.3.143.6)

## Compatibility

The `DROP USER` statement is a PostgreSQL extension. The SQL standard leaves the definition of users to the implementation.

[#id](#id-1.9.3.143.7)

## See Also

[DROP ROLE](sql-droprole)
