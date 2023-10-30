## PREPARE

PREPARE — prepare a statement for execution

## Synopsis

```

PREPARE prepared_name FROM string
```

## Description

`PREPARE` prepares a statement dynamically specified as a string for execution. This is different from the direct SQL statement [PREPARE](sql-prepare.html "PREPARE"), which can also be used in embedded programs. The [EXECUTE](sql-execute.html "EXECUTE") command is used to execute either kind of prepared statement.

## Parameters

* *`prepared_name`* [#](#ECPG-SQL-PREPARE-PREPARED-NAME)

    An identifier for the prepared query.

* *`string`* [#](#ECPG-SQL-PREPARE-STRING)

    A literal string or a host variable containing a preparable SQL statement, one of SELECT, INSERT, UPDATE, or DELETE. Use question marks (`?`) for parameter values to be supplied at execution.

## Notes

In typical usage, the *`string`* is a host variable reference to a string containing a dynamically-constructed SQL statement. The case of a literal string is not very useful; you might as well just write a direct SQL `PREPARE` statement.

If you do use a literal string, keep in mind that any double quotes you might wish to include in the SQL statement must be written as octal escapes (`\042`) not the usual C idiom `\"`. This is because the string is inside an `EXEC SQL` section, so the ECPG lexer parses it according to SQL rules not C rules. Any embedded backslashes will later be handled according to C rules; but `\"` causes an immediate syntax error because it is seen as ending the literal.

## Examples

```

char *stmt = "SELECT * FROM test1 WHERE a = ? AND b = ?";

EXEC SQL ALLOCATE DESCRIPTOR outdesc;
EXEC SQL PREPARE foo FROM :stmt;

EXEC SQL EXECUTE foo USING SQL DESCRIPTOR indesc INTO SQL DESCRIPTOR outdesc;
```

## Compatibility

`PREPARE` is specified in the SQL standard.

## See Also

[EXECUTE](sql-execute.html "EXECUTE")