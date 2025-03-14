---
title: 'PostgreSQL PI() Function'
page_title: 'PostgreSQL PI() Function'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL PI() function to return the pi value.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-pi-function/'
ogImage: ''
updatedOn: '2024-04-18T03:47:36+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL POWER() Function'
  slug: 'postgresql-math-functions/postgresql-power'
nextLink:
  title: 'PostgreSQL RADIANS() Function'
  slug: 'postgresql-math-functions/postgresql-radians'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `PI()` function to return the pi value.

## Introduction to the PostgreSQL PI() function

In PostgreSQL, the `PI()` function returns the value of pi denoted by the Greek letter (π), which is approximately equal to `3.14`

Here’s the syntax of the `PI()` function:

```sql
PI()
```

The `PI`() function takes no arguments and returns the constant value of `PI`, which is `3.141592653589793`.

## PostgreSQL PI() function examples

Let’s take some examples of using the `PI()` function examples.

### 1\) Basic PI() function examples

The following statement uses the `PI()` function to return the constant `PI` value:

```sql
SELECT PI();
```

Output:

```text
        pi
-------------------
 3.141592653589793
```

The following example uses the `PI()` function to calculate the area of a circle with a radius of 10:

```sql
SELECT PI() * 10 * 10 area;
```

Output:

```text
       area
-------------------
 314.1592653589793
(1 row)
```

### 2\) Using the PI() function with table data

First, [create a table](../postgresql-tutorial/postgresql-create-table) called `circles` that stores the radiuses of circles:

```sql
CREATE TABLE circles(
   id INT GENERATED ALWAYS AS IDENTITY,
   radius DEC(19,2) NOT NULL,
   PRIMARY KEY(id)
);
```

Second, [insert rows](../postgresql-tutorial/postgresql-insert) into the `circles` table:

```sql
INSERT INTO circles(radius)
VALUES(10), (20), (25)
RETURNING *;
```

Output:

```text
 id | radius
----+--------
  1 |  10.00
  2 |  20.00
  3 |  25.00
(3 rows)
```

Third, calculate the areas of circles using the `PI()` function:

```sql
SELECT id, radius, PI() * radius * radius area
FROM circles;
```

Output:

```text
 id | radius |        area
----+--------+--------------------
  1 |  10.00 |  314.1592653589793
  2 |  20.00 | 1256.6370614359173
  3 |  25.00 | 1963.4954084936207
(3 rows)
```

To make the area more readable, you can use the [`ROUND()`](postgresql-round) function:

```sql
SELECT
  id,
  RADIUS,
  ROUND((PI() * RADIUS * RADIUS)::NUMERIC, 2) AREA
FROM
  circles;
```

Output:

```text
 id | radius |  area
----+--------+---------
  1 |  10.00 |  314.16
  2 |  20.00 | 1256.64
  3 |  25.00 | 1963.50
(3 rows)
```

## Summary

- Use the `PI()` function to return the pi value.
