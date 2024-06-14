[#id](#SQL-ALTERSCHEMA)

## ALTER SCHEMA

ALTER SCHEMA — change the definition of a schema

## Synopsis

```
ALTER SCHEMA name RENAME TO new_name
ALTER SCHEMA name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
```

[#id](#id-1.9.3.29.5)

## Description

`ALTER SCHEMA` changes the definition of a schema.

You must own the schema to use `ALTER SCHEMA`. To rename a schema you must also have the `CREATE` privilege for the database. To alter the owner, you must be able to `SET ROLE` to the new owning role, and that role must have the `CREATE` privilege for the database. (Note that superusers have all these privileges automatically.)

[#id](#id-1.9.3.29.6)

## Parameters

- _`name`_

  The name of an existing schema.

- _`new_name`_

  The new name of the schema. The new name cannot begin with `pg_`, as such names are reserved for system schemas.

- _`new_owner`_

  The new owner of the schema.

[#id](#id-1.9.3.29.7)

## Compatibility

There is no `ALTER SCHEMA` statement in the SQL standard.

[#id](#id-1.9.3.29.8)

## See Also

[CREATE SCHEMA](sql-createschema), [DROP SCHEMA](sql-dropschema)
