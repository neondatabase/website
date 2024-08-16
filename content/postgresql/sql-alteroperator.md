[#id](#SQL-ALTEROPERATOR)

## ALTER OPERATOR

ALTER OPERATOR — change the definition of an operator

## Synopsis

```
ALTER OPERATOR name ( { left_type | NONE } , right_type )
    OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }

ALTER OPERATOR name ( { left_type | NONE } , right_type )
    SET SCHEMA new_schema

ALTER OPERATOR name ( { left_type | NONE } , right_type )
    SET ( {  RESTRICT = { res_proc | NONE }
           | JOIN = { join_proc | NONE }
         } [, ... ] )
```

[#id](#id-1.9.3.20.5)

## Description

`ALTER OPERATOR` changes the definition of an operator.

You must own the operator to use `ALTER OPERATOR`. To alter the owner, you must be able to `SET ROLE` to the new owning role, and that role must have `CREATE` privilege on the operator's schema. (These restrictions enforce that altering the owner doesn't do anything you couldn't do by dropping and recreating the operator. However, a superuser can alter ownership of any operator anyway.)

[#id](#id-1.9.3.20.6)

## Parameters

- _`name`_

  The name (optionally schema-qualified) of an existing operator.

- _`left_type`_

  The data type of the operator's left operand; write `NONE` if the operator has no left operand.

- _`right_type`_

  The data type of the operator's right operand.

- _`new_owner`_

  The new owner of the operator.

- _`new_schema`_

  The new schema for the operator.

- _`res_proc`_

  The restriction selectivity estimator function for this operator; write NONE to remove existing selectivity estimator.

- _`join_proc`_

  The join selectivity estimator function for this operator; write NONE to remove existing selectivity estimator.

[#id](#id-1.9.3.20.7)

## Examples

Change the owner of a custom operator `a @@ b` for type `text`:

```
ALTER OPERATOR @@ (text, text) OWNER TO joe;
```

Change the restriction and join selectivity estimator functions of a custom operator `a && b` for type `int[]`:

```
ALTER OPERATOR && (_int4, _int4) SET (RESTRICT = _int_contsel, JOIN = _int_contjoinsel);
```

[#id](#id-1.9.3.20.8)

## Compatibility

There is no `ALTER OPERATOR` statement in the SQL standard.

[#id](#id-1.9.3.20.9)

## See Also

[CREATE OPERATOR](sql-createoperator), [DROP OPERATOR](sql-dropoperator)
