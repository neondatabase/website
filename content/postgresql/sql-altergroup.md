[#id](#SQL-ALTERGROUP)

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

[#id](#id-1.9.3.15.5)

## Description

`ALTER GROUP` changes the attributes of a user group. This is an obsolete command, though still accepted for backwards compatibility, because groups (and users too) have been superseded by the more general concept of roles.

The first two variants add users to a group or remove them from a group. (Any role can play the part of either a “user” or a “group” for this purpose.) These variants are effectively equivalent to granting or revoking membership in the role named as the “group”; so the preferred way to do this is to use [`GRANT`](sql-grant) or [`REVOKE`](sql-revoke). Note that `GRANT` and `REVOKE` have additional options which are not available with this command, such as the ability to grant and revoke `ADMIN OPTION`, and the ability to specify the grantor.

The third variant changes the name of the group. This is exactly equivalent to renaming the role with [`ALTER ROLE`](sql-alterrole).

[#id](#id-1.9.3.15.6)

## Parameters

- _`group_name`_

  The name of the group (role) to modify.

- _`user_name`_

  Users (roles) that are to be added to or removed from the group. The users must already exist; `ALTER GROUP` does not create or drop users.

- _`new_name`_

  The new name of the group.

[#id](#id-1.9.3.15.7)

## Examples

Add users to a group:

```
ALTER GROUP staff ADD USER karl, john;
```

Remove a user from a group:

```
ALTER GROUP workers DROP USER beth;
```

[#id](#id-1.9.3.15.8)

## Compatibility

There is no `ALTER GROUP` statement in the SQL standard.

[#id](#id-1.9.3.15.9)

## See Also

[GRANT](sql-grant), [REVOKE](sql-revoke), [ALTER ROLE](sql-alterrole)
