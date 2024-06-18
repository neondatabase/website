[#id](#SQL-REASSIGN-OWNED)

## REASSIGN OWNED

REASSIGN OWNED — change the ownership of database objects owned by a database role

## Synopsis

```
REASSIGN OWNED BY { old_role | CURRENT_ROLE | CURRENT_USER | SESSION_USER } [, ...]
               TO { new_role | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
```

[#id](#id-1.9.3.161.5)

## Description

`REASSIGN OWNED` instructs the system to change the ownership of database objects owned by any of the _`old_roles`_ to _`new_role`_.

[#id](#id-1.9.3.161.6)

## Parameters

- _`old_role`_

  The name of a role. The ownership of all the objects within the current database, and of all shared objects (databases, tablespaces), owned by this role will be reassigned to _`new_role`_.

- _`new_role`_

  The name of the role that will be made the new owner of the affected objects.

[#id](#id-1.9.3.161.7)

## Notes

`REASSIGN OWNED` is often used to prepare for the removal of one or more roles. Because `REASSIGN OWNED` does not affect objects within other databases, it is usually necessary to execute this command in each database that contains objects owned by a role that is to be removed.

`REASSIGN OWNED` requires membership on both the source role(s) and the target role.

The [`DROP OWNED`](sql-drop-owned) command is an alternative that simply drops all the database objects owned by one or more roles.

The `REASSIGN OWNED` command does not affect any privileges granted to the _`old_roles`_ on objects that are not owned by them. Likewise, it does not affect default privileges created with `ALTER DEFAULT PRIVILEGES`. Use `DROP OWNED` to revoke such privileges.

See [Section 22.4](role-removal) for more discussion.

[#id](#id-1.9.3.161.8)

## Compatibility

The `REASSIGN OWNED` command is a PostgreSQL extension.

[#id](#id-1.9.3.161.9)

## See Also

[DROP OWNED](sql-drop-owned), [DROP ROLE](sql-droprole), [ALTER DATABASE](sql-alterdatabase)
