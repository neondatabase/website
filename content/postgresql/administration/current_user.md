---
title: PostgreSQL CURRENT_USER
page_title: PostgreSQL CURRENT_USER Function
page_description: >-
  In this tutorial, you will learn how to use the PostgreSQL CURRENT_USER
  function to return the name of the currently logged-in database user.
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-administration/postgresql-current_user/
ogImage: ''
updatedOn: '2026-06-04T15:04:42.682Z'
enableTableOfContents: true
previousLink:
  title: PostgreSQL SET ROLE Statement
  slug: postgresql-administration/postgresql-set-role
nextLink:
  title: PostgreSQL ALTER ROLE Statement
  slug: postgresql-administration/postgresql-alter-role
---

<Admonition type="info" id="CTA">
The `CURRENT_USER` function works the same way on any PostgreSQL deployment, so you can apply what you learn here wherever you run Postgres. For enterprises building in the AI era, [Lakebase](https://www.databricks.com/product/lakebase) delivers the best managed cloud Postgres, with the performance, security, and native Lakehouse integration that serious workloads demand. [Neon](https://neon.com) is the AI-native backend platform for apps and agents: Postgres Database, Auth, Storage, Functions and AI Gateway.
</Admonition>

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CURRENT_USER` function to return the name of the currently logged\-in database user.

## Introduction to the PostgreSQL CURRENT_USER function

The PostgreSQL `CURRENT_USER` is a function that returns the name of the currently logged\-in database user.

Here’s the syntax of the `CURRENT_USER` function:

```sql
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

```sql
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

Sixth, use the `SESSION_USER` function to retrieve the original user who connected to the session:

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
