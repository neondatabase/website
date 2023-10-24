<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|            DROP USER MAPPING           |                                        |              |                                                       |                                        |
| :------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -------------------------------------: |
| [Prev](sql-dropuser.html "DROP USER")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-dropview.html "DROP VIEW") |

***

[]()

## DROP USER MAPPING

DROP USER MAPPING — remove a user mapping for a foreign server

## Synopsis

    DROP USER MAPPING [ IF EXISTS ] FOR { user_name | USER | CURRENT_ROLE | CURRENT_USER | PUBLIC } SERVER server_name

## Description

`DROP USER MAPPING` removes an existing user mapping from foreign server.

The owner of a foreign server can drop user mappings for that server for any user. Also, a user can drop a user mapping for their own user name if `USAGE` privilege on the server has been granted to the user.

## Parameters

*   `IF EXISTS`

    Do not throw an error if the user mapping does not exist. A notice is issued in this case.

*   *`user_name`*

    User name of the mapping. `CURRENT_ROLE`, `CURRENT_USER`, and `USER` match the name of the current user. `PUBLIC` is used to match all present and future user names in the system.

*   *`server_name`*

    Server name of the user mapping.

## Examples

Drop a user mapping `bob`, server `foo` if it exists:

    DROP USER MAPPING IF EXISTS FOR bob SERVER foo;

## Compatibility

`DROP USER MAPPING` conforms to ISO/IEC 9075-9 (SQL/MED). The `IF EXISTS` clause is a PostgreSQL extension.

## See Also

[CREATE USER MAPPING](sql-createusermapping.html "CREATE USER MAPPING"), [ALTER USER MAPPING](sql-alterusermapping.html "ALTER USER MAPPING")

***

|                                        |                                                       |                                        |
| :------------------------------------- | :---------------------------------------------------: | -------------------------------------: |
| [Prev](sql-dropuser.html "DROP USER")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-dropview.html "DROP VIEW") |
| DROP USER                              | [Home](index.html "PostgreSQL 17devel Documentation") |                              DROP VIEW |
