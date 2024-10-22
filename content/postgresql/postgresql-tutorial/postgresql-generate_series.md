---
title: "PostgreSQL generate_series() Function"
page_title: "PostgreSQL generate_series() Function"
page_description: "In this tutorial, you will learn how to use the PostgreSQL generate_series() function to generate a series of numbers or timestamps."
prev_url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-generate_series/"
ogImage: ""
updatedOn: "2024-07-01T01:21:22+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL vs. MySQL"
  slug: "postgresql-tutorial/postgresql-vs-mysql"
next_page: 
  title: "PostgreSQL PL/pgSQL"
  slug: "postgresql-tutorial/../postgresql-plpgsql"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `generate_series()` function to generate a series of numbers or timestamps.


## Introduction to the PostgreSQL generate\_series() function

The `generate_series()` function allows you to generate a series of numbers or [timestamps](postgresql-timestamp).


### Generating a series of numbers

The following shows the syntax of `generate_series()` function that generates a series of numbers from `start` to `stop` with an optional `step` size:


```pgsqlsql
generate_series (start,stop[,step])
```
In this syntax:

* `start` is the starting value of the series.
* `stop` is the ending value of the series. The resulting series will include the `stop` value.
* `step` is the increment value between each consecutive number. The `step` is optional and defaults to 1\.

The data types of `start`, `stop`, and `step` can be `int`, `bigint`, or `numeric`. The function returns a `setof integer`, `bigint`, or `numeric` accordingly.

The following example uses the `generate_series()` to generate a series of numbers from 1 to 5:


```sql
SELECT generate_series(1,5);
```
Output:


```sql
 generate_series
-----------------
               1
               2
               3
               4
               5
(5 rows)
```
Since the steps default to 1, the output series includes numbers from 1 to 5\.

The following example uses the `generate_series()` to generate a series of numbers from 1 to 10 with the step of 2:


```sql
SELECT generate_series(1,10,2);
```
Output:


```sql
 generate_series
-----------------
               1
               3
               5
               7
               9
(5 rows)
```
Since the next number of the series is 11 which is higher than the stop value (1\), the function returns a number that stops at 9\.


### Generating a series of timestamps

The syntax for generating a series of timestamps is as follows:


```sql
generate_series (start,stop,step[,timezone])
```
In this syntax:

* The `start` is the starting value of the series.
* The `stop` is the ending value of the series.
* The `step` is increment values between two consecutive timestamps in the series.
* The `timezone` represents the time zone. Its type is text e.g., `'America/New_York'`. The `timezone` argument is optional.

The data types of the `start` and `stop` can be either `timestamp` or `timestamp with time zone`.

The data type of the `step` is the [`interval`](postgresql-interval).

The function returns a `setof timestamp` or `setof timestamp with time zone` respectively.

When you use a timestamp with a time zone, the function adjusts the times of day and daylight savings time (`DST`) according to the time zone specified by the `timezone` argument, or the current time zone setting if you omit the `timezone` argument.

The following example uses the `generate_series()` function to generate a series of timestamps representing one\-hour intervals for a specific date range:


```sql
SELECT * FROM generate_series(
    '2024-03-29 00:00:00'::timestamp,
    '2024-03-29 23:00:00'::timestamp,
    '1 hour'::interval
);
```
Output:


```sql
 generate_series
---------------------
 2024-03-29 00:00:00
 2024-03-29 01:00:00
 2024-03-29 02:00:00
 2024-03-29 03:00:00
 2024-03-29 04:00:00
 2024-03-29 05:00:00
 2024-03-29 06:00:00
 2024-03-29 07:00:00
 2024-03-29 08:00:00
 2024-03-29 09:00:00
 2024-03-29 10:00:00
 2024-03-29 11:00:00
 2024-03-29 12:00:00
 2024-03-29 13:00:00
 2024-03-29 14:00:00
 2024-03-29 15:00:00
 2024-03-29 16:00:00
 2024-03-29 17:00:00
 2024-03-29 18:00:00
 2024-03-29 19:00:00
 2024-03-29 20:00:00
 2024-03-29 21:00:00
 2024-03-29 22:00:00
 2024-03-29 23:00:00
(24 rows)
```
Assuming that the time zone is set to UTC. If this is not the case, you can run the following command to set the time zone to UTC:


```sql
SET TIME ZONE 'UTC';
```
The following example creates a time series of timestamps with 1\-day intervals between two consecutive timestamps:


```sql
SELECT * FROM generate_series(
   '2024-11-02 00:00 -04:00'::timestamptz,
   '2024-11-05 00:00 -05:00'::timestamptz,
   '1 day'::interval, 
   'America/New_York'
);
```
Output:


