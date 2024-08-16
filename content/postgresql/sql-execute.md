[#id](#SQL-EXECUTE)

## EXECUTE

EXECUTE — execute a prepared statement

## Synopsis

```
EXECUTE name [ ( parameter [, ...] ) ]
```

[#id](#id-1.9.3.147.6)

## Description

`EXECUTE` is used to execute a previously prepared statement. Since prepared statements only exist for the duration of a session, the prepared statement must have been created by a `PREPARE` statement executed earlier in the current session.

If the `PREPARE` statement that created the statement specified some parameters, a compatible set of parameters must be passed to the `EXECUTE` statement, or else an error is raised. Note that (unlike functions) prepared statements are not overloaded based on the type or number of their parameters; the name of a prepared statement must be unique within a database session.

For more information on the creation and usage of prepared statements, see [PREPARE](sql-prepare).

[#id](#id-1.9.3.147.7)

## Parameters

- _`name`_

  The name of the prepared statement to execute.

- _`parameter`_

  The actual value of a parameter to the prepared statement. This must be an expression yielding a value that is compatible with the data type of this parameter, as was determined when the prepared statement was created.

[#id](#id-1.9.3.147.8)

## Outputs

The command tag returned by `EXECUTE` is that of the prepared statement, and not `EXECUTE`.

[#id](#id-1.9.3.147.9)

## Examples

Examples are given in [Examples](sql-prepare#SQL-PREPARE-EXAMPLES) in the [PREPARE](sql-prepare) documentation.

[#id](#id-1.9.3.147.10)

## Compatibility

The SQL standard includes an `EXECUTE` statement, but it is only for use in embedded SQL. This version of the `EXECUTE` statement also uses a somewhat different syntax.

[#id](#id-1.9.3.147.11)

## See Also

[DEALLOCATE](sql-deallocate), [PREPARE](sql-prepare)
