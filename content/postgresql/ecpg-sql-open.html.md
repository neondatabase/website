<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                          OPEN                          |                                                             |                              |                                                       |                                          |
| :----------------------------------------------------: | :---------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | ---------------------------------------: |
| [Prev](ecpg-sql-get-descriptor.html "GET DESCRIPTOR")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") | 36.14. Embedded SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](ecpg-sql-prepare.html "PREPARE") |

***

## OPEN

OPEN — open a dynamic cursor

## Synopsis

    OPEN cursor_name
    OPEN cursor_name USING value [, ... ]
    OPEN cursor_name USING SQL DESCRIPTOR descriptor_name

## Description

`OPEN` opens a cursor and optionally binds actual values to the placeholders in the cursor's declaration. The cursor must previously have been declared with the `DECLARE` command. The execution of `OPEN` causes the query to start executing on the server.

## Parameters

* *`cursor_name`* [#](#ECPG-SQL-OPEN-CURSOR-NAME)

    The name of the cursor to be opened. This can be an SQL identifier or a host variable.

* *`value`* [#](#ECPG-SQL-OPEN-VALUE)

    A value to be bound to a placeholder in the cursor. This can be an SQL constant, a host variable, or a host variable with indicator.

* *`descriptor_name`* [#](#ECPG-SQL-OPEN-DESCRIPTOR-NAME)

    The name of a descriptor containing values to be bound to the placeholders in the cursor. This can be an SQL identifier or a host variable.

## Examples

    EXEC SQL OPEN a;
    EXEC SQL OPEN d USING 1, 'test';
    EXEC SQL OPEN c1 USING SQL DESCRIPTOR mydesc;
    EXEC SQL OPEN :curname1;

## Compatibility

`OPEN` is specified in the SQL standard.

## See Also

[DECLARE](ecpg-sql-declare.html "DECLARE"), [CLOSE](sql-close.html "CLOSE")

***

|                                                        |                                                             |                                          |
| :----------------------------------------------------- | :---------------------------------------------------------: | ---------------------------------------: |
| [Prev](ecpg-sql-get-descriptor.html "GET DESCRIPTOR")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") |  [Next](ecpg-sql-prepare.html "PREPARE") |
| GET DESCRIPTOR                                         |    [Home](index.html "PostgreSQL 17devel Documentation")    |                                  PREPARE |
