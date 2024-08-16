[#id](#SQL-CREATEOPFAMILY)

## CREATE OPERATOR FAMILY

CREATE OPERATOR FAMILY — define a new operator family

## Synopsis

```
CREATE OPERATOR FAMILY name USING index_method
```

[#id](#id-1.9.3.74.5)

## Description

`CREATE OPERATOR FAMILY` creates a new operator family. An operator family defines a collection of related operator classes, and perhaps some additional operators and support functions that are compatible with these operator classes but not essential for the functioning of any individual index. (Operators and functions that are essential to indexes should be grouped within the relevant operator class, rather than being “loose” in the operator family. Typically, single-data-type operators are bound to operator classes, while cross-data-type operators can be loose in an operator family containing operator classes for both data types.)

The new operator family is initially empty. It should be populated by issuing subsequent `CREATE OPERATOR CLASS` commands to add contained operator classes, and optionally `ALTER OPERATOR FAMILY` commands to add “loose” operators and their corresponding support functions.

If a schema name is given then the operator family is created in the specified schema. Otherwise it is created in the current schema. Two operator families in the same schema can have the same name only if they are for different index methods.

The user who defines an operator family becomes its owner. Presently, the creating user must be a superuser. (This restriction is made because an erroneous operator family definition could confuse or even crash the server.)

Refer to [Section 38.16](xindex) for further information.

[#id](#id-1.9.3.74.6)

## Parameters

- _`name`_

  The name of the operator family to be created. The name can be schema-qualified.

- _`index_method`_

  The name of the index method this operator family is for.

[#id](#id-1.9.3.74.7)

## Compatibility

`CREATE OPERATOR FAMILY` is a PostgreSQL extension. There is no `CREATE OPERATOR FAMILY` statement in the SQL standard.

[#id](#id-1.9.3.74.8)

## See Also

[ALTER OPERATOR FAMILY](sql-alteropfamily), [DROP OPERATOR FAMILY](sql-dropopfamily), [CREATE OPERATOR CLASS](sql-createopclass), [ALTER OPERATOR CLASS](sql-alteropclass), [DROP OPERATOR CLASS](sql-dropopclass)
