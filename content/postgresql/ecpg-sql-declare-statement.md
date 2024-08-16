[#id](#ECPG-SQL-DECLARE-STATEMENT)

## DECLARE STATEMENT

DECLARE STATEMENT — declare SQL statement identifier

## Synopsis

```

EXEC SQL [ AT connection_name ] DECLARE statement_name STATEMENT
```

[#id](#id-1.7.5.20.7.3)

## Description

`DECLARE STATEMENT` declares an SQL statement identifier. SQL statement identifier can be associated with the connection. When the identifier is used by dynamic SQL statements, the statements are executed using the associated connection. The namespace of the declaration is the precompile unit, and multiple declarations to the same SQL statement identifier are not allowed. Note that if the precompiler runs in Informix compatibility mode and some SQL statement is declared, "database" can not be used as a cursor name.

[#id](#id-1.7.5.20.7.4)

## Parameters

- _`connection_name`_ [#](#ECPG-SQL-DECLARE-STATEMENT-CONNECTION-NAME)

  A database connection name established by the `CONNECT` command.

  AT clause can be omitted, but such statement has no meaning.

* _`statement_name`_ [#](#ECPG-SQL-DECLARE-STATEMENT-STATEMENT-NAME)

  The name of an SQL statement identifier, either as an SQL identifier or a host variable.

[#id](#id-1.7.5.20.7.5)

## Notes

This association is valid only if the declaration is physically placed on top of a dynamic statement.

[#id](#id-1.7.5.20.7.6)

## Examples

```

EXEC SQL CONNECT TO postgres AS con1;
EXEC SQL AT con1 DECLARE sql_stmt STATEMENT;
EXEC SQL DECLARE cursor_name CURSOR FOR sql_stmt;
EXEC SQL PREPARE sql_stmt FROM :dyn_string;
EXEC SQL OPEN cursor_name;
EXEC SQL FETCH cursor_name INTO :column1;
EXEC SQL CLOSE cursor_name;
```

[#id](#id-1.7.5.20.7.7)

## Compatibility

`DECLARE STATEMENT` is an extension of the SQL standard, but can be used in famous DBMSs.

[#id](#id-1.7.5.20.7.8)

## See Also

[CONNECT](ecpg-sql-connect), [DECLARE](ecpg-sql-declare), [OPEN](ecpg-sql-open)
