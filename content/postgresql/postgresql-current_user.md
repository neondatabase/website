---
title: 'PostgreSQL CURRENT_USER'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-current_user/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CURRENT_USER` function to return the name of the currently logged-in database user.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL CURRENT_USER function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The PostgreSQL `CURRENT_USER` is a function that returns the name of the currently logged-in database user.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `CURRENT_USER` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CURRENT_USER
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The function returns the name of the current effective user within the session.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In other words, if you use the `SET ROLE` statement to change the role of the current user to the new one, the `CURRENT_USER` will reflect the new role.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

In PostgreSQL, a role with the `LOGIN` attribute represents a user. Therefore, we use the terms role and user interchangeably.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To get the original user who connected to the session, you use the `SESSION_USER` function.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL CURRENT_USER function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, open the command prompt on Windows or a terminal on Unix-like systems and connect to the PostgreSQL server using psql:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, use the `CURRENT_USER` function to get the currently logged-in user:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT CURRENT_USER;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 current_user
--------------
 postgres
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, [create a new role](https://www.postgresqltutorial.com/postgresql-administration/postgresql-roles/) called `bob`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE ROLE bob
WITH LOGIN PASSWORD 'SecurePass1';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, change the role of the current user to `bob`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SET ROLE bob;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, execute the `CURRENT_USER` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT CURRENT_USER;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It returns `bob` instead:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 current_user
--------------
 bob
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Six, use the `SESSION_USER` function to retrieve the original user who connected to the session:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT SESSION_USER;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 session_user
--------------
 postgres
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `SESSION_USER` function returns `postgres`, not `bob`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `CURRENT_USER` function to return the current effective user within the session.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `SESSION_USER` function to return the original user who connected to the session.
- <!-- /wp:list-item -->

<!-- /wp:list -->
