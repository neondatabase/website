<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                 DROP OPERATOR FAMILY                |                                        |              |                                                       |                                           |
| :-------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ----------------------------------------: |
| [Prev](sql-dropopclass.html "DROP OPERATOR CLASS")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-drop-owned.html "DROP OWNED") |

***



## DROP OPERATOR FAMILY

DROP OPERATOR FAMILY — remove an operator family

## Synopsis

```

DROP OPERATOR FAMILY [ IF EXISTS ] name USING index_method [ CASCADE | RESTRICT ]
```

## Description

`DROP OPERATOR FAMILY` drops an existing operator family. To execute this command you must be the owner of the operator family.

`DROP OPERATOR FAMILY` includes dropping any operator classes contained in the family, but it does not drop any of the operators or functions referenced by the family. If there are any indexes depending on operator classes within the family, you will need to specify `CASCADE` for the drop to complete.

## Parameters

*   `IF EXISTS`

    Do not throw an error if the operator family does not exist. A notice is issued in this case.

*   *`name`*

    The name (optionally schema-qualified) of an existing operator family.

*   *`index_method`*

    The name of the index access method the operator family is for.

*   `CASCADE`

    Automatically drop objects that depend on the operator family, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend.html "5.14. Dependency Tracking")).

*   `RESTRICT`

    Refuse to drop the operator family if any objects depend on it. This is the default.

## Examples

Remove the B-tree operator family `float_ops`:

```

DROP OPERATOR FAMILY float_ops USING btree;
```

This command will not succeed if there are any existing indexes that use operator classes within the family. Add `CASCADE` to drop such indexes along with the operator family.

## Compatibility

There is no `DROP OPERATOR FAMILY` statement in the SQL standard.

## See Also

[ALTER OPERATOR FAMILY](sql-alteropfamily.html "ALTER OPERATOR FAMILY"), [CREATE OPERATOR FAMILY](sql-createopfamily.html "CREATE OPERATOR FAMILY"), [ALTER OPERATOR CLASS](sql-alteropclass.html "ALTER OPERATOR CLASS"), [CREATE OPERATOR CLASS](sql-createopclass.html "CREATE OPERATOR CLASS"), [DROP OPERATOR CLASS](sql-dropopclass.html "DROP OPERATOR CLASS")

***

|                                                     |                                                       |                                           |
| :-------------------------------------------------- | :---------------------------------------------------: | ----------------------------------------: |
| [Prev](sql-dropopclass.html "DROP OPERATOR CLASS")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-drop-owned.html "DROP OWNED") |
| DROP OPERATOR CLASS                                 | [Home](index.html "PostgreSQL 17devel Documentation") |                                DROP OWNED |
