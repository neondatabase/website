---
title: 'PostgreSQL LN() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-ln/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LN()` function to calculate the natural logarithm of a number.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL LN() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The natural logarithm is a function that represents the logarithm to base e, where e is Euler's number, which is approximately equal to `2.71828`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In Math, the natural logarithm of a x is denoted as ln(x).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If ln(x) = y, then ey = x.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In PostgreSQL, you use the `LN()` function to calculate the natural logarithm of a number.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `LN()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
LN(n)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `n` is a number with the type numeric or double precision. It can be a literal number, an expression, or a table column. `n` cannot be zero.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `LN()` function returns the natural logarithm of `n` with the type corresponding to the type of `n`. It returns `NULL` if n is `NULL`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If n is a string, the `LN()` function will convert it to a type numeric or double precision value. If the conversion fails, the `LN()` function raises an error.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `LN()` function is the inverse of the `EXP()` function that returns the exponential value of a number.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL LN() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `LN()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL LN() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `LN()` function to return the natural logarithm of 10:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LN(10) result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
      result
-------------------
 2.302585092994046
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement uses the `LN()` function to return the natural logarithm of e:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LN(EXP(1)) result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
      1
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, the `EXP`(1) function returns e1, which is e. Then, the `LN()` function returns the natural logarithm of e, which returns 1.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using the LN() function with text

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `LN()` function to calculate the natural logarithm of a numeric string '10'

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LN('10') result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
      result
-------------------
 2.302585092994046
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, the `LN()` function converts the string '10' to a number before calculating the natural logarithm.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example attempts to calculate the natural logarithm of the string '10x':

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LN('10x') result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The function raises an error because it cannot convert the string '10x' to a number:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ERROR:  invalid input syntax for type double precision: "10x"
LINE 1: SELECT LN('10x') result;
                  ^
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `LN()` function to calculate the natural logarithm of a number.
- <!-- /wp:list-item -->

<!-- /wp:list -->
