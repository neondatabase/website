<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                   DROP DOMAIN                  |                                        |              |                                                       |                                                         |
| :--------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ------------------------------------------------------: |
| [Prev](sql-dropdatabase.html "DROP DATABASE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-dropeventtrigger.html "DROP EVENT TRIGGER") |

***

## DROP DOMAIN

DROP DOMAIN — remove a domain

## Synopsis

    DROP DOMAIN [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]

## Description

`DROP DOMAIN` removes a domain. Only the owner of a domain can remove it.

## Parameters

* `IF EXISTS`

    Do not throw an error if the domain does not exist. A notice is issued in this case.

* *`name`*

    The name (optionally schema-qualified) of an existing domain.

* `CASCADE`

    Automatically drop objects that depend on the domain (such as table columns), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend.html "5.14. Dependency Tracking")).

* `RESTRICT`

    Refuse to drop the domain if any objects depend on it. This is the default.

## Examples

To remove the domain `box`:

    DROP DOMAIN box;

## Compatibility

This command conforms to the SQL standard, except for the `IF EXISTS` option, which is a PostgreSQL extension.

## See Also

[CREATE DOMAIN](sql-createdomain.html "CREATE DOMAIN"), [ALTER DOMAIN](sql-alterdomain.html "ALTER DOMAIN")

***

|                                                |                                                       |                                                         |
| :--------------------------------------------- | :---------------------------------------------------: | ------------------------------------------------------: |
| [Prev](sql-dropdatabase.html "DROP DATABASE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-dropeventtrigger.html "DROP EVENT TRIGGER") |
| DROP DATABASE                                  | [Home](index.html "PostgreSQL 17devel Documentation") |                                      DROP EVENT TRIGGER |
