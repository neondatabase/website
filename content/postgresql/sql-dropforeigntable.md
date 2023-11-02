## DROP FOREIGN TABLE

DROP FOREIGN TABLE — remove a foreign table

## Synopsis

```

DROP FOREIGN TABLE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description

`DROP FOREIGN TABLE` removes a foreign table. Only the owner of a foreign table can remove it.

## Parameters

* `IF EXISTS`

    Do not throw an error if the foreign table does not exist. A notice is issued in this case.

* *`name`*

    The name (optionally schema-qualified) of the foreign table to drop.

* `CASCADE`

    Automatically drop objects that depend on the foreign table (such as views), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend "5.14. Dependency Tracking")).

* `RESTRICT`

    Refuse to drop the foreign table if any objects depend on it. This is the default.

## Examples

To destroy two foreign tables, `films` and `distributors`:

```

DROP FOREIGN TABLE films, distributors;
```

## Compatibility

This command conforms to ISO/IEC 9075-9 (SQL/MED), except that the standard only allows one foreign table to be dropped per command, and apart from the `IF EXISTS` option, which is a PostgreSQL extension.

## See Also

[ALTER FOREIGN TABLE](sql-alterforeigntable "ALTER FOREIGN TABLE"), [CREATE FOREIGN TABLE](sql-createforeigntable "CREATE FOREIGN TABLE")