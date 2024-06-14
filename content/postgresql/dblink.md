[#id](#DBLINK)

## F.12. dblink — connect to other PostgreSQL databases [#](#DBLINK)

- [dblink_connect](contrib-dblink-connect) — opens a persistent connection to a remote database
- [dblink_connect_u](contrib-dblink-connect-u) — opens a persistent connection to a remote database, insecurely
- [dblink_disconnect](contrib-dblink-disconnect) — closes a persistent connection to a remote database
- [dblink](contrib-dblink-function) — executes a query in a remote database
- [dblink_exec](contrib-dblink-exec) — executes a command in a remote database
- [dblink_open](contrib-dblink-open) — opens a cursor in a remote database
- [dblink_fetch](contrib-dblink-fetch) — returns rows from an open cursor in a remote database
- [dblink_close](contrib-dblink-close) — closes a cursor in a remote database
- [dblink_get_connections](contrib-dblink-get-connections) — returns the names of all open named dblink connections
- [dblink_error_message](contrib-dblink-error-message) — gets last error message on the named connection
- [dblink_send_query](contrib-dblink-send-query) — sends an async query to a remote database
- [dblink_is_busy](contrib-dblink-is-busy) — checks if connection is busy with an async query
- [dblink_get_notify](contrib-dblink-get-notify) — retrieve async notifications on a connection
- [dblink_get_result](contrib-dblink-get-result) — gets an async query result
- [dblink_cancel_query](contrib-dblink-cancel-query) — cancels any active query on the named connection
- [dblink_get_pkey](contrib-dblink-get-pkey) — returns the positions and field names of a relation's primary key fields
- [dblink_build_sql_insert](contrib-dblink-build-sql-insert) — builds an INSERT statement using a local tuple, replacing the primary key field values with alternative supplied values
- [dblink_build_sql_delete](contrib-dblink-build-sql-delete) — builds a DELETE statement using supplied values for primary key field values
- [dblink_build_sql_update](contrib-dblink-build-sql-update) — builds an UPDATE statement using a local tuple, replacing the primary key field values with alternative supplied values

`dblink` is a module that supports connections to other PostgreSQL databases from within a database session.

See also [postgres_fdw](postgres-fdw), which provides roughly the same functionality using a more modern and standards-compliant infrastructure.
