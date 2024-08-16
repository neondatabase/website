[#id](#SQL-CREATETSPARSER)

## CREATE TEXT SEARCH PARSER

CREATE TEXT SEARCH PARSER — define a new text search parser

## Synopsis

```
CREATE TEXT SEARCH PARSER name (
    START = start_function ,
    GETTOKEN = gettoken_function ,
    END = end_function ,
    LEXTYPES = lextypes_function
    [, HEADLINE = headline_function ]
)
```

[#id](#id-1.9.3.90.5)

## Description

`CREATE TEXT SEARCH PARSER` creates a new text search parser. A text search parser defines a method for splitting a text string into tokens and assigning types (categories) to the tokens. A parser is not particularly useful by itself, but must be bound into a text search configuration along with some text search dictionaries to be used for searching.

If a schema name is given then the text search parser is created in the specified schema. Otherwise it is created in the current schema.

You must be a superuser to use `CREATE TEXT SEARCH PARSER`. (This restriction is made because an erroneous text search parser definition could confuse or even crash the server.)

Refer to [Chapter 12](textsearch) for further information.

[#id](#id-1.9.3.90.6)

## Parameters

- _`name`_

  The name of the text search parser to be created. The name can be schema-qualified.

- _`start_function`_

  The name of the start function for the parser.

- _`gettoken_function`_

  The name of the get-next-token function for the parser.

- _`end_function`_

  The name of the end function for the parser.

- _`lextypes_function`_

  The name of the lextypes function for the parser (a function that returns information about the set of token types it produces).

- _`headline_function`_

  The name of the headline function for the parser (a function that summarizes a set of tokens).

The function names can be schema-qualified if necessary. Argument types are not given, since the argument list for each type of function is predetermined. All except the headline function are required.

The arguments can appear in any order, not only the one shown above.

[#id](#id-1.9.3.90.7)

## Compatibility

There is no `CREATE TEXT SEARCH PARSER` statement in the SQL standard.

[#id](#id-1.9.3.90.8)

## See Also

[ALTER TEXT SEARCH PARSER](sql-altertsparser), [DROP TEXT SEARCH PARSER](sql-droptsparser)
