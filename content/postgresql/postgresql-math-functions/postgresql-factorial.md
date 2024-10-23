---
title: 'PostgreSQL FACTORIAL() Function'
page_title: 'PostgreSQL factorial() Function'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL factorial() function to calculate the factorial of a number.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-factorial/'
ogImage: ''
updatedOn: '2024-05-19T03:51:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL EXP() Function'
  slug: 'postgresql-math-functions/postgresql-exp'
nextLink:
  title: 'PostgreSQL FLOOR() Function'
  slug: 'postgresql-math-functions/postgresql-floor'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `factorial()` function to calculate the factorial of a number.

## Introduction to the PostgreSQL factorial() function

The factorial of a non\-negative integer n is the product of all positive integers less than or equal to `n`:

```plaintextsql
n!=n×(n−1)×(n−2)×…×2×1
```

By convention, 0! \= 1\.

In PostgreSQL, you can use the built\-in `factorial()` function to calculate the factorial of a number:

```sql
factorial(n)
```

In this syntax, `n` is the number that you want to calculate the factorial. The `factorial()` function returns null if n is null.

If n is negative, the factorial() function will issue an error:

```sql
ERROR:  factorial of a negative number is undefined
```

## PostgreSQL factorial() function example

Let’s take some examples of using the `factorial()` function.

The following example uses the `factorial()` function to calculate the factorial of the number 10:

```
SELECT factorial(5);
```

Output:

```sql
 factorial
-----------
       120
(1 row)
```

## Summary

- Use the `factorial()` function to calculate the factorial of a number.
