---
title: 'PL/pgSQL Row Types'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-plpgsql/pl-pgsql-row-types/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PL/pgSQL row types to declare row variables that hold a complete row of a result set.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PL/pgSQL row types

<!-- /wp:heading -->

<!-- wp:paragraph -->

Row variables or row-type variables are variables of composite types that can store the entire rows of a result set.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

These row variables can hold the entire row returned by the `select into` or `for` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax for [declaring a row variable](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-variables/):

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
row_variable table_name%ROWTYPE;
row_variable view_name%ROWTYPE;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the variable name.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, provide the name of a table or view followed by `%` and `ROWTYPE`.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

To access the individual field of a row variable, you use the dot notation (`.`) as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
row_variable.field_name
```

<!-- /wp:code -->

<!-- wp:heading -->

## PL/pgSQL row-type variable example

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `actor` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) to show how row types work:

<!-- /wp:paragraph -->

<!-- wp:image {"id":4026,"sizeSlug":"large"} -->

![](https://www.postgresqltutorial.com/wp-content/uploads/2019/05/actor.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following example retrieve the row with id 1 from the actor table and assign it to a row variable:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, declare a row variable called `selected_actor` with the same type as the row in the `actor` table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, assign the row whose value in the `actor_id` column is 10 to the `selected_actor` variable using the `select into` statement.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Third, show the first and last names of the selected actor using the `raise notice` statement.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use row type variables (`%ROWTYPE`) to hold a row of a result set returned by the `select into` statement.
- <!-- /wp:list-item -->

<!-- /wp:list -->
