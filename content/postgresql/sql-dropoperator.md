## DROP OPERATOR

DROP OPERATOR — remove an operator

## Synopsis

```

DROP OPERATOR [ IF EXISTS ] name ( { left_type | NONE } , right_type ) [, ...] [ CASCADE | RESTRICT ]
```

## Description

`DROP OPERATOR` drops an existing operator from the database system. To execute this command you must be the owner of the operator.

## Parameters

* `IF EXISTS`

    Do not throw an error if the operator does not exist. A notice is issued in this case.

* *`name`*

    The name (optionally schema-qualified) of an existing operator.

* *`left_type`*

    The data type of the operator's left operand; write `NONE` if the operator has no left operand.

* *`right_type`*

    The data type of the operator's right operand.

* `CASCADE`

    Automatically drop objects that depend on the operator (such as views using it), and in turn all objects that depend on those objects (see [Section 5.14](ddl-depend.html "5.14. Dependency Tracking")).

* `RESTRICT`

    Refuse to drop the operator if any objects depend on it. This is the default.

## Examples

Remove the power operator `a^b` for type `integer`:

```

DROP OPERATOR ^ (integer, integer);
```

Remove the bitwise-complement prefix operator `~b` for type `bit`:

```

DROP OPERATOR ~ (none, bit);
```

Remove multiple operators in one command:

```

DROP OPERATOR ~ (none, bit), ^ (integer, integer);
```

## Compatibility

There is no `DROP OPERATOR` statement in the SQL standard.

## See Also

[CREATE OPERATOR](sql-createoperator.html "CREATE OPERATOR"), [ALTER OPERATOR](sql-alteroperator.html "ALTER OPERATOR")