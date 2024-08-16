[#id](#ECPG-COMMANDS)

## 36.3. Running SQL Commands [#](#ECPG-COMMANDS)

- [36.3.1. Executing SQL Statements](ecpg-commands#ECPG-EXECUTING)
- [36.3.2. Using Cursors](ecpg-commands#ECPG-CURSORS)
- [36.3.3. Managing Transactions](ecpg-commands#ECPG-TRANSACTIONS)
- [36.3.4. Prepared Statements](ecpg-commands#ECPG-PREPARED)

Any SQL command can be run from within an embedded SQL application. Below are some examples of how to do that.

[#id](#ECPG-EXECUTING)

### 36.3.1. Executing SQL Statements [#](#ECPG-EXECUTING)

Creating a table:

```

EXEC SQL CREATE TABLE foo (number integer, ascii char(16));
EXEC SQL CREATE UNIQUE INDEX num1 ON foo(number);
EXEC SQL COMMIT;
```

Inserting rows:

```

EXEC SQL INSERT INTO foo (number, ascii) VALUES (9999, 'doodad');
EXEC SQL COMMIT;
```

Deleting rows:

```

EXEC SQL DELETE FROM foo WHERE number = 9999;
EXEC SQL COMMIT;
```

Updates:

```

EXEC SQL UPDATE foo
    SET ascii = 'foobar'
    WHERE number = 9999;
EXEC SQL COMMIT;
```

`SELECT` statements that return a single result row can also be executed using `EXEC SQL` directly. To handle result sets with multiple rows, an application has to use a cursor; see [Section 36.3.2](ecpg-commands#ECPG-CURSORS) below. (As a special case, an application can fetch multiple rows at once into an array host variable; see [Section 36.4.4.3.1](ecpg-variables#ECPG-VARIABLES-ARRAYS).)

Single-row select:

```

EXEC SQL SELECT foo INTO :FooBar FROM table1 WHERE ascii = 'doodad';
```

Also, a configuration parameter can be retrieved with the `SHOW` command:

```

EXEC SQL SHOW search_path INTO :var;
```

The tokens of the form `:something` are _host variables_, that is, they refer to variables in the C program. They are explained in [Section 36.4](ecpg-variables).

[#id](#ECPG-CURSORS)

### 36.3.2. Using Cursors [#](#ECPG-CURSORS)

To retrieve a result set holding multiple rows, an application has to declare a cursor and fetch each row from the cursor. The steps to use a cursor are the following: declare a cursor, open it, fetch a row from the cursor, repeat, and finally close it.

Select using cursors:

```

EXEC SQL DECLARE foo_bar CURSOR FOR
    SELECT number, ascii FROM foo
    ORDER BY ascii;
EXEC SQL OPEN foo_bar;
EXEC SQL FETCH foo_bar INTO :FooBar, DooDad;
...
EXEC SQL CLOSE foo_bar;
EXEC SQL COMMIT;
```

For more details about declaring a cursor, see [DECLARE](ecpg-sql-declare); for more details about fetching rows from a cursor, see [FETCH](sql-fetch).

### Note

The ECPG `DECLARE` command does not actually cause a statement to be sent to the PostgreSQL backend. The cursor is opened in the backend (using the backend's `DECLARE` command) at the point when the `OPEN` command is executed.

[#id](#ECPG-TRANSACTIONS)

### 36.3.3. Managing Transactions [#](#ECPG-TRANSACTIONS)

In the default mode, statements are committed only when `EXEC SQL COMMIT` is issued. The embedded SQL interface also supports autocommit of transactions (similar to psql's default behavior) via the `-t` command-line option to `ecpg` (see [ecpg](app-ecpg)) or via the `EXEC SQL SET AUTOCOMMIT TO ON` statement. In autocommit mode, each command is automatically committed unless it is inside an explicit transaction block. This mode can be explicitly turned off using `EXEC SQL SET AUTOCOMMIT TO OFF`.

The following transaction management commands are available:

- `EXEC SQL COMMIT` [#](#ECPG-TRANSACTIONS-EXEC-SQL-COMMIT)

  Commit an in-progress transaction.

- `EXEC SQL ROLLBACK` [#](#ECPG-TRANSACTIONS-EXEC-SQL-ROLLBACK)

  Roll back an in-progress transaction.

- `EXEC SQL PREPARE TRANSACTION `_`transaction_id`_ [#](#ECPG-TRANSACTIONS-EXEC-SQL-PREPARE-TRANSACTION)

  Prepare the current transaction for two-phase commit.

- `EXEC SQL COMMIT PREPARED `_`transaction_id`_ [#](#ECPG-TRANSACTIONS-EXEC-SQL-COMMIT-PREPARED)

  Commit a transaction that is in prepared state.

- `EXEC SQL ROLLBACK PREPARED `_`transaction_id`_ [#](#ECPG-TRANSACTIONS-EXEC-SQL-ROLLBACK-PREPARED)

  Roll back a transaction that is in prepared state.

- `EXEC SQL SET AUTOCOMMIT TO ON` [#](#ECPG-TRANSACTIONS-EXEC-SQL-AUTOCOMMIT-ON)

  Enable autocommit mode.

- `EXEC SQL SET AUTOCOMMIT TO OFF` [#](#ECPG-TRANSACTIONS-EXEC-SQL-AUTOCOMMIT-OFF)

  Disable autocommit mode. This is the default.

[#id](#ECPG-PREPARED)

### 36.3.4. Prepared Statements [#](#ECPG-PREPARED)

When the values to be passed to an SQL statement are not known at compile time, or the same statement is going to be used many times, then prepared statements can be useful.

The statement is prepared using the command `PREPARE`. For the values that are not known yet, use the placeholder “`?`”:

```

EXEC SQL PREPARE stmt1 FROM "SELECT oid, datname FROM pg_database WHERE oid = ?";
```

If a statement returns a single row, the application can call `EXECUTE` after `PREPARE` to execute the statement, supplying the actual values for the placeholders with a `USING` clause:

```

EXEC SQL EXECUTE stmt1 INTO :dboid, :dbname USING 1;
```

If a statement returns multiple rows, the application can use a cursor declared based on the prepared statement. To bind input parameters, the cursor must be opened with a `USING` clause:

```

EXEC SQL PREPARE stmt1 FROM "SELECT oid,datname FROM pg_database WHERE oid > ?";
EXEC SQL DECLARE foo_bar CURSOR FOR stmt1;

/* when end of result set reached, break out of while loop */
EXEC SQL WHENEVER NOT FOUND DO BREAK;

EXEC SQL OPEN foo_bar USING 100;
...
while (1)
{
    EXEC SQL FETCH NEXT FROM foo_bar INTO :dboid, :dbname;
    ...
}
EXEC SQL CLOSE foo_bar;
```

When you don't need the prepared statement anymore, you should deallocate it:

```

EXEC SQL DEALLOCATE PREPARE name;
```

For more details about `PREPARE`, see [PREPARE](ecpg-sql-prepare). Also see [Section 36.5](ecpg-dynamic) for more details about using placeholders and input parameters.
