## DEALLOCATE DESCRIPTOR

DEALLOCATE DESCRIPTOR — deallocate an SQL descriptor area

## Synopsis

```

DEALLOCATE DESCRIPTOR name
```

## Description

`DEALLOCATE DESCRIPTOR` deallocates a named SQL descriptor area.

## Parameters

* *`name`* [#](#ECPG-SQL-DEALLOCATE-DESCRIPTOR-NAME)

    The name of the descriptor which is going to be deallocated. It is case sensitive. This can be an SQL identifier or a host variable.

## Examples

```

EXEC SQL DEALLOCATE DESCRIPTOR mydesc;
```

## Compatibility

`DEALLOCATE DESCRIPTOR` is specified in the SQL standard.

## See Also

[ALLOCATE DESCRIPTOR](ecpg-sql-allocate-descriptor.html "ALLOCATE DESCRIPTOR"), [GET DESCRIPTOR](ecpg-sql-get-descriptor.html "GET DESCRIPTOR"), [SET DESCRIPTOR](ecpg-sql-set-descriptor.html "SET DESCRIPTOR")