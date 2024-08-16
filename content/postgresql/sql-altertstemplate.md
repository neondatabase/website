[#id](#SQL-ALTERTSTEMPLATE)

## ALTER TEXT SEARCH TEMPLATE

ALTER TEXT SEARCH TEMPLATE — change the definition of a text search template

## Synopsis

```
ALTER TEXT SEARCH TEMPLATE name RENAME TO new_name
ALTER TEXT SEARCH TEMPLATE name SET SCHEMA new_schema
```

[#id](#id-1.9.3.40.5)

## Description

`ALTER TEXT SEARCH TEMPLATE` changes the definition of a text search template. Currently, the only supported functionality is to change the template's name.

You must be a superuser to use `ALTER TEXT SEARCH TEMPLATE`.

[#id](#id-1.9.3.40.6)

## Parameters

- _`name`_

  The name (optionally schema-qualified) of an existing text search template.

- _`new_name`_

  The new name of the text search template.

- _`new_schema`_

  The new schema for the text search template.

[#id](#id-1.9.3.40.7)

## Compatibility

There is no `ALTER TEXT SEARCH TEMPLATE` statement in the SQL standard.

[#id](#id-1.9.3.40.8)

## See Also

[CREATE TEXT SEARCH TEMPLATE](sql-createtstemplate), [DROP TEXT SEARCH TEMPLATE](sql-droptstemplate)
