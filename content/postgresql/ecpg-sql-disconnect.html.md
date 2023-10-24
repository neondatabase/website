<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 DISCONNECT                 |                                                             |                              |                                                       |                                                              |
| :----------------------------------------: | :---------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | -----------------------------------------------------------: |
| [Prev](ecpg-sql-describe.html "DESCRIBE")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") | 36.14. Embedded SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](ecpg-sql-execute-immediate.html "EXECUTE IMMEDIATE") |

***

## DISCONNECT

DISCONNECT — terminate a database connection

## Synopsis

    DISCONNECT connection_name
    DISCONNECT [ CURRENT ]
    DISCONNECT DEFAULT
    DISCONNECT ALL

## Description

`DISCONNECT` closes a connection (or all connections) to the database.

## Parameters

*   *`connection_name`* [#](#ECPG-SQL-DISCONNECT-CONNECTION-NAME)

    A database connection name established by the `CONNECT` command.

*   `CURRENT` [#](#ECPG-SQL-DISCONNECT-CURRENT)

    Close the “current” connection, which is either the most recently opened connection, or the connection set by the `SET CONNECTION` command. This is also the default if no argument is given to the `DISCONNECT` command.

*   `DEFAULT` [#](#ECPG-SQL-DISCONNECT-DEFAULT)

    Close the default connection.

*   `ALL` [#](#ECPG-SQL-DISCONNECT-ALL)

    Close all open connections.

## Examples

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

## Compatibility

`DISCONNECT` is specified in the SQL standard.

## See Also

[CONNECT](ecpg-sql-connect.html "CONNECT"), [SET CONNECTION](ecpg-sql-set-connection.html "SET CONNECTION")

***

|                                            |                                                             |                                                              |
| :----------------------------------------- | :---------------------------------------------------------: | -----------------------------------------------------------: |
| [Prev](ecpg-sql-describe.html "DESCRIBE")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") |  [Next](ecpg-sql-execute-immediate.html "EXECUTE IMMEDIATE") |
| DESCRIBE                                   |    [Home](index.html "PostgreSQL 17devel Documentation")    |                                            EXECUTE IMMEDIATE |
