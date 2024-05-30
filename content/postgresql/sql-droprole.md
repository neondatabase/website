[#id](#SQL-DROPROLE)

## DROP ROLE

DROP ROLE — remove a database role

## Synopsis

```
DROP ROLE [ IF EXISTS ] name [, ...]
```

[#id](#id-1.9.3.126.5)

## Description

`DROP ROLE` removes the specified role(s). To drop a superuser role, you must be a superuser yourself; to drop non-superuser roles, you must have `CREATEROLE` privilege and have been granted `ADMIN OPTION` on the role.

A role cannot be removed if it is still referenced in any database of the cluster; an error will be raised if so. Before dropping the role, you must drop all the objects it owns (or reassign their ownership) and revoke any privileges the role has been granted on other objects. The [`REASSIGN OWNED`](sql-reassign-owned) and [`DROP OWNED`](sql-drop-owned) commands can be useful for this purpose; see [Section 22.4](role-removal) for more discussion.

However, it is not necessary to remove role memberships involving the role; `DROP ROLE` automatically revokes any memberships of the target role in other roles, and of other roles in the target role. The other roles are not dropped nor otherwise affected.

[#id](#id-1.9.3.126.6)

## Parameters

- `IF EXISTS`

  Do not throw an error if the role does not exist. A notice is issued in this case.

- _`name`_

  The name of the role to remove.

[#id](#id-1.9.3.126.7)

## Notes

PostgreSQL includes a program [dropuser](app-dropuser) that has the same functionality as this command (in fact, it calls this command) but can be run from the command shell.

[#id](#id-1.9.3.126.8)

## Examples

To drop a role:

```
DROP ROLE jonathan;
```

[#id](#id-1.9.3.126.9)

## Compatibility

The SQL standard defines `DROP ROLE`, but it allows only one role to be dropped at a time, and it specifies different privilege requirements than PostgreSQL uses.

[#id](#id-1.9.3.126.10)

## See Also

[CREATE ROLE](sql-createrole), [ALTER ROLE](sql-alterrole), [SET ROLE](sql-set-role)
