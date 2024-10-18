---
title: 'PL/pgSQL While Loop'
redirectFrom: 
            - /docs/postgresql/postgresql-plpgsql/pl-pgsql-while-loop/
ogImage: /postgresqltutorial_data/wp-content-uploads-2015-09-plpgsql-WHILE-loop.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use PL/pgSQL `while` loop statement to execute statements as long as a condition is true.

## Introduction to PL/pgSQL while loop statement

The `while` loop statement executes one or more statements as long as a specified condition is true.

Here's the basic syntax of a `while` loop statement:

```
[ <<label>> ]
while condition loop
   statements;
end loop;
```

In this syntax, PostgreSQL evaluates the `condition` before executing the `statements`.

If the condition is true, it executes the `statements`. After each iteration, the `while` loop evaluates the `codition` again.

Inside the body of the `while` loop, you need to change the some [variables](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-variables/) to make the `condition` `false` or `null` at some points. Otherwise, you will have an indefinite loop.

Because the `while` loop tests the `condition` before executing the `statements`, it is often referred to as a **pretest loop**.

The following flowchart illustrates the `while` loop statement:

![PL/pgSQL WHILE loop](/postgresqltutorial_data/wp-content-uploads-2015-09-plpgsql-WHILE-loop.png)

## PL/pgSQL while loop example

The following example uses the `while` loop statement to display the value of a `counter`:

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

Output:

```
NOTICE:  Counter 0
NOTICE:  Counter 1
NOTICE:  Counter 2
NOTICE:  Counter 3
NOTICE:  Counter 4
```

How it works.

- First, declare the `counter` variable and initialize its value to 0.
-
- Second, use the `while` loop statement to show the current value of the `counter` as long as it is less than 5. In each iteration, increase the value of `counter` by one. After 5 iterations, the `counter` is 5 therefore the `while` loop is terminated.

## Summary

- Use the PL/pgSQL `while` loop statement to execute one or more statements as long as long as a specified condition is true.
