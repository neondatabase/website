<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|           DROP TEXT SEARCH CONFIGURATION           |                                        |              |                                                       |                                                                  |
| :------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ---------------------------------------------------------------: |
| [Prev](sql-droptablespace.html "DROP TABLESPACE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-droptsdictionary.html "DROP TEXT SEARCH DICTIONARY") |

***

[]()

## DROP TEXT SEARCH CONFIGURATION

DROP TEXT SEARCH CONFIGURATION — remove a text search configuration

## Synopsis

    DROP TEXT SEARCH CONFIGURATION [ IF EXISTS ] name [ CASCADE | RESTRICT ]

## Description

`DROP TEXT SEARCH CONFIGURATION` drops an existing text search configuration. To execute this command you must be the owner of the configuration.

## Parameters

*   `IF EXISTS`

    Do not throw an error if the text search configuration does not exist. A notice is issued in this case.

*   *`name`*

    The name (optionally schema-qualified) of an existing text search configuration.

*   `CASCADE`

    Automatically drop objects that depend on the text search configuration, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend.html "5.14. Dependency Tracking")).

*   `RESTRICT`

    Refuse to drop the text search configuration if any objects depend on it. This is the default.

## Examples

Remove the text search configuration `my_english`:

    DROP TEXT SEARCH CONFIGURATION my_english;

This command will not succeed if there are any existing indexes that reference the configuration in `to_tsvector` calls. Add `CASCADE` to drop such indexes along with the text search configuration.

## Compatibility

There is no `DROP TEXT SEARCH CONFIGURATION` statement in the SQL standard.

## See Also

[ALTER TEXT SEARCH CONFIGURATION](sql-altertsconfig.html "ALTER TEXT SEARCH CONFIGURATION"), [CREATE TEXT SEARCH CONFIGURATION](sql-createtsconfig.html "CREATE TEXT SEARCH CONFIGURATION")

***

|                                                    |                                                       |                                                                  |
| :------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------------------------: |
| [Prev](sql-droptablespace.html "DROP TABLESPACE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-droptsdictionary.html "DROP TEXT SEARCH DICTIONARY") |
| DROP TABLESPACE                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                                      DROP TEXT SEARCH DICTIONARY |
