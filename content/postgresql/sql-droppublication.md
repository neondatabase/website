[#id](#SQL-DROPPUBLICATION)

## DROP PUBLICATION

DROP PUBLICATION — remove a publication

## Synopsis

```
DROP PUBLICATION [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.125.5)

## Description

`DROP PUBLICATION` removes an existing publication from the database.

A publication can only be dropped by its owner or a superuser.

[#id](#id-1.9.3.125.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the publication does not exist. A notice is issued in this case.

- _`name`_

  The name of an existing publication.

- `CASCADE``RESTRICT`

  These key words do not have any effect, since there are no dependencies on publications.

[#id](#id-1.9.3.125.7)

## Examples

Drop a publication:

```
DROP PUBLICATION mypublication;
```

[#id](#id-1.9.3.125.8)

## Compatibility

`DROP PUBLICATION` is a PostgreSQL extension.

[#id](#id-1.9.3.125.9)

## See Also

[CREATE PUBLICATION](sql-createpublication), [ALTER PUBLICATION](sql-alterpublication)
