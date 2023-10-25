<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                       SAVEPOINT                       |                                        |              |                                                       |                                                   |
| :---------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ------------------------------------------------: |
| [Prev](sql-rollback-to.html "ROLLBACK TO SAVEPOINT")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-security-label.html "SECURITY LABEL") |

***

[]()[]()

## SAVEPOINT

SAVEPOINT — define a new savepoint within the current transaction

## Synopsis

```

SAVEPOINT savepoint_name
```

## Description

`SAVEPOINT` establishes a new savepoint within the current transaction.

A savepoint is a special mark inside a transaction that allows all commands that are executed after it was established to be rolled back, restoring the transaction state to what it was at the time of the savepoint.

## Parameters

*   *`savepoint_name`*

    The name to give to the new savepoint. If savepoints with the same name already exist, they will be inaccessible until newer identically-named savepoints are released.

## Notes

Use [`ROLLBACK TO`](sql-rollback-to.html "ROLLBACK TO SAVEPOINT") to rollback to a savepoint. Use [`RELEASE SAVEPOINT`](sql-release-savepoint.html "RELEASE SAVEPOINT") to destroy a savepoint, keeping the effects of commands executed after it was established.

Savepoints can only be established when inside a transaction block. There can be multiple savepoints defined within a transaction.

## Examples

To establish a savepoint and later undo the effects of all commands executed after it was established:

```

BEGIN;
    INSERT INTO table1 VALUES (1);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (2);
    ROLLBACK TO SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (3);
COMMIT;
```

The above transaction will insert the values 1 and 3, but not 2.

To establish and later destroy a savepoint:

```

BEGIN;
    INSERT INTO table1 VALUES (3);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (4);
    RELEASE SAVEPOINT my_savepoint;
COMMIT;
```

The above transaction will insert both 3 and 4.

To use a single savepoint name:

```

BEGIN;
    INSERT INTO table1 VALUES (1);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (2);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (3);

    -- rollback to the second savepoint
    ROLLBACK TO SAVEPOINT my_savepoint;
    SELECT * FROM table1;               -- shows rows 1 and 2

    -- release the second savepoint
    RELEASE SAVEPOINT my_savepoint;

    -- rollback to the first savepoint
    ROLLBACK TO SAVEPOINT my_savepoint;
    SELECT * FROM table1;               -- shows only row 1
COMMIT;
```

The above transaction shows row 3 being rolled back first, then row 2.

## Compatibility

SQL requires a savepoint to be destroyed automatically when another savepoint with the same name is established. In PostgreSQL, the old savepoint is kept, though only the more recent one will be used when rolling back or releasing. (Releasing the newer savepoint with `RELEASE SAVEPOINT` will cause the older one to again become accessible to `ROLLBACK TO SAVEPOINT` and `RELEASE SAVEPOINT`.) Otherwise, `SAVEPOINT` is fully SQL conforming.

## See Also

[BEGIN](sql-begin.html "BEGIN"), [COMMIT](sql-commit.html "COMMIT"), [RELEASE SAVEPOINT](sql-release-savepoint.html "RELEASE SAVEPOINT"), [ROLLBACK](sql-rollback.html "ROLLBACK"), [ROLLBACK TO SAVEPOINT](sql-rollback-to.html "ROLLBACK TO SAVEPOINT")

***

|                                                       |                                                       |                                                   |
| :---------------------------------------------------- | :---------------------------------------------------: | ------------------------------------------------: |
| [Prev](sql-rollback-to.html "ROLLBACK TO SAVEPOINT")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-security-label.html "SECURITY LABEL") |
| ROLLBACK TO SAVEPOINT                                 | [Home](index.html "PostgreSQL 17devel Documentation") |                                    SECURITY LABEL |
