[#id](#SQL-DROPEXTENSION)

## DROP EXTENSION

DROP EXTENSION — remove an extension

## Synopsis

```
DROP EXTENSION [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.111.5)

## Description

`DROP EXTENSION` removes extensions from the database. Dropping an extension causes its member objects, and other explicitly dependent routines (see [ALTER ROUTINE](sql-alterroutine), the `DEPENDS ON EXTENSION extension_name `action), to be dropped as well.

You must own the extension to use `DROP EXTENSION`.

[#id](#id-1.9.3.111.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the extension does not exist. A notice is issued in this case.

- _`name`_

  The name of an installed extension.

- `CASCADE`

  Automatically drop objects that depend on the extension, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  This option prevents the specified extensions from being dropped if other objects, besides these extensions, their members, and their explicitly dependent routines, depend on them.  This is the default.

[#id](#id-1.9.3.111.7)

## Examples

To remove the extension `hstore` from the current database:

```
DROP EXTENSION hstore;
```

This command will fail if any of `hstore`'s objects are in use in the database, for example if any tables have columns of the `hstore` type. Add the `CASCADE` option to forcibly remove those dependent objects as well.

[#id](#id-1.9.3.111.8)

## Compatibility

`DROP EXTENSION` is a PostgreSQL extension.

[#id](#id-1.9.3.111.9)

## See Also

[CREATE EXTENSION](sql-createextension), [ALTER EXTENSION](sql-alterextension)
