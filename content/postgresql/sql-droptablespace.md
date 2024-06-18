[#id](#SQL-DROPTABLESPACE)

## DROP TABLESPACE

DROP TABLESPACE — remove a tablespace

## Synopsis

```
DROP TABLESPACE [ IF EXISTS ] name
```

[#id](#id-1.9.3.135.5)

## Description

`DROP TABLESPACE` removes a tablespace from the system.

A tablespace can only be dropped by its owner or a superuser. The tablespace must be empty of all database objects before it can be dropped. It is possible that objects in other databases might still reside in the tablespace even if no objects in the current database are using the tablespace. Also, if the tablespace is listed in the [temp_tablespaces](runtime-config-client#GUC-TEMP-TABLESPACES) setting of any active session, the `DROP` might fail due to temporary files residing in the tablespace.

[#id](#id-1.9.3.135.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the tablespace does not exist. A notice is issued in this case.

- _`name`_

  The name of a tablespace.

[#id](#id-1.9.3.135.7)

## Notes

`DROP TABLESPACE` cannot be executed inside a transaction block.

[#id](#id-1.9.3.135.8)

## Examples

To remove tablespace `mystuff` from the system:

```
DROP TABLESPACE mystuff;
```

[#id](#id-1.9.3.135.9)

## Compatibility

`DROP TABLESPACE` is a PostgreSQL extension.

[#id](#id-1.9.3.135.10)

## See Also

[CREATE TABLESPACE](sql-createtablespace), [ALTER TABLESPACE](sql-altertablespace)
