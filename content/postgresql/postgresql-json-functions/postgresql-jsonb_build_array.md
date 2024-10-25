---
title: 'PostgreSQL jsonb_build_array() Function'
page_title: 'PostgreSQL jsonb_build_array() Function'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL jsonb_build_array() function to create a JSON array.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_build_array/'
ogImage: '/postgresqltutorial/film.png'
updatedOn: '2024-02-23T07:45:10+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL to_jsonb() Function'
  slug: 'postgresql-json-functions/postgresql-to_jsonb'
nextLink:
  title: 'PostgreSQL jsonb_build_object() Function'
  slug: 'postgresql-json-functions/postgresql-jsonb_build_object'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_build_array()` function to create a JSON array.

## Introduction to the PostgreSQL jsonb_build_array() function

The `jsonb_build_array()` function allows you to construct a JSONB array from a variadic list of arguments.

Here’s the basic syntax of the `jsonb_build_array()` function:

```sql
jsonb_build_array ( VARIADIC "any" ) → jsonb
```

In this syntax, you provide a list of arguments that you want to convert to elements of a JSON array.

The `jsonb_build_array()` will convert each argument using the [`to_jsonb()`](postgresql-to_jsonb) function.

## PostgreSQL jsonb_build_array() function examples

Let’s take some examples of using the `jsonb_build_array()` function.

### 1\) Basic PostgreSQL jsonb_build_array() function example

The following example uses the `jsonb_build_array()` function to create a JSON array from a list of values:

```sql
SELECT jsonb_build_array(10, null, 'Hi', true) result;
```

Output:

```sql
         result
------------------------
 [10, null, "Hi", true]
(1 row)
```

### 2\) Using PostgreSQL jsonb_build_array() function with table data

We’ll use the `film` table from the [sample database](../postgresql-getting-started/postgresql-sample-database):

![](/postgresqltutorial/film.png)The following example uses the `jsonb_build_array()` function to convert the title and length of each film into elements of a JSON array:

```sql
SELECT
  jsonb_build_array(title, length)
FROM
  film
ORDER BY
  title;
```

Output:

```sql
          jsonb_build_array
--------------------------------------
 ["Academy Dinosaur", 86]
 ["Ace Goldfinger", 48]
 ["Adaptation Holes", 50]
 ["Affair Prejudice", 117]
...
```

## Summary

- Use the PostgreSQL `jsonb_build_array()` function to create a `JSONB` array from a variadic list of arguments.
