[#id](#SQL-DROPSTATISTICS)

## DROP STATISTICS

DROP STATISTICS — remove extended statistics

## Synopsis

```
DROP STATISTICS [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.132.5)

## Description

`DROP STATISTICS` removes statistics object(s) from the database. Only the statistics object's owner, the schema owner, or a superuser can drop a statistics object.

[#id](#id-1.9.3.132.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the statistics object does not exist. A notice is issued in this case.

- _`name`_

  The name (optionally schema-qualified) of the statistics object to drop.

- `CASCADE``RESTRICT`

  These key words do not have any effect, since there are no dependencies on statistics.

[#id](#id-1.9.3.132.7)

## Examples

To destroy two statistics objects in different schemas, without failing if they don't exist:

```
DROP STATISTICS IF EXISTS
    accounting.users_uid_creation,
    public.grants_user_role;
```

[#id](#id-1.9.3.132.8)

## Compatibility

There is no `DROP STATISTICS` command in the SQL standard.

[#id](#id-1.9.3.132.9)

## See Also

[ALTER STATISTICS](sql-alterstatistics), [CREATE STATISTICS](sql-createstatistics)
