---
title: 'PL/pgSQL Row Types'
redirectFrom: 
            - /docs/postgresql/postgresql-plpgsql/pl-pgsql-row-types/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PL/pgSQL row types to declare row variables that hold a complete row of a result set.





## Introduction to PL/pgSQL row types





Row variables or row-type variables are variables of composite types that can store the entire rows of a result set.





These row variables can hold the entire row returned by the `select into` or `for` statement.





Here's the syntax for [declaring a row variable](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-variables/):





```
row_variable table_name%ROWTYPE;
row_variable view_name%ROWTYPE;
```





In this syntax:





- First, specify the variable name.
-
- Second, provide the name of a table or view followed by `%` and `ROWTYPE`.





To access the individual field of a row variable, you use the dot notation (`.`) as follows:





```
row_variable.field_name
```





## PL/pgSQL row-type variable example





We'll use the `actor` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) to show how row types work:





![](https://www.postgresqltutorial.com/wp-content/uploads/2019/05/actor.png)





The following example retrieve the row with id 1 from the actor table and assign it to a row variable:





```
do
$$
declare
   selected_actor actor%rowtype;
begin
   -- select actor with id 10
   select *
   from actor
   into selected_actor
   where actor_id = 10;

   -- show the number of actor
   raise notice 'The actor name is % %',
      selected_actor.first_name,
      selected_actor.last_name;
end;
$$;
```





How it works.





- First, declare a row variable called `selected_actor` with the same type as the row in the `actor` table.
-
- Second, assign the row whose value in the `actor_id` column is 10 to the `selected_actor` variable using the `select into` statement.
-
- Third, show the first and last names of the selected actor using the `raise notice` statement.





## Summary





- Use row type variables (`%ROWTYPE`) to hold a row of a result set returned by the `select into` statement.


