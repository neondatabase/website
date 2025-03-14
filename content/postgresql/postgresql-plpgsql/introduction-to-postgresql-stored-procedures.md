---
title: 'Introduction to PostgreSQL PL/pgSQL'
page_title: 'Introduction to PostgreSQL PL/pgSQL Procedural Language'
page_description: 'This tutorial introduces you to PostgreSQL PL/pgSQL for developing user-defined functions and stored procedures.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-plpgsql/introduction-to-postgresql-stored-procedures/'
ogImage: ''
updatedOn: '2024-02-07T02:29:23+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL PL/pgSQL'
  slug: 'postgresql-plpgsql/'
nextLink:
  title: 'Dollar-Quoted String Constants'
  slug: 'postgresql-plpgsql/dollar-quoted-string-constants'
---

**Summary**: in this tutorial, you will learn about **PostgreSQL PL/pgSQL** procedural language.

## Overview of PostgreSQL PL/pgSQL

PL/pgSQL is a procedural programming language for the PostgreSQL database system.

PL/pgSQL allows you to extend the functionality of the PostgreSQL database server by creating server objects with complex logic.

PL/pgSQL is designed to :

- Create user\-defined [functions](postgresql-create-function), [stored procedures](postgresql-create-procedure), and [triggers](../postgresql-triggers).
- Extend standard SQL by adding control structures such as [if\-else](plpgsql-if-else-statements), [case](../postgresql-tutorial/postgresql-case), and [loop](plpgsql-loop-statements) statements.
- Inherit all user\-defined functions, operators, and types.

Since PostgreSQL 9\.0, PL/pgSQL is installed by default.

## Advantages of using PL/pgSQL

SQL is a query language that allows you to effectively manage data in the database. However, PostgreSQL only can execute SQL statements individually.

It means that you have multiple statements, and you need to execute them one by one like this:

- First, send a query to the PostgreSQL database server.
- Next, wait for it to process.
- Then, process the result set.
- After that, do some calculations.
- Finally, send another query to the PostgreSQL database server and repeat this process.

This process incurs the interprocess communication and network overheads.

To resolve this issue, PostgreSQL uses PL/pgSQL.

PL/pgSQL wraps multiple statements in an object and stores it on the PostgreSQL database server.

Instead of sending multiple statements to the server one by one, you can send one statement to execute the object stored in the server. This allows you to:

- Reduce the number of round trips between the application and the PostgreSQL database server.
- Avoid transferring the immediate results between the application and the server.

## PostgreSQL PL/pgSQL disadvantages

Besides the advantages of using PL/pgSQL, there are some caveats:

- Slower in software development because PL/pgSQL requires specialized skills that many developers do not possess.
- Difficult to manage versions and hard to debug.
- May not be portable to other database management systems[.](http://www.mysqltutorial.org)

In this tutorial, you have a brief overview of PostgreSQL PL/pgSQL, its advantages, and disadvantages.
