[#id](#SQL-DROPFOREIGNTABLE)

## DROP FOREIGN TABLE

DROP FOREIGN TABLE — remove a foreign table

## Synopsis

```
DROP FOREIGN TABLE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.113.5)

## Description

`DROP FOREIGN TABLE` removes a foreign table. Only the owner of a foreign table can remove it.

[#id](#id-1.9.3.113.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the foreign table does not exist. A notice is issued in this case.

- _`name`_

  The name (optionally schema-qualified) of the foreign table to drop.

- `CASCADE`

  Automatically drop objects that depend on the foreign table (such as views), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the foreign table if any objects depend on it. This is the default.

[#id](#id-1.9.3.113.7)

## Examples

To destroy two foreign tables, `films` and `distributors`:

```
DROP FOREIGN TABLE films, distributors;
```

[#id](#id-1.9.3.113.8)

## Compatibility

This command conforms to ISO/IEC 9075-9 (SQL/MED), except that the standard only allows one foreign table to be dropped per command, and apart from the `IF EXISTS` option, which is a PostgreSQL extension.

[#id](#id-1.9.3.113.9)

## See Also

[ALTER FOREIGN TABLE](sql-alterforeigntable), [CREATE FOREIGN TABLE](sql-createforeigntable)
