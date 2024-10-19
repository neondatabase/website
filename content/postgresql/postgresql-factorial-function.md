---
title: 'PostgreSQL FACTORIAL() Function'
redirectFrom: 
            - /postgresql/postgresql-factorial
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `factorial()` function to calculate the factorial of a number.

## Introduction to the PostgreSQL factorial() function

The factorial of a non-negative integer n is the product of all positive integers less than or equal to `n`:

```
n!=n×(n−1)×(n−2)×…×2×1
```

By convention, 0! = 1.

In PostgreSQL, you can use the built-in `factorial()` function to calculate the factorial of a number:

```
factorial(n)
```

In this syntax, `n` is the number that you want to calculate the factorial. The `factorial()` function returns null if n is null.

If n is negative, the factorial() function will issue an error:

```sql
ERROR:  factorial of a negative number is undefined
```

## PostgreSQL factorial() function example

Let's take some examples of using the `factorial()` function.

The following example uses the `factorial()` function to calculate the factorial of the number 10:

```sql
SELECT factorial(5);
```

Output:

```
 factorial
-----------
       120
(1 row)
```

## Summary

- Use the `factorial()` function to calculate the factorial of a number.
