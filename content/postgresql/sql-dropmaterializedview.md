[#id](#SQL-DROPMATERIALIZEDVIEW)

## DROP MATERIALIZED VIEW

DROP MATERIALIZED VIEW — remove a materialized view

## Synopsis

```
DROP MATERIALIZED VIEW [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.118.5)

## Description

`DROP MATERIALIZED VIEW` drops an existing materialized view. To execute this command you must be the owner of the materialized view.

[#id](#id-1.9.3.118.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the materialized view does not exist. A notice is issued in this case.

- _`name`_

  The name (optionally schema-qualified) of the materialized view to remove.

- `CASCADE`

  Automatically drop objects that depend on the materialized view (such as other materialized views, or regular views), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the materialized view if any objects depend on it. This is the default.

[#id](#id-1.9.3.118.7)

## Examples

This command will remove the materialized view called `order_summary`:

```
DROP MATERIALIZED VIEW order_summary;
```

[#id](#id-1.9.3.118.8)

## Compatibility

`DROP MATERIALIZED VIEW` is a PostgreSQL extension.

[#id](#id-1.9.3.118.9)

## See Also

[CREATE MATERIALIZED VIEW](sql-creatematerializedview), [ALTER MATERIALIZED VIEW](sql-altermaterializedview), [REFRESH MATERIALIZED VIEW](sql-refreshmaterializedview)
