---
title: "PL/pgSQL Continue Statement"
page_title: "PL/pgSQL Continue Statement By Examples"
page_description: "In this tutorial, you will learn about the PL/pgSQL Continue statement to skip the current loop iteration and continue the next one."
prev_url: "https://www.postgresqltutorial.com/postgresql-plpgsql/pl-pgsql-continue/"
ogImage: ""
updatedOn: "2024-03-19T04:07:31+00:00"
enableTableOfContents: true
previousLink: 
  title: "PL/pgSQL Exit Statement"
  slug: "postgresql-plpgsql/plpgsql-exit"
nextLink: 
  title: "PostgreSQL Exception"
  slug: "postgresql-plpgsql/postgresql-exception"
---




**Summary**: in this tutorial, you will learn how to use the PL/pgSQL `continue` statement to control the loop.


## Introduction to PL/pgSQL continue statement

The `continue` statement prematurely skips the current iteration of the loop and starts the next one.

In practice, you can use the `continue` statement within the loops including [unconditional loops,](plpgsql-loop-statements) [while loops](https://neon.tech/postgresql/plpgsql-while-loop/), and [for loops](plpgsql-for-loop).

Here’s the syntax of the `continue` statement:


```css
continue [loop_label] [when condition]
```
In this syntax, the `loop_label` and `when condition` are optional.

The `loop_label` is the label of the loop that you want to skip the current iteration. If you omit the `loop_label`, the `continue` statement skips the current iteration of the loop. If you specify a loop label, the `continue` statement skips the current iteration of that loop.

The `condition` is a boolean expression that specifies the condition to skip the current iteration of the loop. If the `condition` is `true`, then the `continue` will skip the current loop iteration.


## PL/pgSQL Continue statement example

The following example uses the `continue` statement in an unconditional loop to print out the odd numbers from 1 to 10:


```pgsql
do
$$
declare
   counter int = 0;
begin
  
  loop
     counter = counter + 1;
	 
	 -- exit the loop if counter > 10
	 exit when counter > 10;
	 
	 -- skip the current iteration if counter is an even number
	 continue when mod(counter,2) = 0;
	 
	 -- print out the counter
	 raise notice '%', counter;
  end loop;
end;

$$;
```
Output:


```http
NOTICE:  1
NOTICE:  3
NOTICE:  5
NOTICE:  7
NOTICE:  9
```
How it works.

* First, initialize the `counter` to zero.
* Second, increase the counter by one in each iteration. If the `counter` is greater than 10, then [exit](plpgsql-exit) the loop. If the `counter` is an even number, then skip the current iteration.

The `mod(counter,2)` returns the remainder of the division of the `counter` by two.

If it is zero, then the `counter` is an even number. All the statements between the `continue` statement and `end loop` will be skipped.


## Summary

* Use the `continue` statement to skip the current loop iteration prematurely and start a new one.

