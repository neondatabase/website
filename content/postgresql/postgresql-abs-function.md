---
prevPost: postgresql-current_date-function
nextPost: postgresql-create-index-statement
createdAt: 2017-08-17T03:54:07.000Z
title: 'PostgreSQL ABS() Function'
redirectFrom: 
            - /postgresql/postgresql-math-functions/postgresql-abs
            - /postgresql/postgresql-abs
tableOfContents: true
---


The PostgreSQL `ABS()` function returns the absolute value of a number.

## Syntax

The following illustrates the syntax of the `ABS()` function:

```sql
ABS(numeric_expression)
```

## Arguments

The `ABS()` function requires one argument:

1. `numeric_expression`

The `numeric_expression` can be a number or a numeric expression that evaluates to a number.

## Return Value

The `ABS()` function returns a value whose [data type](/postgresql/postgresql-time) is the same as the input argument.

## Absolute Operator @

Besides the ABS() function, you can use the absolute operator @:

```
@ expression
```

In this syntax, the `@` operator returns the absolute value of the `expression`.

## Examples

The following example shows how to use the `ABS()` function to calculate the absolute value of a number:

```sql
SELECT ABS(-10.25) result;
```

The result is:

```
 result
--------
  10.25
(1 row)
```

The following statement uses an expression for the `ABS()` function:

```sql
SELECT ABS( 100 - 250 ) result;
```

Here is the result:

```
 result
--------
    150
(1 row)
```

Besides the `ABS()` function, you can use the absolute operator `@`, for example:

```sql
SELECT @ -15 as result
```

It returned 15 as expected.

```
 result
--------
     15
(1 row)
```

In this tutorial, you have learned how to use the PostgreSQL `ABS()` function to calculate the absolute value of a number.
