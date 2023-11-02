## DROP RULE

DROP RULE — remove a rewrite rule

## Synopsis

```

DROP RULE [ IF EXISTS ] name ON table_name [ CASCADE | RESTRICT ]
```

## Description

`DROP RULE` drops a rewrite rule.

## Parameters

* `IF EXISTS`

    Do not throw an error if the rule does not exist. A notice is issued in this case.

* *`name`*

    The name of the rule to drop.

* *`table_name`*

    The name (optionally schema-qualified) of the table or view that the rule applies to.

* `CASCADE`

    Automatically drop objects that depend on the rule, and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend "5.14. Dependency Tracking")).

* `RESTRICT`

    Refuse to drop the rule if any objects depend on it. This is the default.

## Examples

To drop the rewrite rule `newrule`:

```

DROP RULE newrule ON mytable;
```

## Compatibility

`DROP RULE` is a PostgreSQL language extension, as is the entire query rewrite system.

## See Also

[CREATE RULE](sql-createrule "CREATE RULE"), [ALTER RULE](sql-alterrule "ALTER RULE")