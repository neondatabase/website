---
title: 'PostgreSQL SET ROLE Statement'
page_title: 'PostgreSQL SET ROLE Statement'
page_description: 'In this tutorial, you will learn how to use the SET ROLE statement to temporarily change the current role within a database session.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-administration/postgresql-set-role/'
ogImage: ''
updatedOn: '2024-02-22T03:14:57+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL Role Membership'
  slug: 'postgresql-administration/postgresql-role-membership'
nextLink:
  title: 'PostgreSQL CURRENT_USER'
  slug: 'postgresql-administration/postgresql-current_user'
---

**Summary**: in this tutorial, you will learn how to use the `SET ROLE` statement to temporarily change the current role within a database session.

## Introduction to the PostgreSQL SET ROLE statement

The `SET ROLE` statement allows you to temporarily change the current role within a database session

Here’s the syntax of the `SET ROLE` statement:

```sql
SET ROLE role_name;
```

In this syntax, you specify the name of the role to which you want to switch.

The `role_name` must be a role of which the current session user is a member.

If the session user is a superuser, you can switch to any role.

## PostgreSQL SET ROLE statement example

We’ll take an example of using the `SET ROLE` statement.

First, [connect](../postgresql-getting-started/connect-to-postgresql-database) to the `dvdrental` database using `psql`:

```bash
psql -U postres -d dvdrental
```

Second, [create a group role](postgresql-role-membership) called `marketing`:

```sql
CREATE ROLE marketing;
```

Third, [grant](postgresql-grant) the `SELECT` privilege on the `film` table:

```sql
GRANT SELECT ON film TO marketing;
```

Fourth, [create a role](postgresql-role-membership) called `lily` that is a member of the `marketing` role:

```sql
CREATE ROLE lily
WITH LOGIN PASSWORD 'SecurePass1'
IN ROLE marketing;
```

Sixth, connect to the `dvdrental` database using the `lily` role in a separate session:

```bash
psql -U lily -d dvdrental
```

Seventh, retrieve the current role:

```sql
SELECT current_role;
```

Output:

```text
 current_role
--------------
 lily
(1 row)
```

Eight, switch the current role to `marketing`:

```sql
SET ROLE marketing;
```

Ninth, retrieve the current role:

```text
 current_role
--------------
 marketing
(1 row)
```

Output:

```text
 current_role
--------------
 marketing
(1 row)
```

The output indicates that the current role is `marketing`, not `lily` due to the `SET ROLE` statement.

If you attempt to switch the current role to a [superuser](create-superuser-postgresql) such as `postgres`, you’ll get an error because the current role is not a `superuser` role.

Tenth, switch the current role to `postgres`:

```sql
SET ROLE postgres;
```

Output:

```sql
ERROR:  permission denied to set role "postgres"
```

To set the current role back to the original one, you use the `RESET` `ROLE` statement:

```sql
RESET ROLE;
```

Eleventh, select the current role:

```text
 current_role
--------------
 lily
(1 row)
```

The current role is back to `lily`.

## Summary

- Use the `SET` `ROLE` statement to temporarily change the current role within a database session.
- Use the `RESET` `ROLE` statement to reset the role to the original one.
