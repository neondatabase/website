[#id](#SQL-DROPTSCONFIG)

## DROP TEXT SEARCH CONFIGURATION

DROP TEXT SEARCH CONFIGURATION — remove a text search configuration

## Synopsis

```
DROP TEXT SEARCH CONFIGURATION [ IF EXISTS ] name [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.136.5)

## Description

`DROP TEXT SEARCH CONFIGURATION` drops an existing text search configuration. To execute this command you must be the owner of the configuration.

[#id](#id-1.9.3.136.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the text search configuration does not exist. A notice is issued in this case.

- _`name`_

  The name (optionally schema-qualified) of an existing text search configuration.

- `CASCADE`

  Automatically drop objects that depend on the text search configuration, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the text search configuration if any objects depend on it. This is the default.

[#id](#id-1.9.3.136.7)

## Examples

Remove the text search configuration `my_english`:

```
DROP TEXT SEARCH CONFIGURATION my_english;
```

This command will not succeed if there are any existing indexes that reference the configuration in `to_tsvector` calls. Add `CASCADE` to drop such indexes along with the text search configuration.

[#id](#id-1.9.3.136.8)

## Compatibility

There is no `DROP TEXT SEARCH CONFIGURATION` statement in the SQL standard.

[#id](#id-1.9.3.136.9)

## See Also

[ALTER TEXT SEARCH CONFIGURATION](sql-altertsconfig), [CREATE TEXT SEARCH CONFIGURATION](sql-createtsconfig)
