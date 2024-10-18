---
title: 'PostgreSQL TIME Data Type'
redirectFrom: 
            - /docs/postgresql/postgresql-time
ogImage: /postgresqltutorial_data/wp-content-uploads-2017-02-PostgreSQL-TIME-example.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PostgreSQL `TIME` data types and some handy functions to handle time values.



## Introduction to PostgreSQL TIME data type



PostgreSQL provides the `TIME` data type that allows you to store the time data in the database.



Here's the syntax for declaring a column with the `TIME` data type:



```
column_name TIME(precision);
```



In this syntax, the `precision` specifies the fractional seconds precision for the time value, which ranges from 1 to 6.



The `TIME` data type requires 8 bytes and its allowed range is from `00:00:00` to `24:00:00`.



The following illustrates the common formats of the `TIME` values:



```
HH:MI
HH:MI:SS
HHMISS
```



For example:



```
01:02
01:02:03
010203
```



To use a time value with the precision, you can utilize the following formats:



```
MI:SS.pppppp
HH:MI:SS.pppppp
HHMISS.pppppp
```



In this syntax, `p` specifies the precision. For example:



```
04:59.999999
04:05:06.777777
040506.777777
```



PostgreSQL accepts almost any reasonable `TIME` format including SQL-compatible, ISO 8601, and so on.



## PostgreSQL TIME data type example



In practice, you often use the `TIME` data type for the columns that store the time of day only such as the time of an event or a shift. For example:



First, [create a new table](/docs/postgresql/postgresql-create-table) named `shifts` by using the following `CREATE TABLE` statement:



```
CREATE TABLE shifts (
    id serial PRIMARY KEY,
    shift_name VARCHAR NOT NULL,
    start_at TIME NOT NULL,
    end_at TIME NOT NULL
);
```



Second, [insert](/docs/postgresql/postgresql-insert) some rows into the `shifts` table:



```
INSERT INTO shifts(shift_name, start_at, end_at)
VALUES('Morning', '08:00:00', '12:00:00'),
      ('Afternoon', '13:00:00', '17:00:00'),
      ('Night', '18:00:00', '22:00:00');
```



Third, [query](/docs/postgresql/postgresql-select) data from the `shifts` table:



```
SELECT * FROM shifts;
```



Output:



```
 id | shift_name | start_at |  end_at
----+------------+----------+----------
  1 | Morning    | 08:00:00 | 12:00:00
  2 | Afternoon  | 13:00:00 | 17:00:00
  3 | Night      | 18:00:00 | 22:00:00
(3 rows)
```



## PostgreSQL TIME WITH TIME ZONE type



Besides the `TIME` data type, PostgreSQL provides the `TIME WITH TIME ZONE` data type that allows you to store and manipulate the time of day with time zone.



The following statement illustrates how to declare a column whose data type is `TIME WITH TIME ZONE`:



```
column TIME WITH TIME ZONE
```



The storage size of the `TIME WITH TIME ZONE` data type is 12 bytes, allowing you to store a time value with the time zone that ranges from `00:00:00+1459` to `24:00:00-1459`.



The following are some examples of the `TIME WITH TIME ZONE` type:



```
04:05:06 PST
04:05:06.789-8
```



When dealing with timezone, it is recommended to use `TIMESTAMP` instead of the `TIME WITH TIME ZONE` type. This is because the time zone has very little meaning unless it is associated with both date and time.



## Handling PostgreSQL TIME values



Let's explore some functions that handle time values.



### 1) Getting the current time



To get the current time with the time zone, you use the `CURRENT_TIME` function as follows:



```
SELECT CURRENT_TIME;
```



Output:



```
timetz
--------------------
 00:51:02.746572-08
(1 row)
```



To obtain the current time with a specific precision, you use the `CURRENT_TIME(precision)` function:



```
SELECT CURRENT_TIME(5);
```



Output:



```
   current_time
-------------------
 00:52:12.19515-08
(1 row)
```



Notice that without specifying the precision, the `CURRENT_TIME` function returns a time value with the full available precision.



To get the local time, you use the `LOCALTIME` function:



```
SELECT LOCALTIME;
```



Output:



```
      localtime
-----------------
 00:52:40.227186
(1 row)
```



Similarly, to get the local time with a specific precision, you use the `LOCALTIME(precision)` function:



```
SELECT LOCALTIME(0);
```



Output:



```
 localtime
----------
 00:56:08
(1 row)
```



### 2) Converting time to a different time zone



To convert time to a different time zone, you use the following form:



```
[TIME with time zone] AT TIME ZONE time_zone
```



For example, to convert the local time to the time at the time zone UTC-7, you use the following statement:



```
SELECT LOCALTIME AT TIME ZONE 'UTC-7';
```



Output:



```
      timezone
--------------------
 16:02:38.902271+07
(1 row)
```



### 2) Extracting hours, minutes, and seconds from a time value



To extract hours, minutes, and seconds from a time value, you use the `EXTRACT` function as follows:



```
EXTRACT(field FROM time_value);
```



The field can be the hour, minute, second, or milliseconds. For example:



```
SELECT
    LOCALTIME,
    EXTRACT (HOUR FROM LOCALTIME) as hour,
    EXTRACT (MINUTE FROM LOCALTIME) as minute,
    EXTRACT (SECOND FROM LOCALTIME) as second,
    EXTRACT (milliseconds FROM LOCALTIME) as milliseconds;
```



### ![PostgreSQL TIME example](/postgresqltutorial_data/wp-content-uploads-2017-02-PostgreSQL-TIME-example.png "PostgreSQL TIME example")



### 3) Arithmetic operations on time values



PostgreSQL allows you to apply arithmetic operators such as +, -, and \* on time values and between time and [interval](/docs/postgresql/postgresql-interval) values.



The following statement returns an [interval](/docs/postgresql/postgresql-interval) between two times:



```
SELECT time '10:00' - time '02:00' AS result;
```



Output:



```
  result
----------
 08:00:00
(1 row)
```



The following statement adds 2 hours to the local time:



```
SELECT LOCALTIME + interval '2 hours' AS result;
```



Output:



```
    result
-----------------
 03:16:18.020418
(1 row)
```



In this example, the sum of a time value and an interval value is a time value.



## Summary



- Use the PostgreSQL `TIME` data type to store time data.
