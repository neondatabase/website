

|                     SET CONNECTION                     |                                                             |                              |                                                       |                                                        |
| :----------------------------------------------------: | :---------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | -----------------------------------------------------: |
| [Prev](ecpg-sql-set-autocommit.html "SET AUTOCOMMIT")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") | 36.14. Embedded SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](ecpg-sql-set-descriptor.html "SET DESCRIPTOR") |

***

## SET CONNECTION

SET CONNECTION — select a database connection

## Synopsis

```

SET CONNECTION [ TO | = ] connection_name
```

## Description

`SET CONNECTION` sets the “current” database connection, which is the one that all commands use unless overridden.

## Parameters

* *`connection_name`* [#](#ECPG-SQL-SET-CONNECTION-CONNECTION-NAME)

    A database connection name established by the `CONNECT` command.

* `DEFAULT` [#](#ECPG-SQL-SET-CONNECTION-DEFAULT)

    Set the connection to the default connection.

## Examples

```

EXEC SQL SET CONNECTION TO con2;
EXEC SQL SET CONNECTION = con1;
```

## Compatibility

`SET CONNECTION` is specified in the SQL standard.

## See Also

[CONNECT](ecpg-sql-connect.html "CONNECT"), [DISCONNECT](ecpg-sql-disconnect.html "DISCONNECT")

***

|                                                        |                                                             |                                                        |
| :----------------------------------------------------- | :---------------------------------------------------------: | -----------------------------------------------------: |
| [Prev](ecpg-sql-set-autocommit.html "SET AUTOCOMMIT")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") |  [Next](ecpg-sql-set-descriptor.html "SET DESCRIPTOR") |
| SET AUTOCOMMIT                                         |    [Home](index.html "PostgreSQL 17devel Documentation")    |                                         SET DESCRIPTOR |
