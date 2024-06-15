[#id](#SQL-ALTERTABLESPACE)

## ALTER TABLESPACE

ALTER TABLESPACE — change the definition of a tablespace

## Synopsis

```
ALTER TABLESPACE name RENAME TO new_name
ALTER TABLESPACE name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER TABLESPACE name SET ( tablespace_option = value [, ... ] )
ALTER TABLESPACE name RESET ( tablespace_option [, ... ] )
```

[#id](#id-1.9.3.36.5)

## Description

`ALTER TABLESPACE` can be used to change the definition of a tablespace.

You must own the tablespace to change the definition of a tablespace. To alter the owner, you must also be able to `SET ROLE` to the new owning role. (Note that superusers have these privileges automatically.)

[#id](#id-1.9.3.36.6)

## Parameters

- _`name`_

  The name of an existing tablespace.

- _`new_name`_

  The new name of the tablespace. The new name cannot begin with `pg_`, as such names are reserved for system tablespaces.

- _`new_owner`_

  The new owner of the tablespace.

- _`tablespace_option`_

  A tablespace parameter to be set or reset. Currently, the only available parameters are `seq_page_cost`, `random_page_cost`, `effective_io_concurrency` and `maintenance_io_concurrency`. Setting these values for a particular tablespace will override the planner's usual estimate of the cost of reading pages from tables in that tablespace, and the executor's prefetching behavior, as established by the configuration parameters of the same name (see [seq_page_cost](runtime-config-query#GUC-SEQ-PAGE-COST), [random_page_cost](runtime-config-query#GUC-RANDOM-PAGE-COST), [effective_io_concurrency](runtime-config-resource#GUC-EFFECTIVE-IO-CONCURRENCY), [maintenance_io_concurrency](runtime-config-resource#GUC-MAINTENANCE-IO-CONCURRENCY)). This may be useful if one tablespace is located on a disk which is faster or slower than the remainder of the I/O subsystem.

[#id](#id-1.9.3.36.7)

## Examples

Rename tablespace `index_space` to `fast_raid`:

```
ALTER TABLESPACE index_space RENAME TO fast_raid;
```

Change the owner of tablespace `index_space`:

```
ALTER TABLESPACE index_space OWNER TO mary;
```

[#id](#id-1.9.3.36.8)

## Compatibility

There is no `ALTER TABLESPACE` statement in the SQL standard.

[#id](#id-1.9.3.36.9)

## See Also

[CREATE TABLESPACE](sql-createtablespace), [DROP TABLESPACE](sql-droptablespace)
