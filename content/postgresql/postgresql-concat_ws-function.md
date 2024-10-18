---
title: 'PostgreSQL CONCAT_WS() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-concat_ws/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CONCAT_WS()` function to concatenate strings into a single string, separated by a specified separator.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL CONCAT_WS() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The PostgreSQL `CONCAT_WS()` function allows you to concatenate multiple strings into a single string separated by a specified separator.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `CONCAT_WS` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CONCAT_WS(separator, string1, string2, string3, ...)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `separator`: Specify the separator that you want to separate the strings. The `separator` should not be `NULL`.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `string1`, `string2`, `string3`, ..: These are strings that you want to concatenate. If any string is NULL, it is ignored by the function.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `CONCAT_WS` returns a single string that combines the `string1`, `string2`, `string3`... separated by the separator.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the separator is `NULL`, the `CONCAT_WS` will return `NULL`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In practice, you typically use the `CONCAT_WS` function to combine values from different columns with a custom separator.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL CONCAT_WS() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `CONCAT_WS()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL CONCAT_WS() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `CONCAT_WS()` function to concatenate two strings with a space:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT CONCAT_WS(' ', 'PostgreSQL', 'Tutorial') title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
        title
---------------------
 PostgreSQL Tutorial
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we use the `CONCAT_WS()` function to concatenate the strings `'PostgreSQL'` and `'Tutorial'` with a space separator. The result string is `'PostgreSQL Tutorial'`.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using the CONCAT_WS() function with the table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `customer` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:image {"id":4011,"sizeSlug":"full","linkDestination":"none"} -->

![customer table](https://www.postgresqltutorial.com/wp-content/uploads/2019/05/customer.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following example uses the `CONCAT_WS()` to concatenate values from the `first_name` and `last_name` columns of the `customer` table using a space as a separator:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  CONCAT_WS(' ', first_name, last_name) full_name
FROM
  customer
ORDER BY
  first_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
       full_name
-----------------------
 Aaron Selby
 Adam Gooch
 Adrian Clary
 Agnes Bishop
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The query returns a result set with a single column `full_name` containing the full names of all customers.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `CONCAT_WS` function to concatenate multiple strings into a single string separated by a specified separator.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `CONCAT_WS` function skips `NULL` values.
- <!-- /wp:list-item -->

<!-- /wp:list -->
