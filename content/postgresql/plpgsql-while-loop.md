---
title: 'PL/pgSQL While Loop'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-plpgsql/pl-pgsql-while-loop/
ogImage: ./img/wp-content-uploads-2015-09-plpgsql-WHILE-loop.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use PL/pgSQL `while` loop statement to execute statements as long as a condition is true.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PL/pgSQL while loop statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `while` loop statement executes one or more statements as long as a specified condition is true.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of a `while` loop statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
[ <<label>> ]
while condition loop
   statements;
end loop;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, PostgreSQL evaluates the `condition` before executing the `statements`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the condition is true, it executes the `statements`. After each iteration, the `while` loop evaluates the `codition` again.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Inside the body of the `while` loop, you need to change the some [variables](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-variables/) to make the `condition` `false` or `null` at some points. Otherwise, you will have an indefinite loop.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Because the `while` loop tests the `condition` before executing the `statements`, it is often referred to as a **pretest loop**.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following flowchart illustrates the `while` loop statement:

<!-- /wp:paragraph -->

<!-- wp:image {"align":"center","id":1392} -->

![PL/pgSQL WHILE loop](./img/wp-content-uploads-2015-09-plpgsql-WHILE-loop.png)

<!-- /wp:image -->

<!-- wp:heading -->

## PL/pgSQL while loop example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `while` loop statement to display the value of a `counter`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
do $$

declare
	counter integer := 0;
begin
	while counter < 5 loop
		raise notice 'Counter %', counter;
		counter := counter + 1;
	end loop;
end;

$$;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
NOTICE:  Counter 0
NOTICE:  Counter 1
NOTICE:  Counter 2
NOTICE:  Counter 3
NOTICE:  Counter 4
```

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, declare the `counter` variable and initialize its value to 0.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, use the `while` loop statement to show the current value of the `counter` as long as it is less than 5. In each iteration, increase the value of `counter` by one. After 5 iterations, the `counter` is 5 therefore the `while` loop is terminated.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PL/pgSQL `while` loop statement to execute one or more statements as long as long as a specified condition is true.
- <!-- /wp:list-item -->

<!-- /wp:list -->
