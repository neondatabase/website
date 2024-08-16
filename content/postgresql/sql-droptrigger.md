[#id](#SQL-DROPTRIGGER)

## DROP TRIGGER

DROP TRIGGER — remove a trigger

## Synopsis

```
DROP TRIGGER [ IF EXISTS ] name ON table_name [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.141.5)

## Description

`DROP TRIGGER` removes an existing trigger definition. To execute this command, the current user must be the owner of the table for which the trigger is defined.

[#id](#id-1.9.3.141.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the trigger does not exist. A notice is issued in this case.

- _`name`_

  The name of the trigger to remove.

- _`table_name`_

  The name (optionally schema-qualified) of the table for which the trigger is defined.

- `CASCADE`

  Automatically drop objects that depend on the trigger, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the trigger if any objects depend on it. This is the default.

[#id](#SQL-DROPTRIGGER-EXAMPLES)

## Examples

Destroy the trigger `if_dist_exists` on the table `films`:

```
DROP TRIGGER if_dist_exists ON films;
```

[#id](#SQL-DROPTRIGGER-COMPATIBILITY)

## Compatibility

The `DROP TRIGGER` statement in PostgreSQL is incompatible with the SQL standard. In the SQL standard, trigger names are not local to tables, so the command is simply `DROP TRIGGER name`.

[#id](#id-1.9.3.141.9)

## See Also

[CREATE TRIGGER](sql-createtrigger)
