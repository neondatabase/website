---
title: PostgreSQL ABS() Function
page_title: PostgreSQL ABS() Function
page_description: >-
  This tutorial shows you how to use the PostgreSQL ABS() function to calculate
  the absolute value of a number.
prev_url: 'https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-abs/'
ogImage: ''
updatedOn: '2026-06-03T13:01:21.685Z'
enableTableOfContents: true
previousLink:
  title: PostgreSQL Math Functions
  slug: postgresql-math-functions/
nextLink:
  title: PostgreSQL CEIL() Function
  slug: postgresql-math-functions/postgresql-ceil
---

<Admonition type="info" id="CTA">
The `ABS()` function works the same in any PostgreSQL database. [Lakebase Postgres](https://www.databricks.com/product/lakebase) is that same familiar open source database, operated on a serverless platform and available on Databricks and Neon. [Neon](https://neon.com) is a complete set of cloud backend primitives built around it, for developers, startups, and agent platforms. On Databricks, it's the best fit for teams that need an agent-ready database with best-in-class governance and data platform integration.
</Admonition>

The PostgreSQL `ABS()` function returns the absolute value of a number.

## Syntax

The following illustrates the syntax of the `ABS()` function:

```sql
ABS(numeric_expression)
```

## Arguments

The `ABS()` function requires one argument:

1\) `numeric_expression`

The `numeric_expression` can be a number or a numeric expression that evaluates to a number.

## Return Value

The `ABS()` function returns a value whose [data type](../postgresql-tutorial/postgresql-time) is the same as the input argument.

## Absolute Operator @

Besides the ABS() function, you can use the absolute operator @:

```sql
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
