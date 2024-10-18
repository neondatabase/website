---
title: 'PL/pgSQL Loop Statements'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-loop-statements/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about the PL/pgSQL loop statement that executes a block of code repeatedly.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PL/pgSQL Loop statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `loop` defines an unconditional loop that executes a block of code repeatedly until terminated by an `exit` or `return` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following illustrates the syntax of the `loop` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
<<label>>
loop
   statements;
end loop;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Typically, you use an `if` statement to terminate the loop based on a condition like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
<<label>>
loop
   statements;
   if condition then
      exit;
   end if;
end loop;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `exit` statement terminates the loop immediately.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

It's possible to place a loop statement inside another loop statement. When a `loop` statement is placed inside another `loop` statement, it is called a nested loop:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
<<outer>>
loop
   statements;
   <<inner>>
   loop
     /* ... */
     exit <<inner>>
   end loop;
end loop;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

When you have nested loops, it's necessary to use loop labels. The loop labels allow you to specify the loop in the `exit` and `continue` statements, indicating which loop these statements refer to.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PL/pgSQL loop statement examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the loop statement.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PL/pgSQL loop example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses a `loop` statement to display five numbers from 1 to five:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
do $$

declare
    counter int := 0;
begin

  loop
  	counter = counter + 1;
	raise notice '%', counter;

	if counter = 5 then
		exit;
	end if;

  end loop;

end;

$$;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
NOTICE:  1
NOTICE:  2
NOTICE:  3
NOTICE:  4
NOTICE:  5
```

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, declare a variable `counter` and initialize its value to zero:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
counter int := 0;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, increase the value of the `counter` variable by one in each iteration of the loop:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
counter = counter + 1;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, display the current value of the `counter`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
raise notice '%', counter;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, terminate the loop if the current value of the `counter` variable is 5:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
if counter = 5 then
   exit;
end if;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Since the initial value of the `counter` is zero, the loop executes five times before it is terminated.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In practice, you can combine the `if` and `exit` statements into a single statement like this:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
exit when counter = 5;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

For example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
do $$

declare
    counter int := 0;
begin

  loop
  	counter = counter + 1;
	raise notice '%', counter;
	exit when counter = 5;
  end loop;

end;

$$;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that you will learn more about the [exit statement](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-exit/) in the upcoming tutorial.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using a loop with a label

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example illustrates how to use a loop label:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
do $$

declare
    counter int := 0;
begin

 <<my_loop>>
  loop
  	counter = counter + 1;
	raise notice '%', counter;
	exit my_loop when counter = 5;
  end loop;

end;

$$;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
NOTICE:  1
NOTICE:  2
NOTICE:  3
NOTICE:  4
NOTICE:  5
```

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In this example, we place a loop label `my_loop` inside `<<>>` before the `LOOP` keyword.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Inside the loop's body, we reference the loop label (`my_loop`) in the `exit` statement to explicitly instruct PostgreSQL to terminate the loop specified by the loop label: `my_loop`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

It'll be more practical to use a loop label when you have a nested loop.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Nested loop example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example illustrates how to use a nested loop with labels:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
do $$

declare
	row_var int := 0;
	col_var int := 0;
begin
	<<outer_loop>>
	loop
		row_var = row_var + 1;
		<<inner_loop>>
		loop
			col_var = col_var + 1;
			raise notice '(%, %)', row_var, col_var;

			-- terminate the inner loop
			exit inner_loop when col_var = 3;
		end loop;
		-- reset the column
		col_var = 0;

		-- terminate the outer loop
		exit outer_loop when row_var = 3;
	end loop;
end;

$$;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
NOTICE:  (1, 1)
NOTICE:  (1, 2)
NOTICE:  (1, 3)
NOTICE:  (2, 1)
NOTICE:  (2, 2)
NOTICE:  (2, 3)
NOTICE:  (3, 1)
NOTICE:  (3, 2)
NOTICE:  (3, 3)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, declare two variables `row_var` and `col_var`, and initialize their values to zero:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
row_var int := 0;
col_var int := 0;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, use the `outer_loop` as the label for the outer loop. In the outer loop, increase the value of the `row_var` by one, execute the nested loop, and reset the `col_var` in each iteration.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `row_var` is 3, exit the outer loop by referencing the `outer_loop` label in the `exit` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, use the `inner_loop` as the label for the inner loop. In the inner loop, increase the value of `col_var` by one, display the current values of `row_var` and `col_var` variables, and terminate the inner loop when the value of `col_var` is 3.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PL/pgSQL `LOOP` statement to create unconditional loops.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The loop can be nested.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `exit` statement to terminate a loop prematurely.
- <!-- /wp:list-item -->

<!-- /wp:list -->
