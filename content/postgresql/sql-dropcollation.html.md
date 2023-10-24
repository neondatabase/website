<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|             DROP COLLATION             |                                        |              |                                                       |                                                    |
| :------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -------------------------------------------------: |
| [Prev](sql-dropcast.html "DROP CAST")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-dropconversion.html "DROP CONVERSION") |

***

[]()

## DROP COLLATION

DROP COLLATION — remove a collation

## Synopsis

    DROP COLLATION [ IF EXISTS ] name [ CASCADE | RESTRICT ]

## Description

`DROP COLLATION` removes a previously defined collation. To be able to drop a collation, you must own the collation.

## Parameters

*   `IF EXISTS`

    Do not throw an error if the collation does not exist. A notice is issued in this case.

*   *`name`*

    The name of the collation. The collation name can be schema-qualified.

*   `CASCADE`

    Automatically drop objects that depend on the collation, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend.html "5.14. Dependency Tracking")).

*   `RESTRICT`

    Refuse to drop the collation if any objects depend on it. This is the default.

## Examples

To drop the collation named `german`:

    DROP COLLATION german;

## Compatibility

The `DROP COLLATION` command conforms to the SQL standard, apart from the `IF EXISTS` option, which is a PostgreSQL extension.

## See Also

[ALTER COLLATION](sql-altercollation.html "ALTER COLLATION"), [CREATE COLLATION](sql-createcollation.html "CREATE COLLATION")

***

|                                        |                                                       |                                                    |
| :------------------------------------- | :---------------------------------------------------: | -------------------------------------------------: |
| [Prev](sql-dropcast.html "DROP CAST")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-dropconversion.html "DROP CONVERSION") |
| DROP CAST                              | [Home](index.html "PostgreSQL 17devel Documentation") |                                    DROP CONVERSION |
