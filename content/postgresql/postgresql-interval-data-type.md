---
title: 'PostgreSQL Interval Data Type'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-interval/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PostgreSQL interval data type and how to manipulate interval values.



## Introduction to PostgreSQL interval data type



The interval data type allows you to store and manipulate a period in years, months, days, hours, minutes, and seconds.



The following illustrates the interval type:



```
@ interval [ fields ] [ (p) ]
```



An interval value requires 16 bytes of storage that can store a period with the allowed range from `-178,000,000` years to `178,000,000` years.



Additionally, an interval value can have an optional precision value `p` with the permitted range from 0 to 6. The precision `p` is the number of fraction digits retained in the second field.



The at sign ( `@`) is optional so you can omit it.



The following examples show some interval values:



```
interval '2 months ago';
interval '3 hours 20 minutes';
```



Internally, PostgreSQL stores interval values as months, days, and seconds. The months and days values are integers while the seconds field can have fractions.



The interval values are very useful when doing [date](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-date/) or time arithmetic. For example, if you want to know the time of 3 hours 2 minutes ago at the current time of last year, you can use the following statement:



```
SELECT
	now(),
	now() - INTERVAL '1 year 3 hours 20 minutes'
             AS "3 hours 20 minutes ago of last year";
```



Output:



```
              now              | 3 hours 20 minutes ago of last year
-------------------------------+-------------------------------------
 2024-01-31 21:34:52.242914-05 | 2023-01-31 18:14:52.242914-05
(1 row)
```



Let's see how to format interval values for input and output.



## PostgreSQL interval input format



PostgreSQL provides you with the following verbose syntax to write the interval values:



```
quantity unit [quantity unit...] [direction]
```



- - `quantity` is a number, sign `+` or `-` is also accepted
- -
- - `unit` can be any of millennium, century, decade, year, month, week, day, hour, minute, second, millisecond, microsecond, or abbreviation (y, m, d, etc.,) or plural forms (months, days, etc.).
- -
- - `direction` can be `ago` or empty string `''`
- 


This format is called `postgres_verbose` which is also used for the interval output format. The following examples illustrate some interval values that use the verbose syntax:



```
INTERVAL '1 year 2 months 3 days';
INTERVAL '2 weeks ago';
```



### ISO 8601 interval format



In addition to the verbose syntax, PostgreSQL allows you to write the interval values using `ISO 8601` time intervals in two ways: format with designators and alternative format.



The `ISO 8601` format with designators is like this:



```
P quantity unit [ quantity unit ...] [ T [ quantity unit ...]]
```



In this format, the interval value must start with the letter `P`. The letter `T` is for determining the time-of-day unit.



The following table illustrates the `ISO 8601` interval unit abbreviations:



| Abbreviation | Description                |
| ------------ | -------------------------- |
| Y            | Years                      |
| M            | Months (in the date part)  |
| W            | Weeks                      |
| D            | Days                       |
| H            | Hours                      |
| M            | Minutes (in the time part) |
| S            | Seconds                    |



Note that `M` can be months or minutes depending on whether it appears before or after the letter `T`.



For example, the interval of 6 years 5 months 4 days 3 hours 2 minutes 1 second can be written in the ISO 8601 designators format as follows:



```
P6Y5M4DT3H2M1S
```



The alternative form of `ISO 8601` is:



```
P [ years-months-days ] [ T hours:minutes:seconds ]
```



It must start with the letter `P`, and the letter `T` separates the date and time parts of the interval value.



For example, the interval of `6 years 5 months 4 days 3 hours 2 minutes 1 second` can be written in the `ISO 8601` alternative form as:



```
P0006-05-04T03:02:01
```



## PostgreSQL interval output format



The output style of interval values is set by using the `SET intervalstyle` command, for example:



```
SET intervalstyle = 'sql_standard';
```



PostgreSQL provides four output formats:



- - `sql standard`
- -
- - `postgres`
- -
- - `postgresverbose`
- -
- - `iso_8601`
- 


PostgreSQL uses the `postgres` style by default for formatting the interval values.



The following represents the interval of `6 years 5 months 4 days 3 hours 2 minutes 1 second` in the four styles:



```
SET intervalstyle = 'sql_standard';
SELECT
  INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second';

SET intervalstyle = 'postgres';
SELECT
  INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second';

SET intervalstyle = 'postgres_verbose';
SELECT
  INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second';

SET intervalstyle = 'iso_8601';
SELECT
  INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second';
```



| sql standard       | postgres                         | postgres verbose                               | iso_8601         |
| ------------------ | -------------------------------- | ---------------------------------------------- | ---------------- |
| `+6-5 +4 +3:02:01` | `6 years 5 mons 4 days 03:02:01` | `@ 6 years 5 mons 4 days 3 hours 2 mins 1 sec` | `P6Y5M4DT3H2M1S` |



