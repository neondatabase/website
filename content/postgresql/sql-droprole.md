<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                       DROP ROLE                      |                                        |              |                                                       |                                              |
| :--------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -------------------------------------------: |
| [Prev](sql-droppublication.html "DROP PUBLICATION")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-droproutine.html "DROP ROUTINE") |

***

## DROP ROLE

DROP ROLE — remove a database role

## Synopsis

```

DROP ROLE [ IF EXISTS ] name [, ...]
```

## Description

`DROP ROLE` removes the specified role(s). To drop a superuser role, you must be a superuser yourself; to drop non-superuser roles, you must have `CREATEROLE` privilege and have been granted `ADMIN OPTION` on the role.

A role cannot be removed if it is still referenced in any database of the cluster; an error will be raised if so. Before dropping the role, you must drop all the objects it owns (or reassign their ownership) and revoke any privileges the role has been granted on other objects. The [`REASSIGN OWNED`](sql-reassign-owned.html "REASSIGN OWNED") and [`DROP OWNED`](sql-drop-owned.html "DROP OWNED") commands can be useful for this purpose; see [Section 22.4](role-removal.html "22.4. Dropping Roles") for more discussion.

However, it is not necessary to remove role memberships involving the role; `DROP ROLE` automatically revokes any memberships of the target role in other roles, and of other roles in the target role. The other roles are not dropped nor otherwise affected.

## Parameters

* `IF EXISTS`

    Do not throw an error if the role does not exist. A notice is issued in this case.

* *`name`*

    The name of the role to remove.

## Notes

PostgreSQL includes a program [dropuser](app-dropuser.html "dropuser") that has the same functionality as this command (in fact, it calls this command) but can be run from the command shell.

## Examples

To drop a role:

```

DROP ROLE jonathan;
```

## Compatibility

The SQL standard defines `DROP ROLE`, but it allows only one role to be dropped at a time, and it specifies different privilege requirements than PostgreSQL uses.

## See Also

[CREATE ROLE](sql-createrole.html "CREATE ROLE"), [ALTER ROLE](sql-alterrole.html "ALTER ROLE"), [SET ROLE](sql-set-role.html "SET ROLE")

***

|                                                      |                                                       |                                              |
| :--------------------------------------------------- | :---------------------------------------------------: | -------------------------------------------: |
| [Prev](sql-droppublication.html "DROP PUBLICATION")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-droproutine.html "DROP ROUTINE") |
| DROP PUBLICATION                                     | [Home](index.html "PostgreSQL 17devel Documentation") |                                 DROP ROUTINE |
