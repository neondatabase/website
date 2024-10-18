---
title: 'PostgreSQL PL/pgSQL'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-plpgsql/
ogImage: ./img/wp-content-uploads-2013-06-PostgreSQL-Stored-Procedure.png
tableOfContents: true
---
<!-- wp:image {"align":"right","id":2322} -->

![](./img/wp-content-uploads-2013-06-PostgreSQL-Stored-Procedure.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

This section shows you step by step how to use the PL/pgSQL to develop PostgreSQL user-defined functions and stored procedures.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PL/pgSQL procedural language adds many procedural elements, e.g., control structures, loops, and complex computations, to extend standard SQL. It allows you to develop complex functions and stored procedures in PostgreSQL that may not be possible using plain SQL.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PL/pgSQL procedural language is similar to the [Oracle PL/SQL](https://www.oracletutorial.com/plsql-tutorial/). The following are reasons to learn PL/pgSQL:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- PL/pgSQL is easy to learn and simple to use.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- PL/pgSQL comes with PostgreSQL by default. The user-defined functions and stored procedures developed in PL/pgSQL can be used like any built-in functions and stored procedures.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- PL/pgSQL inherits all user-defined types, functions, and operators.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- PL/pgSQL has many features that allow you to develop complex functions and stored procedures.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- PL/pgSQL can be defined to be trusted by the PostgreSQL database server.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Let's get started programming with PL/pgSQL.

<!-- /wp:paragraph -->

<!-- wp:group -->

<!-- wp:heading -->

## Section 1. Getting started

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Introduction to PostgreSQL PL/pgSQL](https://www.postgresqltutorial.com/postgresql-plpgsql/introduction-to-postgresql-stored-procedures/) - introduce you to PostgreSQL PL/pgSQL and explain to you their advantages and disadvantages.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Dollar-quoted string constants](https://www.postgresqltutorial.com/postgresql-plpgsql/dollar-quoted-string-constants/) - learn how to use dollar-quoted string constant syntax.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Block Structure](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-block-structure/) - introduce you to the PL/pgSQL block structure and show you how to develop and execute anonymous blocks.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group -->

<!-- wp:heading -->

## Section 2. Variables & constants

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Variables](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-variables/) - show you how to declare variables in PL/pgSQL.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Select into](https://www.postgresqltutorial.com/postgresql-plpgsql/pl-pgsql-select-into/) - guide you on how to use the `select into` to select data and assign it to a variable.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Row type variables](https://www.postgresqltutorial.com/postgresql-plpgsql/pl-pgsql-row-types/) - learn how to use the row variables to store a complete row of a result set.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Record type variables](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-record-types/) - show you how to declare record variables to hold a single row of a result set.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Constants](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-constants/) - guide you on how to use constants to make the code more readable and easier to maintain.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group -->

<!-- wp:heading -->

## Section 3. Reporting messages and errors

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Raising errors and reporting messages](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-errors-messages/) - show you how to report messages and raise errors in PL/pgSQL.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Assert](https://www.postgresqltutorial.com/postgresql-plpgsql/pl-pgsql-assert/) - show you how to use the assert statement to add debugging checks to PL/pgSQL code.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group -->

<!-- wp:heading -->

## Section 4. Control structures

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [If statement](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-if-else-statements/) - introduce you to three forms of the `if` statement.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Case statements](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-case-statement/) - explain `case` statements including the simple and searched `case` statements.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Loop statements](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-loop-statements/) - show you how to use loop statements to execute a block of code repeatedly based on a condition.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [While loop](https://www.postgresqltutorial.com/postgresql-plpgsql/pl-pgsql-while-loop/) - learn how to use `while` loop statement to create a pre-test loop.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [For loop](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-for-loop/) - show you how to use the `for` loop statement to iterate over rows of a result set.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Exit](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-exit/) - guide you on using the `exit` statement to terminate a loop.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Continue](https://www.postgresqltutorial.com/postgresql-plpgsql/pl-pgsql-continue/) - provide you with a way to use the `continue` statement to skip the current loop iteration and start a new one.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group -->

<!-- wp:heading -->

## Section 5. User-defined functions

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Create Function](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/) - show you how to develop a user-defined function by using the `create function` statement.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Function parameter modes](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-function-parameters/) - introduce you to various parameter modes including `IN`, `OUT`, and `INOUT`.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Function overloading](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-function-overloading/) - introduce you to function overloading.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Functions that return a table](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-function-returns-a-table/) - show you how to develop a function that returns a table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Functions that return one or more rows](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-returns-setof/) - learn how to define a function that returns one or more rows.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Drop function](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-drop-function/) - learn how to remove an existing function.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group -->

<!-- wp:heading -->

## Section 6. Exception handling

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Handling exceptions](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-exception/) - show you how to use the exception clause to catch and handle exceptions.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group -->

<!-- wp:heading -->

## Section 7. Stored procedures

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Create procedure](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-procedure/) - show you how to create a stored procedure using the `create procedure` statement and invoke it.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Drop procedure](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-drop-procedure/) - learn how to remove a stored procedure from the database.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- [Stored procedures with INOUT parameters](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-stored-procedure-with-inout-parameters/) - return values from stored procedures using the `inout` parameters.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group -->

<!-- wp:heading -->

## Section 8. Cursors

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Cursors](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-cursor/) - show you how to use cursors to process a result set, row by row.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->

<!-- wp:group -->

<!-- wp:heading -->

## Section 9. Trigger functions

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- [Trigger procedures using PL/pgSQL](https://www.postgresqltutorial.com/postgresql-triggers/) - apply PL/pgSQL to define [trigger](https://www.postgresqltutorial.com/postgresql-triggers/) procedures.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- /wp:group -->
