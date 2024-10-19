---
createdAt: 2013-06-06T08:37:15.000Z
title: 'PostgreSQL CREATE ROLE Statement'
redirectFrom: 
            - /postgresql/postgresql-administration/postgresql-roles
ogImage: /postgresqltutorial_data/wp-content-uploads-2013-06-PostgreSQL-Roles.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about the PostgreSQL roles and how to use the PostgreSQL `CREATE ROLE` statement to create new roles.

![PostgreSQL Roles](/postgresqltutorial_data/wp-content-uploads-2013-06-PostgreSQL-Roles.png)

PostgreSQL uses the concept of **roles** to represent user accounts. It doesn't use the concept of users like other database systems.

Typically, roles that can log in to the PostgreSQL server are called login roles. They are equivalent to user accounts in other database systems.

When roles contain other roles, they are referred to as **[group roles](/postgresql/postgresql-administration/postgresql-role-membership)**.

Note that PostgreSQL combined the users and groups into roles since version 8.1

## Introduction to PostgreSQL CREATE ROLE statement

To create a new role in a PostgreSQL server, you use the `CREATE ROLE` statement.

Here's the basic syntax of the `CREATE ROLE` statement:

```sql
CREATE ROLE role_name;
```

In this syntax, you specify the name of the role that you want to create after the `CREATE ROLE` keywords.

When you create a role, it is valid in all databases within the database server (or cluster).

For example, the following statement uses the `CREATE ROLE` statement to create a new role called `bob`:

```sql
CREATE ROLE bob;
```

To retrieve all roles in the current PostgreSQL server, you can query them from the `pg_roles` system catalog as follows:

```sql
SELECT rolname FROM pg_roles;
```

Output:

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

Notice that the roles whose names start with `pg_` are system roles. The `postgres` is a [superuser](/postgresql/postgresql-administration/create-superuser-postgresql) role created by the PostgreSQL installer.

In `psql`, you can use the `\du` command to show all roles that you create including the postgres role in the current PostgreSQL server:

```
\du
```

Output:

```
                             List of roles
 Role name |                         Attributes
-----------+------------------------------------------------------------
 bob       | Cannot login
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS
```

The output indicates that the role `bob` cannot log in.

To allow the `bob` to log in to the PostgreSQL server, you need to add the `LOGIN` attribute to it.

### Role attributes

The attributes of a role define privileges for that role, including login, [superuser](/postgresql/postgresql-administration/create-superuser-postgresql) status, database creation, role creation, password management, and so on.

Here's the syntax for creating a new role with attributes.

```sql
CREATE ROLE name WITH option;
```

In this syntax, the `WITH` keyword is optional. The `option` can be one or more attributes like `SUPERUSER`, `CREATEDB`, `CREATEROLE`, etc.

### 1) Create login roles

For example, the following statement creates a role called `alice` that has the login privilege and an initial password:

```sql
CREATE ROLE alice
LOGIN
PASSWORD 'securePass1';
```

Note that you place the password in single quotes (`'`).

Here's the new roles list:

```
 Role name |                         Attributes
-----------+------------------------------------------------------------
 alice     |
 bob       | Cannot login
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS
```

Now, you can use the role `alice` to log in to the PostgreSQL database server using the `psql` client tool:

```
psql -U alice
```

It will prompt you for a password. You need to enter the password that you entered in the `CREATE ROLE` statement to log in to the PostgreSQL server.

### 2) Create superuser roles

The following statement creates a role called `john` that has the `superuser` attribute.

```sql
CREATE ROLE john
SUPERUSER
LOGIN
PASSWORD 'securePass1';
```

The superuser role has all permissions within the PostgreSQL server. Therefore, you should create the superuser role only when necessary.

Notice that only a superuser role can create another superuser role.

### 3) Create roles with database creation permission

If you want to create roles that have the database creation privilege, you can use the `CREATEDB` attribute:

```sql
CREATE ROLE dba
CREATEDB
LOGIN
PASSWORD 'securePass1';
```

### 4) Create roles with a validity period

To set a date and time after which the role's password is no longer valid, you use the `VALID UNTIL` attribute:

```sql
VALID UNTIL 'timestamp'
```

For example, the following statement creates a `dev_api` role with password valid until the end of 2049:

```sql
CREATE ROLE dev_api WITH
LOGIN
PASSWORD 'securePass1'
VALID UNTIL '2050-01-01';
```

After one second tick in 2050, the password of `dev_api` is no longer valid.

### 5) Create roles with connection limit

To specify the number of concurrent connections a role can make, you use the `CONNECTION LIMIT` attribute:

```sql
CONNECTION LIMIT connection_count
```

The following creates a new role called `api` that can make 1000 concurrent connections:

```sql
CREATE ROLE api
LOGIN
PASSWORD 'securePass1'
CONNECTION LIMIT 1000;
```

The following `psql` command shows all the roles that we have created so far:

```
\du
```

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

## Summary

- PostgreSQL uses roles to represent user accounts. A role that can log in is equivalent to a user account in other database systems.
-
- Use the role attributes to specify the privileges of the roles such as `LOGIN` allows the role to log in, `CREATEDB` allows the role to create a new database, `SUPERUSER` allows the role to have all privileges.
