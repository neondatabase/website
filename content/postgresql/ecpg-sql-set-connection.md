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

[CONNECT](ecpg-sql-connect "CONNECT"), [DISCONNECT](ecpg-sql-disconnect "DISCONNECT")