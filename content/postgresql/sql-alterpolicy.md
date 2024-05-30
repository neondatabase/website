[#id](#SQL-ALTERPOLICY)

## ALTER POLICY

ALTER POLICY — change the definition of a row-level security policy

## Synopsis

```
ALTER POLICY name ON table_name RENAME TO new_name

ALTER POLICY name ON table_name
    [ TO { role_name | PUBLIC | CURRENT_ROLE | CURRENT_USER | SESSION_USER } [, ...] ]
    [ USING ( using_expression ) ]
    [ WITH CHECK ( check_expression ) ]
```

[#id](#id-1.9.3.23.5)

## Description

`ALTER POLICY` changes the definition of an existing row-level security policy. Note that `ALTER POLICY` only allows the set of roles to which the policy applies and the `USING` and `WITH CHECK` expressions to be modified. To change other properties of a policy, such as the command to which it applies or whether it is permissive or restrictive, the policy must be dropped and recreated.

To use `ALTER POLICY`, you must own the table that the policy applies to.

In the second form of `ALTER POLICY`, the role list, _`using_expression`_, and _`check_expression`_ are replaced independently if specified. When one of those clauses is omitted, the corresponding part of the policy is unchanged.

[#id](#id-1.9.3.23.6)

## Parameters

- _`name`_

  The name of an existing policy to alter.

- _`table_name`_

  The name (optionally schema-qualified) of the table that the policy is on.

- _`new_name`_

  The new name for the policy.

- _`role_name`_

  The role(s) to which the policy applies. Multiple roles can be specified at one time. To apply the policy to all roles, use `PUBLIC`.

- _`using_expression`_

  The `USING` expression for the policy. See [CREATE POLICY](sql-createpolicy) for details.

- _`check_expression`_

  The `WITH CHECK` expression for the policy. See [CREATE POLICY](sql-createpolicy) for details.

[#id](#id-1.9.3.23.7)

## Compatibility

`ALTER POLICY` is a PostgreSQL extension.

[#id](#id-1.9.3.23.8)

## See Also

[CREATE POLICY](sql-createpolicy), [DROP POLICY](sql-droppolicy)
