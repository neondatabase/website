## ALTER STATISTICS

ALTER STATISTICS — change the definition of an extended statistics object

## Synopsis

```

ALTER STATISTICS name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER STATISTICS name RENAME TO new_name
ALTER STATISTICS name SET SCHEMA new_schema
ALTER STATISTICS name SET STATISTICS new_target
```

## Description

`ALTER STATISTICS` changes the parameters of an existing extended statistics object. Any parameters not specifically set in the `ALTER STATISTICS` command retain their prior settings.

You must own the statistics object to use `ALTER STATISTICS`. To change a statistics object's schema, you must also have `CREATE` privilege on the new schema. To alter the owner, you must be able to `SET ROLE` to the new owning role, and that role must have `CREATE` privilege on the statistics object's schema. (These restrictions enforce that altering the owner doesn't do anything you couldn't do by dropping and recreating the statistics object. However, a superuser can alter ownership of any statistics object anyway.)

## Parameters

* *`name`*

    The name (optionally schema-qualified) of the statistics object to be altered.

* *`new_owner`*

    The user name of the new owner of the statistics object.

* *`new_name`*

    The new name for the statistics object.

* *`new_schema`*

    The new schema for the statistics object.

* *`new_target`*

    The statistic-gathering target for this statistics object for subsequent [`ANALYZE`](sql-analyze.html "ANALYZE") operations. The target can be set in the range 0 to 10000; alternatively, set it to -1 to revert to using the maximum of the statistics target of the referenced columns, if set, or the system default statistics target ([default\_statistics\_target](runtime-config-query.html#GUC-DEFAULT-STATISTICS-TARGET)). For more information on the use of statistics by the PostgreSQL query planner, refer to [Section 14.2](planner-stats.html "14.2. Statistics Used by the Planner").

## Compatibility

There is no `ALTER STATISTICS` command in the SQL standard.

## See Also

[CREATE STATISTICS](sql-createstatistics.html "CREATE STATISTICS"), [DROP STATISTICS](sql-dropstatistics.html "DROP STATISTICS")