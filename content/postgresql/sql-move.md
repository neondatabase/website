<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|               MOVE              |                                        |              |                                                       |                                   |
| :-----------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | --------------------------------: |
| [Prev](sql-merge.html "MERGE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-notify.html "NOTIFY") |

***

## MOVE

MOVE — position a cursor

## Synopsis

```

MOVE [ direction ] [ FROM | IN ] cursor_name

where direction can be one of:

    NEXT
    PRIOR
    FIRST
    LAST
    ABSOLUTE count
    RELATIVE count
    count
    ALL
    FORWARD
    FORWARD count
    FORWARD ALL
    BACKWARD
    BACKWARD count
    BACKWARD ALL
```

## Description

`MOVE` repositions a cursor without retrieving any data. `MOVE` works exactly like the `FETCH` command, except it only positions the cursor and does not return rows.

The parameters for the `MOVE` command are identical to those of the `FETCH` command; refer to [FETCH](sql-fetch.html "FETCH") for details on syntax and usage.

## Outputs

On successful completion, a `MOVE` command returns a command tag of the form

```

MOVE count
```

The *`count`* is the number of rows that a `FETCH` command with the same parameters would have returned (possibly zero).

## Examples

```

BEGIN WORK;
DECLARE liahona CURSOR FOR SELECT * FROM films;

-- Skip the first 5 rows:
MOVE FORWARD 5 IN liahona;
MOVE 5

-- Fetch the 6th row from the cursor liahona:
FETCH 1 FROM liahona;
 code  | title  | did | date_prod  |  kind  |  len
-------+--------+-----+------------+--------+-------
 P_303 | 48 Hrs | 103 | 1982-10-22 | Action | 01:37
(1 row)

-- Close the cursor liahona and end the transaction:
CLOSE liahona;
COMMIT WORK;
```

## Compatibility

There is no `MOVE` statement in the SQL standard.

## See Also

[CLOSE](sql-close.html "CLOSE"), [DECLARE](sql-declare.html "DECLARE"), [FETCH](sql-fetch.html "FETCH")

***

|                                 |                                                       |                                   |
| :------------------------------ | :---------------------------------------------------: | --------------------------------: |
| [Prev](sql-merge.html "MERGE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-notify.html "NOTIFY") |
| MERGE                           | [Home](index.html "PostgreSQL 17devel Documentation") |                            NOTIFY |
