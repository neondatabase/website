---
title: 'PostgreSQL Drop Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-drop-function/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `drop function` statement to remove a function.



## Introduction to PostgreSQL DROP FUNCTION statement



To remove a user-defined function, you use the `drop function` statement.



Here's the syntax of the `drop function` statement:



```
drop function [if exists] function_name(argument_list)
[cascade | restrict]
```



In this syntax:



- - First, specify the name of the function that you want to remove after the `drop function` keywords.
- -
- - Second, use the `if exists` option if you want to instruct PostgreSQL to issue a notice instead of an error if the function does not exist.
- -
- - Third, specify the argument list of the function. Since [functions can be overloaded,](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-function-overloading/) PostgreSQL needs to know which function you want to remove by checking the argument list. If a function is unique within the schema, you do not need to specify the argument list.
- 


When a function has any dependent objects such as operators or [triggers](https://www.postgresqltutorial.com/postgresql-triggers/), you cannot drop that function.



To drop the function and its dependent objects, you can use the `cascade` option. The `drop function` with the `cascade` option will recursively remove the function, its dependent objects, and the objects that depend on those objects, and so on.



By default, the `drop function` statement uses the `restrict` option that rejects the removal of a function when it has any dependent objects.



To drop multiple functions using a single `drop function` statement, you specify a comma-separated list of function names after the `drop function` keyword like this:



```
drop function [if exists] function1, function2, ...;
```



## PostgreSQL Drop Function examples



The following statement uses the `create function` statement to define a function that returns a set of films including `film_id`, `title`, and `actor`:



```
create or replace function get_film_actors()
	returns setof record
as $$
declare
   rec record;
begin
   for rec in select
			film_id,
			title,
            (first_name || ' ' || last_name)::varchar
		from film
		inner join film_actor using(film_id)
		inner join actor using (actor_id)
		order by title
	loop
        return next rec;
	end loop;

	return;
end;
$$
language plpgsql;
```



The following statement defines a function with the same name `get_film_actors`. However, it accepts a film id as the argument:



```
create or replace function get_film_actors(p_fiml_id int)
	returns setof record
as $$
declare
   rec record;
begin
   for rec in select
			film_id,
			title,
            (first_name || ' ' || last_name)::varchar
		from film
		inner join film_actor using(film_id)
		inner join actor using (actor_id)
		where film_id = p_fiml_id
		order by title
	loop
        return next rec;
	end loop;

	return;
end;
$$
language plpgsql;
```



The following statement attempts to drop the `get_film_actors` function:



```
drop function get_film_actors;
```



PostgreSQL issued an error:



```
ERROR:  function name "get_film_actors" is not unique
HINT:  Specify the argument list to select the function unambiguously.
SQL state: 42725
```



Since the `get_film_actors` stored procedure is not unique, you need to specify which function you want to drop.



The following statement drops the `get_film_actors` function that has zero parameters:



```
drop function get_film_actors();
```



Now, there is only one `get_film_actors` function left. Since it is unique in the database, you can drop it without specifying its argument list like this:



```
drop function get_film_actors;
```



Alternatively, if you want to specify the exact function, you can use the function name with the argument list:



```
drop function get_film_actors(int);
```



## Summary



- - Use the `drop function` statement to delete a function from a database.
- -
- - Specify the argument list in the function if the function is overloaded.
- -
- - Use the `drop function` statement with the `cascade` option to drop a function and its dependent objects and objects that depend on those objects, and so on.
- 
