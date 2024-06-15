[#id](#SQL-DROPTABLE)

## DROP TABLE

DROP TABLE — remove a table

## Synopsis

```
DROP TABLE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.134.5)

## Description

`DROP TABLE` removes tables from the database. Only the table owner, the schema owner, and superuser can drop a table. To empty a table of rows without destroying the table, use [`DELETE`](sql-delete) or [`TRUNCATE`](sql-truncate).

`DROP TABLE` always removes any indexes, rules, triggers, and constraints that exist for the target table. However, to drop a table that is referenced by a view or a foreign-key constraint of another table, `CASCADE` must be specified. (`CASCADE` will remove a dependent view entirely, but in the foreign-key case it will only remove the foreign-key constraint, not the other table entirely.)

[#id](#id-1.9.3.134.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the table does not exist. A notice is issued in this case.

- _`name`_

  The name (optionally schema-qualified) of the table to drop.

- `CASCADE`

  Automatically drop objects that depend on the table (such as views), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the table if any objects depend on it. This is the default.

[#id](#id-1.9.3.134.7)

## Examples

To destroy two tables, `films` and `distributors`:

```
DROP TABLE films, distributors;
```

[#id](#id-1.9.3.134.8)

## Compatibility

This command conforms to the SQL standard, except that the standard only allows one table to be dropped per command, and apart from the `IF EXISTS` option, which is a PostgreSQL extension.

[#id](#id-1.9.3.134.9)

## See Also

[ALTER TABLE](sql-altertable), [CREATE TABLE](sql-createtable)
