[#id](#SQL-DROPOPCLASS)

## DROP OPERATOR CLASS

DROP OPERATOR CLASS — remove an operator class

## Synopsis

```
DROP OPERATOR CLASS [ IF EXISTS ] name USING index_method [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.120.5)

## Description

`DROP OPERATOR CLASS` drops an existing operator class. To execute this command you must be the owner of the operator class.

`DROP OPERATOR CLASS` does not drop any of the operators or functions referenced by the class. If there are any indexes depending on the operator class, you will need to specify `CASCADE` for the drop to complete.

[#id](#id-1.9.3.120.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the operator class does not exist. A notice is issued in this case.

- _`name`_

  The name (optionally schema-qualified) of an existing operator class.

- _`index_method`_

  The name of the index access method the operator class is for.

- `CASCADE`

  Automatically drop objects that depend on the operator class (such as indexes), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the operator class if any objects depend on it. This is the default.

[#id](#id-1.9.3.120.7)

## Notes

`DROP OPERATOR CLASS` will not drop the operator family containing the class, even if there is nothing else left in the family (in particular, in the case where the family was implicitly created by `CREATE OPERATOR CLASS`). An empty operator family is harmless, but for the sake of tidiness you might wish to remove the family with `DROP OPERATOR FAMILY`; or perhaps better, use `DROP OPERATOR FAMILY` in the first place.

[#id](#id-1.9.3.120.8)

## Examples

Remove the B-tree operator class `widget_ops`:

```
DROP OPERATOR CLASS widget_ops USING btree;
```

This command will not succeed if there are any existing indexes that use the operator class. Add `CASCADE` to drop such indexes along with the operator class.

[#id](#id-1.9.3.120.9)

## Compatibility

There is no `DROP OPERATOR CLASS` statement in the SQL standard.

[#id](#id-1.9.3.120.10)

## See Also

[ALTER OPERATOR CLASS](sql-alteropclass), [CREATE OPERATOR CLASS](sql-createopclass), [DROP OPERATOR FAMILY](sql-dropopfamily)
