[#id](#SQL-DROPTSTEMPLATE)

## DROP TEXT SEARCH TEMPLATE

DROP TEXT SEARCH TEMPLATE — remove a text search template

## Synopsis

```
DROP TEXT SEARCH TEMPLATE [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.139.5)

## Description

`DROP TEXT SEARCH TEMPLATE` drops an existing text search template. You must be a superuser to use this command.

[#id](#id-1.9.3.139.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the text search template does not exist. A notice is issued in this case.

- _`name`_

  The name (optionally schema-qualified) of an existing text search template.

- `CASCADE`

  Automatically drop objects that depend on the text search template, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the text search template if any objects depend on it. This is the default.

[#id](#id-1.9.3.139.7)

## Examples

Remove the text search template `thesaurus`:

```
DROP TEXT SEARCH TEMPLATE thesaurus;
```

This command will not succeed if there are any existing text search dictionaries that use the template. Add `CASCADE` to drop such dictionaries along with the template.

[#id](#id-1.9.3.139.8)

## Compatibility

There is no `DROP TEXT SEARCH TEMPLATE` statement in the SQL standard.

[#id](#id-1.9.3.139.9)

## See Also

[ALTER TEXT SEARCH TEMPLATE](sql-altertstemplate), [CREATE TEXT SEARCH TEMPLATE](sql-createtstemplate)
