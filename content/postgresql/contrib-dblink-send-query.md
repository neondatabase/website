## dblink\_send\_query

dblink\_send\_query — sends an async query to a remote database

## Synopsis

```

dblink_send_query(text connname, text sql) returns int
```

## Description

`dblink_send_query` sends a query to be executed asynchronously, that is, without immediately waiting for the result. There must not be an async query already in progress on the connection.

After successfully dispatching an async query, completion status can be checked with `dblink_is_busy`, and the results are ultimately collected with `dblink_get_result`. It is also possible to attempt to cancel an active async query using `dblink_cancel_query`.

## Arguments

* *`connname`*

    Name of the connection to use.

* *`sql`*

    The SQL statement that you wish to execute in the remote database, for example `select * from pg_class`.

## Return Value

Returns 1 if the query was successfully dispatched, 0 otherwise.

## Examples

```

SELECT dblink_send_query('dtest1', 'SELECT * FROM foo WHERE f1 < 3');
```