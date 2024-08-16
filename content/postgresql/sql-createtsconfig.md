[#id](#SQL-CREATETSCONFIG)

## CREATE TEXT SEARCH CONFIGURATION

CREATE TEXT SEARCH CONFIGURATION — define a new text search configuration

## Synopsis

```
CREATE TEXT SEARCH CONFIGURATION name (
    PARSER = parser_name |
    COPY = source_config
)
```

[#id](#id-1.9.3.88.5)

## Description

`CREATE TEXT SEARCH CONFIGURATION` creates a new text search configuration. A text search configuration specifies a text search parser that can divide a string into tokens, plus dictionaries that can be used to determine which tokens are of interest for searching.

If only the parser is specified, then the new text search configuration initially has no mappings from token types to dictionaries, and therefore will ignore all words. Subsequent `ALTER TEXT SEARCH CONFIGURATION` commands must be used to create mappings to make the configuration useful. Alternatively, an existing text search configuration can be copied.

If a schema name is given then the text search configuration is created in the specified schema. Otherwise it is created in the current schema.

The user who defines a text search configuration becomes its owner.

Refer to [Chapter 12](textsearch) for further information.

[#id](#id-1.9.3.88.6)

## Parameters

- _`name`_

  The name of the text search configuration to be created. The name can be schema-qualified.

- _`parser_name`_

  The name of the text search parser to use for this configuration.

- _`source_config`_

  The name of an existing text search configuration to copy.

[#id](#id-1.9.3.88.7)

## Notes

The `PARSER` and `COPY` options are mutually exclusive, because when an existing configuration is copied, its parser selection is copied too.

[#id](#id-1.9.3.88.8)

## Compatibility

There is no `CREATE TEXT SEARCH CONFIGURATION` statement in the SQL standard.

[#id](#id-1.9.3.88.9)

## See Also

[ALTER TEXT SEARCH CONFIGURATION](sql-altertsconfig), [DROP TEXT SEARCH CONFIGURATION](sql-droptsconfig)
