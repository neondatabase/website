[#id](#SQL-SET-ROLE)

## SET ROLE

SET ROLE — set the current user identifier of the current session

## Synopsis

```
SET [ SESSION | LOCAL ] ROLE role_name
SET [ SESSION | LOCAL ] ROLE NONE
RESET ROLE
```

[#id](#id-1.9.3.176.5)

## Description

This command sets the current user identifier of the current SQL session to be _`role_name`_. The role name can be written as either an identifier or a string literal. After `SET ROLE`, permissions checking for SQL commands is carried out as though the named role were the one that had logged in originally.

The specified _`role_name`_ must be a role that the current session user is a member of. (If the session user is a superuser, any role can be selected.)

The `SESSION` and `LOCAL` modifiers act the same as for the regular [`SET`](sql-set) command.

`SET ROLE NONE` sets the current user identifier to the current session user identifier, as returned by `session_user`. `RESET ROLE` sets the current user identifier to the connection-time setting specified by the [command-line options](libpq-connect#LIBPQ-CONNECT-OPTIONS), [`ALTER ROLE`](sql-alterrole), or [`ALTER DATABASE`](sql-alterdatabase), if any such settings exist. Otherwise, `RESET ROLE` sets the current user identifier to the current session user identifier. These forms can be executed by any user.

[#id](#id-1.9.3.176.6)

## Notes

Using this command, it is possible to either add privileges or restrict one's privileges. If the session user role has been granted memberships `WITH INHERIT TRUE`, it automatically has all the privileges of every such role. In this case, `SET ROLE` effectively drops all the privileges except for those which the target role directly possesses or inherits. On the other hand, if the session user role has been granted memberships `WITH INHERIT FALSE`, the privileges of the granted roles can't be accessed by default. However, if the role was granted `WITH SET TRUE`, the session user can use `SET ROLE` to drop the privileges assigned directly to the session user and instead acquire the privileges available to the named role. If the role was granted `WITH INHERIT FALSE, SET FALSE` then the privileges of that role cannot be exercised either with or without `SET ROLE`.

Note that when a superuser chooses to `SET ROLE` to a non-superuser role, they lose their superuser privileges.

`SET ROLE` has effects comparable to [`SET SESSION AUTHORIZATION`](sql-set-session-authorization), but the privilege checks involved are quite different. Also, `SET SESSION AUTHORIZATION` determines which roles are allowable for later `SET ROLE` commands, whereas changing roles with `SET ROLE` does not change the set of roles allowed to a later `SET ROLE`.

`SET ROLE` does not process session variables as specified by the role's [`ALTER ROLE`](sql-alterrole) settings; this only happens during login.

`SET ROLE` cannot be used within a `SECURITY DEFINER` function.

[#id](#id-1.9.3.176.7)

## Examples

```
SELECT SESSION_USER, CURRENT_USER;

 session_user | current_user
--------------+--------------
 peter        | peter

SET ROLE 'paul';

SELECT SESSION_USER, CURRENT_USER;

 session_user | current_user
--------------+--------------
 peter        | paul
```

[#id](#id-1.9.3.176.8)

## Compatibility

PostgreSQL allows identifier syntax (`"rolename"`), while the SQL standard requires the role name to be written as a string literal. SQL does not allow this command during a transaction; PostgreSQL does not make this restriction because there is no reason to. The `SESSION` and `LOCAL` modifiers are a PostgreSQL extension, as is the `RESET` syntax.

[#id](#id-1.9.3.176.9)

## See Also

[SET SESSION AUTHORIZATION](sql-set-session-authorization)
