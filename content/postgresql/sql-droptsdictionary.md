<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                   DROP TEXT SEARCH DICTIONARY                   |                                        |              |                                                       |                                                          |
| :-------------------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -------------------------------------------------------: |
| [Prev](sql-droptsconfig.html "DROP TEXT SEARCH CONFIGURATION")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-droptsparser.html "DROP TEXT SEARCH PARSER") |

***

[]()

## DROP TEXT SEARCH DICTIONARY

DROP TEXT SEARCH DICTIONARY — remove a text search dictionary

## Synopsis

```

DROP TEXT SEARCH DICTIONARY [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

## Description

`DROP TEXT SEARCH DICTIONARY` drops an existing text search dictionary. To execute this command you must be the owner of the dictionary.

## Parameters

*   `IF EXISTS`

    Do not throw an error if the text search dictionary does not exist. A notice is issued in this case.

*   *`name`*

    The name (optionally schema-qualified) of an existing text search dictionary.

*   `CASCADE`

    Automatically drop objects that depend on the text search dictionary, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend.html "5.14. Dependency Tracking")).

*   `RESTRICT`

    Refuse to drop the text search dictionary if any objects depend on it. This is the default.

## Examples

Remove the text search dictionary `english`:

```

DROP TEXT SEARCH DICTIONARY english;
```

This command will not succeed if there are any existing text search configurations that use the dictionary. Add `CASCADE` to drop such configurations along with the dictionary.

## Compatibility

There is no `DROP TEXT SEARCH DICTIONARY` statement in the SQL standard.

## See Also

[ALTER TEXT SEARCH DICTIONARY](sql-altertsdictionary.html "ALTER TEXT SEARCH DICTIONARY"), [CREATE TEXT SEARCH DICTIONARY](sql-createtsdictionary.html "CREATE TEXT SEARCH DICTIONARY")

***

|                                                                 |                                                       |                                                          |
| :-------------------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------------: |
| [Prev](sql-droptsconfig.html "DROP TEXT SEARCH CONFIGURATION")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-droptsparser.html "DROP TEXT SEARCH PARSER") |
| DROP TEXT SEARCH CONFIGURATION                                  | [Home](index.html "PostgreSQL 17devel Documentation") |                                  DROP TEXT SEARCH PARSER |
