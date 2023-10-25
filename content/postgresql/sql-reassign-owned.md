<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                        REASSIGN OWNED                       |                                        |              |                                                       |                                                                       |
| :---------------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](sql-prepare-transaction.html "PREPARE TRANSACTION")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-refreshmaterializedview.html "REFRESH MATERIALIZED VIEW") |

***

[]()

## REASSIGN OWNED

REASSIGN OWNED — change the ownership of database objects owned by a database role

## Synopsis

```

REASSIGN OWNED BY { old_role | CURRENT_ROLE | CURRENT_USER | SESSION_USER } [, ...]
               TO { new_role | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
```

## Description

`REASSIGN OWNED` instructs the system to change the ownership of database objects owned by any of the *`old_roles`* to *`new_role`*.

## Parameters

*   *`old_role`*

    The name of a role. The ownership of all the objects within the current database, and of all shared objects (databases, tablespaces), owned by this role will be reassigned to *`new_role`*.

*   *`new_role`*

    The name of the role that will be made the new owner of the affected objects.

## Notes

`REASSIGN OWNED` is often used to prepare for the removal of one or more roles. Because `REASSIGN OWNED` does not affect objects within other databases, it is usually necessary to execute this command in each database that contains objects owned by a role that is to be removed.

`REASSIGN OWNED` requires membership on both the source role(s) and the target role.

The [`DROP OWNED`](sql-drop-owned.html "DROP OWNED") command is an alternative that simply drops all the database objects owned by one or more roles.

The `REASSIGN OWNED` command does not affect any privileges granted to the *`old_roles`* on objects that are not owned by them. Likewise, it does not affect default privileges created with `ALTER DEFAULT PRIVILEGES`. Use `DROP OWNED` to revoke such privileges.

See [Section 22.4](role-removal.html "22.4. Dropping Roles") for more discussion.

## Compatibility

The `REASSIGN OWNED` command is a PostgreSQL extension.

## See Also

[DROP OWNED](sql-drop-owned.html "DROP OWNED"), [DROP ROLE](sql-droprole.html "DROP ROLE"), [ALTER DATABASE](sql-alterdatabase.html "ALTER DATABASE")

***

|                                                             |                                                       |                                                                       |
| :---------------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------------------------: |
| [Prev](sql-prepare-transaction.html "PREPARE TRANSACTION")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-refreshmaterializedview.html "REFRESH MATERIALIZED VIEW") |
| PREPARE TRANSACTION                                         | [Home](index.html "PostgreSQL 17devel Documentation") |                                             REFRESH MATERIALIZED VIEW |
