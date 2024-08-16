[#id](#SQL-DROPCOLLATION)

## DROP COLLATION

DROP COLLATION — remove a collation

## Synopsis

```
DROP COLLATION [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

[#id](#SQL-DROPCOLLATION-DESCRIPTION)

## Description

`DROP COLLATION` removes a previously defined collation. To be able to drop a collation, you must own the collation.

[#id](#id-1.9.3.106.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the collation does not exist. A notice is issued in this case.

- _`name`_

  The name of the collation. The collation name can be schema-qualified.

- `CASCADE`

  Automatically drop objects that depend on the collation, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the collation if any objects depend on it. This is the default.

[#id](#SQL-DROPCOLLATION-EXAMPLES)

## Examples

To drop the collation named `german`:

```
DROP COLLATION german;
```

[#id](#SQL-DROPCOLLATION-COMPAT)

## Compatibility

The `DROP COLLATION` command conforms to the SQL standard, apart from the `IF EXISTS` option, which is a PostgreSQL extension.

[#id](#id-1.9.3.106.9)

## See Also

[ALTER COLLATION](sql-altercollation), [CREATE COLLATION](sql-createcollation)
