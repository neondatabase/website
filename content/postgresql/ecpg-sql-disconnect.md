[#id](#ECPG-SQL-DISCONNECT)

## DISCONNECT

DISCONNECT — terminate a database connection

## Synopsis

```

DISCONNECT connection_name
DISCONNECT [ CURRENT ]
DISCONNECT DEFAULT
DISCONNECT ALL
```

[#id](#id-1.7.5.20.9.3)

## Description

`DISCONNECT` closes a connection (or all connections) to the database.

[#id](#id-1.7.5.20.9.4)

## Parameters

- _`connection_name`_ [#](#ECPG-SQL-DISCONNECT-CONNECTION-NAME)

  A database connection name established by the `CONNECT` command.

- `CURRENT` [#](#ECPG-SQL-DISCONNECT-CURRENT)

  Close the “current” connection, which is either the most recently opened connection, or the connection set by the `SET CONNECTION` command. This is also the default if no argument is given to the `DISCONNECT` command.

- `DEFAULT` [#](#ECPG-SQL-DISCONNECT-DEFAULT)

  Close the default connection.

- `ALL` [#](#ECPG-SQL-DISCONNECT-ALL)

  Close all open connections.

[#id](#id-1.7.5.20.9.5)

## Examples

```

int
main(void)
{
    EXEC SQL CONNECT TO testdb AS DEFAULT USER testuser;
    EXEC SQL CONNECT TO testdb AS con1 USER testuser;
    EXEC SQL CONNECT TO testdb AS con2 USER testuser;
    EXEC SQL CONNECT TO testdb AS con3 USER testuser;

    EXEC SQL DISCONNECT CURRENT;  /* close con3          */
    EXEC SQL DISCONNECT DEFAULT;  /* close DEFAULT       */
    EXEC SQL DISCONNECT ALL;      /* close con2 and con1 */

    return 0;
}
```

[#id](#id-1.7.5.20.9.6)

## Compatibility

`DISCONNECT` is specified in the SQL standard.

[#id](#id-1.7.5.20.9.7)

## See Also

[CONNECT](ecpg-sql-connect), [SET CONNECTION](ecpg-sql-set-connection)
