---
title: 'PostgreSQL WIDTH_BUCKET() Function'
page_title: 'PostgreSQL WIDTH_BUCKET() Function By Practical Examples'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL WIDTH_BUCKET() function for binning numeric data into discrete buckets.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-width_bucket/'
ogImage: '/postgresqltutorial/film.png'
updatedOn: '2024-02-17T14:08:37+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL TRIM_SCALE() Function'
  slug: 'postgresql-math-functions/postgresql-trim_scale'
nextLink:
  title: 'PostgreSQL Window Functions'
  slug: 'postgresql-math-functions/../postgresql-window-function'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `WIDTH_BUCKET()` function for binning numeric data into discrete buckets.

## Introduction to the PostgreSQL WIDTH_BUCKET() function

The `WIDTH_BUCKET()` function allows you to categorize numeric values into discrete buckets based on specified boundaries.

Here’s the basic syntax of the `WIDTH_BUCKET()` function:

```sql
WIDTH_BUCKET(numeric_value, lower_bound, upper_bound, num_buckets)
```

In this syntax:

- `numeric_value`: The numeric value that you want to place into a bucket.
- `lower_bound`: The lower bound of the range within which the `numeric_value` falls. It is **inclusive**.
- `upper_bound`: The upper bound of the range within which the `numeric_value` falls. It is exclusive.
- `num_buckets`: The total number of buckets to divide the range into.

The `WIDTH_BUCKET()` function returns an integer value that represents the bucket number into which the specified value falls.

If `numeric_value` is less than the lower bound, the `WIDTH_BUCKET()` function returns 0\.

If the `numeric_value` is greater than or equal to the `lower_bound` but less than the upper bound of the first bucket, the `WIDTH_BUCKET()` function returns 1\.

If the numeric value falls within the second bucket, the `WIDTH_BUCKET()` function returns 2\.

This pattern continues until the numeric value falls into the last bucket, where the `WIDTH_BUCKET()` function returns the `num_buckets`

If the `numeric_value` is less than the `lower_bound`, the `WIDTH_BUCKET()` function returns 0\. If the `numeric_value` is greater than the `upper_bound`, the `WIDTH_BUCKET()` function returns the `num_buckets` plus 1\.

In practice, you often use the `WIDTH_BUCKET()` function for data binning tasks and histogram generation.

## PostgreSQL WIDTH_BUCKET() function examples

Let’s explore some examples of using the `WIDTH_BUCKET()` function.

### 1\) Basic WIDTH_BUCKET() function example

The following example uses the `WIDTH_BUCKET()` function to assign numeric values to three buckets (0, 10\), (10, 20\), and (20, 30\):

```sql
SELECT
  WIDTH_BUCKET(-1, 0, 30, 3),
  WIDTH_BUCKET(0, 0, 30, 3),
  WIDTH_BUCKET(12, 0, 30, 3),
  WIDTH_BUCKET(25, 0, 30, 3),
  WIDTH_BUCKET(35, 0, 30, 3);
```

Output:

```sql
 width_bucket | width_bucket | width_bucket | width_bucket | width_bucket
--------------+--------------+--------------+--------------+--------------
            0 |            1 |            2 |            3 |            4
(1 row)
```

In this example:

- The `WIDTH_BUCKET()` function returns 0 for the value \-1 because \-1 is less than the lower bound (0\).
- The `WIDTH_BUCKET()` function returns 1 for the value 0 because 0 falls in the range of the first bucket (0,10\).
- The `WIDTH_BUCKET()` function returns 2 for the value 12 because 12 falls in the second bucket (10, 20\).
- The `WIDTH_BUCKET()` function returns 3 for the value 25 because 25 falls in the third bucket (20, 30\).
- The `WIDTH_BUCKET()` functions return 3 for the value 35 because 35 is greater than the upper bound (30\).

### 2\) Using the WIDTH_BUCKET() function with table data

We’ll use the `film` table from the [sample database](../postgresql-getting-started/postgresql-sample-database):

![](/postgresqltutorial/film.png)The following example uses the `WIDTH_BUCKET()` function to categorize the films into six buckets:

```sql
SELECT
  title,
  length,
  WIDTH_BUCKET(length, 40, 200, 6) AS bucket_number
FROM
  film
ORDER BY
  title;
```

Output:

```sql
            title            | length | bucket_number
-----------------------------+--------+---------------
 Academy Dinosaur            |     86 |             2
 Ace Goldfinger              |     48 |             1
 Adaptation Holes            |     50 |             1
 Affair Prejudice            |    117 |             3
 African Egg                 |    130 |             4
...
```

### 3\) Using WIDTH_BUCKET() function to generate histogram

The following example uses a [common table expression](../postgresql-tutorial/postgresql-cte) (CTE) to generate the bucket numbers and then calculate the frequency of films falling into each bucket:

```sql
WITH buckets_cte AS (
    SELECT WIDTH_BUCKET(length, 40, 200, 6) AS bucket_number
    FROM film
)
SELECT
    bucket_number,
    COUNT(*) AS frequency
FROM
    buckets_cte
GROUP BY
    bucket_number
ORDER BY
    bucket_number;
```

Output:

```sql
 bucket_number | frequency
---------------+-----------
             1 |       147
             2 |       203
             3 |       184
             4 |       194
             5 |       175
             6 |        97
(6 rows)
```

How it works.

CTE:

- First, define a common table expression named `buckets_cte`.
- Second, use the `WIDTH_BUCKET()` function to assign each film’s length into one of six buckets.

Main query:

- First, select data from the `buckets_cte`.
- Second, count the number of films for each bucket using the [`COUNT(*)`](../postgresql-aggregate-functions/postgresql-count-function) function and group the result by the `bucket_number` using the [`GROUP BY`](../postgresql-tutorial/postgresql-group-by) clause.
- Third, sort the result by the `bucket_number`.

### 4\) Generate ASCII histograms

Based on the result set, you can generate a histogram in the application. But if you want to generate a histogram in psql, you can use the following query:

```sql
WITH buckets_cte AS (
    SELECT WIDTH_BUCKET(length, 40, 200, 6) AS bucket_number
    FROM film
),
histogram_cte AS (
    SELECT
        bucket_number,
        COUNT(*) AS frequency
    FROM
        buckets_cte
    GROUP BY
        bucket_number
    ORDER BY
        bucket_number
)
SELECT
    bucket_number,
    REPEAT('*', DIV(frequency,10)::int) AS histogram
FROM
    histogram_cte;
```

Output:

```sql
 bucket_number |      histogram
---------------+----------------------
             1 | **************
             2 | ********************
             3 | ******************
             4 | *******************
             5 | *****************
             6 | *********
(6 rows)
```

How it works.

The query defines two common table expressions and generates the histogram using the asterisk character (\*).

- `buckets_cte` `CTE` – Assign films to buckets using the `WIDTH_BUCKET()` function based on their lengths.
- `histogram_cte` `CTE` – Select data from the `buckets_cte` by grouping the frequency of the bucket numbers.
- The main query – Select data from the `histogram_cte` `CTE`. We use the `REPEAT`() function to generate the histogram bars by repeating the asterisk (\*) character a number of times which equals the integer division of frequency by 10\. This is to scale down the histogram to prevent it from being too wide. To perform integer divisions, we use the [`DIV()`](postgresql-div) function. Since the `REPEAT` function accepts an integer only, we cast the result of the `DIV()` to an integer using the cast operator (::).

## Summary

- Use the PostgreSQL `WIDTH_BUCKET()` function for binning numeric data into discrete buckets or generating histograms.
