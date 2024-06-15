[#id](#SQL-DROPVIEW)

## DROP VIEW

DROP VIEW — remove a view

## Synopsis

```
DROP VIEW [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.145.5)

## Description

`DROP VIEW` drops an existing view. To execute this command you must be the owner of the view.

[#id](#id-1.9.3.145.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the view does not exist. A notice is issued in this case.

- _`name`_

  The name (optionally schema-qualified) of the view to remove.

- `CASCADE`

  Automatically drop objects that depend on the view (such as other views), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the view if any objects depend on it. This is the default.

[#id](#id-1.9.3.145.7)

## Examples

This command will remove the view called `kinds`:

```
DROP VIEW kinds;
```

[#id](#id-1.9.3.145.8)

## Compatibility

This command conforms to the SQL standard, except that the standard only allows one view to be dropped per command, and apart from the `IF EXISTS` option, which is a PostgreSQL extension.

[#id](#id-1.9.3.145.9)

## See Also

[ALTER VIEW](sql-alterview), [CREATE VIEW](sql-createview)
