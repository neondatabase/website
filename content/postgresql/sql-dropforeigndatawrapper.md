[#id](#SQL-DROPFOREIGNDATAWRAPPER)

## DROP FOREIGN DATA WRAPPER

DROP FOREIGN DATA WRAPPER — remove a foreign-data wrapper

## Synopsis

```
DROP FOREIGN DATA WRAPPER [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.112.5)

## Description

`DROP FOREIGN DATA WRAPPER` removes an existing foreign-data wrapper. To execute this command, the current user must be the owner of the foreign-data wrapper.

[#id](#id-1.9.3.112.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the foreign-data wrapper does not exist. A notice is issued in this case.

- _`name`_

  The name of an existing foreign-data wrapper.

- `CASCADE`

  Automatically drop objects that depend on the foreign-data wrapper (such as foreign tables and servers), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the foreign-data wrapper if any objects depend on it. This is the default.

[#id](#id-1.9.3.112.7)

## Examples

Drop the foreign-data wrapper `dbi`:

```
DROP FOREIGN DATA WRAPPER dbi;
```

[#id](#id-1.9.3.112.8)

## Compatibility

`DROP FOREIGN DATA WRAPPER` conforms to ISO/IEC 9075-9 (SQL/MED). The `IF EXISTS` clause is a PostgreSQL extension.

[#id](#id-1.9.3.112.9)

## See Also

[CREATE FOREIGN DATA WRAPPER](sql-createforeigndatawrapper), [ALTER FOREIGN DATA WRAPPER](sql-alterforeigndatawrapper)
