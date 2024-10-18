---
title: 'PL/pgSQL Select Into'
redirectFrom: 
            - /docs/postgresql/postgresql-plpgsql/pl-pgsql-select-into/
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PL/pgSQL `select into` statement to select data from the database and assign it to a variable.



## Introduction to PL/pgSQL Select Into statement



The `select into` statement allows you to [select data from the database ](/docs/postgresql/postgresql-select/)and assign it to a [variable](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-variables).



Here's the basic syntax of the `select into` statement:



```
select column1, column2, ...
into variable1, variable2, ...
from table_expression;
```



In this syntax,



- First, specify one or more columns from which you want to retrieve data in the `select` clause.
- -
- Second, place one or more variables after the `into` keyword.
- -
- Third, provide the name of the table in the `from` clause.
- 


The `select` `into` statement will assign the data returned by the `select` clause to the corresponding variables.



Besides selecting data from a table, you can use other clauses of the `select` statement such as `join`, `group by,` and `having`.



## PL/pgSQL Select Into statement examples



Let's take some examples of using the `select into` statement.



### 1) Basic select into statement example



The following example uses the `select into` statement to retrieve the number of actors from the `actor` table and assign it to the `actor_count` variable:



```
do
$$
declare
   actor_count integer;
begin
   -- select the number of actors from the actor table
   select count(*)
   into actor_count
   from actor;

   -- show the number of actors
   raise notice 'The number of actors: %', actor_count;
end;
$$;
```



Output:



```
NOTICE:  The number of actors: 200
```



In this example:



- First, declare a variable called `actor_count` that stores the number of actors from the `actor` table.
- -
- Second, assign the number of actors to the `actor_count` using the `select into` statement.
- -
- Third, display a message that shows the value of the `actor_count` variable using the `raise notice` statement.
- 


### 2) Using the select into with multiple variables



The following example uses the `select into` statement to assign the first and last names of the actor id 1 to two variables:



```
do
$$
declare
   v_first_name varchar;
   v_last_name varchar;
begin
   -- select the first_name and last_name of the actor id 1
   select first_name, last_name
   into v_first_name, v_last_name
   from actor
   where actor_id = 1;

   -- show the full name
   raise notice '% %', v_first_name, v_last_name;
end;
$$;
```



Output:



```
NOTICE:  Penelope Guiness
```



How it works.



First, declare two variables `v_first_name` and `v_last_name` with the types `varchar`:



```
v_first_name varchar;
v_last_name varchar;
```



Second, retrieve the `first_name` and `last_name` of the actor id 1 from the `actor` table and assign them to the `v_first_name` and `v_last_name` variables:



```
select first_name, last_name
into v_first_name, v_last_name
from actor
where actor_id = 1;
```



Third, show the values of `v_first_name` and `v_last_name` variables:



```
raise notice '% %', v_first_name, v_last_name;
```



Because we assign data retrieved from the `first_name` and `last_name` columns of the `actor` table, we can use the type-copying technique to declare the `v_first_name` and `v_last_name` variables:



```
do
$$
declare
   v_first_name actor.first_name%type;
   v_last_name actor.last_name%type;
begin
   -- select the first_name and last_name of the actor id 1
   select first_name, last_name
   into v_first_name, v_last_name
   from actor
   where actor_id = 1;

   -- show the full name
   raise notice '% %', v_first_name, v_last_name;
end;
$$;
```



## Summary



- Use the `select into` statement to select data from the database and assign it to a variable.
- 
