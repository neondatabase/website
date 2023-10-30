## ALTER TEXT SEARCH PARSER

ALTER TEXT SEARCH PARSER — change the definition of a text search parser

## Synopsis

```

ALTER TEXT SEARCH PARSER name RENAME TO new_name
ALTER TEXT SEARCH PARSER name SET SCHEMA new_schema
```

## Description

`ALTER TEXT SEARCH PARSER` changes the definition of a text search parser. Currently, the only supported functionality is to change the parser's name.

You must be a superuser to use `ALTER TEXT SEARCH PARSER`.

## Parameters

* *`name`*

    The name (optionally schema-qualified) of an existing text search parser.

* *`new_name`*

    The new name of the text search parser.

* *`new_schema`*

    The new schema for the text search parser.

## Compatibility

There is no `ALTER TEXT SEARCH PARSER` statement in the SQL standard.

## See Also

[CREATE TEXT SEARCH PARSER](sql-createtsparser.html "CREATE TEXT SEARCH PARSER"), [DROP TEXT SEARCH PARSER](sql-droptsparser.html "DROP TEXT SEARCH PARSER")