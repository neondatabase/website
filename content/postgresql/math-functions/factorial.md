---
title: PostgreSQL FACTORIAL() Function
page_title: PostgreSQL factorial() Function
page_description: >-
  In this tutorial, you will learn how to use the PostgreSQL factorial()
  function to calculate the factorial of a number.
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-factorial/
ogImage: ''
updatedOn: '2024-05-19T03:51:00+00:00'
enableTableOfContents: true
previousLink:
  title: PostgreSQL EXP() Function
  slug: postgresql-math-functions/postgresql-exp
nextLink:
  title: PostgreSQL FLOOR() Function
  slug: postgresql-math-functions/postgresql-floor
---
<Admonition type="info" id="CTA">
The factorial() function is a standard part of PostgreSQL, so everything here works with any Postgres deployment. If you're an enterprise building for the AI era, [Lakebase](https://www.databricks.com/product/lakebase) delivers managed Postgres with the performance, security, and native Lakehouse integration your teams need. If you're a developer or startup racing to ship and scale, [Neon](https://neon.com) gives you the fastest path to production Postgres.
</Admonition>

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `factorial()` function to calculate the factorial of a number.

## Introduction to the PostgreSQL factorial() function

The factorial of a non\-negative integer n is the product of all positive integers less than or equal to `n`:

```
n!=n×(n−1)×(n−2)×…×2×1
```

By convention, 0! \= 1\.

In PostgreSQL, you can use the built\-in `factorial()` function to calculate the factorial of a number:

```sql
factorial(n)
```

In this syntax, `n` is the number that you want to calculate the factorial. The `factorial()` function returns null if n is null.

If n is negative, the factorial() function will issue an error:

```
ERROR:  factorial of a negative number is undefined
```

## PostgreSQL factorial() function example

Let’s take some examples of using the `factorial()` function.

The following example uses the `factorial()` function to calculate the factorial of the number 10:

```sql
SELECT factorial(5);
```

Output:

```text
 factorial
-----------
       120
(1 row)
```

## Summary

- Use the `factorial()` function to calculate the factorial of a number.
