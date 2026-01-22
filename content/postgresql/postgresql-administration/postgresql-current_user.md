---
title: 'PostgreSQL CURRENT_USER'
page_title: 'PostgreSQL CURRENT_USER Function'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL CURRENT_USER function to return the name of the currently logged-in database user.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-administration/postgresql-current_user/'
ogImage: ''
updatedOn: '2024-02-22T06:48:14+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL SET ROLE Statement'
  slug: 'postgresql-administration/postgresql-set-role'
nextLink:
  title: 'PostgreSQL ALTER ROLE Statement'
  slug: 'postgresql-administration/postgresql-alter-role'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CURRENT_USER` function to return the name of the currently logged\-in database user.

## Introduction to the PostgreSQL CURRENT_USER function

The PostgreSQL `CURRENT_USER` is a function that returns the name of the currently logged\-in database user.

Here’s the syntax of the `CURRENT_USER` function:

```sqlsql
CURRENT_USER
```

The function returns the name of the current effective user within the session.

In other words, if you use the [`SET ROLE`](postgresql-set-role) statement to change the role of the current user to the new one, the `CURRENT_USER` will reflect the new role.

In PostgreSQL, a role with the `LOGIN` attribute represents a user. Therefore, we use the terms role and user interchangeably.

To get the original user who connected to the session, you use the `SESSION_USER` function.

## PostgreSQL CURRENT_USER function example

First, open the command prompt on Windows or a terminal on Unix\-like systems and connect to the PostgreSQL server using psql:

```bash
psql -U postgres
```

Second, use the `CURRENT_USER` function to get the currently logged\-in user:

```sql
SELECT CURRENT_USER;
```

Output:

```text
 current_user
--------------
 postgres
(1 row)
```

Third, [create a new role](postgresql-roles) called `bob`:

```sql
CREATE ROLE bob
WITH LOGIN PASSWORD 'SecurePass1';
```

Fourth, change the role of the current user to `bob`:

```
SET ROLE bob;
```

Fifth, execute the `CURRENT_USER` function:

```sql
SELECT CURRENT_USER;
```

It returns `bob` instead:

```text
 current_user
--------------
 bob
(1 row)
```

Six, use the `SESSION_USER` function to retrieve the original user who connected to the session:

```sql
SELECT SESSION_USER;
```

Output:

```text
 session_user
--------------
 postgres
(1 row)
```

The `SESSION_USER` function returns `postgres`, not `bob`.

## Summary

- Use the `CURRENT_USER` function to return the current effective user within the session.
- Use the `SESSION_USER` function to return the original user who connected to the session.
