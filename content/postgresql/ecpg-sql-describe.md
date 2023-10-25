<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                           DESCRIBE                           |                                                             |                              |                                                       |                                                |
| :----------------------------------------------------------: | :---------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | ---------------------------------------------: |
| [Prev](ecpg-sql-declare-statement.html "DECLARE STATEMENT")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") | 36.14. Embedded SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](ecpg-sql-disconnect.html "DISCONNECT") |

***

## DESCRIBE

DESCRIBE — obtain information about a prepared statement or result set

## Synopsis

```

DESCRIBE [ OUTPUT ] prepared_name USING [ SQL ] DESCRIPTOR descriptor_name
DESCRIBE [ OUTPUT ] prepared_name INTO [ SQL ] DESCRIPTOR descriptor_name
DESCRIBE [ OUTPUT ] prepared_name INTO sqlda_name
```

## Description

`DESCRIBE` retrieves metadata information about the result columns contained in a prepared statement, without actually fetching a row.

## Parameters

* *`prepared_name`* [#](#ECPG-SQL-DESCRIBE-PREPARED-NAME)

    The name of a prepared statement. This can be an SQL identifier or a host variable.

* *`descriptor_name`* [#](#ECPG-SQL-DESCRIBE-DESCRIPTOR-NAME)

    A descriptor name. It is case sensitive. It can be an SQL identifier or a host variable.

* *`sqlda_name`* [#](#ECPG-SQL-DESCRIBE-SQLDA-NAME)

    The name of an SQLDA variable.

## Examples

```

EXEC SQL ALLOCATE DESCRIPTOR mydesc;
EXEC SQL PREPARE stmt1 FROM :sql_stmt;
EXEC SQL DESCRIBE stmt1 INTO SQL DESCRIPTOR mydesc;
EXEC SQL GET DESCRIPTOR mydesc VALUE 1 :charvar = NAME;
EXEC SQL DEALLOCATE DESCRIPTOR mydesc;
```

## Compatibility

`DESCRIBE` is specified in the SQL standard.

## See Also

[ALLOCATE DESCRIPTOR](ecpg-sql-allocate-descriptor.html "ALLOCATE DESCRIPTOR"), [GET DESCRIPTOR](ecpg-sql-get-descriptor.html "GET DESCRIPTOR")

***

|                                                              |                                                             |                                                |
| :----------------------------------------------------------- | :---------------------------------------------------------: | ---------------------------------------------: |
| [Prev](ecpg-sql-declare-statement.html "DECLARE STATEMENT")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") |  [Next](ecpg-sql-disconnect.html "DISCONNECT") |
| DECLARE STATEMENT                                            |    [Home](index.html "PostgreSQL 17devel Documentation")    |                                     DISCONNECT |
