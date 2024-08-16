[#id](#SQL-DROPSERVER)

## DROP SERVER

DROP SERVER — remove a foreign server descriptor

## Synopsis

```
DROP SERVER [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.131.5)

## Description

`DROP SERVER` removes an existing foreign server descriptor. To execute this command, the current user must be the owner of the server.

[#id](#id-1.9.3.131.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the server does not exist. A notice is issued in this case.

- _`name`_

  The name of an existing server.

- `CASCADE`

  Automatically drop objects that depend on the server (such as user mappings), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the server if any objects depend on it. This is the default.

[#id](#id-1.9.3.131.7)

## Examples

Drop a server `foo` if it exists:

```
DROP SERVER IF EXISTS foo;
```

[#id](#id-1.9.3.131.8)

## Compatibility

`DROP SERVER` conforms to ISO/IEC 9075-9 (SQL/MED). The `IF EXISTS` clause is a PostgreSQL extension.

[#id](#id-1.9.3.131.9)

## See Also

[CREATE SERVER](sql-createserver), [ALTER SERVER](sql-alterserver)
