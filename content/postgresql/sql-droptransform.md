[#id](#SQL-DROPTRANSFORM)

## DROP TRANSFORM

DROP TRANSFORM — remove a transform

## Synopsis

```
DROP TRANSFORM [ IF EXISTS ] FOR type_name LANGUAGE lang_name [ CASCADE | RESTRICT ]
```

[#id](#SQL-DROPTRANSFORM-DESCRIPTION)

## Description

`DROP TRANSFORM` removes a previously defined transform.

To be able to drop a transform, you must own the type and the language. These are the same privileges that are required to create a transform.

[#id](#id-1.9.3.140.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the transform does not exist. A notice is issued in this case.

- _`type_name`_

  The name of the data type of the transform.

- _`lang_name`_

  The name of the language of the transform.

- `CASCADE`

  Automatically drop objects that depend on the transform, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the transform if any objects depend on it. This is the default.

[#id](#SQL-DROPTRANSFORM-EXAMPLES)

## Examples

To drop the transform for type `hstore` and language `plpython3u`:

```
DROP TRANSFORM FOR hstore LANGUAGE plpython3u;
```

[#id](#SQL-DROPTRANSFORM-COMPAT)

## Compatibility

This form of `DROP TRANSFORM` is a PostgreSQL extension. See [CREATE TRANSFORM](sql-createtransform) for details.

[#id](#id-1.9.3.140.9)

## See Also

[CREATE TRANSFORM](sql-createtransform)
