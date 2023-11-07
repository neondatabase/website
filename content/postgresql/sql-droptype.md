## DROP TYPE

DROP TYPE — remove a data type

## Synopsis

```

DROP TYPE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description

`DROP TYPE` removes a user-defined data type. Only the owner of a type can remove it.

## Parameters

* `IF EXISTS`

    Do not throw an error if the type does not exist. A notice is issued in this case.

* *`name`*

    The name (optionally schema-qualified) of the data type to remove.

* `CASCADE`

    Automatically drop objects that depend on the type (such as table columns, functions, and operators), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend.html "5.14. Dependency Tracking")).

* `RESTRICT`

    Refuse to drop the type if any objects depend on it. This is the default.

## Examples

To remove the data type `box`:

```

DROP TYPE box;
```

## Compatibility

This command is similar to the corresponding command in the SQL standard, apart from the `IF EXISTS` option, which is a PostgreSQL extension. But note that much of the `CREATE TYPE` command and the data type extension mechanisms in PostgreSQL differ from the SQL standard.

## See Also

[ALTER TYPE](sql-altertype.html "ALTER TYPE"), [CREATE TYPE](sql-createtype.html "CREATE TYPE")