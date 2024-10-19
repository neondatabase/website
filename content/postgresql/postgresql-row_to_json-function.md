---
createdAt: 2024-02-25T14:19:43.000Z
title: 'PostgreSQL row_to_json() Function'
redirectFrom:
            - /postgresql/postgresql-row_to_json 
            - /postgresql/postgresql-json-functions/postgresql-row_to_json
ogImage: /postgresqltutorial_data/wp-content-uploads-2019-05-film.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `row_to_json()` function to convert an SQL composite value to a JSON object.

## Introduction to the PostgreSQL row_to_json() function

The `row_to_json()` function allows you to convert an SQL composite value into a JSON object.

Here's the syntax of the `row_to_json()` function:

```
row_to_json ( record [, boolean ] ) → json
```

In this syntax:

- `record` is an SQL composite value that you want to convert into a JSON object.
-
- `boolean` if true, the function will add a line feed between top-level elements.

The `row_to_json()` function will return a JSON object.

## PostgreSQL row_to_json() function examples

Let's take some examples of using the `row_to_json()` function.

### 1) Basic row_to_json() function example

The following example uses the `row_to_json()` function to convert a row into a JSON object:

```sql
SELECT row_to_json(row('John',20));
```

Output:

```
      row_to_json
-----------------------
 {"f1":"John","f2":20}
(1 row)
```

In this example, we use the `row()` function to create a composite value made up of multiple columns.

The `row_to_json()` function returns an object whose keys are automatically generated f1 and f2 with the values from the composite values.

### 2) Using the row_to_json() function with table data

We'll use the `film` table from the [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database):

![](/postgresqltutorial_data/wp-content-uploads-2019-05-film.png)

The following example uses the `row_to_json()` function to convert the `title` and `length` of each film in the `film` table into a JSON object:

```sql
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

Output:

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

How it works.

- The subquery retrieves the `title` and `length` from the `film` table.
-
- The outer query uses the `row_to_json()` to convert each row returned by the subquery into a JSON object.

Note that you can use a [common table expression](/postgresql/postgresql-cte) (`CTE`) instead of a subquery to achieve the same result:

```sql
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

## Summary

- Use the `row_to_json()` function to convert an SQL composite value to a JSON object.
