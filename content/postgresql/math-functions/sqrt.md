---
title: PostgreSQL SQRT() Function
page_title: PostgreSQL SQRT() Function
page_description: >-
  In this tutorial, you will learn how to use the PostgreSQL SQRT() function to
  calculate the square root of a number.
prev_url: 'https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-sqrt/'
ogImage: ''
updatedOn: '2026-06-03T13:01:21.685Z'
enableTableOfContents: true
previousLink:
  title: PostgreSQL ROUND() Function
  slug: postgresql-math-functions/postgresql-round
nextLink:
  title: PostgreSQL SCALE() Function
  slug: postgresql-math-functions/postgresql-scale
---

<Admonition type="info" id="CTA">
The SQRT() function works the same across any PostgreSQL deployment. [Lakebase Postgres](https://www.databricks.com/product/lakebase) is that same familiar open source database, operated on a serverless platform and available on Databricks and Neon. [Neon](https://neon.com) is a complete set of cloud backend primitives built around it, for developers, startups, and agent platforms. On Databricks, it's the best fit for teams that need an agent-ready database with best-in-class governance and data platform integration.
</Admonition>

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `SQRT()` function to calculate the square root of a number.

## Introduction to the PostgreSQL SQRT() function

The `SQRT()` function is a powerful mathematical function that allows you to calculate the square root of a number.

Here’s the basic syntax of the `SQRT()` function:

```sql
SQRT(number)
```

In this syntax, the `number` is a numeric value for which you want to calculate the square root

The `SQRT()` function returns the square root of the input `number`.

## PostgreSQL SQRT() function examples

Let’s take some examples of using the `SQRT()` function.

### 1\) Basic SQRT() function example

The following example uses the `SQRT()` function to return the square root of 25:

```sql
SELECT SQRT(25) AS result;
```

Output:

```text
 result
--------
      5
(1 row)
```

The query returns the square root of 25, which is 5\.

### 2\) Using PostgreSQL SQRT() function to calculate distance

Suppose you have a table called `coordinates` that consists of columns `x` and `y` representing the coordinates of points in two\-dimensional space:

```sql
-- Create coordinates table
CREATE TABLE coordinates (
    id SERIAL PRIMARY KEY,
    x NUMERIC,
    y NUMERIC
);

-- Insert sample data
INSERT INTO coordinates (x, y) VALUES
    (3, 4),
    (-2, 5),
    (0, 0),
    (8, -6),
    (-1.5, 2.5)
RETURNING *;
```

Output:

```text
 id |  x   |  y
----+------+-----
  1 |    3 |   4
  2 |   -2 |   5
  3 |    0 |   0
  4 |    8 |  -6
  5 | -1.5 | 2.5
(5 rows)
```

The following query uses the `SQRT()` function to calculate the distance of each point from the origin (0,0\):

```sql
SELECT SQRT(x * x + y * y) AS distance_from_origin
FROM coordinates;
```

Output:

```text
 distance_from_origin
----------------------
    5.000000000000000
    5.385164807134504
    0.000000000000000
   10.000000000000000
    2.915475947422650
(5 rows)
```

## Summary

- Use the PostgreSQL `SQRT()` function to calculate the square root of a number.
