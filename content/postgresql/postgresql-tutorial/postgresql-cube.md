---
title: 'PostgreSQL CUBE'
page_title: 'PostgreSQL CUBE'
page_description: 'This tutorial shows you how to use the PostgreSQL CUBE to generate multiple grouping sets.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-cube/'
ogImage: '/postgresqltutorial/sales-table.png'
updatedOn: '2024-07-01T01:06:31+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL ROLLUP'
  slug: 'postgresql-tutorial/postgresql-rollup'
nextLink:
  title: 'PostgreSQL Subquery'
  slug: 'postgresql-tutorial/postgresql-subquery'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CUBE` to generate multiple grouping sets.

## Introduction to the PostgreSQL CUBE

PostgreSQL `CUBE` is a subclause of the [`GROUP BY`](postgresql-group-by) clause. The `CUBE` allows you to generate multiple grouping sets.

A grouping set is a set of columns to which you want to group. For more information on the grouping sets, check it out the [`GROUPING SETS`](postgresql-grouping-sets) tutorial.

The following illustrates the syntax of the `CUBE` subclause:

```sql
SELECT
    c1,
    c2,
    c3,
    aggregate (c4)
FROM
    table_name
GROUP BY
    CUBE (c1, c2, c3);

```

In this syntax:

- First, specify the `CUBE` subclause in the the [`GROUP BY`](postgresql-group-by) clause of the [`SELECT`](postgresql-select) statement.
- Second, in the select list, specify the columns (dimensions or dimension columns) which you want to analyze and [aggregation function](../postgresql-aggregate-functions) expressions.
- Third, in the `GROUP BY` clause, specify the dimension columns within the parentheses of the `CUBE` subclause.

The query generates all possible grouping sets based on the dimension columns specified in `CUBE`. The `CUBE` subclause is a short way to define multiple grouping sets so the following are equivalent:

```sql
CUBE(c1,c2,c3)

GROUPING SETS (
    (c1,c2,c3),
    (c1,c2),
    (c1,c3),
    (c2,c3),
    (c1),
    (c2),
    (c3),
    ()
 )

```

In general, if the number of columns specified in the `CUBE` is `n`, then you will have 2ncombinations.

PostgreSQL allows you to perform a partial cube to reduce the number of aggregates calculated. The following shows the syntax:

```sql
SELECT
    c1,
    c2,
    c3,
    aggregate (c4)
FROM
    table_name
GROUP BY
    c1,
    CUBE (c1, c2);

```

## PostgreSQL CUBE examples

We will use the `sales` table created in the `GROUPING SETS` tutorial for the demonstration.

![Sales Table](/postgresqltutorial/sales-table.png)
The following query uses the `CUBE` subclause to generate multiple grouping sets:

```sql
SELECT
    brand,
    segment,
    SUM (quantity)
FROM
    sales
GROUP BY
    CUBE (brand, segment)
ORDER BY
    brand,
    segment;

```

Here is the output:

![PostgreSQL CUBE example](/postgresqltutorial/PostgreSQL-CUBE-example.png)
The following query performs a partial cube:

```sql
SELECT
    brand,
    segment,
    SUM (quantity)
FROM
    sales
GROUP BY
    brand,
    CUBE (segment)
ORDER BY
    brand,
    segment;

```

![PostgreSQL CUBE - partial cube example](/postgresqltutorial/PostgreSQL-CUBE-partial-cube-example.png)
In this tutorial, you have learned how to use the PostgreSQL `CUBE` to generate multiple grouping sets.
