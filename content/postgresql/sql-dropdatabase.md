[#id](#SQL-DROPDATABASE)

## DROP DATABASE

DROP DATABASE — remove a database

## Synopsis

```
DROP DATABASE [ IF EXISTS ] name [ [ WITH ] ( option [, ...] ) ]

where option can be:

    FORCE
```

[#id](#id-1.9.3.108.5)

## Description

`DROP DATABASE` drops a database. It removes the catalog entries for the database and deletes the directory containing the data. It can only be executed by the database owner. It cannot be executed while you are connected to the target database. (Connect to `postgres` or any other database to issue this command.) Also, if anyone else is connected to the target database, this command will fail unless you use the `FORCE` option described below.

`DROP DATABASE` cannot be undone. Use it with care!

[#id](#id-1.9.3.108.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the database does not exist. A notice is issued in this case.

- _`name`_

  The name of the database to remove.

- `FORCE`

  Attempt to terminate all existing connections to the target database. It doesn't terminate if prepared transactions, active logical replication slots or subscriptions are present in the target database.

  This will fail if the current user has no permissions to terminate other connections. Required permissions are the same as with `pg_terminate_backend`, described in [Section 9.27.2](functions-admin#FUNCTIONS-ADMIN-SIGNAL). This will also fail if we are not able to terminate connections.

[#id](#id-1.9.3.108.7)

## Notes

`DROP DATABASE` cannot be executed inside a transaction block.

This command cannot be executed while connected to the target database. Thus, it might be more convenient to use the program [dropdb](app-dropdb) instead, which is a wrapper around this command.

[#id](#id-1.9.3.108.8)

## Compatibility

There is no `DROP DATABASE` statement in the SQL standard.

[#id](#id-1.9.3.108.9)

## See Also

[CREATE DATABASE](sql-createdatabase)
