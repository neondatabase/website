---
title: 'PostgreSQL ALTER ROLE Statement'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-alter-role/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ALTER ROLE` statement to modify the attributes of a role, rename a role, and change a role's session default for a configuration variable.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Using the PostgreSQL ALTER ROLE to modify attributes of roles

<!-- /wp:heading -->

<!-- wp:paragraph -->

To change attributes of a [role](https://www.postgresqltutorial.com/postgresql-administration/postgresql-roles/), you use the following form of `ALTER ROLE` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
ALTER ROLE role_name [WITH] option;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The option can be:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `SUPERUSER` | `NOSUPERUSER` - determine if the role is a `superuser` or not.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `CREATEDB` | `NOCREATEDB`- allow the role to create new databases.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `CREATEROLE` | `NOCREATEROLE` - allow the role to create or change roles.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `INHERIT` | `NOINHERIT` - determine if the role inherits the privileges of roles of which it is a member.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `LOGIN` | `NOLOGIN` - allow the role to log in.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `REPLICATION` | `NOREPLICATION` - determine if the role is a replication role.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `BYPASSRLS` | `NOBYPASSRLS` - determine if the role is to bypass the row-level security (RLS) policy.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `CONNECTION LIMIT limit` - specify the number of concurrent connections a role can make, -1 means unlimited.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `PASSWORD 'password' | PASSWORD NULL` - change the role's password.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `VALID UNTIL 'timestamp'` - set the date and time after which the role's password is no longer valid.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The following rules are applied:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Superusers can change any of those attributes for any role.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Roles that have the `CREATEROLE` attribute can change any of these attributes for only non-superusers and no-replication roles.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Ordinal roles can only change their passwords.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

First, log in to PostgreSQL server using the `postgres` role.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, [create a new role](https://www.postgresqltutorial.com/postgresql-administration/postgresql-roles/) called `calf` using the `CREATE ROLE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
create role calf login password 'securePwd1';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `calf` role can log in with a password.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Because `postgres` is a superuser, it can change the role `calf` to be a superuser:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
alter role calf superuser;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

View the role `calf`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
\du calf
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
        List of roles
Role name | Attributes | Member of
-----------+------------+-----------
calf      | Superuser  | {}
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement sets the password of the role `calf` to expire until the end of `2050`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
alter role calf
valid until '2050-01-01';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Use the `\du` command to see the effect:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
\du calf
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
                            List of roles
Role name |                 Attributes                  | Member of
-----------+---------------------------------------------+-----------
calf      | Superuser                                  +| {}
          | Password valid until 2050-01-01 00:00:00-08 |
```

<!-- /wp:code -->

<!-- wp:heading -->

## Using the PostgreSQL ALTER ROLE to rename roles

<!-- /wp:heading -->

<!-- wp:paragraph -->

To change the name of a role, you use the following form of the `ALTER ROLE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
ALTER ROLE role_name
TO new_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, you specify the name of the role after the `ALTER ROLE` keywords and the new name of the role after the `TO` keyword.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

A superuser can rename any role. A role that has the `CREATEROLE` privilege can rename no-superuser roles.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you use a role to log in to the PostgreSQL database server and rename it in the current session, you will get an error:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
ERROR:  session user cannot be renamed
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this case, you need to connect to the PostgreSQL database server using a different role to rename that role.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

You execute the following statement from the `postgres`' session to rename the role `calf` to `elephant`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
ALTER ROLE calf
RENAME TO elephant;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Changing a role's session default for a configuration variable

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following `ALTER ROLE` statement changes the role's session default for a configuration variable:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
ALTER ROLE role_name | CURRENT_USER | SESSION_USER | ALL
[IN DATABASE database_name]
SET configuration_param = { value | DEFAULT }
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the role that you want to modify the role's session default, or use the `CURRENT_USER`, or `SESSION_USER`. You use the `ALL` option to change the settings for all roles.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, specify a database name after the `IN DATABASE` keyword to change only for sessions in the named database. In case you omit the `IN DATABASE` clause, the change will be applied to all databases.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Third, specify the configuration parameter and the new value in the `SET` clause.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Superusers can change the session defaults of any role. Roles with the `CREATEROLE` attribute can set the defaults for non-superuser roles. Ordinary roles can only set defaults for themselves. Only superusers can change a setting for all roles in all databases.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example uses the `ALTER ROLE` to give the role elephant a non-default, database-specific setting of the `client_min_messages` parameter:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
ALTER ROLE elephant
IN DATABASE dvdrental
SET client_min_messages = NOTICE;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `ALTER ROLE role_name option` to modify the attributes of a role.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `ALTER ROLE role_name RENAME TO new_role` statement to rename a role.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `ALTER ROLE role_name SET param=value` statement to change a role's session default for a configuration variable.
- <!-- /wp:list-item -->

<!-- /wp:list -->
