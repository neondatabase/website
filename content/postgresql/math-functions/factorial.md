---
title: PostgreSQL FACTORIAL() Function
page_title: PostgreSQL factorial() Function
page_description: >-
  In this tutorial, you will learn how to use the PostgreSQL factorial()
  function to calculate the factorial of a number.
prev_url: >-
  https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-factorial/
ogImage: ''
updatedOn: '2026-06-19T17:44:03.964Z'
enableTableOfContents: true
previousLink:
  title: PostgreSQL EXP() Function
  slug: postgresql-math-functions/postgresql-exp
nextLink:
  title: PostgreSQL FLOOR() Function
  slug: postgresql-math-functions/postgresql-floor
---

<Admonition type="info" id="CTA">
The factorial() function is a standard part of PostgreSQL. [Lakebase Postgres](https://www.databricks.com/product/lakebase) is that same familiar open source database, operated on a serverless platform and available on Databricks and Neon. [Neon](https://neon.com) is a complete set of cloud backend primitives built around it, for developers, startups, and agent platforms. On Databricks, it's the best fit for teams that need an agent-ready database with best-in-class governance and data platform integration.
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

The following example uses the `factorial()` function to calculate the factorial of the number 5:

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
