---
title: 'PostgreSQL Role Membership'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-role-membership
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about PostgreSQL group roles and how to use them to manage privileges more effectively.

## Introduction to PostgreSQL group roles

In PostgreSQL, a group role is a role that serves as a container for other individual roles.

Unlike individual roles, which typically represent users, a group role is used to manage collections of roles.

Typically, you create a role to represent a group and then grant a membership in the group role to individual roles.

Group roles allow you to simplify permission management. Instead of granting privileges to individual roles, you can group these roles into a group, grant privileges to a group role, and all the members of that group role will inherit those privileges.

Group roles can have individual roles or other group roles as their members. This allows you to create hierarchical structures where you can manage privileges at different levels.

Individual roles can be members of multiple group roles. This allows for flexible assignment of permissions and roles within the database.

### Creating a group role

Creating a group role is like creating a role by using the `CREATE ROLE` statement:

```
CREATE ROLE group_role;
```

In this syntax, you specify the name of the group role after the `CREATE ROLE` keyword.

By convention, a group role does not have the `LOGIN` privilege, meaning that you will not use the group role to log in to PostgreSQL even though you can.

For example, the following statement creates a group role called `sales`:

```
CREATE ROLE sales;
```

When you use the `\du` command in the `psql` tool, you will see that the group roles are listed together with individual roles:

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

### Adding a role to a group role

To add a role to a group, you use the following form of the `GRANT` statement:

```
GRANT group_role TO role;
```

In this syntax:

- First, specify the name of the group role after the `GRANT` keyword.
-
- Second, specify the name of the role after the `TO` keyword.

For example, the following statement creates a new role `alice` and adds it to the group role `sales`:

```
GRANT sales TO alice;
```

After you execute this statement, the `alice` role will automatically inherit all privileges of the `sales` group role if the `alice` role has `INHERIT` attribute.

Note that if your PostgreSQL server does not have the `alice` role, you can run the following command first to create it:

```
CREATE ROLE alice
WITH LOGIN
PASSWORD 'SecurePass1';
```

This CREATE ROLE implicitly uses the `INHERIT` attribute to ensure that the role `alice` automatically inherits privileges from the group roles to which it belongs.

If you don't want the role `alice` to inherit the privileges of its group roles, you can use the `NOINHERIT` attribute:

```
CREATE ROLE alice
WITH LOGIN NOINHERIT
PASSWORD 'SecurePass1';
```

The following grants the `SELECT` privilege on the rental table to the `sales` group role:

```
GRANT SELECT ON rental TO sales;
```

The role `alice` will automatically inherit the `SELECT` privilege on the `rental` table from the `sales` group role.

Let's test it out.

First, connect to the PostgreSQL server using the `alice` role:

```
psql -U alice -d dvdrental
```

Second, retrieve data from the rental table:

```
SELECT count(*) FROM rental;
```

Output:

```
 count
-------
 16044
(1 row)
```

The output indicates that the role `alice` has the `SELECT` privilege on the `rental` table even though we did not explicitly assign it.

### Removing a role to a group role

To remove a role from a group role, you use the `REVOKE` statement:

```
REVOKE group_role FROM role;
```

In this syntax:

- First, specify the name of the group role after the `REVOKE` keyword.
-
- Second, specify the name of the role after the `FROM` keyword.

A useful tip to remember when using `GRANT` and `REVOKE` statements with the group role is that the **group role should come first**, followed by the individual role.

For example, the following statement uses the `REVOKE` statement to remove the role `alice` from the group role `sales`:

```
REVOKE sales FROM alice;
```

Notice that PostgreSQL does not permit circular membership loops, where a role is the member of another role and vice versa.

## Summary

- A group role is a role that serves as a container for other roles.
-
- All individual roles of a group role automatically inherit privileges granted to the group role. Use the `NOINHERIT` attribute if you don't want a role to inherit the privileges from its group roles.
-
- Use the `GRANT` statement to add a role to a group role.
-
- Use the `REVOKE` statement to remove a role from a group.
