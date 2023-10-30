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

## Description

`ALTER OPERATOR CLASS` changes the definition of an operator class.

You must own the operator class to use `ALTER OPERATOR CLASS`. To alter the owner, you must be able to `SET ROLE` to the new owning role, and that role must have `CREATE` privilege on the operator class's schema. (These restrictions enforce that altering the owner doesn't do anything you couldn't do by dropping and recreating the operator class. However, a superuser can alter ownership of any operator class anyway.)

## Parameters

* *`name`*

    The name (optionally schema-qualified) of an existing operator class.

* *`index_method`*

    The name of the index method this operator class is for.

* *`new_name`*

    The new name of the operator class.

* *`new_owner`*

    The new owner of the operator class.

* *`new_schema`*

    The new schema for the operator class.

## Compatibility

There is no `ALTER OPERATOR CLASS` statement in the SQL standard.

## See Also

[CREATE OPERATOR CLASS](sql-createopclass.html "CREATE OPERATOR CLASS"), [DROP OPERATOR CLASS](sql-dropopclass.html "DROP OPERATOR CLASS"), [ALTER OPERATOR FAMILY](sql-alteropfamily.html "ALTER OPERATOR FAMILY")