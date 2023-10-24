<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                DROP USER               |                                        |              |                                                       |                                                       |
| :------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ----------------------------------------------------: |
| [Prev](sql-droptype.html "DROP TYPE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-dropusermapping.html "DROP USER MAPPING") |

***

[]()

## DROP USER

DROP USER — remove a database role

## Synopsis

    DROP USER [ IF EXISTS ] name [, ...]

## Description

`DROP USER` is simply an alternate spelling of [`DROP ROLE`](sql-droprole.html "DROP ROLE").

## Compatibility

The `DROP USER` statement is a PostgreSQL extension. The SQL standard leaves the definition of users to the implementation.

## See Also

[DROP ROLE](sql-droprole.html "DROP ROLE")

***

|                                        |                                                       |                                                       |
| :------------------------------------- | :---------------------------------------------------: | ----------------------------------------------------: |
| [Prev](sql-droptype.html "DROP TYPE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-dropusermapping.html "DROP USER MAPPING") |
| DROP TYPE                              | [Home](index.html "PostgreSQL 17devel Documentation") |                                     DROP USER MAPPING |