```sql
    generate_series
------------------------
 2024-11-02 04:00:00+00
 2024-11-03 04:00:00+00
 2024-11-04 05:00:00+00
 2024-11-05 05:00:00+00
(4 rows)
```
Please note that daylight saving time (`DST`) ends on Nov 3, 2024\. Notice the `DST` transition between November 3 and November 4\.


## PostgreSQL generate\_series() function examples

Let’s explore some real\-world examples of using the `generate_series()` function.


### 1\) Creating a series of random numbers

The following example uses the `generate_series()` function with the [random()](../postgresql-math-functions/postgresql-random) function to create a series of five random numbers between 100 and 200:


```
SELECT floor(random()* (200-100+ 1) + 100) rand
FROM generate_series(1,5);
```
Output:


```plaintext
 rand
------
  152
  187
  186
  151
  190
(5 rows)
```

### 2\) Generating test data

First, [create a table](postgresql-create-table) called `employees`:


```pgsql
CREATE TABLE employees(
   id INT GENERATED ALWAYS AS IDENTITY,
   name VARCHAR(100) NOT NULL,
   age INT NOT NULL DEFAULT 0 CHECK (age >= 18 and age <=65)
);
```
Second, insert 100 rows into the `employees` table:


```pgsql
INSERT INTO employees(name, age)
SELECT 'employee ' || n  name,
        floor(random()* (65-18+ 1) + 18) age
FROM generate_series(1,100) n
RETURNING *;
```
This query generates 100 rows of mock employees with id, names, and random ages.

Output:


```plaintext
 id  |     name     | age
-----+--------------+-----
   1 | employee 1   |  63
   2 | employee 2   |  47
   3 | employee 3   |  54
   4 | employee 4   |  43
   5 | employee 5   |  62
...
```

### 3\) Creating dates table in data analytics application

In data analytics, you often need to create a `dates` table that contains a series of date values. To generate data for the `dates` table, you can use the `generate_series()` function.

First, create a `dates` table:


```pgsql
CREATE TABLE dates(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    month INT NOT NULL GENERATED ALWAYS AS (EXTRACT(month FROM date)) STORED,
    month_name VARCHAR(20) GENERATED ALWAYS AS (
        CASE EXTRACT(month FROM date)
            WHEN 1 THEN 'January'
            WHEN 2 THEN 'February'
            WHEN 3 THEN 'March'
            WHEN 4 THEN 'April'
            WHEN 5 THEN 'May'
            WHEN 6 THEN 'June'
            WHEN 7 THEN 'July'
            WHEN 8 THEN 'August'
            WHEN 9 THEN 'September'
            WHEN 10 THEN 'October'
            WHEN 11 THEN 'November'
            WHEN 12 THEN 'December'
        END
    ) STORED,
    quarter INT NOT NULL GENERATED ALWAYS AS ((EXTRACT(month FROM date) - 1) / 3 + 1) STORED,
    quarter_name CHAR(2) GENERATED ALWAYS AS (
        CASE 
            WHEN ((EXTRACT(month FROM date) - 1) / 3 + 1) = 1 THEN 'Q1'
            WHEN ((EXTRACT(month FROM date) - 1) / 3 + 1) = 2 THEN 'Q2'
            WHEN ((EXTRACT(month FROM date) - 1) / 3 + 1) = 3 THEN 'Q3'
            ELSE 'Q4'
        END
    ) STORED,
    year INT NOT NULL GENERATED ALWAYS AS (EXTRACT(year FROM date)) STORED
);

```
In the `dates` table, only the `date` column is required whereas other columns are [generated columns](postgresql-generated-columns) whose values are derived from the `date` column.

Second, create a series of dates between `2024-01-01` and `2024-31-12`:


```pgsql
INSERT INTO dates(date)
SELECT * FROM generate_series(
    '2024-01-01'::date, 
    '2024-12-31'::date, 
    '1 day'::interval
)
RETURNING *;
```
Output:


```plaintext
 id  |    date    | month | month_name | quarter | quarter_name | year
-----+------------+-------+------------+---------+--------------+------
   1 | 2024-01-01 |     1 | January    |       1 | Q1           | 2024
   2 | 2024-01-02 |     1 | January    |       1 | Q1           | 2024
   3 | 2024-01-03 |     1 | January    |       1 | Q1           | 2024
   4 | 2024-01-04 |     1 | January    |       1 | Q1           | 2024
...
```

## Summary

* Use the `generate_series()` function to create a series of numbers of timestamps.

