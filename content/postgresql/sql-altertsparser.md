[#id](#SQL-ALTERTSPARSER)

## ALTER TEXT SEARCH PARSER

ALTER TEXT SEARCH PARSER — change the definition of a text search parser

## Synopsis

```
ALTER TEXT SEARCH PARSER name RENAME TO new_name
ALTER TEXT SEARCH PARSER name SET SCHEMA new_schema
```

[#id](#id-1.9.3.39.5)

## Description

`ALTER TEXT SEARCH PARSER` changes the definition of a text search parser. Currently, the only supported functionality is to change the parser's name.

You must be a superuser to use `ALTER TEXT SEARCH PARSER`.

[#id](#id-1.9.3.39.6)

## Parameters

- _`name`_

  The name (optionally schema-qualified) of an existing text search parser.

- _`new_name`_

  The new name of the text search parser.

- _`new_schema`_

  The new schema for the text search parser.

[#id](#id-1.9.3.39.7)

## Compatibility

There is no `ALTER TEXT SEARCH PARSER` statement in the SQL standard.

[#id](#id-1.9.3.39.8)

## See Also

[CREATE TEXT SEARCH PARSER](sql-createtsparser), [DROP TEXT SEARCH PARSER](sql-droptsparser)
