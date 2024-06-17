[#id](#SQL-DROPDOMAIN)

## DROP DOMAIN

DROP DOMAIN — remove a domain

## Synopsis

```
DROP DOMAIN [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.109.5)

## Description

`DROP DOMAIN` removes a domain. Only the owner of a domain can remove it.

[#id](#id-1.9.3.109.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the domain does not exist. A notice is issued in this case.

- _`name`_

  The name (optionally schema-qualified) of an existing domain.

- `CASCADE`

  Automatically drop objects that depend on the domain (such as table columns), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the domain if any objects depend on it. This is the default.

[#id](#SQL-DROPDOMAIN-EXAMPLES)

## Examples

To remove the domain `box`:

```
DROP DOMAIN box;
```

[#id](#SQL-DROPDOMAIN-COMPATIBILITY)

## Compatibility

This command conforms to the SQL standard, except for the `IF EXISTS` option, which is a PostgreSQL extension.

[#id](#SQL-DROPDOMAIN-SEE-ALSO)

## See Also

[CREATE DOMAIN](sql-createdomain), [ALTER DOMAIN](sql-alterdomain)
