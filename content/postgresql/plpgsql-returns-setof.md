---
title: 'PL/pgSQL Returns SetOf'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-returns-setof/
ogImage: ./img/wp-content-uploads-2018-03-film_table.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the `returns setof` option to define a function that returns one or more rows.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Defining a function with returns setof option

<!-- /wp:heading -->

<!-- wp:paragraph -->

[PostgreSQL functions](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/) allow you to encapsulate reusable logic within the database. To return one or more rows from a function, you can use the `returns setof` option.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `returns setof`option allows you to return one or more rows with a predefined structure from a function.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax for creating a function that returns a set of rows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
create or replace function function_name(parameters)
returns setof row_structure
as
$$
   -- logic
   -- ...
   -- return one or more rows
   return query select_query;
$$ language plpgsql;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the function name after the `create or replace function` keywords.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, use the `returns setof` with a predefined row structure. The row structure can be a composite type defined in the database.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Third, return rows inside the function body using the `return query` statement followed by a select statement.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## Calling the function

<!-- /wp:heading -->

<!-- wp:paragraph -->

To call a function with the `returns setof`, you use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT function_name(argument);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It'll return a single column containing an array of all columns of the returned rows.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To retrieve data from a specific column of the return rows, you specify the dot (.) and column name after the function call:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT (function_name(argument)).column_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you want to retrieve data from all columns of the returned rows, you can use the `.*` like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT (function_name(argument)).*;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Alternatively, you can call the function using the `SELECT...FROM` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM function_name(argument);
```

<!-- /wp:code -->

<!-- wp:heading -->

## PL/pgSQL Returns SetOf example

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) for the demonstration.

<!-- /wp:paragraph -->

<!-- wp:image {"id":3449,"sizeSlug":"full","linkDestination":"none"} -->

![Film table](./img/wp-content-uploads-2018-03-film_table.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

First, define a function that retrieves a film by its id from the `film` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
create or replace function find_film_by_id(
	p_id int
)
returns setof film
as
$$
begin
   return query select * from film
   where film_id = p_id;
end;
$$
language plpgsql;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, call the `find_film_by_id()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT find_film_by_id(100);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```

                                   find_film_by_id

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 (100,"Brooklyn Desert","A Beautiful Drama of a Dentist And a Composer who must Battle a Sumo Wrestler in The First Manned Space Station",2006,1,7,4.99,161,21.99,R,"2013-05-26 14:50:58.951",{Commentaries},"'battl':14 'beauti':4 'brooklyn':1 'compos':11 'dentist':8 'desert':2 'drama':5 'first':20 'man':21 'must':13 'space':22 'station':23 'sumo':16 'wrestler':17")
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output is an array that contains column data.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, retrieve the title of the film with id 100:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
select (find_film_by_id(100)).title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
      title
-----------------
 Brooklyn Desert
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, retrieve the data from all columns of the returned row:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM find_film_by_id(100);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
-[ RECORD 1 ]----+--------------------------------------------------------------------------------------------------------------------------------------------------------------
film_id          | 100
title            | Brooklyn Desert
description      | A Beautiful Drama of a Dentist And a Composer who must Battle a Sumo Wrestler in The First Manned Space Station
release_year     | 2006
language_id      | 1
rental_duration  | 7
rental_rate      | 4.99
length           | 161
replacement_cost | 21.99
rating           | R
last_update      | 2013-05-26 14:50:58.951
special_features | {Commentaries}
fulltext         | 'battl':14 'beauti':4 'brooklyn':1 'compos':11 'dentist':8 'desert':2 'drama':5 'first':20 'man':21 'must':13 'space':22 'station':23 'sumo':16 'wrestler':17
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that we use `\x` command in psql to display the result set vertically.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `returns setof` to return one or more rows from a function.
- <!-- /wp:list-item -->

<!-- /wp:list -->
