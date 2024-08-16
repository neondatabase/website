[#id](#SQL-DROPSEQUENCE)

## DROP SEQUENCE

DROP SEQUENCE — remove a sequence

## Synopsis

```
DROP SEQUENCE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.130.5)

## Description

`DROP SEQUENCE` removes sequence number generators. A sequence can only be dropped by its owner or a superuser.

[#id](#id-1.9.3.130.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the sequence does not exist. A notice is issued in this case.

- _`name`_

  The name (optionally schema-qualified) of a sequence.

- `CASCADE`

  Automatically drop objects that depend on the sequence, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the sequence if any objects depend on it. This is the default.

[#id](#id-1.9.3.130.7)

## Examples

To remove the sequence `serial`:

```
DROP SEQUENCE serial;
```

[#id](#id-1.9.3.130.8)

## Compatibility

`DROP SEQUENCE` conforms to the SQL standard, except that the standard only allows one sequence to be dropped per command, and apart from the `IF EXISTS` option, which is a PostgreSQL extension.

[#id](#id-1.9.3.130.9)

## See Also

[CREATE SEQUENCE](sql-createsequence), [ALTER SEQUENCE](sql-altersequence)
