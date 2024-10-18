---
title: 'PostgreSQL RPAD() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-string-functions/postgresql-rpad/
ogImage: ./img/wp-content-uploads-2019-05-film.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `RPAD()` function to extend a string to a length by filing characters.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL RPAD() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `RPAD()` function allows you to extend a string to a length by appending specified characters.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `RPAD()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
RPAD(string, length, fill)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `string`: The input string that you want to extend.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `length`: The desired length of the string after padding.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `fill`: The character or string used for padding.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `RPAD()` function returns the string, right-padded with the string `fill` to a length of `length` characters.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the length of the `string` is greater than the desired `length`, the `RPAD()` function truncates the `string` to the `length` characters.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If any argument `string`, `length`, or `fill` is `NULL`, the `RPAD()` function returns `NULL`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `RPAD()` function can be particularly useful when you need to format text with a consistent length, align text in columns, or prepare data for display.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

To left-pad a string to a length with specified characters, you can use the `LPAD()` function.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL RPAD() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the PostgreSQL `RPAD()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL RPAD() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `RPAD()` function to extend a string by filling zeros ('0') to make it six characters long:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT RPAD('123', 6, '0');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
  rpad
--------
 123000
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the RPAD() function with the table data example

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:image {"id":4017,"sizeSlug":"full","linkDestination":"none"} -->

![](./img/wp-content-uploads-2019-05-film.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following example uses the `RPAD()` function to right-pad the titles from the `film` table with the character '.' to make it 50 characters long:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  RPAD(title, 50, '.')
FROM
  film;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
                        rpad
----------------------------------------------------
 Chamber Italian...................................
 Grosse Wonderful..................................
 Airport Pollock...................................
 Bright Encounters.................................
 Academy Dinosaur..................................
...
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Using the RPAD() function to truncate strings

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `RPAD()` function to truncate the titles if their lengths are more than 10 characters:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
  title, RPAD(title, 10, '') result
FROM
  film;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
            title            |   result
-----------------------------+------------
 Chamber Italian             | Chamber It
 Grosse Wonderful            | Grosse Won
 Airport Pollock             | Airport Po
 Bright Encounters           | Bright Enc
 Academy Dinosaur            | Academy Di
 Ace Goldfinger              | Ace Goldfi
...
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use PostgreSQL `RPAD()` function to extend a string to a length by appending specified characters.
- <!-- /wp:list-item -->

<!-- /wp:list -->
