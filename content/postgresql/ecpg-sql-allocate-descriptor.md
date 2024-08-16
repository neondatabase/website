[#id](#ECPG-SQL-ALLOCATE-DESCRIPTOR)

## ALLOCATE DESCRIPTOR

ALLOCATE DESCRIPTOR — allocate an SQL descriptor area

## Synopsis

```

ALLOCATE DESCRIPTOR name
```

[#id](#id-1.7.5.20.3.3)

## Description

`ALLOCATE DESCRIPTOR` allocates a new named SQL descriptor area, which can be used to exchange data between the PostgreSQL server and the host program.

Descriptor areas should be freed after use using the `DEALLOCATE DESCRIPTOR` command.

[#id](#id-1.7.5.20.3.4)

## Parameters

- _`name`_ [#](#ECPG-SQL-ALLOCATE-DESCRIPTOR-NAME)

  A name of SQL descriptor, case sensitive. This can be an SQL identifier or a host variable.

[#id](#id-1.7.5.20.3.5)

## Examples

```

EXEC SQL ALLOCATE DESCRIPTOR mydesc;
```

[#id](#id-1.7.5.20.3.6)

## Compatibility

`ALLOCATE DESCRIPTOR` is specified in the SQL standard.

[#id](#id-1.7.5.20.3.7)

## See Also

[DEALLOCATE DESCRIPTOR](ecpg-sql-deallocate-descriptor), [GET DESCRIPTOR](ecpg-sql-get-descriptor), [SET DESCRIPTOR](ecpg-sql-set-descriptor)
