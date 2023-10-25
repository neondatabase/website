

|         F.12. dblink — connect to other PostgreSQL databases         |                                                                             |                                                        |                                                       |                                                       |
| :------------------------------------------------------------------: | :-------------------------------------------------------------------------- | :----------------------------------------------------: | ----------------------------------------------------: | ----------------------------------------------------: |
| [Prev](cube.html "F.11. cube — a multi-dimensional cube data type")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") | Appendix F. Additional Supplied Modules and Extensions | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](contrib-dblink-connect.html "dblink_connect") |

***

## F.12. dblink — connect to other PostgreSQL databases [#](#DBLINK)

  * *   [dblink\_connect](contrib-dblink-connect.html) — opens a persistent connection to a remote database
  * [dblink\_connect\_u](contrib-dblink-connect-u.html) — opens a persistent connection to a remote database, insecurely
  * [dblink\_disconnect](contrib-dblink-disconnect.html) — closes a persistent connection to a remote database
  * [dblink](contrib-dblink-function.html) — executes a query in a remote database
  * [dblink\_exec](contrib-dblink-exec.html) — executes a command in a remote database
  * [dblink\_open](contrib-dblink-open.html) — opens a cursor in a remote database
  * [dblink\_fetch](contrib-dblink-fetch.html) — returns rows from an open cursor in a remote database
  * [dblink\_close](contrib-dblink-close.html) — closes a cursor in a remote database
  * [dblink\_get\_connections](contrib-dblink-get-connections.html) — returns the names of all open named dblink connections
  * [dblink\_error\_message](contrib-dblink-error-message.html) — gets last error message on the named connection
  * [dblink\_send\_query](contrib-dblink-send-query.html) — sends an async query to a remote database
  * [dblink\_is\_busy](contrib-dblink-is-busy.html) — checks if connection is busy with an async query
  * [dblink\_get\_notify](contrib-dblink-get-notify.html) — retrieve async notifications on a connection
  * [dblink\_get\_result](contrib-dblink-get-result.html) — gets an async query result
  * [dblink\_cancel\_query](contrib-dblink-cancel-query.html) — cancels any active query on the named connection
  * [dblink\_get\_pkey](contrib-dblink-get-pkey.html) — returns the positions and field names of a relation's primary key fields
  * [dblink\_build\_sql\_insert](contrib-dblink-build-sql-insert.html) — builds an INSERT statement using a local tuple, replacing the primary key field values with alternative supplied values
  * [dblink\_build\_sql\_delete](contrib-dblink-build-sql-delete.html) — builds a DELETE statement using supplied values for primary key field values
  * [dblink\_build\_sql\_update](contrib-dblink-build-sql-update.html) — builds an UPDATE statement using a local tuple, replacing the primary key field values with alternative supplied values

`dblink` is a module that supports connections to other PostgreSQL databases from within a database session.

`dblink` can report the following wait events under the wait event type `Extension`.

* `DblinkConnect`

    Waiting to establish a connection to a remote server.

* `DblinkGetConnect`

    Waiting to establish a connection to a remote server when it could not be found in the list of already-opened connections.

See also [postgres\_fdw](postgres-fdw.html "F.37. postgres_fdw — access data stored in external PostgreSQL servers"), which provides roughly the same functionality using a more modern and standards-compliant infrastructure.

***

|                                                                      |                                                                             |                                                       |
| :------------------------------------------------------------------- | :-------------------------------------------------------------------------: | ----------------------------------------------------: |
| [Prev](cube.html "F.11. cube — a multi-dimensional cube data type")  | [Up](contrib.html "Appendix F. Additional Supplied Modules and Extensions") |  [Next](contrib-dblink-connect.html "dblink_connect") |
| F.11. cube — a multi-dimensional cube data type                      |            [Home](index.html "PostgreSQL 17devel Documentation")            |                                       dblink\_connect |
