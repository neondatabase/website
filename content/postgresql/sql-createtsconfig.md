<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|            CREATE TEXT SEARCH CONFIGURATION            |                                        |              |                                                       |                                                                      |
| :----------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -------------------------------------------------------------------: |
| [Prev](sql-createtablespace.html "CREATE TABLESPACE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-createtsdictionary.html "CREATE TEXT SEARCH DICTIONARY") |

***

## CREATE TEXT SEARCH CONFIGURATION

CREATE TEXT SEARCH CONFIGURATION — define a new text search configuration

## Synopsis

```

CREATE TEXT SEARCH CONFIGURATION name (
    PARSER = parser_name |
    COPY = source_config
)
```

## Description

`CREATE TEXT SEARCH CONFIGURATION` creates a new text search configuration. A text search configuration specifies a text search parser that can divide a string into tokens, plus dictionaries that can be used to determine which tokens are of interest for searching.

If only the parser is specified, then the new text search configuration initially has no mappings from token types to dictionaries, and therefore will ignore all words. Subsequent `ALTER TEXT SEARCH CONFIGURATION` commands must be used to create mappings to make the configuration useful. Alternatively, an existing text search configuration can be copied.

If a schema name is given then the text search configuration is created in the specified schema. Otherwise it is created in the current schema.

The user who defines a text search configuration becomes its owner.

Refer to [Chapter 12](textsearch.html "Chapter 12. Full Text Search") for further information.

## Parameters

* *`name`*

    The name of the text search configuration to be created. The name can be schema-qualified.

* *`parser_name`*

    The name of the text search parser to use for this configuration.

* *`source_config`*

    The name of an existing text search configuration to copy.

## Notes

The `PARSER` and `COPY` options are mutually exclusive, because when an existing configuration is copied, its parser selection is copied too.

## Compatibility

There is no `CREATE TEXT SEARCH CONFIGURATION` statement in the SQL standard.

## See Also

[ALTER TEXT SEARCH CONFIGURATION](sql-altertsconfig.html "ALTER TEXT SEARCH CONFIGURATION"), [DROP TEXT SEARCH CONFIGURATION](sql-droptsconfig.html "DROP TEXT SEARCH CONFIGURATION")

***

|                                                        |                                                       |                                                                      |
| :----------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------------------------------: |
| [Prev](sql-createtablespace.html "CREATE TABLESPACE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-createtsdictionary.html "CREATE TEXT SEARCH DICTIONARY") |
| CREATE TABLESPACE                                      | [Home](index.html "PostgreSQL 17devel Documentation") |                                        CREATE TEXT SEARCH DICTIONARY |
