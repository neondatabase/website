## F.12. dblink — connect to other PostgreSQL databases [#](#DBLINK)

  * [dblink\_connect](contrib-dblink-connect) — opens a persistent connection to a remote database
  * [dblink\_connect\_u](contrib-dblink-connect-u) — opens a persistent connection to a remote database, insecurely
  * [dblink\_disconnect](contrib-dblink-disconnect) — closes a persistent connection to a remote database
  * [dblink](contrib-dblink-function) — executes a query in a remote database
  * [dblink\_exec](contrib-dblink-exec) — executes a command in a remote database
  * [dblink\_open](contrib-dblink-open) — opens a cursor in a remote database
  * [dblink\_fetch](contrib-dblink-fetch) — returns rows from an open cursor in a remote database
  * [dblink\_close](contrib-dblink-close) — closes a cursor in a remote database
  * [dblink\_get\_connections](contrib-dblink-get-connections) — returns the names of all open named dblink connections
  * [dblink\_error\_message](contrib-dblink-error-message) — gets last error message on the named connection
  * [dblink\_send\_query](contrib-dblink-send-query) — sends an async query to a remote database
  * [dblink\_is\_busy](contrib-dblink-is-busy) — checks if connection is busy with an async query
  * [dblink\_get\_notify](contrib-dblink-get-notify) — retrieve async notifications on a connection
  * [dblink\_get\_result](contrib-dblink-get-result) — gets an async query result
  * [dblink\_cancel\_query](contrib-dblink-cancel-query) — cancels any active query on the named connection
  * [dblink\_get\_pkey](contrib-dblink-get-pkey) — returns the positions and field names of a relation's primary key fields
  * [dblink\_build\_sql\_insert](contrib-dblink-build-sql-insert) — builds an INSERT statement using a local tuple, replacing the primary key field values with alternative supplied values
  * [dblink\_build\_sql\_delete](contrib-dblink-build-sql-delete) — builds a DELETE statement using supplied values for primary key field values
  * [dblink\_build\_sql\_update](contrib-dblink-build-sql-update) — builds an UPDATE statement using a local tuple, replacing the primary key field values with alternative supplied values

`dblink` is a module that supports connections to other PostgreSQL databases from within a database session.

`dblink` can report the following wait events under the wait event type `Extension`.

* `DblinkConnect`

    Waiting to establish a connection to a remote server.

* `DblinkGetConnect`

    Waiting to establish a connection to a remote server when it could not be found in the list of already-opened connections.

See also [postgres\_fdw](postgres-fdw "F.37. postgres_fdw — access data stored in external PostgreSQL servers"), which provides roughly the same functionality using a more modern and standards-compliant infrastructure.