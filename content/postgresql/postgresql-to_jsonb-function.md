---
title: 'PostgreSQL to_jsonb() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-to_jsonb/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `to_jsonb()` function to convert an SQL value to a value of `JSONB` type.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL to_jsonb() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `to_jsonb()` function allows you to convert an SQL value to a `JSONB` value.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `to_jsonb()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
to_jsonb ( value ) → jsonb
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, you specify an SQL value that you want to convert to a `JSONB` value.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `to_jsonb()` function returns a value converted to a `JSONB` value. If the value is an array or a composite value, the function will convert to arrays or objects in JSON.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL to_jsonb() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `to_jsonb()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Converting a text string to a JSONB value

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `to_jsonb()` function to convert a text string into a `JSONB` value:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT to_jsonb('Hello'::text);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 to_jsonb
----------
 "Hello"
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The "Hello" is a `JSONB` value.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To verify it, you can pass the result of the `to_jsonb()` function to the `jsonb_typeof()` function.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `jsonb_typeof()` function returns the type of a top-level JSON value as a text string.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  JSONB_TYPEOF(
    to_jsonb('Hello' :: text)
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 jsonb_typeof
--------------
 string
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Converting numbers to a JSONB values

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `to_jsonb()` function to convert numbers to `JSONB` values:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  to_jsonb(10 :: int),
  to_jsonb(9.99 :: numeric);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 to_jsonb | to_jsonb
----------+----------
 10       | 9.99
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Converting bool values to a JSONB values

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `to_jsonb()` function to convert boolean values to `JSONB` values:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  to_jsonb(true :: bool),
  to_jsonb(false :: bool);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 to_jsonb | to_jsonb
----------+----------
 true     | false
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 4) Converting NULL to a JSONB value

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `to_jsonb()` function to convert `NULL` to a `JSONB` value:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  to_jsonb(NULL::text);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 to_jsonb
----------
 null
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 5) Converting a PostgreSQL array into a JSON array

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `to_jsonb()` function to convert an array in PostgreSQL to a JSON array with the `JSONB` type:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  to_jsonb(
    ARRAY[ 'red', 'green', 'blue' ]
  ) AS jsonb_array;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
       jsonb_array
--------------------------
 ["red", "green", "blue"]
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 6) Using the to_jsonb() function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `to_jsonb()` function to convert data in the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) to `JSONB` values:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
  to_jsonb(title),
  to_jsonb(length)
FROM
  film
ORDER BY
  title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
           to_jsonb            | to_jsonb
-------------------------------+----------
 "Academy Dinosaur"            | 86
 "Ace Goldfinger"              | 48
 "Adaptation Holes"            | 50
...
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `to_jsonb()` function to convert an SQL value to a `JSONB` value.
- <!-- /wp:list-item -->

<!-- /wp:list -->
