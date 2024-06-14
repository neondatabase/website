[#id](#SQL-DROP-ACCESS-METHOD)

## DROP ACCESS METHOD

DROP ACCESS METHOD — remove an access method

## Synopsis

```
DROP ACCESS METHOD [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.103.5)

## Description

`DROP ACCESS METHOD` removes an existing access method. Only superusers can drop access methods.

[#id](#id-1.9.3.103.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the access method does not exist. A notice is issued in this case.

- _`name`_

  The name of an existing access method.

- `CASCADE`

  Automatically drop objects that depend on the access method (such as operator classes, operator families, and indexes), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the access method if any objects depend on it. This is the default.

[#id](#id-1.9.3.103.7)

## Examples

Drop the access method `heptree`:

```
DROP ACCESS METHOD heptree;
```

[#id](#id-1.9.3.103.8)

## Compatibility

`DROP ACCESS METHOD` is a PostgreSQL extension.

[#id](#id-1.9.3.103.9)

## See Also

[CREATE ACCESS METHOD](sql-create-access-method)
