---
title: 'PostgreSQL MOD() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-mod/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: In this tutorial, you will learn how to use the PostgreSQL `MOD()` function performs the modulo operation, returning the remainder after dividing the first argument by the second one.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL MOD() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The MOD() function allows you to perform a modulo operation, returning the remainder after dividing the first argument by the second one.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the PostgreSQL `MOD()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
MOD(dividend,divisor)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `dividend`: The `dividend` is a number that you want to divide.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `divisor`: The `divisor` is the number by which you want to divide the dividend.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `divisor` must not be zero (0), otherwise, the function will issue the division by zero error.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `MOD()` function returns a number whose [data type](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-data-types/) is the same as the input argument. It returns NULL if either `dividend` or `divisor` is `NULL`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL MOD() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the MOD() function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL MOD() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `MOD()` function to get the remainder of two integers:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT MOD(15,4);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 mod
-----
   3
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement uses the `MOD()` function to get the remainder of 15 and -5:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT MOD(15,-4);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 mod
-----
   3
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

But the following statement returns a negative result:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT MOD(-15,4);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The remainder is a negative number:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 mod
-----
  -3
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Similarly, the following statement returns the same negative remainder number:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT MOD(-15,-4);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 mod
-----
  -3
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the MOD() function with decimal numbers

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `MOD()` function to calculate the remainder when dividing 10.5 by 3, resulting in 1.5:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT MOD(10.5, 3);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 mod
-----
 1.5
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `MOD()` function to find the remainder after dividing one number by another.
- <!-- /wp:list-item -->

<!-- /wp:list -->
