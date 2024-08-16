[#id](#SQL-DROPFUNCTION)

## DROP FUNCTION

DROP FUNCTION — remove a function

## Synopsis

```
DROP FUNCTION [ IF EXISTS ] name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ] [, ...]
    [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.114.5)

## Description

`DROP FUNCTION` removes the definition of an existing function. To execute this command the user must be the owner of the function. The argument types to the function must be specified, since several different functions can exist with the same name and different argument lists.

[#id](#id-1.9.3.114.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the function does not exist. A notice is issued in this case.

- _`name`_

  The name (optionally schema-qualified) of an existing function. If no argument list is specified, the name must be unique in its schema.

- _`argmode`_

  The mode of an argument: `IN`, `OUT`, `INOUT`, or `VARIADIC`. If omitted, the default is `IN`. Note that `DROP FUNCTION` does not actually pay any attention to `OUT` arguments, since only the input arguments are needed to determine the function's identity. So it is sufficient to list the `IN`, `INOUT`, and `VARIADIC` arguments.

- _`argname`_

  The name of an argument. Note that `DROP FUNCTION` does not actually pay any attention to argument names, since only the argument data types are needed to determine the function's identity.

- _`argtype`_

  The data type(s) of the function's arguments (optionally schema-qualified), if any.

- `CASCADE`

  Automatically drop objects that depend on the function (such as operators or triggers), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the function if any objects depend on it. This is the default.

[#id](#SQL-DROPFUNCTION-EXAMPLES)

## Examples

This command removes the square root function:

```
DROP FUNCTION sqrt(integer);
```

Drop multiple functions in one command:

```
DROP FUNCTION sqrt(integer), sqrt(bigint);
```

If the function name is unique in its schema, it can be referred to without an argument list:

```
DROP FUNCTION update_employee_salaries;
```

Note that this is different from

```
DROP FUNCTION update_employee_salaries();
```

which refers to a function with zero arguments, whereas the first variant can refer to a function with any number of arguments, including zero, as long as the name is unique.

[#id](#SQL-DROPFUNCTION-COMPATIBILITY)

## Compatibility

This command conforms to the SQL standard, with these PostgreSQL extensions:

- The standard only allows one function to be dropped per command.

- The `IF EXISTS` option

- The ability to specify argument modes and names

[#id](#id-1.9.3.114.9)

## See Also

[CREATE FUNCTION](sql-createfunction), [ALTER FUNCTION](sql-alterfunction), [DROP PROCEDURE](sql-dropprocedure), [DROP ROUTINE](sql-droproutine)
