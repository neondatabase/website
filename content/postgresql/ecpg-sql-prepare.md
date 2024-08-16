[#id](#ECPG-SQL-PREPARE)

## PREPARE

PREPARE — prepare a statement for execution

## Synopsis

```

PREPARE prepared_name FROM string
```

[#id](#id-1.7.5.20.13.3)

## Description

`PREPARE` prepares a statement dynamically specified as a string for execution. This is different from the direct SQL statement [PREPARE](sql-prepare), which can also be used in embedded programs. The [EXECUTE](sql-execute) command is used to execute either kind of prepared statement.

[#id](#id-1.7.5.20.13.4)

## Parameters

- _`prepared_name`_ [#](#ECPG-SQL-PREPARE-PREPARED-NAME)

  An identifier for the prepared query.

- _`string`_ [#](#ECPG-SQL-PREPARE-STRING)

  A literal string or a host variable containing a preparable SQL statement, one of SELECT, INSERT, UPDATE, or DELETE. Use question marks (`?`) for parameter values to be supplied at execution.

[#id](#id-1.7.5.20.13.5)

## Notes

In typical usage, the _`string`_ is a host variable reference to a string containing a dynamically-constructed SQL statement. The case of a literal string is not very useful; you might as well just write a direct SQL `PREPARE` statement.

If you do use a literal string, keep in mind that any double quotes you might wish to include in the SQL statement must be written as octal escapes (`\042`) not the usual C idiom `\"`. This is because the string is inside an `EXEC SQL` section, so the ECPG lexer parses it according to SQL rules not C rules. Any embedded backslashes will later be handled according to C rules; but `\"` causes an immediate syntax error because it is seen as ending the literal.

[#id](#id-1.7.5.20.13.6)

## Examples

```

char *stmt = "SELECT * FROM test1 WHERE a = ? AND b = ?";

EXEC SQL ALLOCATE DESCRIPTOR outdesc;
EXEC SQL PREPARE foo FROM :stmt;

EXEC SQL EXECUTE foo USING SQL DESCRIPTOR indesc INTO SQL DESCRIPTOR outdesc;
```

[#id](#id-1.7.5.20.13.7)

## Compatibility

`PREPARE` is specified in the SQL standard.

[#id](#id-1.7.5.20.13.8)

## See Also

[EXECUTE](sql-execute)