## PostgreSQL interval-related operators and functions



### Interval operators



You can apply the arithmetic operator ( `+`, `-`, `*`, etc.,) to the interval values, for example:



```
SELECT INTERVAL '2h 50m' + INTERVAL '10m'; -- 03:00:00
SELECT INTERVAL '2h 50m' - INTERVAL '50m'; -- 02:00:00
SELECT 600 * INTERVAL '1 minute'; -- 10:00:00
```



### Converting PostgreSQL interval to string



To convert an interval value to a string, you use the `TO_CHAR()` function.



```
TO_CHAR(interval,format)
```



The `TO_CHAR()` function takes the first argument as an interval value, the second one as the format, and returns a string that represents the interval in the specified format.



See the following example:



```
SELECT
    TO_CHAR(
        INTERVAL '17h 20m 05s',
        'HH24:MI:SS'
    );
```



Output:



```
 to_char
----------
 17:20:05
(1 row)
```



### Extracting data from a PostgreSQL interval



To extract fields such as year, month, date, etc., from an interval, you use the `EXTRACT()` function.



```
EXTRACT(field FROM interval)
```



The field can be the year, month, date, hour, minutes, etc., that you want to extract from the interval. The extract function returns a value of type double precision.



See the following example:



```
SELECT
    EXTRACT (
        MINUTE
        FROM
            INTERVAL '5 hours 21 minutes'
    );
```



In this example, we extracted the minute from the interval of `5 hours 21 minutes` and it returned `21` as expected:



```
 date_part
-----------
        21
(1 row)
```



### Adjusting interval values



PostgreSQL provides two functions `justifydays` and `justifyhours` that allows you to adjust the interval of 30-day as one month and the interval of 24 hours as one day:



```
SELECT
    justify_days(INTERVAL '30 days'),
    justify_hours(INTERVAL '24 hours');
```



```
 justify_days | justify_hours
--------------+---------------
 1 mon        | 1 day
(1 row)
```



In addition, the `justify_interval` function adjusts interval using `justifydays` and `justifyhours` with additional sign adjustments:



```
SELECT
    justify_interval(interval '1 year -1 hour');
```



```
     justify_interval
--------------------------
 11 mons 29 days 23:00:00
(1 row)
```



## Using interval type in a table



First, create a table called `event` that has three columns `id`, `event_name`, and `duration`. The duration column is `interval` type:



```
CREATE TABLE event (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    duration INTERVAL NOT NULL
);
```



Second, insert some rows into the `event` table:



```
INSERT INTO event (event_name, duration)
VALUES
    ('pgConf', '1 hour 30 minutes'),
    ('pgDAY', '2 days 5 hours')
RETURNING *;
```



Output:



```
 id | event_name | duration
----+------------+----------
  1 | pgConf     | PT1H30M
  2 | pgDAY      | P2DT5H
(2 rows)


INSERT 0 2
```



Third, extract components (days, hours, minutes) from values in the `interval` column:



```
SELECT
    event_name,
    duration,
    EXTRACT(DAY FROM duration) AS days,
    EXTRACT(HOUR FROM duration) AS hours,
    EXTRACT(MINUTE FROM duration) AS minutes
FROM event;
```



Output:



```
 event_name | duration | days | hours | minutes
------------+----------+------+-------+---------
 pgConf     | PT1H30M  |    0 |     1 |      30
 pgDAY      | P2DT5H   |    2 |     5 |       0
(2 rows)
```



Fourth, retrieve the events with a duration longer than one day:



```
SELECT *
FROM event
WHERE duration > INTERVAL '1 day';
```



Output:



```
 id | event_name | duration
----+------------+----------
  2 | pgDAY      | P2DT5H
(1 row)
```



Finally, calculate the total duration for all events:



```
SELECT
    SUM(duration) AS total_duration
FROM event
;
```



Output:



```
 total_duration
----------------
 P2DT6H30M
(1 row)
```



To make the output more clear, you can extract components of the total duration using a common table expression (CTE):



```
WITH cte AS(
   SELECT SUM(duration) AS total_duration
   FROM event
)
SELECT
    total_duration,
    EXTRACT(DAY FROM total_duration ) AS days,
    EXTRACT(HOUR FROM total_duration ) AS hours,
    EXTRACT(MINUTE FROM total_duration ) AS minutes
FROM cte;
```



Output:



```
 total_duration | days | hours | minutes
----------------+------+-------+---------
 P2DT6H30M      |    2 |     6 |      30
(1 row)
```



In this tutorial, you have learned about the PostgreSQL interval data type and how to manipulate interval values.

