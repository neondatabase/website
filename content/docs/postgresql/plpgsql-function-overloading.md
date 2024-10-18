---
title: 'PL/pgSQL Function Overloading'
redirectFrom: 
            - /docs/postgresql/postgresql-plpgsql/plpgsql-function-overloading/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about function overloading in PostgreSQL.



## Introduction to PL/pgSQL Function Overloading



PostgreSQL allows multiple [functions](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/) to share the same name as long as they have different arguments.



If two or more functions share the same name, they are considered overloaded.



When you call an overloaded function, PostgreSQL selects the best candidate function to execute based on the function argument list.



The following `get_rental_duration()` function returns the total rental days of a specified customer:



```
create or replace function get_rental_duration(
	p_customer_id integer
)
returns integer
language plpgsql
as $$
declare
	rental_duration integer;
begin
	select
		sum( extract(day from return_date - rental_date))
	into rental_duration
    from rental
	where customer_id = p_customer_id;

	return rental_duration;
end; $$
```



The `get_rental_function` function has the `p_customer_id` as an `in` parameter.



The following returns the number of rental days of customer id 232:



```
SELECT get_rental_duration(232);
```



Output:



```
 get_rental_duration
---------------------
                  90
(1 row)
```



Suppose that you want to know the rental duration of a customer from a specific date up to now.



To do that, you can add one more parameter `p_from_date` to the `get_retal_duration()` function. Alternatively, you can develop a new function with the same name but have two parameters like this:



```
create or replace function get_rental_duration(
	p_customer_id integer,
	p_from_date date
)
returns integer
language plpgsql
as $$
declare
	rental_duration integer;
begin
	-- get the rental duration based on customer_id
	-- and rental date
	select sum( extract( day from return_date + '12:00:00' - rental_date))
	into rental_duration
	from rental
	where customer_id = p_customer_id and
		  rental_date >= p_from_date;

	-- return the rental duration in days
	return rental_duration;
end; $$
```



This function shares the same name as the first one, except it has two parameters.



In other words, the `get_rental_duration(integer)` function is overloaded by the `get_rental_duration(integer,date)` function.



The following statement returns the rental duration of the customer id `232` since `July 1st 2005`:



```
SELECT get_rental_duration(232,'2005-07-01');
```



```
 get_rental_duration
---------------------
                  85
(1 row)
```



Note that if you omit the second argument, PostgreSQL will call the `get_rental_duration(integer)` function that has one parameter.



## PL/pgSQL function overloading and default values



In the `get_rental_duration(integer,date)` function, if you want to set a default value to the second argument like this:



```
create or replace function get_rental_duration(
	p_customer_id integer,
	p_from_date date default '2005-01-01'
)
returns integer
language plpgsql
as $$
declare
	rental_duration integer;
begin
	select sum(
		extract( day from return_date + '12:00:00' - rental_date)
	)
	into rental_duration
	from rental
	where customer_id= p_customer_id and
		  rental_date >= p_from_date;

	return rental_duration;

end; $$
```



The following calls the `get_rental_duration()` function and passes the customer id 232:



```
SELECT get_rental_duration(232);
```



Error:



```
ERROR:  function get_rental_duration(integer) is not unique
LINE 1: SELECT get_rental_duration(232);
               ^
HINT:  Could not choose the best candidate function. You might need to add explicit type casts.
SQL state: 42725
Character: 8
```



In this case, PostgreSQL could not choose the best candidate function to execute.



In this scenario, you have three functions:



```
get_rental_duration(p_customer_id integer);
get_rental_duration(p_customer_id integer, p_from_date date)
get_rental_duration(p_customer_id integer, p_from_date date default '2005-01-01'
)
```



PostgreSQL did not know whether it should execute the first or the third ones.



As a rule of thumb, when overloading functions, you should always ensure their parameter lists are unique.



## Summary



- Multiple functions can share the same names as long as they have different arguments. These function names are overloaded.
- -
- Use a unique function argument list to define overloaded functions.
- 
