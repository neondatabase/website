---
title: 'PostgreSQL jsonb_typeof() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-json-functions/postgresql-jsonb_typeof/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `jsonb_typeof()` function to return the type of the top-level JSON value as a text string.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL jsonb_typeof() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `jsonb_typeof()` function allows you to get the type of a top-level JSONB value as a text string.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `jsonb_typeof()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
jsonb_typeof(jsonb_value)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `jsonb_value` is a JSONB value of which you want to get the type as a text string.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `jsonb_typeof()` function returns a text string representing the type of the input JSONB value. The possible return values are object, array, string, number, and null.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL jsonb_typeof() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `jsonb_typeof()` function.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example uses the `jsonb_typeof()` function to return the type of a JSON object:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT jsonb_typeof('{}');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 jsonb_typeof
--------------
 object
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `jsonb_typeof()` function to return the type of a JSON array:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
select jsonb_typeof('[]');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 jsonb_typeof
--------------
 array
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `jsonb_typeof()` function to return the type of a number:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT jsonb_typeof('1'::jsonb);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 jsonb_typeof
--------------
 number
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `jsonb_typeof()` function to return the type of null:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT jsonb_typeof('null'::jsonb);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 jsonb_typeof
--------------
 null
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `jsonb_typeof()` function to return the type of string:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  jsonb_typeof(
    jsonb_path_query('{"name": "Alice"}', '$.name')
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

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `jsonb_typeof()` function to return the type of the top-level JSON value as a text string.
- <!-- /wp:list-item -->

<!-- /wp:list -->
