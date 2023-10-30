## ALLOCATE DESCRIPTOR

ALLOCATE DESCRIPTOR — allocate an SQL descriptor area

## Synopsis

```

ALLOCATE DESCRIPTOR name
```

## Description

`ALLOCATE DESCRIPTOR` allocates a new named SQL descriptor area, which can be used to exchange data between the PostgreSQL server and the host program.

Descriptor areas should be freed after use using the `DEALLOCATE DESCRIPTOR` command.

## Parameters

* *`name`* [#](#ECPG-SQL-ALLOCATE-DESCRIPTOR-NAME)

    A name of SQL descriptor, case sensitive. This can be an SQL identifier or a host variable.

## Examples

```

EXEC SQL ALLOCATE DESCRIPTOR mydesc;
```

## Compatibility

`ALLOCATE DESCRIPTOR` is specified in the SQL standard.

## See Also

[DEALLOCATE DESCRIPTOR](ecpg-sql-deallocate-descriptor.html "DEALLOCATE DESCRIPTOR"), [GET DESCRIPTOR](ecpg-sql-get-descriptor.html "GET DESCRIPTOR"), [SET DESCRIPTOR](ecpg-sql-set-descriptor.html "SET DESCRIPTOR")