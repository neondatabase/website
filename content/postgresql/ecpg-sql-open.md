## OPEN

OPEN — open a dynamic cursor

## Synopsis

```

OPEN cursor_name
OPEN cursor_name USING value [, ... ]
OPEN cursor_name USING SQL DESCRIPTOR descriptor_name
```

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

```

EXEC SQL OPEN a;
EXEC SQL OPEN d USING 1, 'test';
EXEC SQL OPEN c1 USING SQL DESCRIPTOR mydesc;
EXEC SQL OPEN :curname1;
```

## Compatibility

`OPEN` is specified in the SQL standard.

## See Also

[DECLARE](ecpg-sql-declare "DECLARE"), [CLOSE](sql-close "CLOSE")