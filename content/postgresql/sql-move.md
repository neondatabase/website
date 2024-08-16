[#id](#SQL-MOVE)

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

[#id](#id-1.9.3.157.6)

## Description

`MOVE` repositions a cursor without retrieving any data. `MOVE` works exactly like the `FETCH` command, except it only positions the cursor and does not return rows.

The parameters for the `MOVE` command are identical to those of the `FETCH` command; refer to [FETCH](sql-fetch) for details on syntax and usage.

[#id](#id-1.9.3.157.7)

## Outputs

On successful completion, a `MOVE` command returns a command tag of the form

```
MOVE count
```

The _`count`_ is the number of rows that a `FETCH` command with the same parameters would have returned (possibly zero).

[#id](#id-1.9.3.157.8)

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

[#id](#id-1.9.3.157.9)

## Compatibility

There is no `MOVE` statement in the SQL standard.

[#id](#id-1.9.3.157.10)

## See Also

[CLOSE](sql-close), [DECLARE](sql-declare), [FETCH](sql-fetch)
