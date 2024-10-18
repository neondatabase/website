---
title: 'PL/pgSQL Loop Statements'
redirectFrom: 
            - /docs/postgresql/postgresql-plpgsql/plpgsql-loop-statements/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about the PL/pgSQL loop statement that executes a block of code repeatedly.





## Introduction to PL/pgSQL Loop statement





The `loop` defines an unconditional loop that executes a block of code repeatedly until terminated by an `exit` or `return` statement.





The following illustrates the syntax of the `loop` statement:





```
<<label>>
loop
   statements;
end loop;
```





Typically, you use an `if` statement to terminate the loop based on a condition like this:





```
<<label>>
loop
   statements;
   if condition then
      exit;
   end if;
end loop;
```





The `exit` statement terminates the loop immediately.





It's possible to place a loop statement inside another loop statement. When a `loop` statement is placed inside another `loop` statement, it is called a nested loop:





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





When you have nested loops, it's necessary to use loop labels. The loop labels allow you to specify the loop in the `exit` and `continue` statements, indicating which loop these statements refer to.





## PL/pgSQL loop statement examples





Let's explore some examples of using the loop statement.





### 1) Basic PL/pgSQL loop example





The following example uses a `loop` statement to display five numbers from 1 to five:





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





Output:





```
NOTICE:  1
NOTICE:  2
NOTICE:  3
NOTICE:  4
NOTICE:  5
```





How it works.





First, declare a variable `counter` and initialize its value to zero:





```
counter int := 0;
```





Second, increase the value of the `counter` variable by one in each iteration of the loop:





```
counter = counter + 1;
```





Third, display the current value of the `counter`:





```
raise notice '%', counter;
```





Finally, terminate the loop if the current value of the `counter` variable is 5:





```
if counter = 5 then
   exit;
end if;
```





Since the initial value of the `counter` is zero, the loop executes five times before it is terminated.





In practice, you can combine the `if` and `exit` statements into a single statement like this:





```
exit when counter = 5;
```





For example:





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





Note that you will learn more about the [exit statement](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-exit/) in the upcoming tutorial.





### 2) Using a loop with a label





The following example illustrates how to use a loop label:





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





Output:





```
NOTICE:  1
NOTICE:  2
NOTICE:  3
NOTICE:  4
NOTICE:  5
```





How it works.





In this example, we place a loop label `my_loop` inside `<<>>` before the `LOOP` keyword.





Inside the loop's body, we reference the loop label (`my_loop`) in the `exit` statement to explicitly instruct PostgreSQL to terminate the loop specified by the loop label: `my_loop`.





It'll be more practical to use a loop label when you have a nested loop.





### 3) Nested loop example





The following example illustrates how to use a nested loop with labels:





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





Output:





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





How it works.





First, declare two variables `row_var` and `col_var`, and initialize their values to zero:





```
row_var int := 0;
col_var int := 0;
```





Second, use the `outer_loop` as the label for the outer loop. In the outer loop, increase the value of the `row_var` by one, execute the nested loop, and reset the `col_var` in each iteration.





If the `row_var` is 3, exit the outer loop by referencing the `outer_loop` label in the `exit` statement.





Third, use the `inner_loop` as the label for the inner loop. In the inner loop, increase the value of `col_var` by one, display the current values of `row_var` and `col_var` variables, and terminate the inner loop when the value of `col_var` is 3.





## Summary





- 
- Use the PL/pgSQL `LOOP` statement to create unconditional loops.
- 
-
- 
- The loop can be nested.
- 
-
- 
- Use the `exit` statement to terminate a loop prematurely.
- 


