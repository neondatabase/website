---
title: 'PostgreSQL CREATE ROLE Statement'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-roles/
ogImage: ./img/wp-content-uploads-2013-06-PostgreSQL-Roles.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about the PostgreSQL roles and how to use the PostgreSQL `CREATE ROLE` statement to create new roles.

<!-- /wp:paragraph -->

<!-- wp:image {"align":"right","id":781} -->

![PostgreSQL Roles](./img/wp-content-uploads-2013-06-PostgreSQL-Roles.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

PostgreSQL uses the concept of **roles** to represent user accounts. It doesn't use the concept of users like other database systems.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Typically, roles that can log in to the PostgreSQL server are called login roles. They are equivalent to user accounts in other database systems.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When roles contain other roles, they are referred to as **[group roles](https://www.postgresqltutorial.com/postgresql-administration/postgresql-role-membership/)**.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

Note that PostgreSQL combined the users and groups into roles since version 8.1

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL CREATE ROLE statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

To create a new role in a PostgreSQL server, you use the `CREATE ROLE` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `CREATE ROLE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE ROLE role_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, you specify the name of the role that you want to create after the `CREATE ROLE` keywords.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When you create a role, it is valid in all databases within the database server (or cluster).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following statement uses the `CREATE ROLE` statement to create a new role called `bob`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE ROLE bob;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To retrieve all roles in the current PostgreSQL server, you can query them from the `pg_roles` system catalog as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT rolname FROM pg_roles;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
           rolname
-----------------------------
 pg_database_owner
 pg_read_all_data
 pg_write_all_data
 pg_monitor
 pg_read_all_settings
 pg_read_all_stats
 pg_stat_scan_tables
 pg_read_server_files
 pg_write_server_files
 pg_execute_server_program
 pg_signal_backend
 pg_checkpoint
 pg_use_reserved_connections
 pg_create_subscription
 postgres
 bob
(16 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Notice that the roles whose names start with `pg_` are system roles. The `postgres` is a [superuser](https://www.postgresqltutorial.com/postgresql-administration/create-superuser-postgresql/) role created by the PostgreSQL installer.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In `psql`, you can use the `\du` command to show all roles that you create including the postgres role in the current PostgreSQL server:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
\du
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
                             List of roles
 Role name |                         Attributes
-----------+------------------------------------------------------------
 bob       | Cannot login
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the role `bob` cannot log in.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To allow the `bob` to log in to the PostgreSQL server, you need to add the `LOGIN` attribute to it.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Role attributes

<!-- /wp:heading -->

<!-- wp:paragraph -->

The attributes of a role define privileges for that role, including login, [superuser](https://www.postgresqltutorial.com/postgresql-administration/create-superuser-postgresql/) status, database creation, role creation, password management, and so on.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax for creating a new role with attributes.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE ROLE name WITH option;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, the `WITH` keyword is optional. The `option` can be one or more attributes like `SUPERUSER`, `CREATEDB`, `CREATEROLE`, etc.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Create login roles

<!-- /wp:heading -->

<!-- wp:paragraph -->

For example, the following statement creates a role called `alice` that has the login privilege and an initial password:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE ROLE alice
LOGIN
PASSWORD 'securePass1';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that you place the password in single quotes (`'`).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the new roles list:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 Role name |                         Attributes
-----------+------------------------------------------------------------
 alice     |
 bob       | Cannot login
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Now, you can use the role `alice` to log in to the PostgreSQL database server using the `psql` client tool:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
psql -U alice
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It will prompt you for a password. You need to enter the password that you entered in the `CREATE ROLE` statement to log in to the PostgreSQL server.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Create superuser roles

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement creates a role called `john` that has the `superuser` attribute.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE ROLE john
SUPERUSER
LOGIN
PASSWORD 'securePass1';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The superuser role has all permissions within the PostgreSQL server. Therefore, you should create the superuser role only when necessary.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Notice that only a superuser role can create another superuser role.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Create roles with database creation permission

<!-- /wp:heading -->

<!-- wp:paragraph -->

If you want to create roles that have the database creation privilege, you can use the `CREATEDB` attribute:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE ROLE dba
CREATEDB
LOGIN
PASSWORD 'securePass1';
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 4) Create roles with a validity period

<!-- /wp:heading -->

<!-- wp:paragraph -->

To set a date and time after which the role's password is no longer valid, you use the `VALID UNTIL` attribute:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
VALID UNTIL 'timestamp'
```

<!-- /wp:code -->

<!-- wp:paragraph -->

For example, the following statement creates a `dev_api` role with password valid until the end of 2049:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE ROLE dev_api WITH
LOGIN
PASSWORD 'securePass1'
VALID UNTIL '2050-01-01';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

After one second tick in 2050, the password of `dev_api` is no longer valid.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 5) Create roles with connection limit

<!-- /wp:heading -->

<!-- wp:paragraph -->

To specify the number of concurrent connections a role can make, you use the `CONNECTION LIMIT` attribute:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CONNECTION LIMIT connection_count
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following creates a new role called `api` that can make 1000 concurrent connections:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE ROLE api
LOGIN
PASSWORD 'securePass1'
CONNECTION LIMIT 1000;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following `psql` command shows all the roles that we have created so far:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
\du
```

<!-- /wp:code -->

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
 john      | Superuser
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- PostgreSQL uses roles to represent user accounts. A role that can log in is equivalent to a user account in other database systems.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the role attributes to specify the privileges of the roles such as `LOGIN` allows the role to log in, `CREATEDB` allows the role to create a new database, `SUPERUSER` allows the role to have all privileges.
- <!-- /wp:list-item -->

<!-- /wp:list -->
