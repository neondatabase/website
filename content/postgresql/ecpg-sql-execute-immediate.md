[#id](#ECPG-SQL-EXECUTE-IMMEDIATE)

## EXECUTE IMMEDIATE

EXECUTE IMMEDIATE — dynamically prepare and execute a statement

## Synopsis

```

EXECUTE IMMEDIATE string
```

[#id](#id-1.7.5.20.10.3)

## Description

`EXECUTE IMMEDIATE` immediately prepares and executes a dynamically specified SQL statement, without retrieving result rows.

[#id](#id-1.7.5.20.10.4)

## Parameters

- _`string`_ [#](#ECPG-SQL-EXECUTE-IMMEDIATE-STRING)

  A literal string or a host variable containing the SQL statement to be executed.

[#id](#id-1.7.5.20.10.5)

## Notes

In typical usage, the _`string`_ is a host variable reference to a string containing a dynamically-constructed SQL statement. The case of a literal string is not very useful; you might as well just write the SQL statement directly, without the extra typing of `EXECUTE IMMEDIATE`.

If you do use a literal string, keep in mind that any double quotes you might wish to include in the SQL statement must be written as octal escapes (`\042`) not the usual C idiom `\"`. This is because the string is inside an `EXEC SQL` section, so the ECPG lexer parses it according to SQL rules not C rules. Any embedded backslashes will later be handled according to C rules; but `\"` causes an immediate syntax error because it is seen as ending the literal.

[#id](#id-1.7.5.20.10.6)

## Examples

Here is an example that executes an `INSERT` statement using `EXECUTE IMMEDIATE` and a host variable named `command`:

```

sprintf(command, "INSERT INTO test (name, amount, letter) VALUES ('db: ''r1''', 1, 'f')");
EXEC SQL EXECUTE IMMEDIATE :command;
```

[#id](#id-1.7.5.20.10.7)

## Compatibility

`EXECUTE IMMEDIATE` is specified in the SQL standard.
