[#id](#SQL-CREATEROLE)

## CREATE ROLE

CREATE ROLE — define a new database role

## Synopsis

```
CREATE ROLE name [ [ WITH ] option [ ... ] ]

where option can be:

      SUPERUSER | NOSUPERUSER
    | CREATEDB | NOCREATEDB
    | CREATEROLE | NOCREATEROLE
    | INHERIT | NOINHERIT
    | LOGIN | NOLOGIN
    | REPLICATION | NOREPLICATION
    | BYPASSRLS | NOBYPASSRLS
    | CONNECTION LIMIT connlimit
    | [ ENCRYPTED ] PASSWORD 'password' | PASSWORD NULL
    | VALID UNTIL 'timestamp'
    | IN ROLE role_name [, ...]
    | IN GROUP role_name [, ...]
    | ROLE role_name [, ...]
    | ADMIN role_name [, ...]
    | USER role_name [, ...]
    | SYSID uid
```

[#id](#id-1.9.3.78.5)

## Description

`CREATE ROLE` adds a new role to a PostgreSQL database cluster. A role is an entity that can own database objects and have database privileges; a role can be considered a “user”, a “group”, or both depending on how it is used. Refer to [Chapter 22](user-manag) and [Chapter 21](client-authentication) for information about managing users and authentication. You must have `CREATEROLE` privilege or be a database superuser to use this command.

Note that roles are defined at the database cluster level, and so are valid in all databases in the cluster.

[#id](#id-1.9.3.78.6)

## Parameters

- _`name`_

  The name of the new role.

- `SUPERUSER``NOSUPERUSER`

  These clauses determine whether the new role is a “superuser”, who can override all access restrictions within the database. Superuser status is dangerous and should be used only when really needed. You must yourself be a superuser to create a new superuser. If not specified, `NOSUPERUSER` is the default.

- `CREATEDB``NOCREATEDB`

  These clauses define a role's ability to create databases. If `CREATEDB` is specified, the role being defined will be allowed to create new databases. Specifying `NOCREATEDB` will deny a role the ability to create databases. If not specified, `NOCREATEDB` is the default. Only superuser roles or roles with `CREATEDB` can specify `CREATEDB`.

- `CREATEROLE``NOCREATEROLE`

  These clauses determine whether a role will be permitted to create, alter, drop, comment on, and change the security label for other roles. See [role creation](role-attributes#ROLE-CREATION) for more details about what capabilities are conferred by this privilege. If not specified, `NOCREATEROLE` is the default.

- `INHERIT``NOINHERIT`

  When the `GRANT` statement is used to confer membership in one role to another role, the `GRANT` may use the `WITH INHERIT` clause to specify whether the privileges of the granted role should be “inherited” by the new member. If the `GRANT` statement does not specify either inheritance behavior, the new `GRANT` will be created `WITH INHERIT TRUE` if the member role is set to `INHERIT` and to `WITH INHERIT FALSE` if it is set to `NOINHERIT`.

  In PostgreSQL versions before 16, the `GRANT` statement did not support `WITH INHERIT`. Therefore, changing this role-level property would also change the behavior of already-existing grants. This is no longer the case.

- `LOGIN``NOLOGIN`

  These clauses determine whether a role is allowed to log in; that is, whether the role can be given as the initial session authorization name during client connection. A role having the `LOGIN` attribute can be thought of as a user. Roles without this attribute are useful for managing database privileges, but are not users in the usual sense of the word. If not specified, `NOLOGIN` is the default, except when `CREATE ROLE` is invoked through its alternative spelling [`CREATE USER`](sql-createuser).

- `REPLICATION``NOREPLICATION`

  These clauses determine whether a role is a replication role. A role must have this attribute (or be a superuser) in order to be able to connect to the server in replication mode (physical or logical replication) and in order to be able to create or drop replication slots. A role having the `REPLICATION` attribute is a very highly privileged role, and should only be used on roles actually used for replication. If not specified, `NOREPLICATION` is the default. Only superuser roles or roles with `REPLICATION` can specify `REPLICATION`.

- `BYPASSRLS``NOBYPASSRLS`

  These clauses determine whether a role bypasses every row-level security (RLS) policy. `NOBYPASSRLS` is the default. Only superuser roles or roles with `BYPASSRLS` can specify `BYPASSRLS`.

  Note that pg_dump will set `row_security` to `OFF` by default, to ensure all contents of a table are dumped out. If the user running pg_dump does not have appropriate permissions, an error will be returned. However, superusers and the owner of the table being dumped always bypass RLS.

- `CONNECTION LIMIT` _`connlimit`_

  If role can log in, this specifies how many concurrent connections the role can make. -1 (the default) means no limit. Note that only normal connections are counted towards this limit. Neither prepared transactions nor background worker connections are counted towards this limit.

- \[ `ENCRYPTED` ] `PASSWORD` '_`password`_'`PASSWORD NULL`

  <Admonition type="tip" title="Neon Postgres Note">
  Roles created in Neon Postgres require a password, which means that the `PASSWORD` option cannot be ommitted. For details and password requirements, please see [Manage roles with SQL](/docs/manage/roles#manage-roles-with-sql) in the Neon documentation.
  </Admonition>

  Sets the role's password. (A password is only of use for roles having the `LOGIN` attribute, but you can nonetheless define one for roles without it.) If you do not plan to use password authentication you can omit this option. If no password is specified, the password will be set to null and password authentication will always fail for that user. A null password can optionally be written explicitly as `PASSWORD NULL`.

  ### Note

  Specifying an empty string will also set the password to null, but that was not the case before PostgreSQL version 10. In earlier versions, an empty string could be used, or not, depending on the authentication method and the exact version, and libpq would refuse to use it in any case. To avoid the ambiguity, specifying an empty string should be avoided.

  The password is always stored encrypted in the system catalogs. The `ENCRYPTED` keyword has no effect, but is accepted for backwards compatibility. The method of encryption is determined by the configuration parameter [password_encryption](runtime-config-connection#GUC-PASSWORD-ENCRYPTION). If the presented password string is already in MD5-encrypted or SCRAM-encrypted format, then it is stored as-is regardless of `password_encryption` (since the system cannot decrypt the specified encrypted password string, to encrypt it in a different format). This allows reloading of encrypted passwords during dump/restore.

- `VALID UNTIL` '_`timestamp`_'

  The `VALID UNTIL` clause sets a date and time after which the role's password is no longer valid. If this clause is omitted the password will be valid for all time.

- `IN ROLE` _`role_name`_

  The `IN ROLE` clause causes the new role to be automatically added as a member of the specified existing roles. (Note that there is no option to add the new role as an administrator; use a separate `GRANT` command to do that.)

- `IN GROUP` _`role_name`_

  `IN GROUP` is an obsolete spelling of `IN ROLE`.

- `ROLE` _`role_name`_

  The `ROLE` clause causes one or more specified existing roles to be automatically added as members of the new role. This in effect makes the new role a “group”.

- `ADMIN` _`role_name`_

  The `ADMIN` clause is like `ROLE`, but the named roles are added to the new role `WITH ADMIN OPTION`, giving them the right to grant membership in this role to others.

- `USER` _`role_name`_

  The `USER` clause is an obsolete spelling of the `ROLE` clause.

- `SYSID` _`uid`_

  The `SYSID` clause is ignored, but is accepted for backwards compatibility.

[#id](#id-1.9.3.78.7)

## Notes

Use [`ALTER ROLE`](sql-alterrole) to change the attributes of a role, and [`DROP ROLE`](sql-droprole) to remove a role. All the attributes specified by `CREATE ROLE` can be modified by later `ALTER ROLE` commands.

The preferred way to add and remove members of roles that are being used as groups is to use [`GRANT`](sql-grant) and [`REVOKE`](sql-revoke).

The `VALID UNTIL` clause defines an expiration time for a password only, not for the role per se. In particular, the expiration time is not enforced when logging in using a non-password-based authentication method.

The `INHERIT` attribute governs inheritance of grantable privileges (that is, access privileges for database objects and role memberships). It does not apply to the special role attributes set by `CREATE ROLE` and `ALTER ROLE`. For example, being a member of a role with `CREATEDB` privilege does not immediately grant the ability to create databases, even if `INHERIT` is set; it would be necessary to become that role via [`SET ROLE`](sql-set-role) before creating a database.

The `INHERIT` attribute is the default for reasons of backwards compatibility: in prior releases of PostgreSQL, users always had access to all privileges of groups they were members of. However, `NOINHERIT` provides a closer match to the semantics specified in the SQL standard.

PostgreSQL includes a program [createuser](app-createuser) that has the same functionality as `CREATE ROLE` (in fact, it calls this command) but can be run from the command shell.

The `CONNECTION LIMIT` option is only enforced approximately; if two new sessions start at about the same time when just one connection “slot” remains for the role, it is possible that both will fail. Also, the limit is never enforced for superusers.

Caution must be exercised when specifying an unencrypted password with this command. The password will be transmitted to the server in cleartext, and it might also be logged in the client's command history or the server log. The command [createuser](app-createuser), however, transmits the password encrypted. Also, [psql](app-psql) contains a command `\password` that can be used to safely change the password later.

[#id](#id-1.9.3.78.8)

## Examples

Create a role that can log in, but don't give it a password:

```
CREATE ROLE jonathan LOGIN;
```

Create a role with a password:

```
CREATE USER davide WITH PASSWORD 'jw8s0F4';
```

(`CREATE USER` is the same as `CREATE ROLE` except that it implies `LOGIN`.)

Create a role with a password that is valid until the end of 2004. After one second has ticked in 2005, the password is no longer valid.

```
CREATE ROLE miriam WITH LOGIN PASSWORD 'jw8s0F4' VALID UNTIL '2005-01-01';
```

Create a role that can create databases and manage roles:

```
CREATE ROLE admin WITH CREATEDB CREATEROLE;
```

[#id](#id-1.9.3.78.9)

## Compatibility

The `CREATE ROLE` statement is in the SQL standard, but the standard only requires the syntax

```
CREATE ROLE name [ WITH ADMIN role_name ]
```

Multiple initial administrators, and all the other options of `CREATE ROLE`, are PostgreSQL extensions.

The SQL standard defines the concepts of users and roles, but it regards them as distinct concepts and leaves all commands defining users to be specified by each database implementation. In PostgreSQL we have chosen to unify users and roles into a single kind of entity. Roles therefore have many more optional attributes than they do in the standard.

The behavior specified by the SQL standard is most closely approximated by giving users the `NOINHERIT` attribute, while roles are given the `INHERIT` attribute.

[#id](#id-1.9.3.78.10)

## See Also

[SET ROLE](sql-set-role), [ALTER ROLE](sql-alterrole), [DROP ROLE](sql-droprole), [GRANT](sql-grant), [REVOKE](sql-revoke), [createuser](app-createuser), [createrole_self_grant](runtime-config-client#GUC-CREATEROLE-SELF-GRANT)
