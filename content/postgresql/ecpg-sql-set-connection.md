[#id](#ECPG-SQL-SET-CONNECTION)

## SET CONNECTION

SET CONNECTION — select a database connection

## Synopsis

```

SET CONNECTION [ TO | = ] connection_name
```

[#id](#id-1.7.5.20.15.3)

## Description

`SET CONNECTION` sets the “current” database connection, which is the one that all commands use unless overridden.

[#id](#id-1.7.5.20.15.4)

## Parameters

- _`connection_name`_ [#](#ECPG-SQL-SET-CONNECTION-CONNECTION-NAME)

  A database connection name established by the `CONNECT` command.

- `DEFAULT` [#](#ECPG-SQL-SET-CONNECTION-DEFAULT)

  Set the connection to the default connection.

[#id](#id-1.7.5.20.15.5)

## Examples

```

EXEC SQL SET CONNECTION TO con2;
EXEC SQL SET CONNECTION = con1;
```

[#id](#id-1.7.5.20.15.6)

## Compatibility

`SET CONNECTION` is specified in the SQL standard.

[#id](#id-1.7.5.20.15.7)

## See Also

[CONNECT](ecpg-sql-connect), [DISCONNECT](ecpg-sql-disconnect)
