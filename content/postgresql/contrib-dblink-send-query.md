[#id](#CONTRIB-DBLINK-SEND-QUERY)

## dblink_send_query

dblink_send_query — sends an async query to a remote database

## Synopsis

```

dblink_send_query(text connname, text sql) returns int
```

[#id](#id-1.11.7.22.15.5)

## Description

`dblink_send_query` sends a query to be executed asynchronously, that is, without immediately waiting for the result. There must not be an async query already in progress on the connection.

After successfully dispatching an async query, completion status can be checked with `dblink_is_busy`, and the results are ultimately collected with `dblink_get_result`. It is also possible to attempt to cancel an active async query using `dblink_cancel_query`.

[#id](#id-1.11.7.22.15.6)

## Arguments

- _`connname`_

  Name of the connection to use.

- _`sql`_

  The SQL statement that you wish to execute in the remote database, for example `select * from pg_class`.

[#id](#id-1.11.7.22.15.7)

## Return Value

Returns 1 if the query was successfully dispatched, 0 otherwise.

[#id](#id-1.11.7.22.15.8)

## Examples

```

SELECT dblink_send_query('dtest1', 'SELECT * FROM foo WHERE f1 < 3');
```
