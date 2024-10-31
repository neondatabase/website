---
title: 'PostgreSQL ALTER ROLE Statement'
page_title: 'PostgreSQL ALTER ROLE Statement'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL ALTER ROLE statement to modify a role.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-administration/postgresql-alter-role/'
ogImage: ''
updatedOn: '2024-02-21T14:36:22+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL CURRENT_USER'
  slug: 'postgresql-administration/postgresql-current_user'
nextLink:
  title: 'PostgreSQL DROP ROLE Statement'
  slug: 'postgresql-administration/postgresql-drop-role'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ALTER ROLE` statement to modify the attributes of a role, rename a role, and change a role’s session default for a configuration variable.

## Using the PostgreSQL ALTER ROLE to modify attributes of roles

To change attributes of a [role](postgresql-roles), you use the following form of `ALTER ROLE` statement.

Here’s the basic syntax of the

```pgsql
ALTER ROLE role_name [WITH] option;
```

The option can be:

- `SUPERUSER` \| `NOSUPERUSER` – determine if the role is a `superuser` or not.
- `CREATEDB` \| `NOCREATEDB`– allow the role to create new databases.
- `CREATEROLE` \| `NOCREATEROLE` – allow the role to create or change roles.
- `INHERIT` \| `NOINHERIT` – determine if the role inherits the privileges of roles of which it is a member.
- `LOGIN` \| `NOLOGIN` – allow the role to log in.
- `REPLICATION` \| `NOREPLICATION` – determine if the role is a replication role.
- `BYPASSRLS` \| `NOBYPASSRLS` – determine if the role is to bypass the row\-level security (RLS) policy.
- `CONNECTION LIMIT limit` – specify the number of concurrent connections a role can make, \-1 means unlimited.
- `PASSWORD 'password' | PASSWORD NULL` – change the role’s password.
- `VALID UNTIL 'timestamp'` – set the date and time after which the role’s password is no longer valid.

The following rules are applied:

- Superusers can change any of those attributes for any role.
- Roles that have the `CREATEROLE` attribute can change any of these attributes for only non\-superusers and no\-replication roles.
- Ordinal roles can only change their passwords.

First, log in to PostgreSQL server using the `postgres` role.

Second, [create a new role](postgresql-roles) called `calf` using the `CREATE ROLE` statement:

```pgsql
create role calf login password 'securePwd1';
```

The `calf` role can log in with a password.

Because `postgres` is a superuser, it can change the role `calf` to be a superuser:

```pgsql
alter role calf superuser;
```

View the role `calf`:

```pgsql
\du calf
```

Output:

```pgsql
        List of roles
Role name | Attributes | Member of
-----------+------------+-----------
calf      | Superuser  | {}

```

The following statement sets the password of the role `calf` to expire until the end of `2050`:

```pgsql
alter role calf
valid until '2050-01-01';
```

Use the `\du` command to see the effect:

```pgsql
\du calf
```

Output:

```pgsql
                            List of roles
Role name |                 Attributes                  | Member of
-----------+---------------------------------------------+-----------
calf      | Superuser                                  +| {}
          | Password valid until 2050-01-01 00:00:00-08 |

```

## Using the PostgreSQL ALTER ROLE to rename roles

To change the name of a role, you use the following form of the `ALTER ROLE` statement:

```pgsql
ALTER ROLE role_name
TO new_name;
```

In this syntax, you specify the name of the role after the `ALTER ROLE` keywords and the new name of the role after the `TO` keyword.

A superuser can rename any role. A role that has the `CREATEROLE` privilege can rename no\-superuser roles.

If you use a role to log in to the PostgreSQL database server and rename it in the current session, you will get an error:

```pgsql
ERROR:  session user cannot be renamed
```

In this case, you need to connect to the PostgreSQL database server using a different role to rename that role.

You execute the following statement from the `postgres`‘ session to rename the role `calf` to `elephant`:

```pgsql
ALTER ROLE calf
RENAME TO elephant;
```

## Changing a role’s session default for a configuration variable

The following `ALTER ROLE` statement changes the role’s session default for a configuration variable:

```pgsql
ALTER ROLE role_name | CURRENT_USER | SESSION_USER | ALL
[IN DATABASE database_name]
SET configuration_param = { value | DEFAULT }
```

In this syntax:

- First, specify the name of the role that you want to modify the role’s session default, or use the `CURRENT_USER`, or `SESSION_USER`. You use the `ALL` option to change the settings for all roles.
- Second, specify a database name after the `IN DATABASE` keyword to change only for sessions in the named database. In case you omit the `IN DATABASE` clause, the change will be applied to all databases.
- Third, specify the configuration parameter and the new value in the `SET` clause.

Superusers can change the session defaults of any role. Roles with the `CREATEROLE` attribute can set the defaults for non\-superuser roles. Ordinary roles can only set defaults for themselves. Only superusers can change a setting for all roles in all databases.

The following example uses the `ALTER ROLE` to give the role elephant a non\-default, database\-specific setting of the `client_min_messages` parameter:

```pgsql
ALTER ROLE elephant
IN DATABASE dvdrental
SET client_min_messages = NOTICE;
```

## Summary

- Use the `ALTER ROLE role_name option` to modify the attributes of a role.
- Use the `ALTER ROLE role_name RENAME TO new_role` statement to rename a role.
- Use the `ALTER ROLE role_name SET param=value` statement to change a role’s session default for a configuration variable.
