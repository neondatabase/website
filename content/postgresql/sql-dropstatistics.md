<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|               DROP STATISTICS              |                                        |              |                                                       |                                                        |
| :----------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -----------------------------------------------------: |
| [Prev](sql-dropserver.html "DROP SERVER")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-dropsubscription.html "DROP SUBSCRIPTION") |

***



## DROP STATISTICS

DROP STATISTICS — remove extended statistics

## Synopsis

```

DROP STATISTICS [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

## Description

`DROP STATISTICS` removes statistics object(s) from the database. Only the statistics object's owner, the schema owner, or a superuser can drop a statistics object.

## Parameters

*   `IF EXISTS`

    Do not throw an error if the statistics object does not exist. A notice is issued in this case.

*   *`name`*

    The name (optionally schema-qualified) of the statistics object to drop.

*   `CASCADE``RESTRICT`

    These key words do not have any effect, since there are no dependencies on statistics.

## Examples

To destroy two statistics objects in different schemas, without failing if they don't exist:

```

DROP STATISTICS IF EXISTS
    accounting.users_uid_creation,
    public.grants_user_role;
```

## Compatibility

There is no `DROP STATISTICS` command in the SQL standard.

## See Also

[ALTER STATISTICS](sql-alterstatistics.html "ALTER STATISTICS"), [CREATE STATISTICS](sql-createstatistics.html "CREATE STATISTICS")

***

|                                            |                                                       |                                                        |
| :----------------------------------------- | :---------------------------------------------------: | -----------------------------------------------------: |
| [Prev](sql-dropserver.html "DROP SERVER")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-dropsubscription.html "DROP SUBSCRIPTION") |
| DROP SERVER                                | [Home](index.html "PostgreSQL 17devel Documentation") |                                      DROP SUBSCRIPTION |
