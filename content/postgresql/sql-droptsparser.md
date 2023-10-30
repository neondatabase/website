## DROP TEXT SEARCH PARSER

DROP TEXT SEARCH PARSER — remove a text search parser

## Synopsis

```

DROP TEXT SEARCH PARSER [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

## Description

`DROP TEXT SEARCH PARSER` drops an existing text search parser. You must be a superuser to use this command.

## Parameters

* `IF EXISTS`

    Do not throw an error if the text search parser does not exist. A notice is issued in this case.

* *`name`*

    The name (optionally schema-qualified) of an existing text search parser.

* `CASCADE`

    Automatically drop objects that depend on the text search parser, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend.html "5.14. Dependency Tracking")).

* `RESTRICT`

    Refuse to drop the text search parser if any objects depend on it. This is the default.

## Examples

Remove the text search parser `my_parser`:

```

DROP TEXT SEARCH PARSER my_parser;
```

This command will not succeed if there are any existing text search configurations that use the parser. Add `CASCADE` to drop such configurations along with the parser.

## Compatibility

There is no `DROP TEXT SEARCH PARSER` statement in the SQL standard.

## See Also

[ALTER TEXT SEARCH PARSER](sql-altertsparser.html "ALTER TEXT SEARCH PARSER"), [CREATE TEXT SEARCH PARSER](sql-createtsparser.html "CREATE TEXT SEARCH PARSER")