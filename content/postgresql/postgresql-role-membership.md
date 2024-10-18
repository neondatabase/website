---
title: 'PostgreSQL Role Membership'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-role-membership/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about PostgreSQL group roles and how to use them to manage privileges more effectively.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL group roles

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, a group role is a role that serves as a container for other individual roles.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Unlike individual roles, which typically represent users, a group role is used to manage collections of roles.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Typically, you create a role to represent a group and then grant a membership in the group role to individual roles.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Group roles allow you to simplify permission management. Instead of granting privileges to individual roles, you can group these roles into a group, grant privileges to a group role, and all the members of that group role will inherit those privileges.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Group roles can have individual roles or other group roles as their members. This allows you to create hierarchical structures where you can manage privileges at different levels.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Individual roles can be members of multiple group roles. This allows for flexible assignment of permissions and roles within the database.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Creating a group role

<!-- /wp:heading -->

<!-- wp:paragraph -->

Creating a group role is like creating a role by using the `CREATE ROLE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE ROLE group_role;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, you specify the name of the group role after the `CREATE ROLE` keyword.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

By convention, a group role does not have the `LOGIN` privilege, meaning that you will not use the group role to log in to PostgreSQL even though you can.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following statement creates a group role called `sales`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE ROLE sales;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

When you use the `\du` command in the `psql` tool, you will see that the group roles are listed together with individual roles:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
                             List of roles
 Role name |                         Attributes
-----------+------------------------------------------------------------
 alice     |
 api       | 1000 connections
 bob       | Cannot login
 dba       | Create DB
 dev_api   | Password valid until 2050-01-01 00:00:00+07
 jim       |
 joe       |
 john      | Superuser
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS
 sales     | Cannot login
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Adding a role to a group role

<!-- /wp:heading -->

<!-- wp:paragraph -->

To add a role to a group, you use the following form of the `GRANT` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
GRANT group_role TO role;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the group role after the `GRANT` keyword.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, specify the name of the role after the `TO` keyword.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

For example, the following statement creates a new role `alice` and adds it to the group role `sales`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
GRANT sales TO alice;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

After you execute this statement, the `alice` role will automatically inherit all privileges of the `sales` group role if the `alice` role has `INHERIT` attribute.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Note that if your PostgreSQL server does not have the `alice` role, you can run the following command first to create it:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE ROLE alice
WITH LOGIN
PASSWORD 'SecurePass1';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This CREATE ROLE implicitly uses the `INHERIT` attribute to ensure that the role `alice` automatically inherits privileges from the group roles to which it belongs.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you don't want the role `alice` to inherit the privileges of its group roles, you can use the `NOINHERIT` attribute:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE ROLE alice
WITH LOGIN NOINHERIT
PASSWORD 'SecurePass1';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following grants the `SELECT` privilege on the rental table to the `sales` group role:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
GRANT SELECT ON rental TO sales;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The role `alice` will automatically inherit the `SELECT` privilege on the `rental` table from the `sales` group role.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Let's test it out.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, connect to the PostgreSQL server using the `alice` role:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U alice -d dvdrental
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, retrieve data from the rental table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT count(*) FROM rental;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 count
-------
 16044
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the role `alice` has the `SELECT` privilege on the `rental` table even though we did not explicitly assign it.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Removing a role to a group role

<!-- /wp:heading -->

<!-- wp:paragraph -->

To remove a role from a group role, you use the `REVOKE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
REVOKE group_role FROM role;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the group role after the `REVOKE` keyword.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, specify the name of the role after the `FROM` keyword.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph {"className":"note"} -->

A useful tip to remember when using `GRANT` and `REVOKE` statements with the group role is that the **group role should come first**, followed by the individual role.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following statement uses the `REVOKE` statement to remove the role `alice` from the group role `sales`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
REVOKE sales FROM alice;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Notice that PostgreSQL does not permit circular membership loops, where a role is the member of another role and vice versa.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- A group role is a role that serves as a container for other roles.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- All individual roles of a group role automatically inherit privileges granted to the group role. Use the `NOINHERIT` attribute if you don't want a role to inherit the privileges from its group roles.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `GRANT` statement to add a role to a group role.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `REVOKE` statement to remove a role from a group.
- <!-- /wp:list-item -->

<!-- /wp:list -->
