---
title: 'PostgreSQL jsonb_object() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_object/
ogImage: ./img/wp-content-uploads-2019-05-film.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_object()` function to create a JSON object from a text array.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL jsonb_object() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `jsonb_object()` function allows you to build a JSON object from a [text](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-char-varchar-text/) [array](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-array/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `jsonb_object()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
jsonb_object(text[]) → jsonb
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, `text[]` array can be:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- A one-dimensional array that contains an even number of elements. The elements are the alternating key/value pairs.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- A two-dimensional array. Each inner array has exactly two elements representing the key/value pair.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `jsonb_object()` function returns a JSON object constructed from the text array with the type of JSONB.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `jsonb_object()` function has another syntax that takes keys and values pairwise from separate text arrays:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
jsonb_object ( keys text[], values text[] ) → jsonb
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, the keys and values arrays in this syntax have the same number of elements. The `keys` array contains the keys of the JSON object whereas the `values` array contains the corresponding values of the `keys`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL jsonb_object() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `jsonb_object()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL jsonb_object function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `jsonb_object()` function to create a JSON object from a text array:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  jsonb_object('{"name","John", "age", 22}');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
         jsonb_object
-------------------------------
 {"age": "22", "name": "John"}
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Alternatively, you can use a two-dimensional arrays to create the JSON object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  jsonb_object(
    '{{"name","age"},{"John", 22}}'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
         jsonb_object
-------------------------------
 {"John": "22", "name": "age"}
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Additionally, you can use two arrays including `keys` and `values` to create the JSON object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  jsonb_object(
    '{"name","age"}', '{"John", 22}'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
         jsonb_object
-------------------------------
 {"age": "22", "name": "John"}
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the jsonb_object() function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/).

<!-- /wp:paragraph -->

<!-- wp:image {"id":4017,"sizeSlug":"full","linkDestination":"none"} -->

![](./img/wp-content-uploads-2019-05-film.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following example uses the `jsonb_object` function to create an object from the `title` and `release_year` from the `film` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  jsonb_object(
    array[title], array[release_year]::text[]
  )
FROM
  film
ORDER BY
  title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
         jsonb_object
------------------------------
 {"Academy Dinosaur": "2006"}
 {"Ace Goldfinger": "2006"}
 {"Adaptation Holes": "2006"}
 {"Affair Prejudice": "2006"}
 {"African Egg": "2006"}
...
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `jsonb_object()` function to create a JSON object from a text array.
- <!-- /wp:list-item -->

<!-- /wp:list -->
