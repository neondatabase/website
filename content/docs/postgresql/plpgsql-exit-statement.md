---
title: 'PL/pgSQL Exit Statement'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-exit/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PL/pgSQL `exit` statement and how to use it to terminate a loop or exit a block.



## Introduction to the PL/pgSQL exit statement



The `exit` statement allows you to prematurely terminate a loop including an unconditional [loop](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-loop-statements/), a [while loop](https://www.postgresqltutorial.com/plpgsql-while-loop/), and a [for loop](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-for-loop/).



The following shows the syntax of the `exit` statement:



```
exit [label] [when boolean_expression]
```



In this syntax:



- - The `label` is the loop label of the current loop where the `exit` is in or the loop label of the outer loop. Depending on the label, the `exit` statement will terminate the corresponding loop. If you don't use the label, the `exit` statement will terminate the enclosing loop.
- -
- - Use the `when boolean_expression` clause to specify a condition that terminates a loop. The `exit` statement will terminate the loop if the `boolean_expression` evaluates to `true`.
- 


The following statements are equivalent:



```
exit when counter > 10;
```



```
if counter > 10 then
   exit;
end if;
```



The `exit when` is cleaner and shorter.



Besides terminating a loop, you can use the `exit` statement to exit a block specified by the `begin...end` keywords.



In this case, the control is passed to the statement after the `end` keyword of the current block:



```
<<block_label>>
BEGIN
    -- some code
    EXIT [block_label] [WHEN condition];
    -- some more code
END block_label;
```



## PL/pgSQL Exit statement examples



Let's take some examples of using the PL/pgSQL `exit` statement.



### 1) Using PL/pgSQL Exit statement to terminate an unconditional loop



The following example illustrates how to use the `exit` statement in unconditional loops:



```
do
$$
declare
   i int = 0;
   j int = 0;
begin
  <<outer_loop>>
  loop
     i = i + 1;
     exit when i > 3;
	 -- inner loop
	 j = 0;
     <<inner_loop>>
     loop
		j = j + 1;
		exit when j > 3;
		raise notice '(i,j): (%,%)', i, j;
	 end loop inner_loop;
  end loop outer_loop;
end;
$$
```



Output:



```
NOTICE:  (i,j): (1,1)
NOTICE:  (i,j): (1,2)
NOTICE:  (i,j): (1,3)
NOTICE:  (i,j): (2,1)
NOTICE:  (i,j): (2,2)
NOTICE:  (i,j): (2,3)
NOTICE:  (i,j): (3,1)
NOTICE:  (i,j): (3,2)
NOTICE:  (i,j): (3,3)
```



How it works.



This example contains two loops: outer and inner loops.



Since both `exit` statements don't use any loop labels, they will terminate the current loop.



The first `exit` statement terminates the outer loop when `i` is greater than `3`. That's why you see the value of `i` in the output is `1`, `2`, and `3`.



The second `exit` statement terminates the inner loop when `j` is greater than `3`. It is the reason you see that `j` is `1`, `2`, and `3` for each iteration of the outer loop.



The following example places the label of the outer loop in the second `exit` statement:



```
do
$$
declare
   i int = 0;
   j int = 0;
begin
  <<outer_loop>>
  loop
     i = i + 1;
     exit when i > 3;
	 -- inner loop
	 j = 0;
     <<inner_loop>>
     loop
		j = j + 1;
		exit outer_loop when j > 3;
		raise notice '(i,j): (%,%)', i, j;
	 end loop inner_loop;
  end loop outer_loop;
end;
$$
```



Output:



```
NOTICE:  (i,j): (1,1)
NOTICE:  (i,j): (1,2)
NOTICE:  (i,j): (1,3)
```



In this example, the second `exit` statement terminates the outer loop when `j` is greater than 3.



### 2) Using the PL/pgSQL Exit statement to exit a block



The following example illustrates how to use the `exit` statement to terminate a block:



```
do
$$
begin

  <<simple_block>>
   begin
  	 exit simple_block;
         -- for demo purposes
	 raise notice '%', 'unreachable!';
   end;
   raise notice '%', 'End of block';
end;
$$
```



Output



```
NOTICE:  End of block
```



In this example, the exit statement terminates the `simple_block` immediately:



```
exit simple_block;
```



This statement will never be reached:



```
raise notice '%', 'unreachable!';
```



## Summary



- - Use the `exit` statement to terminate a loop including an unconditional `loop`, `while`, and `for` loop.
- -
- - Use the `exit` statement to exit a block.
- 
