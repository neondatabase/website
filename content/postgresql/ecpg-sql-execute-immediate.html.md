<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                EXECUTE IMMEDIATE               |                                                             |                              |                                                       |                                                        |
| :--------------------------------------------: | :---------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | -----------------------------------------------------: |
| [Prev](ecpg-sql-disconnect.html "DISCONNECT")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") | 36.14. Embedded SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](ecpg-sql-get-descriptor.html "GET DESCRIPTOR") |

***

## EXECUTE IMMEDIATE

EXECUTE IMMEDIATE — dynamically prepare and execute a statement

## Synopsis

    EXECUTE IMMEDIATE string

## Description

`EXECUTE IMMEDIATE` immediately prepares and executes a dynamically specified SQL statement, without retrieving result rows.

## Parameters

*   *`string`* [#](#ECPG-SQL-EXECUTE-IMMEDIATE-STRING)

    A literal string or a host variable containing the SQL statement to be executed.

## Notes

In typical usage, the *`string`* is a host variable reference to a string containing a dynamically-constructed SQL statement. The case of a literal string is not very useful; you might as well just write the SQL statement directly, without the extra typing of `EXECUTE IMMEDIATE`.

If you do use a literal string, keep in mind that any double quotes you might wish to include in the SQL statement must be written as octal escapes (`\042`) not the usual C idiom `\"`. This is because the string is inside an `EXEC SQL` section, so the ECPG lexer parses it according to SQL rules not C rules. Any embedded backslashes will later be handled according to C rules; but `\"` causes an immediate syntax error because it is seen as ending the literal.

## Examples

Here is an example that executes an `INSERT` statement using `EXECUTE IMMEDIATE` and a host variable named `command`:

    sprintf(command, "INSERT INTO test (name, amount, letter) VALUES ('db: ''r1''', 1, 'f')");
    EXEC SQL EXECUTE IMMEDIATE :command;

## Compatibility

`EXECUTE IMMEDIATE` is specified in the SQL standard.

***

|                                                |                                                             |                                                        |
| :--------------------------------------------- | :---------------------------------------------------------: | -----------------------------------------------------: |
| [Prev](ecpg-sql-disconnect.html "DISCONNECT")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") |  [Next](ecpg-sql-get-descriptor.html "GET DESCRIPTOR") |
| DISCONNECT                                     |    [Home](index.html "PostgreSQL 17devel Documentation")    |                                         GET DESCRIPTOR |
