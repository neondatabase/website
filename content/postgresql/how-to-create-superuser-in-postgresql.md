---
title: 'How to Create Superuser in PostgreSQL'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/create-superuser-postgresql/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about PostgreSQL superusers and how to create them using the `CREATE` `ROLE` statement.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL superuser

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, a superuser is a special role with the highest privileges. A superuser has full access to all databases and tables. Additionally, it can perform administrative tasks such as [creating databases](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-database/), [dropping databases](https://www.postgresqltutorial.com/postgresql-administration/postgresql-drop-database/), [managing user roles](https://www.postgresqltutorial.com/postgresql-administration/postgresql-roles/), modifying database configuration, and so on.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In other words, a superuser can bypass all security checks except the right to log in.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

By default, PostgreSQL has a superuser role called `postgres`. Typically, you use the `postgres` user role for performing administrative tasks and don't need to create additional users with the superuser privilege.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

However, if you need additional superuser roles, you can create them using the `CREATE ROLE` statement or change a regular user to a superuser using the `ALTER ROLE` statement.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Creating new superusers

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, connect to the PostgreSQL database using a client such as `psql`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, execute the following `CREATE ROLE` command to create a superuser:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE ROLE username SUPERUSER;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

You need to replace `username` with your desired username for the superuser. For example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE ROLE spiderman SUPERUSER
LOGIN
PASSWORD 'moreSecurePass';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, verify the user creation:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
\du spiderman
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
     List of roles
 Role name | Attributes
-----------+------------
 spiderman | Superuser
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that `spiderman` role is a superuser.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Changing a user to a superuser

<!-- /wp:heading -->

<!-- wp:paragraph -->

It's possible to change a user to a superuser using the `ALTER` `ROLE` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, create a regular role with a login privilege and a password:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE ROLE batman LOGIN PASSWORD 'moreSecurePass';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, make the `batman` role become a superuser using the `ALTER` `ROLE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER ROLE batman SUPERUSER;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, verify the user modification:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
\du batman
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
     List of roles
 Role name | Attributes
-----------+------------
 batman    | Superuser
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Revoking superuser from a user

<!-- /wp:heading -->

<!-- wp:paragraph -->

To revoke a superuser status of a user, you can use the following `ALTER` `ROLE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER USER username NOSUPERUSER;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

For example, the following statement revokes the `SUPERUSER` status from the `spiderman` role:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ALTER USER spiderman NOSUPERUSER;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

You can verify the `spiderman` role as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
\du spiderman
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
     List of roles
 Role name | Attributes
-----------+------------
 spiderman |
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- In PostgreSQL, a superuser bypass all permission checks except the permission to log in.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `CREATE ROLE...SUPERUSER` statement to create a superuser.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `ALTER ROLE...SUPERUSER` statement to make a role a superuser.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `ALTER ROLE...NOSUPERUSER` statement to revoke the superuser from a user.
- <!-- /wp:list-item -->

<!-- /wp:list -->
