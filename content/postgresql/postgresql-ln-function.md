---
modifiedAt: 2024-04-17 21:23:16
prevPost: postgresql-make_date-function
nextPost: postgresql-is-null
createdAt: 2024-04-18T04:22:26.000Z
title: 'PostgreSQL LN() Function'
redirectFrom: 
            - /postgresql/postgresql-math-functions/postgresql-ln
            - /postgresql/postgresql-ln
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LN()` function to calculate the natural logarithm of a number.

## Introduction to the PostgreSQL LN() function

The natural logarithm is a function that represents the logarithm to base e, where e is Euler's number, which is approximately equal to `2.71828`.

In Math, the natural logarithm of a x is denoted as ln(x).

If ln(x) = y, then ey = x.

In PostgreSQL, you use the `LN()` function to calculate the natural logarithm of a number.

Here's the syntax of the `LN()` function:

```sql
LN(n)
```

In this syntax:

- `n` is a number with the type numeric or double precision. It can be a literal number, an expression, or a table column. `n` cannot be zero.

The `LN()` function returns the natural logarithm of `n` with the type corresponding to the type of `n`. It returns `NULL` if n is `NULL`.

If n is a string, the `LN()` function will convert it to a type numeric or double precision value. If the conversion fails, the `LN()` function raises an error.

The `LN()` function is the inverse of the `EXP()` function that returns the exponential value of a number.

## PostgreSQL LN() function examples

Let's take some examples of using the `LN()` function.

### 1) Basic PostgreSQL LN() function examples

The following example uses the `LN()` function to return the natural logarithm of 10:

```sql
SELECT LN(10) result;
```

Output:

```
      result
-------------------
 2.302585092994046
```

The following statement uses the `LN()` function to return the natural logarithm of e:

```sql
SELECT LN(EXP(1)) result;
```

Output:

```
 result
--------
      1
```

In this example, the `EXP`(1) function returns e1, which is e. Then, the `LN()` function returns the natural logarithm of e, which returns 1.

### 2) Using the LN() function with text

The following example uses the `LN()` function to calculate the natural logarithm of a numeric string '10'

```sql
SELECT LN('10') result;
```

Output:

```
      result
-------------------
 2.302585092994046
```

In this example, the `LN()` function converts the string '10' to a number before calculating the natural logarithm.

The following example attempts to calculate the natural logarithm of the string '10x':

```sql
SELECT LN('10x') result;
```

The function raises an error because it cannot convert the string '10x' to a number:

```sql
ERROR:  invalid input syntax for type double precision: "10x"
LINE 1: SELECT LN('10x') result;
                  ^
```

## Summary

- Use the `LN()` function to calculate the natural logarithm of a number.
