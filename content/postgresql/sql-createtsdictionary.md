<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                    CREATE TEXT SEARCH DICTIONARY                    |                                        |              |                                                       |                                                              |
| :-----------------------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -----------------------------------------------------------: |
| [Prev](sql-createtsconfig.html "CREATE TEXT SEARCH CONFIGURATION")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-createtsparser.html "CREATE TEXT SEARCH PARSER") |

***

[]()

## CREATE TEXT SEARCH DICTIONARY

CREATE TEXT SEARCH DICTIONARY — define a new text search dictionary

## Synopsis

```

CREATE TEXT SEARCH DICTIONARY name (
    TEMPLATE = template
    [, option = value [, ... ]]
)
```

## Description

`CREATE TEXT SEARCH DICTIONARY` creates a new text search dictionary. A text search dictionary specifies a way of recognizing interesting or uninteresting words for searching. A dictionary depends on a text search template, which specifies the functions that actually perform the work. Typically the dictionary provides some options that control the detailed behavior of the template's functions.

If a schema name is given then the text search dictionary is created in the specified schema. Otherwise it is created in the current schema.

The user who defines a text search dictionary becomes its owner.

Refer to [Chapter 12](textsearch.html "Chapter 12. Full Text Search") for further information.

## Parameters

*   *`name`*

    The name of the text search dictionary to be created. The name can be schema-qualified.

*   *`template`*

    The name of the text search template that will define the basic behavior of this dictionary.

*   *`option`*

    The name of a template-specific option to be set for this dictionary.

*   *`value`*

    The value to use for a template-specific option. If the value is not a simple identifier or number, it must be quoted (but you can always quote it, if you wish).

The options can appear in any order.

## Examples

The following example command creates a Snowball-based dictionary with a nonstandard list of stop words.

```

CREATE TEXT SEARCH DICTIONARY my_russian (
    template = snowball,
    language = russian,
    stopwords = myrussian
);
```

## Compatibility

There is no `CREATE TEXT SEARCH DICTIONARY` statement in the SQL standard.

## See Also

[ALTER TEXT SEARCH DICTIONARY](sql-altertsdictionary.html "ALTER TEXT SEARCH DICTIONARY"), [DROP TEXT SEARCH DICTIONARY](sql-droptsdictionary.html "DROP TEXT SEARCH DICTIONARY")

***

|                                                                     |                                                       |                                                              |
| :------------------------------------------------------------------ | :---------------------------------------------------: | -----------------------------------------------------------: |
| [Prev](sql-createtsconfig.html "CREATE TEXT SEARCH CONFIGURATION")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-createtsparser.html "CREATE TEXT SEARCH PARSER") |
| CREATE TEXT SEARCH CONFIGURATION                                    | [Home](index.html "PostgreSQL 17devel Documentation") |                                    CREATE TEXT SEARCH PARSER |
