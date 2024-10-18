---
title: 'PostgreSQL EXTRACT() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-date-functions/postgresql-extract/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `EXTRACT()` function to extract a field such as a year, month, and day from a date/time value.





## Introduction to PostgreSQL EXTRACT() function





The `EXTRACT()` function extracts a field from a date/time value. Here's the basic syntax of the `EXTRACT()` function:





```
EXTRACT(field FROM source)
```





The PostgreSQL `EXTRACT()` function requires two arguments:





**1) `field`**





The field argument specifies which information you want to extract from the date/time value.





The following table illustrates the valid field values:





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





**2) **`source`





The `source` is a value of type `TIMESTAMP` or `INTERVAL`. If you pass a `DATE` value, the function will cast it to a `TIMESTAMP` value.





The `EXTRACT()` function returns a double precision value.





## PostgreSQL EXTRACT function examples





Let's explore some examples of using the `EXTRACT()` function.





### 1) Basic PostgreSQL EXTRACT() function examples





The following example uses the `EXTRACT()` function to extract the year from a timestamp:





```
SELECT EXTRACT(YEAR FROM TIMESTAMP '2016-12-31 13:30:15') y;
```





Output:





```
  y
------
 2016
(1 row)
```





The following example uses the `EXTRACT()` function to extract the quarter from a timestamp:





```
SELECT EXTRACT(QUARTER FROM TIMESTAMP '2016-12-31 13:30:15') q;
```





Output:





```
 q
---
 4
(1 row)
```





The following example uses the `EXTRACT()` function to extract the month from a timestamp:





```
SELECT EXTRACT(MONTH FROM TIMESTAMP '2016-12-31 13:30:15') m;
```





Output:





```
 m
----
 12
(1 row)
```





The following example uses the `EXTRACT()` function to extract the day from a timestamp:





```
SELECT EXTRACT(DAY FROM TIMESTAMP '2016-12-31 13:30:15') d;
```





Output:





```
 d
----
 31
(1 row)
```





The following example uses the `EXTRACT()` function to extract the century from a timestamp:





```
SELECT EXTRACT(CENTURY FROM TIMESTAMP '2016-12-31 13:30:15') century;
```





Output:





```
 century
---------
      21
(1 row)
```





The following example uses the `EXTRACT()` function to extract the decade from a timestamp:





```
SELECT EXTRACT(DECADE FROM TIMESTAMP '2016-12-31 13:30:15') decade;
```





The following is the result:





```
 decade
--------
    201
(1 row)
```





The following example uses the `EXTRACT()` function to extract the day of the week from a timestamp:





```
SELECT EXTRACT(DOW FROM TIMESTAMP '2016-12-31 13:30:15') day_of_week;
```





The result is:





```
 day_of_week
-------------
           6
(1 row)
```





The following example uses the `EXTRACT()` function to extract the day of the year from a timestamp:





```
SELECT EXTRACT(DOY FROM TIMESTAMP '2016-12-31 13:30:15') day_of_year;
```





It returned 366:





```
 day_of_year
-------------
         366
(1 row)
```





The following example uses the `EXTRACT()` function to extract the epoch from a timestamp:





```
SELECT EXTRACT(EPOCH FROM TIMESTAMP '2016-12-31 13:30:15') epoch;
```





The result is:





```
       epoch
-------------------
 1483191015.000000
(1 row)
```





The following example uses the `EXTRACT()` function to extract the hour from a timestamp:





```
SELECT EXTRACT(HOUR FROM TIMESTAMP '2016-12-31 13:30:15') h;
```





Result:





```
 h
----
 13
(1 row)
```





The following example uses the `EXTRACT()` function to extract the minute from a timestamp:





```
SELECT EXTRACT(MINUTE FROM TIMESTAMP '2016-12-31 13:30:15') min;
```





Here is the result:





```
 min
-----
  30
(1 row)
```





The following example uses the `EXTRACT()` function to extract the second from a timestamp:





```
SELECT EXTRACT(SECOND FROM TIMESTAMP '2016-12-31 13:30:15') sec;
```





The result includes second and its fractional seconds:





```
    sec
-----------
 15.000000
(1 row)
```





The following example uses the `EXTRACT()` function to extract the weekday according to ISO 8601:





```
SELECT EXTRACT(ISODOW FROM TIMESTAMP '2016-12-31 13:30:15') weekday_iso;
```





Output:





```
 weekday_iso
-------------
           6
(1 row)
```





The following example uses the `EXTRACT()` function to extract the millisecond from a timestamp:





```
SELECT EXTRACT(MILLISECONDS FROM TIMESTAMP '2016-12-31 13:30:15') ms;
```





The result is 15 \* 1000 = 15000





```
    ms
-----------
 15000.000
(1 row)
```





The following example uses the `EXTRACT()` function to extract the microseconds from a timestamp:





```
SELECT EXTRACT(MICROSECONDS FROM TIMESTAMP '2016-12-31 13:30:15') microsec;
```





The result is 15 \* 1000000 = 15000000





```
 microsec
----------
 15000000
(1 row)
```





### 2) Extracting from an interval examples





The following example uses the `EXTRACT()` function to extract the year from an interval:





```
SELECT
  EXTRACT(
    YEAR
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  ) y;
```





Result:





```
 y
---
 6
(1 row)
```





The following example uses the `EXTRACT()` function to extract the quarter from an interval:





```
SELECT
  EXTRACT(
    QUARTER
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```





Result:





```
2
```





The following example uses the `EXTRACT()` function to extract the month from an interval:





```
SELECT
  EXTRACT(
    MONTH
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```





Result:





```
5
```





The following example uses the `EXTRACT()` function to extract the day from an interval:





```
SELECT
  EXTRACT(
    DAY
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```





Result:





```
4
```





The following example uses the `EXTRACT()` function to extract the hour from an interval:





```
SELECT
  EXTRACT(
    HOUR
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```





Result:





```
3
```





The following example uses the `EXTRACT()` function to extract the minute from an interval:





```
SELECT
  EXTRACT(
    MINUTE
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```





Result:





```
2
```





The following example uses the `EXTRACT()` function to extract the second from an interval:





```
SELECT
  EXTRACT(
    SECOND
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```





Result:





```
1
```





The following example uses the `EXTRACT()` function to extract the millisecond from an interval:





```
SELECT
  EXTRACT(
    MILLISECONDS
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```





Result:





```
1000
```





The following example uses the `EXTRACT()` function to extract the microsecond from an interval:





```
SELECT
  EXTRACT(
    MICROSECONDS
    FROM
      INTERVAL '6 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```





Result:





```
1000000
```





The following example uses the `EXTRACT()` function to extract the decade from an interval:





```
SELECT
  EXTRACT(
    DECADE
    FROM
      INTERVAL '60 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```





Result:





```
60
```





The following example uses the `EXTRACT()` function to extract the millennium from an interval:





```
SELECT
  EXTRACT(
    MILLENNIUM
    FROM
      INTERVAL '1999 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```





Result:





```
1
```





The following example uses the `EXTRACT()` function to extract the century from an interval:





```
SELECT
  EXTRACT(
    CENTURY
    FROM
      INTERVAL '1999 years 5 months 4 days 3 hours 2 minutes 1 second'
  );
```





Result:





```
19
```





## Summary





- 
- Use the PostgreSQL `EXTRACT()` function to extract a field from a date/time or interval value.
- 

