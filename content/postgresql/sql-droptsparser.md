[#id](#SQL-DROPTSPARSER)

## DROP TEXT SEARCH PARSER

DROP TEXT SEARCH PARSER — remove a text search parser

## Synopsis

```
DROP TEXT SEARCH PARSER [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.138.5)

## Description

`DROP TEXT SEARCH PARSER` drops an existing text search parser. You must be a superuser to use this command.

[#id](#id-1.9.3.138.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the text search parser does not exist. A notice is issued in this case.

- _`name`_

  The name (optionally schema-qualified) of an existing text search parser.

- `CASCADE`

  Automatically drop objects that depend on the text search parser, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the text search parser if any objects depend on it. This is the default.

[#id](#id-1.9.3.138.7)

## Examples

Remove the text search parser `my_parser`:

```
DROP TEXT SEARCH PARSER my_parser;
```

This command will not succeed if there are any existing text search configurations that use the parser. Add `CASCADE` to drop such configurations along with the parser.

[#id](#id-1.9.3.138.8)

## Compatibility

There is no `DROP TEXT SEARCH PARSER` statement in the SQL standard.

[#id](#id-1.9.3.138.9)

## See Also

[ALTER TEXT SEARCH PARSER](sql-altertsparser), [CREATE TEXT SEARCH PARSER](sql-createtsparser)
