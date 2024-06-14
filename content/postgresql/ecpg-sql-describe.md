[#id](#ECPG-SQL-DESCRIBE)

## DESCRIBE

DESCRIBE — obtain information about a prepared statement or result set

## Synopsis

```

DESCRIBE [ OUTPUT ] prepared_name USING [ SQL ] DESCRIPTOR descriptor_name
DESCRIBE [ OUTPUT ] prepared_name INTO [ SQL ] DESCRIPTOR descriptor_name
DESCRIBE [ OUTPUT ] prepared_name INTO sqlda_name
```

[#id](#id-1.7.5.20.8.3)

## Description

`DESCRIBE` retrieves metadata information about the result columns contained in a prepared statement, without actually fetching a row.

[#id](#id-1.7.5.20.8.4)

## Parameters

- _`prepared_name`_ [#](#ECPG-SQL-DESCRIBE-PREPARED-NAME)

  The name of a prepared statement. This can be an SQL identifier or a host variable.

- _`descriptor_name`_ [#](#ECPG-SQL-DESCRIBE-DESCRIPTOR-NAME)

  A descriptor name. It is case sensitive. It can be an SQL identifier or a host variable.

- _`sqlda_name`_ [#](#ECPG-SQL-DESCRIBE-SQLDA-NAME)

  The name of an SQLDA variable.

[#id](#id-1.7.5.20.8.5)

## Examples

```

EXEC SQL ALLOCATE DESCRIPTOR mydesc;
EXEC SQL PREPARE stmt1 FROM :sql_stmt;
EXEC SQL DESCRIBE stmt1 INTO SQL DESCRIPTOR mydesc;
EXEC SQL GET DESCRIPTOR mydesc VALUE 1 :charvar = NAME;
EXEC SQL DEALLOCATE DESCRIPTOR mydesc;
```

[#id](#id-1.7.5.20.8.6)

## Compatibility

`DESCRIBE` is specified in the SQL standard.

[#id](#id-1.7.5.20.8.7)

## See Also

[ALLOCATE DESCRIPTOR](ecpg-sql-allocate-descriptor), [GET DESCRIPTOR](ecpg-sql-get-descriptor)
