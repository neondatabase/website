---
title: 'PL/pgSQL IF Statement'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-if-else-statements/
ogImage: ./img/wp-content-uploads-2015-09-plpgsql-if-statement.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PL/pgSQL `if` statements to execute a command based on a specific condition.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PL/pgSQL IF Statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `if` statement allows you to execute one or more statements based on a condition. PL/pgSQL provides you with three forms of the `if` statements:

<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->

1. <!-- wp:list-item -->
2. `if then`
3. <!-- /wp:list-item -->
4.
5. <!-- wp:list-item -->
6. `if then else`
7. <!-- /wp:list-item -->
8.
9. <!-- wp:list-item -->
10. `if then elsif`
11. <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading {"level":3} -->

### 1) PL/pgSQL if-then statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following illustrates the simplest form of the `if` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
if condition then
   statements;
end if;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `if` statement executes `statements` when a `condition` is true. If the `condition` evaluates to `false`, the control is passed to the next statement after the `end if` .

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `condition` is a boolean expression that evaluates to `true` or `false`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `statements` can be one or more statements that you want to execute when the `condition` is true. It may contain other `if` statements.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When you place an `if` statement is within another `if` statement, you'll have a nested-if statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following flowchart illustrates the simple `if` statement.

<!-- /wp:paragraph -->

<!-- wp:image {"align":"center","id":1353,"linkDestination":"custom"} -->

[![PL/pgSQL if statement](https://www.postgresqltutorial.com/wp-content/uploads/2015/09/plpgsql-if-statement.png)](./img/wp-content-uploads-2015-09-plpgsql-if-statement.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following example uses an `if` statement to check if a query returns any rows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
NOTICE:  The film 0 could not be found
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we select a film by a specific film id (`0`).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `found` is a global variable that is available in PL/pgSQL. The `select into` statement sets the `found` variable if a row is assigned or `false` if no row is returned.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

We use the `if` statement to check if the film with id (0) exists and raise a notice if it does not.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
if not found then
   raise notice'The film % could not be found', input_film_id;
end if;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you change the value of the `input_film_id` variable to some value that exists in the film table like 100, you will not see any message.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) PL/pgSQL if-then-else statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `if...then...else` statement executes the statements in the `if` branch if the `condition` evaluates to true; otherwise, it executes the statements in the `else` branch.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `if...then...else` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
if condition then
  statements;
else
  alternative-statements;
end if;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following flowchart illustrates the `if else` statement.

<!-- /wp:paragraph -->

<!-- wp:image {"align":"center","id":1350} -->

![PL/pgSQL if else statement](./img/wp-content-uploads-2015-09-plpgsql-if-else-statement.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following example uses an if...then...else statement to display a message showing that a film with a specific id exists or not:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
NOTICE:  The film title is Brooklyn Desert
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, because the film id 100 exists in the film table the `found` variable is true. Therefore, the statement in the `else` branch is executed.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) PL/pgSQL if-then-elsif Statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

Unlike the `if` and `if...then...else` statements that evaluate only one condition, the `if then elsif` statement allows you to evaluate multiple conditions. and execute one or more statements when a condition is true.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `if...then...elsif` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, if the `condition_1` is `true` then the `if...then...elsif` statement executes the `statement_1` and stops evaluating the other conditions such as `condition_2`, `condition_3`, and so on.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If all conditions are evaluated to `false`, the `if...then...elsif` executes the statements in the `else` branch.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following flowchart illustrates the `if then elsif` statement:

<!-- /wp:paragraph -->

<!-- wp:image {"align":"center","id":1351} -->

![PL/pgSQL if ELSif else Statement](./img/wp-content-uploads-2015-09-if-elsif-else-statement.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Let's look at the following example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
NOTICE:  The Brooklyn Desert film is Long.
```

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, select the film with id 100. If the film does not exist, raise a notice that the film is not found.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, use the `if...then....elsif` statement to assign a description to a film based on the length of the film.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `if..then` statement to execute one or more statements when a condition is `true`.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `if...then...else` statement to execute statements when a condition is `true` and execute other statements when the condition is `false`.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `if...then...elsif` statement to evaluate multiple conditions and execute statements when the corresponding condition is `true`.
- <!-- /wp:list-item -->

<!-- /wp:list -->
