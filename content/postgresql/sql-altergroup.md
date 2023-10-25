<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                    ALTER GROUP                   |                                        |              |                                                       |                                            |
| :----------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -----------------------------------------: |
| [Prev](sql-alterfunction.html "ALTER FUNCTION")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-alterindex.html "ALTER INDEX") |

***

[]()

## ALTER GROUP

ALTER GROUP — change role name or membership

## Synopsis

```

ALTER GROUP role_specification ADD USER user_name [, ... ]
ALTER GROUP role_specification DROP USER user_name [, ... ]

where role_specification can be:

    role_name
  | CURRENT_ROLE
  | CURRENT_USER
  | SESSION_USER

ALTER GROUP group_name RENAME TO new_name
```

## Description

`ALTER GROUP` changes the attributes of a user group. This is an obsolete command, though still accepted for backwards compatibility, because groups (and users too) have been superseded by the more general concept of roles.

The first two variants add users to a group or remove them from a group. (Any role can play the part of either a “user” or a “group” for this purpose.) These variants are effectively equivalent to granting or revoking membership in the role named as the “group”; so the preferred way to do this is to use [`GRANT`](sql-grant.html "GRANT") or [`REVOKE`](sql-revoke.html "REVOKE"). Note that `GRANT` and `REVOKE` have additional options which are not available with this command, such as the ability to grant and revoke `ADMIN OPTION`, and the ability to specify the grantor.

The third variant changes the name of the group. This is exactly equivalent to renaming the role with [`ALTER ROLE`](sql-alterrole.html "ALTER ROLE").

## Parameters

*   *`group_name`*

    The name of the group (role) to modify.

*   *`user_name`*

    Users (roles) that are to be added to or removed from the group. The users must already exist; `ALTER GROUP` does not create or drop users.

*   *`new_name`*

    The new name of the group.

## Examples

Add users to a group:

```

ALTER GROUP staff ADD USER karl, john;
```

Remove a user from a group:

```

ALTER GROUP workers DROP USER beth;
```

## Compatibility

There is no `ALTER GROUP` statement in the SQL standard.

## See Also

[GRANT](sql-grant.html "GRANT"), [REVOKE](sql-revoke.html "REVOKE"), [ALTER ROLE](sql-alterrole.html "ALTER ROLE")

***

|                                                  |                                                       |                                            |
| :----------------------------------------------- | :---------------------------------------------------: | -----------------------------------------: |
| [Prev](sql-alterfunction.html "ALTER FUNCTION")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-alterindex.html "ALTER INDEX") |
| ALTER FUNCTION                                   | [Home](index.html "PostgreSQL 17devel Documentation") |                                ALTER INDEX |
