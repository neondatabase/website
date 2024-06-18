[#id](#SQL-DROPRULE)

## DROP RULE

DROP RULE — remove a rewrite rule

## Synopsis

```
DROP RULE [ IF EXISTS ] name ON table_name [ CASCADE | RESTRICT ]
```

[#id](#id-1.9.3.128.5)

## Description

`DROP RULE` drops a rewrite rule.

[#id](#id-1.9.3.128.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the rule does not exist. A notice is issued in this case.

- _`name`_

  The name of the rule to drop.

- _`table_name`_

  The name (optionally schema-qualified) of the table or view that the rule applies to.

- `CASCADE`

  Automatically drop objects that depend on the rule, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend)).

- `RESTRICT`

  Refuse to drop the rule if any objects depend on it. This is the default.

[#id](#id-1.9.3.128.7)

## Examples

To drop the rewrite rule `newrule`:

```
DROP RULE newrule ON mytable;
```

[#id](#id-1.9.3.128.8)

## Compatibility

`DROP RULE` is a PostgreSQL language extension, as is the entire query rewrite system.

[#id](#id-1.9.3.128.9)

## See Also

[CREATE RULE](sql-createrule), [ALTER RULE](sql-alterrule)
