---
title: 'PostgreSQL row_to_json() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-row_to_json/
ogImage: ./img/wp-content-uploads-2019-05-film.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `row_to_json()` function to convert an SQL composite value to a JSON object.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL row_to_json() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `row_to_json()` function allows you to convert an SQL composite value into a JSON object.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `row_to_json()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
row_to_json ( record [, boolean ] ) → json
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `record` is an SQL composite value that you want to convert into a JSON object.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `boolean` if true, the function will add a line feed between top-level elements.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `row_to_json()` function will return a JSON object.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL row_to_json() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `row_to_json()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic row_to_json() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `row_to_json()` function to convert a row into a JSON object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT row_to_json(row('John',20));
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
      row_to_json
-----------------------
 {"f1":"John","f2":20}
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we use the `row()` function to create a composite value made up of multiple columns.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `row_to_json()` function returns an object whose keys are automatically generated f1 and f2 with the values from the composite values.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using the row_to_json() function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:image {"id":4017,"sizeSlug":"full","linkDestination":"none"} -->

![](./img/wp-content-uploads-2019-05-film.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following example uses the `row_to_json()` function to convert the `title` and `length` of each film in the `film` table into a JSON object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  row_to_json(t) film
FROM
  (
    SELECT
      title,
      length
    FROM
      film
    ORDER BY
      title
  ) t;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
                         film
------------------------------------------------------
 {"title":"Academy Dinosaur","length":86}
 {"title":"Ace Goldfinger","length":48}
 {"title":"Adaptation Holes","length":50}
 {"title":"Affair Prejudice","length":117}
 {"title":"African Egg","length":130}
 {"title":"Agent Truman","length":169}
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

How it works.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- The subquery retrieves the `title` and `length` from the `film` table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The outer query uses the `row_to_json()` to convert each row returned by the subquery into a JSON object.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Note that you can use a [common table expression](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-cte/) (`CTE`) instead of a subquery to achieve the same result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
WITH film_cte AS (
  SELECT
    title,
    length
  FROM
    film
  ORDER BY
    title
)
SELECT
  row_to_json(film_cte)
FROM
  film_cte;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `row_to_json()` function to convert an SQL composite value to a JSON object.
- <!-- /wp:list-item -->

<!-- /wp:list -->
