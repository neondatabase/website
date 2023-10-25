

|                   DROP TRIGGER                   |                                        |              |                                                       |                                        |
| :----------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -------------------------------------: |
| [Prev](sql-droptransform.html "DROP TRANSFORM")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-droptype.html "DROP TYPE") |

***

## DROP TRIGGER

DROP TRIGGER — remove a trigger

## Synopsis

```

DROP TRIGGER [ IF EXISTS ] name ON table_name [ CASCADE | RESTRICT ]
```

## Description

`DROP TRIGGER` removes an existing trigger definition. To execute this command, the current user must be the owner of the table for which the trigger is defined.

## Parameters

* `IF EXISTS`

    Do not throw an error if the trigger does not exist. A notice is issued in this case.

* *`name`*

    The name of the trigger to remove.

* *`table_name`*

    The name (optionally schema-qualified) of the table for which the trigger is defined.

* `CASCADE`

    Automatically drop objects that depend on the trigger, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend.html "5.14. Dependency Tracking")).

* `RESTRICT`

    Refuse to drop the trigger if any objects depend on it. This is the default.

## Examples

Destroy the trigger `if_dist_exists` on the table `films`:

```

DROP TRIGGER if_dist_exists ON films;
```

## Compatibility

The `DROP TRIGGER` statement in PostgreSQL is incompatible with the SQL standard. In the SQL standard, trigger names are not local to tables, so the command is simply `DROP TRIGGER name`.

## See Also

[CREATE TRIGGER](sql-createtrigger.html "CREATE TRIGGER")

***

|                                                  |                                                       |                                        |
| :----------------------------------------------- | :---------------------------------------------------: | -------------------------------------: |
| [Prev](sql-droptransform.html "DROP TRANSFORM")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-droptype.html "DROP TYPE") |
| DROP TRANSFORM                                   | [Home](index.html "PostgreSQL 17devel Documentation") |                              DROP TYPE |
