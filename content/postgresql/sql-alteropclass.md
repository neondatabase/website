[#id](#SQL-ALTEROPCLASS)

## ALTER OPERATOR CLASS

ALTER OPERATOR CLASS — change the definition of an operator class

## Synopsis

```
ALTER OPERATOR CLASS name USING index_method
    RENAME TO new_name

ALTER OPERATOR CLASS name USING index_method
    OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }

ALTER OPERATOR CLASS name USING index_method
    SET SCHEMA new_schema
```

[#id](#id-1.9.3.21.5)

## Description

`ALTER OPERATOR CLASS` changes the definition of an operator class.

You must own the operator class to use `ALTER OPERATOR CLASS`. To alter the owner, you must be able to `SET ROLE` to the new owning role, and that role must have `CREATE` privilege on the operator class's schema. (These restrictions enforce that altering the owner doesn't do anything you couldn't do by dropping and recreating the operator class. However, a superuser can alter ownership of any operator class anyway.)

[#id](#id-1.9.3.21.6)

## Parameters

- _`name`_

  The name (optionally schema-qualified) of an existing operator class.

- _`index_method`_

  The name of the index method this operator class is for.

- _`new_name`_

  The new name of the operator class.

- _`new_owner`_

  The new owner of the operator class.

- _`new_schema`_

  The new schema for the operator class.

[#id](#id-1.9.3.21.7)

## Compatibility

There is no `ALTER OPERATOR CLASS` statement in the SQL standard.

[#id](#id-1.9.3.21.8)

## See Also

[CREATE OPERATOR CLASS](sql-createopclass), [DROP OPERATOR CLASS](sql-dropopclass), [ALTER OPERATOR FAMILY](sql-alteropfamily)
