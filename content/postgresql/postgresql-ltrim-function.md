---
title: 'PostgreSQL LTRIM() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-ltrim/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LTRIM()` function to remove specified characters from the beginning of a string.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL LTRIM() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `LTRIM()` function allows you to remove specified characters from the beginning of a string.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `LTRIM()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
LTRIM(string, character)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `string` is the input string that you want to remove characters.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `character` specifies the characters you want to remove from the beginning of the `string`. The `character` parameter is optional. It defaults to space.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `LTRIM()` function returns the string with all leading characters removed.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To remove both leading and trailing characters from a string, you use the [TRIM()](https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-trim-function/) function.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To remove the trailing characters from a string, you use the [RTRIM()](https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-rtrim/) function.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL LTRIM() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `LTRIM()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL LTRIM() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `LTRIM()` function to remove the `#` from the beginning of the string `#postgres`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LTRIM('#postgres', '#');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
  ltrim
----------
 postgres
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the PostgreSQL LTRIM() function to remove leading spaces

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `LTRIM()` function to remove all the spaces from the string `' PostgreSQL'`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LTRIM('   PostgreSQL');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
   ltrim
------------
 PostgreSQL
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Since the default of the second argument of the `LTRIM()` function is space, we don't need to specify it.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Using the LTRIM() function with table data example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `articles` and [insert some rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into it:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE articles(
   id SERIAL PRIMARY KEY,
   title VARCHAR(255) NOT NULL
);

INSERT INTO articles(title)
VALUES
   ('   Mastering PostgreSQL string functions'),
   (' PostgreSQL LTRIM() function')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id |                  title
----+------------------------------------------
  1 |    Mastering PostgreSQL string functions
  2 |  PostgreSQL LTRIM() function
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [update](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/) the titles by removing the leading spaces using the `LTRIM()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE articles
SET title = LTRIM(title);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE 2
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that two rows were updated.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, verify the updates:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM articles;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id |                 title
----+---------------------------------------
  1 | Mastering PostgreSQL string functions
  2 | PostgreSQL LTRIM() function
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use `LTRIM()` function to remove all specified characters from the beginning of a string.
- <!-- /wp:list-item -->

<!-- /wp:list -->
