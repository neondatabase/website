[#id](#SQL-DROPTSDICTIONARY)

## DROP TEXT SEARCH DICTIONARY

DROP TEXT SEARCH DICTIONARY — remove a text search dictionary

## Synopsis

```
DROP TEXT SEARCH DICTIONARY [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.137.5)

## Description

`DROP TEXT SEARCH DICTIONARY` drops an existing text search dictionary. To execute this command you must be the owner of the dictionary.

[#id](#id-1.9.3.137.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the text search dictionary does not exist. A notice is issued in this case.

- _`name`_

  The name (optionally schema-qualified) of an existing text search dictionary.

- `CASCADE`

  Automatically drop objects that depend on the text search dictionary, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the text search dictionary if any objects depend on it. This is the default.

[#id](#id-1.9.3.137.7)

## Examples

Remove the text search dictionary `english`:

```
DROP TEXT SEARCH DICTIONARY english;
```

This command will not succeed if there are any existing text search configurations that use the dictionary. Add `CASCADE` to drop such configurations along with the dictionary.

[#id](#id-1.9.3.137.8)

## Compatibility

There is no `DROP TEXT SEARCH DICTIONARY` statement in the SQL standard.

[#id](#id-1.9.3.137.9)

## See Also

[ALTER TEXT SEARCH DICTIONARY](sql-altertsdictionary), [CREATE TEXT SEARCH DICTIONARY](sql-createtsdictionary)
