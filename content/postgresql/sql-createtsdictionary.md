[#id](#SQL-CREATETSDICTIONARY)

## CREATE TEXT SEARCH DICTIONARY

CREATE TEXT SEARCH DICTIONARY — define a new text search dictionary

## Synopsis

```
CREATE TEXT SEARCH DICTIONARY name (
    TEMPLATE = template
    [, option = value [, ... ]]
)
```

[#id](#id-1.9.3.89.5)

## Description

`CREATE TEXT SEARCH DICTIONARY` creates a new text search dictionary. A text search dictionary specifies a way of recognizing interesting or uninteresting words for searching. A dictionary depends on a text search template, which specifies the functions that actually perform the work. Typically the dictionary provides some options that control the detailed behavior of the template's functions.

If a schema name is given then the text search dictionary is created in the specified schema. Otherwise it is created in the current schema.

The user who defines a text search dictionary becomes its owner.

Refer to [Chapter 12](textsearch) for further information.

[#id](#id-1.9.3.89.6)

## Parameters

- _`name`_

  The name of the text search dictionary to be created. The name can be schema-qualified.

- _`template`_

  The name of the text search template that will define the basic behavior of this dictionary.

- _`option`_

  The name of a template-specific option to be set for this dictionary.

- _`value`_

  The value to use for a template-specific option. If the value is not a simple identifier or number, it must be quoted (but you can always quote it, if you wish).

The options can appear in any order.

[#id](#id-1.9.3.89.7)

## Examples

The following example command creates a Snowball-based dictionary with a nonstandard list of stop words.

```
CREATE TEXT SEARCH DICTIONARY my_russian (
    template = snowball,
    language = russian,
    stopwords = myrussian
);
```

[#id](#id-1.9.3.89.8)

## Compatibility

There is no `CREATE TEXT SEARCH DICTIONARY` statement in the SQL standard.

[#id](#id-1.9.3.89.9)

## See Also

[ALTER TEXT SEARCH DICTIONARY](sql-altertsdictionary), [DROP TEXT SEARCH DICTIONARY](sql-droptsdictionary)
