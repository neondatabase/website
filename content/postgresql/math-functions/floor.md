---
title: PostgreSQL FLOOR() Function
page_title: PostgreSQL FLOOR() Function By Practical Examples
page_description: >-
  Show you how to use the PostgreSQL FLOOR() function to round a number down to
  the nearest integer, which is less than or equal to the number.
prev_url: 'https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-floor/'
ogImage: /postgresqltutorial/payment-table.png
updatedOn: '2026-06-19T17:44:03.964Z'
enableTableOfContents: true
previousLink:
  title: PostgreSQL FACTORIAL() Function
  slug: postgresql-math-functions/postgresql-factorial
nextLink:
  title: PostgreSQL GCD() Function
  slug: postgresql-math-functions/postgresql-gcd
---

<Admonition type="info" id="CTA">
The FLOOR() function is standard PostgreSQL and works the same on any Postgres deployment. [Lakebase Postgres](https://www.databricks.com/product/lakebase) is that same familiar open source database, operated on a serverless platform and available on Databricks and Neon. [Neon](https://neon.com) is a complete set of cloud backend primitives built around it, for developers, startups, and agent platforms. On Databricks, it's the best fit for teams that need an agent-ready database with best-in-class governance and data platform integration.
</Admonition>

The PostgreSQL `FLOOR()` function returns a number rounded down to the next whole number.

## Syntax

The syntax of the `FLOOR()` function is as follows:

```sql
FLOOR(numeric_expression)
```

## Arguments

The `FLOOR()` function requires one argument:

**1\) `numeric_expression`**

The `numeric_expression` is a number or an expression that evaluates to a number, which you want to round down.

## Return Value

The `FLOOR()` function returns a value whose data type is the same as the input argument.

## Examples

The following example shows how to use the `FLOOR()` function to round a number down to the nearest integer:

```sql
SELECT
    FLOOR( 150.75 );
```

The result is:

```
150
```

See the following `payment` table in the [sample database](../postgresql-getting-started/postgresql-sample-database):

![payment table](/postgresqltutorial/payment-table.png)
The following statement returns the floor of the amount paid by the customer:

```sql
SELECT
    customer_id,
    FLOOR(SUM( amount )) amount_paid
FROM
    payment
GROUP BY
    customer_id
ORDER BY
    amount_paid DESC;
```

The following picture illustrates the result:

![PostgreSQL FLOOR Function Example](/postgresqltutorial/PostgreSQL-FLOOR-Function-Example.png)

## Remarks

To round a number up to the nearest whole number, you use the [`CEIL()`](postgresql-ceil) function.

In this tutorial, you have learned how to use the PostgreSQL `FLOOR()` function to round a number down to the nearest integer, which is less than or equal to the number.
