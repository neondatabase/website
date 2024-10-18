---
title: 'Introduction to PostgreSQL PL/pgSQL'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-plpgsql/introduction-to-postgresql-stored-procedures/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about **PostgreSQL PL/pgSQL **procedural language.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Overview of PostgreSQL PL/pgSQL

<!-- /wp:heading -->

<!-- wp:paragraph -->

PL/pgSQL is a procedural programming language for the PostgreSQL database system.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PL/pgSQL allows you to extend the functionality of the PostgreSQL database server by creating server objects with complex logic.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PL/pgSQL is designed to :

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Create user-defined [functions](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/), [stored procedures](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-procedure/), and [triggers](https://www.postgresqltutorial.com/postgresql-triggers/).
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Extend standard SQL by adding control structures such as [if-else](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-if-else-statements/), [case](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-case/), and [loop](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-loop-statements/) statements.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Inherit all user-defined functions, operators, and types.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Since PostgreSQL 9.0, PL/pgSQL is installed by default.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Advantages of using PL/pgSQL

<!-- /wp:heading -->

<!-- wp:paragraph -->

SQL is a query language that allows you to effectively manage data in the database. However, PostgreSQL only can execute SQL statements individually.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

It means that you have multiple statements, and you need to execute them one by one like this:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, send a query to the PostgreSQL database server.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Next, wait for it to process.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Then, process the result set.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- After that, do some calculations.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Finally, send another query to the PostgreSQL database server and repeat this process.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

This process incurs the interprocess communication and network overheads.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To resolve this issue, PostgreSQL uses PL/pgSQL.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PL/pgSQL wraps multiple statements in an object and stores it on the PostgreSQL database server.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Instead of sending multiple statements to the server one by one, you can send one statement to execute the object stored in the server. This allows you to:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Reduce the number of round trips between the application and the PostgreSQL database server.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Avoid transferring the immediate results between the application and the server.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## PostgreSQL PL/pgSQL disadvantages

<!-- /wp:heading -->

<!-- wp:paragraph -->

Besides the advantages of using PL/pgSQL, there are some caveats:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Slower in software development because PL/pgSQL requires specialized skills that many developers do not possess.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Difficult to manage versions and hard to debug.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- May not be portable to other database management systems[.](http://www.mysqltutorial.org)
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

In this tutorial, you have a brief overview of PostgreSQL PL/pgSQL, its advantages, and disadvantages.

<!-- /wp:paragraph -->
