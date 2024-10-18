---
title: 'PostgreSQL EXTRACT() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-extract/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `EXTRACT()` function to extract a field such as a year, month, and day from a date/time value.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL EXTRACT() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `EXTRACT()` function extracts a field from a date/time value. Here's the basic syntax of the `EXTRACT()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
EXTRACT(field FROM source)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The PostgreSQL `EXTRACT()` function requires two arguments:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**1) `field`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The field argument specifies which information you want to extract from the date/time value.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following table illustrates the valid field values:

<!-- /wp:paragraph -->

<!-- wp:table {"className":"responsive"} -->

| Field Value     | TIMESTAMP                                                           | Interval                                    |
| --------------- | ------------------------------------------------------------------- | ------------------------------------------- |
| CENTURY         | The century                                                         | The number of centuries                     |
| DAY             | The day of the month (1-31)                                         | The number of days                          |
| DECADE          | The decade that is the year field divided by 10                     |                                             |
| DOW             | The day of the week (Sunday (0), Monday (1) ... Saturday (6)).      | N/A                                         |
| DOY             | The day of the year (1-365/366)                                     | N/A                                         |
| EPOCH           | The number of seconds since 1970-01-01 00:00:00 UTC                 | The total number of seconds in the interval |
| HOUR            | The hour (0-23)                                                     | The number of hours                         |
| ISODOW          | The day of the week, Monday (1) to Sunday (7)                       | N/A                                         |
| ISOYEAR         | The ISO 8601 week number of year                                    | N/A                                         |
| MICROSECONDS    | The second field, including fractional parts, multiplied by 1000000 | Sames as TIMESTAMP                          |
| MILLENNIUM      | The millennium                                                      | The number of millennium                    |
| MILLISECONDS    | The second field, including fractional parts, multiplied by 1000    | Sames as TIMESTAMP                          |
| MINUTE          | The minute (0-59)                                                   | The number of minutes                       |
| MONTH           | The month 1-12                                                      | The number of months, modulo (0-11)         |
| QUARTER         | The quarter of the year (1 - 4)                                     | The number of quarters                      |
| SECOND          | The second field, including any fractional seconds                  | The number of seconds                       |
| TIMEZONE        | The timezone offset from UTC, measured in seconds                   | N/A                                         |
| TIMEZONE_HOUR   | The hour component of the time zone offset                          | N/A                                         |
| TIMEZONE_MINUTE | The minute component of the time zone offset                        | N/A                                         |
| WEEK            | The number of the ISO 8601 week-numbering week of the year          | N/A                                         |
| YEAR            | The year                                                            | Sames as TIMESTAMP                          |

<!-- /wp:table -->

<!-- wp:paragraph -->

**2) **`source`

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `source` is a value of type `TIMESTAMP` or `INTERVAL`. If you pass a `DATE` value, the function will cast it to a `TIMESTAMP` value.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `EXTRACT()` function returns a double precision value.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL EXTRACT function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `EXTRACT()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL EXTRACT() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the year from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(YEAR FROM TIMESTAMP '2016-12-31 13:30:15') y;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
  y
------
 2016
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the quarter from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(QUARTER FROM TIMESTAMP '2016-12-31 13:30:15') q;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
 q
---
 4
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the month from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(MONTH FROM TIMESTAMP '2016-12-31 13:30:15') m;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
 m
----
 12
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the day from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(DAY FROM TIMESTAMP '2016-12-31 13:30:15') d;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 d
----
 31
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the century from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(CENTURY FROM TIMESTAMP '2016-12-31 13:30:15') century;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
 century
---------
      21
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the decade from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(DECADE FROM TIMESTAMP '2016-12-31 13:30:15') decade;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following is the result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
 decade
--------
    201
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the day of the week from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(DOW FROM TIMESTAMP '2016-12-31 13:30:15') day_of_week;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result is:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
 day_of_week
-------------
           6
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the day of the year from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(DOY FROM TIMESTAMP '2016-12-31 13:30:15') day_of_year;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It returned 366:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
 day_of_year
-------------
         366
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the epoch from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(EPOCH FROM TIMESTAMP '2016-12-31 13:30:15') epoch;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result is:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
       epoch
-------------------
 1483191015.000000
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the hour from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(HOUR FROM TIMESTAMP '2016-12-31 13:30:15') h;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
 h
----
 13
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the minute from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(MINUTE FROM TIMESTAMP '2016-12-31 13:30:15') min;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Here is the result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
 min
-----
  30
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the second from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(SECOND FROM TIMESTAMP '2016-12-31 13:30:15') sec;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result includes second and its fractional seconds:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
    sec
-----------
 15.000000
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the weekday according to ISO 8601:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(ISODOW FROM TIMESTAMP '2016-12-31 13:30:15') weekday_iso;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 weekday_iso
-------------
           6
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the millisecond from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(MILLISECONDS FROM TIMESTAMP '2016-12-31 13:30:15') ms;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result is 15 \* 1000 = 15000

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
    ms
-----------
 15000.000
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the microseconds from a timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT EXTRACT(MICROSECONDS FROM TIMESTAMP '2016-12-31 13:30:15') microsec;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result is 15 \* 1000000 = 15000000

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
 microsec
----------
 15000000
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Extracting from an interval examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the year from an interval:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  EXTRACT(
    YEAR
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  ) y;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
 y
---
 6
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the quarter from an interval:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  EXTRACT(
    QUARTER
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
2
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the month from an interval:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  EXTRACT(
    MONTH
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
5
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the day from an interval:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  EXTRACT(
    DAY
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
4
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the hour from an interval:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  EXTRACT(
    HOUR
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
3
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the minute from an interval:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  EXTRACT(
    MINUTE
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
2
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the second from an interval:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  EXTRACT(
    SECOND
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
1
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the millisecond from an interval:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  EXTRACT(
    MILLISECONDS
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
1000
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the microsecond from an interval:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  EXTRACT(
    MICROSECONDS
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
1000000
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the decade from an interval:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  EXTRACT(
    DECADE
    FROM
      INTERVAL '60 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
60
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the millennium from an interval:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  EXTRACT(
    MILLENNIUM
    FROM
      INTERVAL '1999 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
1
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `EXTRACT()` function to extract the century from an interval:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
  EXTRACT(
    CENTURY
    FROM
      INTERVAL '1999 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
19
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `EXTRACT()` function to extract a field from a date/time or interval value.
- <!-- /wp:list-item -->

<!-- /wp:list -->
