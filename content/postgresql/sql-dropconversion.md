[#id](#SQL-DROPCONVERSION)

## DROP CONVERSION

DROP CONVERSION — remove a conversion

## Synopsis

```
DROP CONVERSION [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

[#id](#SQL-DROPCONVERSION-DESCRIPTION)

## Description

`DROP CONVERSION` removes a previously defined conversion. To be able to drop a conversion, you must own the conversion.

[#id](#id-1.9.3.107.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the conversion does not exist. A notice is issued in this case.

- _`name`_

  The name of the conversion. The conversion name can be schema-qualified.

- `CASCADE``RESTRICT`

  These key words do not have any effect, since there are no dependencies on conversions.

[#id](#SQL-DROPCONVERSION-EXAMPLES)

## Examples

To drop the conversion named `myname`:

```
DROP CONVERSION myname;
```

[#id](#SQL-DROPCONVERSION-COMPAT)

## Compatibility

There is no `DROP CONVERSION` statement in the SQL standard, but a `DROP TRANSLATION` statement that goes along with the `CREATE TRANSLATION` statement that is similar to the `CREATE CONVERSION` statement in PostgreSQL.

[#id](#id-1.9.3.107.9)

## See Also

[ALTER CONVERSION](sql-alterconversion), [CREATE CONVERSION](sql-createconversion)
