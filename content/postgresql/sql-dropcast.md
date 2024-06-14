[#id](#SQL-DROPCAST)

## DROP CAST

DROP CAST — remove a cast

## Synopsis

```
DROP CAST [ IF EXISTS ] (source_type AS target_type) [ CASCADE | RESTRICT ]
```

[#id](#SQL-DROPCAST-DESCRIPTION)

## Description

`DROP CAST` removes a previously defined cast.

To be able to drop a cast, you must own the source or the target data type. These are the same privileges that are required to create a cast.

[#id](#id-1.9.3.105.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the cast does not exist. A notice is issued in this case.

- _`source_type`_

  The name of the source data type of the cast.

- _`target_type`_

  The name of the target data type of the cast.

- `CASCADE``RESTRICT`

  These key words do not have any effect, since there are no dependencies on casts.

[#id](#SQL-DROPCAST-EXAMPLES)

## Examples

To drop the cast from type `text` to type `int`:

```
DROP CAST (text AS int);
```

[#id](#SQL-DROPCAST-COMPAT)

## Compatibility

The `DROP CAST` command conforms to the SQL standard.

[#id](#id-1.9.3.105.9)

## See Also

[CREATE CAST](sql-createcast)
