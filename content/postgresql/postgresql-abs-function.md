---
title: 'PostgreSQL ABS() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-abs/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

The PostgreSQL `ABS()` function returns the absolute value of a number.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Syntax

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following illustrates the syntax of the `ABS()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ABS(numeric_expression)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Arguments

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `ABS()` function requires one argument:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

1. `numeric_expression`

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `numeric_expression` can be a number or a numeric expression that evaluates to a number.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Return Value

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `ABS()` function returns a value whose [data type](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-time/) is the same as the input argument.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Absolute Operator @

<!-- /wp:heading -->

<!-- wp:paragraph -->

Besides the ABS() function, you can use the absolute operator @:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
@ expression
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, the `@` operator returns the absolute value of the `expression`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example shows how to use the `ABS()` function to calculate the absolute value of a number:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT ABS(-10.25) result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result is:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 result
--------
  10.25
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement uses an expression for the `ABS()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT ABS( 100 - 250 ) result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Here is the result:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 result
--------
    150
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Besides the `ABS()` function, you can use the absolute operator `@`, for example:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT @ -15 as result
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It returned 15 as expected.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 result
--------
     15
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this tutorial, you have learned how to use the PostgreSQL `ABS()` function to calculate the absolute value of a number.

<!-- /wp:paragraph -->
