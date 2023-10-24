<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                       ALTER POLICY                      |                                        |              |                                                       |                                                    |
| :-----------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -------------------------------------------------: |
| [Prev](sql-alteropfamily.html "ALTER OPERATOR FAMILY")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-alterprocedure.html "ALTER PROCEDURE") |

***

[]()

## ALTER POLICY

ALTER POLICY — change the definition of a row-level security policy

## Synopsis

    ALTER POLICY name ON table_name RENAME TO new_name

    ALTER POLICY name ON table_name
        [ TO { role_name | PUBLIC | CURRENT_ROLE | CURRENT_USER | SESSION_USER } [, ...] ]
        [ USING ( using_expression ) ]
        [ WITH CHECK ( check_expression ) ]

## Description

`ALTER POLICY` changes the definition of an existing row-level security policy. Note that `ALTER POLICY` only allows the set of roles to which the policy applies and the `USING` and `WITH CHECK` expressions to be modified. To change other properties of a policy, such as the command to which it applies or whether it is permissive or restrictive, the policy must be dropped and recreated.

To use `ALTER POLICY`, you must own the table that the policy applies to.

In the second form of `ALTER POLICY`, the role list, *`using_expression`*, and *`check_expression`* are replaced independently if specified. When one of those clauses is omitted, the corresponding part of the policy is unchanged.

## Parameters

*   *`name`*

    The name of an existing policy to alter.

*   *`table_name`*

    The name (optionally schema-qualified) of the table that the policy is on.

*   *`new_name`*

    The new name for the policy.

*   *`role_name`*

    The role(s) to which the policy applies. Multiple roles can be specified at one time. To apply the policy to all roles, use `PUBLIC`.

*   *`using_expression`*

    The `USING` expression for the policy. See [CREATE POLICY](sql-createpolicy.html "CREATE POLICY") for details.

*   *`check_expression`*

    The `WITH CHECK` expression for the policy. See [CREATE POLICY](sql-createpolicy.html "CREATE POLICY") for details.

## Compatibility

`ALTER POLICY` is a PostgreSQL extension.

## See Also

[CREATE POLICY](sql-createpolicy.html "CREATE POLICY"), [DROP POLICY](sql-droppolicy.html "DROP POLICY")

***

|                                                         |                                                       |                                                    |
| :------------------------------------------------------ | :---------------------------------------------------: | -------------------------------------------------: |
| [Prev](sql-alteropfamily.html "ALTER OPERATOR FAMILY")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-alterprocedure.html "ALTER PROCEDURE") |
| ALTER OPERATOR FAMILY                                   | [Home](index.html "PostgreSQL 17devel Documentation") |                                    ALTER PROCEDURE |
