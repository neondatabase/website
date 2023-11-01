## DROP CAST

DROP CAST — remove a cast

## Synopsis

```

DROP CAST [ IF EXISTS ] (source_type AS target_type) [ CASCADE | RESTRICT ]
```

## Description

`DROP CAST` removes a previously defined cast.

To be able to drop a cast, you must own the source or the target data type. These are the same privileges that are required to create a cast.

## Parameters

* `IF EXISTS`

    Do not throw an error if the cast does not exist. A notice is issued in this case.

* *`source_type`*

    The name of the source data type of the cast.

* *`target_type`*

    The name of the target data type of the cast.

* `CASCADE``RESTRICT`

    These key words do not have any effect, since there are no dependencies on casts.

## Examples

To drop the cast from type `text` to type `int`:

```

DROP CAST (text AS int);
```

## Compatibility

The `DROP CAST` command conforms to the SQL standard.

## See Also

[CREATE CAST](sql-createcast.html "CREATE CAST")