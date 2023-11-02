## DROP USER

DROP USER — remove a database role

## Synopsis

```

DROP USER [ IF EXISTS ] name [, ...]
```

## Description

`DROP USER` is simply an alternate spelling of [`DROP ROLE`](sql-droprole.html "DROP ROLE").

## Compatibility

The `DROP USER` statement is a PostgreSQL extension. The SQL standard leaves the definition of users to the implementation.

## See Also

[DROP ROLE](sql-droprole.html "DROP ROLE")