---
title: 'PostgreSQL LOG() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-log/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LOG()` function to calculate the logarithm of a number

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL LOG() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, the `LOG()` function allows you to calculate the logarithm of a number. PostgreSQL offers two `LOG()` functions:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Base-10 logarithm: The base-10 logarithm is the most commonly used logarithm in science and engineering applications.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `LOG()` function that calculates the base-10 logarithm of a number:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
LOG(n)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `n` is a number with the type [numeric](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-numeric/) or [double precision](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-double-precision-type/) you want to calculate the base-10 logarithm.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `LOG()` function returns the base-10 logarithm with the same type as the type of the input number (`n`), which is `numeric` and `double precision` respectively. If n is `NULL` the `LOG()` function returns `NULL`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If `n` is a text string, the `LOG()` function will attempt to convert it into a number before calculating the logarithm. It raises an error if the conversion fails.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The second `LOG()` function allows you to calculate the logarithm of a number with a specified base:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
LOG(b, n)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `b` is the base of the logarithm. `b` can be a value of the [numeric](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-numeric/) type.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `n` has the same meaning in the `LOG(n)` function.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph {"className":"note"} -->

To calculate the natural logarithm of a number, you use the `LN()` function instead.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL LOG() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `LOG()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL LOG() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `LOG()` function to calculate the base-10 logarithm of `100`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LOG(100);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 log
-----
   2
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement uses the second form of the `LOG()` function to calculate the base-10 logarithm of 100:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LOG(10,100);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
        log
--------------------
 2.0000000000000000
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement uses the `LOG()` function to calculate the base-2 logarithm of 8:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LOG(2,8);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
        log
--------------------
 3.0000000000000000
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using LOG() function with text

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `LOG()` function to calculate the base-2 logarithm of the text `'64'`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LOG(2, '64');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
        log
--------------------
 6.0000000000000000
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, the `LOG()` function converts the text `'64'` into a number and calculate the base-2 logarithm of 64.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example raises an error because the `LOG()` function cannot convert the string `'64x'` into a number for calculation:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LOG('64x');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Error:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ERROR:  invalid input syntax for type double precision: "64x"
LINE 1: SELECT LOG('64x');                  ^
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use `LOG(n)` function to calculate the base-10 logarithm of the number `n`.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use `LOG(b, n)` function to calculate the logarithm of the number `n` with the base `b`.
- <!-- /wp:list-item -->

<!-- /wp:list -->
