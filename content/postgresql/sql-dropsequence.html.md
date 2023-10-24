<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                DROP SEQUENCE               |                                        |              |                                                       |                                            |
| :----------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -----------------------------------------: |
| [Prev](sql-dropschema.html "DROP SCHEMA")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-dropserver.html "DROP SERVER") |

***

## DROP SEQUENCE

DROP SEQUENCE — remove a sequence

## Synopsis

    DROP SEQUENCE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]

## Description

`DROP SEQUENCE` removes sequence number generators. A sequence can only be dropped by its owner or a superuser.

## Parameters

* `IF EXISTS`

    Do not throw an error if the sequence does not exist. A notice is issued in this case.

* *`name`*

    The name (optionally schema-qualified) of a sequence.

* `CASCADE`

    Automatically drop objects that depend on the sequence, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend.html "5.14. Dependency Tracking")).

* `RESTRICT`

    Refuse to drop the sequence if any objects depend on it. This is the default.

## Examples

To remove the sequence `serial`:

    DROP SEQUENCE serial;

## Compatibility

`DROP SEQUENCE` conforms to the SQL standard, except that the standard only allows one sequence to be dropped per command, and apart from the `IF EXISTS` option, which is a PostgreSQL extension.

## See Also

[CREATE SEQUENCE](sql-createsequence.html "CREATE SEQUENCE"), [ALTER SEQUENCE](sql-altersequence.html "ALTER SEQUENCE")

***

|                                            |                                                       |                                            |
| :----------------------------------------- | :---------------------------------------------------: | -----------------------------------------: |
| [Prev](sql-dropschema.html "DROP SCHEMA")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-dropserver.html "DROP SERVER") |
| DROP SCHEMA                                | [Home](index.html "PostgreSQL 17devel Documentation") |                                DROP SERVER |
