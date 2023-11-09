[#id](#SQL-ALTERRULE)

## ALTER RULE

ALTER RULE — change the definition of a rule

## Synopsis

```
ALTER RULE name ON table_name RENAME TO new_name
```

[#id](#id-1.9.3.28.5)

## Description

`ALTER RULE` changes properties of an existing rule. Currently, the only available action is to change the rule's name.

To use `ALTER RULE`, you must own the table or view that the rule applies to.

[#id](#id-1.9.3.28.6)

## Parameters

* *`name`*

  The name of an existing rule to alter.

* *`table_name`*

  The name (optionally schema-qualified) of the table or view that the rule applies to.

* *`new_name`*

  The new name for the rule.

[#id](#id-1.9.3.28.7)

## Examples

To rename an existing rule:

```
ALTER RULE notify_all ON emp RENAME TO notify_me;
```

[#id](#id-1.9.3.28.8)

## Compatibility

`ALTER RULE` is a PostgreSQL language extension, as is the entire query rewrite system.

[#id](#id-1.9.3.28.9)

## See Also

[CREATE RULE](sql-createrule), [DROP RULE](sql-droprule)