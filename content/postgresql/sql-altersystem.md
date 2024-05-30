[#id](#SQL-ALTERSYSTEM)

## ALTER SYSTEM

ALTER SYSTEM — change a server configuration parameter

## Synopsis

```
ALTER SYSTEM SET configuration_parameter { TO | = } { value | 'value' | DEFAULT }

ALTER SYSTEM RESET configuration_parameter
ALTER SYSTEM RESET ALL
```

[#id](#id-1.9.3.34.5)

## Description

`ALTER SYSTEM` is used for changing server configuration parameters across the entire database cluster. It can be more convenient than the traditional method of manually editing the `postgresql.conf` file. `ALTER SYSTEM` writes the given parameter setting to the `postgresql.auto.conf` file, which is read in addition to `postgresql.conf`. Setting a parameter to `DEFAULT`, or using the `RESET` variant, removes that configuration entry from the `postgresql.auto.conf` file. Use `RESET ALL` to remove all such configuration entries.

Values set with `ALTER SYSTEM` will be effective after the next server configuration reload, or after the next server restart in the case of parameters that can only be changed at server start. A server configuration reload can be commanded by calling the SQL function `pg_reload_conf()`, running `pg_ctl reload`, or sending a SIGHUP signal to the main server process.

Only superusers and users granted `ALTER SYSTEM` privilege on a parameter can change it using `ALTER SYSTEM`. Also, since this command acts directly on the file system and cannot be rolled back, it is not allowed inside a transaction block or function.

[#id](#id-1.9.3.34.6)

## Parameters

- _`configuration_parameter`_

  Name of a settable configuration parameter. Available parameters are documented in [Chapter 20](runtime-config).

- _`value`_

  New value of the parameter. Values can be specified as string constants, identifiers, numbers, or comma-separated lists of these, as appropriate for the particular parameter. `DEFAULT` can be written to specify removing the parameter and its value from `postgresql.auto.conf`.

[#id](#id-1.9.3.34.7)

## Notes

This command can't be used to set [data_directory](runtime-config-file-locations#GUC-DATA-DIRECTORY), nor parameters that are not allowed in `postgresql.conf` (e.g., [preset options](runtime-config-preset)).

See [Section 20.1](config-setting) for other ways to set the parameters.

[#id](#id-1.9.3.34.8)

## Examples

Set the `wal_level`:

```
ALTER SYSTEM SET wal_level = replica;
```

Undo that, restoring whatever setting was effective in `postgresql.conf`:

```
ALTER SYSTEM RESET wal_level;
```

[#id](#id-1.9.3.34.9)

## Compatibility

The `ALTER SYSTEM` statement is a PostgreSQL extension.

[#id](#id-1.9.3.34.10)

## See Also

[SET](sql-set), [SHOW](sql-show)
