## DECLARE

DECLARE — define a cursor

## Synopsis

```

DECLARE cursor_name [ BINARY ] [ ASENSITIVE | INSENSITIVE ] [ [ NO ] SCROLL ] CURSOR [ { WITH | WITHOUT } HOLD ] FOR prepared_name
DECLARE cursor_name [ BINARY ] [ ASENSITIVE | INSENSITIVE ] [ [ NO ] SCROLL ] CURSOR [ { WITH | WITHOUT } HOLD ] FOR query
```

## Description

`DECLARE` declares a cursor for iterating over the result set of a prepared statement. This command has slightly different semantics from the direct SQL command `DECLARE`: Whereas the latter executes a query and prepares the result set for retrieval, this embedded SQL command merely declares a name as a “loop variable” for iterating over the result set of a query; the actual execution happens when the cursor is opened with the `OPEN` command.

## Parameters

* *`cursor_name`* [#](#ECPG-SQL-DECLARE-CURSOR-NAME)

    A cursor name, case sensitive. This can be an SQL identifier or a host variable.

* *`prepared_name`* [#](#ECPG-SQL-DECLARE-PREPARED-NAME)

    The name of a prepared query, either as an SQL identifier or a host variable.

* *`query`* [#](#ECPG-SQL-DECLARE-QUERY)

    A [SELECT](sql-select.html "SELECT") or [VALUES](sql-values.html "VALUES") command which will provide the rows to be returned by the cursor.

For the meaning of the cursor options, see [DECLARE](sql-declare.html "DECLARE").

## Examples

Examples declaring a cursor for a query:

```

EXEC SQL DECLARE C CURSOR FOR SELECT * FROM My_Table;
EXEC SQL DECLARE C CURSOR FOR SELECT Item1 FROM T;
EXEC SQL DECLARE cur1 CURSOR FOR SELECT version();
```

An example declaring a cursor for a prepared statement:

```

EXEC SQL PREPARE stmt1 AS SELECT version();
EXEC SQL DECLARE cur1 CURSOR FOR stmt1;
```

## Compatibility

`DECLARE` is specified in the SQL standard.

## See Also

[OPEN](ecpg-sql-open.html "OPEN"), [CLOSE](sql-close.html "CLOSE"), [DECLARE](sql-declare.html "DECLARE")