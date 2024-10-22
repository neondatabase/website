---
title: "PL/pgSQL IF Statement"
page_title: "PL/pgSQL IF Statement"
page_description: "Show you how to use three forms of the PL/pgSQL IF statement that executes a command based on a certain condition."
prev_url: "https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-if-else-statements/"
ogImage: "/postgresqltutorial/plpgsql-if-statement.png"
updatedOn: "2024-03-19T03:39:48+00:00"
enableTableOfContents: true
prev_page: 
  title: "PL/pgSQL Assert Statement"
  slug: "postgresql-plpgsql/pl-pgsql-assert"
next_page: 
  title: "PL/pgSQL CASE Statement"
  slug: "postgresql-plpgsql/plpgsql-case-statement"
---




**Summary**: in this tutorial, you will learn how to use the PL/pgSQL `if` statements to execute a command based on a specific condition.


## Introduction to PL/pgSQL IF Statement

The `if` statement allows you to execute one or more statements based on a condition. PL/pgSQL provides you with three forms of the `if` statements:

1. `if then`
2. `if then else`
3. `if then elsif`


### 1\) PL/pgSQL if\-then statement

The following illustrates the simplest form of the `if` statement:


```pgsql
if condition then
   statements;
end if;
```
The `if` statement executes `statements` when a `condition` is true. If the `condition` evaluates to `false`, the control is passed to the next statement after the `end if` .

The `condition` is a boolean expression that evaluates to `true` or `false`.

The `statements` can be one or more statements that you want to execute when the `condition` is true. It may contain other `if` statements.

When you place an `if` statement is within another `if` statement, you’ll have a nested\-if statement.

The following flowchart illustrates the simple `if` statement.

[![PL/pgSQL if statement](/postgresqltutorial/plpgsql-if-statement.png)](/postgresqltutorial/plpgsql-if-statement.png)The following example uses an `if` statement to check if a query returns any rows:


```pgsql
do $$
declare
  selected_film film%rowtype;
  input_film_id film.film_id%type = 0;
begin  

  select * from film
  into selected_film
  where film_id = input_film_id;
  
  if not found then
     raise notice'The film % could not be found', 
	    input_film_id;
  end if;
end $$;
```
Output:


```http
NOTICE:  The film 0 could not be found

```
In this example, we select a film by a specific film id (`0`).

The `found` is a global variable that is available in PL/pgSQL. The [`select into`](https://neon.tech/postgresql/plpgsql-select-into/) statement sets the `found` variable if a row is assigned or `false` if no row is returned.

We use the `if` statement to check if the film with id (0\) exists and raise a notice if it does not.


```shell
if not found then
   raise notice'The film % could not be found', input_film_id;
end if;
```
If you change the value of the `input_film_id` variable to some value that exists in the film table like 100, you will not see any message.


### 2\) PL/pgSQL if\-then\-else statement

The `if...then...else` statement executes the statements in the `if` branch if the `condition` evaluates to true; otherwise, it executes the statements in the `else` branch.

Here’s the syntax of the `if...then...else` statement:


```pgsql
if condition then
  statements;
else
  alternative-statements;
end if;
```
The following flowchart illustrates the `if else` statement.


![PL/pgSQL if else statement](/postgresqltutorial/plpgsql-if-else-statement.png)
The following example uses an if…then…else statement to display a message showing that a film with a specific id exists or not:


```pgsql
do $$
declare
  selected_film film%rowtype;
  input_film_id film.film_id%type := 100;
begin  

  select * from film
  into selected_film
  where film_id = input_film_id;
  
  if not found then
     raise notice 'The film % could not be found', 
	    input_film_id;
  else
     raise notice 'The film title is %', selected_film.title;
  end if;
end $$;
```
Output:


```shell
NOTICE:  The film title is Brooklyn Desert
```
In this example, because the film id 100 exists in the film table the `found` variable is true. Therefore, the statement in the `else` branch is executed.


### 3\) PL/pgSQL if\-then\-elsif Statement

Unlike the `if` and `if...then...else` statements that evaluate only one condition, the `if then elsif` statement allows you to evaluate multiple conditions. and execute one or more statements when a condition is true.

Here’s the syntax of the `if...then...elsif` statement:


```pgsql
if condition_1 then
  statement_1;
elsif condition_2 then
  statement_2
...
elsif condition_n then
  statement_n;
else
  else-statement;
end if;
```
In this syntax, if the `condition_1` is `true` then the `if...then...elsif` statement executes the `statement_1` and stops evaluating the other conditions such as `condition_2`, `condition_3`, and so on.

If all conditions are evaluated to `false`, the `if...then...elsif` executes the statements in the `else` branch.

The following flowchart illustrates the `if then elsif` statement:


![PL/pgSQL if ELSif else Statement](/postgresqltutorial/if-elsif-else-statement.png)
Let’s look at the following example:


```pgsql
do $$
declare
   v_film film%rowtype;
   len_description varchar(100);
begin  

  select * from film
  into v_film
  where film_id = 100;
  
  if not found then
     raise notice 'Film not found';
  else
      if v_film.length >0 and v_film.length <= 50 then
		 len_description := 'Short';
	  elsif v_film.length > 50 and v_film.length < 120 then
		 len_description := 'Medium';
	  elsif v_film.length > 120 then
		 len_description := 'Long';
	  else 
		 len_description := 'N/A';
	  end if;
    
	  raise notice 'The % film is %.',
	     v_film.title,  
	     len_description;
  end if;
end $$;
```
Output:


```http
NOTICE:  The Brooklyn Desert film is Long.
```
How it works:

* First, select the film with id 100\. If the film does not exist, raise a notice that the film is not found.
* Second, use the `if...then....elsif` statement to assign a description to a film based on the length of the film.


## Summary

* Use the `if..then` statement to execute one or more statements when a condition is `true`.
* Use the `if...then...else` statement to execute statements when a condition is `true` and execute other statements when the condition is `false`.
* Use the `if...then...elsif` statement to evaluate multiple conditions and execute statements when the corresponding condition is `true`.

