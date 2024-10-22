---
title: "PostgreSQL PL/pgSQL"
page_title: "PostgreSQL PL/pgSQL"
page_description: "In this section, you will learn how to develop user-defined functions and stored procedures in PostgreSQL using PL/pgSQL programming language."
prev_url: "https://www.postgresqltutorial.com/postgresql-plpgsql/"
ogImage: ""
updatedOn: "2024-03-22T09:00:29+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL generate_series() Function"
  slug: "postgresql-tutorial/postgresql-generate_series"
next_page: 
  title: "Introduction to PostgreSQL PL/pgSQL"
  slug: "postgresql-plpgsql/introduction-to-postgresql-stored-procedures"
---





![](/postgresqltutorial/PostgreSQL-Stored-Procedure.png?alignright)
This section shows you step by step how to use the PL/pgSQL to develop PostgreSQL user\-defined functions and stored procedures.

PL/pgSQL procedural language adds many procedural elements, e.g., control structures, loops, and complex computations, to extend standard SQL. It allows you to develop complex functions and stored procedures in PostgreSQL that may not be possible using plain SQL.

PL/pgSQL procedural language is similar to the [Oracle PL/SQL](https://www.oracletutorial.com/plsql-tutorial/). The following are reasons to learn PL/pgSQL:

* PL/pgSQL is easy to learn and simple to use.
* PL/pgSQL comes with PostgreSQL by default. The user\-defined functions and stored procedures developed in PL/pgSQL can be used like any built\-in functions and stored procedures.
* PL/pgSQL inherits all user\-defined types, functions, and operators.
* PL/pgSQL has many features that allow you to develop complex functions and stored procedures.
* PL/pgSQL can be defined to be trusted by the PostgreSQL database server.

Let’s get started programming with PL/pgSQL.


## Section 1\. Getting started

* [Introduction to PostgreSQL PL/pgSQL](postgresql-plpgsql/introduction-to-postgresql-stored-procedures) – introduce you to PostgreSQL PL/pgSQL and explain to you their advantages and disadvantages.
* [Dollar\-quoted string constants](postgresql-plpgsql/dollar-quoted-string-constants) – learn how to use dollar\-quoted string constant syntax.
* [Block Structure](postgresql-plpgsql/plpgsql-block-structure) – introduce you to the PL/pgSQL block structure and show you how to develop and execute anonymous blocks.

## Section 2\. Variables \& constants

* [Variables](postgresql-plpgsql/plpgsql-variables) – show you how to declare variables in PL/pgSQL.
* [Select into](postgresql-plpgsql/pl-pgsql-select-into) – guide you on how to use the `select into` to select data and assign it to a variable.
* [Row type variables](postgresql-plpgsql/pl-pgsql-row-types) – learn how to use the row variables to store a complete row of a result set.
* [Record type variables](postgresql-plpgsql/plpgsql-record-types) – show you how to declare record variables to hold a single row of a result set.
* [Constants](postgresql-plpgsql/plpgsql-constants) – guide you on how to use constants to make the code more readable and easier to maintain.

## Section 3\. Reporting messages and errors

* [Raising errors and reporting messages](postgresql-plpgsql/plpgsql-errors-messages) – show you how to report messages and raise errors in PL/pgSQL.
* [Assert](postgresql-plpgsql/pl-pgsql-assert) – show you how to use the assert statement to add debugging checks to PL/pgSQL code.

## Section 4\. Control structures

* [If statement](postgresql-plpgsql/plpgsql-if-else-statements) – introduce you to three forms of the `if` statement.
* [Case statements](postgresql-plpgsql/plpgsql-case-statement) – explain `case` statements including the simple and searched `case` statements.
* [Loop statements](postgresql-plpgsql/plpgsql-loop-statements) – show you how to use loop statements to execute a block of code repeatedly based on a condition.
* [While loop](postgresql-plpgsql/pl-pgsql-while-loop) – learn how to use `while` loop statement to create a pre\-test loop.
* [For loop](postgresql-plpgsql/plpgsql-for-loop) – show you how to use the `for` loop statement to iterate over rows of a result set.
* [Exit](postgresql-plpgsql/plpgsql-exit) – guide you on using the `exit` statement to terminate a loop.
* [Continue](postgresql-plpgsql/pl-pgsql-continue) – provide you with a way to use the `continue` statement to skip the current loop iteration and start a new one.

## Section 5\. User\-defined functions

* [Create Function](postgresql-plpgsql/postgresql-create-function) – show you how to develop a user\-defined function by using the `create function` statement.
* [Function parameter modes](postgresql-plpgsql/plpgsql-function-parameters) – introduce you to various parameter modes including `IN`, `OUT`, and `INOUT`.
* [Function overloading](postgresql-plpgsql/plpgsql-function-overloading) – introduce you to function overloading.
* [Functions that return a table](postgresql-plpgsql/plpgsql-function-returns-a-table) – show you how to develop a function that returns a table.
* [Functions that return one or more rows](postgresql-plpgsql/plpgsql-returns-setof) – learn how to define a function that returns one or more rows.
* [Drop function](postgresql-plpgsql/postgresql-drop-function) – learn how to remove an existing function.

## Section 6\. Exception handling

* [Handling exceptions](postgresql-plpgsql/postgresql-exception) – show you how to use the exception clause to catch and handle exceptions.

## Section 7\. Stored procedures

* [Create procedure](postgresql-plpgsql/postgresql-create-procedure) – show you how to create a stored procedure using the `create procedure` statement and invoke it.
* [Drop procedure](postgresql-plpgsql/postgresql-drop-procedure) – learn how to remove a stored procedure from the database.
* [Stored procedures with INOUT parameters](postgresql-plpgsql/postgresql-stored-procedure-with-inout-parameters) – return values from stored procedures using the `inout` parameters.

## Section 8\. Cursors

* [Cursors](postgresql-plpgsql/plpgsql-cursor) – show you how to use cursors to process a result set, row by row.

## Section 9\. Trigger functions

* [Trigger procedures using PL/pgSQL](postgresql-triggers) – apply PL/pgSQL to define [trigger](postgresql-triggers) procedures.
