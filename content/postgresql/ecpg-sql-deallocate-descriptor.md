[#id](#ECPG-SQL-DEALLOCATE-DESCRIPTOR)

## DEALLOCATE DESCRIPTOR

DEALLOCATE DESCRIPTOR — deallocate an SQL descriptor area

## Synopsis

```

DEALLOCATE DESCRIPTOR name
```

[#id](#id-1.7.5.20.5.3)

## Description

`DEALLOCATE DESCRIPTOR` deallocates a named SQL descriptor area.

[#id](#id-1.7.5.20.5.4)

## Parameters

- _`name`_ [#](#ECPG-SQL-DEALLOCATE-DESCRIPTOR-NAME)

  The name of the descriptor which is going to be deallocated. It is case sensitive. This can be an SQL identifier or a host variable.

[#id](#id-1.7.5.20.5.5)

## Examples

```

EXEC SQL DEALLOCATE DESCRIPTOR mydesc;
```

[#id](#id-1.7.5.20.5.6)

## Compatibility

`DEALLOCATE DESCRIPTOR` is specified in the SQL standard.

[#id](#id-1.7.5.20.5.7)

## See Also

[ALLOCATE DESCRIPTOR](ecpg-sql-allocate-descriptor), [GET DESCRIPTOR](ecpg-sql-get-descriptor), [SET DESCRIPTOR](ecpg-sql-set-descriptor)
