<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|               DROP LANGUAGE              |                                        |              |                                                       |                                                                 |
| :--------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](sql-dropindex.html "DROP INDEX")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-dropmaterializedview.html "DROP MATERIALIZED VIEW") |

***

[]()

## DROP LANGUAGE

DROP LANGUAGE — remove a procedural language

## Synopsis

    DROP [ PROCEDURAL ] LANGUAGE [ IF EXISTS ] name [ CASCADE | RESTRICT ]

## Description

`DROP LANGUAGE` removes the definition of a previously registered procedural language. You must be a superuser or the owner of the language to use `DROP LANGUAGE`.

### Note

As of PostgreSQL 9.1, most procedural languages have been made into “extensions”, and should therefore be removed with [`DROP EXTENSION`](sql-dropextension.html "DROP EXTENSION") not `DROP LANGUAGE`.

## Parameters

*   `IF EXISTS`

    Do not throw an error if the language does not exist. A notice is issued in this case.

*   *`name`*

    The name of an existing procedural language.

*   `CASCADE`

    Automatically drop objects that depend on the language (such as functions in the language), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend.html "5.14. Dependency Tracking")).

*   `RESTRICT`

    Refuse to drop the language if any objects depend on it. This is the default.

## Examples

This command removes the procedural language `plsample`:

    DROP LANGUAGE plsample;

## Compatibility

There is no `DROP LANGUAGE` statement in the SQL standard.

## See Also

[ALTER LANGUAGE](sql-alterlanguage.html "ALTER LANGUAGE"), [CREATE LANGUAGE](sql-createlanguage.html "CREATE LANGUAGE")

***

|                                          |                                                       |                                                                 |
| :--------------------------------------- | :---------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](sql-dropindex.html "DROP INDEX")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-dropmaterializedview.html "DROP MATERIALIZED VIEW") |
| DROP INDEX                               | [Home](index.html "PostgreSQL 17devel Documentation") |                                          DROP MATERIALIZED VIEW |
