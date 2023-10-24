<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                   CLOSE                   |                                        |              |                                                       |                                     |
| :---------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ----------------------------------: |
| [Prev](sql-checkpoint.html "CHECKPOINT")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-cluster.html "CLUSTER") |

***

## CLOSE

CLOSE — close a cursor

## Synopsis

    CLOSE { name | ALL }

## Description

`CLOSE` frees the resources associated with an open cursor. After the cursor is closed, no subsequent operations are allowed on it. A cursor should be closed when it is no longer needed.

Every non-holdable open cursor is implicitly closed when a transaction is terminated by `COMMIT` or `ROLLBACK`. A holdable cursor is implicitly closed if the transaction that created it aborts via `ROLLBACK`. If the creating transaction successfully commits, the holdable cursor remains open until an explicit `CLOSE` is executed, or the client disconnects.

## Parameters

* *`name`*

    The name of an open cursor to close.

* `ALL`

    Close all open cursors.

## Notes

PostgreSQL does not have an explicit `OPEN` cursor statement; a cursor is considered open when it is declared. Use the [`DECLARE`](sql-declare.html "DECLARE") statement to declare a cursor.

You can see all available cursors by querying the [`pg_cursors`](view-pg-cursors.html "54.6. pg_cursors") system view.

If a cursor is closed after a savepoint which is later rolled back, the `CLOSE` is not rolled back; that is, the cursor remains closed.

## Examples

Close the cursor `liahona`:

    CLOSE liahona;

## Compatibility

`CLOSE` is fully conforming with the SQL standard. `CLOSE ALL` is a PostgreSQL extension.

## See Also

[DECLARE](sql-declare.html "DECLARE"), [FETCH](sql-fetch.html "FETCH"), [MOVE](sql-move.html "MOVE")

***

|                                           |                                                       |                                     |
| :---------------------------------------- | :---------------------------------------------------: | ----------------------------------: |
| [Prev](sql-checkpoint.html "CHECKPOINT")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-cluster.html "CLUSTER") |
| CHECKPOINT                                | [Home](index.html "PostgreSQL 17devel Documentation") |                             CLUSTER |
