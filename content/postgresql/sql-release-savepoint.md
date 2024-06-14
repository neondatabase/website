[#id](#SQL-RELEASE-SAVEPOINT)

## RELEASE SAVEPOINT

RELEASE SAVEPOINT — release a previously defined savepoint

## Synopsis

```
RELEASE [ SAVEPOINT ] savepoint_name
```

[#id](#id-1.9.3.164.6)

## Description

`RELEASE SAVEPOINT` releases the named savepoint and all active savepoints that were created after the named savepoint, and frees their resources. All changes made since the creation of the savepoint that didn't already get rolled back are merged into the transaction or savepoint that was active when the named savepoint was created. Changes made after `RELEASE SAVEPOINT` will also be part of this active transaction or savepoint.

[#id](#id-1.9.3.164.7)

## Parameters

- _`savepoint_name`_

  The name of the savepoint to release.

[#id](#id-1.9.3.164.8)

## Notes

Specifying a savepoint name that was not previously defined is an error.

It is not possible to release a savepoint when the transaction is in an aborted state; to do that, use [ROLLBACK TO SAVEPOINT](sql-rollback-to).

If multiple savepoints have the same name, only the most recently defined unreleased one is released. Repeated commands will release progressively older savepoints.

[#id](#id-1.9.3.164.9)

## Examples

To establish and later release a savepoint:

```
BEGIN;
    INSERT INTO table1 VALUES (3);
    SAVEPOINT my_savepoint;
    INSERT INTO table1 VALUES (4);
    RELEASE SAVEPOINT my_savepoint;
COMMIT;
```

The above transaction will insert both 3 and 4.

A more complex example with multiple nested subtransactions:

```
BEGIN;
    INSERT INTO table1 VALUES (1);
    SAVEPOINT sp1;
    INSERT INTO table1 VALUES (2);
    SAVEPOINT sp2;
    INSERT INTO table1 VALUES (3);
    RELEASE SAVEPOINT sp2;
    INSERT INTO table1 VALUES (4))); -- generates an error
```

In this example, the application requests the release of the savepoint `sp2`, which inserted 3. This changes the insert's transaction context to `sp1`. When the statement attempting to insert value 4 generates an error, the insertion of 2 and 4 are lost because they are in the same, now-rolled back savepoint, and value 3 is in the same transaction context. The application can now only choose one of these two commands, since all other commands will be ignored:

```
   ROLLBACK;
   ROLLBACK TO SAVEPOINT sp1;
```

Choosing `ROLLBACK` will abort everything, including value 1, whereas `ROLLBACK TO SAVEPOINT sp1` will retain value 1 and allow the transaction to continue.

[#id](#id-1.9.3.164.10)

## Compatibility

This command conforms to the SQL standard. The standard specifies that the key word `SAVEPOINT` is mandatory, but PostgreSQL allows it to be omitted.

[#id](#id-1.9.3.164.11)

## See Also

[BEGIN](sql-begin), [COMMIT](sql-commit), [ROLLBACK](sql-rollback), [ROLLBACK TO SAVEPOINT](sql-rollback-to), [SAVEPOINT](sql-savepoint)
