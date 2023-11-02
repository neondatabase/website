## ALTER TEXT SEARCH TEMPLATE

ALTER TEXT SEARCH TEMPLATE — change the definition of a text search template

## Synopsis

```

ALTER TEXT SEARCH TEMPLATE name RENAME TO new_name
ALTER TEXT SEARCH TEMPLATE name SET SCHEMA new_schema
```

## Description

`ALTER TEXT SEARCH TEMPLATE` changes the definition of a text search template. Currently, the only supported functionality is to change the template's name.

You must be a superuser to use `ALTER TEXT SEARCH TEMPLATE`.

## Parameters

* *`name`*

    The name (optionally schema-qualified) of an existing text search template.

* *`new_name`*

    The new name of the text search template.

* *`new_schema`*

    The new schema for the text search template.

## Compatibility

There is no `ALTER TEXT SEARCH TEMPLATE` statement in the SQL standard.

## See Also

[CREATE TEXT SEARCH TEMPLATE](sql-createtstemplate "CREATE TEXT SEARCH TEMPLATE"), [DROP TEXT SEARCH TEMPLATE](sql-droptstemplate "DROP TEXT SEARCH TEMPLATE")